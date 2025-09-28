import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { TimeframeOption } from '@/components/TimeframeSelector'

interface ShrimpSizeGraphData {
  sensor_type: string
  data_points: Array<{
    timestamp: string
    value: number
    status: string
  }>
  unit: string
  min_value: number
  max_value: number
  average_value: number
  trend: string
}

interface ShrimpSizeGraphResponse {
  success: boolean
  pond_id: number
  sensor_data: ShrimpSizeGraphData
  time_range: {
    start_time: string
    end_time: string
  }
  total_points: number
  timeframe: string
  hours: number
}

interface UseShrimpSizeGraphDataOptions {
  pondId: number
  timeframe?: TimeframeOption
  hours?: number
  enabled?: boolean
}

// Helper function to convert timeframe to hours
const timeframeToHours = (timeframe: TimeframeOption): number => {
  switch (timeframe) {
    case '1D': return 24
    case '7D': return 168
    case '30D': return 720
    default: return 24
  }
}

export const useShrimpSizeGraphData = ({ 
  pondId, 
  timeframe = '1D',
  hours, 
  enabled = true 
}: UseShrimpSizeGraphDataOptions) => {
  // Use timeframe to determine hours if not explicitly provided
  const actualHours = hours || timeframeToHours(timeframe)
  
  return useQuery({
    queryKey: ['shrimp-size-graph-data', pondId, actualHours, timeframe],
    queryFn: async (): Promise<ShrimpSizeGraphResponse> => {
      const params = new URLSearchParams({
        hours: actualHours.toString(),
        timeframe: timeframe
      })
      
      // Use request method and add /api/v1 prefix
      const response = await (apiClient as any).request(`/api/v1/sensors/graph-shrimpsize/${pondId}?${params}`, {
        method: 'GET',
      })
      
      if (response.error) {
        throw new Error(response.error)
      }
      
      return response.data
    },
    enabled: enabled && !!pondId,
    refetchInterval: 30000, // Refetch every 30 seconds (less frequent than regular sensors)
    staleTime: 15000, // Consider data stale after 15 seconds
    cacheTime: 600000, // Keep in cache for 10 minutes (longer than regular sensors)
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: true, // Refetch when component mounts
  })
}
