import { NextRequest, NextResponse } from 'next/server'

const API_BASE = process.env.BACKEND_API_URL || 'http://localhost:3001'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { 'Authorization': authHeader } : {}),
      },
    })
    
    const data = await res.json()
    
    if (!res.ok) {
      return NextResponse.json({ error: data.error || 'Unauthorized' }, { status: res.status })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Me proxy error:', error)
    return NextResponse.json({ error: 'Network error' }, { status: 503 })
  }
}