'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/providers/auth-provider'
import PWADebug from '@/components/PWADebug'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [isPWA, setIsPWA] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
    setIsMounted(true)

    // Check if app is running in PWA mode (fullscreen or standalone)
    const checkPWAMode = () => {
      
      // Check if we should maintain PWA mode
      const shouldMaintainPWA = localStorage.getItem('pwa-mode') === 'true'
      if (shouldMaintainPWA) {
        console.log('🔧 Maintaining PWA mode...')
        // Set PWA mode
        setIsPWA(true)
      }
      // Multiple PWA detection methods
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isIOSStandalone = (window.navigator as any).standalone === true
      const isAndroidApp = document.referrer.includes('android-app://')
      const isTWA = window.navigator.userAgent.includes('TWA')
      
      // Additional Android PWA checks
      const isAndroid = /Android/i.test(navigator.userAgent)
      const isChrome = /Chrome/i.test(navigator.userAgent)
      const isAndroidPWA = isAndroid && isChrome && isStandalone
      
      // Check if launched from home screen
      const isFromHomeScreen = window.location.search.includes('utm_source=homescreen') || 
                              window.location.search.includes('source=homescreen') ||
                              document.referrer.includes('android-app://') ||
                              (window.navigator as any).standalone === true
      
      // Check if in standalone mode
      const isInPWAMode = isStandalone || isIOSStandalone || isAndroidApp || isTWA || isAndroidPWA
      
      // Final PWA detection - Simplified
      const isPWAMode = isInPWAMode || isFromHomeScreen || 
                        window.location.pathname === '/' || // Root path
                        window.location.search.includes('standalone=true') || // Standalone flag
                        window.location.search.includes('utm_source=homescreen') || // Home screen source
                        window.location.search.includes('source=homescreen') || // Home screen source
                        window.location.search.includes('source=pwa') || // PWA source flag
                        document.referrer.includes('android-app://') || // Android app referrer
                        (window.navigator as any).standalone === true || // iOS standalone
                        window.matchMedia('(display-mode: standalone)').matches || // Display mode (primary)
                        window.matchMedia('(display-mode: minimal-ui)').matches || // Display mode (fallback)
                        localStorage.getItem('pwa-mode') === 'true' || // PWA mode flag
                        window.location.hostname === 'localhost' || // Local development
                        window.location.hostname === '10.204.229.144' // Your current IP
      
      // Debug PWA detection
      console.log('🔍 PWA Detection Debug:')
      console.log('- isInPWAMode:', isInPWAMode)
      console.log('- isFromHomeScreen:', isFromHomeScreen)
      console.log('- window.location.pathname:', window.location.pathname)
      console.log('- window.location.hostname:', window.location.hostname)
      console.log('- localStorage pwa-mode:', localStorage.getItem('pwa-mode'))
      console.log('- Final isPWAMode:', isPWAMode)
      
      // Force standalone mode if in PWA
      if (isPWAMode) {
        // Set flags to maintain PWA mode
        localStorage.setItem('pwa-mode', 'true')
        
        // Try to maintain standalone mode (no need to force fullscreen)
        console.log('✅ PWA Standalone Mode Active - No fullscreen needed')
      }
      setIsPWA(isPWAMode)
      
      console.log(`🔍 PWA Detection Debug:`)
      console.log(`- Display Mode Standalone: ${isStandalone}`)
      console.log(`- iOS Standalone: ${isIOSStandalone}`)
      console.log(`- Android App: ${isAndroidApp}`)
      console.log(`- TWA: ${isTWA}`)
      console.log(`- Android PWA: ${isAndroidPWA}`)
      console.log(`- From Home Screen: ${isFromHomeScreen}`)
      console.log(`- In PWA Mode: ${isInPWAMode}`)
      console.log(`- Final IsPWA: ${isPWA}`)
      console.log(`- URL: ${window.location.href}`)
      console.log(`- Referrer: ${document.referrer}`)
      console.log(`- User Agent: ${navigator.userAgent}`)
      
      // If in PWA mode, show PWA interface instead of redirecting
      if (isPWAMode) {
        console.log(`✅ PWA Mode Active - No redirect`)
        // Set PWA mode flag
        localStorage.setItem('pwa-mode', 'true')
        setIsPWA(true)
        return
      }
      
      // Only redirect if not in PWA mode
      console.log(`🌐 Browser Mode - Redirecting...`)
      if (isAuthenticated) {
        router.push('/ponds')
      } else {
        router.push('/login')
      }
    }
    
    checkPWAMode()
  }, [isAuthenticated, router])

  // Don't render until mounted to avoid SSR issues
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Shrimp Farm WebApp</h1>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show PWA interface if in PWA mode
  if (isPWA) {
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches
    
    return (
      <div className="min-h-screen bg-[#fcfaf7] text-[#171412] p-5">
        <div className="max-w-md mx-auto pt-5">
          <h1 className="text-2xl font-bold mb-5 text-center">🦐 ShrimpSense PWA</h1>
          
                           <div className="bg-white rounded-lg p-5 mb-5 border border-gray-200">
                   <h3 className="text-lg font-semibold mb-3">📱 PWA Status:</h3>
                   <div className="bg-green-500 text-white p-3 rounded-lg font-semibold text-center">
                     ✅ PWA MODE ACTIVE
                   </div>
                   <p className="text-sm text-gray-600 mt-3 text-center">
                     แอปทำงานในโหมด PWA แล้ว!
                   </p>
            
            {/* Additional PWA Info */}
            <div className="mt-3 text-xs text-gray-500 text-center">
              <p>Display Mode: standalone</p>
              <p>Browser UI: Minimal</p>
              <p>Device: {/Android/i.test(navigator.userAgent) ? 'Android' : 'iOS'}</p>
              <p>Browser: {/Chrome/i.test(navigator.userAgent) ? 'Chrome' : 'Other'}</p>
            </div>
          </div>

                           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-5">
                   <h3 className="font-semibold mb-2">🔗 Quick Links:</h3>
                   <div className="space-y-2">
                     <button 
                       onClick={() => {
                         // Navigate directly without fullscreen
                         window.location.href = '/login'
                       }}
                       className="block w-full text-left text-blue-600 hover:underline bg-transparent border-none p-0"
                     >
                       เข้าสู่ระบบ
                     </button>
                     <button 
                       onClick={() => {
                         // Navigate directly without fullscreen
                         window.location.href = '/ponds'
                       }}
                       className="block w-full text-left text-blue-600 hover:underline bg-transparent border-none p-0"
                     >
                       จัดการบ่อกุ้ง
                     </button>
                   </div>
                 </div>

                           <div className="space-y-3">
                   <button
                     onClick={() => window.location.reload()}
                     className="w-full bg-gray-500 text-white py-3 rounded-lg font-semibold"
                   >
                     🔄 รีเฟรช
                   </button>
                   
                   <button
                     onClick={() => window.location.href = '/?pwa=true'}
                     className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold"
                   >
                     🧪 ทดสอบ PWA Mode
                   </button>
                   
                   <button
                     onClick={() => window.location.href = '/?standalone=true'}
                     className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold"
                   >
                     🧪 ทดสอบ Standalone Mode
                   </button>
                   
                   
                 </div>
        </div>
      </div>
    )
  }

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Shrimp Farm WebApp</h1>
        <p className="text-gray-600">Redirecting...</p>
      </div>
      
      {/* PWA Debug Component */}
      <PWADebug />
    </div>
  )
}
