'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function ControlPage() {
  const router = useRouter()
  const params = useParams()
  const pondId = params.id

  const goBack = () => router.back()

  const toggleSwitch = (element: HTMLElement) => {
    element.classList.toggle('active')
    const isActive = element.classList.contains('active')
    console.log('Switch toggled:', isActive)
  }

  return (
    <div className="w-full flex flex-col h-full bg-[#fcfaf7]">
        {/* Header */}
        <div className="header">
          <div className="header-content">
            <div className="back-button" onClick={goBack}>
              <div className="back-icon">
                <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M18 8C18 8.41421 17.6642 8.75 17.25 8.75H2.56031L8.03063 14.2194C8.32368 14.5124 8.32368 14.9876 8.03063 15.2806C7.73757 15.5737 7.26243 15.5737 6.96937 15.2806L0.219375 8.53063C0.0785421 8.38995 -0.000590086 8.19906 -0.000590086 8C-0.000590086 7.80094 0.0785421 7.61005 0.219375 7.46937L6.96937 0.719375C7.26243 0.426319 7.73757 0.426319 8.03063 0.719375C8.32368 1.01243 8.32368 1.48757 8.03063 1.78062L2.56031 7.25H17.25C17.6642 7.25 18 7.58579 18 8V8Z" fill="#1A170F"/>
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
          {/* Equipment Control Section */}
          <div className="equipment-section">
            <div className="section-title">
              <h2>อุปกรณ์ที่สามารถควบคุมได้</h2>
            </div>

            {/* Control Item 1 */}
            <div className="control-item">
              <div className="control-content">
                <div className="control-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <g clipPath="url(#clip0_5_775)">
                      <path fillRule="evenodd" clipRule="evenodd" d="M21.8438 12.6562C21.3832 10.9359 20.1352 9.53533 18.4791 8.88026C16.8231 8.2252 14.9546 8.39306 13.4419 9.33281L14.9784 3.19781C15.0566 2.88525 14.9264 2.55768 14.655 2.38406C12.9181 1.2873 10.7214 1.22457 8.92477 2.22043C7.12811 3.2163 6.01718 5.11236 6.0268 7.16654C6.03641 9.22072 7.16503 11.1063 8.97094 12.0853L2.88937 13.8225C2.57956 13.9107 2.36069 14.187 2.34562 14.5087C2.22671 17.1469 3.95904 19.5126 6.51 20.1956C6.98758 20.3239 7.47988 20.3891 7.97437 20.3897C9.49675 20.3857 10.9526 19.7654 12.0102 18.6704C13.0678 17.5754 13.637 16.0988 13.5881 14.5772L18.1331 18.9759C18.3649 19.2002 18.7141 19.2512 19.0003 19.1025C21.3431 17.887 22.5257 15.206 21.8438 12.6562V12.6562ZM10.5 12C10.5 11.1716 11.1716 10.5 12 10.5C12.8284 10.5 13.5 11.1716 13.5 12C13.5 12.8284 12.8284 13.5 12 13.5C11.1716 13.5 10.5 12.8284 10.5 12V12ZM7.5 7.125C7.49952 5.7123 8.22201 4.39761 9.41481 3.64068C10.6076 2.88375 12.1048 2.78987 13.3828 3.39188L11.9784 9C10.884 9.00821 9.8808 9.61183 9.36094 10.575C8.19698 9.81382 7.4968 8.51575 7.5 7.125V7.125ZM10.0312 18.3347C8.8081 19.0414 7.30836 19.0731 6.05646 18.4186C4.80456 17.7642 3.97462 16.5146 3.85687 15.1069L9.41719 13.5188C9.95508 14.435 10.9375 14.9985 12 15H12.0853C12.0086 16.3874 11.2358 17.642 10.0312 18.3347V18.3347ZM19.9847 16.1784C19.6812 16.7048 19.265 17.1575 18.7659 17.5041L14.6109 13.4831C15.1525 12.5318 15.1313 11.3607 14.5556 10.4297C16.1847 9.60729 18.1606 9.95307 19.4136 11.2798C20.6666 12.6066 20.8989 14.599 19.9847 16.1784V16.1784Z" fill="#1A170F"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_5_775">
                        <rect width="24" height="24" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div className="control-info">
                  <h3>1. กังหันน้ำ</h3>
                  <p>กดเพื่อหมุนกังหันน้ำ</p>
                </div>
              </div>
              <div className="toggle-switch" onClick={(e) => toggleSwitch(e.currentTarget)}>
                <div className="toggle-slider"></div>
              </div>
            </div>

            {/* Control Item 2 */}
            <div className="control-item">
              <div className="control-content">
                <div className="control-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <g clipPath="url(#clip0_5_775_2)">
                      <path fillRule="evenodd" clipRule="evenodd" d="M21.8438 12.6562C21.3832 10.9359 20.1352 9.53533 18.4791 8.88026C16.8231 8.2252 14.9546 8.39306 13.4419 9.33281L14.9784 3.19781C15.0566 2.88525 14.9264 2.55768 14.655 2.38406C12.9181 1.2873 10.7214 1.22457 8.92477 2.22043C7.12811 3.2163 6.01718 5.11236 6.0268 7.16654C6.03641 9.22072 7.16503 11.1063 8.97094 12.0853L2.88937 13.8225C2.57956 13.9107 2.36069 14.187 2.34562 14.5087C2.22671 17.1469 3.95904 19.5126 6.51 20.1956C6.98758 20.3239 7.47988 20.3891 7.97437 20.3897C9.49675 20.3857 10.9526 19.7654 12.0102 18.6704C13.0678 17.5754 13.637 16.0988 13.5881 14.5772L18.1331 18.9759C18.3649 19.2002 18.7141 19.2512 19.0003 19.1025C21.3431 17.887 22.5257 15.206 21.8438 12.6562V12.6562ZM10.5 12C10.5 11.1716 11.1716 10.5 12 10.5C12.8284 10.5 13.5 11.1716 13.5 12C13.5 12.8284 12.8284 13.5 12 13.5C11.1716 13.5 10.5 12.8284 10.5 12V12ZM7.5 7.125C7.49952 5.7123 8.22201 4.39761 9.41481 3.64068C10.6076 2.88375 12.1048 2.78987 13.3828 3.39188L11.9784 9C10.884 9.00821 9.8808 9.61183 9.36094 10.575C8.19698 9.81382 7.4968 8.51575 7.5 7.125V7.125ZM10.0312 18.3347C8.8081 19.0414 7.30836 19.0731 6.05646 18.4186C4.80456 17.7642 3.97462 16.5146 3.85687 15.1069L9.41719 13.5188C9.95508 14.435 10.9375 14.9985 12 15H12.0853C12.0086 16.3874 11.2358 17.642 10.0312 18.3347V18.3347ZM19.9847 16.1784C19.6812 16.7048 19.265 17.1575 18.7659 17.5041L14.6109 13.4831C15.1525 12.5318 15.1313 11.3607 14.5556 10.4297C16.1847 9.60729 18.1606 9.95307 19.4136 11.2798C20.6666 12.6066 20.8989 14.599 19.9847 16.1784V16.1784Z" fill="#1A170F"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_5_775_2">
                        <rect width="24" height="24" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div className="control-info">
                  <h3>2. ยกยอขึ้น</h3>
                  <p>กดเพื่อยกยอทันที</p>
                </div>
              </div>
              <div className="toggle-switch" onClick={(e) => toggleSwitch(e.currentTarget)}>
                <div className="toggle-slider"></div>
              </div>
            </div>
          </div>

          {/* Sensor Status Section */}
          <div className="sensor-status-section">
            <div className="section-title">
              <h2>Sensor Status</h2>
            </div>
            
            <div className="sensor-grid">
              {/* Row 1 */}
              <div className="sensor-row">
                {/* pH Sensor */}
                <div className="sensor-card green">
                  <div className="sensor-icon">
                    <svg width="21" height="15" viewBox="0 0 21 15" fill="none">
                      <path fillRule="evenodd" clipRule="evenodd" d="M20.75 11.125C20.75 12.989 19.239 14.5 17.375 14.5C15.511 14.5 14 12.989 14 11.125V1.75H8V13.75C8 14.1642 7.66421 14.5 7.25 14.5C6.83579 14.5 6.5 14.1642 6.5 13.75V1.75H5.75C3.67893 1.75 2 3.42893 2 5.5C2 5.91421 1.66421 6.25 1.25 6.25C0.835786 6.25 0.5 5.91421 0.5 5.5C0.5031 2.60179 2.85179 0.2531 5.75 0.25H20C20.4142 0.25 20.75 0.585786 20.75 1C20.75 1.41421 20.4142 1.75 20 1.75H15.5V11.125C15.5 12.1605 16.3395 13 17.375 13C18.4105 13 19.25 12.1605 19.25 11.125C19.25 10.7108 19.5858 10.375 20 10.375C20.4142 10.375 20.75 10.7108 20.75 11.125V11.125Z" fill="black"/>
                    </svg>
                  </div>
                  <div className="sensor-label">pH</div>
                </div>

                {/* DO Sensor */}
                <div className="sensor-card green">
                  <div className="sensor-icon">
                    <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
                      <path fillRule="evenodd" clipRule="evenodd" d="M13.3125 4.47656C12.1545 3.13916 10.8511 1.93486 9.42656 0.885938C9.16823 0.704968 8.82427 0.704968 8.56594 0.885938C7.14399 1.9353 5.84317 3.13958 4.6875 4.47656C2.11031 7.43625 0.75 10.5563 0.75 13.5C0.75 18.0563 4.44365 21.75 9 21.75C13.5563 21.75 17.25 18.0563 17.25 13.5C17.25 10.5563 15.8897 7.43625 13.3125 4.47656V4.47656ZM9 20.25C5.27379 20.2459 2.25413 17.2262 2.25 13.5C2.25 8.13469 7.45031 3.65625 9 2.4375C10.5497 3.65625 15.75 8.13281 15.75 13.5C15.7459 17.2262 12.7262 20.2459 9 20.25V20.25ZM14.2397 14.3756C13.8414 16.6005 12.0996 18.3419 9.87469 18.7397C9.83345 18.7463 9.79176 18.7497 9.75 18.75C9.35993 18.7499 9.03506 18.4508 9.00277 18.0621C8.97048 17.6734 9.24155 17.3248 9.62625 17.2603C11.1797 16.9988 12.4978 15.6806 12.7612 14.1244C12.8306 13.7159 13.218 13.4409 13.6266 13.5103C14.0351 13.5797 14.31 13.9671 14.2406 14.3756H14.2397Z" fill="#0D1C0D"/>
                    </svg>
                  </div>
                  <div className="sensor-label">DO</div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="sensor-row">
                {/* Temperature Sensor */}
                <div className="sensor-card red">
                  <div className="sensor-icon">
                    <svg width="18" height="24" viewBox="0 0 18 24" fill="none">
                      <path fillRule="evenodd" clipRule="evenodd" d="M14.875 5.25C13.4253 5.25 12.25 6.42525 12.25 7.875C12.25 9.32475 13.4253 10.5 14.875 10.5C16.3247 10.5 17.5 9.32475 17.5 7.875C17.5 6.42525 16.3247 5.25 14.875 5.25V5.25ZM14.875 9C14.2537 9 13.75 8.49632 13.75 7.875C13.75 7.25368 14.2537 6.75 14.875 6.75C15.4963 6.75 16 7.25368 16 7.875C16 8.49632 15.4963 9 14.875 9V9ZM7 14.3438V8.25C7 7.83579 6.66421 7.5 6.25 7.5C5.83579 7.5 5.5 7.83579 5.5 8.25V14.3438C4.03727 14.7214 3.08356 16.1278 3.27391 17.6265C3.46427 19.1252 4.7393 20.2485 6.25 20.2485C7.7607 20.2485 9.03573 19.1252 9.22609 17.6265C9.41644 16.1278 8.46273 14.7214 7 14.3438V14.3438ZM6.25 18.75C5.42157 18.75 4.75 18.0784 4.75 17.25C4.75 16.4216 5.42157 15.75 6.25 15.75C7.07843 15.75 7.75 16.4216 7.75 17.25C7.75 18.0784 7.07843 18.75 6.25 18.75V18.75ZM10 12.5625V4.5C10 2.42893 8.32107 0.75 6.25 0.75C4.17893 0.75 2.5 2.42893 2.5 4.5V12.5625C0.511202 14.1548 -0.255158 16.8295 0.588618 19.2334C1.43239 21.6373 3.7023 23.2462 6.25 23.2462C8.7977 23.2462 11.0676 21.6373 11.9114 19.2334C12.7552 16.8295 11.9888 14.1548 10 12.5625V12.5625ZM6.25 21.75C4.28349 21.7502 2.54464 20.4734 1.95598 18.597C1.36731 16.7207 2.0652 14.6795 3.67937 13.5562C3.8814 13.4152 4.00125 13.1839 4 12.9375V4.5C4 3.25736 5.00736 2.25 6.25 2.25C7.49264 2.25 8.5 3.25736 8.5 4.5V12.9375C8.49998 13.1826 8.61969 13.4122 8.82063 13.5525C10.4383 14.6746 11.1387 16.718 10.5496 18.5965C9.96052 20.475 8.21872 21.7525 6.25 21.75V21.75Z" fill="#0D1C0D"/>
                    </svg>
                  </div>
                  <div className="sensor-label">Temp</div>
                </div>

                {/* Camera Sensor */}
                <div className="sensor-card red">
                  <div className="sensor-icon">
                    <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
                      <path fillRule="evenodd" clipRule="evenodd" d="M17.5 2.25H14.9013L13.6234 0.33375C13.4844 0.125363 13.2505 0.000150423 13 0H7C6.74949 0.000150423 6.51559 0.125363 6.37656 0.33375L5.09781 2.25H2.5C1.25736 2.25 0.25 3.25736 0.25 4.5V15C0.25 16.2426 1.25736 17.25 2.5 17.25H17.5C18.7426 17.25 19.75 16.2426 19.75 15V4.5C19.75 3.25736 18.7426 2.25 17.5 2.25V2.25ZM18.25 15C18.25 15.4142 17.9142 15.75 17.5 15.75H2.5C2.08579 15.75 1.75 15.4142 1.75 15V4.5C1.75 4.08579 2.08579 3.75 2.5 3.75H5.5C5.75084 3.75016 5.98516 3.62491 6.12438 3.41625L7.40125 1.5H12.5978L13.8756 3.41625C14.0148 3.62491 14.2492 3.75016 14.5 3.75H17.5C17.9142 3.75 18.25 4.08579 18.25 4.5V15ZM10 5.25C7.72183 5.25 5.875 7.09683 5.875 9.375C5.875 11.6532 7.72183 13.5 10 13.5C12.2782 13.5 14.125 11.6532 14.125 9.375C14.1224 7.0979 12.2771 5.25258 10 5.25V5.25ZM10 12C8.55025 12 7.375 10.8247 7.375 9.375C7.375 7.92525 8.55025 6.75 10 6.75C11.4497 6.75 12.625 7.92525 12.625 9.375C12.625 10.8247 11.4497 12 10 12V12Z" fill="#0D1C0D"/>
                    </svg>
                  </div>
                  <div className="sensor-label">Camera</div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Control Section */}
          <div className="additional-controls-section">
            <div className="section-title">
              <h2>การตั้งค่าเพิ่มเติม</h2>
            </div>

            <div className="control-item">
              <div className="control-content">
                <div className="control-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#1A170F"/>
                  </svg>
                </div>
                <div className="control-info">
                  <h3>3. ระบบแจ้งเตือน</h3>
                  <p>เปิด/ปิดการแจ้งเตือนอัตโนมัติ</p>
                </div>
              </div>
              <div className="toggle-switch" onClick={(e) => toggleSwitch(e.currentTarget)}>
                <div className="toggle-slider"></div>
              </div>
            </div>

            <div className="control-item">
              <div className="control-content">
                <div className="control-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#1A170F"/>
                  </svg>
                </div>
                <div className="control-info">
                  <h3>4. ระบบบันทึกข้อมูล</h3>
                  <p>เปิด/ปิดการบันทึกข้อมูลอัตโนมัติ</p>
                </div>
              </div>
              <div className="toggle-switch" onClick={(e) => toggleSwitch(e.currentTarget)}>
                <div className="toggle-slider"></div>
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

        .control-container {
          background-color: #fcfaf7;
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
        }

        .main-frame {
          background-color: #fcfaf7;
          min-height: 100vh;
          width: 100%;
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
          padding: 16px 16px 32px 16px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* Equipment Section */
        .equipment-section {
          background-color: #ffffff;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .section-title {
          margin-bottom: 20px;
        }

        .section-title h2 {
          font-family: 'Inter', 'Noto Sans Thai', sans-serif;
          font-weight: 700;
          font-size: 20px;
          line-height: 24px;
          color: #1c170d;
          margin: 0;
        }

        .control-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .control-item:last-child {
          border-bottom: none;
        }

        .control-content {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
        }

        .control-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f9fafb;
          border-radius: 12px;
          flex-shrink: 0;
        }

        .control-info h3 {
          font-family: 'Inter', 'Noto Sans Thai', sans-serif;
          font-weight: 600;
          font-size: 18px;
          line-height: 22px;
          color: #1c170d;
          margin: 0 0 4px 0;
        }

        .control-info p {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          line-height: 17px;
          color: #6b7280;
          margin: 0;
        }

        /* Toggle Switch */
        .toggle-switch {
          width: 60px;
          height: 32px;
          background-color: #d1d5db;
          border-radius: 16px;
          position: relative;
          cursor: pointer;
          transition: background-color 0.3s ease;
          flex-shrink: 0;
        }

        .toggle-switch.active {
          background-color: #f2c245;
        }

        .toggle-slider {
          width: 28px;
          height: 28px;
          background-color: #ffffff;
          border-radius: 50%;
          position: absolute;
          top: 2px;
          left: 2px;
          transition: transform 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .toggle-switch.active .toggle-slider {
          transform: translateX(28px);
        }

        /* Sensor Status Section */
        .sensor-status-section {
          background-color: #ffffff;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        /* Additional Controls Section */
        .additional-controls-section {
          background-color: #ffffff;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .sensor-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .sensor-row {
          display: flex;
          gap: 16px;
        }

        .sensor-card {
          flex: 1;
          background-color: #f9fafb;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          border: 2px solid;
        }

        .sensor-card.green {
          border-color: #10b981;
        }

        .sensor-card.red {
          border-color: #ef4444;
        }

        .sensor-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #ffffff;
          border-radius: 12px;
        }

        .sensor-label {
          font-family: 'Inter', 'Noto Sans Thai', sans-serif;
          font-weight: 600;
          font-size: 16px;
          line-height: 20px;
          color: #1c170d;
          text-align: center;
        }

        /* Responsive Design */
        @media (max-width: 480px) {
          .content-area {
            padding: 12px;
            gap: 16px;
          }
          
          .equipment-section,
          .sensor-status-section,
          .additional-controls-section {
            padding: 20px;
          }
          
          .section-title h2 {
            font-size: 18px;
          }
          
          .control-info h3 {
            font-size: 16px;
          }
          
          .sensor-row {
            flex-direction: column;
            gap: 12px;
          }
          
          .sensor-card {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  )
}
