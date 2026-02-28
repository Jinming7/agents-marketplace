import { Router } from 'express'

export const authRouter = Router()

// Mock user database
const users: any[] = [
  { id: '1', name: 'Demo User', email: 'demo@example.com', password: 'demo123', avatar: null }
]

// POST /api/auth/register
authRouter.post('/register', (req, res) => {
  const { name, email, password } = req.body
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' })
  }
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already registered' })
  }
  
  const user = { id: Date.now().toString(), name, email, password, avatar: null }
  users.push(user)
  
  const token = `token_${user.id}_${Date.now()}`
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } })
})

// POST /api/auth/login
authRouter.post('/login', (req, res) => {
  const { email, password } = req.body
  
  const user = users.find(u => u.email === email && u.password === password)
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }
  
  const token = `token_${user.id}_${Date.now()}`
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } })
})

// POST /api/auth/logout
authRouter.post('/logout', (req, res) => {
  res.json({ success: true })
})

// GET /api/auth/me
authRouter.get('/me', (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  const token = authHeader.split(' ')[1]
  const userId = token.split('_')[1]
  const user = users.find(u => u.id === userId)
  
  if (!user) {
    return res.status(401).json({ error: 'User not found' })
  }
  
  res.json({ id: user.id, name: user.name, email: user.email, avatar: user.avatar })
})

export default authRouter