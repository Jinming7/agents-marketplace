import express from 'express'
import cors from 'cors'
import { errorHandler } from './middleware/errorHandler.js'
import appsRouter from './routes/apps.js'
import authRouter from './routes/auth.js'
import userRouter from './routes/user.js'
import categoriesRouter from './routes/categories.js'

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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/apps', appsRouter)
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/categories', categoriesRouter)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'NOT_FOUND', 
    message: `Route ${req.method} ${req.path} not found` 
  })
})

// Global error handler
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
