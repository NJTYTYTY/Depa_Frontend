import { useMutation, useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { useAuthStore } from '@/providers/auth-provider'
import { useRouter } from 'next/navigation'
import type { User } from '@/lib/types'

interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  user: User
  token: string
}

interface ProfileResponse {
  data: User
}

export function useLogin() {
  const { login } = useAuthStore()
  const router = useRouter()
  
  return useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<LoginResponse> => {
      const response = await apiClient.login(credentials)
      // Ensure we return LoginResponse by properly typing the response
      // First convert to unknown, then to LoginResponse
      const typedResponse = response as unknown as LoginResponse
      return typedResponse
    },
    onSuccess: (data: LoginResponse) => {
      login(data.user, data.token)
      router.push('/ponds')
    },
  })
}

export function useLogout() {
  const { logout } = useAuthStore()
  const router = useRouter()
  
  return useMutation({
    mutationFn: async (): Promise<void> => {
      // TODO: Implement actual logout API call
      // For now, just simulate the API call
      await new Promise(resolve => setTimeout(resolve, 100))
    },
    onSuccess: () => {
      logout()
      router.push('/login')
    },
  })
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async (): Promise<User> => {
      const response = await apiClient.getProfile()
      // Ensure we return User by properly typing the response
      const typedResponse = response as ProfileResponse
      return typedResponse.data
    },
  })
}
