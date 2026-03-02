import { NextResponse } from 'next/server'
import { getDb, categories, marketplaceApps, eq, sql } from '@/lib/db'

export async function GET() {
  try {
    const db = getDb()
    
    // Get all categories
    const allCategories = await db.select().from(categories)
    
    // Get app count per category
    const apps = await db.select().from(marketplaceApps)
    
    const categoryCount = new Map<string, number>()
    apps.forEach(app => {
      if (app.categoryName) {
        categoryCount.set(app.categoryName, (categoryCount.get(app.categoryName) || 0) + 1)
      }
    })
    
    // Format response - add color for UI
    const formattedCategories = allCategories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon || '📦',
      count: categoryCount.get(cat.name) || 0,
      color: 'from-blue-500 to-blue-600',
    }))
    
    // Add "All" category
    const result = [
      { id: 'all', name: 'All', slug: 'all', description: 'All apps', icon: '🌐', count: apps.length, color: 'from-gray-500 to-gray-600' },
      ...formattedCategories
    ]
    
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}