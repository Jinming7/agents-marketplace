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
  color?: string
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
        const [appsRes, catRes] = await Promise.all([
          appsApi.list(),
          categoriesApi.list()
        ])
        if (appsRes.success && appsRes.data) {
          setApps(appsRes.data)
        }
        if (catRes.success && catRes.data) {
          setCategories(catRes.data)
        }
      } catch (e) {
        console.error('Failed to fetch data:', e)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const selectedCategoryName = selectedCategory === 'all'
    ? null
    : categories.find(c => c.id === selectedCategory || c.slug === selectedCategory)?.name

  const filteredApps = apps
    .filter(app => {
      if (selectedCategory === 'all') return true
      if (!selectedCategoryName) return true
      return app.category?.toLowerCase() === selectedCategoryName.toLowerCase()
    })
    .filter(app => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return app.name?.toLowerCase().includes(query) ||
             app.description?.toLowerCase().includes(query)
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return b.downloads - a.downloads
    })

  const featuredApps = apps.filter(app => app.featured).slice(0, 4)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading amazing apps...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-gray-50">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-primary-100/40 to-secondary-100/40 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-primary-100/30 to-secondary-100/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary-50/50 to-transparent rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-medium text-primary-700">New apps added weekly</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6 animate-fade-in-up">
              Discover the best
              <br />
              <span className="text-gradient">enterprise apps</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto animate-fade-in-up animation-delay-100">
              Transform your workflow with powerful integrations. Browse, install, and manage apps designed for modern teams.
            </p>

            {/* Search */}
            <div className="max-w-2xl mx-auto mb-12 animate-fade-in-up animation-delay-200">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative flex items-center bg-white rounded-2xl shadow-soft-lg border border-gray-100 overflow-hidden">
                  <svg className="w-5 h-5 text-gray-400 ml-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search apps by name, category, or feature..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-5 text-gray-900 placeholder-gray-400 focus:outline-none"
                  />
                  <button className="m-2 px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-600 active:bg-primary-700 transition-colors shadow-sm hover:shadow-md">
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 animate-fade-in-up animation-delay-300">
              {[
                { icon: '🔒', label: 'SOC2 Certified' },
                { icon: '✓', label: 'GDPR Compliant' },
                { icon: '👥', label: '200K+ Users' },
                { icon: '⭐', label: '4.8 Avg Rating' },
              ].map((badge) => (
                <span
                  key={badge.label}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm text-gray-600 shadow-soft border border-gray-100/50"
                >
                  <span>{badge.icon}</span>
                  <span>{badge.label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Apps Section */}
      {featuredApps.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Apps</h2>
              <p className="text-gray-500 mt-1">Hand-picked by our team</p>
            </div>
            <Link href="/featured" className="text-primary font-medium hover:text-primary-600 transition-colors flex items-center gap-1">
              View all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredApps.map((app, index) => (
              <Link
                key={app.id}
                href={`/apps/${app.id}`}
                className="group relative bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Spotlight Badge */}
                <div className="absolute -top-2 -right-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold rounded-full shadow-lg">
                    ✨ Featured
                  </span>
                </div>

                {/* Icon */}
                <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {app.icon || '📦'}
                </div>

                {/* Content */}
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                  {app.name}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{app.description}</p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-amber-500 font-medium">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {app.rating?.toFixed(1)}
                  </span>
                  <span className="text-gray-400">
                    {(app.downloads / 1000).toFixed(1)}k users
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`p-4 sm:p-5 rounded-2xl text-center transition-all duration-300 ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-br from-primary to-secondary text-white shadow-soft-lg scale-105'
                : 'bg-white border border-gray-100 hover:border-gray-200 hover:shadow-soft'
            }`}
          >
            <div className="text-3xl mb-2">🏪</div>
            <div className="text-sm font-medium">All</div>
          </button>
          {categories.slice(0, 6).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-4 sm:p-5 rounded-2xl text-center transition-all duration-300 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-br from-primary to-secondary text-white shadow-soft-lg scale-105'
                  : 'bg-white border border-gray-100 hover:border-gray-200 hover:shadow-soft'
              }`}
            >
              <div className="text-3xl mb-2">{cat.icon || '📦'}</div>
              <div className="text-sm font-medium line-clamp-1">{cat.name}</div>
              <div className={`text-xs mt-1 ${selectedCategory === cat.id ? 'text-white/80' : 'text-gray-400'}`}>
                {cat.count} apps
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* App Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {selectedCategory === 'all' ? 'All Apps' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-gray-500 mt-1">{filteredApps.length} apps available</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input py-2.5 pr-10 text-sm min-w-[160px] cursor-pointer"
            >
              <option value="downloads">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>

        {filteredApps.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              🔍
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No apps found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className="btn-secondary px-6 py-2.5"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map((app, index) => (
              <Link
                key={app.id}
                href={`/apps/${app.id}`}
                className="card-hover p-6 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                      {app.icon || '📦'}
                    </div>
                    {app.verified && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-white">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                      {app.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">{app.description}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="badge bg-gray-100 text-gray-600">
                      {app.category}
                    </span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-amber-500 font-medium">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {app.rating?.toFixed(1)}
                      </span>
                      <span className="text-gray-400">
                        {(app.downloads / 1000).toFixed(1)}k
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Stay in the loop
            </h2>
            <p className="text-gray-400 mb-8">
              Get notified about new apps, updates, and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-4 bg-white/10 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button className="btn-primary px-8 py-4 whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              No spam, unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}