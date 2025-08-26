import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { Pond, CreatePondRequest } from '@/lib/types'

interface PondsResponse {
  data: Pond[]
}

interface PondResponse {
  data: Pond
}

export function usePonds() {
  return useQuery({
    queryKey: ['ponds'],
    queryFn: async (): Promise<Pond[]> => {
      const response = await apiClient.getPonds()
      // Ensure we return Pond[] by properly typing the response
      const typedResponse = response as PondsResponse
      return typedResponse.data || []
    },
  })
}

export function usePond(pondId: string) {
  return useQuery({
    queryKey: ['pond', pondId],
    queryFn: async (): Promise<Pond> => {
      const response = await apiClient.getPond(pondId)
      // Ensure we return Pond by properly typing the response
      const typedResponse = response as PondResponse
      return typedResponse.data
    },
    enabled: !!pondId,
  })
}

export function useCreatePond() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreatePondRequest): Promise<Pond> => {
      const response = await apiClient.createPond(data)
      // Ensure we return Pond by properly typing the response
      const typedResponse = response as PondResponse
      return typedResponse.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ponds'] })
    },
  })
}
