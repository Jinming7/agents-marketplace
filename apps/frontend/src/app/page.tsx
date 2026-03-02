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

// Star Rating Component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-amber-400' : 'text-slate-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1.5 text-xs text-slate-500">{rating.toFixed(1)}</span>
    </div>
  )
}

// Format count
function formatCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
  return count.toString()
}

export default function HomePage() {
  const [apps, setApps] = useState<App[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('downloads')

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const [appsRes, catRes] = await Promise.all([
          appsApi.list(),
          categoriesApi.list()
        ])
        if (appsRes.success && appsRes.data) {
          setApps(appsRes.data)
        } else {
          setError(appsRes.error || 'Failed to load apps')
        }
        if (catRes.success && catRes.data) {
          setCategories(catRes.data)
        }
      } catch (e) {
        console.error('Failed to fetch data:', e)
        setError('Network error')
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 rounded-full animate-spin border-t-indigo-500" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white py-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="text-sm text-indigo-100">Enterprise-Grade Plugin Marketplace</span>
          </div>

          <h1 className="text-5xl font-bold mb-6">ONES Marketplace</h1>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Discover, install and manage enterprise apps for your ONES platform
          </p>
          
          {/* Search */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl" />
              <div className="relative flex items-center bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl">
                <svg className="w-5 h-5 text-slate-400 ml-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search apps by name, category, or feature..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-5 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none"
                />
                <button className="m-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>
          
          {/* Trust Badges */}
          <div className="flex justify-center gap-4 text-sm flex-wrap">
            {[
              { icon: '🔒', text: 'SOC2 Certified' },
              { icon: '✓', text: 'GDPR Compliant' },
              { icon: '👥', text: '200K+ Users' },
              { icon: '⭐', text: '4.8 Avg Rating' },
            ].map((badge) => (
              <span
                key={badge.text}
                className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20"
              >
                <span>{badge.icon}</span>
                {badge.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Apps Section */}
      {featuredApps.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-indigo-600 text-sm font-medium mb-1 block">Featured</span>
              <h2 className="text-2xl font-bold text-slate-900">Spotlight Apps</h2>
            </div>
            <Link href="/featured" className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
              View all
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredApps.map((app) => (
              <Link
                key={app.id}
                href={`/apps/${app.id}`}
                className="glow-card p-5 group cursor-pointer"
              >
                <div className="absolute top-3 left-3">
                  <span className="badge-spotlight">
                    ✨ Spotlight
                  </span>
                </div>
                <div className="text-4xl mb-4 mt-8">{app.icon || '📦'}</div>
                <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{app.name}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-3">{app.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <StarRating rating={app.rating} />
                  <span className="text-slate-400">{formatCount(app.downloads)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-4 rounded-2xl text-center transition-all duration-300 hover:scale-105 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md'
              }`}
            >
              <div className="text-3xl mb-2">{cat.icon || '📦'}</div>
              <div className={`text-sm font-medium ${selectedCategory === cat.id ? 'text-white' : 'text-slate-700'}`}>
                {cat.name}
              </div>
              <div className={`text-xs ${selectedCategory === cat.id ? 'text-indigo-100' : 'text-slate-400'}`}>
                {cat.count} apps
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* App Grid Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {selectedCategory === 'all' ? 'All Apps' : categories.find(c => c.id === selectedCategory)?.name}
            <span className="text-sm font-normal text-slate-500 ml-2">({filteredApps.length} apps)</span>
          </h2>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
          >
            <option value="downloads">By Downloads</option>
            <option value="rating">By Rating</option>
            <option value="name">By Name</option>
          </select>
        </div>

        {error ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <span className="text-4xl">⚠️</span>
            </div>
            <h3 className="empty-state-title">Failed to load apps</h3>
            <p className="empty-state-description">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary"
            >
              Retry
            </button>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="empty-state-title">No apps found</h3>
            <p className="empty-state-description">
              Try a different category or search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map((app) => (
              <Link
                key={app.id}
                href={`/apps/${app.id}`}
                className="glow-card p-6 group cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl flex items-center justify-center text-3xl shadow-sm">
                      {app.icon || '📦'}
                    </div>
                    {app.verified && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center border-2 border-white">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {app.name}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mt-1">{app.description}</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {app.category}
                    </span>
                    <div className="flex items-center gap-4 text-sm">
                      <StarRating rating={app.rating} />
                      <span className="text-slate-400">
                        {formatCount(app.downloads)} downloads
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
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-slate-400 mb-8">Get notified about new apps and updates</p>
          <div className="flex max-w-md mx-auto gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}