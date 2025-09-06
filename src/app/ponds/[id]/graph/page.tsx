'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function GraphPage() {
  const router = useRouter()
  const params = useParams()
  const pondId = params.id

  const goBack = () => router.back()

  return (
    <div className="w-full flex flex-col h-full bg-[#fcfaf7]">
        {/* Header */}
        <div className="bg-[#fcfaf7] w-full flex-shrink-0">
          <div className="flex items-center px-4 py-2 w-full">
            <div className="w-12 h-12 flex items-center justify-start cursor-pointer flex-shrink-0" onClick={goBack}>
              <div className="w-6 h-6 flex items-center justify-center">
                <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M18 8C18 8.41421 17.6642 8.75 17.25 8.75H2.56031L8.03063 14.2194C8.32368 14.5124 8.32368 14.9876 8.03063 15.2806C7.73757 15.5737 7.26243 15.5737 6.96937 15.2806L0.219375 8.53063C0.0785421 8.38995 -0.000590086 8.19906 -0.000590086 8C-0.000590086 7.80094 0.0785421 7.61005 0.219375 7.46937L6.96937 0.719375C7.26243 0.426319 7.73757 0.426319 8.03063 0.719375C8.32368 1.01243 8.32368 1.48757 8.03063 1.78062L2.56031 7.25H17.25C17.6642 7.25 18 7.58579 18 8V8Z" fill="#1C170D"/>
                </svg>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center pr-12">
              <h1 className="font-bold text-lg leading-6 text-[#1c170d] text-center m-0">บ่อที่ 1</h1>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 flex flex-col gap-6">
          {/* Title Section */}
          <div className="text-center">
            <h2 className="font-bold text-xl text-[#1c170d] m-0">ข้อมูลของเซนเซอร์</h2>
          </div>

          {/* Graph Cards */}
          <div className="flex flex-col gap-5">
            {/* DO Card */}
            <div className="bg-white rounded-2xl p-6 border-2 border-green-500 shadow-lg">
              <div className="mb-5">
                <h3 className="font-semibold text-lg text-[#1c170d] mb-2 m-0">DO</h3>
                <div className="font-bold text-2xl text-[#1c170d] mb-2">6.5</div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Last 24h</span>
                  <span className="text-red-500 font-medium">-0.2%</span>
                </div>
              </div>
              <div className="relative">
                <svg className="w-full h-auto max-w-[306px] mx-auto block" viewBox="0 0 306 148">
                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#F2F0E8', stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: '#F2F0E8', stopOpacity: 0 }} />
                    </linearGradient>
                  </defs>
                  <path d="M0 71L24 14L48 27L72 61L95 22L118 66L141 40L165 30L188 79L212 97L235 1L258 53L282 84L306 17V148H0Z" fill="url(#gradient1)"/>
                  <path d="M0 71L24 14L48 27L72 61L95 22L118 66L141 40L165 30L188 79L212 97L235 1L258 53L282 84L306 17" stroke="black" strokeWidth="3" fill="none"/>
                </svg>
                <div className="flex justify-between mt-3 text-xs text-gray-500">
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
  )
}
