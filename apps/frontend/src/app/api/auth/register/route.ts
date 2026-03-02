import { NextRequest, NextResponse } from 'next/server'

const API_BASE = process.env.BACKEND_API_URL || 'http://localhost:3001'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    
    const data = await res.json()
    
    if (!res.ok) {
      return NextResponse.json({ error: data.error || 'Registration failed' }, { status: res.status })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Register proxy error:', error)
    return NextResponse.json({ error: 'Network error' }, { status: 503 })
  }
}