/**
 * useChat Hook
 * SSE-based streaming chat with the AI Agent
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import type {
  ChatMessage,
  ChatState,
  AgentContext,
  AgentStreamEvent,
  MessageContent,
  Widget,
} from '../types'

const API_URL = import.meta.env.VITE_AGENT_API_URL || '/api/v1/agent'

function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export interface UseChatOptions {
  onMessage?: (message: ChatMessage) => void
  onError?: (error: string) => void
  onStreamStart?: () => void
  onStreamEnd?: () => void
  maxHistory?: number
}

export interface UseChatReturn {
  messages: ChatMessage[]
  isLoading: boolean
  isStreaming: boolean
  error: string | null
  sendMessage: (text: string, context?: AgentContext) => Promise<void>
  clearMessages: () => void
  retryLastMessage: () => Promise<void>
  stopStreaming: () => void
}

export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const {
    onMessage,
    onError,
    onStreamStart,
    onStreamEnd,
    maxHistory = 50,
  } = options

  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    isStreaming: false,
    error: null,
  })

  const abortControllerRef = useRef<AbortController | null>(null)
  const lastUserMessageRef = useRef<string>('')
  const lastContextRef = useRef<AgentContext | undefined>()

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  const addMessage = useCallback((message: ChatMessage) => {
    setState(prev => ({
      ...prev,
      messages: [...prev.messages.slice(-maxHistory + 1), message],
    }))
    onMessage?.(message)
  }, [maxHistory, onMessage])

  const updateLastAgentMessage = useCallback((
    updater: (content: MessageContent[]) => MessageContent[]
  ) => {
    setState(prev => {
      const messages = [...prev.messages]
      const lastIndex = messages.length - 1
      
      if (lastIndex >= 0 && messages[lastIndex].role === 'agent') {
        messages[lastIndex] = {
          ...messages[lastIndex],
          content: updater(messages[lastIndex].content),
        }
      }
      
      return { ...prev, messages }
    })
  }, [])

  const sendMessage = useCallback(async (
    text: string,
    context?: AgentContext
  ) => {
    if (!text.trim() || state.isLoading) return

    // Save for retry
    lastUserMessageRef.current = text
    lastContextRef.current = context

    // Abort previous request
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()

    // Add user message
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: [{ type: 'text', text }],
      timestamp: new Date(),
    }
    addMessage(userMessage)

    // Prepare agent message placeholder
    const agentMessage: ChatMessage = {
      id: generateId(),
      role: 'agent',
      content: [],
      timestamp: new Date(),
      isStreaming: true,
    }
    addMessage(agentMessage)

    setState(prev => ({
      ...prev,
      isLoading: true,
      isStreaming: true,
      error: null,
    }))
    onStreamStart?.()

    try {
      // Build history for context
      const history = state.messages
        .filter(m => m.role !== 'system')
        .slice(-10)
        .map(m => ({
          role: m.role as 'user' | 'agent',
          content: m.content
            .filter(c => c.type === 'text')
            .map(c => c.text)
            .join('\n'),
        }))

      // Make SSE request
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          message: text,
          context,
          history,
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      const decoder = new TextDecoder()
      let buffer = ''
      let currentTextContent = ''

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            
            if (data === '[DONE]') {
              break
            }

            try {
              const event: AgentStreamEvent = JSON.parse(data)
              
              switch (event.type) {
                case 'text':
                  // Append text character by character
                  currentTextContent += event.data || ''
                  updateLastAgentMessage(content => {
                    const textIndex = content.findIndex(c => c.type === 'text')
                    if (textIndex >= 0) {
                      const newContent = [...content]
                      newContent[textIndex] = { type: 'text', text: currentTextContent }
                      return newContent
                    }
                    return [...content, { type: 'text', text: currentTextContent }]
                  })
                  break

                case 'widget':
                  // Add widget to message
                  if (event.widget) {
                    updateLastAgentMessage(content => [
                      ...content,
                      { type: 'widget', widget: event.widget as Widget }
                    ])
                  }
                  break

                case 'error':
                  throw new Error(event.error || 'Unknown error')

                case 'done':
                  break
              }
            } catch (e) {
              // Ignore JSON parse errors for partial data
              if (e instanceof SyntaxError) continue
              throw e
            }
          }
        }
      }

      // Mark streaming as complete
      setState(prev => {
        const messages = [...prev.messages]
        const lastIndex = messages.length - 1
        if (lastIndex >= 0) {
          messages[lastIndex] = {
            ...messages[lastIndex],
            isStreaming: false,
          }
        }
        return {
          ...prev,
          messages,
          isLoading: false,
          isStreaming: false,
        }
      })

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Request was cancelled
        return
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        isStreaming: false,
        error: errorMessage,
      }))

      // Update agent message with error
      updateLastAgentMessage(() => [{
        type: 'text',
        text: `❌ Ошибка: ${errorMessage}`,
      }])

      onError?.(errorMessage)
    } finally {
      onStreamEnd?.()
    }
  }, [state.messages, state.isLoading, addMessage, updateLastAgentMessage, onStreamStart, onStreamEnd, onError])

  const clearMessages = useCallback(() => {
    setState({
      messages: [],
      isLoading: false,
      isStreaming: false,
      error: null,
    })
  }, [])

  const retryLastMessage = useCallback(async () => {
    if (lastUserMessageRef.current) {
      // Remove last agent message
      setState(prev => ({
        ...prev,
        messages: prev.messages.slice(0, -1),
      }))
      await sendMessage(lastUserMessageRef.current, lastContextRef.current)
    }
  }, [sendMessage])

  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort()
    setState(prev => ({
      ...prev,
      isLoading: false,
      isStreaming: false,
    }))
  }, [])

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    isStreaming: state.isStreaming,
    error: state.error,
    sendMessage,
    clearMessages,
    retryLastMessage,
    stopStreaming,
  }
}
