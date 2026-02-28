import { Router } from 'express'

export const pluginsRouter = Router()

// Categories
const categories = [
  { id: '1', name: 'Project Management', icon: '📊', count: 24 },
  { id: '2', name: 'Automation', icon: '⚡', count: 18 },
  { id: '3', name: 'Development Tools', icon: '🔧', count: 32 },
  { id: '4', name: 'Collaboration', icon: '👥', count: 15 },
  { id: '5', name: 'Reports & Analytics', icon: '📈', count: 21 },
  { id: '6', name: 'Security', icon: '🔒', count: 12 },
  { id: '7', name: 'Time Tracking', icon: '⏱️', count: 9 },
  { id: '8', name: 'Documentation', icon: '📄', count: 14 },
]

// Mock apps data
const mockApps = [
  {
    id: '1',
    name: 'Project Management Plus',
    description: 'Add Gantt charts, Kanban boards to your ONES projects',
    shortDescription: 'Advanced project management with Gantt charts and Kanban',
    icon: '📊',
    category: 'Project Management',
    developer: 'ONES Official',
    version: '3.2.1',
    rating: 4.8,
    reviews: 1247,
    downloads: 12500,
    screenshots: ['Dashboard', 'Gantt View', 'Kanban Board', 'Reports'],
    pricing: { type: 'freemium', price: 29 },
    features: ['Gantt Charts', 'Kanban Boards', 'Timeline Views', 'Team Collaboration'],
    verified: true,
    featured: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-02-15'
  },
  {
    id: '2',
    name: 'Workflow Automator',
    description: 'Create custom automation rules for your workflows',
    shortDescription: 'Powerful workflow automation builder',
    icon: '⚡',
    category: 'Automation',
    developer: 'Agile Tools',
    version: '2.8.0',
    rating: 4.6,
    reviews: 892,
    downloads: 8900,
    screenshots: ['Builder', 'Triggers', 'Actions', 'Templates'],
    pricing: { type: 'freemium', price: 19 },
    features: ['Visual Builder', '100+ Templates', 'Scheduled Triggers', 'Analytics'],
    verified: true,
    featured: true,
    createdAt: '2024-01-20',
    updatedAt: '2024-02-20'
  },
  {
    id: '3',
    name: 'Git Integration',
    description: 'Connect GitHub, GitLab, and Bitbucket to your workspace',
    shortDescription: 'Seamless Git repository integration',
    icon: '🔗',
    category: 'Development Tools',
    developer: 'DevConnect',
    version: '4.1.2',
    rating: 4.9,
    reviews: 567,
    downloads: 6700,
    screenshots: ['Repositories', 'Commits', 'PR Tracking', 'Branches'],
    pricing: { type: 'free' },
    features: ['Multi-Platform', 'PR Tracking', 'Commit Linking', 'Secure Auth'],
    verified: true,
    featured: false,
    createdAt: '2024-01-10',
    updatedAt: '2024-02-18'
  },
  {
    id: '4',
    name: 'Team Collaboration',
    description: 'Real-time collaboration with live editing and chat',
    shortDescription: 'Real-time team collaboration tools',
    icon: '👥',
    category: 'Collaboration',
    developer: 'CollabTech',
    version: '5.0.0',
    rating: 4.7,
    reviews: 1089,
    downloads: 15200,
    screenshots: ['Workspace', 'Live Edit', 'Chat', 'Files'],
    pricing: { type: 'freemium', price: 15 },
    features: ['Live Editing', 'Team Chat', 'File Sharing', 'Video Calls'],
    verified: false,
    featured: false,
    createdAt: '2024-01-25',
    updatedAt: '2024-02-22'
  },
  {
    id: '5',
    name: 'Data Reports',
    description: 'Visual reports and interactive dashboards',
    shortDescription: 'Advanced reporting and analytics',
    icon: '📈',
    category: 'Reports & Analytics',
    developer: 'DataViz Solutions',
    version: '2.5.3',
    rating: 4.5,
    reviews: 734,
    downloads: 9800,
    screenshots: ['Dashboard', 'Charts', 'Exports', 'Schedules'],
    pricing: { type: 'paid', price: 49 },
    features: ['Visual Dashboards', '30+ Charts', 'Export Options', 'Scheduled Reports'],
    verified: true,
    featured: true,
    createdAt: '2024-01-08',
    updatedAt: '2024-02-10'
  },
  {
    id: '6',
    name: 'Security Audit',
    description: 'Operation logs and security alerts',
    shortDescription: 'Comprehensive security audit logging',
    icon: '🔒',
    category: 'Security',
    developer: 'SecureOps',
    version: '1.9.0',
    rating: 4.8,
    reviews: 312,
    downloads: 4500,
    screenshots: ['Audit Log', 'Alerts', 'Compliance', 'Activity'],
    pricing: { type: 'paid', price: 99 },
    features: ['Audit Logging', 'Real-time Alerts', 'Compliance Reports', 'Anomaly Detection'],
    verified: true,
    featured: false,
    createdAt: '2024-01-30',
    updatedAt: '2024-02-25'
  },
  {
    id: '7',
    name: 'Time Tracker Pro',
    description: 'Track time spent on tasks and projects',
    shortDescription: 'Professional time tracking solution',
    icon: '⏱️',
    category: 'Time Tracking',
    developer: 'Productivity Labs',
    version: '2.1.0',
    rating: 4.4,
    reviews: 456,
    downloads: 6200,
    screenshots: ['Timer', 'Reports', 'Projects', 'Team'],
    pricing: { type: 'freemium', price: 9 },
    features: ['Automatic Tracking', 'Detailed Reports', 'Team Overview', 'Integrations'],
    verified: true,
    featured: false,
    createdAt: '2024-02-01',
    updatedAt: '2024-02-20'
  },
  {
    id: '8',
    name: 'Document Editor',
    description: 'Rich text editing with collaboration features',
    shortDescription: 'Collaborative document editing',
    icon: '📄',
    category: 'Documentation',
    developer: 'DocuTeam',
    version: '3.0.1',
    rating: 4.6,
    reviews: 678,
    downloads: 8900,
    screenshots: ['Editor', 'Templates', 'Export', 'Share'],
    pricing: { type: 'free' },
    features: ['Rich Editor', 'Templates', 'Version History', 'Real-time Collab'],
    verified: true,
    featured: false,
    createdAt: '2024-01-18',
    updatedAt: '2024-02-15'
  },
  {
    id: '9',
    name: 'API Testing Suite',
    description: 'Test and debug APIs directly in your workspace',
    shortDescription: 'Comprehensive API testing tools',
    icon: '🧪',
    category: 'Development Tools',
    developer: 'DevTools Inc',
    version: '1.5.0',
    rating: 4.7,
    reviews: 234,
    downloads: 3400,
    screenshots: ['Requests', 'Collections', 'Tests', 'Docs'],
    pricing: { type: 'freemium', price: 25 },
    features: ['Request Builder', 'Collections', 'Auto Tests', 'API Docs'],
    verified: true,
    featured: false,
    createdAt: '2024-02-05',
    updatedAt: '2024-02-28'
  },
  {
    id: '10',
    name: 'Knowledge Base',
    description: 'Create and organize your team knowledge',
    shortDescription: 'Team knowledge management',
    icon: '📚',
    category: 'Documentation',
    developer: 'WikiWorks',
    version: '2.3.0',
    rating: 4.5,
    reviews: 567,
    downloads: 7800,
    screenshots: ['Wiki', 'Search', 'Categories', 'Templates'],
    pricing: { type: 'freemium', price: 19 },
    features: ['Wiki Pages', 'Full-text Search', 'Categories', 'Templates'],
    verified: false,
    featured: false,
    createdAt: '2024-01-22',
    updatedAt: '2024-02-18'
  },
]

