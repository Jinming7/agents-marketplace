import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { marketplaceApps, marketplaceCategories, marketplaceReviews, users } from './schema/index.js'

const connectionString = process.env.DATABASE_URL!

const client = postgres(connectionString, { prepare: false })
const db = drizzle(client)

async function seed() {
  console.log('🌱 Seeding database...')

  // Insert marketplace categories
  const categoryData = [
    { name: '项目管理', description: '项目规划、跟踪和协作工具', icon: '📋' },
    { name: '开发工具', description: '代码审查、CI/CD、版本控制', icon: '🔧' },
    { name: '文档协作', description: '知识管理、文档编辑、Wiki', icon: '📄' },
    { name: '设计工具', description: 'UI/UX 设计、原型制作', icon: '🎨' },
    { name: '自动化', description: '工作流自动化、集成工具', icon: '⚡' },
    { name: '安全合规', description: '安全扫描、合规审计', icon: '🔒' },
  ]

  await db.insert(marketplaceCategories).values(categoryData).onConflictDoNothing()
  console.log('✅ Marketplace categories seeded')

  // Insert marketplace apps
  const appData = [
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
  ]

  await db.insert(marketplaceApps).values(appData).onConflictDoNothing()
  console.log('✅ Marketplace apps seeded')

  // Insert some reviews
  const reviewData = [
    {
      appId: (await db.select({ id: marketplaceApps.id }).from(marketplaceApps).limit(1))[0]?.id,
      userId: 'user-001',
      userName: '张三',
      rating: 5,
      comment: '非常好用的工具，大大提升了我们团队的协作效率！',
    },
    {
      appId: (await db.select({ id: marketplaceApps.id }).from(marketplaceApps).limit(1))[0]?.id,
      userId: 'user-002',
      userName: '李四',
      rating: 4,
      comment: '功能很强大，但学习曲线稍陡。希望增加更多教程。',
    },
    {
      appId: (await db.select({ id: marketplaceApps.id }).from(marketplaceApps).limit(1))[0]?.id,
      userId: 'user-003',
      userName: '王五',
      rating: 5,
      comment: '集成体验非常流畅，推荐给所有使用 ONES 的团队！',
    },
  ]

  // Only insert reviews if we have app IDs
  const apps = await db.select({ id: marketplaceApps.id }).from(marketplaceApps).limit(3)
  if (apps.length >= 3) {
    const reviewsWithAppIds = [
      { ...reviewData[0], appId: apps[0].id },
      { ...reviewData[1], appId: apps[1].id },
      { ...reviewData[2], appId: apps[2].id },
    ]
    await db.insert(marketplaceReviews).values(reviewsWithAppIds).onConflictDoNothing()
    console.log('✅ Reviews seeded')
  }

  // Insert test user
  await db.insert(users).values({
    email: 'demo@ones.com',
    password: '$2b$10$dummyHashForDemoPurposesOnly',
    name: 'Demo User',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
    bio: '演示用户',
  }).onConflictDoNothing()
  console.log('✅ Users seeded')

  console.log('🎉 Seeding complete!')
  await client.end()
}

seed().catch(console.error)