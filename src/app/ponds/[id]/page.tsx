'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { usePonds } from '@/hooks/use-ponds'

export default function PondDetailPage() {
  const router = useRouter()
  const params = useParams()
  const pondId = params.id
  const { data: ponds } = usePonds()
  
  // Find the current pond
  const pond = ponds?.find(p => p.id === pondId)

  const goBack = () => router.back()

  const viewImage = (type: string) => {
    alert('เปิดดูรูป' + type)
  }

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
              <h1 className="font-bold text-lg leading-6 text-[#1c170d] text-center m-0">{pond?.name || 'บ่อที่ 1'}</h1>
            </div>
          </div>
        </div>


        {/* Today Section */}
        <div className="px-4 pb-4">
          <h2 className="font-bold text-xl text-[#1c170d] m-0">วันนี้</h2>
        </div>

        {/* Sensor Cards */}
        <div className="px-4 pb-8 flex flex-col gap-4">
          {/* DO Card */}
          <div className="bg-white rounded-2xl p-5 border-2 border-green-500 shadow-lg">
            <div>
              <h3 className="font-semibold text-lg text-[#1c170d] mb-3 m-0">DO (ค่าออกซิเจนในน้ำ)</h3>
              <div className="font-bold text-2xl text-[#1c170d] mb-3">6.5 mg/L</div>
            </div>
          </div>

          {/* pH Card */}
          <div className="bg-white rounded-2xl p-5 border-2 border-yellow-500 shadow-lg">
            <div>
              <h3 className="font-semibold text-lg text-[#1c170d] mb-3 m-0">pH</h3>
              <div className="font-bold text-2xl text-[#1c170d] mb-3">8.2</div>
            </div>
          </div>

          {/* Temperature Card */}
          <div className="bg-white rounded-2xl p-5 border-2 border-green-500 shadow-lg">
            <div>
              <h3 className="font-semibold text-lg text-[#1c170d] mb-3 m-0">อุณหภูมิ</h3>
              <div className="font-bold text-2xl text-[#1c170d] mb-3">29.5 °C</div>
            </div>
          </div>

          {/* Shrimp Size Card */}
          <div className="bg-white rounded-2xl p-6 border-2 border-green-500 shadow-lg">
            <div>
              <h3 className="font-semibold text-lg text-[#1c170d] mb-3 m-0">ขนาดของตัวกุ้ง</h3>
              <div className="font-bold text-2xl text-[#1c170d] mb-3">5 cm</div>
              <div className="font-semibold text-base text-green-500 mb-4">+2%</div>
              <button className="bg-[#f2c245] border-none rounded-2xl px-6 py-3 font-semibold text-sm text-[#1c170d] cursor-pointer transition-colors w-full hover:bg-[#e6b63d]" onClick={() => viewImage('shrimp')}>กดเพื่อดูรูป</button>
            </div>
          </div>

          {/* Food Remaining Card */}
          <div className="bg-white rounded-2xl p-5 border-2 border-[#f2c245] shadow-lg">
            <div>
              <h3 className="font-semibold text-lg text-[#1c170d] mb-4 m-0">อาหารเหลือบนยอกุ้ง</h3>
              <button className="bg-[#f2c245] border-none rounded-2xl px-4 py-2 font-semibold text-xs text-[#1c170d] cursor-pointer transition-colors w-full hover:bg-[#e6b63d]" onClick={() => viewImage('food')}>กดเพื่อดูรูป</button>
            </div>
          </div>

          {/* Water Color Card */}
          <div className="bg-white rounded-2xl p-6 border-2 border-yellow-500 shadow-lg">
            <div>
              <h3 className="font-semibold text-lg text-[#1c170d] mb-3 m-0">สีของน้ำ</h3>
              <div className="font-bold text-2xl text-[#1c170d] mb-3">สีเขียว</div>
              <button className="bg-[#f2c245] border-none rounded-2xl px-6 py-3 font-semibold text-sm text-[#1c170d] cursor-pointer transition-colors w-full hover:bg-[#e6b63d]" onClick={() => viewImage('water')}>กดเพื่อดูรูป</button>
            </div>
          </div>

          {/* Minerals Card */}
          <div className="bg-white rounded-2xl p-5 border-2 border-red-500 shadow-lg">
            <div>
              <h3 className="font-semibold text-lg text-[#1c170d] mb-3 m-0">แร่ธาตุคงเหลือ</h3>
              <div className="font-bold text-2xl text-[#1c170d] mb-3">0.5 กิโลกรัม</div>
            </div>
          </div>
        </div>
    </div>
  )
}
