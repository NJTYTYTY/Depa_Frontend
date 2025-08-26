'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function HistoryPage() {
  const router = useRouter()
  const params = useParams()
  const pondId = params.id

  const goBack = () => router.back()

  const downloadFile = () => {
    alert('กำลังดาวน์โหลดไฟล์ log...')
    // Here you would typically trigger a file download
  }

  return (
    <div className="history-container">
      <div className="main-frame">
        {/* Header */}
        <div className="header">
          <div className="header-content">
            <div className="back-button" onClick={goBack}>
              <div className="back-icon">
                <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M18 8C18 8.41421 17.6642 8.75 17.25 8.75H2.56031L8.03063 14.2194C8.32368 14.5124 8.32368 14.9876 8.03063 15.2806C7.73757 15.5737 7.26243 15.5737 6.96937 15.2806L0.219375 8.53063C0.0785421 8.38995 -0.000590086 8.19906 -0.000590086 8C-0.000590086 7.80094 0.0785421 7.61005 0.219375 7.46937L6.96937 0.719375C7.26243 0.426319 7.73757 0.426319 8.03063 0.719375C8.32368 1.01243 8.32368 1.48757 8.03063 1.78062L2.56031 7.25H17.25C17.6642 7.25 18 7.58579 18 8V8Z" fill="#171412"/>
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
            <h2>ประวัติ ไฟล์ค่าวันก่อนหน้า</h2>
          </div>

          {/* File Section */}
          <div className="file-section">
            <div className="file-item">
              <div className="file-info">
                <h3>File Dowlaod</h3>
                <div className="file-date">2024-01-15 10:30 AM</div>
              </div>
              <div className="file-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <g clipPath="url(#clip0_4_619)">
                    <path fillRule="evenodd" clipRule="evenodd" d="M20.0306 7.71938L14.7806 2.46937C14.6399 2.32876 14.449 2.24984 14.25 2.25H5.25C4.42157 2.25 3.75 2.92157 3.75 3.75V20.25C3.75 21.0784 4.42157 21.75 5.25 21.75H18.75C19.5784 21.75 20.25 21.0784 20.25 20.25V8.25C20.2502 8.05103 20.1712 7.86015 20.0306 7.71938V7.71938ZM15 4.81031L17.6897 7.5H15V4.81031ZM18.75 20.25H5.25V3.75H13.5V8.25C13.5 8.66421 13.8358 9 14.25 9H18.75V20.25V20.25Z" fill="#171412"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_4_619">
                      <rect width="24" height="24" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          {/* Download Button Section */}
          <div className="download-section">
            <button className="download-button" onClick={downloadFile}>
              Download Log File
            </button>
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

        .history-container {
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

        /* File Section */
        .file-section {
          background-color: #ffffff;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .file-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .file-info {
          flex: 1;
        }

        .file-info h3 {
          font-family: 'Inter', 'Noto Sans Thai', sans-serif;
          font-weight: 600;
          font-size: 18px;
          line-height: 22px;
          color: #1c170d;
          margin: 0 0 8px 0;
        }

        .file-date {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          line-height: 17px;
          color: #6b7280;
        }

        .file-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f9fafb;
          border-radius: 12px;
          flex-shrink: 0;
        }

        /* Download Section */
        .download-section {
          text-align: center;
        }

        .download-button {
          background-color: #f2c245;
          border: none;
          border-radius: 20px;
          padding: 16px 32px;
          font-family: 'Inter', 'Noto Sans Thai', sans-serif;
          font-weight: 700;
          font-size: 16px;
          line-height: 24px;
          color: #1c170d;
          cursor: pointer;
          transition: background-color 0.2s ease;
          min-width: 200px;
        }

        .download-button:hover {
          background-color: #e6b63d;
        }

        /* Responsive Design */
        @media (max-width: 480px) {
          .content-area {
            padding: 12px;
            gap: 16px;
          }
          
          .file-section {
            padding: 20px;
          }
          
          .title-section h2 {
            font-size: 18px;
          }
          
          .file-info h3 {
            font-size: 16px;
          }
          
          .download-button {
            padding: 14px 24px;
            font-size: 14px;
            min-width: 180px;
          }
        }
      `}</style>
    </div>
  )
}
