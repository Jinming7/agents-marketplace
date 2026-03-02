import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { getDb, users, eq } from '@/lib/db'

export const dynamic = 'force-dynamic'

const JWT_SECRET = process.env.JWT_SECRET || 'ones-marketplace-jwt-secret'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const token = authHeader.split(' ')[1]
    
    // Verify JWT token
    let decoded: { userId: string; email: string }
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    const db = getDb()
    
    // Find user by ID
    const userResult = await db.select().from(users).where(eq(users.id, decoded.userId)).limit(1)
    
    if (userResult.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }
    
    const user = userResult[0]
    
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    })
  } catch (error) {
    console.error('Me error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}