import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { Event } from '@/lib/types'

interface HistoryResponse {
  data: Event[]
  pagination?: {
    page: number
    limit: number
    total: number
  }
}

export function useHistory(pondId: string, pagination?: { page: number; limit: number }) {
  return useQuery({
    queryKey: ['history', pondId, pagination],
    queryFn: async (): Promise<Event[]> => {
      const response = await apiClient.getHistory(pondId, { 
        cursor: pagination ? String(pagination.page) : undefined,
        limit: pagination?.limit 
      })
      // Ensure we return Event[] by properly typing the response
      const typedResponse = response as HistoryResponse
      return typedResponse.data || []
    },
    enabled: !!pondId,
  })
}

export function useInfiniteHistory(pondId: string, limit: number = 20) {
  return useInfiniteQuery({
    queryKey: ['infinite-history', pondId],
    queryFn: async ({ pageParam = 1 }): Promise<Event[]> => {
      const response = await apiClient.getHistory(pondId, { 
        cursor: String(pageParam), 
        limit 
      })
      // Ensure we return Event[] by properly typing the response
      const typedResponse = response as HistoryResponse
      return typedResponse.data || []
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // If we got fewer items than the limit, we've reached the end
      if (lastPage.length < limit) {
        return undefined
      }
      return allPages.length + 1
    },
    enabled: !!pondId,
  })
}
