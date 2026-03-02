import { NextRequest, NextResponse } from 'next/server'

// Mock user database (in production, use a real database)
const users: Map<string, { id: string; name: string; email: string; password: string; avatar: string | null }> = new Map([
  ['demo@example.com', { id: '1', name: 'Demo User', email: 'demo@example.com', password: 'demo123', avatar: null }]
])

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }
    
    const user = users.get(email)
    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }
    
    // Generate a simple token (in production, use JWT)
    const token = `token_${user.id}_${Date.now()}`
    
    return NextResponse.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}