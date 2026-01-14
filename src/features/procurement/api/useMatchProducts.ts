import { useMutation, useQueryClient } from '@tanstack/react-query'
import { brainApi, productApi, USE_MOCKS } from '@/lib/axios'
import { mockHandlers } from '@/mocks'
import type { MatchResponse, EstimateItem, Product } from '@/types'
import type { ApiPaginatedResponse, ApiProductListItem } from '@/types/api/product'
import { mapListItemToProduct } from '@/lib/productMapper'

interface MatchProductsParams {
  projectId: string
  itemIds?: string[]
}

// Функция для подбора товара по тексту через semantic-search
async function matchSingleItem(originalText: string): Promise<{
  matchedProduct?: Product
  alternatives: Product[]
  matchScore: number
}> {
  try {
    const response = await productApi.post<ApiPaginatedResponse<ApiProductListItem>>('/products/products/search/semantic', {
      query: originalText,
      page: 1,
      per_page: 5,
    })

    const items = response.data.data.map(mapListItemToProduct)

    if (items.length === 0) {
      return { alternatives: [], matchScore: 0 }
    }

    // Первый результат — лучшее совпадение
    const bestMatch = items[0]
    // Используем quality_score как proxy для match score
    const score = response.data.data[0]?.quality_score || 0.5

    return {
      matchedProduct: bestMatch,
      alternatives: items.slice(1),
      matchScore: Math.min(score, 1), // Нормализуем score от 0 до 1
    }
  } catch (error) {
    console.error('Error matching item:', originalText, error)
    return { alternatives: [], matchScore: 0 }
  }
}

async function matchProducts({ projectId, itemIds }: MatchProductsParams): Promise<MatchResponse> {
  if (USE_MOCKS) {
    return mockHandlers.runMatching(projectId)
  }

  // Получаем позиции проекта
  const itemsResponse = await brainApi.get<EstimateItem[]>(`/projects/${projectId}/items`)
  const items = itemsResponse.data

  // Фильтруем по itemIds если указаны
  const itemsToMatch = itemIds
    ? items.filter(item => itemIds.includes(item.id))
    : items

  // Подбираем товары для каждой позиции
  const startTime = Date.now()
  const matchedItems = await Promise.all(
    itemsToMatch.map(async (item) => {
      const { matchedProduct, alternatives, matchScore } = await matchSingleItem(item.originalText)

      return {
        ...item,
        matchedProduct,
        alternatives,
        matchScore,
        status: matchScore >= 0.8 ? 'matched' as const
          : matchScore >= 0.5 ? 'review' as const
            : 'manual' as const,
      }
    })
  )

  const processingTime = (Date.now() - startTime) / 1000

  return {
    items: matchedItems,
    processingTime,
    modelVersion: 'semantic-search-v1',
  }
}

export function useMatchProducts() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: matchProducts,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['estimateItems', variables.projectId] })
    },
  })
}
