import { useMutation, useQueryClient } from '@tanstack/react-query'
import { brainApi, USE_MOCKS } from '@/lib/axios'
import { mockHandlers } from '@/mocks'
import type { UploadResponse } from '@/types'

interface UploadDocumentParams {
  projectId: string
  file: File
}

async function uploadDocument({ projectId, file }: UploadDocumentParams): Promise<UploadResponse> {
  if (USE_MOCKS) {
    return mockHandlers.uploadDocument(projectId, file)
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('projectId', projectId)

  const response = await brainApi.post<UploadResponse>('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export function useUploadDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: uploadDocument,
    onSuccess: (_, variables) => {
      // Invalidate project items after upload
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] })
      queryClient.invalidateQueries({ queryKey: ['estimateItems', variables.projectId] })
    },
  })
}
