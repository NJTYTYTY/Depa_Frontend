import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { SensorReading, TimeRange } from '@/lib/types'

interface ReadingsResponse {
  data: SensorReading[]
}

export function useReadings(pondId: string, timeRange?: TimeRange) {
  return useQuery({
    queryKey: ['readings', pondId, timeRange],
    queryFn: async (): Promise<SensorReading[]> => {
      // Convert to correct API parameter format
      const params = timeRange ? { from: timeRange.from, to: timeRange.to, limit: 100 } : { limit: 100 }
      const response = await apiClient.getReadings(pondId, params)
      // Ensure we return SensorReading[] by properly typing the response
      const typedResponse = response as ReadingsResponse
      return typedResponse.data || []
    },
    enabled: !!pondId,
  })
}

export function useCurrentReadings(pondId: string) {
  return useQuery({
    queryKey: ['current-readings', pondId],
    queryFn: async (): Promise<SensorReading[]> => {
      const response = await apiClient.getReadings(pondId, { limit: 1 })
      // Ensure we return SensorReading[] by properly typing the response
      const typedResponse = response as ReadingsResponse
      return typedResponse.data || []
    },
    enabled: !!pondId,
  })
}
