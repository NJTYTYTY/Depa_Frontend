import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { SensorReading, TimeRange } from '@/lib/types'
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
