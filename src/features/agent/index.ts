/**
 * Agent Feature - Exports
 */

// Types
export * from './types'

// Hooks
export { useChat } from './hooks/useChat'
export { useVoice } from './hooks/useVoice'

// Components
export { AgentChatWindow } from './components/AgentChatWindow'
export { AgentFAB } from './components/AgentFAB'
export { MessageBubble } from './components/MessageBubble'
export { 
  WidgetRenderer,
  ChatProductCard,
  ChatProductList,
  ChatInvoicePreview,
  ChatOrderStatus,
  ChatSupplierCard,
  ChatPriceComparison,
  ChatDeliveryTracker,
} from './components/ChatWidgets'
