import { Router } from 'express'
import { asyncHandler } from '../middleware/errorHandler.js'
import { validate, appValidation } from '../middleware/validation.js'
import pool from '../config/database.js'

const router = Router()

// GET /api/apps - List all apps with optional filtering and pagination
router.get('/', validate(appValidation.list), asyncHandler(async (req, res) => {
  const { q, category, sort, page = '1', pageSize = '10' } = req.query
  
  let query = 'SELECT * FROM apps WHERE 1=1'
  const params: any[] = []
  let paramIndex = 1
  
  if (q && typeof q === 'string') {
    query += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`
    params.push(`%${q}%`)
    paramIndex++
  }
  
  if (category && typeof category === 'string') {
    query += ` AND category_name = $${paramIndex}`
    params.push(category)
    paramIndex++
  }
  
  // Add sorting
  if (sort === 'installs') {
    query += ' ORDER BY installs DESC'
  } else if (sort === 'rating') {
    query += ' ORDER BY rating DESC'
  } else if (sort === 'name') {
    query += ' ORDER BY name ASC'
  } else {
    query += ' ORDER BY created_at DESC'
  }
  
  // Get total count
  const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)')
  const countResult = await pool.query(countQuery, params)
  const total = parseInt(countResult.rows[0].count)
  
  // Pagination
  const pageNum = Math.max(1, parseInt(page as string, 10))
  const pageSizeNum = Math.min(50, Math.max(1, parseInt(pageSize as string, 10)))
  const startIndex = (pageNum - 1) * pageSizeNum
  
  query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
  params.push(pageSizeNum, startIndex)
  
  const result = await pool.query(query, params)
  
  // Convert PostgreSQL arrays to JSON
  const apps = result.rows.map(row => ({
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
    'SELECT * FROM apps WHERE id = $1 OR id::text = $1',
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
  
  // Get app first to check existence
  const appResult = await pool.query(
    'SELECT * FROM apps WHERE id = $1 OR id::text = $1',
    [appId]
  )
  
  if (appResult.rows.length === 0) {
    return res.status(404).json({ error: 'APP_NOT_FOUND', message: 'App not found' })
  }
  
  const app = appResult.rows[0]
  
  // Get reviews
  const reviewsResult = await pool.query(
    'SELECT * FROM reviews WHERE app_id = $1 OR app_id::text = $1 ORDER BY created_at DESC',
    [appId]
  )
  
  const reviews = reviewsResult.rows
  
  // Calculate rating distribution
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  reviews.forEach(r => {
    const rating = Math.round(r.rating) as keyof typeof ratingDistribution
    if (rating >= 1 && rating <= 5) {
      ratingDistribution[rating]++
    }
  })
  
  // Calculate average rating from reviews
  const avgResult = await pool.query(
    'SELECT AVG(rating) as avg_rating FROM reviews WHERE app_id = $1 OR app_id::text = $1',
    [appId]
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
    'SELECT * FROM apps WHERE id = $1 OR id::text = $1',
    [appId]
  )
  
  if (appResult.rows.length === 0) {
    return res.status(404).json({ error: 'APP_NOT_FOUND', message: 'App not found' })
  }
  
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'Rating must be between 1 and 5' })
  }
  
  if (!userId || !userName) {
    return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'userId and userName are required' })
  }
  
  const result = await pool.query(
    'INSERT INTO reviews (app_id, user_id, user_name, rating, comment) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [appId, userId, userName, rating, comment || '']
  )
  
  const newReview = result.rows[0]
  
  // Update app's average rating
  await pool.query(
    'UPDATE apps SET rating = (SELECT AVG(rating) FROM reviews WHERE app_id = $1 OR app_id::text = $1) WHERE id = $1 OR id::text = $1',
    [appId]
  )
  
  res.status(201).json({ success: true, review: newReview })
}))

export default router
