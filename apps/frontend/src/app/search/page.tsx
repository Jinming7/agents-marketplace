'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect, Suspense } from 'react'
import { appsApi } from '@/lib/api'
import Loading, { AppGridSkeleton } from '@/components/Loading'
import EmptyState from '@/components/EmptyState'

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

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('relevance')

  useEffect(() => {
    async function searchApps() {
      if (!query) {
        setApps([])
        setLoading(false)
        return
      }
      
      setLoading(true)
      const res = await appsApi.list({ search: query })
      if (res.success && res.data) {
        let sorted = [...res.data]
        if (sortBy === 'rating') {
          sorted.sort((a, b) => b.rating - a.rating)
        } else if (sortBy === 'downloads') {
          sorted.sort((a, b) => b.downloads - a.downloads)
        } else if (sortBy === 'name') {
          sorted.sort((a, b) => a.name.localeCompare(b.name))
        }
        setApps(sorted)
      }
      setLoading(false)
    }
    searchApps()
  }, [query, sortBy])

  if (!query) {
    return (
      <EmptyState
        icon="🔍"
        title="Search for apps"
        description="Enter a search term to find apps"
      />
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Search results for "{query}"
          </h1>
          <p className="text-gray-500 mt-1">
            {apps.length} app{apps.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="relevance">Relevance</option>
            <option value="rating">Rating</option>
            <option value="downloads">Downloads</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <AppGridSkeleton count={8} />
      ) : apps.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No apps found"
          description={`We couldn't find any apps matching "${query}". Try a different search term.`}
          action={{ label: 'Browse All Apps', href: '/' }}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {apps.map(app => (
            <Link
              key={app.id}
              href={`/apps/${app.id}`}
              className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                  {app.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{app.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">{app.description}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
                <span className="text-gray-500">{app.category}</span>
                <span className="flex items-center gap-1 text-yellow-500">
                  ★ {app.rating}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Suspense fallback={<Loading />}>
        <SearchContent />
      </Suspense>
    </div>
  )
}