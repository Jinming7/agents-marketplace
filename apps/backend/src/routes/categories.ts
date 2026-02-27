import { Router } from 'express'
import { asyncHandler } from '../middleware/errorHandler.js'
import pool from '../config/database.js'

const router = Router()

// GET /api/categories - Get all categories
router.get('/', asyncHandler(async (req, res) => {
  const result = await pool.query('SELECT * FROM categories ORDER BY name')
  res.json({ categories: result.rows })
}))

export default router
