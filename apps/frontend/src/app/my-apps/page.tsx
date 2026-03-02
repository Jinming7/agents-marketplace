'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { userApi, appsApi } from '@/lib/api'

interface App {
  id: string
  name: string
  description: string
  icon: string
  category: string
  rating: number
  downloads: number
}

interface Installation {
  appId: string
  installedAt: string
}

export default function MyAppsPage() {
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }
    setIsLoggedIn(true)
    fetchInstallations()
  }, [])

  const fetchInstallations = async () => {
    setLoading(true)
    const installRes = await userApi.getInstallations()
    if (installRes.success && installRes.data) {
      const appIds = installRes.data.map((i: Installation) => i.appId)
      const appsRes = await appsApi.list()
      if (appsRes.success && appsRes.data) {
        const installedApps = appsRes.data.filter((app: App) => appIds.includes(app.id))
        setApps(installedApps)
      }
    }
    setLoading(false)
  }

  const handleUninstall = async (appId: string) => {
    const res = await userApi.uninstallApp(appId)
    if (res.success) {
      setApps(apps.filter(app => app.id !== appId))
    }
  }

  if (!isLoggedIn && !loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign in to view your apps</h1>
          <p className="text-gray-500 mb-6">You need to be signed in to see your installed apps.</p>
          <Link href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Apps</h1>
          <p className="text-gray-500 mt-1">Manage your installed applications</p>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          {apps.length} installed
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : apps.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No apps installed yet</h2>
          <p className="text-gray-500 mb-6">Browse the marketplace to find apps for your team.</p>
          <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {apps.map(app => (
            <div key={app.id} className="bg-white rounded-xl border p-6 flex items-center justify-between hover:shadow-md transition-shadow">
              <Link href={`/apps/${app.id}`} className="flex items-center gap-4 flex-1">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center text-2xl">
                  {app.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{app.name}</h3>
                  <p className="text-sm text-gray-500">{app.category}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-yellow-500 text-sm">★ {app.rating}</span>
                    <span className="text-gray-400 text-sm">•</span>
                    <span className="text-gray-500 text-sm">{(app.downloads / 1000).toFixed(1)}k downloads</span>
                  </div>
                </div>
              </Link>
              <div className="flex items-center gap-3">
                <Link
                  href={`/apps/${app.id}`}
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleUninstall(app.id)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Uninstall
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}