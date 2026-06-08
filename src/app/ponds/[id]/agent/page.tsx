'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { usePonds } from '@/hooks/use-ponds'

interface Message {
  id: number
  content: string
  type: 'user' | 'assistant'
  timestamp: Date
}

export default function AgentPage() {
  const router = useRouter()
  const params = useParams()
  const pondId = params.id as string
  const { data: ponds, isLoading: pondsLoading, error: pondsError } = usePonds()
  const pondIdNum = parseInt(pondId)
  // @ts-ignore - Comparing number with string for fallback compatibility
  const pond = ponds?.find(p => p.id === pondIdNum) || ponds?.find(p => String(p.id) === pondId)
  
  // Fallback pond data if not found
  const fallbackPond = {
    id: parseInt(pondId),
    name: `บ่อ ${pondId}`,
    size: 'ไม่ระบุ',
    date: 'ไม่ระบุ',
    dimensions: 'ไม่ระบุ',
    depth: 'ไม่ระบุ',
    shrimp_count: 'ไม่ระบุ',
    location: 'ไม่ระบุ',
    notes: 'ข้อมูลบ่อไม่พร้อมใช้งาน'
  }
  
  const currentPond = pond || fallbackPond
  
  // Debug: ตรวจสอบข้อมูล
  console.log('🔍 Agent Page Debug:')
  console.log('- Pond ID (string):', pondId)
  console.log('- Pond ID (parsed):', parseInt(pondId))
  console.log('- Ponds Loading:', pondsLoading)
  console.log('- Ponds Error:', pondsError)
  console.log('- All Ponds:', ponds)
  console.log('- Pond IDs in data:', ponds?.map(p => ({ id: p.id, type: typeof p.id })))
  console.log('- Found Pond:', pond)
  console.log('- Current Pond:', currentPond)
  
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const suggestedQuestions = [
    `บ่อ ${currentPond?.name || 'ของฉัน'} มีปัญหาอะไรบ้าง?`,
    `ควรจัดการน้ำในบ่อ ${currentPond?.name || 'ของฉัน'} อย่างไร?`,
    `กุ้งในบ่อ ${currentPond?.name || 'ของฉัน'} โตเร็วหรือไม่?`,
    `มีวิธีป้องกันโรคกุ้งในบ่อ ${currentPond?.name || 'ของฉัน'} ไหม?`,
    `บ่อ ${currentPond?.name || 'ของฉัน'} ควรให้อาหารกุ้งอย่างไร?`,
    `บ่อ ${currentPond?.name || 'ของฉัน'} ควรเปลี่ยนน้ำเมื่อไหร่?`
  ]

  useEffect(() => {
    // Add a welcome message when the component mounts
    const pondInfo = currentPond ? `
บ่อ: ${currentPond.name}
ขนาด: ${currentPond.size || 'ไม่ระบุ'} ไร่
วันที่ลงบ่อ: ${currentPond.date || 'ไม่ระบุ'}
จำนวนกุ้ง: ${currentPond.shrimp_count || 'ไม่ระบุ'} ตัว
ความลึก: ${currentPond.depth || 'ไม่ระบุ'} เมตร
` : 'ข้อมูลบ่อไม่พร้อมใช้งาน'

    setMessages([
      {
        id: 1,
        content: `สวัสดีครับ! ผมคือผู้ช่วย AI ของคุณ\n\nข้อมูลบ่อปัจจุบัน:\n${pondInfo}\nมีอะไรให้ช่วยไหมครับ?`,
        type: 'assistant',
        timestamp: new Date()
      }
    ])
  }, [currentPond])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const sendMessage = async () => {
    if (inputMessage.trim() === '') return

    const newMessage: Message = {
      id: messages.length + 1,
      content: inputMessage,
      type: 'user',
      timestamp: new Date()
    }
    setMessages(prevMessages => [...prevMessages, newMessage])
    setInputMessage('')
    setIsLoading(true)

    // Debug: ตรวจสอบข้อมูลบ่อ
    console.log('🐟 Pond ID:', pondId)
    console.log('🐟 Pond Data:', pond)
    console.log('🐟 Current Pond:', currentPond)
    console.log('🐟 All Ponds:', ponds)

    try {
      console.log('Mocking AI agent request...')
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      let answer = "ขออภัยด้วยครับ ตอนนี้ระบบฐานข้อมูลจำลองไม่มีข้อมูลเชิงลึกเรื่องนี้ แต่โดยทั่วไปแล้ว "
      const lowercaseInput = inputMessage.toLowerCase()
      
      if (lowercaseInput.includes('ปัญหา') || lowercaseInput.includes('เสี่ยง') || lowercaseInput.includes('เตือน')) {
        answer = `จากการวิเคราะห์บ่อ ${currentPond?.name} สภาพน้ำและระดับออกซิเจน DO ยังคงปกติอยู่ที่ 6.2 mg/L ครับ แต่ควรเฝ้าระวังสีน้ำเขียวขุ่นเป็นพิเศษ หากมีแดดจัดอาจทำให้ออกซิเจนลดลงในช่วงกลางคืนได้ครับ`
      } else if (lowercaseInput.includes('น้ำ') || lowercaseInput.includes('do') || lowercaseInput.includes('ph') || lowercaseInput.includes('อุณหภูมิ')) {
        answer = `สำหรับบ่อ ${currentPond?.name} แนะนำรักษาค่า DO ไม่ต่ำกว่า 5.0 mg/L และ pH อยู่ระหว่าง 7.5 - 8.3 ครับ จากข้อมูลจำลองปัจจุบัน ค่า DO: 6.2 mg/L, pH: 7.8 และ อุณหภูมิ: 28.5 °C ถือว่าอยู่ในเกณฑ์ดีเยี่ยมและเหมาะสมกับการเติบโตของกุ้งครับ`
      } else if (lowercaseInput.includes('โต') || lowercaseInput.includes('ขนาด') || lowercaseInput.includes('กุ้ง') || lowercaseInput.includes('น้ำหนัก')) {
        answer = `ขนาดกุ้งเฉลี่ยในบ่อ ${currentPond?.name} ปัจจุบันวัดได้ 7.5 ซม. น้ำหนักประมาณ 12.0 กรัมครับ อัตราการเจริญเติบโต (ADG) อยู่ในเกณฑ์เฉลี่ยปกติของสัปดาห์นี้ครับ`
      } else if (lowercaseInput.includes('โรค') || lowercaseInput.includes('ตาย') || lowercaseInput.includes('ลอย')) {
        answer = `เพื่อป้องกันโรคในกุ้ง แนะนำให้ควบคุมปริมาณสารอินทรีย์และเศษอาหารก้นบ่อ โดยการยกยอตรวจสอบทุกครั้ง และหมั่นสังเกตไม่ให้มีกุ้งลอยหัวหรือเกาะขอบบ่อครับ หากพบระดับ DO ต่ำให้รีบเปิดกังหันน้ำทันที`
      } else if (lowercaseInput.includes('อาหาร') || lowercaseInput.includes('ให้อาหาร') || lowercaseInput.includes('ยอ')) {
        answer = `จากรูปอาหารบนยอล่าสุด ปริมาณการกินอาหารของกุ้งในบ่อ ${currentPond?.name} อยู่ในระดับปกติครับ (ไม่พบเศษอาหารเหลือค้างบนยอ) แนะนำให้รักษารอบการให้อาหารตามปกติและปรับตามน้ำหนักตัวกุ้งครับ`
      } else {
        answer = `บ่อ ${currentPond?.name} มีพื้นที่ประมาณ ${currentPond?.size || '10'} ไร่ ปล่อยกุ้งไปทั้งหมด ${currentPond?.shrimp_count || '50,000'} ตัว ขณะนี้ระบบตรวจสอบอัตโนมัติทำงานปกติครับ หากต้องการข้อมูลด้านใดเพิ่มเติม เช่น คุณภาพน้ำ ขนาดกุ้ง หรือตารางการยกยอ สามารถสอบถามได้เลยครับ!`
      }

      const aiResponse: Message = {
        id: messages.length + 2,
        content: answer,
        type: 'assistant',
        timestamp: new Date()
      }
      setMessages(prevMessages => [...prevMessages, aiResponse])
    } catch (error) {
      console.log('Error sending message to AI:', error)
      const errorMessage: Message = {
        id: messages.length + 2,
        content: `เกิดข้อผิดพลาดในการจำลองผู้ช่วย AI: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'assistant',
        timestamp: new Date()
      }
      setMessages(prevMessages => [...prevMessages, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question)
  }

  // Loading state
  if (pondsLoading) {
    return (
      <div className="agent-page">
        <div className="header-section">
          <div className="header-content">
            <div className="back-button" onClick={() => router.push('/ponds')}>
              <div className="back-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M10.7194 3.28062C11.0124 3.57367 11.0124 4.04883 10.7194 4.34188L7.06031 8L10.7194 11.6581C11.0124 11.9512 11.0124 12.4263 10.7194 12.7194C10.4263 13.0124 9.95117 13.0124 9.65812 12.7194L5.65812 8.71938C5.36507 8.42633 5.36507 7.95117 5.65812 7.65812L9.65812 3.65812C9.95117 3.36507 10.4263 3.36507 10.7194 3.65812Z" fill="#1A170F"/>
                </svg>
              </div>
            </div>
            <div className="header-title">
              <h1 className="font-bold text-lg leading-6 text-[#1c170d] text-center m-0">
                กำลังโหลดข้อมูลบ่อ...
              </h1>
            </div>
          </div>
        </div>
        <div className="chat-container">
          <div className="welcome-section">
            <div className="empty-state">
              <p className="empty-message">กำลังโหลดข้อมูลบ่อ กรุณารอสักครู่...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (pondsError) {
    return (
      <div className="agent-page">
        <div className="header-section">
          <div className="header-content">
            <div className="back-button" onClick={() => router.push('/ponds')}>
              <div className="back-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M10.7194 3.28062C11.0124 3.57367 11.0124 4.04883 10.7194 4.34188L7.06031 8L10.7194 11.6581C11.0124 11.9512 11.0124 12.4263 10.7194 12.7194C10.4263 13.0124 9.95117 13.0124 9.65812 12.7194L5.65812 8.71938C5.36507 8.42633 5.36507 7.95117 5.65812 7.65812L9.65812 3.65812C9.95117 3.36507 10.4263 3.36507 10.7194 3.65812Z" fill="#1A170F"/>
                </svg>
              </div>
            </div>
            <div className="header-title">
              <h1 className="font-bold text-lg leading-6 text-[#1c170d] text-center m-0">
                เกิดข้อผิดพลาด
              </h1>
            </div>
          </div>
        </div>
        <div className="chat-container">
          <div className="welcome-section">
            <div className="empty-state">
              <p className="empty-message">ไม่สามารถโหลดข้อมูลบ่อได้ กรุณาลองใหม่อีกครั้ง</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="agent-page">
      {/* Header */}
      <div className="header-section">
        <div className="header-content">
          <div className="back-button" onClick={() => router.push('/ponds')}>
            <div className="back-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M10.7194 3.28062C11.0124 3.57367 11.0124 4.04883 10.7194 4.34188L7.06031 8L10.7194 11.6581C11.0124 11.9512 11.0124 12.4263 10.7194 12.7194C10.4263 13.0124 9.95117 13.0124 9.65812 12.7194L5.65812 8.71938C5.36507 8.42633 5.36507 7.95117 5.65812 7.65812L9.65812 3.65812C9.95117 3.36507 10.4263 3.36507 10.7194 3.65812Z" fill="#1A170F"/>
              </svg>
            </div>
          </div>
          <div className="header-title">
            <h1 className="font-bold text-lg leading-6 text-[#1c170d] text-center m-0">
              สวัสดี! เราคือผู้ช่วย AI
            </h1>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="chat-container">
        {messages.length === 0 ? (
          <div className="welcome-section">
            <div className="empty-state">
              <p className="empty-message">เริ่มต้นการสนทนากับผู้ช่วยของคุณได้เลย !!</p>
              <div className="suggested-questions">
                <p className="suggested-title">คำถามแนะนำ:</p>
                <div className="question-buttons">
                  {suggestedQuestions.slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      className="question-button"
                      onClick={() => handleSuggestedQuestion(question)}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className="message-content">
                  <div className="message-text">{message.content}</div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString('th-TH', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message assistant">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="input-section">
        <div className="input-container">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="พิมพ์คำถามของคุณ..."
            className="message-input"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="send-button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        .agent-page {
          min-height: 100vh;
          background: #fcfaf7;
          display: flex;
          flex-direction: column;
        }

        .header-section {
          background: #f2c245;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .header-content {
          display: flex;
          align-items: center;
          padding: 16px;
          gap: 12px;
          background: #fcfaf7;
        }

        .back-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 20px;
          background: #f3f4f6;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .back-button:hover {
          background: #e5e7eb;
        }

        .header-title {
          flex: 1;
          text-align: center;
        }

        .chat-container {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          background: #fcfaf7;
        }

        .welcome-section {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
        }

        .empty-state {
          text-align: center;
        }

        .empty-message {
          color: #6b7280;
          font-size: 16px;
          margin: 0 0 24px 0;
        }

        .suggested-questions {
          max-width: 500px;
          margin: 0 auto;
        }

        .suggested-title {
          color: #374151;
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 12px 0;
          text-align: center;
        }

        .question-buttons {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .question-button {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 14px;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          line-height: 1.4;
        }

        .question-button:hover {
          background: #f9fafb;
          border-color: #1c170d;
          color: #1c170d;
        }

        .welcome-card {
          background: white;
          border-radius: 16px;
          padding: 32px;
          text-align: center;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          width: 100%;
        }

        .welcome-icon {
          margin-bottom: 16px;
        }

        .welcome-title {
          font-size: 20px;
          font-weight: 600;
          color: #1c170d;
          margin-bottom: 8px;
        }

        .welcome-description {
          color: #6b7280;
          margin-bottom: 24px;
          line-height: 1.5;
        }


        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .message {
          display: flex;
          margin-bottom: 16px;
        }

        .message.user {
          justify-content: flex-end;
        }

        .message.assistant {
          justify-content: flex-start;
        }

        .message-content {
          max-width: 70%;
          padding: 12px 16px;
          border-radius: 18px;
          position: relative;
        }

        .message.user .message-content {
          background: #1c170d;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .message.assistant .message-content {
          background: white;
          color: #1c170d;
          border: 1px solid #e5e7eb;
          border-bottom-left-radius: 4px;
        }

        .message-text {
          font-size: 14px;
          line-height: 1.4;
          margin-bottom: 4px;
        }

        .message-time {
          font-size: 11px;
          opacity: 0.7;
          text-align: right;
        }

        .message.assistant .message-time {
          text-align: left;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .typing-indicator span {
          width: 6px;
          height: 6px;
          background: #9ca3af;
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(1) {
          animation-delay: -0.32s;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: -0.16s;
        }

        @keyframes typing {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .input-section {
          background: white;
          border-top: 1px solid #e5e7eb;
          padding: 16px;
          position: sticky;
          bottom: 0;
        }

        .input-container {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          max-width: 100%;
        }

        .message-input {
          flex: 1;
          border: 1px solid #d1d5db;
          border-radius: 20px;
          padding: 12px 16px;
          font-size: 14px;
          color: #1c170d;
          background: white;
          resize: none;
          outline: none;
          transition: border-color 0.2s;
          min-height: 20px;
          max-height: 120px;
        }

        .message-input:focus {
          border-color: #1c170d;
        }

        .message-input:disabled {
          background: #f9fafb;
          cursor: not-allowed;
        }

        .send-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: #1c170d;
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          transition: background-color 0.2s;
          flex-shrink: 0;
        }

        .send-button:hover:not(:disabled) {
          background: #2d2418;
        }

        .send-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .message-content {
            max-width: 85%;
          }
          
          .input-container {
            padding: 0 4px;
          }
        }
      `}</style>
    </div>
  )
}