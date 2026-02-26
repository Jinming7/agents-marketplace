import { Router } from 'express'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = Router()

// Mock data
const apps = [
  { id: '1', name: 'Slack', description: 'Team communication platform', category: 'Collaboration', installs: 10000, rating: 4.5 },
  { id: '2', name: 'Jira', description: 'Project tracking tool', category: 'Productivity', installs: 8000, rating: 4.3 },
  { id: '3', name: 'Confluence', description: 'Documentation platform', category: 'Knowledge', installs: 6000, rating: 4.2 },
  { id: '4', name: 'GitHub', description: 'Code collaboration', category: 'Development', installs: 15000, rating: 4.8 },
  { id: '5', name: 'Figma', description: 'Design tool', category: 'Design', installs: 5000, rating: 4.6 }
]

// GET /api/categories - Get all categories
router.get('/', asyncHandler(async (req, res) => {
  const categories = [...new Set(apps.map(a => a.category))]
  res.json({ categories })
}))

export default router
