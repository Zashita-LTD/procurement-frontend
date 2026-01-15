/**
 * AgentFAB - Floating Action Button for Agent Chat
 * Opens Drawer on mobile, Popover on desktop
 */

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { MessageCircle, X, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AgentChatWindow } from './AgentChatWindow'
import type { AgentContext } from '../types'
import type { Product } from '@/types'

// Check if mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  
  return isMobile
}

export interface AgentFABProps {
  context?: AgentContext
  onBuyProduct?: (product: Product) => void
  onPayInvoice?: (invoiceId: string) => void
  position?: 'bottom-right' | 'bottom-left'
  unreadCount?: number
}

export function AgentFAB({
  context,
  onBuyProduct,
  onPayInvoice,
  position = 'bottom-right',
  unreadCount = 0,
}: AgentFABProps) {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useIsMobile()

  // Lock body scroll when drawer is open on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [isMobile, isOpen])

  const positionClasses = {
    'bottom-right': 'right-4 md:right-6',
    'bottom-left': 'left-4 md:left-6',
  }

  const chatPosition = {
    'bottom-right': 'right-4 md:right-6',
    'bottom-left': 'left-4 md:left-6',
  }

  return (
    <>
      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-4 md:bottom-6 z-50',
          'w-14 h-14 rounded-full',
          'bg-gradient-to-br from-blue-500 to-purple-600',
          'shadow-lg hover:shadow-xl',
          'flex items-center justify-center',
          'transition-all duration-300',
          'hover:scale-105 active:scale-95',
          positionClasses[position],
          isOpen && 'rotate-90'
        )}
        aria-label={isOpen ? 'Закрыть чат' : 'Открыть чат с AI-помощником'}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 text-white" />
            {/* Sparkle animation */}
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse" />
          </>
        )}
        
        {/* Unread badge */}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && createPortal(
        <>
          {/* Backdrop (mobile) */}
          {isMobile && (
            <div
              className="fixed inset-0 bg-black/50 z-40 animate-fadeIn"
              onClick={() => setIsOpen(false)}
            />
          )}

          {/* Chat Container */}
          <div
            className={cn(
              'fixed z-50',
              isMobile
                ? 'inset-x-0 bottom-0 h-[85vh] animate-slideUp'
                : cn(
                    'bottom-24 w-[400px] h-[600px] animate-scaleIn',
                    chatPosition[position]
                  )
            )}
          >
            <AgentChatWindow
              className={cn(
                'w-full h-full',
                isMobile && 'rounded-b-none rounded-t-2xl'
              )}
              context={context}
              onClose={() => setIsOpen(false)}
              onBuyProduct={onBuyProduct}
              onPayInvoice={onPayInvoice}
            />
          </div>
        </>,
        document.body
      )}

      {/* Animation styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.9) translateY(10px);
          }
          to { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </>
  )
}

export default AgentFAB
