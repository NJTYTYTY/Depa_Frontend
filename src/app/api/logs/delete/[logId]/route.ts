import { NextRequest, NextResponse } from 'next/server'

// DELETE /api/logs/delete/[logId] - Delete a log file
export async function DELETE(
  request: NextRequest,
  { params }: { params: { logId: string } }
) {
  try {
    const { logId } = params
    
    // Forward request to backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    const deleteUrl = `${backendUrl}/api/v1/logs/${logId}`
    
    console.log('🔍 Delete log request:', {
      logId,
      backendUrl,
      deleteUrl
    })
    
    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('🔍 Delete response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.log('🔍 Delete error response:', errorText)
      throw new Error(`Backend responded with ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log('🔍 Delete success:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error deleting log:', error)
    return NextResponse.json(
      { error: 'Failed to delete log file' },
      { status: 500 }
    )
  }
}