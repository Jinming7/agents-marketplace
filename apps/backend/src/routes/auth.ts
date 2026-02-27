import { Router } from 'express'
import { asyncHandler } from '../middleware/errorHandler.js'
import { validate, authValidation } from '../middleware/validation.js'
import { authLimiter } from '../middleware/rateLimit.js'
import pool from '../config/database.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = Router()

// JWT secret - in production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = '1h'

// Helper to generate tokens
function generateAccessToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

function generateRefreshToken(): string {
  return `refresh-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// POST /api/auth/register - Register a new user
router.post('/register', authLimiter, validate(authValidation.register), asyncHandler(async (req, res) => {
  const { email, password } = req.body
  
  // Check if user exists
  const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()])
  if (existingUser.rows.length > 0) {
    return res.status(400).json({ 
      error: 'AUTH_EMAIL_EXISTS', 
      message: 'Email already registered' 
    })
  }
  
  // Hash password
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  
  // Create user
  const newUser = await pool.query(
    'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
    [email.toLowerCase(), passwordHash]
  )
  
  // Create user profile
  await pool.query(
    'INSERT INTO user_profiles (user_id, name) VALUES ($1, $2)',
    [newUser.rows[0].id, email.split('@')[0]]
  )
  
  // Create user settings with defaults
  await pool.query(
    'INSERT INTO user_settings (user_id) VALUES ($1)',
    [newUser.rows[0].id]
  )
  
  // Generate tokens
  const accessToken = generateAccessToken(newUser.rows[0].id, newUser.rows[0].email)
  const refreshToken = generateRefreshToken()
  
  // Store refresh token (7 day expiry)
  await pool.query(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
    [newUser.rows[0].id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
  )
  
  res.status(201).json({ 
    token: accessToken, 
    refreshToken: refreshToken,
    expiresIn: 3600,
    user: { email: newUser.rows[0].email } 
  })
}))

// POST /api/auth/login - Login user
router.post('/login', authLimiter, validate(authValidation.login), asyncHandler(async (req, res) => {
  const { email, password } = req.body
  
  // Find user
  const userResult = await pool.query(
    'SELECT id, email, password_hash FROM users WHERE email = $1',
    [email.toLowerCase()]
  )
  
  if (userResult.rows.length === 0) {
    return res.status(401).json({ 
      error: 'AUTH_INVALID_CREDENTIALS', 
      message: 'Invalid email or password' 
    })
  }
  
  const user = userResult.rows[0]
  
  // Verify password
  const validPassword = await bcrypt.compare(password, user.password_hash)
  if (!validPassword) {
    return res.status(401).json({ 
      error: 'AUTH_INVALID_CREDENTIALS', 
      message: 'Invalid email or password' 
    })
  }
  
  // Generate tokens
  const accessToken = generateAccessToken(user.id, user.email)
  const refreshToken = generateRefreshToken()
  
  // Store refresh token (7 day expiry)
  await pool.query(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
    [user.id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
  )
  
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
  
  // Find refresh token
  const tokenResult = await pool.query(
    'SELECT user_id, expires_at FROM refresh_tokens WHERE token = $1',
    [refreshToken]
  )
  
  if (tokenResult.rows.length === 0) {
    return res.status(401).json({ 
      error: 'AUTH_REFRESH_TOKEN_INVALID', 
      message: 'Invalid refresh token' 
    })
  }
  
  const tokenData = tokenResult.rows[0]
  
  if (new Date(tokenData.expires_at).getTime() < Date.now()) {
    // Delete expired token
    await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken])
    return res.status(401).json({ 
      error: 'AUTH_REFRESH_TOKEN_EXPIRED', 
      message: 'Refresh token has expired' 
    })
  }
  
  // Get user info
  const userResult = await pool.query('SELECT id, email FROM users WHERE id = $1', [tokenData.user_id])
  if (userResult.rows.length === 0) {
    return res.status(401).json({ 
      error: 'AUTH_USER_NOT_FOUND', 
      message: 'User not found' 
    })
  }
  
  const user = userResult.rows[0]
  
  // Generate new tokens
  const newAccessToken = generateAccessToken(user.id, user.email)
  const newRefreshToken = generateRefreshToken()
  
  // Store new refresh token (7 day expiry)
  await pool.query(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
    [user.id, newRefreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
  )
  
  // Delete old refresh token
  await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken])
  
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
  if (refreshToken) {
    await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken])
  }
  
  res.json({ 
    success: true, 
    message: 'Logged out successfully' 
  })
}))

// POST /api/auth/password - Change password
router.post('/password', asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, email } = req.body
  const authHeader = req.headers.authorization
  
  if (!authHeader) {
    return res.status(401).json({ 
      error: 'AUTH_REQUIRED', 
      message: 'Authorization required' 
    })
  }
  
  if (!email) {
    return res.status(400).json({ 
      error: 'AUTH_EMAIL_REQUIRED', 
      message: 'Email is required to change password' 
    })
  }
  
  // Find user
  const userResult = await pool.query(
    'SELECT id, password_hash FROM users WHERE email = $1',
    [email.toLowerCase()]
  )
  
  if (userResult.rows.length === 0) {
    return res.status(404).json({ 
      error: 'AUTH_USER_NOT_FOUND', 
      message: 'User not found' 
    })
  }
  
  const user = userResult.rows[0]
  
  // Verify current password
  const validPassword = await bcrypt.compare(currentPassword, user.password_hash)
  if (!validPassword) {
    return res.status(401).json({ 
      error: 'AUTH_INVALID_CREDENTIALS', 
      message: 'Current password is incorrect' 
    })
  }
  
  // Hash new password
  const saltRounds = 10
  const newPasswordHash = await bcrypt.hash(newPassword, saltRounds)
  
  // Update password
  await pool.query(
    'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
    [newPasswordHash, user.id]
  )
  
  // Invalidate all refresh tokens for this user
  await pool.query('DELETE FROM refresh_tokens WHERE user_id = $1', [user.id])
  
  res.json({ 
    success: true, 
    message: 'Password changed successfully' 
  })
}))

export default router
