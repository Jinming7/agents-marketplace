import express from 'express'
import cors from 'cors'
import { errorHandler } from './middleware/errorHandler.js'
import { apiLimiter } from './middleware/rateLimit.js'
import appsRouter from './routes/apps.js'
import authRouter from './routes/auth.js'
import userRouter from './routes/user.js'
import categoriesRouter from './routes/categories.js'
import { testConnection } from './config/database.js'

const app = express()
const PORT = process.env.PORT || 3003

// Middleware
app.use(cors())
app.use(express.json())

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// Health check (no rate limit)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'operational',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      '/api/apps': 'GET (list), GET /:id (details), GET /:id/reviews (reviews)',
      '/api/auth': 'POST /register, POST /login, POST /refresh, POST /logout, POST /password',
      '/api/user': 'GET /profile, PUT /profile, GET /settings, PUT /settings, GET /installations, POST /installations, DELETE /installations/:appId',
      '/api/categories': 'GET (list)'
    }
  })
})

// API Routes with rate limiting
app.use('/api/apps', apiLimiter, appsRouter)
app.use('/api/auth', authRouter) // Has its own stricter limiter
app.use('/api/user', apiLimiter, userRouter)
app.use('/api/categories', apiLimiter, categoriesRouter)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'NOT_FOUND', 
    message: `Route ${req.method} ${req.path} not found` 
  })
})

// Global error handler
app.use(errorHandler)

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`)
  
  // Test Supabase database connection on startup
  const dbConnected = await testConnection()
  if (!dbConnected) {
    console.warn('[WARNING] Database connection failed - check .env file')
  }
})

export default app
