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

export default function WishlistPage() {
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
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    setLoading(true)
    const wishlistRes = await userApi.getWishlist()
    if (wishlistRes.success && wishlistRes.data) {
      const appIds = wishlistRes.data
      const appsRes = await appsApi.list()
      if (appsRes.success && appsRes.data) {
        const wishlistedApps = appsRes.data.filter((app: App) => appIds.includes(app.id))
        setApps(wishlistedApps)
      }
    }
    setLoading(false)
  }

  const handleRemove = async (appId: string) => {
    const res = await userApi.removeFromWishlist(appId)
    if (res.success) {
      setApps(apps.filter(app => app.id !== appId))
    }
  }

  const handleInstall = async (appId: string) => {
    const res = await userApi.installApp(appId)
    if (res.success) {
      // Remove from wishlist after install
      await userApi.removeFromWishlist(appId)
      setApps(apps.filter(app => app.id !== appId))
    }
  }

  if (!isLoggedIn && !loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign in to view your wishlist</h1>
          <p className="text-gray-500 mb-6">You need to be signed in to see your saved apps.</p>
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
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-500 mt-1">Apps you've saved for later</p>
        </div>
        <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
          {apps.length} saved
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : apps.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <div className="text-6xl mb-4">💕</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save apps you're interested in to view them here.</p>
          <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {apps.map(app => (
            <div key={app.id} className="bg-white rounded-xl border p-6 flex items-center justify-between hover:shadow-md transition-shadow">
              <Link href={`/apps/${app.id}`} className="flex items-center gap-4 flex-1">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl flex items-center justify-center text-2xl">
                  {app.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{app.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{app.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-yellow-500 text-sm">★ {app.rating}</span>
                    <span className="text-gray-400 text-sm">•</span>
                    <span className="text-gray-500 text-sm">{app.category}</span>
                  </div>
                </div>
              </Link>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleInstall(app.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Install
                </button>
                <button
                  onClick={() => handleRemove(app.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                  title="Remove from wishlist"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}