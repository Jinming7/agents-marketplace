import { Router } from 'express'

export const pluginsRouter = Router()

// Mock data for plugins
const mockPlugins = [
  {
    id: '1',
    name: 'Jira Integration Plus',
    description: '深度集成 Jira，支持敏捷看板、冲刺规划和实时同步。提供双向同步、自定义字段映射、自动化工作流等功能。',
    categoryName: '项目管理',
    icon: '🎯',
    version: '2.1.0',
    developer: 'ONES Team',
    installs: 15420,
    rating: '4.80',
    pricing: 'free',
    highlights: ['双向同步', '敏捷看板', '自动化工作流', '自定义字段'],
    compatibility: ['ONES Project', 'ONES Wiki'],
    lastUpdated: '2024-01-15',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    name: 'Code Review Assistant',
    description: 'AI 驱动的代码审查工具，自动检测代码问题和安全漏洞。支持多种编程语言，提供智能建议。',
    categoryName: '开发工具',
    icon: '🔍',
    version: '1.5.2',
    developer: 'DevTools Inc',
    installs: 8930,
    rating: '4.60',
    pricing: 'freemium',
    highlights: ['AI 代码分析', '安全漏洞检测', '多语言支持', 'PR 自动审查'],
    compatibility: ['ONES Project', 'ONES Wiki'],
    lastUpdated: '2024-01-10',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '3',
    name: 'Wiki Sync',
    description: '与 Confluence 无缝同步，支持双向编辑和版本控制。保持文档一致性，提升团队协作效率。',
    categoryName: '文档协作',
    icon: '📚',
    version: '3.0.1',
    developer: 'DocFlow',
    installs: 12500,
    rating: '4.70',
    pricing: 'paid',
    highlights: ['双向同步', '版本控制', '冲突解决', '批量导入'],
    compatibility: ['ONES Wiki'],
    lastUpdated: '2024-01-12',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
  },
  {
    id: '4',
    name: 'Design System Manager',
    description: '统一管理设计系统，自动生成组件文档和样式指南。支持 Figma、Sketch 导入。',
    categoryName: '设计工具',
    icon: '🎨',
    version: '1.2.0',
    developer: 'DesignOps',
    installs: 6780,
    rating: '4.50',
    pricing: 'freemium',
    highlights: ['设计系统管理', '组件文档生成', 'Figma 集成', '版本追踪'],
    compatibility: ['ONES Wiki', 'ONES Project'],
    lastUpdated: '2024-01-08',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z',
  },
  {
    id: '5',
    name: 'Workflow Automator',
    description: '可视化工作流编排，支持 100+ 应用集成。无需代码即可创建复杂自动化流程。',
    categoryName: '自动化',
    icon: '⚡',
    version: '4.1.0',
    developer: 'AutoFlow',
    installs: 21300,
    rating: '4.90',
    pricing: 'freemium',
    highlights: ['可视化编辑器', '100+ 集成', '条件分支', '定时触发'],
    compatibility: ['ONES Project', 'ONES Wiki', 'ONES Performance'],
    lastUpdated: '2024-01-14',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-14T00:00:00Z',
  },
  {
    id: '6',
    name: 'Security Scanner Pro',
    description: '实时安全扫描，支持 OWASP Top 10 和自定义规则。保护您的代码和基础设施安全。',
    categoryName: '安全合规',
    icon: '🔒',
    version: '2.3.0',
    developer: 'SecureCode',
    installs: 9870,
    rating: '4.70',
    pricing: 'paid',
    highlights: ['OWASP Top 10', '自定义规则', '实时扫描', '合规报告'],
    compatibility: ['ONES Project', 'ONES Wiki'],
    lastUpdated: '2024-01-11',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-11T00:00:00Z',
  },
  {
    id: '7',
    name: 'Sprint Planner',
    description: '智能冲刺规划，基于历史数据预测工作量。帮助团队更准确地规划迭代。',
    categoryName: '项目管理',
    icon: '📊',
    version: '1.8.0',
    developer: 'AgileTools',
    installs: 7650,
    rating: '4.40',
    pricing: 'free',
    highlights: ['智能预测', '历史分析', '容量规划', '燃尽图'],
    compatibility: ['ONES Project'],
    lastUpdated: '2024-01-09',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-09T00:00:00Z',
  },
  {
    id: '8',
    name: 'Git Analytics',
    description: '代码仓库分析，可视化团队贡献和代码质量趋势。深入了解团队开发效率。',
    categoryName: '开发工具',
    icon: '📈',
    version: '2.0.0',
    developer: 'CodeMetrics',
    installs: 11200,
    rating: '4.60',
    pricing: 'freemium',
    highlights: ['贡献分析', '代码质量趋势', '团队报告', 'PR 统计'],
    compatibility: ['ONES Project'],
    lastUpdated: '2024-01-13',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-13T00:00:00Z',
  },
  {
    id: '9',
    name: 'Template Hub',
    description: '项目模板库，快速启动新项目。支持自定义模板和团队共享。',
    categoryName: '文档协作',
    icon: '📝',
    version: '1.4.0',
    developer: 'TemplateCo',
    installs: 5430,
    rating: '4.30',
    pricing: 'free',
    highlights: ['预置模板', '自定义模板', '团队共享', '版本管理'],
    compatibility: ['ONES Project', 'ONES Wiki'],
    lastUpdated: '2024-01-07',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-07T00:00:00Z',
  },
  {
    id: '10',
    name: 'API Designer',
    description: '可视化 API 设计工具，自动生成 OpenAPI 文档。简化 API 开发流程。',
    categoryName: '开发工具',
    icon: '🔌',
    version: '3.2.0',
    developer: 'APITools',
    installs: 18900,
    rating: '4.80',
    pricing: 'freemium',
    highlights: ['可视化设计', 'OpenAPI 生成', 'Mock 服务', '文档导出'],
    compatibility: ['ONES Project', 'ONES Wiki'],
    lastUpdated: '2024-01-16',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-16T00:00:00Z',
  },
  {
    id: '11',
    name: 'Time Tracker',
    description: '时间追踪工具，自动记录工作时长。生成详细的时间报告和效率分析。',
    categoryName: '项目管理',
    icon: '⏱️',
    version: '2.0.0',
    developer: 'TimeFlow',
    installs: 8900,
    rating: '4.50',
    pricing: 'freemium',
    highlights: ['自动追踪', '时间报告', '效率分析', '日历集成'],
    compatibility: ['ONES Project'],
    lastUpdated: '2024-01-06',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-06T00:00:00Z',
  },
  {
    id: '12',
    name: 'Knowledge Graph',
    description: '知识图谱可视化，自动构建文档关联网络。发现知识之间的隐藏联系。',
    categoryName: '文档协作',
    icon: '🕸️',
    version: '1.0.0',
    developer: 'GraphLabs',
    installs: 3200,
    rating: '4.20',
    pricing: 'paid',
    highlights: ['知识图谱', '自动关联', '可视化导航', '智能推荐'],
    compatibility: ['ONES Wiki'],
    lastUpdated: '2024-01-05',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
  },
]

