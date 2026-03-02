import { NextRequest, NextResponse } from 'next/server'
import { getDb, marketplaceApps, marketplaceReviews, eq } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const db = getDb()
    
    // Get app by ID
    const appResult = await db.select()
      .from(marketplaceApps)
      .where(eq(marketplaceApps.id, id))
      .limit(1)
    
    if (appResult.length === 0) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 })
    }
    
    const app = appResult[0]
    
    // Get reviews for this app
    const reviews = await db.select()
      .from(marketplaceReviews)
      .where(eq(marketplaceReviews.appId, id))
    
    // Format response
    const formattedApp = {
      id: app.id,
      name: app.name,
      description: app.description,
      summary: app.description?.substring(0, 150) + '...',
      category: app.categoryName,
      installs: app.installs,
      rating: app.rating,
      version: app.version,
      developer: app.developer,
      icon: app.icon,
      featured: app.featured,
      verified: app.verified,
      pricing: app.pricing,
      highlights: app.highlights,
      screenshots: app.screenshots,
      compatibility: app.compatibility,
      lastUpdated: app.lastUpdated,
      reviews: reviews.map(r => ({
        id: r.id,
        userId: r.userId,
        userName: r.userName,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
      }))
    }
    
    return NextResponse.json(formattedApp)
  } catch (error) {
    console.error('Get app error:', error)
    return NextResponse.json({ error: 'Failed to fetch app' }, { status: 500 })
  }
}