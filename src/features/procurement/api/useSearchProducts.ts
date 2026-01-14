import { useQuery } from '@tanstack/react-query'
import { productApi } from '@/lib/axios'
import { mapListItemToProduct } from '@/lib/productMapper'
import type { Product } from '@/types'
import type { ApiPaginatedResponse, ApiProductListItem } from '@/types/api/product'

interface SearchParams {
  query: string
  category?: string
  limit?: number
}

async function searchProducts(params: SearchParams): Promise<Product[]> {
  const payload = {
    query: params.query,
    page: 1,
    per_page: params.limit || 10,
  }

  const response = await productApi.post<ApiPaginatedResponse<ApiProductListItem>>(
    '/search/semantic',
    payload,
  )

  return response.data.data.map(mapListItemToProduct)
}

export function useSearchProducts(params: SearchParams) {
  return useQuery({
    queryKey: ['products', 'search', params],
    queryFn: () => searchProducts(params),
    enabled: params.query.length >= 2,
  })
}
