import { useQuery } from '@tanstack/react-query'
import { productApi, USE_MOCKS } from '@/lib/axios'
import { mockHandlers } from '@/mocks'
import type { Product } from '@/types'

interface SearchParams {
  query: string
  category?: string
  limit?: number
}

interface SemanticSearchResponse {
  items: Array<{
    id: string
    sku: string
    name: string
    description: string
    price: number
    currency: string
    image_url?: string
    category: string
    supplier: string
    stock: number
    score?: number
  }>
  total: number
}

async function searchProducts(params: SearchParams): Promise<Product[]> {
  if (USE_MOCKS) {
    return mockHandlers.searchProducts(params.query)
  }

  // Используем semantic-search эндпоинт для умного поиска
  const response = await productApi.get<SemanticSearchResponse>('/semantic-search', {
    params: {
      q: params.query,
      limit: params.limit || 10,
      category: params.category,
    },
  })

  // Преобразуем ответ бэкенда в формат Product
  return response.data.items.map((item) => ({
    id: item.id,
    sku: item.sku,
    name: item.name,
    description: item.description,
    price: item.price,
    currency: item.currency || 'RUB',
    imageUrl: item.image_url,
    category: item.category,
    supplier: item.supplier,
    stock: item.stock,
  }))
}

export function useSearchProducts(params: SearchParams) {
  return useQuery({
    queryKey: ['products', 'search', params],
    queryFn: () => searchProducts(params),
    enabled: params.query.length >= 2,
  })
}
