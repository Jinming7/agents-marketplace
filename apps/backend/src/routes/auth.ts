import { Router } from 'express'
import { asyncHandler } from '../middleware/errorHandler.js'
import { validate, authValidation } from '../middleware/validation.js'
import { authLimiter } from '../middleware/rateLimit.js'

const router = Router()

// In-memory user store (use database in production)
const users: Map<string, { email: string; password: string }> = new Map()

// Token store for refresh tokens
const refreshTokens: Map<string, { email: string; expiresAt: number }> = new Map()

// Helper to generate tokens
function generateToken(): string {
  return `mock-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function generateRefreshToken(): string {
  return `refresh-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// POST /api/auth/register - Register a new user
router.post('/register', authLimiter, validate(authValidation.register), asyncHandler(async (req, res) => {
  const { email, password } = req.body
  
  if (users.has(email.toLowerCase())) {
    return res.status(400).json({ 
      error: 'AUTH_EMAIL_EXISTS', 
      message: 'Email already registered' 
    })
  }
  
  users.set(email.toLowerCase(), { email: email.toLowerCase(), password })
  
  const accessToken = generateToken()
  const refreshToken = generateRefreshToken()
  
  // Store refresh token (7 day expiry)
  refreshTokens.set(refreshToken, { 
    email: email.toLowerCase(), 
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 
  })
  
  res.status(201).json({ 
    token: accessToken, 
    refreshToken: refreshToken,
    expiresIn: 3600,
    user: { email: email.toLowerCase() } 
  })
}))

// POST /api/auth/login - Login user
router.post('/login', authLimiter, validate(authValidation.login), asyncHandler(async (req, res) => {
  const { email, password } = req.body
  
  const user = users.get(email.toLowerCase())
  if (!user || user.password !== password) {
    return res.status(401).json({ 
      error: 'AUTH_INVALID_CREDENTIALS', 
      message: 'Invalid email or password' 
    })
  }
  
  const accessToken = generateToken()
  const refreshToken = generateRefreshToken()
  
  // Store refresh token (7 day expiry)
  refreshTokens.set(refreshToken, { 
    email: email.toLowerCase(), 
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 
  })
  
  res.json({ 
    token: accessToken, 
    refreshToken: refreshToken,
    expiresIn: 3600,
    user: { email: user.email } 
  })
}))

// POST /api/auth/refresh - Refresh access token
router.post('/refresh', authLimiter, asyncHandler(async (req, res) => {
  const { refreshToken } = req.body
  
  if (!refreshToken) {
    return res.status(400).json({ 
      error: 'AUTH_REFRESH_TOKEN_REQUIRED', 
      message: 'Refresh token is required' 
    })
  }
  
  const tokenData = refreshTokens.get(refreshToken)
  if (!tokenData) {
    return res.status(401).json({ 
      error: 'AUTH_REFRESH_TOKEN_INVALID', 
      message: 'Invalid refresh token' 
    })
  }
  
  if (tokenData.expiresAt < Date.now()) {
    refreshTokens.delete(refreshToken)
    return res.status(401).json({ 
      error: 'AUTH_REFRESH_TOKEN_EXPIRED', 
      message: 'Refresh token has expired' 
    })
  }
  
  // Generate new tokens
  const newAccessToken = generateToken()
  const newRefreshToken = generateRefreshToken()
  
  // Store new refresh token (7 day expiry)
  refreshTokens.set(newRefreshToken, { 
    email: tokenData.email, 
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 
  })
  
  // Delete old refresh token
  refreshTokens.delete(refreshToken)
  
  res.json({ 
    token: newAccessToken, 
    refreshToken: newRefreshToken,
    expiresIn: 3600 
  })
}))

// POST /api/auth/logout - Logout user
router.post('/logout', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body
  
  // If refresh token provided, remove it
  if (refreshToken && refreshTokens.has(refreshToken)) {
    refreshTokens.delete(refreshToken)
  }
  
  res.json({ 
    success: true, 
    message: 'Logged out successfully' 
  })
}))

// POST /api/auth/password - Change password
router.post('/password', asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const authHeader = req.headers.authorization
  
  if (!authHeader) {
    return res.status(401).json({ 
      error: 'AUTH_REQUIRED', 
      message: 'Authorization required' 
    })
  }
  
  // In production, decode JWT to get email
  // For mock, extract from token or require email in body
  const { email } = req.body
  
  if (!email) {
    return res.status(400).json({ 
      error: 'AUTH_EMAIL_REQUIRED', 
      message: 'Email is required to change password' 
    })
  }
  
  const user = users.get(email.toLowerCase())
  if (!user) {
    return res.status(404).json({ 
      error: 'AUTH_USER_NOT_FOUND', 
      message: 'User not found' 
    })
  }
  
  if (user.password !== currentPassword) {
    return res.status(401).json({ 
      error: 'AUTH_INVALID_CREDENTIALS', 
      message: 'Current password is incorrect' 
    })
  }
  
  // Update password
  users.set(email.toLowerCase(), { email: email.toLowerCase(), password: newPassword })
  
  // Invalidate all refresh tokens for this user
  for (const [token, data] of refreshTokens.entries()) {
    if (data.email === email.toLowerCase()) {
      refreshTokens.delete(token)
    }
  }
  
  res.json({ 
    success: true, 
    message: 'Password changed successfully' 
  })
}))

export default router
