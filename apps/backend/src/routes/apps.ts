import { Router } from 'express'
import { asyncHandler } from '../middleware/errorHandler.js'
import { validate, appValidation } from '../middleware/validation.js'

const router = Router()

// Mock data
const apps = [
  { id: '1', name: 'Slack', description: 'Team communication platform', category: 'Collaboration', installs: 10000, rating: 4.5 },
  { id: '2', name: 'Jira', description: 'Project tracking tool', category: 'Productivity', installs: 8000, rating: 4.3 },
  { id: '3', name: 'Confluence', description: 'Documentation platform', category: 'Knowledge', installs: 6000, rating: 4.2 },
  { id: '4', name: 'GitHub', description: 'Code collaboration', category: 'Development', installs: 15000, rating: 4.8 },
  { id: '5', name: 'Figma', description: 'Design tool', category: 'Design', installs: 5000, rating: 4.6 }
]

// GET /api/apps - List all apps with optional filtering
router.get('/', validate(appValidation.list), asyncHandler(async (req, res) => {
  const { q, category, sort } = req.query
  let result = [...apps]
  
  if (q && typeof q === 'string') {
    const searchTerm = q.toLowerCase()
    result = result.filter(app => 
      app.name.toLowerCase().includes(searchTerm) ||
      app.description.toLowerCase().includes(searchTerm)
    )
  }
  
  if (category && typeof category === 'string') {
    result = result.filter(app => app.category === category)
  }
  
  if (sort === 'installs') {
    result.sort((a, b) => b.installs - a.installs)
  } else if (sort === 'rating') {
    result.sort((a, b) => b.rating - a.rating)
  } else if (sort === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name))
  }
  
  res.json({ apps: result, total: result.length })
}))

// GET /api/apps/:id - Get app by ID
router.get('/:id', validate(appValidation.getById), asyncHandler(async (req, res) => {
  const app = apps.find(a => a.id === req.params.id)
  if (!app) {
    return res.status(404).json({ error: 'APP_NOT_FOUND', message: 'App not found' })
  }
  
  res.json({ 
    ...app, 
    version: '1.0.0', 
    developer: 'Company', 
    lastUpdated: '2024-01-15' 
  })
}))

export default router
