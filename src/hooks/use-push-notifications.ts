'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/providers/auth-provider'

interface PushSubscriptionData {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

interface PushNotificationHook {
  isSupported: boolean
  permission: NotificationPermission
  subscription: PushSubscription | null
  isSubscribed: boolean
  isLoading: boolean
  error: string | null
  requestPermission: () => Promise<boolean>
  subscribe: () => Promise<boolean>
  unsubscribe: () => Promise<boolean>
  sendTestNotification: () => Promise<void>
}

export const usePushNotifications = (): PushNotificationHook => {
  const { accessToken } = useAuth()
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if push notifications are supported
  useEffect(() => {
    const checkSupport = () => {
      const supported = 'serviceWorker' in navigator && 'PushManager' in window
      setIsSupported(supported)
      
      if (supported) {
        setPermission(Notification.permission)
      }
    }

    checkSupport()
  }, [])

  // Get existing subscription on mount
  useEffect(() => {
    if (isSupported && permission === 'granted') {
      getExistingSubscription()
    }
  }, [isSupported, permission])

  const getExistingSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const existingSubscription = await registration.pushManager.getSubscription()
      setSubscription(existingSubscription)
    } catch (err) {
      console.error('Error getting existing subscription:', err)
    }
  }

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      setError('Push notifications are not supported in this browser')
      return false
    }

    try {
      setIsLoading(true)
      setError(null)

      const permission = await Notification.requestPermission()
      setPermission(permission)

      if (permission === 'granted') {
        return true
      } else {
        setError('Permission denied for push notifications')
        return false
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request permission'
      setError(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [isSupported])

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported || permission !== 'granted') {
      setError('Push notifications not supported or permission not granted')
      return false
    }

    if (!accessToken) {
      setError('User not authenticated')
      return false
    }

    try {
      setIsLoading(true)
      setError(null)

      // Mock subscription success locally
      const mockPushSubscription = {
        endpoint: 'https://updates.push.services.mozilla.com/wpush/v2/mock-endpoint-id',
        expirationTime: null,
        options: {
          userVisibleOnly: true,
          applicationServerKey: new Uint8Array()
        },
        getKey: () => new ArrayBuffer(0),
        toJSON: () => ({ endpoint: 'mock-endpoint' })
      } as any

      setSubscription(mockPushSubscription)
      return true

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to subscribe'
      setError(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [isSupported, permission, accessToken])

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!subscription) {
      setError('No active subscription to unsubscribe')
      return false
    }

    if (!accessToken) {
      setError('User not authenticated')
      return false
    }

    try {
      setIsLoading(true)
      setError(null)

      setSubscription(null)
      return true

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to unsubscribe'
      setError(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [subscription, accessToken])

  const sendTestNotification = useCallback(async (): Promise<void> => {
    if (!subscription) {
      setError('No active subscription')
      return
    }

    try {
      // This would typically be called from backend
      // For testing, we can show a local notification
      if (permission === 'granted') {
        new Notification('Test Notification', {
          body: 'This is a test push notification!',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-72x72.png',
          tag: 'test-notification'
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send test notification'
      setError(errorMessage)
    }
  }, [subscription, permission])

  return {
    isSupported,
    permission,
    subscription,
    isSubscribed: !!subscription,
    isLoading,
    error,
    requestPermission,
    subscribe,
    unsubscribe,
    sendTestNotification
  }
}

// Helper functions
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray as Uint8Array
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}
