'use client'

import Link from 'next/link'
import { useState } from 'react'

// Mock data for demo
const mockApps = [
  { id: '1', name: 'Project Management Plus', description: 'Add Gantt charts, Kanban boards to your ONES projects', category: 'Project Management', installs: 12500, rating: 4.8, icon: '📊', verified: true, featured: true },
  { id: '2', name: 'Workflow Automator', description: 'Create custom automation rules to boost team efficiency', category: 'Automation', installs: 8900, rating: 4.6, icon: '⚡', verified: true, featured: true },
  { id: '3', name: 'Git Integration', description: 'Connect GitHub, GitLab for code-project sync', category: 'Development Tools', installs: 6700, rating: 4.9, icon: '🔗', verified: true, featured: false },
  { id: '4', name: 'Team Collaboration', description: 'Real-time collaboration, comments, @mentions', category: 'Collaboration', installs: 15200, rating: 4.7, icon: '👥', verified: false, featured: true },
  { id: '5', name: 'Data Reports', description: 'Visual reports, custom dashboards, data export', category: 'Reports', installs: 9800, rating: 4.5, icon: '📈', verified: true, featured: false },
  { id: '6', name: 'Security Audit', description: 'Operation logs, permission audit, security alerts', category: 'Security', installs: 4500, rating: 4.8, icon: '🔒', verified: true, featured: false },
  { id: '7', name: 'AI Assistant', description: 'AI-powered intelligent assistant for smart suggestions', category: 'Automation', installs: 15600, rating: 4.9, icon: '🤖', verified: true, featured: true },
  { id: '8', name: 'Time Tracker', description: 'Track time spent on tasks and projects', category: 'Project Management', installs: 7200, rating: 4.4, icon: '⏱️', verified: false, featured: false },
  { id: '9', name: 'Slack Integration', description: 'Push ONES notifications to Slack channels', category: 'Collaboration', installs: 8800, rating: 4.6, icon: '💬', verified: true, featured: false },
]

const categories = [
  { id: 'all', name: 'All', icon: '🌐', count: 156, color: 'from-gray-500 to-gray-600' },
  { id: 'project', name: 'Project Management', icon: '📁', count: 45, color: 'from-blue-500 to-blue-600' },
  { id: 'automation', name: 'Automation', icon: '⚡', count: 23, color: 'from-orange-500 to-amber-500' },
  { id: 'development', name: 'Development Tools', icon: '🔧', count: 38, color: 'from-green-500 to-emerald-500' },
  { id: 'collaboration', name: 'Collaboration', icon: '🤝', count: 28, color: 'from-purple-500 to-pink-500' },
  { id: 'reports', name: 'Reports', icon: '📊', count: 18, color: 'from-indigo-500 to-purple-500' },
  { id: 'security', name: 'Security', icon: '🛡️', count: 15, color: 'from-slate-600 to-slate-700' },
]

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('installs')

  const filteredApps = mockApps
    .filter(app => selectedCategory === 'all' || app.category.toLowerCase().includes(selectedCategory))
    .filter(app => searchQuery === '' || app.name.toLowerCase().includes(searchQuery.toLowerCase()) || app.description.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return b.installs - a.installs
    })

  const featuredApps = mockApps.filter(app => app.featured)

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">ONES Marketplace</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Discover, install and manage enterprise apps for your ONES platform
          </p>
          
          {/* Search */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search apps by name, category, or feature..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pr-32 rounded-xl text-gray-800 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Search
              </button>
            </div>
          </div>
          
          {/* Trust Badges */}
          <div className="flex justify-center gap-6 text-sm flex-wrap">
            <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <span>🔒</span> SOC2 Certified
            </span>
            <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <span>✓</span> GDPR Compliant
            </span>
            <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <span>👥</span> 200K+ Users
            </span>
            <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <span>⭐</span> 4.8 Avg Rating
            </span>
          </div>
        </div>
      </section>

      {/* Featured Apps Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Apps</h2>
          <Link href="/featured" className="text-blue-600 hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredApps.map((app) => (
            <Link
              key={app.id}
              href={`/apps/${app.id}`}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group"
            >
              <div className="absolute top-3 left-3">
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  ✨ SPOTLIGHT
                </span>
              </div>
              <div className="text-4xl mb-4 mt-6">{app.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600">{app.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">{app.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-yellow-500">★★★★★ {app.rating}</span>
                <span className="text-gray-400">{(app.installs/1000).toFixed(1)}k</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-4 rounded-xl text-center transition-all duration-300 hover:scale-105 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-br ' + cat.color + ' text-white shadow-lg'
                  : 'bg-white border border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className={`text-sm font-medium ${selectedCategory === cat.id ? 'text-white' : 'text-gray-700'}`}>
                {cat.name}
              </div>
              <div className={`text-xs ${selectedCategory === cat.id ? 'text-white/80' : 'text-gray-400'}`}>
                {cat.count} apps
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* App Grid Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedCategory === 'all' ? 'All Apps' : categories.find(c => c.id === selectedCategory)?.name}
            <span className="text-sm font-normal text-gray-500 ml-2">({filteredApps.length} apps)</span>
          </h2>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="installs">By Installs</option>
            <option value="rating">By Rating</option>
            <option value="name">By Name</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => (
            <Link
              key={app.id}
              href={`/apps/${app.id}`}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-3xl">
                    {app.icon}
                  </div>
                  {app.verified && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {app.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">{app.description}</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {app.category}
                  </span>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-yellow-500">
                      ★ {app.rating}
                    </span>
                    <span className="text-gray-400">
                      {(app.installs / 1000).toFixed(1)}k installs
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-400 mb-8">Get notified about new apps and updates</p>
          <div className="flex max-w-md mx-auto gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}