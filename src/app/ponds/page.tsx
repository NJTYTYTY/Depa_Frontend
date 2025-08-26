'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Pond {
  id: string
  name: string
  date: string
  size: string
  dimensions: string
  depth: string
}

export default function ShrimpPondsPage() {
  const router = useRouter()
  
  // Mock data for ponds
  const [ponds] = useState<Pond[]>([
    {
      id: '1',
      name: 'บ่อที่ 1',
      date: '2024-01-15',
      size: '3 ไร่',
      dimensions: '100m x 500m',
      depth: '1.5m depth'
    },
    {
      id: '2',
      name: 'บ่อที่ 2',
      date: '2024-01-15',
      size: '3 rai',
      dimensions: '100m x 500m',
      depth: '1.5m depth'
    },
    {
      id: '3',
      name: 'บ่อที่ 3',
      date: '2024-01-15',
      size: '3 ไร่',
      dimensions: '100m x 500m',
      depth: '1.5m depth'
    }
  ])

  const addPond = () => {
    router.push('/ponds/add')
  }

  const selectPond = (pondId: string) => {
    router.push(`/ponds/${pondId}`)
  }

  return (
    <div className="shrimp-ponds-container">
      <div className="main-frame">
        {/* Header */}
        <div className="header">
          <div className="header-content">
            <div className="spacer"></div>
            <div className="add-button" onClick={addPond}>
              <div className="add-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M18 9C18 9.41421 17.6642 9.75 17.25 9.75H9.75V17.25C9.75 17.6642 9.41421 18 9 18C8.58579 18 8.25 17.6642 8.25 17.25V9.75H0.75C0.335786 9.75 0 9.41421 0 9C0 8.58579 0.335786 8.25 0.75 8.25H8.25V0.75C8.25 0.335786 8.58579 0 9 0C9.41421 0 9.75 0.335786 9.75 0.75V8.25H17.25C17.6642 8.25 18 8.58579 18 9V9Z" fill="#1C170D"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Title Section */}
        <div className="title-section">
          <h1>บ่อ</h1>
        </div>

        {/* Pond List */}
        <div className="pond-list">
          {ponds.map((pond) => (
            <div key={pond.id} className="pond-item" onClick={() => selectPond(pond.id)}>
              <div className="pond-content">
                <div className="pond-info">
                  <h3 className="pond-title">{pond.name}</h3>
                  <div className="pond-details">
                    <p>วันที่ : {pond.date}</p>
                    <p>ขนาด : {pond.size}</p>
                    <p>ก. x ย. : {pond.dimensions}</p>
                    <p>ความลึก : {pond.depth}</p>
                  </div>
                </div>
                <div className="pond-arrow">
                  <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M18 8C18 8.41421 17.6642 8.75 17.25 8.75H2.56031L8.03063 14.2194C8.32368 14.5124 8.32368 14.9876 8.03063 15.2806C7.73757 15.5737 7.26243 15.5737 6.96937 15.2806L0.219375 8.63063C0.0785421 8.48995 -0.000590086 8.29906 -0.000590086 8.1C-0.000590086 7.90094 0.0785421 7.71005 0.219375 7.56937L6.96937 0.719375C7.26243 0.426319 7.73757 0.426319 8.03063 0.719375C8.32368 1.01243 8.32368 1.48757 8.03063 1.78062L2.56031 8.25H17.25C17.6642 8.25 18 8.58579 18 9V9Z" fill="#1A170F"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .shrimp-ponds-container {
          background-color: #fcfaf7;
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .main-frame {
          background-color: #fcfaf7;
          min-height: 100vh;
          width: 100%;
          max-width: 390px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
        }

        /* Header Styles */
        .header {
          background-color: #fcfaf7;
          width: 100%;
          flex-shrink: 0;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 16px 16px 8px 16px;
          width: 100%;
        }

        .spacer {
          flex: 1;
        }

        .add-button {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background-color: #f2c245;
          border-radius: 12px;
          transition: background-color 0.2s;
        }

        .add-button:hover {
          background-color: #e6b63d;
        }

        .add-icon {
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Title Section */
        .title-section {
          padding: 20px 16px 12px 16px;
        }

        .title-section h1 {
          font-family: 'Inter', 'Noto Sans Thai', sans-serif;
          font-weight: 700;
          font-size: 22px;
          line-height: 28px;
          color: #171412;
          margin: 0;
        }

        /* Pond List */
        .pond-list {
          flex: 1;
          padding: 0 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 16px;
        }

        .pond-item {
          background-color: #ffffff;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #e5e7eb;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .pond-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .pond-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .pond-info {
          flex: 1;
        }

        .pond-title {
          font-family: 'Inter', 'Noto Sans Thai', sans-serif;
          font-weight: 600;
          font-size: 18px;
          color: #1c170d;
          margin: 0 0 12px 0;
        }

        .pond-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .pond-details p {
          font-family: 'Inter', 'Noto Sans Thai', sans-serif;
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .pond-arrow {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 16px;
        }

        /* Responsive Design */
        @media (max-width: 480px) {
          .main-frame {
            width: 100%;
          }
          
          .pond-list {
            padding: 0 12px;
            gap: 12px;
          }
          
          .pond-item {
            padding: 16px;
          }
          
          .pond-title {
            font-size: 16px;
          }
          
          .pond-details p {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  )
}
