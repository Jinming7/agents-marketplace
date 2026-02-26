import { Router } from 'express'
import { asyncHandler } from '../middleware/errorHandler.js'
import { validate, authValidation } from '../middleware/validation.js'

const router = Router()

// In-memory user store (use database in production)
const users: Map<string, { email: string; password: string }> = new Map()

// POST /api/auth/register - Register a new user
router.post('/register', validate(authValidation.register), asyncHandler(async (req, res) => {
  const { email, password } = req.body
  
  if (users.has(email.toLowerCase())) {
    return res.status(400).json({ 
      error: 'AUTH_EMAIL_EXISTS', 
      message: 'Email already registered' 
    })
  }
  
  users.set(email.toLowerCase(), { email: email.toLowerCase(), password })
  
  res.status(201).json({ 
    token: `mock-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, 
    user: { email: email.toLowerCase() } 
  })
}))

// POST /api/auth/login - Login user
router.post('/login', validate(authValidation.login), asyncHandler(async (req, res) => {
  const { email, password } = req.body
  
  const user = users.get(email.toLowerCase())
  if (!user || user.password !== password) {
    return res.status(401).json({ 
      error: 'AUTH_INVALID_CREDENTIALS', 
      message: 'Invalid email or password' 
    })
  }
  
  res.json({ 
    token: `mock-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, 
    user: { email: user.email } 
  })
}))

export default router
