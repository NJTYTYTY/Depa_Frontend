'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { usePonds } from '@/hooks/use-ponds'
import { useLatestSensorData } from '@/hooks/use-readings'
import { useAuth } from '@/providers/auth-provider'
import { apiClient } from '@/lib/api-client'

export default function PondDetailPage() {
  const router = useRouter()
  const params = useParams()
  const pondId = params.id as string
  const { data: ponds } = usePonds()
  const { accessToken } = useAuth()
  
  // Find the current pond
  const pond = ponds?.find(p => p.id === pondId)

  // Use the new batch sensor data hook
  const { data: latestData, isLoading: isLoadingLatest, error } = useLatestSensorData(pondId)
  
  // State for batch data
  const [batchData, setBatchData] = useState<any>(null)
  const [isLoadingBatch, setIsLoadingBatch] = useState(false)
  const [batchError, setBatchError] = useState<string | null>(null)

  // State for sensor data with fallback
  const [sensorData, setSensorData] = useState<{
    [key: string]: { value: any; status: string; timestamp: string | null; imageUrl?: string }
  }>({
    // Group 1: น้ำ
    DO: { value: 0.0, status: 'green', timestamp: null },
    pH: { value: 0.0, status: 'green', timestamp: null },
    temperature: { value: 0.0, status: 'green', timestamp: null },
    waterColor: { value: 'สีเขียว', status: 'green', timestamp: null },
    
    // Group 2: กุ้ง
    shrimpSize: { value: 0.0, status: 'green', timestamp: null },
    shrimpWeight: { value: 0.0, status: 'green', timestamp: null },
    
    // Group 3: สารแร่ธาตุ
    mineral1: { value: 0.0, status: 'green', timestamp: null },
    mineral2: { value: 0.0, status: 'green', timestamp: null },
    mineral3: { value: 0.0, status: 'green', timestamp: null },
    mineral4: { value: 0.0, status: 'green', timestamp: null },
    
    // Legacy data (for backward compatibility)
    minerals: { value: 0.0, status: 'red', timestamp: null }
  })

  const goBack = () => router.push('/ponds')

  // Fetch batch data
  const fetchBatchData = async () => {
    try {
      setIsLoadingBatch(true)
      setBatchError(null)
      
      const response = await apiClient.getBatchData(pondId)
      setBatchData(response)
    } catch (error: any) {
      console.error('❌ Error fetching batch data:', error)
      setBatchError(error.message || 'Failed to fetch batch data')
    } finally {
      setIsLoadingBatch(false)
    }
  }

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
      case 'shrimp_surface':
        imageUrl = sensorData.shrimpSurface?.imageUrl || 'https://batch-example.com/shrimp-surface.ngrok'
        break
      case 'shrimp_video':
        imageUrl = sensorData.shrimpVideo?.imageUrl || 'https://batch-example.com/shrimp-video.ngrok'
        break
      default:
        imageUrl = 'https://batch-example.com/default.ngrok'
    }
    
    // Open image/video in new tab
    if (imageUrl) {
      window.open(imageUrl, '_blank')
    } else {
      alert('ไม่พบลิงก์รูปภาพ/วิดีโอ')
    }
  }

  // Fetch batch data on component mount
  useEffect(() => {
    if (pondId) {
      fetchBatchData()
    }
  }, [pondId])

  // Update sensor data when latestData or batchData changes
  useEffect(() => {
      const newSensorData: { [key: string]: { value: any; status: string; timestamp: string | null; imageUrl?: string } } = { ...sensorData }
      
    // Process latest data (DO, pH, Temp, Water Color, Minerals)
    if (latestData?.data?.sensors) {
      
      // Map backend sensor names to frontend display names for latest data
      const latestSensorMapping: { [key: string]: string } = {
        // Group 1: น้ำ
        'DO': 'DO',
        'pH': 'pH',
        'temperature': 'temperature',
        'waterColor': 'waterColor',
        
        // Group 3: สารแร่ธาตุ
        'minerals_1': 'mineral1',
        'minerals_2': 'mineral2',
        'minerals_3': 'mineral3',
        'minerals_4': 'mineral4',
        'mineral1': 'mineral1',
        'mineral2': 'mineral2',
        'mineral3': 'mineral3',
        'mineral4': 'mineral4',
        
        // Image URLs from latest data
        'waterColorPicture': 'waterColorPicture',
        'sizePicture': 'sizePicture',
        'foodPicture': 'foodPicture',
        'kungOnWaterPicture': 'kungOnWaterPicture',
        'PicColorwater': 'PicColorwater',
        'PicKungOnWater': 'PicKungOnWater',
        
        // Legacy
        'minerals': 'minerals'
      }
      
      Object.keys(latestData.data.sensors).forEach((backendKey: string) => {
        const frontendKey = latestSensorMapping[backendKey] || backendKey
        const data = (latestData.data.sensors as any)[backendKey]
        
        if (data && typeof data === 'object') {
          if (backendKey === 'waterColorPicture') {
            // Store image URL for water color
            if (newSensorData.waterColor) {
              newSensorData.waterColor.imageUrl = data.value
            }
          } else if (backendKey === 'PicColorwater') {
            // Store image URL for water color (alternative name)
            if (newSensorData.waterColor) {
              newSensorData.waterColor.imageUrl = data.value
            }
          } else if (backendKey === 'kungOnWaterPicture') {
            // Store image URL for shrimp on water surface - หลัก
            if (!newSensorData.shrimpSurface) {
              newSensorData.shrimpSurface = { value: 'รูปกุ้งบนผิวน้ำ', status: 'info', timestamp: null }
            }
            newSensorData.shrimpSurface.imageUrl = data.value
          } else if (backendKey === 'PicKungOnWater') {
            // Store image URL for shrimp on water surface (alternative name)
            if (!newSensorData.shrimpSurface) {
              newSensorData.shrimpSurface = { value: 'รูปกุ้งบนผิวน้ำ', status: 'info', timestamp: null }
            }
            newSensorData.shrimpSurface.imageUrl = data.value
          } else {
            // Store regular sensor data
            newSensorData[frontendKey] = {
              value: data.value,
              status: data.status || 'green',
              timestamp: data.timestamp || latestData.data.timestamp || null,
              imageUrl: undefined
            }
          }
        }
      })
    }
    
    // Process batch data (Shrimp data)
    if (batchData?.data) {
      // Get the latest batch from the batches array
      const latestBatch = batchData.data.batches && batchData.data.batches.length > 0 
        ? batchData.data.batches[batchData.data.batches.length - 1] 
        : null
      
      // Check if data is in sensors object or direct properties
      const batchDataToProcess = latestBatch?.sensors || batchData.data.sensors || batchData.data
      
      // If batchDataToProcess is the full response, get the actual data
      if (batchDataToProcess && batchDataToProcess.success && batchDataToProcess.data) {
        const actualData = batchDataToProcess.data
        
        if (actualData.batches && actualData.batches.length > 0) {
          const latestBatchFromNested = actualData.batches[actualData.batches.length - 1]
          
          // Use the sensors from the nested structure
          const finalBatchDataToProcess = latestBatchFromNested?.sensors || actualData
          
          // Process the data
          if (finalBatchDataToProcess && typeof finalBatchDataToProcess === 'object') {
            const batchMapping: { [key: string]: string } = {
              'size_cm': 'shrimpSize',
              'size_gram': 'shrimpWeight',
              'sizePicture': 'sizePicture',
              'foodPicture': 'foodPicture',
              'kungDinPicture': 'kungDinPicture'
            }
            
            Object.keys(batchMapping).forEach((batchKey: string) => {
              const frontendKey = batchMapping[batchKey]
              const data = finalBatchDataToProcess[batchKey]
              
              if (data !== undefined && data !== null) {
                if (batchKey === 'sizePicture') {
                  // Store image URL for shrimp size
                  if (newSensorData.shrimpSize) {
                    newSensorData.shrimpSize.imageUrl = data.value || data
                  }
                } else if (batchKey === 'foodPicture') {
                  // Store image URL for food
                  if (!newSensorData.food) {
                    newSensorData.food = { value: 'รูปอาหารบนยอ', status: 'info', timestamp: null }
                  }
                  newSensorData.food.imageUrl = data.value || data
                } else if (batchKey === 'kungDinPicture') {
                  // Store video URL for shrimp movement
                  if (!newSensorData.shrimpVideo) {
                    newSensorData.shrimpVideo = { value: 'วิดีโอกุ้งดิ้น', status: 'info', timestamp: null }
                  }
                  newSensorData.shrimpVideo.imageUrl = data.value || data
    } else {
                  // Store regular sensor data
                  const value = data.value !== undefined ? data.value : data
                  const status = data.status || 'green'
                  
                  newSensorData[frontendKey] = {
                    value: value,
                    status: status,
                    timestamp: data.timestamp || batchData.data.timestamp || null,
                    imageUrl: undefined
                  }
                }
              }
            })
          }
        }
      }
    }
    
    setSensorData(newSensorData)
  }, [latestData, batchData, isLoadingLatest, error])

  // Function to get status color class
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'green':
        return 'border-[#01940D]'
      case 'yellow':
        return 'border-[#FFB600]'
      case 'red':
        return 'border-[#FF0004]'
      default:
        return 'border-gray-500'
    }
  }

  // Function to get background color with transparency
  const getBackgroundColor = (status: string) => {
    switch (status) {
      case 'green':
        return 'bg-[#C0FFC0]'
      case 'yellow':
        return 'bg-[#FFF585]'
      case 'red':
        return 'bg-[#FFA2A2]'
      default:
        return 'bg-gray-50'
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

  if (isLoadingLatest || isLoadingBatch) {
    return (
      <div className="w-full flex flex-col h-full bg-[#fcfaf7] items-center justify-center">
        <div className="text-lg text-[#1c170d]">กำลังโหลดข้อมูล...</div>
        {isLoadingLatest && <div className="text-sm text-gray-500 mt-2">โหลดข้อมูลเซ็นเซอร์...</div>}
        {isLoadingBatch && <div className="text-sm text-gray-500 mt-2">โหลดข้อมูลกุ้ง...</div>}
      </div>
    )
  }

  if (error || batchError) {
    return (
      <div className="w-full flex flex-col h-full bg-[#fcfaf7] items-center justify-center">
        <div className="text-lg text-red-600">เกิดข้อผิดพลาด:</div>
        {error && <div className="text-sm text-red-500 mt-1">เซ็นเซอร์: {error.message}</div>}
        {batchError && <div className="text-sm text-red-500 mt-1">กุ้ง: {batchError}</div>}
        <div className="text-sm text-gray-500 mt-2">กำลังใช้ข้อมูลสำรอง</div>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col h-full bg-[#fcfaf7]">
      <style jsx global>{`
        .glasp-extension-toaster {
          display: none !important;
        }
      `}</style>
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

        {/* Status Bar Section */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-xl text-[#1c170d] m-0">วันนี้</h2>
            <div className="flex gap-2">
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

          

          {/* Status Bar */}
          <div className="bg-[#fcfaf7] rounded-lg p-4">
            <div className="flex items-center justify-center space-x-8">
              {/* สถานะดีเยี่ยม */}
              <div className="flex flex-col items-center">
                <div className="text-sm text-gray-600 mb-2">สถานะดีเยี่ยม</div>
                <div className="w-20 h-3 bg-green-500 rounded-full shadow-sm"></div>
              </div>
              
              {/* กำลังปรับปรุง */}
              <div className="flex flex-col items-center">
                <div className="text-sm text-gray-600 mb-2">กำลังปรับปรุง</div>
                <div className="w-20 h-3 rounded-full shadow-sm" style={{backgroundColor: '#FFB600'}}></div>
              </div>
              
              {/* ซวยแล้ว!! */}
              <div className="flex flex-col items-center">
                <div className="text-sm text-gray-600 mb-2">ซวยแล้ว!!</div>
                <div className="w-20 h-3 bg-red-500 rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Sensor Cards - Grouped */}
        <div className="px-4 pb-8 flex flex-col gap-6">
          
          {/* Group 1: น้ำ */}
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-xl text-[#1c170d] mb-2">กลุ่ม 1: น้ำ</h2>
            
          {/* DO Card */}
           <div className={`${getBackgroundColor(sensorData.DO.status)} rounded-2xl p-5 border-2 ${getStatusColor(sensorData.DO.status)} shadow-lg`}>
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
           <div className={`${getBackgroundColor(sensorData.pH.status)} rounded-2xl p-5 border-2 ${getStatusColor(sensorData.pH.status)} shadow-lg`}>
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
           <div className={`${getBackgroundColor(sensorData.temperature.status)} rounded-2xl p-5 border-2 ${getStatusColor(sensorData.temperature.status)} shadow-lg`}>
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

             {/* Water Color Card */}
             <div className={`${getBackgroundColor(sensorData.waterColor.status)} rounded-2xl p-6 border-2 ${getStatusColor(sensorData.waterColor.status)} shadow-lg`}>
              <div>
                <h3 className="font-semibold text-lg text-[#1c170d] mb-3 m-0">สีของน้ำ</h3>
                 <div className="flex items-center justify-between mb-3">
                   <div className="font-bold text-2xl text-[#1c170d]">{formatValue('waterColor', sensorData.waterColor.value)}</div>
                   <button className="bg-[#f2c245] border-none rounded-2xl px-4 py-2 font-semibold text-sm text-[#1c170d] cursor-pointer transition-colors hover:bg-[#e6b63d] flex-shrink-0 ml-3 w-32 text-center" onClick={() => viewImage('water')}>กดเพื่อดูรูป</button>
                 </div>
                {sensorData.waterColor.timestamp && (
                  <div className="text-xs text-gray-500">
                    อัปเดตล่าสุด: {new Date(sensorData.waterColor.timestamp).toLocaleString('th-TH')}
                  </div>
                )}
              </div>
            </div>

             {/* Shrimp on Water Surface - Image Only */}
             <div className="bg-yellow-50 rounded-2xl p-5 border-2 border-[#f2c245] shadow-lg">
              <div>
                 <div className="flex items-center justify-between">
                   <h3 className="font-semibold text-lg text-[#1c170d] m-0">รูปกุ้งบนผิวน้ำ</h3>
                   <button className="bg-[#f2c245] border-none rounded-2xl px-4 py-2 font-semibold text-sm text-[#1c170d] cursor-pointer transition-colors hover:bg-[#e6b63d] flex-shrink-0 ml-3 w-32 text-center" onClick={() => viewImage('shrimp_surface')}>กดเพื่อดูรูป</button>
                 </div>
              </div>
            </div>
          </div>

          {/* Group 2: กุ้ง */}
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-xl text-[#1c170d] mb-2">กลุ่ม 2: กุ้ง</h2>
            
             {/* Shrimp Size (cm) Card */}
             <div className={`${getBackgroundColor(sensorData.shrimpSize.status)} rounded-2xl p-5 border-2 ${getStatusColor(sensorData.shrimpSize.status)} shadow-lg`}>
            <div>
                <h3 className="font-semibold text-lg text-[#1c170d] mb-3 m-0">ขนาดกุ้ง (เซนติเมตร)</h3>
              <div className="font-bold text-2xl text-[#1c170d] mb-3">{formatValue('shrimpSize', sensorData.shrimpSize.value)}</div>
              {sensorData.shrimpSize.timestamp && (
                  <div className="text-xs text-gray-500">
                  อัปเดตล่าสุด: {new Date(sensorData.shrimpSize.timestamp).toLocaleString('th-TH')}
                </div>
              )}
            </div>
          </div>

             {/* Shrimp Size (grams) Card */}
             <div className={`${getBackgroundColor(sensorData.shrimpWeight?.status || 'green')} rounded-2xl p-5 border-2 ${getStatusColor(sensorData.shrimpWeight?.status || 'green')} shadow-lg`}>
              <div>
                <h3 className="font-semibold text-lg text-[#1c170d] mb-3 m-0">ขนาดกุ้ง (กรัม)</h3>
                <div className="font-bold text-2xl text-[#1c170d] mb-3">{sensorData.shrimpWeight?.value || '0.0'} กรัม</div>
                {sensorData.shrimpWeight?.timestamp && (
                  <div className="text-xs text-gray-500">
                    อัปเดตล่าสุด: {new Date(sensorData.shrimpWeight.timestamp).toLocaleString('th-TH')}
                  </div>
                )}
              </div>
            </div>

             {/* Shrimp Size Image Card */}
             <div className="bg-yellow-50 rounded-2xl p-5 border-2 border-[#f2c245] shadow-lg">
              <div>
                 <div className="flex items-center justify-between">
                   <h3 className="font-semibold text-lg text-[#1c170d] m-0">ขนาดกุ้ง</h3>
                   <button className="bg-[#f2c245] border-none rounded-2xl px-4 py-2 font-semibold text-sm text-[#1c170d] cursor-pointer transition-colors hover:bg-[#e6b63d] flex-shrink-0 ml-3 w-32 text-center" onClick={() => viewImage('shrimp')}>กดเพื่อดูรูป</button>
                 </div>
              </div>
            </div>

             {/* Food on Raft Image Card */}
             <div className="bg-yellow-50 rounded-2xl p-5 border-2 border-[#f2c245] shadow-lg">
              <div>
                 <div className="flex items-center justify-between">
                   <h3 className="font-semibold text-lg text-[#1c170d] m-0">รูปอาหารบนยอ</h3>
                   <button className="bg-[#f2c245] border-none rounded-2xl px-4 py-2 font-semibold text-sm text-[#1c170d] cursor-pointer transition-colors hover:bg-[#e6b63d] flex-shrink-0 ml-3 w-32 text-center" onClick={() => viewImage('food')}>กดเพื่อดูรูป</button>
                 </div>
              </div>
            </div>

             {/* Shrimp Movement Video Card */}
             <div className="bg-yellow-50 rounded-2xl p-5 border-2 border-[#f2c245] shadow-lg">
            <div>
                 <div className="flex items-center justify-between">
                   <h3 className="font-semibold text-lg text-[#1c170d] m-0">วิดีโอกุ้งดิ้น</h3>
                   <button className="bg-[#f2c245] border-none rounded-2xl px-4 py-2 font-semibold text-sm text-[#1c170d] cursor-pointer transition-colors hover:bg-[#e6b63d] flex-shrink-0 ml-3 w-32 text-center" onClick={() => viewImage('shrimp_video')}>กดเพื่อดูวิดีโอ</button>
                 </div>
              </div>
            </div>
          </div>

          {/* Group 3: สารแร่ธาตุ */}
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-xl text-[#1c170d] mb-2">กลุ่ม 3: สารแร่ธาตุ</h2>
            
             {/* Mineral 1 Card */}
             <div className={`${getBackgroundColor(sensorData.mineral1?.status || 'green')} rounded-2xl p-5 border-2 ${getStatusColor(sensorData.mineral1?.status || 'green')} shadow-lg`}>
              <div>
                <h3 className="font-semibold text-lg text-[#1c170d] mb-3 m-0">ค่าสาร 1</h3>
                <div className="font-bold text-2xl text-[#1c170d] mb-3">{sensorData.mineral1?.value || '0.0'}</div>
                {sensorData.mineral1?.timestamp && (
                  <div className="text-xs text-gray-500">
                    อัปเดตล่าสุด: {new Date(sensorData.mineral1.timestamp).toLocaleString('th-TH')}
                  </div>
                )}
              </div>
            </div>

             {/* Mineral 2 Card */}
             <div className={`${getBackgroundColor(sensorData.mineral2?.status || 'green')} rounded-2xl p-5 border-2 ${getStatusColor(sensorData.mineral2?.status || 'green')} shadow-lg`}>
            <div>
                <h3 className="font-semibold text-lg text-[#1c170d] mb-3 m-0">ค่าสาร 2</h3>
                <div className="font-bold text-2xl text-[#1c170d] mb-3">{sensorData.mineral2?.value || '0.0'}</div>
                {sensorData.mineral2?.timestamp && (
                  <div className="text-xs text-gray-500">
                    อัปเดตล่าสุด: {new Date(sensorData.mineral2.timestamp).toLocaleString('th-TH')}
                  </div>
                )}
            </div>
          </div>

             {/* Mineral 3 Card */}
             <div className={`${getBackgroundColor(sensorData.mineral3?.status || 'green')} rounded-2xl p-5 border-2 ${getStatusColor(sensorData.mineral3?.status || 'green')} shadow-lg`}>
            <div>
                <h3 className="font-semibold text-lg text-[#1c170d] mb-3 m-0">ค่าสาร 3</h3>
                <div className="font-bold text-2xl text-[#1c170d] mb-3">{sensorData.mineral3?.value || '0.0'}</div>
                {sensorData.mineral3?.timestamp && (
                  <div className="text-xs text-gray-500">
                    อัปเดตล่าสุด: {new Date(sensorData.mineral3.timestamp).toLocaleString('th-TH')}
                </div>
              )}
            </div>
          </div>

             {/* Mineral 4 Card */}
             <div className={`${getBackgroundColor(sensorData.mineral4?.status || 'green')} rounded-2xl p-5 border-2 ${getStatusColor(sensorData.mineral4?.status || 'green')} shadow-lg`}>
            <div>
                <h3 className="font-semibold text-lg text-[#1c170d] mb-3 m-0">ค่าสาร 4</h3>
                <div className="font-bold text-2xl text-[#1c170d] mb-3">{sensorData.mineral4?.value || '0.0'}</div>
                {sensorData.mineral4?.timestamp && (
                <div className="text-xs text-gray-500">
                    อัปเดตล่าสุด: {new Date(sensorData.mineral4.timestamp).toLocaleString('th-TH')}
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}