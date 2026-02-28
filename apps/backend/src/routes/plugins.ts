import { Router } from 'express'
import { mockApps } from '../data/mockApps.js'

export const pluginsRouter = Router()

// Categories derived from apps
const getCategories = () => {
  const categoryMap = new Map<string, number>()
  mockApps.forEach(app => {
    categoryMap.set(app.category, (categoryMap.get(app.category) || 0) + 1)
  })
  return Array.from(categoryMap.entries()).map(([name, count], i) => ({
    id: `cat-${i + 1}`,
    name,
    icon: getCategoryIcon(name),
    count,
  }))
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'Project Management': '📊',
    'Automation': '⚡',
    'Communication': '💬',
    'Analytics': '📈',
    'Design': '🎨',
    'Development': '👨‍💻',
    'AI & Machine Learning': '🤖',
    'Security': '🔒',
  }
  return icons[category] || '📦'
}

// GET /api/plugins - List all apps with filters
pluginsRouter.get('/', (req, res) => {
  const { category, search, sort, limit, offset } = req.query
  
  let apps = [...mockApps]
  
  // Filter by category
  if (category) {
    apps = apps.filter(app => 
      app.category.toLowerCase().includes((category as string).toLowerCase().replace('-', ' '))
    )
  }
  
  // Filter by search
  if (search) {
    const searchLower = (search as string).toLowerCase()
    apps = apps.filter(app =>
      app.name.toLowerCase().includes(searchLower) ||
      app.description.toLowerCase().includes(searchLower) ||
      app.category.toLowerCase().includes(searchLower)
    )
  }
  
  // Sort
  switch (sort) {
    case 'rating':
      apps.sort((a, b) => b.rating - a.rating)
      break
    case 'downloads':
      apps.sort((a, b) => b.downloads - a.downloads)
      break
    case 'name':
      apps.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'newest':
      apps.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    default:
      // Default: featured first, then by downloads
      apps.sort((a, b) => {
        if (a.featured !== b.featured) return b.featured ? 1 : -1
        return b.downloads - a.downloads
      })
  }
  
  // Pagination
  const limitNum = parseInt(limit as string) || 20
  const offsetNum = parseInt(offset as string) || 0
  const paginatedApps = apps.slice(offsetNum, offsetNum + limitNum)
  
  res.json({
    success: true,
    data: paginatedApps,
    total: apps.length,
    limit: limitNum,
    offset: offsetNum,
  })
})

// GET /api/plugins/categories - List categories
pluginsRouter.get('/categories', (req, res) => {
  res.json({
    success: true,
    data: getCategories(),
  })
})

// GET /api/plugins/featured - List featured apps
pluginsRouter.get('/featured', (req, res) => {
  const featuredApps = mockApps.filter(app => app.featured)
  res.json({
    success: true,
    data: featuredApps,
  })
})

// GET /api/plugins/:id - Get app by ID
pluginsRouter.get('/:id', (req, res) => {
  const app = mockApps.find(a => a.id === req.params.id)
  
  if (!app) {
    return res.status(404).json({
      success: false,
      error: 'App not found',
    })
  }
  
  res.json({
    success: true,
    data: app,
  })
})

// GET /api/plugins/:id/reviews - Get app reviews
pluginsRouter.get('/:id/reviews', (req, res) => {
  const app = mockApps.find(a => a.id === req.params.id)
  
  if (!app) {
    return res.status(404).json({
      success: false,
      error: 'App not found',
    })
  }
  
  res.json({
    success: true,
    data: app.reviews || [],
  })
})

// GET /api/plugins/developer/:name - Get apps by developer
pluginsRouter.get('/developer/:name', (req, res) => {
  const developerApps = mockApps.filter(
    app => app.developer.toLowerCase() === decodeURIComponent(req.params.name).toLowerCase()
  )
  
  res.json({
    success: true,
    data: developerApps,
  })
})