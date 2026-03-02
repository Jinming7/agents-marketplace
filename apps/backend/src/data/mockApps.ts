// Generate 100 mock apps with realistic data

const appNames = [
  // Project Management (15)
  'ProjectPro', 'TaskMaster', 'SprintPlanner', 'RoadmapPro', 'BacklogManager',
  'AgileBoard', 'KanbanFlow', 'ScrumMaster', 'MilestoneTracker', 'ProjectHub',
  'TeamPlanner', 'WorkQueue', 'TimelinePro', 'GanttChart', 'ProjectVision',
  // Automation (12)
  'AutoFlow', 'WorkflowBot', 'TaskAutomator', 'IntegrationHub', 'ZapConnect',
  'FlowBuilder', 'AutoPilot', 'SmartRules', 'TriggerPro', 'AutomationEngine',
  'ProcessBot', 'Streamline',
  // Communication (15)
  'TeamChat', 'ChatPro', 'MessageHub', 'TeamTalk', 'CollabSpace',
  'VideoMeet', 'VoiceConnect', 'ChatStream', 'TeamMessenger', 'QuickChat',
  'GroupChat', 'ChatSync', 'TeamComms', 'MessageFlow', 'ChatCentral',
  // Analytics (10)
  'AnalyticsPlus', 'DataInsight', 'MetricsPro', 'DashboardHub', 'ReportGen',
  'ChartBuilder', 'DataViz', 'InsightEngine', 'KPI Tracker', 'AnalyticsPro',
  // Design (12)
  'DesignKit', 'SketchPro', 'DesignTools', 'CreativeHub', 'ArtBoard',
  'DesignFlow', 'CanvasPro', 'DesignSync', 'UI Kit', 'DesignSpace',
  'ColorPal', 'FontMaster',
  // Development (15)
  'DevTools', 'CodeReview', 'GitHelper', 'CI Pipeline', 'DeployBot',
  'CodeQuality', 'TestRunner', 'DevDashboard', 'API Tester', 'CodeSearch',
  'RepoManager', 'BuildMonitor', 'DevOps Hub', 'CodeSync', 'DevAssistant',
  // AI & ML (12)
  'AI Assistant', 'ML Studio', 'ChatBot Pro', 'SmartSearch', 'AIAgent',
  'ML Pipeline', 'NeuralNet', 'AI Writer', 'SmartSuggest', 'ML Builder',
  'AI Vision', 'DataMiner',
  // Security (9)
  'SecureGate', 'AuthGuard', 'SecurityScan', 'AccessControl', 'VaultPro',
  'AuditLog', 'ComplianceKit', 'SecureSync', 'ThreatDetect',
]

const categories = [
  'Project Management', 'Automation', 'Communication', 'Analytics',
  'Design', 'Development', 'AI & Machine Learning', 'Security',
]

const categoryIcons: Record<string, string> = {
  'Project Management': '📊',
  'Automation': '⚡',
  'Communication': '💬',
  'Analytics': '📈',
  'Design': '🎨',
  'Development': '👨‍💻',
  'AI & Machine Learning': '🤖',
  'Security': '🔒',
}

const developers = [
  'TechCorp', 'DevStudio', 'AppMakers', 'CodeLabs', 'SoftHouse',
  'DigitalWorks', 'CloudApps', 'SmartDev', 'ProTools', 'InnovateTech',
  'NextGen', 'FutureSoft', 'AppFactory', 'DevHub', 'TechPioneers',
  'CloudFirst', 'AgileDev', 'CodeCraft', 'DigitalFirst', 'TechVision',
]

const descriptions = [
  'Streamline your workflow with powerful automation and intuitive design.',
  'Boost team productivity with real-time collaboration features.',
  'Advanced analytics and reporting for data-driven decisions.',
  'Seamless integration with your existing tools and workflows.',
  'Enterprise-grade security with compliance certifications.',
  'AI-powered insights to optimize your processes.',
  'Customizable dashboards and flexible configuration options.',
  'Mobile-first design with offline capabilities.',
  'Automated workflows to save time and reduce errors.',
  'Real-time sync across all your devices and teams.',
]

// Atlassian-style pricing tiers
interface PricingTier {
  users: string
  monthly: number
  yearly: number
}

