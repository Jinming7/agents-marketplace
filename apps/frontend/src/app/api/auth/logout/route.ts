import { NextResponse } from 'next/server'

// Logout is handled client-side by removing the token from localStorage
// This endpoint exists for consistency and future server-side token invalidation
export async function POST() {
  return NextResponse.json({ success: true })
}