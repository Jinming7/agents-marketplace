import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { config } from './lib/config.js'
import { appsRouter } from './routes/apps.js'
import { authRouter } from './routes/auth.js'
import { userRouter } from './routes/user.js'
import { pluginsRouter } from './routes/plugins.js'
import { categoriesRouter } from './routes/categories.js'

const app = express()

// Middleware
app.use(helmet())
app.use(cors({
  origin: config.corsOrigins,
  credentials: true,
}))
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/apps', appsRouter)
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/plugins', pluginsRouter)
app.use('/api/categories', categoriesRouter)

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.message)
  res.status(500).json({ error: 'Internal server error' })
})

// Start server
app.listen(config.port, () => {
  console.log(`🚀 Server running on http://localhost:${config.port}`)
  console.log(`📊 Health: http://localhost:${config.port}/health`)
})

export default app