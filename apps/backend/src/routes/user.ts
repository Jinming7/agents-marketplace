import { Router } from 'express'

export const userRouter = Router()

// Mock data
const installations: any[] = []
const wishlist: any[] = []

// GET /api/user/profile
userRouter.get('/profile', (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  res.json({ id: '1', name: 'Demo User', email: 'demo@example.com', avatar: null })
})

// GET /api/user/installations
userRouter.get('/installations', (req, res) => {
  res.json(installations)
})

// POST /api/user/installations
userRouter.post('/installations', (req, res) => {
  const { appId } = req.body
  const existing = installations.find(i => i.appId === appId)
  if (!existing) {
    installations.push({ appId, installedAt: new Date().toISOString() })
  }
  res.json({ success: true })
})

// DELETE /api/user/installations/:appId
userRouter.delete('/installations/:appId', (req, res) => {
  const index = installations.findIndex(i => i.appId === req.params.appId)
  if (index > -1) installations.splice(index, 1)
  res.json({ success: true })
})

// GET /api/user/wishlist
userRouter.get('/wishlist', (req, res) => {
  res.json(wishlist)
})

// POST /api/user/wishlist
userRouter.post('/wishlist', (req, res) => {
  const { appId } = req.body
  if (!wishlist.includes(appId)) wishlist.push(appId)
  res.json({ success: true })
})

// DELETE /api/user/wishlist/:appId
userRouter.delete('/wishlist/:appId', (req, res) => {
  const index = wishlist.indexOf(req.params.appId)
  if (index > -1) wishlist.splice(index, 1)
  res.json({ success: true })
})

export default userRouter