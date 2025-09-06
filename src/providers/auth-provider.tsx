'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { apiClient, User } from '@/lib/api-client'

interface AuthContextType {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (phoneNumber: string, password: string) => Promise<boolean>
  logout: () => void
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token')
      const refreshTokenValue = localStorage.getItem('refresh_token')
      
      console.log('🔍 Auth check - token exists:', !!token)
      console.log('🔍 Auth check - refresh token exists:', !!refreshTokenValue)
      
      if (token && refreshTokenValue) {
        try {
          console.log('🔍 Validating token with backend...')
          // Try to get user profile
          const response = await apiClient.getCurrentUser(token)
          console.log('🔍 User profile response:', response)
          
          if (response.data) {
            console.log('✅ Token valid, setting user and access token')
            setUser(response.data)
            setAccessToken(token)
          } else {
            console.log('⚠️ Token invalid, trying to refresh...')
            // Token might be expired, try to refresh
            await refreshToken()
          }
        } catch (error) {
          console.error('❌ Auth check failed:', error)
          // Clear invalid tokens
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('user_phone')
          setAccessToken(null)
        }
      } else {
        console.log('⚠️ No tokens found, user not authenticated')
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (phoneNumber: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.login({
        phone_number: phoneNumber,
        password: password
      })

      if (response.error) {
        throw new Error(response.error)
      }

      if (response.data) {
        // Store tokens
        localStorage.setItem('access_token', response.data.access_token)
        localStorage.setItem('refresh_token', response.data.refresh_token)
        localStorage.setItem('user_phone', phoneNumber)
        setAccessToken(response.data.access_token)

        // Get user profile
        const profileResponse = await apiClient.getCurrentUser(response.data.access_token)
        if (profileResponse.data) {
          setUser(profileResponse.data)
          return true
        }
      }
      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const logout = () => {
    // Clear tokens and user data
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_phone')
    setUser(null)
    setAccessToken(null)
  }

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) {
      logout()
      return
    }

    try {
      const response = await apiClient.refreshToken(refreshToken)
      if (response.data) {
        // Update tokens
        localStorage.setItem('access_token', response.data.access_token)
        localStorage.setItem('refresh_token', response.data.refresh_token)
        setAccessToken(response.data.access_token)

        // Get updated user profile
        const profileResponse = await apiClient.getCurrentUser(response.data.access_token)
        if (profileResponse.data) {
          setUser(profileResponse.data)
        }
      } else {
        // Refresh failed, logout
        logout()
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      logout()
    }
  }

  const value: AuthContextType = {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshToken
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
