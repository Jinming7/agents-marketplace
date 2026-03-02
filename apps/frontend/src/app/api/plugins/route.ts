import { NextRequest, NextResponse } from 'next/server'
import { getDb, marketplaceApps, categories, eq, desc, asc, sql } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'installs'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    const db = getDb()
    
    // Build query
    let query = db.select().from(marketplaceApps)
    
    // Get all apps
    let apps = await db.select().from(marketplaceApps)
    
    // Filter by category
    if (category && category !== 'all') {
      apps = apps.filter(app => app.categoryName === category)
    }
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      apps = apps.filter(app => 
        app.name?.toLowerCase().includes(searchLower) ||
        app.description?.toLowerCase().includes(searchLower)
      )
    }
    
    // Sort
    if (sort === 'rating') {
      apps.sort((a, b) => parseFloat(b.rating || '0') - parseFloat(a.rating || '0'))
    } else if (sort === 'name') {
      apps.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    } else {
      // Default: sort by installs
      apps.sort((a, b) => (b.installs || 0) - (a.installs || 0))
    }
    
    // Pagination
    const total = apps.length
    const paginatedApps = apps.slice(offset, offset + limit)
    
    // Format response - return array directly for compatibility
    const formattedApps = paginatedApps.map(app => ({
      id: app.id,
      name: app.name,
      description: app.description,
      summary: app.description?.substring(0, 150) + '...',
      category: app.categoryName,
      downloads: app.installs || 0,  // Map installs to downloads
      rating: parseFloat(app.rating || '0'),
      version: app.version,
      developer: app.developer,
      icon: app.icon || '📦',
      featured: app.featured || false,
      verified: app.verified || false,
      pricing: app.pricing,
      screenshots: app.screenshots,
    }))
    
    return NextResponse.json(formattedApps)
  } catch (error) {
    console.error('Get apps error:', error)
    return NextResponse.json({ error: 'Failed to fetch apps' }, { status: 500 })
  }
}