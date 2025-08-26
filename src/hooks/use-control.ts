import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

interface ControlCommand {
  pondId: string
  control_type: string
  value: string | number
}

interface ControlResponse {
  data: {
    success: boolean
    message: string
  }
}

export function useSendControl() {
  return useMutation({
    mutationFn: async (command: ControlCommand): Promise<{ success: boolean; message: string }> => {
      const response = await apiClient.sendControl(command.pondId, {
        control_type: command.control_type,
        value: command.value
      })
      // Ensure we return the correct type by properly typing the response
      const typedResponse = response as ControlResponse
      return typedResponse.data
    },
  })
}
