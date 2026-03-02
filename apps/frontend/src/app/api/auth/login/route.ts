import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getDb, users, eq } from '@/lib/db'

export const dynamic = 'force-dynamic'

const JWT_SECRET = process.env.JWT_SECRET || 'ones-marketplace-jwt-secret'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    // Validation
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }
    
    const db = getDb()
    
    // Find user by email
    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1)
    
    if (userResult.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }
    
    const user = userResult[0]
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    return NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}