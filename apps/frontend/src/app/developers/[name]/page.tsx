'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { appsApi } from '@/lib/api'
import Loading from '@/components/Loading'
import EmptyState from '@/components/EmptyState'

interface App {
  id: string
  name: string
  description: string
  icon: string
  category: string
  rating: number
  downloads: number
  developer?: string
  verified?: boolean
}

export default function DeveloperPage() {
  const params = useParams()
  const developerName = decodeURIComponent(params.name as string)
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchApps() {
      setLoading(true)
      const res = await appsApi.list()
      if (res.success && res.data) {
        const devApps = res.data.filter(
          (app: App) => app.developer === developerName
        )
        setApps(devApps)
      }
      setLoading(false)
    }
    fetchApps()
  }, [developerName])

  const totalDownloads = apps.reduce((sum, app) => sum + app.downloads, 0)
  const avgRating = apps.length > 0
    ? (apps.reduce((sum, app) => sum + app.rating, 0) / apps.length).toFixed(1)
    : '0.0'

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getColor = (name: string) => {
    const colors = [
      'from-blue-500 to-indigo-500',
      'from-green-500 to-emerald-500',
      'from-purple-500 to-pink-500',
      'from-orange-500 to-red-500',
      'from-cyan-500 to-blue-500',
    ]
    return colors[name.length % colors.length]
  }

  if (loading) {
    return <Loading />
  }

  if (apps.length === 0) {
    return (
      <EmptyState
        icon="👨‍💻"
        title="Developer not found"
        description="This developer hasn't published any apps yet."
        action={{ label: 'Browse Developers', href: '/developers' }}
      />
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Developer Header */}
      <div className="bg-white rounded-2xl border p-8 mb-8">
        <div className="flex items-center gap-6">
          <div className={`w-20 h-20 bg-gradient-to-br ${getColor(developerName)} rounded-2xl flex items-center justify-center text-white text-2xl font-bold`}>
            {getInitials(developerName)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{developerName}</h1>
            <p className="text-gray-500 mt-1">{apps.length} app{apps.length !== 1 ? 's' : ''} published</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{apps.length}</div>
            <div className="text-gray-500 text-sm">Apps</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{(totalDownloads / 1000).toFixed(1)}k</div>
            <div className="text-gray-500 text-sm">Downloads</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-500">★ {avgRating}</div>
            <div className="text-gray-500 text-sm">Avg Rating</div>
          </div>
        </div>
      </div>

      {/* Apps Grid */}
      <h2 className="text-xl font-bold text-gray-900 mb-6">Apps by {developerName}</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map(app => (
          <Link
            key={app.id}
            href={`/apps/${app.id}`}
            className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-3xl">
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
            <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
              <span className="flex items-center gap-1 text-yellow-500">
                ★ {app.rating}
              </span>
              <span className="text-gray-500">
                {(app.downloads / 1000).toFixed(1)}k downloads
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Back Link */}
      <div className="mt-8">
        <Link href="/developers" className="text-blue-600 hover:underline">
          ← Back to Developers
        </Link>
      </div>
    </div>
  )
}