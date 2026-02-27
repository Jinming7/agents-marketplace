import { Router, Request, Response, NextFunction } from 'express'
import { asyncHandler } from '../middleware/errorHandler.js'
import { validate, userValidation } from '../middleware/validation.js'
import pool from '../config/database.js'
import jwt from 'jsonwebtoken'

const router = Router()

// JWT secret - should match auth.ts
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Helper to get user ID from auth header
function getUserId(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  try {
    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded.userId
  } catch (error) {
    return null
  }
}

// Middleware to require auth
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  const userId = getUserId(authHeader)
  
  if (!userId) {
    return res.status(401).json({ error: 'AUTH_REQUIRED', message: 'Authorization required' })
  }
  
  // Attach userId to request for later use
  (req as any).userId = userId
  next()
}

// GET /api/user/installations - Get user installed apps
router.get('/installations', requireAuth, asyncHandler(async (req, res) => {
  const userId = (req as any).userId
  
  try {
    const result = await pool.query(
      `SELECT a.* FROM apps a
       INNER JOIN user_installations ui ON a.id = ui.app_id
       WHERE ui.user_id = $1
       ORDER BY ui.installed_at DESC`,
      [userId]
    )
    
    res.json({ apps: result.rows, total: result.rows.length })
  } catch (error) {
    console.error('[user] Error fetching installations:', error)
    res.json({ apps: [], total: 0 })
  }
}))

// POST /api/user/installations - Install an app
router.post('/installations', requireAuth, validate(userValidation.install), asyncHandler(async (req, res) => {
  const userId = (req as any).userId
  const { appId } = req.body
  
  // Check if app exists
  const appResult = await pool.query('SELECT id FROM apps WHERE id = $1', [appId])
  if (appResult.rows.length === 0) {
    return res.status(404).json({ error: 'APP_NOT_FOUND', message: 'App not found' })
  }
  
  // Check if already installed
  const existingInstall = await pool.query(
    'SELECT id FROM user_installations WHERE user_id = $1 AND app_id = $2',
    [userId, appId]
  )
  
  if (existingInstall.rows.length > 0) {
    return res.status(400).json({ error: 'APP_ALREADY_INSTALLED', message: 'App is already installed' })
  }
  
  // Create installation
  await pool.query(
    'INSERT INTO user_installations (user_id, app_id) VALUES ($1, $2)',
    [userId, appId]
  )
  
  // Update app install count
  await pool.query(
    'UPDATE apps SET installs = installs + 1 WHERE id = $1',
    [appId]
  )
  
  res.status(201).json({ success: true, message: 'App installed successfully' })
}))

// GET /api/user/installations/:appId - Check if app is installed
router.get('/installations/:appId', requireAuth, asyncHandler(async (req, res) => {
  const userId = (req as any).userId
  const appId = req.params.appId
  
  const result = await pool.query(
    'SELECT id FROM user_installations WHERE user_id = $1 AND app_id = $2',
    [userId, appId]
  )
  
  res.json({ 
    appId,
    isInstalled: result.rows.length > 0
  })
}))

// DELETE /api/user/installations/:appId - Uninstall an app
router.delete('/installations/:appId', requireAuth, validate(userValidation.uninstall), asyncHandler(async (req, res) => {
  const userId = (req as any).userId
  const appId = req.params.appId
  
  await pool.query(
    'DELETE FROM user_installations WHERE user_id = $1 AND app_id = $2',
    [userId, appId]
  )
  
  // Update app install count
  await pool.query(
    'UPDATE apps SET installs = GREATEST(installs - 1, 0) WHERE id = $1',
    [appId]
  )
  
  res.json({ success: true, message: 'App uninstalled successfully' })
}))

// GET /api/user/profile - Get user profile
router.get('/profile', requireAuth, asyncHandler(async (req, res) => {
  const userId = (req as any).userId
  
  const result = await pool.query(
    'SELECT up.*, u.email FROM user_profiles up INNER JOIN users u ON up.user_id = u.id WHERE up.user_id = $1',
    [userId]
  )
  
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'PROFILE_NOT_FOUND', message: 'Profile not found' })
  }
  
  const profile = result.rows[0]
  res.json({
    id: profile.id,
    email: profile.email,
    name: profile.name,
    avatar: profile.avatar,
    bio: profile.bio,
    notifications: profile.notifications
  })
}))

// PUT /api/user/profile - Update user profile
router.put('/profile', requireAuth, validate(userValidation.updateProfile), asyncHandler(async (req, res) => {
  const userId = (req as any).userId
  const { name, bio, notifications } = req.body
  
  await pool.query(
    `INSERT INTO user_profiles (user_id, name, bio, notifications)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id) DO UPDATE SET
       name = COALESCE($2, user_profiles.name),
       bio = COALESCE($3, user_profiles.bio),
       notifications = COALESCE($4, user_profiles.notifications),
       updated_at = NOW()`,
    [userId, name, bio, notifications]
  )
  
  res.json({ success: true, message: 'Profile updated successfully' })
}))

// GET /api/user/settings - Get user settings
router.get('/settings', requireAuth, asyncHandler(async (req, res) => {
  const userId = (req as any).userId
  
  const result = await pool.query(
    'SELECT * FROM user_settings WHERE user_id = $1',
    [userId]
  )
  
  if (result.rows.length === 0) {
    // Return defaults if no settings exist
    return res.json({
      emailNotifications: true,
      pushNotifications: true,
      weeklyDigest: false,
      language: 'en',
      timezone: 'UTC'
    })
  }
  
  const settings = result.rows[0]
  res.json({
    emailNotifications: settings.email_notifications,
    pushNotifications: settings.push_notifications,
    weeklyDigest: settings.weekly_digest,
    language: settings.language,
    timezone: settings.timezone
  })
}))

// PUT /api/user/settings - Update user settings
router.put('/settings', requireAuth, asyncHandler(async (req, res) => {
  const userId = (req as any).userId
  const { emailNotifications, pushNotifications, weeklyDigest, language, timezone } = req.body
  
  await pool.query(
    `INSERT INTO user_settings (user_id, email_notifications, push_notifications, weekly_digest, language, timezone)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (user_id) DO UPDATE SET
       email_notifications = COALESCE($2, user_settings.email_notifications),
       push_notifications = COALESCE($3, user_settings.push_notifications),
       weekly_digest = COALESCE($4, user_settings.weekly_digest),
       language = COALESCE($5, user_settings.language),
       timezone = COALESCE($6, user_settings.timezone),
       updated_at = NOW()`,
    [userId, emailNotifications, pushNotifications, weeklyDigest, language, timezone]
  )
  
  res.json({ success: true, message: 'Settings updated successfully' })
}))

export default router
