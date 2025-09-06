'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreatePond, usePonds } from '@/hooks/use-ponds'
import type { CreatePondRequest } from '@/lib/types'

interface PondFormData {
  date: string
  size: string
  dimensions: string
  depth: string
  shrimp_count: string
}

export default function AddPondPage() {
  const router = useRouter()
  const createPondMutation = useCreatePond()
  const { data: existingPonds = [] } = usePonds()
  const [formData, setFormData] = useState<PondFormData>({
    date: '',
    size: '',
    dimensions: '',
    depth: '',
    shrimp_count: ''
  })
  const [errors, setErrors] = useState<Partial<PondFormData>>({})
  
  // Debug logging
  console.log('🔍 AddPondPage - existingPonds:', existingPonds)
  console.log('🔍 AddPondPage - createPondMutation:', createPondMutation)

  const handleInputChange = (field: keyof PondFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<PondFormData> = {}
    
    if (!formData.date.trim()) newErrors.date = 'กรุณาเลือกวันที่'
    if (!formData.size.trim()) newErrors.size = 'กรุณากรอกขนาดบ่อ'
    if (!formData.dimensions.trim()) newErrors.dimensions = 'กรุณากรอกขนาดบ่อ'
    if (!formData.depth.trim()) newErrors.depth = 'กรุณากรอกความลึก'
    // shrimp_count is optional - no validation needed

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('🔍 handleSubmit - formData:', formData)
    console.log('🔍 handleSubmit - existingPonds length:', existingPonds.length)
    
    if (!validateForm()) {
      console.log('❌ Form validation failed')
      return
    }

    try {
      // สร้างชื่อบ่อตามลำดับ
      const pondNumber = existingPonds.length + 1
      const pondName = `บ่อที่ ${pondNumber}`
      
      const pondData: CreatePondRequest = {
        name: pondName,
        date: formData.date,
        size: parseFloat(formData.size) || 0,
        dimensions: formData.dimensions,
        depth: parseFloat(formData.depth) || 0,
        shrimp_count: parseInt(formData.shrimp_count) || 0,
        notes: `บ่อขนาด ${formData.size} ไร่ สร้างเมื่อ ${formData.date} จำนวนลูกกุ้ง ${formData.shrimp_count} ตัว`
      }

      console.log('📝 Sending pond data:', pondData)
      console.log('📝 Pond data types:', {
        name: typeof pondData.name,
        size: typeof pondData.size,
        depth: typeof pondData.depth,
        shrimp_count: typeof pondData.shrimp_count
      })
      
      await createPondMutation.mutateAsync(pondData)
      
      alert('เพิ่มบ่อใหม่เรียบร้อยแล้ว')
      router.push('/ponds')
    } catch (error) {
      console.error('Error creating pond:', error)
      const errorMessage = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการเพิ่มบ่อ'
      alert(errorMessage)
    }
  }

  const goBack = () => {
    router.back()
  }

  return (
    <div className="add-pond-container">
      <div className="main-frame">
        {/* Form Section */}
        <div className="form-section">
          {/* Header */}
          <div className="header">
            <div className="header-content">
              <div className="close-button" onClick={goBack}>
                <div className="close-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M15.2806 14.2194C15.5737 14.5124 15.5737 14.9876 15.2806 15.2806C14.9876 15.5737 14.5124 15.5737 14.2194 15.2806L8 9.06031L1.78062 15.2806C1.48757 15.5737 1.01243 15.5737 0.719375 15.2806C0.426319 14.9876 0.426319 14.5124 0.719375 14.2194L6.93969 8L0.719375 1.78062C0.426319 1.48757 0.426319 1.01243 0.719375 0.719375C1.01243 0.426319 1.48757 0.426319 1.78062 0.719375L8 6.93969L14.2194 0.719375C14.5124 0.426319 14.9876 0.426319 15.2806 0.719375C15.5737 1.01243 15.5737 1.48757 15.2806 1.78062L9.06031 8L15.2806 14.2194Z" fill="#1A170F"/>
                  </svg>
                </div>
              </div>
              <div className="title-container">
                <h1>เพิ่มบ่อ</h1>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="form-fields">
            {/* Date Field */}
            <div className="input-group">
              <div className="input-field">
                <input
                  type="date"
                  className={`date-input ${errors.date ? 'error' : ''}`}
                  placeholder="โปรดเลือกวันที่"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Size Field */}
            <div className="input-group">
              <div className="input-field">
                <input
                  type="number"
                  step="0.1"
                  className={`text-input ${errors.size ? 'error' : ''}`}
                  placeholder="ขนาดบ่อ (ไร่)"
                  value={formData.size}
                  onChange={(e) => handleInputChange('size', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Dimensions Field */}
            <div className="input-group">
              <div className="input-field">
                <input
                  type="text"
                  className={`text-input ${errors.dimensions ? 'error' : ''}`}
                  placeholder="ขนาดบ่อ กว้าง x ยาว"
                  value={formData.dimensions}
                  onChange={(e) => handleInputChange('dimensions', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Depth Field */}
            <div className="input-group">
              <div className="input-field">
                <input
                  type="number"
                  step="0.1"
                  className={`text-input ${errors.depth ? 'error' : ''}`}
                  placeholder="ความลึกของบ่อ"
                  value={formData.depth}
                  onChange={(e) => handleInputChange('depth', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Shrimp Count Field */}
            <div className="input-group">
              <div className="input-field">
                <input
                  type="number"
                  min="0"
                  className={`text-input ${errors.shrimp_count ? 'error' : ''}`}
                  placeholder="จำนวนลูกกุ้งที่ปล่อย (ตัว)"
                  value={formData.shrimp_count}
                  onChange={(e) => handleInputChange('shrimp_count', e.target.value)}
                  required
                />
              </div>
            </div>
          </form>
        </div>

        {/* Add Button */}
        <div className="button-section">
          <button className="add-button" onClick={handleSubmit}>
            เพิ่มบ่อ
          </button>
          <div className="spacer"></div>
        </div>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .add-pond-container {
          background-color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
          position: relative;
          width: 100%;
          height: 100%;
        }

        .main-frame {
          background-color: #fcfaf7;
          min-height: 844px;
          position: relative;
          flex-shrink: 0;
          width: 100%;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .form-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        /* Header Styles */
        .header {
          background-color: #fcfaf7;
          position: relative;
          flex-shrink: 0;
          width: 100%;
        }

        .header-content {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 16px 16px 8px 16px;
          position: relative;
          width: 100%;
        }

        .close-button {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          cursor: pointer;
          flex-shrink: 0;
        }

        .close-icon {
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
          color: #1a170f;
          text-align: center;
          margin: 0;
        }

        /* Form Fields */
        .form-fields {
          flex: 1;
          display: flex;
          flex-direction: column;
          width: 100%;
          gap: 0;
        }

        .input-group {
          max-width: 480px;
          position: relative;
          flex-shrink: 0;
          width: 100%;
        }

        .input-field {
          display: flex;
          flex-direction: row;
          align-items: flex-end;
          max-width: inherit;
          position: relative;
          width: 100%;
          height: 100%;
          padding: 12px 16px;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: flex-start;
        }

        .input-field .date-input,
        .input-field .text-input {
          flex: 1;
          min-width: 160px;
          background-color: #f2f0e8;
          height: 56px;
          border-radius: 12px;
          width: 100%;
          border: none;
          padding: 16px;
          font-family: 'Inter', 'Noto Sans Thai', sans-serif;
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
          color: #1a170f;
          outline: none;
        }

        .input-field .date-input.error,
        .input-field .text-input.error {
          border: 2px solid #d4183d;
        }

        .input-field .date-input::placeholder,
        .input-field .text-input::placeholder {
          color: #8f8057;
          font-weight: 400;
          white-space: nowrap;
        }

        .input-field .date-input:focus,
        .input-field .text-input:focus {
          background-color: #efeae0;
          box-shadow: 0 0 0 2px rgba(242, 194, 69, 0.3);
        }

        /* Button Section */
        .button-section {
          position: relative;
          flex-shrink: 0;
          width: 100%;
          display: flex;
          flex-direction: column;
        }

        .add-button {
          background-color: #f2c245;
          width: 100%;
          height: 48px;
          max-width: 480px;
          border-radius: 24px;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 20px;
          font-family: 'Inter', 'Noto Sans Thai', sans-serif;
          font-weight: 700;
          font-size: 16px;
          line-height: 24px;
          color: #1a170f;
          text-align: center;
          margin: 12px 16px 0 16px;
        }

        .add-button:hover {
          background-color: #e6b63d;
        }

        .add-button:active {
          background-color: #d9a835;
        }

        .spacer {
          background-color: #fcfaf7;
          height: 20px;
          position: relative;
          flex-shrink: 0;
          width: 100%;
        }

        /* Date Input Styling */
        .date-input::-webkit-calendar-picker-indicator {
          background: transparent;
          bottom: 0;
          color: transparent;
          cursor: pointer;
          height: auto;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
          width: auto;
        }

        .date-input::-webkit-datetime-edit {
          color: #8f8057;
        }

        .date-input::-webkit-datetime-edit-fields-wrapper {
          color: #1a170f;
        }

        .date-input::-webkit-datetime-edit-text {
          color: #1a170f;
        }

        .date-input::-webkit-datetime-edit-month-field,
        .date-input::-webkit-datetime-edit-day-field,
        .date-input::-webkit-datetime-edit-year-field {
          color: #1a170f;
        }

        /* Responsive Design */
        @media (max-width: 480px) {
          .main-frame {
            width: 100%;
          }
          
          .title-container {
            padding-right: 32px;
          }
          
          .input-field {
            padding: 12px;
          }
          
          .add-button {
            margin: 12px 12px 0 12px;
          }
        }
      `}</style>
    </div>
  )
}
