'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { appsApi } from '@/lib/api'

interface App {
  id: string
  name: string
  description: string
  icon: string
  category: string
  rating: number
  downloads: number
  verified?: boolean
}

const categoryInfo: Record<string, { name: string; icon: string; color: string; description: string }> = {
  'project-management': { 
    name: 'Project Management', 
    icon: '📊', 
    color: 'blue',
    description: 'Tools for planning, tracking, and managing projects'
  },
  'automation': { 
    name: 'Automation', 
    icon: '⚡', 
    color: 'yellow',
    description: 'Automate workflows and repetitive tasks'
  },
  'communication': { 
    name: 'Communication', 
    icon: '💬', 
    color: 'green',
    description: 'Team messaging, video calls, and collaboration'
  },
  'analytics': { 
    name: 'Analytics', 
    icon: '📈', 
    color: 'purple',
    description: 'Data analysis, reporting, and insights'
  },
  'design': { 
    name: 'Design', 
    icon: '🎨', 
    color: 'pink',
    description: 'Design tools, prototyping, and creative workflows'
  },
  'development': { 
    name: 'Development', 
    icon: '👨‍💻', 
    color: 'gray',
    description: 'Code editors, CI/CD, and developer tools'
  },
  'ai-ml': { 
    name: 'AI & Machine Learning', 
    icon: '🤖', 
    color: 'indigo',
    description: 'AI-powered assistants and machine learning tools'
  },
  'security': { 
    name: 'Security', 
    icon: '🔒', 
    color: 'red',
    description: 'Security, compliance, and access control'
  },
}

const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
  green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
  pink: { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200' },
  gray: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
  red: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
}

export default function CategoryPage() {
  const params = useParams()
  const categorySlug = params.slug as string
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('popular')

  const info = categoryInfo[categorySlug] || { 
    name: 'Category', 
    icon: '📦', 
    color: 'gray',
    description: 'Browse apps in this category'
  }
  const colors = colorClasses[info.color] || colorClasses.gray

  useEffect(() => {
    async function fetchApps() {
      setLoading(true)
      const res = await appsApi.list({ category: categorySlug })
      if (res.success && res.data) {
        let sorted = [...res.data]
        if (sortBy === 'popular') {
          sorted.sort((a, b) => b.downloads - a.downloads)
        } else if (sortBy === 'rating') {
          sorted.sort((a, b) => b.rating - a.rating)
        } else if (sortBy === 'name') {
          sorted.sort((a, b) => a.name.localeCompare(b.name))
        }
        setApps(sorted)
      }
      setLoading(false)
    }
    fetchApps()
  }, [categorySlug, sortBy])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className={`${colors.bg} border-b ${colors.border}`}>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-gray-700">Marketplace</Link>
            <span>/</span>
            <span className={colors.text}>{info.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center text-4xl border ${colors.border}`}>
              {info.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{info.name}</h1>
              <p className="text-gray-600 mt-1">{info.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-gray-500">{apps.length} apps</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : apps.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No apps in this category yet</h2>
            <p className="text-gray-500 mb-6">Check back soon for new additions.</p>
            <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Browse All Apps
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map(app => (
              <Link
                key={app.id}
                href={`/apps/${app.id}`}
                className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center text-2xl`}>
                    {app.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 truncate">{app.name}</h3>
                      {app.verified && (
                        <span className="text-blue-500 text-sm">✓</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">{app.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t text-sm">
                  <span className="flex items-center gap-1 text-yellow-500">
                    <span>★</span>
                    <span className="text-gray-700">{app.rating}</span>
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500">{(app.downloads / 1000).toFixed(1)}k downloads</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Other Categories */}
        <div className="mt-16">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Explore Other Categories</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {Object.entries(categoryInfo)
              .filter(([slug]) => slug !== categorySlug)
              .slice(0, 4)
              .map(([slug, cat]) => {
                const catColors = colorClasses[cat.color] || colorClasses.gray
                return (
                  <Link
                    key={slug}
                    href={`/category/${slug}`}
                    className={`${catColors.bg} rounded-xl p-4 hover:shadow-md transition-shadow`}
                  >
                    <div className="text-2xl mb-2">{cat.icon}</div>
                    <div className={`font-medium ${catColors.text}`}>{cat.name}</div>
                  </Link>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}