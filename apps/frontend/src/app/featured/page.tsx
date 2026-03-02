'use client'

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
  featured?: boolean
  verified?: boolean
}

export default function FeaturedPage() {
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchApps() {
      setLoading(true)
      const res = await appsApi.list()
      if (res.success && res.data) {
        setApps(res.data.filter((app: App) => app.featured))
      }
      setLoading(false)
    }
    fetchApps()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm mb-6">
            <span>⭐</span>
            <span>Curated Collection</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Featured Apps</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Hand-picked by our team for exceptional quality and value
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : apps.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No featured apps yet</h2>
            <p className="text-gray-500">Check back soon for our curated selection.</p>
          </div>
        ) : (
          <>
            {/* Featured Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {apps.map((app, index) => (
                <Link
                  key={app.id}
                  href={`/apps/${app.id}`}
                  className={`bg-white rounded-2xl border p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                    index === 0 ? 'md:col-span-2 lg:col-span-1' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center text-3xl">
                      {app.icon}
                    </div>
                    {app.verified && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{app.name}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{app.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-yellow-500">
                        <span>★</span>
                        <span className="text-gray-700">{app.rating}</span>
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500">{(app.downloads / 1000).toFixed(1)}k downloads</span>
                    </div>
                    <span className="text-blue-600 text-sm font-medium">View →</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Stats */}
            <div className="bg-white rounded-2xl border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Featured Apps?</h2>
              <div className="grid md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3">
                    🔍
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Quality Reviewed</h3>
                  <p className="text-sm text-gray-500">Every app is tested by our team</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3">
                    🛡️
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Security First</h3>
                  <p className="text-sm text-gray-500">Verified for data safety</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3">
                    ⚡
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">High Performance</h3>
                  <p className="text-sm text-gray-500">Optimized for speed</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3">
                    💬
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Great Support</h3>
                  <p className="text-sm text-gray-500">Responsive developer teams</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}