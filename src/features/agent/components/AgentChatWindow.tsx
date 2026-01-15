/**
 * AgentChatWindow Component
 * Main chat interface with the AI Agent
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { 
  Send, 
  Mic, 
  MicOff,
  X, 
  Trash2, 
  RefreshCw,
  StopCircle,
  Sparkles,
  Volume2,
  VolumeX,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useChat } from '../hooks/useChat'
import { useVoice } from '../hooks/useVoice'
import { MessageBubble } from './MessageBubble'
import type { AgentContext } from '../types'
import type { Product } from '@/types'

// Quick action suggestions
const QUICK_ACTIONS = [
  { label: '🔍 Найти товар', prompt: 'Помоги найти ' },
  { label: '💰 Сравнить цены', prompt: 'Сравни цены на ' },
  { label: '📦 Статус заказа', prompt: 'Покажи статус заказа ' },
  { label: '🧾 Мои счета', prompt: 'Покажи неоплаченные счета' },
]

export interface AgentChatWindowProps {
  className?: string
  context?: AgentContext
  onClose?: () => void
  onBuyProduct?: (product: Product) => void
  onPayInvoice?: (invoiceId: string) => void
}

export function AgentChatWindow({
  className,
  context,
  onClose,
  onBuyProduct,
  onPayInvoice,
}: AgentChatWindowProps) {
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    messages,
    isLoading,
    isStreaming,
    error,
    sendMessage,
    clearMessages,
    retryLastMessage,
    stopStreaming,
  } = useChat({
    onStreamStart: () => {
      // Scroll to bottom when streaming starts
      scrollToBottom()
    },
    onStreamEnd: () => {
      // Focus input after response
      inputRef.current?.focus()
    },
  })

  // Voice chat hook
  const {
    isRecording,
    isProcessing,
    isPlaying,
    startRecording,
    stopRecording,
    cancelRecording,
    stopAudio,
  } = useVoice({
    onTranscript: (text) => {
      // Add user voice message
      setInputValue(text)
    },
    onResponse: (text) => {
      // Response is handled by voice hook with auto-play
      sendMessage(text, context)
    },
    onError: (error) => {
      console.error('Voice error:', error)
    },
    autoPlay: true,
  })

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Handle send
  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return
    
    const message = inputValue
    setInputValue('')
    await sendMessage(message, context)
  }

  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Quick action click
  const handleQuickAction = (prompt: string) => {
    setInputValue(prompt)
    inputRef.current?.focus()
  }

  // Voice recording - hold to talk
  const handleMicMouseDown = async () => {
    if (isProcessing || isPlaying) return
    await startRecording()
  }

  const handleMicMouseUp = async () => {
    if (!isRecording) return
    const result = await stopRecording()
    if (result?.transcript) {
      // Voice message will be added via onTranscript callback
    }
  }

  const handleMicClick = () => {
    if (isRecording) {
      cancelRecording()
    } else if (isPlaying) {
      stopAudio()
    }
  }

  return (
    <div className={cn(
      'flex flex-col h-full bg-white rounded-lg shadow-xl overflow-hidden',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">AI Помощник</h3>
            <p className="text-xs text-white/70">
              {isStreaming ? 'Печатает...' : 'Всегда на связи'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={clearMessages}
              title="Очистить чат"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-blue-500" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">
              Привет! Я AI-помощник
            </h4>
            <p className="text-sm text-gray-500 mb-6 max-w-[250px]">
              Помогу найти товары, сравнить цены и оформить заказ. Просто спросите!
            </p>
            
            {/* Quick actions */}
            <div className="flex flex-wrap gap-2 justify-center">
              {QUICK_ACTIONS.map(action => (
                <button
                  key={action.label}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  onClick={() => handleQuickAction(action.prompt)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map(message => (
              <MessageBubble
                key={message.id}
                message={message}
                showTimestamp
                onBuyProduct={onBuyProduct}
                onPayInvoice={onPayInvoice}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-100 flex items-center justify-between">
          <span className="text-sm text-red-600">{error}</span>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600"
            onClick={retryLastMessage}
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Повторить
          </Button>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center gap-2">
          {/* Mic button - hold to talk */}
          <Button
            variant={isRecording ? 'destructive' : isProcessing ? 'secondary' : 'outline'}
            size="icon"
            onMouseDown={handleMicMouseDown}
            onMouseUp={handleMicMouseUp}
            onMouseLeave={handleMicMouseUp}
            onTouchStart={handleMicMouseDown}
            onTouchEnd={handleMicMouseUp}
            onClick={handleMicClick}
            className={cn(
              "flex-shrink-0 transition-all",
              isRecording && "animate-pulse scale-110"
            )}
            title={isRecording ? 'Отпустите для отправки' : isProcessing ? 'Обработка...' : 'Удерживайте для записи'}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isRecording ? (
              <MicOff className="w-4 h-4" />
            ) : isPlaying ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </Button>

          {/* Text input */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isRecording ? '🎤 Говорите...' : isProcessing ? '⏳ Обработка...' : 'Напишите сообщение...'}
              disabled={isRecording || isProcessing}
              className={cn(
                'w-full px-4 py-2 rounded-full border bg-white',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                'disabled:bg-gray-100 disabled:cursor-not-allowed',
                isRecording && 'border-red-300 bg-red-50'
              )}
            />
          </div>

          {/* Send/Stop button */}
          {isStreaming ? (
            <Button
              variant="destructive"
              size="icon"
              onClick={stopStreaming}
              className="flex-shrink-0"
              title="Остановить"
            >
              <StopCircle className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="flex-shrink-0"
              title="Отправить"
            >
              <Send className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AgentChatWindow
