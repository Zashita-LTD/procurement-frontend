import { useState } from 'react'
import { Search, Check } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useSearchProducts } from '../api/useSearchProducts'
import { formatPrice } from '@/lib/utils'
import type { EstimateItem, Product } from '@/types'

interface ManualSearchDialogProps {
  item: EstimateItem | null
  open: boolean
  onOpenChange: (open:  boolean) => void
  onSelect: (item: EstimateItem, product: Product) => void
}

export function ManualSearchDialog({
  item,
  open,
  onOpenChange,
  onSelect,
}: ManualSearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState(item?.originalText || '')
  const { data: products, isLoading } = useSearchProducts({ query: searchQuery })

  if (! item) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Поиск товара</DialogTitle>
          <DialogDescription>
            Позиция:  {item.originalText}
          </DialogDescription>
        </DialogHeader>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Введите название товара..."
            className="pl-10"
          />
        </div>

        {/* Alternatives (if any) */}
        {item.alternatives && item.alternatives.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Предложенные варианты:</h4>
            <div className="space-y-2">
              {item.alternatives.map((product) => (
                <ProductCard
                  key={product. id}
                  product={product}
                  onSelect={() => onSelect(item, product)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        <div className="flex-1 overflow-auto">
          <h4 className="text-sm font-medium mb-2">Результаты поиска:</h4>
          {isLoading ?  (
            <p className="text-sm text-gray-500">Поиск...</p>
          ) : products && products.length > 0 ? (
            <div className="space-y-2">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={() => onSelect(item, product)}
                />
              ))}
            </div>
          ) : searchQuery. length >= 2 ? (
            <p className="text-sm text-gray-500">Ничего не найдено</p>
          ) : (
            <p className="text-sm text-gray-500">
              Введите минимум 2 символа для поиска
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ProductCard({
  product,
  onSelect,
}: {
  product:  Product
  onSelect: () => void
}) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <p className="font-medium">{product.name}</p>
        <p className="text-sm text-gray-500">
          {product.sku} • {product.supplier}
        </p>
      </div>
      <div className="text-right mr-4">
        <p className="font-semibold">{formatPrice(product.price)}</p>
        <p className="text-xs text-gray-500">
          {product.stock > 0 ? `В наличии: ${product.stock}` : 'Нет в наличии'}
        </p>
      </div>
      <Button size="sm" onClick={onSelect}>
        <Check className="h-4 w-4 mr-1" />
        Выбрать
      </Button>
    </div>
  )
}