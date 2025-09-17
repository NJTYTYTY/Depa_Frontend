import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ logId: string }> }
) {
  try {
    const { logId } = await params

    const response = await fetch(`${BACKEND_URL}/api/v1/logs/${logId}/download`, {
      method: 'GET',
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.detail || 'Failed to download log file' },
        { status: response.status }
      )
    }

    // Get the file content and headers
    const fileBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'text/plain'
    const contentDisposition = response.headers.get('content-disposition') || 'attachment'

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition,
      },
    })
  } catch (error) {
    console.error('Error downloading log file:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
