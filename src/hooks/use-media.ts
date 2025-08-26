import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { MediaAsset } from '@/lib/types'

interface MediaResponse {
  data: MediaAsset[]
}

export function useMedia(pondId: string, filters?: { type?: string; limit?: number }) {
  return useQuery({
    queryKey: ['media', pondId, filters],
    queryFn: async (): Promise<MediaAsset[]> => {
      const response = await apiClient.getMedia(pondId, filters || {})
      // Ensure we return MediaAsset[] by properly typing the response
      const typedResponse = response as MediaResponse
      return typedResponse.data || []
    },
    enabled: !!pondId,
  })
}

export function useLatestMedia(pondId: string, limit: number = 10) {
  return useQuery({
    queryKey: ['latest-media', pondId, limit],
    queryFn: async (): Promise<MediaAsset[]> => {
      const response = await apiClient.getMedia(pondId, { limit })
      // Ensure we return MediaAsset[] by properly typing the response
      const typedResponse = response as MediaResponse
      return typedResponse.data || []
    },
    enabled: !!pondId,
  })
}
