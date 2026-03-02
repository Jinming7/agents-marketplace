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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
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

  return (
    <div className="min-h-screen">
      {/* ========================================
          Hero Section - Dramatic & Breathable
          ======================================== */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Subtle gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-primary-100/40 to-transparent rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-tl from-secondary-100/30 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-24 text-center">
          {/* Badge */}
          <div 
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 mb-12 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
          >
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium text-slate">Trusted by 200K+ teams worldwide</span>
          </div>

          {/* Main Headline - Dramatic Typography */}
          <h1 
            className={`text-display font-medium text-ink mb-8 ${mounted ? 'animate-fade-in-up animate-stagger-1' : 'opacity-0'}`}
          >
            Discover
            <br />
            <span className="text-gradient animate-gradient">extraordinary</span>
            <br />
            apps
          </h1>

          {/* Subheadline */}
          <p 
            className={`text-subhead text-slate max-w-xl mx-auto mb-16 ${mounted ? 'animate-fade-in-up animate-stagger-2' : 'opacity-0'}`}
          >
            Transform your workflow with powerful integrations. Browse, install, and manage apps designed for modern teams.
          </p>

          {/* Search Capsule */}
          <div 
            className={`max-w-2xl mx-auto ${mounted ? 'animate-fade-in-up animate-stagger-3' : 'opacity-0'}`}
          >
            <div className="search-capsule flex items-center px-6">
              <svg className="w-5 h-5 text-slate mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search apps, categories, or features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-ink placeholder-slate/60 focus:outline-none text-lg"
              />
              <button className="btn-primary px-6 py-3 rounded-full text-sm font-medium ml-4">
                Search
              </button>
            </div>
          </div>

          {/* Trust indicators */}
          <div 
            className={`flex flex-wrap justify-center gap-8 mt-16 ${mounted ? 'animate-fade-in-up animate-stagger-4' : 'opacity-0'}`}
          >
            {[
              { label: 'SOC2 Certified', icon: '🔒' },
              { label: 'GDPR Compliant', icon: '✓' },
              { label: '99.9% Uptime', icon: '⚡' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-caption text-slate/70">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          Featured Apps - Floating Cards
          ======================================== */}
      {featuredApps.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-caption text-slate/60 mb-2">CURATED SELECTION</p>
              <h2 className="text-headline text-ink">Featured Apps</h2>
            </div>
            <Link 
              href="/featured" 
              className="text-primary font-medium hover:text-primary-600 transition-colors flex items-center gap-2"
            >
              View all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredApps.map((app, index) => (
              <Link
                key={app.id}
                href={`/apps/${app.id}`}
                className="card-hover p-6 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Featured badge */}
                <div className="absolute -top-2 -right-2 z-10">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold rounded-full shadow-lg">
                    ✨ Featured
                  </span>
                </div>

                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center text-4xl mb-5 group-hover:scale-110 transition-transform duration-500 ease-out-expo">
                  {app.icon || '📦'}
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-ink mb-2 group-hover:text-primary transition-colors">
                  {app.name}
                </h3>
                <p className="text-body text-slate/70 line-clamp-2 mb-5">{app.description}</p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-amber-500 font-medium">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {app.rating?.toFixed(1)}
                  </span>
                  <span className="text-slate/50">
                    {(app.downloads / 1000).toFixed(1)}k users
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ========================================
          Categories - Minimal & Clean
          ======================================== */}
      <section className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="mb-10">
          <p className="text-caption text-slate/60 mb-2">EXPLORE BY</p>
          <h2 className="text-headline text-ink">Categories</h2>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-400 ease-out-expo ${
              selectedCategory === 'all'
                ? 'bg-ink text-white shadow-lg'
                : 'bg-white text-slate hover:bg-gray-50 shadow-soft'
            }`}
          >
            All Apps
            <span className="ml-2 opacity-60">({apps.length})</span>
          </button>
          {categories.slice(0, 8).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-400 ease-out-expo ${
                selectedCategory === cat.id
                  ? 'bg-ink text-white shadow-lg'
                  : 'bg-white text-slate hover:bg-gray-50 shadow-soft'
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.name}
              <span className="ml-2 opacity-60">({cat.count})</span>
            </button>
          ))}
        </div>
      </section>

      {/* ========================================
          App Grid - The Main Event
          ======================================== */}
      <section className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
          <div>
            <p className="text-caption text-slate/60 mb-2">
              {selectedCategory === 'all' ? 'ALL APPS' : selectedCategoryName?.toUpperCase()}
            </p>
            <h2 className="text-headline text-ink">
              {filteredApps.length} apps available
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-5 py-3 rounded-full bg-white shadow-soft text-sm text-slate cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="downloads">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-6">
                <div className="skeleton w-14 h-14 rounded-2xl mb-5" />
                <div className="skeleton h-5 w-3/4 mb-3" />
                <div className="skeleton h-4 w-full mb-2" />
                <div className="skeleton h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              🔍
            </div>
            <h3 className="text-xl font-semibold text-ink mb-3">No apps found</h3>
            <p className="text-slate mb-8">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className="btn-secondary px-8 py-3 rounded-full"
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
                    <div className="w-14 h-14 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500 ease-out-expo">
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
                    <h3 className="font-semibold text-ink group-hover:text-primary transition-colors line-clamp-1">
                      {app.name}
                    </h3>
                    <p className="text-sm text-slate/70 line-clamp-2 mt-1">{app.description}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-50 text-slate">
                      {app.category}
                    </span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-amber-500 font-medium">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {app.rating?.toFixed(1)}
                      </span>
                      <span className="text-slate/50">
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

      {/* ========================================
          Newsletter - Dark Section
          ======================================== */}
      <section className="relative overflow-hidden bg-ink">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-[1200px] mx-auto px-6 py-24">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-4xl font-medium text-white mb-4">
              Stay in the loop
            </h2>
            <p className="text-slate/60 mb-10">
              Get notified about new apps, updates, and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-white/10 border border-white/10 rounded-full text-white placeholder-slate/40 focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all"
              />
              <button className="btn-primary px-8 py-4 rounded-full whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="text-sm text-slate/40 mt-4">
              No spam, unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}