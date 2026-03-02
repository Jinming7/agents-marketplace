import { Router } from 'express'
import postgres from 'postgres'

export const pluginsRouter = Router()

// Database connection
const getDb = () => {
  return postgres(process.env.DATABASE_URL || '', { prepare: false })
}

// GET /api/plugins - List all apps with filters
pluginsRouter.get('/', async (req, res) => {
  const sql = getDb()
  
  try {
    const { category, search, sort, limit = 20, offset = 0 } = req.query
    
    // Build query
    let query = 'SELECT * FROM marketplace_apps'
    const conditions = []
    const params: any[] = []
    let paramIndex = 1
    
    if (category) {
      conditions.push(`category_name ILIKE $${paramIndex++}`)
      params.push(`%${category}%`)
    }
    
    if (search) {
      conditions.push(`(name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`)
      params.push(`%${search}%`)
      paramIndex++
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }
    
    // Sort
    switch (sort) {
      case 'rating':
        query += ' ORDER BY rating DESC'
        break
      case 'name':
        query += ' ORDER BY name ASC'
        break
      case 'newest':
        query += ' ORDER BY created_at DESC'
        break
      default:
        query += ' ORDER BY featured DESC, installs DESC'
    }
    
    query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex}`
    params.push(Number(limit), Number(offset))
    
    const apps = await sql.unsafe(query, params)
    
    // Get total count
    const countResult = await sql.unsafe('SELECT COUNT(*) as count FROM marketplace_apps')
    const total = countResult[0]?.count || 0
    
    // Transform data
    const transformedApps = apps.map((app: any) => ({
      id: app.id,
      name: app.name,
      description: app.description,
      icon: app.icon || '📦',
      category: app.category_name,
      developer: app.developer,
      rating: parseFloat(app.rating || '0'),
      downloads: app.installs || 0,
      verified: app.verified || false,
      featured: app.featured || false,
      pricing: app.pricing ? JSON.parse(app.pricing) : null,
      screenshots: app.screenshots || [],
      features: app.highlights || [],
      reviews: [],
      createdAt: app.created_at,
      updatedAt: app.updated_at,
    }))
    
    res.json({
      success: true,
      data: transformedApps,
      total: Number(total),
      limit: Number(limit),
      offset: Number(offset),
    })
  } catch (error) {
    console.error('Error fetching apps:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch apps' })
  } finally {
    await sql.end()
  }
})

// GET /api/plugins/categories - List categories
pluginsRouter.get('/categories', async (req, res) => {
  const sql = getDb()
  
  try {
    const categories = await sql`
      SELECT 
        c.id,
        c.name,
        c.icon,
        (SELECT COUNT(*) FROM marketplace_apps WHERE category_name = c.name) as count
      FROM marketplace_categories c
    `
    
    res.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch categories' })
  } finally {
    await sql.end()
  }
})

// GET /api/plugins/featured - List featured apps
pluginsRouter.get('/featured', async (req, res) => {
  const sql = getDb()
  
  try {
    const apps = await sql`
      SELECT * FROM marketplace_apps 
      WHERE featured = true 
      LIMIT 10
    `
    
    const transformedApps = apps.map((app: any) => ({
      id: app.id,
      name: app.name,
      description: app.description,
      icon: app.icon || '📦',
      category: app.category_name,
      developer: app.developer,
      rating: parseFloat(app.rating || '0'),
      downloads: app.installs || 0,
      verified: app.verified || false,
      featured: true,
      pricing: app.pricing ? JSON.parse(app.pricing) : null,
    }))
    
    res.json({
      success: true,
      data: transformedApps,
    })
  } catch (error) {
    console.error('Error fetching featured apps:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch featured apps' })
  } finally {
    await sql.end()
  }
})

// GET /api/plugins/:id - Get app by ID
pluginsRouter.get('/:id', async (req, res) => {
  const sql = getDb()
  
  try {
    const apps = await sql`
      SELECT * FROM marketplace_apps WHERE id = ${req.params.id} LIMIT 1
    `
    
    const app = apps[0]
    
    if (!app) {
      return res.status(404).json({
        success: false,
        error: 'App not found',
      })
    }
    
    res.json({
      success: true,
      data: {
        id: app.id,
        name: app.name,
        description: app.description,
        icon: app.icon || '📦',
        category: app.category_name,
        developer: app.developer,
        rating: parseFloat(app.rating || '0'),
        downloads: app.installs || 0,
        verified: app.verified || false,
        featured: app.featured || false,
        pricing: app.pricing ? JSON.parse(app.pricing) : null,
        screenshots: app.screenshots || [],
        features: app.highlights || [],
        version: app.version,
        reviews: [],
      },
    })
  } catch (error) {
    console.error('Error fetching app:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch app' })
  } finally {
    await sql.end()
  }
})