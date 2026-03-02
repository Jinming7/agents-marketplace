import { NextRequest, NextResponse } from 'next/server'

// Mock user database (shared with login/register)
const users: Map<string, { id: string; name: string; email: string; password: string; avatar: string | null }> = new Map([
  ['demo@example.com', { id: '1', name: 'Demo User', email: 'demo@example.com', password: 'demo123', avatar: null }]
])

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const token = authHeader.split(' ')[1]
    const userId = token.split('_')[1]
    
    // Find user by ID
    let user = null
    for (const u of users.values()) {
      if (u.id === userId) {
        user = u
        break
      }
    }
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }
    
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar
    })
  } catch (error) {
    console.error('Me error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}