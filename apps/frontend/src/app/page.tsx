import Link from 'next/link'

// Mock data for demo
const mockApps = [
  {
    id: '1',
    name: '项目管理增强',
    description: '为 ONES 项目添加甘特图、看板视图等高级功能',
    category: '项目管理',
    installs: 12500,
    rating: 4.8,
    icon: '📊',
  },
  {
    id: '2',
    name: '自动化工作流',
    description: '创建自定义自动化规则，提升团队效率',
    category: '自动化',
    installs: 8900,
    rating: 4.6,
    icon: '⚡',
  },
  {
    id: '3',
    name: '代码仓库集成',
    description: '连接 GitHub、GitLab，实现代码与项目联动',
    category: '开发工具',
    installs: 6700,
    rating: 4.9,
    icon: '🔗',
  },
  {
    id: '4',
    name: '团队协作增强',
    description: '实时协作、评论、@提及等团队沟通功能',
    category: '协作',
    installs: 15200,
    rating: 4.7,
    icon: '👥',
  },
  {
    id: '5',
    name: '数据报表',
    description: '可视化报表、自定义仪表盘、数据导出',
    category: '报表',
    installs: 9800,
    rating: 4.5,
    icon: '📈',
  },
  {
    id: '6',
    name: '安全审计',
    description: '操作日志、权限审计、安全告警',
    category: '安全',
    installs: 4500,
    rating: 4.8,
    icon: '🔒',
  },
]

const categories = ['全部', '项目管理', '自动化', '开发工具', '协作', '报表', '安全']

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-ones-primary">
              ONES Marketplace
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/" className="text-gray-600 hover:text-ones-primary">
                应用市场
              </Link>
              <Link href="/my-apps" className="text-gray-600 hover:text-ones-primary">
                我的应用
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-gray-600 hover:text-ones-primary"
            >
              登录
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-ones-primary text-white rounded-lg hover:bg-blue-600"
            >
              注册
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">ONES 应用商店</h1>
          <p className="text-xl text-blue-100 mb-8">
            发现、安装和管理企业级应用，扩展您的 ONES 平台能力
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索应用..."
                className="w-full px-6 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-ones-primary text-white rounded-full hover:bg-blue-600">
                搜索
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar - Categories */}
          <aside className="w-full md:w-64 shrink-0">
            <h2 className="font-semibold text-lg mb-4">分类</h2>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    category === '全部'
                      ? 'bg-ones-primary text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </aside>

          {/* App Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-lg">热门应用</h2>
              <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ones-primary">
                <option value="installs">按安装量</option>
                <option value="rating">按评分</option>
                <option value="name">按名称</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockApps.map((app) => (
                <Link
                  key={app.id}
                  href={`/apps/${app.id}`}
                  className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{app.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{app.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                        {app.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <span className="text-sm text-gray-500">{app.category}</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        ⭐ {app.rating}
                      </span>
                      <span className="text-gray-400">
                        {(app.installs / 1000).toFixed(1)}k
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          <p>© 2024 ONES Marketplace. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}