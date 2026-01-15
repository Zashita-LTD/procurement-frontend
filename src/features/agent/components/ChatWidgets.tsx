/**
 * Dynamic Chat Widgets
 * Компоненты для рендеринга виджетов внутри чата
 */

import { 
  ShoppingCart, 
  Download, 
  CreditCard, 
  ExternalLink,
  Star,
  Phone,
  Package,
  Truck,
  Check,
  Clock,
  MapPin,
  TrendingDown,
  Heart,
  GitCompare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import type { 
  Widget, 
  ProductCardWidget, 
  ProductListWidget,
  InvoicePreviewWidget,
  OrderStatusWidget,
  SupplierCardWidget,
  PriceComparisonWidget,
  DeliveryTrackerWidget
} from '../types'
import type { Product } from '@/types'

// Mini ProductCard для чата
function ChatProductCard({ 
  product, 
  actions = ['buy'],
  onBuy,
  onCompare,
  onFavorite,
}: ProductCardWidget & {
  onBuy?: (product: Product) => void
  onCompare?: (product: Product) => void
  onFavorite?: (product: Product) => void
}) {
  return (
    <Card className="w-full max-w-sm bg-white shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-3">
        <div className="flex gap-3">
          {/* Image */}
          <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-8 w-8 text-gray-300" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm text-gray-900 line-clamp-2 leading-tight">
              {product.name}
            </h4>
            {product.brand?.name && (
              <p className="text-xs text-gray-500 mt-0.5">{product.brand.name}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-lg font-bold text-blue-600">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
            {product.stock > 0 ? (
              <Badge variant="outline" className="mt-1 text-xs text-green-600 border-green-200 bg-green-50">
                В наличии: {product.stock} шт
              </Badge>
            ) : (
              <Badge variant="outline" className="mt-1 text-xs text-red-600 border-red-200 bg-red-50">
                Нет в наличии
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          {actions.includes('buy') && (
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => onBuy?.(product)}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Купить
            </Button>
          )}
          {actions.includes('compare') && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onCompare?.(product)}
            >
              <GitCompare className="h-4 w-4" />
            </Button>
          )}
          {actions.includes('favorite') && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onFavorite?.(product)}
            >
              <Heart className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Product List Widget
function ChatProductList({ 
  products, 
  title,
  showCompare,
  onBuy,
}: ProductListWidget & {
  onBuy?: (product: Product) => void
}) {
  return (
    <div className="w-full space-y-2">
      {title && (
        <h4 className="font-medium text-sm text-gray-700">{title}</h4>
      )}
      <div className="space-y-2">
        {products.slice(0, 5).map(product => (
          <ChatProductCard 
            key={product.id}
            type="product_card"
            id={product.id}
            product={product}
            actions={showCompare ? ['buy', 'compare'] : ['buy']}
            onBuy={onBuy}
          />
        ))}
      </div>
      {products.length > 5 && (
        <p className="text-xs text-gray-500 text-center">
          И ещё {products.length - 5} товаров...
        </p>
      )}
    </div>
  )
}

// Invoice Preview Widget
function ChatInvoicePreview({ 
  invoice, 
  actions = ['pay', 'download'],
  onPay,
  onDownload,
}: InvoicePreviewWidget & {
  onPay?: (invoiceId: string) => void
  onDownload?: (invoiceId: string) => void
}) {
  const statusColors = {
    draft: 'bg-gray-100 text-gray-600',
    pending: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-green-100 text-green-700',
    overdue: 'bg-red-100 text-red-700',
  }

  const statusLabels = {
    draft: 'Черновик',
    pending: 'Ожидает оплаты',
    paid: 'Оплачен',
    overdue: 'Просрочен',
  }

  return (
    <Card className="w-full max-w-md bg-white shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold text-gray-900">Счёт #{invoice.number}</h4>
            <p className="text-sm text-gray-500">{invoice.supplier}</p>
          </div>
          <Badge className={statusColors[invoice.status]}>
            {statusLabels[invoice.status]}
          </Badge>
        </div>

        {/* Items mini-table */}
        <div className="border rounded-lg overflow-hidden mb-3">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Товар</th>
                <th className="px-2 py-1 text-right text-xs font-medium text-gray-500">Кол-во</th>
                <th className="px-2 py-1 text-right text-xs font-medium text-gray-500">Сумма</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.slice(0, 3).map((item, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-2 py-1.5 text-gray-700 truncate max-w-[150px]">{item.name}</td>
                  <td className="px-2 py-1.5 text-right text-gray-600">{item.quantity} {item.unit}</td>
                  <td className="px-2 py-1.5 text-right text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {invoice.items.length > 3 && (
            <div className="px-2 py-1 bg-gray-50 text-xs text-gray-500 text-center">
              И ещё {invoice.items.length - 3} позиций...
            </div>
          )}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center mb-3 p-2 bg-blue-50 rounded-lg">
          <span className="font-medium text-gray-700">Итого:</span>
          <span className="text-xl font-bold text-blue-600">
            {formatPrice(invoice.total)} {invoice.currency}
          </span>
        </div>

        {invoice.dueDate && (
          <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Оплатить до: {new Date(invoice.dueDate).toLocaleDateString('ru-RU')}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {actions.includes('pay') && invoice.status !== 'paid' && (
            <Button 
              className="flex-1"
              onClick={() => onPay?.(invoice.id)}
            >
              <CreditCard className="h-4 w-4 mr-1" />
              Оплатить
            </Button>
          )}
          {actions.includes('download') && (
            <Button 
              variant="outline"
              onClick={() => onDownload?.(invoice.id)}
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Order Status Widget
function ChatOrderStatus({ order }: OrderStatusWidget) {
  const steps = [
    { key: 'created', label: 'Создан' },
    { key: 'confirmed', label: 'Подтверждён' },
    { key: 'processing', label: 'Собирается' },
    { key: 'shipped', label: 'Отправлен' },
    { key: 'delivered', label: 'Доставлен' },
  ]

  const currentStepIdx = steps.findIndex(s => s.key === order.status)

  return (
    <Card className="w-full max-w-sm bg-white shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-semibold text-gray-900">Заказ #{order.number}</h4>
            <p className="text-sm text-gray-500">{order.items} товаров</p>
          </div>
          <span className="text-lg font-bold text-blue-600">
            {formatPrice(order.total)}
          </span>
        </div>

        {/* Status timeline */}
        <div className="relative">
          <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200" />
          {steps.map((step, idx) => (
            <div key={step.key} className="relative flex items-center gap-3 py-1.5">
              <div className={`
                w-4 h-4 rounded-full z-10 flex items-center justify-center
                ${idx <= currentStepIdx ? 'bg-blue-500' : 'bg-gray-200'}
              `}>
                {idx <= currentStepIdx && (
                  <Check className="h-2.5 w-2.5 text-white" />
                )}
              </div>
              <span className={`text-sm ${idx <= currentStepIdx ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {order.estimatedDelivery && (
          <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
            <Truck className="h-3 w-3" />
            Ожидается: {new Date(order.estimatedDelivery).toLocaleDateString('ru-RU')}
          </p>
        )}

        {order.trackingUrl && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-3"
            onClick={() => window.open(order.trackingUrl, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Отследить посылку
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Supplier Card Widget
function ChatSupplierCard({ 
  supplier, 
  actions = ['contact', 'catalog'],
  onContact,
  onCatalog,
}: SupplierCardWidget & {
  onContact?: (supplierId: string) => void
  onCatalog?: (supplierId: string) => void
}) {
  return (
    <Card className="w-full max-w-sm bg-white shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          {supplier.logo ? (
            <img 
              src={supplier.logo} 
              alt={supplier.name}
              className="w-12 h-12 rounded-lg object-contain bg-gray-50"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
              <Package className="h-6 w-6 text-gray-400" />
            </div>
          )}
          <div>
            <h4 className="font-semibold text-gray-900">{supplier.name}</h4>
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium">{supplier.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-400">({supplier.reviewsCount} отзывов)</span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5 text-sm text-gray-600 mb-3">
          <p className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-gray-400" />
            Доставка: {supplier.deliveryTime}
          </p>
          {supplier.minOrder && (
            <p className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-400" />
              Мин. заказ: {formatPrice(supplier.minOrder)}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {supplier.categories.slice(0, 3).map(cat => (
            <Badge key={cat} variant="secondary" className="text-xs">
              {cat}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          {actions.includes('catalog') && (
            <Button 
              className="flex-1"
              onClick={() => onCatalog?.(supplier.id)}
            >
              Каталог
            </Button>
          )}
          {actions.includes('contact') && (
            <Button 
              variant="outline"
              onClick={() => onContact?.(supplier.id)}
            >
              <Phone className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Price Comparison Widget
function ChatPriceComparison({ product, offers }: PriceComparisonWidget) {
  const sortedOffers = [...offers].sort((a, b) => a.price - b.price)
  const lowestPrice = sortedOffers[0]?.price || 0

  return (
    <Card className="w-full max-w-md bg-white shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingDown className="h-5 w-5 text-green-500" />
          <div>
            <h4 className="font-semibold text-gray-900 line-clamp-1">{product.name}</h4>
            <p className="text-xs text-gray-500">SKU: {product.sku}</p>
          </div>
        </div>

        <div className="space-y-2">
          {sortedOffers.map((offer, idx) => (
            <div 
              key={offer.supplier}
              className={`
                flex items-center justify-between p-2 rounded-lg
                ${idx === 0 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}
              `}
            >
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-900">{offer.supplier}</p>
                <p className="text-xs text-gray-500">
                  {offer.inStock ? '✓ В наличии' : '✗ Под заказ'} · {offer.deliveryDays} дн.
                </p>
              </div>
              <div className="text-right">
                <p className={`font-bold ${idx === 0 ? 'text-green-600' : 'text-gray-700'}`}>
                  {formatPrice(offer.price)}
                </p>
                {idx === 0 && (
                  <Badge className="text-xs bg-green-500">Лучшая цена</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Delivery Tracker Widget
function ChatDeliveryTracker({ delivery }: DeliveryTrackerWidget) {
  return (
    <Card className="w-full max-w-sm bg-white shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-500">{delivery.carrier}</p>
            <p className="font-mono text-sm">{delivery.trackingNumber}</p>
          </div>
          <MapPin className="h-5 w-5 text-blue-500" />
        </div>

        <div className="relative">
          <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200" />
          {delivery.steps.map((step, idx) => (
            <div key={idx} className="relative flex items-start gap-3 pb-3">
              <div className={`
                w-4 h-4 rounded-full z-10 flex items-center justify-center flex-shrink-0
                ${step.completed ? 'bg-green-500' : 'bg-gray-200'}
              `}>
                {step.completed && (
                  <Check className="h-2.5 w-2.5 text-white" />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.title}
                </p>
                {step.timestamp && (
                  <p className="text-xs text-gray-400">
                    {new Date(step.timestamp).toLocaleString('ru-RU')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Main Widget Renderer
export interface WidgetRendererProps {
  widget: Widget
  onBuyProduct?: (product: Product) => void
  onPayInvoice?: (invoiceId: string) => void
  onDownloadInvoice?: (invoiceId: string) => void
  onContactSupplier?: (supplierId: string) => void
  onViewCatalog?: (supplierId: string) => void
}

export function WidgetRenderer({ 
  widget,
  onBuyProduct,
  onPayInvoice,
  onDownloadInvoice,
  onContactSupplier,
  onViewCatalog,
}: WidgetRendererProps) {
  switch (widget.type) {
    case 'product_card':
      return (
        <ChatProductCard 
          {...widget} 
          onBuy={onBuyProduct}
        />
      )

    case 'product_list':
      return (
        <ChatProductList 
          {...widget}
          onBuy={onBuyProduct}
        />
      )

    case 'invoice_preview':
      return (
        <ChatInvoicePreview 
          {...widget}
          onPay={onPayInvoice}
          onDownload={onDownloadInvoice}
        />
      )

    case 'order_status':
      return <ChatOrderStatus {...widget} />

    case 'supplier_card':
      return (
        <ChatSupplierCard 
          {...widget}
          onContact={onContactSupplier}
          onCatalog={onViewCatalog}
        />
      )

    case 'price_comparison':
      return <ChatPriceComparison {...widget} />

    case 'delivery_tracker':
      return <ChatDeliveryTracker {...widget} />

    default:
      return (
        <div className="p-3 bg-gray-100 rounded-lg text-sm text-gray-500">
          Неизвестный виджет: {(widget as Widget).type}
        </div>
      )
  }
}

export {
  ChatProductCard,
  ChatProductList,
  ChatInvoicePreview,
  ChatOrderStatus,
  ChatSupplierCard,
  ChatPriceComparison,
  ChatDeliveryTracker,
}
