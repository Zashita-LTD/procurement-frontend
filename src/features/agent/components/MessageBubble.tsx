/**
 * MessageBubble Component
 * Renders individual chat messages with text and widgets
 */

import { memo, useMemo } from 'react'
import { User, Bot } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ChatMessage } from '../types'
import { WidgetRenderer, type WidgetRendererProps } from './ChatWidgets'

// Simple Markdown renderer (можно заменить на react-markdown)
function SimpleMarkdown({ text }: { text: string }) {
  const html = useMemo(() => {
    let result = text
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Code
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 underline" target="_blank">$1</a>')
      // Lists
      .replace(/^- (.+)$/gm, '<li class="ml-4">• $1</li>')
      // Line breaks
      .replace(/\n/g, '<br/>')
    
    return result
  }, [text])

  return (
    <div 
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

// Typing indicator animation
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-2">
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  )
}

// Streaming text with cursor
function StreamingText({ text }: { text: string }) {
  return (
    <div className="relative">
      <SimpleMarkdown text={text} />
      <span className="inline-block w-2 h-4 bg-blue-500 ml-0.5 animate-pulse" />
    </div>
  )
}

export interface MessageBubbleProps extends Omit<WidgetRendererProps, 'widget'> {
  message: ChatMessage
  showTimestamp?: boolean
}

export const MessageBubble = memo(function MessageBubble({
  message,
  showTimestamp = false,
  onBuyProduct,
  onPayInvoice,
  onDownloadInvoice,
  onContactSupplier,
  onViewCatalog,
}: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const isEmpty = message.content.length === 0

  return (
    <div
      className={cn(
        'flex gap-2 mb-4',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
          isUser ? 'bg-blue-500' : 'bg-gradient-to-br from-purple-500 to-blue-500'
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Content */}
      <div
        className={cn(
          'flex flex-col max-w-[80%]',
          isUser ? 'items-end' : 'items-start'
        )}
      >
        {/* Message bubble */}
        <div
          className={cn(
            'rounded-2xl px-4 py-2',
            isUser
              ? 'bg-blue-500 text-white rounded-br-md'
              : 'bg-gray-100 text-gray-900 rounded-bl-md'
          )}
        >
          {isEmpty && message.isStreaming ? (
            <TypingIndicator />
          ) : (
            <div className="space-y-3">
              {message.content.map((content, idx) => (
                <div key={idx}>
                  {content.type === 'text' && content.text && (
                    message.isStreaming && idx === message.content.length - 1 ? (
                      <StreamingText text={content.text} />
                    ) : (
                      <SimpleMarkdown text={content.text} />
                    )
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Widgets (outside bubble) */}
        {message.content
          .filter(c => c.type === 'widget' && c.widget)
          .map((content, idx) => (
            <div key={`widget-${idx}`} className="mt-2">
              <WidgetRenderer
                widget={content.widget!}
                onBuyProduct={onBuyProduct}
                onPayInvoice={onPayInvoice}
                onDownloadInvoice={onDownloadInvoice}
                onContactSupplier={onContactSupplier}
                onViewCatalog={onViewCatalog}
              />
            </div>
          ))
        }

        {/* Timestamp */}
        {showTimestamp && (
          <span className="text-xs text-gray-400 mt-1">
            {message.timestamp.toLocaleTimeString('ru-RU', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        )}
      </div>
    </div>
  )
})

export default MessageBubble
