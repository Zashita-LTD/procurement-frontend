import { useQuery } from '@tanstack/react-query'
import { brainApi, USE_MOCKS } from '@/lib/axios'
import { mockHandlers } from '@/mocks'
import type { EstimateItem } from '@/types'

async function fetchEstimateItems(projectId: string): Promise<EstimateItem[]> {
  if (USE_MOCKS) {
    return mockHandlers.getEstimateItems(projectId)
  }
  const response = await brainApi.get<EstimateItem[]>(`/projects/${projectId}/items`)
  return response.data
}

export function useEstimateItems(projectId: string) {
  return useQuery({
    queryKey: ['estimateItems', projectId],
    queryFn: () => fetchEstimateItems(projectId),
    enabled: !!projectId,
  })
}
