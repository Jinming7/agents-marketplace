'use client'

import Link from 'next/link'
import { useState } from 'react'

interface AppCardProps {
  id: string
  name: string
  description: string
  icon: string
  category: string
  rating: number
  downloads: number
  verified?: boolean
  featured?: boolean
  onInstall?: (id: string) => void
  onWishlist?: (id: string) => void
  isInstalled?: boolean
  isWishlisted?: boolean
}

export default function AppCard({
  id,
  name,
  description,
  icon,
  category,
  rating,
  downloads,
  verified = false,
  featured = false,
  onInstall,
  onWishlist,
  isInstalled = false,
  isWishlisted = false,
}: AppCardProps) {
  const [showActions, setShowActions] = useState(false)

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 flex gap-2">
        {featured && (
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            ✨ Featured
          </span>
        )}
        {verified && (
          <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            ✓ Verified
          </span>
        )}
      </div>

      {/* Quick Actions */}
      {showActions && (
        <div className="absolute top-3 right-3 flex gap-2 animate-fade-in">
          {onWishlist && (
            <button
              onClick={(e) => {
                e.preventDefault()
                onWishlist(id)
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                isWishlisted
                  ? 'bg-pink-100 text-pink-600'
                  : 'bg-gray-100 text-gray-400 hover:bg-pink-50 hover:text-pink-500'
              }`}
              title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isWishlisted ? '❤️' : '🤍'}
            </button>
          )}
        </div>
      )}
      
      <Link href={`/apps/${id}`} className="block">
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center text-3xl border border-gray-100 group-hover:scale-105 transition-transform">
              {icon}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
              {name}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2 mt-1">{description}</p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
              {category}
            </span>
            <div className="flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="font-medium text-gray-700">{rating.toFixed(1)}</span>
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500">
                {(downloads / 1000).toFixed(1)}k
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Install Button */}
      {onInstall && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={(e) => {
              e.preventDefault()
              onInstall(id)
            }}
            className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
              isInstalled
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isInstalled ? 'Installed ✓' : 'Install'}
          </button>
        </div>
      )}
    </div>
  )
}