// Mock reviews
const mockReviews: Record<string, any[]> = {
  '1': [
    { id: 1, author: 'Sarah Chen', avatar: '👩‍💼', rating: 5, date: '2 days ago', content: 'This app has transformed how our team manages projects. Highly recommended!', helpful: 24 },
    { id: 2, author: 'Michael Park', avatar: '👨‍💻', rating: 5, date: '1 week ago', content: 'Excellent integration with our existing tools. Setup was a breeze.', helpful: 18 },
    { id: 3, author: 'Emily Rodriguez', avatar: '👩‍🔬', rating: 4, date: '2 weeks ago', content: 'Great features overall. Would love to see more customization options.', helpful: 12 },
  ],
  '2': [
    { id: 1, author: 'David Kim', avatar: '👨‍🎨', rating: 5, date: '3 days ago', content: 'Automation saves us so much time. Customer support is top-notch!', helpful: 31 },
    { id: 2, author: 'Lisa Wang', avatar: '👩‍💻', rating: 4, date: '1 week ago', content: 'Very solid app with great features. Looking forward to future updates.', helpful: 9 },
  ],
}

// GET /api/categories
pluginsRouter.get('/categories', (req, res) => {
  res.json(categories)
})

// GET /api/plugins (root)
pluginsRouter.get('/', (req, res) => {
  let apps = [...mockApps]
  
  const { category, search, sort } = req.query
  
  if (category && category !== 'All') {
    apps = apps.filter(app => app.category === category)
  }
  
  if (search) {
    const query = (search as string).toLowerCase()
    apps = apps.filter(app => 
      app.name.toLowerCase().includes(query) ||
      app.description.toLowerCase().includes(query)
    )
  }
  
  if (sort === 'rating') {
    apps.sort((a, b) => b.rating - a.rating)
  } else if (sort === 'downloads') {
    apps.sort((a, b) => b.downloads - a.downloads)
  } else if (sort === 'newest') {
    apps.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  } else {
    // Default: featured first, then by downloads
    apps.sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return b.downloads - a.downloads
    })
  }
  
  res.json(apps)
})

// GET /api/plugins/:id
pluginsRouter.get('/:id', (req, res) => {
  const app = mockApps.find(a => a.id === req.params.id)
  if (!app) {
    return res.status(404).json({ error: 'App not found' })
  }
  res.json(app)
})

// GET /api/plugins/:id/reviews
pluginsRouter.get('/:id/reviews', (req, res) => {
  const reviews = mockReviews[req.params.id] || []
  res.json(reviews)
})

export default pluginsRouter