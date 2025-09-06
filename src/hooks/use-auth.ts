import { useMutation, useQuery } from '@tanstack/react-query'
import { apiClient, LoginCredentials, User } from '@/lib/api-client'
import { useAuth } from '@/providers/auth-provider'
import { useRouter } from 'next/navigation'

export function useLogin() {
  const { login } = useAuth()
  const router = useRouter()
  
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const success = await login(credentials.phone_number, credentials.password)
      if (!success) {
        throw new Error('Login failed')
      }
    },
    onSuccess: () => {
      router.push('/ponds')
    },
  })
}

export function useLogout() {
  const { logout } = useAuth()
  const router = useRouter()
  
  return useMutation({
    mutationFn: async (): Promise<void> => {
      // Logout is handled by the auth provider
      logout()
    },
    onSuccess: () => {
      router.push('/login')
    },
  })
}

export function useProfile() {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['profile'],
    queryFn: async (): Promise<User | null> => {
      return user
    },
    enabled: !!user,
  })
}
