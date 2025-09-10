import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { SensorReading, TimeRange, LatestSensorData, BatchHistoryResponse } from '@/lib/types'
import { useAuth } from '@/providers/auth-provider'

interface ReadingsResponse {
  data: SensorReading[]
}

export function useReadings(pondId: string, timeRange?: TimeRange) {
  const { accessToken } = useAuth()
  
  return useQuery({
    queryKey: ['readings', pondId, timeRange],
    queryFn: async (): Promise<SensorReading[]> => {
      if (!accessToken) {
        throw new Error('No access token available')
      }
      
      // Convert to correct API parameter format
      const params = timeRange 
        ? { start_date: timeRange.from, end_date: timeRange.to, limit: 100 } 
        : { limit: 100 }
      
      const response = await apiClient.getSensorReadings(
        pondId,
        accessToken,  // token ต้องอยู่ตัวกลาง
        params        // params อยู่ตัวท้าย
      )
        

      
      if (response.error) {
        throw new Error(response.error)
      }
      
      return response.data || []
    },
    enabled: !!pondId && !!accessToken,
  })
}

export function useCurrentReadings(pondId: string) {
  const { accessToken } = useAuth()
  
  return useQuery({
    queryKey: ['current-readings', pondId],
    queryFn: async (): Promise<SensorReading[]> => {
      if (!accessToken) {
        throw new Error('No access token available')
      }
      
      const response = await apiClient.getSensorReadings(
        pondId,
        accessToken,       // token ต้องอยู่ตรงกลาง
        { limit: 1 }       // params อยู่ตัวสุดท้าย
      )
      
      
      if (response.error) {
        throw new Error(response.error)
      }
      
      return response.data || []
    },
    enabled: !!pondId && !!accessToken,
  })
}

// New hooks for batch sensor data
export function useLatestSensorData(pondId: string) {
  const { accessToken } = useAuth()
  
  console.log('🔧 useLatestSensorData called with pondId:', pondId, 'accessToken:', !!accessToken)
  
  return useQuery({
    queryKey: ['latest-sensor-data', pondId], // Remove Date.now() to prevent constant refetch
    queryFn: async (): Promise<LatestSensorData> => {
      console.log('🚀 Fetching latest sensor data for pond:', pondId)
      const response = await apiClient.getLatestSensorData(pondId, accessToken || undefined)
      
      console.log('📡 API response:', response)
      
      if (response.error) {
        console.error('❌ API error:', response.error)
        throw new Error(response.error)
      }
      
      console.log('✅ API success, data:', response.data)
      return response.data as LatestSensorData
    },
    enabled: !!pondId && !!accessToken,
    // Fetch only when page loads - no automatic refetching
    staleTime: 0, // Always consider data stale to force refetch on mount
    gcTime: 0, // Don't cache data
    refetchOnMount: true, // Always refetch on mount
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchInterval: false, // Disable automatic refetching
  })
}

export function useSensorBatchHistory(pondId: string, limit?: number) {
  return useQuery({
    queryKey: ['sensor-batch-history', pondId, limit],
    queryFn: async (): Promise<BatchHistoryResponse> => {
      const response = await apiClient.getSensorBatchHistory(pondId, limit)
      
      if (response.error) {
        throw new Error(response.error)
      }
      
      return response.data as BatchHistoryResponse
    },
    enabled: !!pondId,
  })
}