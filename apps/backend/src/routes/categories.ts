import { Router } from 'express'
import postgres from 'postgres'

export const categoriesRouter = Router()

// Database connection
const getDb = () => {
  return postgres(process.env.DATABASE_URL || '', { prepare: false })
}

// GET /api/categories - List all categories
categoriesRouter.get('/', async (req, res) => {
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

// GET /api/categories/:id - Get category by ID
categoriesRouter.get('/:id', async (req, res) => {
  const sql = getDb()
  
  try {
    const categories = await sql`
      SELECT * FROM marketplace_categories WHERE id = ${req.params.id} LIMIT 1
    `
    
    const category = categories[0]
    
    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' })
    }
    
    res.json({
      success: true,
      data: category,
    })
  } catch (error) {
    console.error('Error fetching category:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch category' })
  } finally {
    await sql.end()
  }
})