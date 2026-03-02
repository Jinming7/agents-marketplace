import { NextRequest, NextResponse } from 'next/server'
import { getDb, marketplaceApps, marketplaceReviews, eq } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const id = params.id
    
    if (!id) {
      return NextResponse.json({ error: 'App ID is required' }, { status: 400 })
    }
    
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
      downloads: app.installs || 0,
      rating: parseFloat(app.rating || '0'),
      reviews: reviews.length,
      version: app.version,
      developer: app.developer,
      icon: app.icon || '📦',
      featured: app.featured || false,
      verified: app.verified || false,
      pricing: app.pricing ? JSON.parse(app.pricing as string) : null,
      highlights: app.highlights,
      screenshots: app.screenshots,
      features: app.highlights,
      longDescription: app.description,
    }
    
    return NextResponse.json(formattedApp)
  } catch (error) {
    console.error('Get app error:', error)
    return NextResponse.json({ error: 'Failed to fetch app' }, { status: 500 })
  }
}