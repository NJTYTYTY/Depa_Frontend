import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { question, pondId, pondData } = await request.json()

    // Debug logging
    console.log('🤖 Agent API Debug:')
    console.log('- Question:', question)
    console.log('- Pond ID:', pondId)
    console.log('- Pond Data:', pondData)

    if (!question) {
      return NextResponse.json(
        { answer: 'กรุณาพิมพ์คำถาม' },
        { status: 400 }
      )
    }

    // ตรวจสอบ API key
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set')
      return NextResponse.json(
        { answer: 'ผู้ช่วย AI ยังไม่พร้อมใช้งาน กรุณาติดต่อผู้ดูแลระบบ' },
        { status: 500 }
      )
    }

    // สร้าง context สำหรับ Gemini
    const context = `
คุณคือผู้ช่วย AI ที่เชี่ยวชาญด้านการเลี้ยงกุ้งและบ่อเลี้ยงกุ้ง

ข้อมูลบ่อปัจจุบัน (ID: ${pondId}):
- ชื่อบ่อ: ${pondData?.name || 'ไม่ระบุ'}
- ขนาดบ่อ: ${pondData?.size || 'ไม่ระบุ'} ไร่
- วันที่ลงบ่อ: ${pondData?.date || 'ไม่ระบุ'}
- ขนาด ก x ย: ${pondData?.dimensions || 'ไม่ระบุ'}
- ความลึกบ่อ: ${pondData?.depth || 'ไม่ระบุ'} เมตร
- จำนวนลูกกุ้งที่ปล่อย: ${pondData?.shrimp_count || 'ไม่ระบุ'} ตัว
- ที่ตั้งบ่อ: ${pondData?.location || 'ไม่ระบุ'}
- หมายเหตุ: ${pondData?.notes || 'ไม่มี'}

ข้อมูลเพิ่มเติม:
- วันที่สร้างบ่อ: ${pondData?.created_at ? new Date(pondData.created_at).toLocaleDateString('th-TH') : 'ไม่ระบุ'}
- วันที่อัปเดตล่าสุด: ${pondData?.updated_at ? new Date(pondData.updated_at).toLocaleDateString('th-TH') : 'ไม่ระบุ'}

คำแนะนำในการตอบ:
- ตอบเป็นภาษาไทยที่เข้าใจง่ายสำหรับเกษตรกร
- ใช้การเว้นวรรคที่เหมาะสม (เว้นบรรทัดระหว่างหัวข้อ)
- หลีกเลี่ยงการใช้ ** หรือ * มากเกินไป
- ให้คำแนะนำที่กระชับและเป็นประโยชน์
- จำกัดความยาวคำตอบไม่เกิน 300 คำ
- ใช้ bullet points (-) แทน ** หรือ *
- ตอบแบบเป็นมิตรและให้กำลังใจ

คำถาม: ${question}
`

    // Debug: แสดง context ที่สร้างขึ้น
    console.log('🤖 Generated Context:')
    console.log(context)

    // เรียกใช้ Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: context
          }]
        }]
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || 'ไม่สามารถสร้างคำตอบได้'

    return NextResponse.json({ answer })

  } catch (error) {
    console.error('Error calling Gemini API:', error)
    return NextResponse.json(
      { answer: 'ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อกับผู้ช่วย AI กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}