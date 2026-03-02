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
          className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-amber-400' : 'text-zinc-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1.5 text-xs text-zinc-400">{rating.toFixed(1)}</span>
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
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-violet-500/30 rounded-full animate-spin border-t-violet-500" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-violet-500/50" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-zinc-950">
          <div className="absolute inset-0 grid-bg opacity-50" />
          <div className="absolute inset-0 radial-gradient" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-20 pb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            <span className="text-sm text-zinc-300">Enterprise-Grade Plugin Marketplace</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="text-white">Extend Your </span>
            <span className="gradient-text-accent">ONES</span>
            <br />
            <span className="text-white">Experience</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            Discover powerful plugins and integrations to supercharge your workflow. 
            Built by the community, verified by ONES.
          </p>

          {/* Search */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-blue-600/20 to-cyan-600/20 rounded-2xl blur-xl" />
            <div className="relative flex items-center bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
              <svg className="w-5 h-5 text-zinc-500 ml-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search plugins, integrations, tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-5 bg-transparent text-white placeholder-zinc-500 focus:outline-none"
              />
              <kbd className="hidden md:flex items-center gap-1 mr-4 px-2 py-1 text-xs text-zinc-500 bg-zinc-800 rounded border border-zinc-700">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: '🔒', text: 'SOC2 Certified' },
              { icon: '✓', text: 'GDPR Compliant' },
              { icon: '👥', text: '200K+ Users' },
              { icon: '⭐', text: '4.8 Avg Rating' },
            ].map((badge) => (
              <span
                key={badge.text}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-zinc-300"
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
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-violet-400 text-sm font-medium mb-2 block">Featured</span>
                <h2 className="section-title">Spotlight Plugins</h2>
              </div>
              <Link href="/featured" className="text-sm text-zinc-400 hover:text-white flex items-center gap-2 transition-colors">
                View all
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredApps.map((app) => (
                <Link
                  key={app.id}
                  href={`/apps/${app.id}`}
                  className="glow-card p-6 group cursor-pointer"
                >
                  <div className="badge-spotlight mb-4">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Spotlight
                  </div>

                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-blue-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                      <div className="relative w-14 h-14 bg-zinc-800 rounded-xl flex items-center justify-center text-3xl">
                        {app.icon || '📦'}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white group-hover:text-violet-400 transition-colors truncate">
                        {app.name}
                      </h3>
                      <p className="text-sm text-zinc-500 truncate">{app.category}</p>
                    </div>
                  </div>

                  <p className="text-sm text-zinc-400 line-clamp-2 mb-4 min-h-[40px]">
                    {app.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <StarRating rating={app.rating} />
                    <span className="text-xs text-zinc-500">
                      {formatCount(app.downloads)} installs
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-24 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-cyan-400 text-sm font-medium mb-2 block">Categories</span>
            <h2 className="section-title">Browse by Category</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`relative group p-6 rounded-2xl border transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-white/10 border-violet-500/50'
                  : 'bg-zinc-900/50 border-white/5 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity`} />
              <div className="relative text-center">
                <div className="text-3xl mb-3">📦</div>
                <h3 className="font-medium text-white text-sm mb-1">All</h3>
                <p className="text-xs text-zinc-500">{apps.length} apps</p>
              </div>
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`relative group p-6 rounded-2xl border transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? 'bg-white/10 border-violet-500/50'
                    : 'bg-zinc-900/50 border-white/5 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color || 'from-blue-500 to-cyan-600'} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity`} />
                <div className="relative text-center">
                  <div className="text-3xl mb-3">{cat.icon || '📦'}</div>
                  <h3 className="font-medium text-white text-sm mb-1">{cat.name}</h3>
                  <p className="text-xs text-zinc-500">{cat.count} apps</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* App Grid Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-blue-400 text-sm font-medium mb-2 block">All Plugins</span>
              <h2 className="section-title">
                {selectedCategory === 'all' ? 'Explore the Marketplace' : categories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <p className="text-sm text-zinc-500 mt-2">{filteredApps.length} plugins available</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
              >
                <option value="downloads">By Downloads</option>
                <option value="rating">By Rating</option>
                <option value="name">By Name</option>
              </select>
            </div>
          </div>

          {filteredApps.length === 0 ? (
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredApps.map((app) => (
                <Link
                  key={app.id}
                  href={`/apps/${app.id}`}
                  className="glow-card p-5 group cursor-pointer"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/50 to-blue-600/50 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-2xl">
                        {app.icon || '📦'}
                      </div>
                      {app.verified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center border-2 border-zinc-900">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white group-hover:text-violet-400 transition-colors truncate">
                        {app.name}
                      </h3>
                      <p className="text-xs text-zinc-500 truncate">{app.category}</p>
                    </div>
                  </div>

                  <p className="text-sm text-zinc-400 line-clamp-2 mb-4 min-h-[40px]">
                    {app.description}
                  </p>

                  <div className="mb-3">
                    <span className="badge-primary text-xs">{app.category}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <StarRating rating={app.rating} />
                    <span className="text-xs text-zinc-500">{formatCount(app.downloads)}</span>
                  </div>

                  <button className="w-full py-2.5 bg-white/5 hover:bg-violet-600 border border-white/10 hover:border-violet-500 rounded-xl text-sm font-medium text-white transition-all duration-300">
                    Install
                  </button>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-zinc-950 to-blue-600/20" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Stay Updated</h2>
          <p className="text-lg text-zinc-400 mb-10 max-w-2xl mx-auto">
            Get notified about new apps and updates. Join our newsletter for the latest plugins and features.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="input flex-1 w-full"
            />
            <button className="btn-primary px-8 py-3 whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="font-semibold text-white">ONES Marketplace</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-zinc-500">
              <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
              <Link href="/support" className="hover:text-white transition-colors">Support</Link>
              <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
            </div>
            <p className="text-sm text-zinc-500">© 2024 ONES. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}