// Mock categories
const mockCategories = [
  { id: '1', name: '项目管理', description: '项目规划、跟踪和协作工具', icon: '📋', pluginCount: 3 },
  { id: '2', name: '开发工具', description: '代码审查、CI/CD、版本控制', icon: '🔧', pluginCount: 3 },
  { id: '3', name: '文档协作', description: '知识管理、文档编辑、Wiki', icon: '📄', pluginCount: 3 },
  { id: '4', name: '设计工具', description: 'UI/UX 设计、原型制作', icon: '🎨', pluginCount: 1 },
  { id: '5', name: '自动化', description: '工作流自动化、集成工具', icon: '⚡', pluginCount: 1 },
  { id: '6', name: '安全合规', description: '安全扫描、合规审计', icon: '🔒', pluginCount: 1 },
]

// Mock reviews
const mockReviews = [
  { id: '1', appId: '1', userId: 'user-001', userName: '张三', rating: 5, comment: '非常好用的工具，大大提升了我们团队的协作效率！', createdAt: '2024-01-15T10:30:00Z' },
  { id: '2', appId: '1', userId: 'user-002', userName: '李四', rating: 4, comment: '功能很强大，但学习曲线稍陡。希望增加更多教程。', createdAt: '2024-01-14T14:20:00Z' },
  { id: '3', appId: '2', userId: 'user-003', userName: '王五', rating: 5, comment: 'AI 代码审查非常准确，节省了大量时间！', createdAt: '2024-01-13T09:15:00Z' },
  { id: '4', appId: '5', userId: 'user-004', userName: '赵六', rating: 5, comment: '自动化工作流太强大了，推荐给所有团队！', createdAt: '2024-01-12T16:45:00Z' },
]

