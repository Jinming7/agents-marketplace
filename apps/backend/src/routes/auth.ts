import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../lib/config.js'

export const authRouter = Router()

// Mock user store (replace with database in production)
const users: Map<string, { email: string; password: string; name: string }> = new Map()

// POST /api/auth/register
authRouter.post('/register', (req, res) => {
  const { email, password, name } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  if (users.has(email)) {
    return res.status(409).json({ error: 'User already exists' })
  }

  // In production, hash the password with bcrypt
  users.set(email, { email, password, name: name || email.split('@')[0] })

  const token = jwt.sign({ email }, config.jwtSecret, { expiresIn: '7d' })

  res.status(201).json({
    token,
    user: { email, name: name || email.split('@')[0] },
  })
})

// POST /api/auth/login
authRouter.post('/login', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const user = users.get(email)
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const token = jwt.sign({ email }, config.jwtSecret, { expiresIn: '7d' })

  res.json({
    token,
    user: { email: user.email, name: user.name },
  })
})