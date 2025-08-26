'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function PondDetailPage() {
  const router = useRouter()
  const params = useParams()
  const pondId = params.id

  const goBack = () => router.back()

  const viewImage = (type: string) => {
    alert('เปิดดูรูป' + type)
  }

  return (
    <div className="home-container">
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

        {/* Status Section */}
        <div className="status-section">
          <div className="status-item excellent">
            <div className="status-text">สถานะดีเยี่ยม</div>
            <div className="status-bar">
              <div className="status-progress" style={{ width: '58px', backgroundColor: '#0dec36' }}></div>
            </div>
          </div>
          <div className="status-item improving">
            <div className="status-text">กำลังปรับปรุง</div>
            <div className="status-bar">
              <div className="status-progress" style={{ width: '58px', backgroundColor: '#ffb600' }}></div>
            </div>
          </div>
          <div className="status-item bad">
            <div className="status-text">ซวยแล้ว!!</div>
            <div className="status-bar">
              <div className="status-progress" style={{ width: '58px', backgroundColor: '#ea484b' }}></div>
            </div>
          </div>
        </div>

        {/* Today Section */}
        <div className="today-section">
          <h2>วันนี้</h2>
        </div>

        {/* Sensor Cards */}
        <div className="sensor-cards">
          {/* DO Card */}
          <div className="sensor-card green">
            <div className="card-content">
              <h3>DO (ค่าออกซิเจนในน้ำ)</h3>
              <div className="sensor-value">6.5 mg/L</div>
            </div>
          </div>

          {/* pH Card */}
          <div className="sensor-card yellow">
            <div className="card-content">
              <h3>pH</h3>
              <div className="sensor-value">8.2</div>
            </div>
          </div>

          {/* Temperature Card */}
          <div className="sensor-card green">
            <div className="card-content">
              <h3>อุณหภูมิ</h3>
              <div className="sensor-value">29.5 °C</div>
            </div>
          </div>

          {/* Shrimp Size Card */}
          <div className="sensor-card green large">
            <div className="card-content">
              <h3>ขนาดของตัวกุ้ง</h3>
              <div className="sensor-value">5 cm</div>
              <div className="sensor-change positive">+2%</div>
              <button className="view-image-btn" onClick={() => viewImage('shrimp')}>กดเพื่อดูรูป</button>
            </div>
          </div>

          {/* Food Remaining Card */}
          <div className="food-card">
            <div className="food-content">
              <h3>อาหารเหลือบนยอกุ้ง</h3>
              <button className="view-image-btn small" onClick={() => viewImage('food')}>กดเพื่อดูรูป</button>
            </div>
          </div>

          {/* Water Color Card */}
          <div className="sensor-card yellow large">
            <div className="card-content">
              <h3>สีของน้ำ</h3>
              <div className="sensor-value">สีเขียว</div>
              <button className="view-image-btn" onClick={() => viewImage('water')}>กดเพื่อดูรูป</button>
            </div>
          </div>

          {/* Minerals Card */}
          <div className="sensor-card red">
            <div className="card-content">
              <h3>แร่ธาตุคงเหลือ</h3>
              <div className="sensor-value">0.5 กิโลกรัม</div>
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
          font-family: 'Inter', 'Space Grotesk', 'Noto Sans Thai', sans-serif;
          background-color: #ffffff;
          height: 100vh;
          overflow: auto;
        }

        .home-container {
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

        /* Status Section */
        .status-section {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .status-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background-color: #ffffff;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .status-text {
          font-family: 'Inter', 'Noto Sans Thai', sans-serif;
          font-weight: 600;
          font-size: 16px;
          line-height: 20px;
          color: #1c170d;
        }

        .status-bar {
          width: 80px;
          height: 8px;
          background-color: #f3f4f6;
          border-radius: 4px;
          overflow: hidden;
        }

        .status-progress {
          height: 100%;
          border-radius: 4px;
        }

        /* Today Section */
        .today-section {
          padding: 0 16px 16px 16px;
        }

        .today-section h2 {
          font-family: 'Inter', 'Noto Sans Thai', sans-serif;
          font-weight: 700;
          font-size: 20px;
          line-height: 24px;
          color: #1c170d;
          margin: 0;
        }

        /* Sensor Cards */
        .sensor-cards {
          padding: 0 16px 16px 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .sensor-card {
          background-color: #ffffff;
          border-radius: 16px;
          padding: 20px;
          border: 2px solid;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .sensor-card.green {
          border-color: #10b981;
        }

        .sensor-card.yellow {
          border-color: #f59e0b;
        }

        .sensor-card.red {
          border-color: #ef4444;
        }

        .sensor-card.large {
          padding: 24px;
        }

        .card-content h3 {
          font-family: 'Inter', 'Noto Sans Thai', sans-serif;
          font-weight: 600;
          font-size: 18px;
          line-height: 22px;
          color: #1c170d;
          margin: 0 0 12px 0;
        }

        .sensor-value {
          font-family: 'Inter', 'Noto Sans Thai', sans-serif;
          font-weight: 700;
          font-size: 24px;
          line-height: 29px;
          color: #1c170d;
          margin-bottom: 12px;
        }

        .sensor-change.positive {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 16px;
          line-height: 20px;
          color: #10b981;
          margin-bottom: 16px;
        }

        .view-image-btn {
          background-color: #f2c245;
          border: none;
          border-radius: 20px;
          padding: 12px 24px;
          font-family: 'Inter', 'Noto Sans Thai', sans-serif;
          font-weight: 600;
          font-size: 14px;
          line-height: 20px;
          color: #1c170d;
          cursor: pointer;
          transition: background-color 0.2s ease;
          width: 100%;
        }

        .view-image-btn:hover {
          background-color: #e6b63d;
        }

        .view-image-btn.small {
          padding: 8px 16px;
          font-size: 12px;
          line-height: 16px;
        }

        /* Food Card */
        .food-card {
          background-color: #ffffff;
          border-radius: 16px;
          padding: 20px;
          border: 2px solid #f2c245;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .food-content h3 {
          font-family: 'Inter', 'Noto Sans Thai', sans-serif;
          font-weight: 600;
          font-size: 18px;
          line-height: 22px;
          color: #1c170d;
          margin: 0 0 16px 0;
        }

        /* Responsive Design */
        @media (max-width: 480px) {
          .status-section,
          .today-section,
          .sensor-cards {
            padding-left: 12px;
            padding-right: 12px;
          }
          
          .status-item {
            padding: 10px 14px;
          }
          
          .status-text {
            font-size: 14px;
          }
          
          .today-section h2 {
            font-size: 18px;
          }
          
          .sensor-card {
            padding: 16px;
          }
          
          .sensor-card.large {
            padding: 20px;
          }
          
          .card-content h3 {
            font-size: 16px;
          }
          
          .sensor-value {
            font-size: 20px;
          }
          
          .view-image-btn {
            padding: 10px 20px;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  )
}
