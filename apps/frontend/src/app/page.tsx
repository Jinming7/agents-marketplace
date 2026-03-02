'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { appsApi, categoriesApi } from '@/lib/api'

interface App {
  id: string
  name: string
  description: string
  category: string
  downloads: number
  rating: number
  icon: string
  verified?: boolean
  featured?: boolean
}

interface Category {
  id: string
  name: string
  slug?: string
  icon: string
  count: number
}

export default function HomePage() {
  const [apps, setApps] = useState<App[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('downloads')

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [appsRes, catRes] = await Promise.all([appsApi.list(), categoriesApi.list()])
        if (appsRes.success && appsRes.data) setApps(appsRes.data)
        if (catRes.success && catRes.data) setCategories(catRes.data)
      } catch (e) {
        console.error('Failed to fetch data:', e)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const selectedCategoryName = selectedCategory === 'all' ? null : categories.find(c => c.id === selectedCategory)?.name

  const filteredApps = apps
    .filter(app => {
      if (selectedCategory === 'all') return true
      if (!selectedCategoryName) return true
      return app.category?.toLowerCase() === selectedCategoryName.toLowerCase()
    })
    .filter(app => {
      if (!searchQuery) return true
      const q = searchQuery.toLowerCase()
      return app.name?.toLowerCase().includes(q) || app.description?.toLowerCase().includes(q)
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return b.downloads - a.downloads
    })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 pt-16">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Find apps for your team
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Discover and install apps that help your team work smarter.
            </p>
            
            {/* Search */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search apps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10"
                />
              </div>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input w-40">
                <option value="downloads">Most Popular</option>
                <option value="rating">Top Rated</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories */}
          <aside className="lg:w-56 flex-shrink-0">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Categories</h2>
            <nav className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-primary-50 text-primary font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span className="flex-1 text-left">{cat.name}</span>
                  <span className="text-xs text-gray-400">{cat.count}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* App Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                {filteredApps.length} {filteredApps.length === 1 ? 'app' : 'apps'}
              </p>
            </div>

            {filteredApps.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No apps found</h3>
                <p className="text-gray-500 mb-4">Try a different search or category</p>
                <button onClick={() => { setSearchQuery(''); setSelectedCategory('all') }} className="btn-secondary px-4 py-2 text-sm">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredApps.map((app) => (
                  <Link key={app.id} href={`/apps/${app.id}`} className="card-hover p-4 group">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-2xl flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                        {app.icon || '📦'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900 group-hover:text-primary truncate">{app.name}</h3>
                          {app.verified && (
                            <span className="badge-verified flex-shrink-0">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                              Verified
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{app.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500">{app.category}</span>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="flex items-center gap-1 text-gray-600">
                          <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          {app.rating?.toFixed(1)}
                        </span>
                        <span className="text-gray-400">{(app.downloads / 1000).toFixed(0)}k</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '4.5', label: 'Average Rating' },
              { value: '200K+', label: 'Users' },
              { value: 'SOC2', label: 'Certified' },
              { value: 'GDPR', label: 'Compliant' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}