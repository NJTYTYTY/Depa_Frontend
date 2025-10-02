import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// ✅ Schema สำหรับ validate request body
const requestSchema = z.object({
  question: z.string().min(1, 'กรุณาพิมพ์คำถาม'),
  pondId: z.string().optional(),
  pondData: z.object({}).passthrough().optional(),
})


// ✅ Helper: จัดรูปข้อมูลบ่อให้อ่านง่าย
function formatPondData(pondData: any) {
  if (!pondData) return 'ไม่มีข้อมูลบ่อ'

  return `
- ชื่อบ่อ: ${pondData?.name ?? 'ไม่ระบุ'}
- ขนาดบ่อ: ${pondData?.size ?? 'ไม่ระบุ'} ไร่
- วันที่ลงบ่อ: ${pondData?.date ?? 'ไม่ระบุ'}
- ขนาด ก x ย: ${pondData?.dimensions ?? 'ไม่ระบุ'}
- ความลึกบ่อ: ${pondData?.depth ?? 'ไม่ระบุ'} เมตร
- จำนวนลูกกุ้งที่ปล่อย: ${pondData?.shrimp_count ?? 'ไม่ระบุ'} ตัว
- ที่ตั้งบ่อ: ${pondData?.location ?? 'ไม่ระบุ'}
- หมายเหตุ: ${pondData?.notes ?? 'ไม่มี'}
- วันที่สร้างบ่อ: ${pondData?.created_at ? new Date(pondData.created_at).toLocaleDateString('th-TH') : 'ไม่ระบุ'}
- วันที่อัปเดตล่าสุด: ${pondData?.updated_at ? new Date(pondData.updated_at).toLocaleDateString('th-TH') : 'ไม่ระบุ'}
`
}

// ✅ API Route
export async function POST(request: NextRequest) {
  try {
    // 1) อ่านและ validate body
    const body = await request.json().catch(() => null)
    const { question, pondId, pondData } = requestSchema.parse(body)

    // 2) ตรวจสอบ API key
    const apiKey = process.env.DEEPSEEK_API_KEY
    console.log('🔑 API Key check:', {
      hasApiKey: !!apiKey,
      keyLength: apiKey?.length || 0,
      environment: process.env.NODE_ENV
    })
    
    if (!apiKey) {
      console.log('❌ DEEPSEEK_API_KEY not found in environment variables')
      // ส่ง fallback response แทน error
      return NextResponse.json({
        success: true,
        data: { 
          answer: `สวัสดีครับ! ผมคือผู้ช่วย AI สำหรับการเลี้ยงกุ้ง

ข้อมูลบ่อปัจจุบัน:
- ชื่อบ่อ: ${pondData?.name || 'ไม่ระบุ'}
- ขนาดบ่อ: ${pondData?.size || 'ไม่ระบุ'} ไร่
- จำนวนกุ้ง: ${pondData?.shrimp_count || 'ไม่ระบุ'} ตัว

คำถาม: ${question}

คำตอบ: ขออภัยครับ ตอนนี้ระบบ AI ยังไม่พร้อมใช้งาน แต่ผมสามารถให้คำแนะนำทั่วไปเกี่ยวกับการเลี้ยงกุ้งได้:

- ควรตรวจสอบคุณภาพน้ำเป็นประจำ
- ให้อาหารกุ้งในปริมาณที่เหมาะสม
- ระวังโรคและศัตรูพืช
- เปลี่ยนน้ำตามกำหนด

หากต้องการคำแนะนำเฉพาะเจาะจง กรุณาติดต่อผู้เชี่ยวชาญครับ`
        }
      })
    }

    // 3) สร้าง context
    const context = `
คุณคือผู้ช่วย AI ที่เชี่ยวชาญด้านการเลี้ยงกุ้งและบ่อเลี้ยงกุ้ง

ข้อมูลบ่อปัจจุบัน (ID: ${pondId ?? 'ไม่ระบุ'}):
${formatPondData(pondData)}

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

    // 🔍 log context เฉพาะ dev
    if (process.env.NODE_ENV !== 'production') {
      console.log('🤖 Generated Context:', context)
    }

    // 4) เรียก DeepSeek API พร้อม timeout
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000) // 10s timeout

    console.log('🚀 Calling DeepSeek API...')
    const response = await fetch(
      'https://api.deepseek.com/v1/chat/completions',
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'คุณคือผู้ช่วย AI ที่เชี่ยวชาญด้านการเลี้ยงกุ้งและบ่อเลี้ยงกุ้ง ตอบเป็นภาษาไทยที่เข้าใจง่ายสำหรับเกษตรกร'
            },
            {
              role: 'user',
              content: context
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        }),
        signal: controller.signal,
      }
    )
    
    
    
    console.log('📡 DeepSeek API Response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    })

    clearTimeout(timeout)

    // 5) ตรวจสอบ response
    if (!response.ok) {
      const errText = await response.text()
      console.log('Gemini API error response:', errText)
      
      // ถ้าไม่มี API key หรือ API key ไม่ถูกต้อง ให้ส่ง fallback response
      if (response.status === 400 || response.status === 403) {
        return NextResponse.json({
          success: true,
          data: { 
            answer: `สวัสดีครับ! ผมคือผู้ช่วย AI สำหรับการเลี้ยงกุ้ง

ข้อมูลบ่อปัจจุบัน:
- ชื่อบ่อ: ${pondData?.name || 'ไม่ระบุ'}
- ขนาดบ่อ: ${pondData?.size || 'ไม่ระบุ'} ไร่
- จำนวนกุ้ง: ${pondData?.shrimp_count || 'ไม่ระบุ'} ตัว

คำถาม: ${question}

คำตอบ: ขออภัยครับ ตอนนี้ระบบ AI ยังไม่พร้อมใช้งาน แต่ผมสามารถให้คำแนะนำทั่วไปเกี่ยวกับการเลี้ยงกุ้งได้:

- ควรตรวจสอบคุณภาพน้ำเป็นประจำ
- ให้อาหารกุ้งในปริมาณที่เหมาะสม
- ระวังโรคและศัตรูพืช
- เปลี่ยนน้ำตามกำหนด

หากต้องการคำแนะนำเฉพาะเจาะจง กรุณาติดต่อผู้เชี่ยวชาญครับ`
          }
        })
      }
      
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'AI API เรียกใช้งานไม่สำเร็จ',
            code: response.status,
            details: errText,
          },
        },
        { status: 500 }
      )
    }

    const data = await response.json()
    const answer =
      data.choices?.[0]?.message?.content ||
      'ไม่สามารถสร้างคำตอบได้'

    // 6) ส่งกลับ standardized response
    return NextResponse.json({
      success: true,
      data: { answer },
    })
  } catch (error) {
    console.log('Error in POST /api/agent:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          message:
            error instanceof Error ? error.message : 'Unknown error occurred',
          code: 500,
          environment: process.env.NODE_ENV,
        },
      },
      { status: 500 }
    )
  }
}
