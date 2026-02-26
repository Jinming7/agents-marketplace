import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Mock data
const apps = [
  { id: '1', name: 'Slack', description: 'Team communication platform', category: 'Collaboration', installs: 10000, rating: 4.5 },
  { id: '2', name: 'Jira', description: 'Project tracking tool', category: 'Productivity', installs: 8000, rating: 4.3 },
  { id: '3', name: 'Confluence', description: 'Documentation platform', category: 'Knowledge', installs: 6000, rating: 4.2 },
  { id: '4', name: 'GitHub', description: 'Code collaboration', category: 'Development', installs: 15000, rating: 4.8 },
  { id: '5', name: 'Figma', description: 'Design tool', category: 'Design', installs: 5000, rating: 4.6 }
]

// Apps API
app.get('/api/apps', (req, res) => {
  const { q, category, sort } = req.query
  let result = [...apps]
  
  if (q) {
    result = result.filter(app => 
      app.name.toLowerCase().includes(q.toString().toLowerCase()) ||
      app.description.toLowerCase().includes(q.toString().toLowerCase())
    )
  }
  
  if (category) {
    result = result.filter(app => app.category === category)
  }
  
  if (sort === 'installs') {
    result.sort((a, b) => b.installs - a.installs)
  } else if (sort === 'rating') {
    result.sort((a, b) => b.rating - a.rating)
  }
  
  res.json({ apps: result, total: result.length })
})

app.get('/api/apps/:id', (req, res) => {
  const app = apps.find(a => a.id === req.params.id)
  if (app) {
    res.json({ ...app, version: '1.0.0', developer: 'Company', lastUpdated: '2024-01-15' })
  } else {
    res.status(404).json({ error: 'APP_NOT_FOUND', message: 'App not found' })
  }
})

app.get('/api/categories', (req, res) => {
  const categories = [...new Set(apps.map(a => a.category))]
  res.json({ categories })
})

// Auth API (mock)
const users: Record<string, { email: string; password: string }> = {}

app.post('/api/auth/register', (req, res) => {
  const { email, password } = req.body
  if (users[email]) {
    return res.status(400).json({ error: 'AUTH_EMAIL_EXISTS' })
  }
  users[email] = { email, password }
  res.json({ token: 'mock-token-' + Date.now(), user: { email } })
})

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body
  const user = users[email]
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'AUTH_INVALID_CREDENTIALS' })
  }
  res.json({ token: 'mock-token-' + Date.now(), user: { email } })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
