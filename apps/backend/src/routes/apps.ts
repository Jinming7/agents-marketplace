import { Router } from 'express'
import { asyncHandler } from '../middleware/errorHandler.js'
import { validate, appValidation } from '../middleware/validation.js'
import pool from '../config/database.js'

const router = Router()

// GET /api/apps - List all apps with optional filtering and pagination
router.get('/', validate(appValidation.list), asyncHandler(async (req, res) => {
  const { q, category, sort, page = '1', pageSize = '10' } = req.query
  
  // Build WHERE clause
  let whereClause = 'WHERE 1=1'
  const params: any[] = []
  let paramIndex = 1
  
  if (q && typeof q === 'string') {
    whereClause += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`
    params.push(`%${q}%`)
    paramIndex++
  }
  
  if (category && typeof category === 'string') {
    whereClause += ` AND category_name = $${paramIndex}`
    params.push(category)
    paramIndex++
  }
  
  // Get total count (without ORDER BY)
  const countQuery = `SELECT COUNT(*) FROM marketplace_apps ${whereClause}`
  const countResult = await pool.query(countQuery, params)
  const total = parseInt(countResult.rows[0].count)
  
  // Build main query with sorting
  let query = `SELECT * FROM marketplace_apps ${whereClause}`
  
  if (sort === 'installs') {
    query += ' ORDER BY installs DESC'
  } else if (sort === 'rating') {
    query += ' ORDER BY rating DESC'
  } else if (sort === 'name') {
    query += ' ORDER BY name ASC'
  } else {
    query += ' ORDER BY created_at DESC'
  }
  
  // Pagination
  const pageNum = Math.max(1, parseInt(page as string, 10))
  const pageSizeNum = Math.min(50, Math.max(1, parseInt(pageSize as string, 10)))
  const startIndex = (pageNum - 1) * pageSizeNum
  
  query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
  params.push(pageSizeNum, startIndex)
  
  const result = await pool.query(query, params)
  
  // Convert PostgreSQL arrays to JSON
  const apps = result.rows.map((row: any) => ({
    ...row,
    highlights: row.highlights || [],
    screenshots: row.screenshots || [],
    compatibility: row.compatibility || []
  }))
  
  res.json({ 
    apps, 
    total,
    page: pageNum,
    pageSize: pageSizeNum,
    totalPages: Math.ceil(total / pageSizeNum)
  })
}))

// GET /api/apps/:id - Get app by ID
router.get('/:id', validate(appValidation.getById), asyncHandler(async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM marketplace_apps WHERE id::text = $1',
    [req.params.id]
  )
  
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'APP_NOT_FOUND', message: 'App not found' })
  }
  
  const app = result.rows[0]
  res.json({ 
    ...app,
    highlights: app.highlights || [],
    screenshots: app.screenshots || [],
    compatibility: app.compatibility || []
  })
}))

// GET /api/apps/:id/reviews - Get app reviews
router.get('/:id/reviews', asyncHandler(async (req, res) => {
  const appId = req.params.id
  
  // Get app first to check existence (try both UUID and text formats)
  const appResult = await pool.query(
    'SELECT * FROM marketplace_apps WHERE id::text = $1',
    [appId]
  )
  
  if (appResult.rows.length === 0) {
    return res.status(404).json({ error: 'APP_NOT_FOUND', message: 'App not found' })
  }
  
  const app = appResult.rows[0]
  
  // Get reviews - use the actual UUID from the app
  const reviewsResult = await pool.query(
    'SELECT * FROM marketplace_reviews WHERE app_id = $1 ORDER BY created_at DESC',
    [app.id]
  )
  
  const reviews = reviewsResult.rows
  
  // Calculate rating distribution
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  reviews.forEach((r: any) => {
    const rating = Math.round(r.rating) as keyof typeof ratingDistribution
    if (rating >= 1 && rating <= 5) {
      ratingDistribution[rating]++
    }
  })
  
  // Calculate average rating from reviews
  const avgResult = await pool.query(
    'SELECT AVG(rating) as avg_rating FROM marketplace_reviews WHERE app_id = $1',
    [app.id]
  )
  const averageRating = avgResult.rows[0]?.avg_rating ? parseFloat(avgResult.rows[0].avg_rating).toFixed(1) : app.rating
  
  res.json({
    reviews,
    total: reviews.length,
    averageRating: parseFloat(averageRating),
    ratingDistribution
  })
}))

// POST /api/apps/:id/reviews - Add a review
router.post('/:id/reviews', asyncHandler(async (req, res) => {
  const appId = req.params.id
  const { rating, comment, userId, userName } = req.body
  
  // Check if app exists
  const appResult = await pool.query(
    'SELECT * FROM marketplace_apps WHERE id::text = $1',
    [appId]
  )
  
  if (appResult.rows.length === 0) {
    return res.status(404).json({ error: 'APP_NOT_FOUND', message: 'App not found' })
  }
  
  const app = appResult.rows[0]
  
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'Rating must be between 1 and 5' })
  }
  
  if (!userId || !userName) {
    return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'userId and userName are required' })
  }
  
  const result = await pool.query(
    'INSERT INTO marketplace_reviews (app_id, user_id, user_name, rating, comment) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [app.id, userId, userName, rating, comment || '']
  )
  
  const newReview = result.rows[0]
  
  // Update app's average rating
  await pool.query(
    'UPDATE marketplace_apps SET rating = (SELECT AVG(rating) FROM marketplace_reviews WHERE app_id = $1) WHERE id = $1',
    [app.id]
  )
  
  res.status(201).json({ success: true, review: newReview })
}))

export default router
