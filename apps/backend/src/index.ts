import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Apps API
const apps = [
  { id: '1', name: 'Slack', description: 'Team communication', category: 'Collaboration' },
  { id: '2', name: 'Jira', description: 'Project tracking', category: 'Productivity' },
  { id: '3', name: 'Confluence', description: 'Documentation', category: 'Knowledge' }
]

app.get('/api/apps', (req, res) => {
  res.json({ apps, total: apps.length })
})

app.get('/api/apps/:id', (req, res) => {
  const app = apps.find(a => a.id === req.params.id)
  if (app) {
    res.json(app)
  } else {
    res.status(404).json({ error: 'App not found' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
