import { Router } from 'express'
import { asyncHandler } from '../middleware/errorHandler.js'
import { validate, appValidation } from '../middleware/validation.js'

const router = Router()

// Enhanced mock data with more fields
const apps = [
  { 
    id: '1', 
    name: 'Slack', 
    description: 'Team communication platform', 
    category: 'Collaboration', 
    installs: 10000, 
    rating: 4.5,
    version: '4.35.0',
    developer: 'Salesforce',
    lastUpdated: '2024-01-15',
    pricing: 'Free tier, $12.75/user/month',
    highlights: ['Real-time messaging', 'Channel organization', 'App integrations'],
    screenshots: ['https://example.com/slack1.png', 'https://example.com/slack2.png'],
    compatibility: ['Web', 'Desktop', 'Mobile']
  },
  { 
    id: '2', 
    name: 'Jira', 
    description: 'Project tracking tool', 
    category: 'Productivity', 
    installs: 8000, 
    rating: 4.3,
    version: '9.12.0',
    developer: 'Atlassian',
    lastUpdated: '2024-01-10',
    pricing: 'Free for up to 10 users',
    highlights: ['Agile boards', 'Issue tracking', 'Reporting'],
    screenshots: ['https://example.com/jira1.png'],
    compatibility: ['Web', 'Desktop']
  },
  { 
    id: '3', 
    name: 'Confluence', 
    description: 'Documentation platform', 
    category: 'Knowledge', 
    installs: 6000, 
    rating: 4.2,
    version: '8.5.0',
    developer: 'Atlassian',
    lastUpdated: '2024-01-08',
    pricing: 'Free for up to 10 users',
    highlights: ['Team workspaces', 'Templates', 'Real-time collaboration'],
    screenshots: ['https://example.com/confluence1.png'],
    compatibility: ['Web', 'Desktop', 'Mobile']
  },
  { 
    id: '4', 
    name: 'GitHub', 
    description: 'Code collaboration', 
    category: 'Development', 
    installs: 15000, 
    rating: 4.8,
    version: '2024.01',
    developer: 'Microsoft',
    lastUpdated: '2024-01-20',
    pricing: 'Free for individuals',
    highlights: ['Git repositories', 'CI/CD', 'Code review'],
    screenshots: ['https://example.com/github1.png', 'https://example.com/github2.png'],
    compatibility: ['Web', 'Desktop', 'CLI']
  },
  { 
    id: '5', 
    name: 'Figma', 
    description: 'Design tool', 
    category: 'Design', 
    installs: 5000, 
    rating: 4.6,
    version: '2024.01',
    developer: 'Figma Inc.',
    lastUpdated: '2024-01-18',
    pricing: 'Free tier available',
    highlights: ['Vector editing', 'Prototyping', 'Design systems'],
    screenshots: ['https://example.com/figma1.png'],
    compatibility: ['Web', 'Desktop']
  }
]

// Mock reviews data
const reviews: Map<string, Array<{id: string; userId: string; userName: string; rating: number; comment: string; createdAt: string}>> = new Map([
  ['1', [
    { id: 'r1', userId: 'u1', userName: 'John D.', rating: 5, comment: 'Great team communication tool!', createdAt: '2024-01-10T10:00:00Z' },
    { id: 'r2', userId: 'u2', userName: 'Jane S.', rating: 4, comment: 'Very useful, but can be noisy', createdAt: '2024-01-08T14:30:00Z' }
  ]],
  ['4', [
    { id: 'r3', userId: 'u3', userName: 'Dev Pro', rating: 5, comment: 'Essential for any development team', createdAt: '2024-01-12T09:15:00Z' }
  ]]
])

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
    version: app.version, 
    developer: app.developer, 
    lastUpdated: app.lastUpdated,
    pricing: app.pricing,
    highlights: app.highlights,
    screenshots: app.screenshots,
    compatibility: app.compatibility
  })
}))

// GET /api/apps/:id/reviews - Get app reviews
router.get('/:id/reviews', asyncHandler(async (req, res) => {
  const appId = req.params.id
  const app = apps.find(a => a.id === appId)
  
  if (!app) {
    return res.status(404).json({ error: 'APP_NOT_FOUND', message: 'App not found' })
  }
  
  const appReviews = reviews.get(appId) || []
  
  // Calculate rating distribution
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  appReviews.forEach(r => {
    ratingDistribution[r.rating as keyof typeof ratingDistribution]++
  })
  
  res.json({
    reviews: appReviews,
    total: appReviews.length,
    averageRating: app.rating,
    ratingDistribution
  })
}))

// POST /api/apps/:id/reviews - Add a review
router.post('/:id/reviews', asyncHandler(async (req, res) => {
  const appId = req.params.id
  const { rating, comment, userId, userName } = req.body
  
  const app = apps.find(a => a.id === appId)
  if (!app) {
    return res.status(404).json({ error: 'APP_NOT_FOUND', message: 'App not found' })
  }
  
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'Rating must be between 1 and 5' })
  }
  
  if (!userId || !userName) {
    return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'userId and userName are required' })
  }
  
  const newReview = {
    id: `r${Date.now()}`,
    userId,
    userName,
    rating,
    comment: comment || '',
    createdAt: new Date().toISOString()
  }
  
  if (!reviews.has(appId)) {
    reviews.set(appId, [])
  }
  reviews.get(appId)!.push(newReview)
  
  res.status(201).json({ success: true, review: newReview })
}))

export default router
