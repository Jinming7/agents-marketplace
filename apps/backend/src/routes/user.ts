import { Router, Request, Response, NextFunction } from 'express'
import { asyncHandler } from '../middleware/errorHandler.js'
import { validate, userValidation } from '../middleware/validation.js'

const router = Router()

// Mock user installations database
const userInstallations: Map<string, string[]> = new Map([
  ['user@example.com', ['1', '3']]
])

// Mock user profiles database
const userProfiles: Map<string, { name: string; avatar?: string; bio?: string; notifications: boolean }> = new Map()

// Mock user settings database
const userSettings: Map<string, { 
  emailNotifications: boolean; 
  pushNotifications: boolean; 
  weeklyDigest: boolean; 
  language: string;
  timezone: string;
}> = new Map()

// Helper to get user email from auth header (mock)
function getUserEmail(authHeader?: string): string {
  // In production, decode JWT token
  // For mock: extract email from Bearer token if it's a mock token
  if (authHeader && authHeader.startsWith('Bearer mock-token-')) {
    // Extract email from token or use default
    return 'user@example.com'
  }
  return 'user@example.com'
}

// Middleware to require auth
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'AUTH_REQUIRED', message: 'Authorization required' })
  }
  next()
}

// GET /api/user/installations - Get user installed apps
router.get('/installations', requireAuth, asyncHandler(async (req, res) => {
  const email = getUserEmail(req.headers.authorization)
  const installedAppIds = userInstallations.get(email) || []
  
  // Mock app data (in production, fetch from apps table)
  const apps = [
    { id: '1', name: 'Slack', description: 'Team communication platform', category: 'Collaboration', installs: 10000, rating: 4.5 },
    { id: '2', name: 'Jira', description: 'Project tracking tool', category: 'Productivity', installs: 8000, rating: 4.3 },
    { id: '3', name: 'Confluence', description: 'Documentation platform', category: 'Knowledge', installs: 6000, rating: 4.2 },
    { id: '4', name: 'GitHub', description: 'Code collaboration', category: 'Development', installs: 15000, rating: 4.8 },
    { id: '5', name: 'Figma', description: 'Design tool', category: 'Design', installs: 5000, rating: 4.6 }
  ]
  
  const installedApps = apps.filter(app => installedAppIds.includes(app.id))
  res.json({ apps: installedApps, total: installedApps.length })
}))

// POST /api/user/installations - Install an app
router.post('/installations', requireAuth, validate(userValidation.install), asyncHandler(async (req, res) => {
  const { appId } = req.body
  const email = getUserEmail(req.headers.authorization)
  
  // Mock app data
  const apps = [
    { id: '1', name: 'Slack', description: 'Team communication platform', category: 'Collaboration', installs: 10000, rating: 4.5 },
    { id: '2', name: 'Jira', description: 'Project tracking tool', category: 'Productivity', installs: 8000, rating: 4.3 },
    { id: '3', name: 'Confluence', description: 'Documentation platform', category: 'Knowledge', installs: 6000, rating: 4.2 },
    { id: '4', name: 'GitHub', description: 'Code collaboration', category: 'Development', installs: 15000, rating: 4.8 },
    { id: '5', name: 'Figma', description: 'Design tool', category: 'Design', installs: 5000, rating: 4.6 }
  ]
  
  const app = apps.find(a => a.id === appId)
  if (!app) {
    return res.status(404).json({ error: 'APP_NOT_FOUND', message: 'App not found' })
  }
  
  if (!userInstallations.has(email)) {
    userInstallations.set(email, [])
  }
  
  const userApps = userInstallations.get(email)!
  if (userApps.includes(appId)) {
    return res.status(400).json({ error: 'APP_ALREADY_INSTALLED', message: 'App is already installed' })
  }
  
  userApps.push(appId)
  
  res.status(201).json({ success: true, message: 'App installed successfully' })
}))

// GET /api/user/installations/:appId - Check if app is installed
router.get('/installations/:appId', requireAuth, asyncHandler(async (req, res) => {
  const email = getUserEmail(req.headers.authorization)
  const installedAppIds = userInstallations.get(email) || []
  const isInstalled = installedAppIds.includes(req.params.appId)
  
  res.json({ 
    appId: req.params.appId,
    isInstalled 
  })
}))

// DELETE /api/user/installations/:appId - Uninstall an app
router.delete('/installations/:appId', requireAuth, validate(userValidation.uninstall), asyncHandler(async (req, res) => {
  const email = getUserEmail(req.headers.authorization)
  
  if (userInstallations.has(email)) {
    const userApps = userInstallations.get(email)!
    const index = userApps.indexOf(req.params.appId)
    if (index > -1) {
      userApps.splice(index, 1)
    }
  }
  
  res.json({ success: true, message: 'App uninstalled successfully' })
}))

// GET /api/user/profile - Get user profile
router.get('/profile', requireAuth, asyncHandler(async (req, res) => {
  const email = getUserEmail(req.headers.authorization)
  const profile = userProfiles.get(email) || { name: 'User', notifications: true }
  res.json({ ...profile, email })
}))

// PUT /api/user/profile - Update user profile
router.put('/profile', requireAuth, validate(userValidation.updateProfile), asyncHandler(async (req, res) => {
  const email = getUserEmail(req.headers.authorization)
  const { name, bio, notifications } = req.body
  
  userProfiles.set(email, {
    name: name || 'User',
    bio: bio || '',
    notifications: notifications !== undefined ? notifications : true
  })
  
  res.json({ success: true, message: 'Profile updated successfully' })
}))

// GET /api/user/settings - Get user settings
router.get('/settings', requireAuth, asyncHandler(async (req, res) => {
  const email = getUserEmail(req.headers.authorization)
  const settings = userSettings.get(email) || { 
    emailNotifications: true, 
    pushNotifications: true, 
    weeklyDigest: false, 
    language: 'en',
    timezone: 'UTC'
  }
  res.json(settings)
}))

// PUT /api/user/settings - Update user settings
router.put('/settings', requireAuth, asyncHandler(async (req, res) => {
  const email = getUserEmail(req.headers.authorization)
  const { emailNotifications, pushNotifications, weeklyDigest, language, timezone } = req.body
  
  userSettings.set(email, {
    emailNotifications: emailNotifications !== undefined ? emailNotifications : true,
    pushNotifications: pushNotifications !== undefined ? pushNotifications : true,
    weeklyDigest: weeklyDigest !== undefined ? weeklyDigest : false,
    language: language || 'en',
    timezone: timezone || 'UTC'
  })
  
  res.json({ success: true, message: 'Settings updated successfully' })
}))

export default router
