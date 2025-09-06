'use client'

import { useParams, usePathname } from 'next/navigation'
import Link from 'next/link'

export default function PondLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const pathname = usePathname()
  const pondId = params.id

  const isActive = (path: string) => {
    return pathname === `/ponds/${pondId}${path}`
  }

  return (
    <div className="flex flex-col h-screen relative bg-[#fcfaf7]">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-[#fcfaf7]">
        <div className="pb-20">
          {children}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FCFAF7] border-t border-gray-200 flex justify-around items-center py-2 z-50 shadow-lg">
        <Link 
          href={`/ponds/${pondId}`} 
          className={`flex flex-col items-center justify-center px-2 py-2 transition-all duration-200 rounded-lg min-w-[50px] ${
            isActive('') ? 'text-[#1C170D]' : 'text-[#9C854A] hover:text-[#1C170D] hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center mb-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xs font-medium text-center">หน้าแรก</span>
        </Link>

        <Link 
          href={`/ponds/${pondId}/graph`} 
          className={`flex flex-col items-center justify-center px-2 py-2 transition-all duration-200 rounded-lg min-w-[50px] ${
            isActive('/graph') ? 'text-[#1C170D]' : 'text-[#9C854A] hover:text-[#1C170D] hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center mb-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 3V21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 9L12 6L16 10L21 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 5H16V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xs font-medium text-center">กราฟ</span>
        </Link>

        <Link 
          href={`/ponds/${pondId}/history`} 
          className={`flex flex-col items-center justify-center px-2 py-2 transition-all duration-200 rounded-lg min-w-[50px] ${
            isActive('/history') ? 'text-[#1C170D]' : 'text-[#9C854A] hover:text-[#1C170D] hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center mb-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xs font-medium text-center">ประวัติ</span>
        </Link>

        <Link 
          href={`/ponds/${pondId}/control`} 
          className={`flex flex-col items-center justify-center px-2 py-2 transition-all duration-200 rounded-lg min-w-[50px] ${
            isActive('/control') ? 'text-[#1C170D]' : 'text-[#9C854A] hover:text-[#1C170D] hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center mb-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xs font-medium text-center">ควบคุม</span>
        </Link>

        <Link 
          href={`/ponds/${pondId}/agent`} 
          className={`flex flex-col items-center justify-center px-2 py-2 transition-all duration-200 rounded-lg min-w-[50px] ${
            isActive('/agent') ? 'text-[#1C170D]' : 'text-[#9C854A] hover:text-[#1C170D] hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center mb-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H5V21H19V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xs font-medium text-center">ผู้ช่วย</span>
        </Link>
      </div>
    </div>
  )
}
