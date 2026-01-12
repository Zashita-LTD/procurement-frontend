import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'
import { Package, Building2, Tag } from 'lucide-react'

interface ProductDetailsDialogProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductDetailsDialog({
  product,
  open,
  onOpenChange,
}:  ProductDetailsDialogProps) {
  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>SKU: {product.sku}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          {/* Image */}
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {product.imageUrl ?  (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-16 w-16 text-gray-300" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Цена</h4>
              <p className="text-2xl font-bold text-blue-600">
                {formatPrice(product. price, product.currency)}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Описание</h4>
              <p className="text-sm text-gray-700">{product.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-gray-400" />
              <Badge variant="secondary">{product.category}</Badge>
            </div>

            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{product.supplier}</span>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">В наличии</h4>
              <p className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                {product.stock > 0 ? `${product.stock} шт. ` : 'Нет в наличии'}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}