import { useState } from 'react'
import { Search, Eye, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { cn, formatPrice, getMatchStatusColor } from '@/lib/utils'
import type { EstimateItem, Product } from '@/types'
import { ProductDetailsDialog } from './ProductDetailsDialog'
import { ManualSearchDialog } from './ManualSearchDialog'

interface SmartEstimateTableProps {
  items: EstimateItem[]
  onItemUpdate?: (itemId: string, product: Product) => void
}

export function SmartEstimateTable({ items, onItemUpdate }: SmartEstimateTableProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [manualSearchItem, setManualSearchItem] = useState<EstimateItem | null>(null)

  const getStatusIcon = (score: number) => {
    if (score >= 0.8) return <CheckCircle className="h-5 w-5 text-green-600" />
    if (score >= 0.5) return <AlertTriangle className="h-5 w-5 text-yellow-600" />
    return <XCircle className="h-5 w-5 text-red-600" />
  }

  const handleProductSelect = (item: EstimateItem, product: Product) => {
    onItemUpdate?.(item.id, product)
    setManualSearchItem(null)
  }

  return (
    <>
      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Статус</TableHead>
              <TableHead>Позиция из сметы</TableHead>
              <TableHead className="text-center">Кол-во</TableHead>
              <TableHead>Найденный товар</TableHead>
              <TableHead className="text-right">Цена</TableHead>
              <TableHead className="text-center">Match Score</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                {/* Status Icon */}
                <TableCell>
                  {getStatusIcon(item.matchScore)}
                </TableCell>

                {/* Original Text */}
                <TableCell className="font-medium max-w-xs truncate">
                  {item.originalText}
                </TableCell>

                {/* Quantity */}
                <TableCell className="text-center">
                  {item.quantity} {item.unit}
                </TableCell>

                {/* Matched Product */}
                <TableCell>
                  {item.matchedProduct ? (
                    <button
                      onClick={() => setSelectedProduct(item.matchedProduct! )}
                      className="text-left hover:text-blue-600 transition-colors"
                    >
                      <p className="font-medium">{item.matchedProduct.name}</p>
                      <p className="text-xs text-gray-500">{item.matchedProduct. sku}</p>
                    </button>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </TableCell>

                {/* Price */}
                <TableCell className="text-right">
                  {item.matchedProduct
                    ? formatPrice(item. matchedProduct.price * item.quantity)
                    :  '—'}
                </TableCell>

                {/* Match Score Badge */}
                <TableCell className="text-center">
                  <span
                    className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                      getMatchStatusColor(item.matchScore)
                    )}
                  >
                    {Math.round(item.matchScore * 100)}%
                  </span>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {item.matchScore >= 0.8 && item.matchedProduct && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedProduct(item.matchedProduct! )}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {item.matchScore >= 0.5 && item. matchScore < 0.8 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setManualSearchItem(item)}
                      >
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    )}
                    
                    {item.matchScore < 0.5 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setManualSearchItem(item)}
                      >
                        <Search className="h-4 w-4 mr-1" />
                        Найти
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Product Details Dialog */}
      <ProductDetailsDialog
        product={selectedProduct}
        open={!!selectedProduct}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
      />

      {/* Manual Search Dialog */}
      <ManualSearchDialog
        item={manualSearchItem}
        open={!!manualSearchItem}
        onOpenChange={(open) => !open && setManualSearchItem(null)}
        onSelect={handleProductSelect}
      />
    </>
  )
}