function generatePricingTiers(basePrice: number): PricingTier[] {
  return [
    { users: '1 - 10', monthly: basePrice, yearly: Math.round(basePrice * 10 * 0.83) },
    { users: '11 - 25', monthly: Math.round(basePrice * 1.5), yearly: Math.round(basePrice * 1.5 * 10 * 0.83) },
    { users: '26 - 50', monthly: Math.round(basePrice * 2.5), yearly: Math.round(basePrice * 2.5 * 10 * 0.83) },
    { users: '51 - 100', monthly: Math.round(basePrice * 4), yearly: Math.round(basePrice * 4 * 10 * 0.83) },
    { users: '101 - 250', monthly: Math.round(basePrice * 6), yearly: Math.round(basePrice * 6 * 10 * 0.83) },
    { users: '251 - 500', monthly: Math.round(basePrice * 8), yearly: Math.round(basePrice * 8 * 10 * 0.83) },
    { users: '501 - 1000', monthly: Math.round(basePrice * 12), yearly: Math.round(basePrice * 12 * 10 * 0.83) },
    { users: '1000+', monthly: 0, yearly: 0 }, // Contact sales
  ]
}

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generatePricing(model: string, basePrice: number) {
  const tiers = generatePricingTiers(basePrice)
  const trialDays = 30
  
  switch (model) {
    case 'free':
      return {
        model: 'free' as const,
        tiers: null,
        trialDays: null,
        message: 'Free forever. No credit card required.',
      }
    case 'paid':
      return {
        model: 'paid' as const,
        tiers,
        trialDays,
        message: 'Per-user pricing. Annual billing saves 17%.',
      }
    case 'freemium':
      return {
        model: 'freemium' as const,
        tiers,
        trialDays,
        freeUsers: 5,
        message: 'Free for up to 5 users. Upgrade for more.',
      }
    case 'enterprise':
      return {
        model: 'enterprise' as const,
        tiers: null,
        trialDays,
        message: 'Contact sales for custom enterprise pricing.',
      }
    default:
      return {
        model: 'paid' as const,
        tiers,
        trialDays,
        message: 'Per-user pricing. Annual billing saves 17%.',
      }
  }
}

function generateScreenshots(name: string): string[] {
  return [
    `https://placehold.co/800x600/3B82F6/white?text=${encodeURIComponent(name)}+Dashboard`,
    `https://placehold.co/800x600/10B981/white?text=${encodeURIComponent(name)}+Features`,
    `https://placehold.co/800x600/8B5CF6/white?text=${encodeURIComponent(name)}+Settings`,
  ]
}

function generateVersionHistory(): { version: string; date: string; changes: string[] }[] {
  return [
    {
      version: '3.2.0',
      date: '2024-01-15',
      changes: ['New dashboard layout', 'Performance improvements', 'Bug fixes'],
    },
    {
      version: '3.1.0',
      date: '2023-12-01',
      changes: ['Added dark mode', 'New API endpoints', 'UI improvements'],
    },
    {
      version: '3.0.0',
      date: '2023-10-15',
      changes: ['Major redesign', 'New features', 'Breaking changes'],
    },
  ]
}

function generateReviews(): { author: string; rating: number; comment: string; date: string }[] {
  const reviewComments = [
    'Great app! Really helps our team stay organized.',
    'Easy to use and integrates well with our workflow.',
    'Good value for money. Support is responsive.',
    'Feature-rich but could use some UI improvements.',
    'Exactly what we needed. Highly recommended!',
    'Solid app with good documentation.',
    'Works as expected. No complaints.',
    'Impressive functionality. A bit of a learning curve.',
  ]

  return Array.from({ length: randomInt(5, 20) }, (_, i) => ({
    author: `User${randomInt(100, 999)}`,
    rating: randomInt(3, 5),
    comment: randomElement(reviewComments),
    date: new Date(Date.now() - randomInt(1, 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  }))
}

export function generateMockApps(count: number = 100) {
  const apps = []

  for (let i = 0; i < count; i++) {
    const name = appNames[i % appNames.length] + (i >= appNames.length ? ` ${Math.floor(i / appNames.length) + 1}` : '')
    const category = categories[Math.floor(i / (count / categories.length))] || randomElement(categories)
    const pricingModel = randomElement(['free', 'paid', 'paid', 'freemium', 'paid', 'enterprise'])
    const basePrice = randomInt(3, 15)
    const reviews = generateReviews()
    const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)

    apps.push({
      id: `app-${i + 1}`,
      name,
      description: randomElement(descriptions),
      icon: categoryIcons[category],
      category,
      developer: randomElement(developers),
      rating: parseFloat(avgRating),
      downloads: randomInt(1000, 500000),
      verified: Math.random() > 0.3,
      featured: i < 10,
      pricing: generatePricing(pricingModel, basePrice),
      screenshots: generateScreenshots(name),
      versionHistory: generateVersionHistory(),
      reviews,
      createdAt: new Date(Date.now() - randomInt(30, 730) * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - randomInt(1, 30) * 24 * 60 * 60 * 1000).toISOString(),
    })
  }

  return apps
}

export const mockApps = generateMockApps(100)