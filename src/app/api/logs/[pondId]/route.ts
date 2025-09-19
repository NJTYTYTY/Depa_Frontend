import { NextRequest, NextResponse } from 'next/server'

// GET /api/logs/[pondId] - Get log files for a specific pond
export async function GET(
  request: NextRequest,
  { params }: { params: { pondId: string } }
) {
  try {
    const { pondId } = params
    
    // Forward request to backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    const response = await fetch(`${backendUrl}/api/v1/logs/${pondId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch log files' },
      { status: 500 }
    )
  }
}