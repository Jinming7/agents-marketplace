import { NextResponse } from 'next/server'

const API_BASE = process.env.BACKEND_API_URL || 'http://localhost:3001'

export async function POST() {
  try {
    const res = await fetch(`${API_BASE}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Logout proxy error:', error)
    return NextResponse.json({ error: 'Network error' }, { status: 503 })
  }
}