import { NextRequest, NextResponse } from 'next/server'

// Mock user database (shared with login)
// In production, use a real database
const users: Map<string, { id: string; name: string; email: string; password: string; avatar: string | null }> = new Map([
  ['demo@example.com', { id: '1', name: 'Demo User', email: 'demo@example.com', password: 'demo123', avatar: null }]
])

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()
    
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }
    
    if (users.has(email)) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }
    
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password,
      avatar: null
    }
    
    users.set(email, user)
    
    // Generate a simple token (in production, use JWT)
    const token = `token_${user.id}_${Date.now()}`
    
    return NextResponse.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar }
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}