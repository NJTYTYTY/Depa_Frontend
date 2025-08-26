import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import QueryProvider from '@/providers/query-provider'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ShrimpSense',
  description: 'ระบบจัดการฟาร์มกุ้งอัจฉริยะ ที่ช่วยให้คุณดูแลบ่อกุ้งได้อย่างมีประสิทธิภาพ',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ShrimpSense',
  },
  formatDetection: {
    telephone: false,
  },
  applicationName: 'ShrimpSense',
  other: {
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#f2c245',
    'msapplication-config': '/browserconfig.xml',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#f2c245',
  interactiveWidget: 'resizes-content',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <head>
        {/* PWA Manifest Link */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* PWA Icons */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512x512.png" />
        
        {/* PWA Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ShrimpSense" />
        <meta name="msapplication-TileColor" content="#f2c245" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* PWA Installation Script */}
        <script src="/pwa-install.js" defer></script>
      </head>
      <body className={inter.className}>
        <QueryProvider>
          <ServiceWorkerRegistration>
            {children}
          </ServiceWorkerRegistration>
        </QueryProvider>
      </body>
    </html>
  )
}
