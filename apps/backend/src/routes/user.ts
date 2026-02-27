import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../lib/config.js'

export const userRouter = Router()

// Auth middleware
const authMiddleware = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const token = authHeader.slice(7)
  try {
    const payload = jwt.verify(token, config.jwtSecret) as { email: string }
    req.user = payload
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

// Mock installations store
const installations: Map<string, Set<string>> = new Map()

// GET /api/user/installations
userRouter.get('/installations', authMiddleware, (req: any, res) => {
  const userApps = installations.get(req.user.email) || new Set()
  res.json({ apps: Array.from(userApps), total: userApps.size })
})

// POST /api/user/installations
userRouter.post('/installations', authMiddleware, (req: any, res) => {
  const { appId } = req.body
  if (!appId) {
    return res.status(400).json({ error: 'appId is required' })
  }

  const userApps = installations.get(req.user.email) || new Set()
  userApps.add(appId)
  installations.set(req.user.email, userApps)

  res.json({ success: true, message: 'App installed successfully' })
})

// DELETE /api/user/installations/:appId
userRouter.delete('/installations/:appId', authMiddleware, (req: any, res) => {
  const { appId } = req.params
  const userApps = installations.get(req.user.email)

  if (!userApps || !userApps.has(appId)) {
    return res.status(404).json({ error: 'App not installed' })
  }

  userApps.delete(appId)
  res.json({ success: true, message: 'App uninstalled successfully' })
})

// GET /api/user/profile
userRouter.get('/profile', authMiddleware, (req: any, res) => {
  res.json({
    email: req.user.email,
    name: req.user.email.split('@')[0],
    notifications: true,
  })
})

// PUT /api/user/profile
userRouter.put('/profile', authMiddleware, (req: any, res) => {
  res.json({ success: true, message: 'Profile updated successfully' })
})