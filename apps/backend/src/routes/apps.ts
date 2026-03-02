import { Router } from 'express'

export const appsRouter = Router()

// Mock data
const mockApps = [
  {
    id: '1',
    name: '项目管理增强',
    description: '为 ONES 项目添加甘特图、看板视图等高级功能',
    category: '项目管理',
    installs: 12500,
    rating: 4.8,
    version: '2.1.0',
    developer: 'ONES Team',
    icon: '📊',
    lastUpdated: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    name: '自动化工作流',
    description: '创建自定义自动化规则，提升团队效率',
    category: '自动化',
    installs: 8900,
    rating: 4.6,
    version: '1.5.0',
    developer: 'ONES Team',
    icon: '⚡',
    lastUpdated: '2024-01-10T00:00:00Z',
  },
  {
    id: '3',
    name: '代码仓库集成',
    description: '连接 GitHub、GitLab，实现代码与项目联动',
    category: '开发工具',
    installs: 6700,
    rating: 4.9,
    version: '3.0.0',
    developer: 'ONES Team',
    icon: '🔗',
    lastUpdated: '2024-01-12T00:00:00Z',
  },
]

// GET /api/apps - List apps
appsRouter.get('/', (req, res) => {
  const { q, category, sort } = req.query

  let apps = [...mockApps]

  // Filter by search query
  if (q && typeof q === 'string') {
    const query = q.toLowerCase()
    apps = apps.filter(
      (app) =>
        app.name.toLowerCase().includes(query) ||
        app.description.toLowerCase().includes(query)
    )
  }

  // Filter by category
  if (category && typeof category === 'string' && category !== '全部') {
    apps = apps.filter((app) => app.category === category)
  }

  // Sort
  if (sort === 'rating') {
    apps.sort((a, b) => b.rating - a.rating)
  } else if (sort === 'name') {
    apps.sort((a, b) => a.name.localeCompare(b.name))
  } else {
    // Default: sort by installs
    apps.sort((a, b) => b.installs - a.installs)
  }

  res.json({ apps, total: apps.length })
})

// GET /api/apps/categories - List categories
appsRouter.get('/categories', (req, res) => {
  const categories = [...new Set(mockApps.map((app) => app.category))]
  res.json({ categories })
})

// GET /api/apps/:id - Get app details
appsRouter.get('/:id', (req, res) => {
  const app = mockApps.find((a) => a.id === req.params.id)
  if (!app) {
    return res.status(404).json({ error: 'App not found' })
  }
  res.json(app)
})