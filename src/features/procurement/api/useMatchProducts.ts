import { useMutation, useQueryClient } from '@tanstack/react-query'
import { brainApi, productApi, USE_MOCKS } from '@/lib/axios'
import { mockHandlers } from '@/mocks'
import type { MatchResponse, EstimateItem, Product } from '@/types'

interface MatchProductsParams {
  projectId: string
  itemIds?: string[]
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
    score: number
  }>
  total: number
}

// Функция для подбора товара по тексту через semantic-search
async function matchSingleItem(originalText: string): Promise<{
  matchedProduct?: Product
  alternatives: Product[]
  matchScore: number
}> {
  try {
    const response = await productApi.get<SemanticSearchResponse>('/semantic-search', {
      params: { q: originalText, limit: 5 },
    })

    const items = response.data.items.map((item) => ({
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

    if (items.length === 0) {
      return { alternatives: [], matchScore: 0 }
    }

    // Первый результат — лучшее совпадение
    const bestMatch = items[0]
    const score = response.data.items[0]?.score || 0.5

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