// GET /api/plugins - List plugins with filtering and pagination
pluginsRouter.get('/', (req, res) => {
  try {
    const { q, category, sort, page = '1', limit = '20' } = req.query

    const pageNum = parseInt(page as string, 10)
    const limitNum = parseInt(limit as string, 10)
    const offset = (pageNum - 1) * limitNum

    let plugins = [...mockPlugins]

    // Filter by search query
    if (q && typeof q === 'string') {
      const query = q.toLowerCase()
      plugins = plugins.filter(
        (plugin) =>
          plugin.name.toLowerCase().includes(query) ||
          plugin.description.toLowerCase().includes(query)
      )
    }

    // Filter by category
    if (category && typeof category === 'string' && category !== '全部') {
      plugins = plugins.filter((plugin) => plugin.categoryName === category)
    }

    // Sort
    if (sort === 'rating') {
      plugins.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
    } else if (sort === 'name') {
      plugins.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sort === 'updated') {
      plugins.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    } else {
      // Default: sort by installs
      plugins.sort((a, b) => b.installs - a.installs)
    }

    const total = plugins.length
    const paginatedPlugins = plugins.slice(offset, offset + limitNum)

    res.json({
      plugins: paginatedPlugins,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    })
  } catch (error) {
    console.error('Error fetching plugins:', error)
    res.status(500).json({ error: 'Failed to fetch plugins' })
  }
})

// GET /api/plugins/categories - List categories
pluginsRouter.get('/categories', (req, res) => {
  try {
    // Calculate plugin count per category
    const categoriesWithCount = mockCategories.map((cat) => ({
      ...cat,
      pluginCount: mockPlugins.filter((p) => p.categoryName === cat.name).length,
    }))

    res.json({ categories: categoriesWithCount })
  } catch (error) {
    console.error('Error fetching categories:', error)
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

// GET /api/plugins/:id - Get plugin details
pluginsRouter.get('/:id', (req, res) => {
  try {
    const { id } = req.params

    const plugin = mockPlugins.find((p) => p.id === id)

    if (!plugin) {
      return res.status(404).json({ error: 'Plugin not found' })
    }

    // Get reviews for this plugin
    const reviews = mockReviews.filter((r) => r.appId === id)

    res.json({
      ...plugin,
      reviews,
    })
  } catch (error) {
    console.error('Error fetching plugin:', error)
    res.status(500).json({ error: 'Failed to fetch plugin' })
  }
})

// GET /api/plugins/:id/reviews - Get plugin reviews
pluginsRouter.get('/:id/reviews', (req, res) => {
  try {
    const { id } = req.params
    const { page = '1', limit = '10' } = req.query

    const pageNum = parseInt(page as string, 10)
    const limitNum = parseInt(limit as string, 10)
    const offset = (pageNum - 1) * limitNum

    const pluginReviews = mockReviews.filter((r) => r.appId === id)
    const total = pluginReviews.length
    const paginatedReviews = pluginReviews.slice(offset, offset + limitNum)

    res.json({
      reviews: paginatedReviews,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    res.status(500).json({ error: 'Failed to fetch reviews' })
  }
})