/**
 * Agent Chat Types
 * Типы для Generative AI Chat с поддержкой Dynamic Widgets
 */

import type { Product } from '@/types'

// Роли в чате
export type MessageRole = 'user' | 'agent' | 'system'

// Типы виджетов, которые агент может рендерить
export type WidgetType = 
  | 'product_card' 
  | 'product_list'
  | 'invoice_preview' 
  | 'order_status'
  | 'supplier_card'
  | 'price_comparison'
  | 'delivery_tracker'

// Базовый виджет
export interface BaseWidget {
  type: WidgetType
  id: string
}

// Виджет карточки товара
export interface ProductCardWidget extends BaseWidget {
  type: 'product_card'
  product: Product
  actions?: ('buy' | 'compare' | 'favorite')[]
}

// Виджет списка товаров
export interface ProductListWidget extends BaseWidget {
  type: 'product_list'
  products: Product[]
  title?: string
  showCompare?: boolean
}

// Виджет превью счёта
export interface InvoicePreviewWidget extends BaseWidget {
  type: 'invoice_preview'
  invoice: {
    id: string
    number: string
    supplier: string
    items: {
      name: string
      quantity: number
      price: number
      unit: string
    }[]
    total: number
    currency: string
    dueDate?: string
    status: 'draft' | 'pending' | 'paid' | 'overdue'
  }
  actions?: ('pay' | 'download' | 'edit')[]
}

// Виджет статуса заказа
export interface OrderStatusWidget extends BaseWidget {
  type: 'order_status'
  order: {
    id: string
    number: string
    status: 'created' | 'confirmed' | 'processing' | 'shipped' | 'delivered'
    items: number
    total: number
    estimatedDelivery?: string
    trackingUrl?: string
  }
}

// Виджет карточки поставщика
export interface SupplierCardWidget extends BaseWidget {
  type: 'supplier_card'
  supplier: {
    id: string
    name: string
    logo?: string
    rating: number
    reviewsCount: number
    deliveryTime: string
    minOrder?: number
    categories: string[]
  }
  actions?: ('contact' | 'catalog' | 'favorite')[]
}

// Виджет сравнения цен
export interface PriceComparisonWidget extends BaseWidget {
  type: 'price_comparison'
  product: {
    name: string
    sku: string
  }
  offers: {
    supplier: string
    price: number
    currency: string
    inStock: boolean
    deliveryDays: number
  }[]
}

// Виджет отслеживания доставки
export interface DeliveryTrackerWidget extends BaseWidget {
  type: 'delivery_tracker'
  delivery: {
    orderId: string
    carrier: string
    trackingNumber: string
    status: 'preparing' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered'
    steps: {
      title: string
      timestamp?: string
      completed: boolean
    }[]
  }
}

// Union тип всех виджетов
export type Widget = 
  | ProductCardWidget 
  | ProductListWidget
  | InvoicePreviewWidget 
  | OrderStatusWidget
  | SupplierCardWidget
  | PriceComparisonWidget
  | DeliveryTrackerWidget

// Контент сообщения (текст или виджет)
export interface MessageContent {
  type: 'text' | 'widget'
  text?: string
  widget?: Widget
}

// Сообщение в чате
export interface ChatMessage {
  id: string
  role: MessageRole
  content: MessageContent[]
  timestamp: Date
  isStreaming?: boolean
}

// Состояние чата
export interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean
  isStreaming: boolean
  error: string | null
}

// Контекст страницы для агента
export interface AgentContext {
  currentPage: string
  selectedProducts?: string[]
  cartItems?: string[]
  searchQuery?: string
  filters?: Record<string, unknown>
}

// Запрос к агенту
export interface AgentChatRequest {
  message: string
  context?: AgentContext
  history?: {
    role: MessageRole
    content: string
  }[]
}

// SSE Event от агента
export interface AgentStreamEvent {
  type: 'text' | 'widget' | 'done' | 'error'
  data?: string
  widget?: Widget
  error?: string
}

// Конфигурация чата
export interface ChatConfig {
  apiUrl: string
  maxHistory: number
  enableVoice: boolean
  autoScroll: boolean
  showTimestamps: boolean
}
