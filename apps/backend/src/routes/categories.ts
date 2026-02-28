import { Router } from 'express'

const router = Router()

// Categories data
const categories = [
  { id: 'project-management', name: 'Project Management', icon: '📊', color: 'from-blue-500 to-indigo-500', count: 12 },
  { id: 'automation', name: 'Automation', icon: '⚡', color: 'from-yellow-500 to-orange-500', count: 8 },
  { id: 'communication', name: 'Communication', icon: '💬', color: 'from-green-500 to-emerald-500', count: 15 },
  { id: 'analytics', name: 'Analytics', icon: '📈', color: 'from-purple-500 to-pink-500', count: 6 },
  { id: 'design', name: 'Design', icon: '🎨', color: 'from-pink-500 to-rose-500', count: 9 },
  { id: 'development', name: 'Development', icon: '👨‍💻', color: 'from-gray-500 to-slate-500', count: 18 },
  { id: 'ai-ml', name: 'AI & Machine Learning', icon: '🤖', color: 'from-indigo-500 to-violet-500', count: 7 },
  { id: 'security', name: 'Security', icon: '🔒', color: 'from-red-500 to-rose-500', count: 5 },
]

// GET /api/categories - List all categories
router.get('/', (req, res) => {
  res.json(categories)
})

// GET /api/categories/:id - Get category by ID
router.get('/:id', (req, res) => {
  const category = categories.find(c => c.id === req.params.id)
  if (!category) {
    return res.status(404).json({ error: 'Category not found' })
  }
  res.json(category)
})

export { router as categoriesRouter }