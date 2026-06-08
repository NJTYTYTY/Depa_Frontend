import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

interface SystemStatus {
  enabled: boolean
  last_check: string | null
  status: string
}

interface SystemToggleRequest {
  action: 'on' | 'off'
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Query key for system status
const SYSTEM_STATUS_QUERY_KEY = ['system', 'status']

// Hook for system control
export function useSystemControl() {
  const queryClient = useQueryClient()

  // Query for system status
  const { 
    data: systemStatus, 
    isLoading: isStatusLoading,
    error: statusError 
  } = useQuery<SystemStatus>({
    queryKey: SYSTEM_STATUS_QUERY_KEY,
    queryFn: async () => {
      // Mock system status response
      return {
        enabled: true,
        last_check: new Date().toISOString(),
        status: 'running'
      }
    },
    refetchInterval: 5000, // Refetch every 5 seconds
    retry: 3
  })

  // Mutation for toggling system
  const toggleMutation = useMutation({
    mutationFn: async (action: 'on' | 'off') => {
      // Mock system toggle response
      return {
        enabled: action === 'on',
        last_check: new Date().toISOString(),
        status: action === 'on' ? 'running' : 'stopped'
      }
    },
    onSuccess: (data) => {
      // Update the cache with new status
      queryClient.setQueryData(SYSTEM_STATUS_QUERY_KEY, data)
      
      // Show success message
      console.log(`System ${data.status} successfully`)
    },
    onError: (error) => {
      console.error('Failed to toggle system:', error)
    }
  })

  // Function to turn system on
  const turnOn = () => {
    toggleMutation.mutate('on')
  }

  // Function to turn system off
  const turnOff = () => {
    toggleMutation.mutate('off')
  }

  // Function to toggle system
  const toggle = () => {
    if (systemStatus?.enabled) {
      turnOff()
    } else {
      turnOn()
    }
  }

  return {
    // Status
    systemStatus,
    isEnabled: systemStatus?.enabled || false,
    isStatusLoading,
    statusError,
    
    // Actions
    turnOn,
    turnOff,
    toggle,
    
    // Mutation state
    isToggling: toggleMutation.isPending,
    toggleError: toggleMutation.error
  }
}

// Hook for routine settings (for system status display)
export function useSystemRoutineSettings() {
  const { 
    data: routineSettings, 
    isLoading: isRoutineLoading,
    error: routineError 
  } = useQuery({
    queryKey: ['system', 'routine-settings'],
    queryFn: async () => {
      // Mock routine settings response
      return {
        data: {
          enabled: true,
          schedules: [
            { id: '1', time: '08:00', days: ['จันทร์', 'พุธ', 'ศุกร์'] },
            { id: '2', time: '16:00', days: ['จันทร์', 'พุธ', 'ศุกร์'] }
          ]
        }
      }
    },
    refetchInterval: 10000, // Refetch every 10 seconds
    retry: 3
  })

  return {
    routineSettings: routineSettings?.data,
    isRoutineLoading,
    routineError
  }
}
