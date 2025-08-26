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
    <div className="pond-layout">
      {/* Main Content */}
      <div className="main-content">
        {children}
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-navigation">
        <Link 
          href={`/ponds/${pondId}`} 
          className={`nav-item ${isActive('') ? 'active' : ''}`}
        >
          <div className="nav-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="nav-text">หน้าแรก</span>
        </Link>

        <Link 
          href={`/ponds/${pondId}/graph`} 
          className={`nav-item ${isActive('/graph') ? 'active' : ''}`}
        >
          <div className="nav-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 3V21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 9L12 6L16 10L21 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 5H16V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="nav-text">กราฟ</span>
        </Link>

        <Link 
          href={`/ponds/${pondId}/history`} 
          className={`nav-item ${isActive('/history') ? 'active' : ''}`}
        >
          <div className="nav-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="nav-text">ประวัติ</span>
        </Link>

        <Link 
          href={`/ponds/${pondId}/control`} 
          className={`nav-item ${isActive('/control') ? 'active' : ''}`}
        >
          <div className="nav-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="nav-text">ควบคุม</span>
        </Link>
      </div>

      <style jsx>{`
        .pond-layout {
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: relative;
        }

        .main-content {
          flex: 1;
          overflow-y: auto;
          padding-bottom: 80px; /* Space for bottom navigation */
        }

        .bottom-navigation {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: #ffffff;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 8px 0;
          z-index: 50;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px 16px;
          text-decoration: none;
          color: #6b7280;
          transition: all 0.2s;
          border-radius: 8px;
          min-width: 60px;
        }

        .nav-item:hover {
          color: #6366f1;
          background-color: #f3f4f6;
        }

        .nav-item.active {
          color: #6366f1;
          background-color: #eef2ff;
        }

        .nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
        }

        .nav-text {
          font-family: 'Inter', 'Noto Sans Thai', sans-serif;
          font-size: 11px;
          font-weight: 500;
          text-align: center;
        }

        /* Responsive adjustments */
        @media (max-width: 480px) {
          .nav-item {
            padding: 6px 12px;
            min-width: 50px;
          }
          
          .nav-text {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  )
}
