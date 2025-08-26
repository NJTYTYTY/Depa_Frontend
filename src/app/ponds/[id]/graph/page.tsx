'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function GraphPage() {
  const router = useRouter()
  const params = useParams()
  const pondId = params.id

  const goBack = () => router.back()

  return (
    <div className="graph-container">
      <div className="main-frame">
        {/* Header */}
        <div className="header">
          <div className="header-content">
            <div className="back-button" onClick={goBack}>
              <div className="back-icon">
                <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M18 8C18 8.41421 17.6642 8.75 17.25 8.75H2.56031L8.03063 14.2194C8.32368 14.5124 8.32368 14.9876 8.03063 15.2806C7.73757 15.5737 7.26243 15.5737 6.96937 15.2806L0.219375 8.53063C0.0785421 8.38995 -0.000590086 8.19906 -0.000590086 8C-0.000590086 7.80094 0.0785421 7.61005 0.219375 7.46937L6.96937 0.719375C7.26243 0.426319 7.73757 0.426319 8.03063 0.719375C8.32368 1.01243 8.32368 1.48757 8.03063 1.78062L2.56031 7.25H17.25C17.6642 7.25 18 7.58579 18 8V8Z" fill="#1C170D"/>
                </svg>
              </div>
            </div>
            <div className="title-container">
              <h1>บ่อที่ 1</h1>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {/* Title Section */}
          <div className="title-section">
            <h2>ข้อมูลของเซนเซอร์</h2>
          </div>

          {/* Graph Cards */}
          <div className="graph-cards">
            {/* DO Card */}
            <div className="graph-card green">
              <div className="card-header">
                <h3>DO</h3>
                <div className="sensor-value">6.5</div>
                <div className="sensor-info">
                  <span>Last 24h</span>
                  <span className="change negative">-0.2%</span>
                </div>
              </div>
              <div className="chart-container">
                <svg className="chart" viewBox="0 0 306 148">
                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#F2F0E8', stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: '#F2F0E8', stopOpacity: 0 }} />
                    </linearGradient>
                  </defs>
                  <path d="M0 71L24 14L48 27L72 61L95 22L118 66L141 40L165 30L188 79L212 97L235 1L258 53L282 84L306 17V148H0Z" fill="url(#gradient1)"/>
                  <path d="M0 71L24 14L48 27L72 61L95 22L118 66L141 40L165 30L188 79L212 97L235 1L258 53L282 84L306 17" stroke="black" strokeWidth="3" fill="none"/>
                </svg>
                <div className="time-labels">
                  <span>00:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>24:00</span>
                </div>
              </div>
            </div>

            {/* pH Card */}
            <div className="graph-card yellow">
              <div className="card-header">
                <h3>pH</h3>
                <div className="sensor-value">8.2</div>
                <div className="sensor-info">
                  <span>Last 24h</span>
                  <span className="change positive">+0.1%</span>
                </div>
              </div>
              <div className="chart-container">
                <svg className="chart" viewBox="0 0 306 148">
                  <defs>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#F2F0E8', stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: '#F2F0E8', stopOpacity: 0 }} />
                    </linearGradient>
                  </defs>
                  <path d="M0 71L24 14L48 27L72 61L95 22L118 66L141 40L165 30L188 79L212 97L235 1L258 53L282 84L306 17V148H0Z" fill="url(#gradient2)"/>
                  <path d="M0 71L24 14L48 27L72 61L95 22L118 66L141 40L165 30L188 79L212 97L235 1L258 53L282 84L306 17" stroke="black" strokeWidth="3" fill="none"/>
                </svg>
                <div className="time-labels">
                  <span>00:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>24:00</span>
                </div>
              </div>
            </div>

            {/* Temperature Card */}
            <div className="graph-card green">
              <div className="card-header">
                <h3>Temperature</h3>
                <div className="sensor-value">28.5°C</div>
                <div className="sensor-info">
                  <span>Last 24h</span>
                  <span className="change positive">+0.5%</span>
                </div>
              </div>
              <div className="chart-container">
                <svg className="chart" viewBox="0 0 306 148">
                  <defs>
                    <linearGradient id="gradient3" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#F2F0E8', stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: '#F2F0E8', stopOpacity: 0 }} />
                    </linearGradient>
                  </defs>
                  <path d="M0 71L24 14L48 27L72 61L95 22L118 66L141 40L165 30L188 79L212 97L235 1L258 53L282 84L306 17V148H0Z" fill="url(#gradient3)"/>
                  <path d="M0 71L24 14L48 27L72 61L95 22L118 66L141 40L165 30L188 79L212 97L235 1L258 53L282 84L306 17" stroke="black" strokeWidth="3" fill="none"/>
                </svg>
                <div className="time-labels">
                  <span>00:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>24:00</span>
                </div>
              </div>
            </div>

            {/* Shrimp Size Card */}
            <div className="graph-card green">
              <div className="card-header">
                <h3>Shrimp Size</h3>
                <div className="sensor-value">5cm</div>
                <div className="sensor-info">
                  <span>Last 24h</span>
                  <span className="change positive">+1.2%</span>
                </div>
              </div>
              <div className="chart-container">
                <svg className="chart" viewBox="0 0 306 148">
                  <defs>
                    <linearGradient id="gradient4" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#F2F0E8', stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: '#F2F0E8', stopOpacity: 0 }} />
                    </linearGradient>
                  </defs>
                  <path d="M0 71L24 14L48 27L72 61L95 22L118 66L141 40L165 30L188 79L212 97L235 1L258 53L282 84L306 17V148H0Z" fill="url(#gradient4)"/>
                  <path d="M0 71L24 14L48 27L72 61L95 22L118 66L141 40L165 30L188 79L212 97L235 1L258 53L282 84L306 17" stroke="black" strokeWidth="3" fill="none"/>
                </svg>
                <div className="time-labels">
                  <span>00:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>24:00</span>
                </div>
              </div>
            </div>

            {/* Minerals Card */}
            <div className="graph-card red">
              <div className="card-header">
                <h3>แร่ธาตุคงเหลือ</h3>
                <div className="sensor-value">0.5 กิโลกรัม</div>
                <div className="sensor-info">
                  <span>Last 24h</span>
                  <span className="change negative">-0.8%</span>
                </div>
              </div>
              <div className="chart-container">
                <svg className="chart" viewBox="0 0 306 148">
                  <defs>
                    <linearGradient id="gradient5" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#F2F0E8', stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: '#F2F0E8', stopOpacity: 0 }} />
                    </linearGradient>
                  </defs>
                  <path d="M0 71L24 14L48 27L72 61L95 22L118 66L141 40L165 30L188 79L212 97L235 1L258 53L282 84L306 17V148H0Z" fill="url(#gradient5)"/>
                  <path d="M0 71L24 14L48 27L72 61L95 22L118 66L141 40L165 30L188 79L212 97L235 1L258 53L282 84L306 17" stroke="black" strokeWidth="3" fill="none"/>
                </svg>
                <div className="time-labels">
                  <span>00:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>24:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', sans-serif;
          background-color: #ffffff;
          height: 100vh;
          overflow: auto;
        }

        .graph-container {
          background-color: #fcfaf7;
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
        }

        .main-frame {
          background-color: #fcfaf7;
          min-height: 844px;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
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
          padding: 16px 16px 8px 16px;
          width: 100%;
        }

        .back-button {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          cursor: pointer;
          flex-shrink: 0;
        }

        .back-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .title-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-right: 48px;
        }

        .title-container h1 {
          font-family: 'Inter', 'Noto Sans Thai', sans-serif;
          font-weight: 700;
          font-size: 18px;
          line-height: 23px;
          color: #1c170d;
          text-align: center;
          margin: 0;
        }

        /* Content Area */
        .content-area {
          flex: 1;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* Title Section */
        .title-section {
          text-align: center;
        }

        .title-section h2 {
          font-family: 'Inter', 'Noto Sans Thai', sans-serif;
          font-weight: 700;
          font-size: 20px;
          line-height: 24px;
          color: #1c170d;
          margin: 0;
        }

        /* Graph Cards */
        .graph-cards {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .graph-card {
          background-color: #ffffff;
          border-radius: 16px;
          padding: 24px;
          border: 2px solid;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .graph-card.green {
          border-color: #01940d;
        }

        .graph-card.yellow {
          border-color: #ffb600;
        }

        .graph-card.red {
          border-color: #ff0004;
        }

        .card-header {
          margin-bottom: 20px;
        }

        .card-header h3 {
          font-family: 'Inter', 'Noto Sans Thai', sans-serif;
          font-weight: 600;
          font-size: 18px;
          line-height: 22px;
          color: #1c170d;
          margin: 0 0 8px 0;
        }

        .sensor-value {
          font-family: 'Inter', 'Noto Sans Thai', sans-serif;
          font-weight: 700;
          font-size: 24px;
          line-height: 29px;
          color: #1c170d;
          margin-bottom: 8px;
        }

        .sensor-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          line-height: 17px;
          color: #6b7280;
        }

        .change.positive {
          color: #10b981;
          font-weight: 500;
        }

        .change.negative {
          color: #ef4444;
          font-weight: 500;
        }

        /* Chart Container */
        .chart-container {
          position: relative;
        }

        .chart {
          width: 100%;
          height: auto;
          max-width: 306px;
          margin: 0 auto;
          display: block;
        }

        .time-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 12px;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          line-height: 15px;
          color: #6b7280;
        }

        /* Responsive Design */
        @media (max-width: 480px) {
          .content-area {
            padding: 12px;
            gap: 16px;
          }
          
          .graph-card {
            padding: 20px;
          }
          
          .title-section h2 {
            font-size: 18px;
          }
          
          .card-header h3 {
            font-size: 16px;
          }
          
          .sensor-value {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  )
}
