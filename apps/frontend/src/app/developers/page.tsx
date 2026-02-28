'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { appsApi } from '@/lib/api'

interface App {
  id: string
  name: string
  developer?: string
  verified?: boolean
  rating: number
  downloads: number
}

interface Developer {
  name: string
  apps: App[]
  totalDownloads: number
  avgRating: number
  verified: boolean
}

export default function DevelopersPage() {
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDevelopers() {
      setLoading(true)
      const res = await appsApi.list()
      if (res.success && res.data) {
        // Group apps by developer
        const devMap = new Map<string, App[]>()
        res.data.forEach((app: App) => {
          const dev = app.developer || 'Unknown'
          if (!devMap.has(dev)) devMap.set(dev, [])
          devMap.get(dev)!.push(app)
        })

        // Convert to developer list
        const devList: Developer[] = []
        devMap.forEach((apps, name) => {
          const totalDownloads = apps.reduce((sum, app) => sum + app.downloads, 0)
          const avgRating = apps.reduce((sum, app) => sum + app.rating, 0) / apps.length
          const verified = apps.some(app => app.verified)
          devList.push({ name, apps, totalDownloads, avgRating, verified })
        })

        // Sort by downloads
        devList.sort((a, b) => b.totalDownloads - a.totalDownloads)
        setDevelopers(devList)
      }
      setLoading(false)
    }
    fetchDevelopers()
  }, [])

  const getDeveloperInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getDeveloperColor = (name: string) => {
    const colors = [
      'from-blue-500 to-indigo-500',
      'from-green-500 to-emerald-500',
      'from-purple-500 to-pink-500',
      'from-orange-500 to-red-500',
      'from-cyan-500 to-blue-500',
    ]
    const index = name.length % colors.length
    return colors[index]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Developers</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Meet the talented teams building amazing apps for ONES Marketplace
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-xl border p-6 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{developers.length}</div>
                <div className="text-gray-500">Active Developers</div>
              </div>
              <div className="bg-white rounded-xl border p-6 text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {developers.filter(d => d.verified).length}
                </div>
                <div className="text-gray-500">Verified Partners</div>
              </div>
              <div className="bg-white rounded-xl border p-6 text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {developers.reduce((sum, d) => sum + d.apps.length, 0)}
                </div>
                <div className="text-gray-500">Total Apps</div>
              </div>
            </div>

            {/* Developer Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {developers.map(developer => (
                <div
                  key={developer.name}
                  className="bg-white rounded-2xl border p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${getDeveloperColor(developer.name)} rounded-xl flex items-center justify-center text-white font-bold text-lg`}>
                      {getDeveloperInitials(developer.name)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{developer.name}</h3>
                        {developer.verified && (
                          <span className="text-blue-500" title="Verified">✓</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{developer.apps.length} apps</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="font-medium">{developer.avgRating.toFixed(1)}</span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500">
                      {(developer.totalDownloads / 1000).toFixed(1)}k downloads
                    </span>
                  </div>

                  <div className="space-y-2">
                    {developer.apps.slice(0, 3).map(app => (
                      <Link
                        key={app.id}
                        href={`/apps/${app.id}`}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
                      >
                        <span className="text-sm text-gray-700">{app.name}</span>
                        <span className="text-xs text-gray-400">★ {app.rating}</span>
                      </Link>
                    ))}
                    {developer.apps.length > 3 && (
                      <p className="text-xs text-gray-400 text-center">
                        +{developer.apps.length - 3} more apps
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-4">Become a Developer</h2>
              <p className="text-blue-100 mb-6 max-w-xl mx-auto">
                Join our developer community and reach thousands of teams using ONES
              </p>
              <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50">
                Start Building
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}