'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { usePonds } from '@/hooks/use-ponds'
import { useLatestSensorData } from '@/hooks/use-readings'

export default function PondDetailPage() {
  const router = useRouter()
  const params = useParams()
  const pondId = params.id as string
  const { data: ponds } = usePonds()
  
  // Find the current pond
  const pond = ponds?.find(p => p.id === pondId)

  // Use the new batch sensor data hook
  const { data: latestData, isLoading: isLoadingLatest, error } = useLatestSensorData(pondId)

  // State for sensor data with fallback
  const [sensorData, setSensorData] = useState<{
    [key: string]: { value: any; status: string; timestamp: string | null; imageUrl?: string }
  }>({
    DO: { value: 0.0, status: 'green', timestamp: null },
    pH: { value: 0.0, status: 'green', timestamp: null },
    temperature: { value: 0.0, status: 'green', timestamp: null },
    shrimpSize: { value: 0.0, status: 'green', timestamp: null },
    waterColor: { value: 'สีเขียว', status: 'green', timestamp: null },
    minerals: { value: 0.0, status: 'red', timestamp: null }
  })

  const goBack = () => router.push('/ponds')

  const viewImage = (type: string) => {
    // Get the image URL from sensor data
    let imageUrl = ''
    
    switch (type) {
      case 'shrimp':
        imageUrl = sensorData.shrimpSize?.imageUrl || 'https://batch-example.com/size.ngrok'
        break
      case 'food':
        imageUrl = sensorData.food?.imageUrl || 'https://batch-example.com/food.ngrok'
        break
      case 'water':
        imageUrl = sensorData.waterColor?.imageUrl || 'https://batch-example.com/water.ngrok'
        break
      default:
        imageUrl = 'https://batch-example.com/default.ngrok'
    }
    
    // Open image in new tab
    if (imageUrl) {
      window.open(imageUrl, '_blank')
    } else {
      alert('ไม่พบลิงก์รูปภาพ')
    }
  }

  // Update sensor data when latestData changes
  useEffect(() => {
    console.log('🔄 useEffect triggered with latestData:', latestData)
    console.log('🔄 isLoadingLatest:', isLoadingLatest)
    console.log('🔄 error:', error)
    
    if (latestData?.data?.sensors) {
      console.log('📊 Processing latestData.data.sensors:', latestData.data.sensors)
      const newSensorData: { [key: string]: { value: any; status: string; timestamp: string | null; imageUrl?: string } } = { ...sensorData }
      
      // Map backend sensor names to frontend display names
      const sensorMapping: { [key: string]: string } = {
        'DO': 'DO',
        'pH': 'pH',
        'temperature': 'temperature',
        'shrimpSize': 'shrimpSize',
        'minerals': 'minerals',
        'waterColor': 'waterColor',
        'waterColorPicture': 'waterColorPicture', // Keep as separate for image URL
        'sizePicture': 'sizePicture', // Keep as separate for image URL
        'foodPicture': 'foodPicture' // Keep as separate for image URL
      }
      
      Object.keys(latestData.data.sensors).forEach((backendKey: string) => {
        const frontendKey = sensorMapping[backendKey] || backendKey
        const data = (latestData.data.sensors as any)[backendKey]
        
        console.log(`🔍 Processing sensor: ${backendKey} -> ${frontendKey}`, data)
        
        if (data && typeof data === 'object') {
          if (backendKey === 'sizePicture') {
            // Store image URL for shrimp size
            if (newSensorData.shrimpSize) {
              newSensorData.shrimpSize.imageUrl = data.value
            }
          } else if (backendKey === 'foodPicture') {
            // Store image URL for food
            if (!newSensorData.food) {
              newSensorData.food = { value: 'อาหารเหลือ', status: 'info', timestamp: null }
            }
            newSensorData.food.imageUrl = data.value
          } else if (backendKey === 'waterColorPicture') {
            // Store image URL for water color
            if (newSensorData.waterColor) {
              newSensorData.waterColor.imageUrl = data.value
            }
          } else {
            // Store regular sensor data
            newSensorData[frontendKey] = {
              value: data.value,
              status: data.status || 'green',
              timestamp: data.timestamp || null,
              imageUrl: undefined
            }
          }
        }
      })
      
      console.log('📊 New sensor data before setState:', newSensorData)
      setSensorData(newSensorData)
      console.log('📊 Updated sensor data from batch storage:', newSensorData)
      console.log('📊 Source:', latestData.source)
    } else {
      console.log('❌ No latestData.data available')
    }
  }, [latestData, isLoadingLatest, error])

  // Function to get status color class
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'green':
        return 'border-green-500'
      case 'yellow':
        return 'border-yellow-500'
      case 'red':
        return 'border-red-500'
      default:
        return 'border-gray-500'
    }
  }

  // Function to format value with unit
  const formatValue = (sensorType: string, value: any) => {
    switch (sensorType) {
      case 'DO':
        return `${value} mg/L`
      case 'pH':
        return value.toString()
      case 'temperature':
        return `${value} °C`
      case 'shrimpSize':
        return `${value} cm`
      case 'waterColor':
        return value
      case 'minerals':
        return `${value} กิโลกรัม`
      default:
        return value.toString()
    }
  }

  if (isLoadingLatest) {
    return (
      <div className="w-full flex flex-col h-full bg-[#fcfaf7] items-center justify-center">
        <div className="text-lg text-[#1c170d]">กำลังโหลดข้อมูล...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full flex flex-col h-full bg-[#fcfaf7] items-center justify-center">
        <div className="text-lg text-red-600">เกิดข้อผิดพลาด: {error.message}</div>
        <div className="text-sm text-gray-500 mt-2">กำลังใช้ข้อมูลสำรอง</div>
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
              <h1 className="font-bold text-lg leading-6 text-[#1c170d] text-center m-0">{pond?.name || 'บ่อที่ 1'}</h1>
            </div>
          </div>
        </div>

        {/* Today Section */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-xl text-[#1c170d] m-0">วันนี้</h2>
            {latestData?.source && (
              <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                latestData.source === 'batch' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {latestData.source === 'batch' ? '🚀 Batch Storage' : '📊 Individual'}
              </div>
            )}
          </div>
        </div>

        {/* Sensor Cards */}
        <div className="px-4 pb-8 flex flex-col gap-4">
          {/* DO Card */}
          <div className={`bg-white rounded-2xl p-5 border-2 ${getStatusColor(sensorData.DO.status)} shadow-lg`}>
            <div>
              <h3 className="font-semibold text-lg text-[#1c170d] mb-3 m-0">DO (ค่าออกซิเจนในน้ำ)</h3>
              <div className="font-bold text-2xl text-[#1c170d] mb-3">{formatValue('DO', sensorData.DO.value)}</div>
              {sensorData.DO.timestamp && (
                <div className="text-xs text-gray-500">
                  อัปเดตล่าสุด: {new Date(sensorData.DO.timestamp).toLocaleString('th-TH')}
                </div>
              )}
            </div>
          </div>

          {/* pH Card */}
          <div className={`bg-white rounded-2xl p-5 border-2 ${getStatusColor(sensorData.pH.status)} shadow-lg`}>
            <div>
              <h3 className="font-semibold text-lg text-[#1c170d] mb-3 m-0">pH</h3>
              <div className="font-bold text-2xl text-[#1c170d] mb-3">{formatValue('pH', sensorData.pH.value)}</div>
              {sensorData.pH.timestamp && (
                <div className="text-xs text-gray-500">
                  อัปเดตล่าสุด: {new Date(sensorData.pH.timestamp).toLocaleString('th-TH')}
                </div>
              )}
            </div>
          </div>

          {/* Temperature Card */}
          <div className={`bg-white rounded-2xl p-5 border-2 ${getStatusColor(sensorData.temperature.status)} shadow-lg`}>
            <div>
              <h3 className="font-semibold text-lg text-[#1c170d] mb-3 m-0">อุณหภูมิ</h3>
              <div className="font-bold text-2xl text-[#1c170d] mb-3">{formatValue('temperature', sensorData.temperature.value)}</div>
              {sensorData.temperature.timestamp && (
                <div className="text-xs text-gray-500">
                  อัปเดตล่าสุด: {new Date(sensorData.temperature.timestamp).toLocaleString('th-TH')}
                </div>
              )}
            </div>
          </div>

          {/* Shrimp Size Card */}
          <div className={`bg-white rounded-2xl p-6 border-2 ${getStatusColor(sensorData.shrimpSize.status)} shadow-lg`}>
            <div>
              <h3 className="font-semibold text-lg text-[#1c170d] mb-3 m-0">ขนาดของตัวกุ้ง</h3>
              <div className="font-bold text-2xl text-[#1c170d] mb-3">{formatValue('shrimpSize', sensorData.shrimpSize.value)}</div>
              <div className="font-semibold text-base text-green-500 mb-4">+2%</div>
              <button className="bg-[#f2c245] border-none rounded-2xl px-6 py-3 font-semibold text-sm text-[#1c170d] cursor-pointer transition-colors w-full hover:bg-[#e6b63d]" onClick={() => viewImage('shrimp')}>กดเพื่อดูรูป</button>
              {sensorData.shrimpSize.timestamp && (
                <div className="text-xs text-gray-500 mt-2">
                  อัปเดตล่าสุด: {new Date(sensorData.shrimpSize.timestamp).toLocaleString('th-TH')}
                </div>
              )}
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
          <div className={`bg-white rounded-2xl p-6 border-2 ${getStatusColor(sensorData.waterColor.status)} shadow-lg`}>
            <div>
              <h3 className="font-semibold text-lg text-[#1c170d] mb-3 m-0">สีของน้ำ</h3>
              <div className="font-bold text-2xl text-[#1c170d] mb-3">{formatValue('waterColor', sensorData.waterColor.value)}</div>
              <button className="bg-[#f2c245] border-none rounded-2xl px-6 py-3 font-semibold text-sm text-[#1c170d] cursor-pointer transition-colors w-full hover:bg-[#e6b63d]" onClick={() => viewImage('water')}>กดเพื่อดูรูป</button>
              {sensorData.waterColor.timestamp && (
                <div className="text-xs text-gray-500 mt-2">
                  อัปเดตล่าสุด: {new Date(sensorData.waterColor.timestamp).toLocaleString('th-TH')}
                </div>
              )}
            </div>
          </div>

          {/* Minerals Card */}
          <div className={`bg-white rounded-2xl p-5 border-2 ${getStatusColor(sensorData.minerals.status)} shadow-lg`}>
            <div>
              <h3 className="font-semibold text-lg text-[#1c170d] mb-3 m-0">แร่ธาตุคงเหลือ</h3>
              <div className="font-bold text-2xl text-[#1c170d] mb-3">{formatValue('minerals', sensorData.minerals.value)}</div>
              {sensorData.minerals.timestamp && (
                <div className="text-xs text-gray-500">
                  อัปเดตล่าสุด: {new Date(sensorData.minerals.timestamp).toLocaleString('th-TH')}
                </div>
              )}
            </div>
          </div>
        </div>
    </div>
  )
}