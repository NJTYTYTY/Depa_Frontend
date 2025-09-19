'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useGraphData } from '@/hooks/use-graph-data'
import SensorGraph from '@/components/SensorGraph'

export default function GraphPage() {
  const router = useRouter()
  const params = useParams()
  const pondId = parseInt(params.id as string)

  const goBack = () => router.push('/ponds')

  // Fetch graph data for regular sensors (24 hours)
  const { data: graphData, isLoading, error } = useGraphData({ 
    pondId,
    hours: 24,
    enabled: !!pondId
  })

  // Hardcoded shrimp size data for 30 days
  const generateShrimpSizeData = () => {
    const data = []
    const now = new Date()
    let currentSize = 2.0 // Start at 2cm
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      
      // More realistic growth pattern
      // Some days no growth, some days small growth, occasional setbacks
      const growthChance = Math.random()
      let growth = 0
      
      if (growthChance < 0.3) {
        // 30% chance of no growth
        growth = 0
      } else if (growthChance < 0.8) {
        // 50% chance of small growth (0.1-0.3cm)
        growth = 0.1 + Math.random() * 0.2
      } else if (growthChance < 0.95) {
        // 15% chance of good growth (0.3-0.5cm)
        growth = 0.3 + Math.random() * 0.2
      } else {
        // 5% chance of setback (-0.1 to 0cm)
        growth = -0.1 + Math.random() * 0.1
      }
      
      currentSize += growth
      currentSize = Math.max(1.5, Math.min(8.5, currentSize)) // Keep within bounds
      
      data.push({
        timestamp: date.toISOString(),
        value: parseFloat(currentSize.toFixed(1)),
        status: currentSize > 6 ? 'green' : currentSize > 4 ? 'yellow' : 'red'
      })
    }
    
    return {
      sensor_type: 'Shrimp Size (CM)',
      data_points: data,
      min_value: Math.min(...data.map(d => d.value)),
      max_value: Math.max(...data.map(d => d.value)),
      average_value: data.reduce((sum, d) => sum + d.value, 0) / data.length,
      trend: data[data.length - 1].value > data[0].value ? 'increasing' : 'decreasing',
      unit: 'cm'
    }
  }

  const shrimpSizeData = generateShrimpSizeData()

  // Define sensor colors
  const sensorColors = {
    'DO': '#10B981',      // Green
    'pH': '#F59E0B',      // Yellow
    'temperature': '#EF4444', // Red
    'shrimpSize': '#8B5CF6' // Purple
  }

  // Define sensor display names
  const sensorDisplayNames = {
    'DO': 'DO',
    'pH': 'pH',
    'temperature': 'Temperature',
    'shrimpSize': 'Shrimp Size (CM)'
  }

  if (isLoading) {
    return (
      <div className="w-full flex flex-col h-full bg-[#fcfaf7]">
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
              <h1 className="font-bold text-lg leading-6 text-[#1c170d] text-center m-0">บ่อที่ {pondId}</h1>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">กำลังโหลดข้อมูลกราฟ...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full flex flex-col h-full bg-[#fcfaf7]">
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
              <h1 className="font-bold text-lg leading-6 text-[#1c170d] text-center m-0">บ่อที่ {pondId}</h1>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <p className="text-red-600 mb-2">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
            <p className="text-gray-600 text-sm">กรุณาลองใหม่อีกครั้ง</p>
          </div>
        </div>
      </div>
    )
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
            <h1 className="font-bold text-lg leading-6 text-[#1c170d] text-center m-0">บ่อที่ {pondId}</h1>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 flex flex-col gap-6">
        {/* Title Section */}
        <div className="text-center">
          <h2 className="font-bold text-xl text-[#1c170d] m-0">ข้อมูลของเซนเซอร์</h2>
          <p className="text-sm text-gray-600 mt-1">ข้อมูลแบบ Real-time (อัปเดตทุก 5 วินาที)</p>
        </div>

        {/* Regular Sensor Cards (DO, pH, Temperature) - 24 hours */}
        <div className="flex flex-col gap-5">
          {graphData?.sensors ? (
            Object.entries(graphData.sensors)
              .filter(([sensorType]) => sensorType !== 'minerals' && sensorType !== 'shrimpSize') // Filter out minerals and shrimpSize
               .map(([sensorType, sensorData]) => {
                 // Get the specific color for this sensor type
                 const sensorColor = sensorColors[sensorType as keyof typeof sensorColors]
                 
                 return (
                   <SensorGraph
                     key={sensorType}
                     data={{
                       ...sensorData,
                       sensor_type: sensorDisplayNames[sensorType as keyof typeof sensorDisplayNames] || sensorType
                     }}
                     color={sensorColor || '#6B7280'}
                     height={200}
                   />
                 )
               })
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">ไม่มีข้อมูลเซนเซอร์</p>
            </div>
          )}
        </div>

        {/* Shrimp Size Card - 30 days */}
        <div className="mt-6">
          <SensorGraph
            data={shrimpSizeData}
            color="#8B5CF6"
            height={200}
          />
        </div>
      </div>
    </div>
  )
}
