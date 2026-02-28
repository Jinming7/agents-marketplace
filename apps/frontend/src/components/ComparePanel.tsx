'use client'

import { useState } from 'react'
import Link from 'next/link'

interface App {
  id: string
  name: string
  icon: string
  rating: number
  downloads: number
  category: string
  pricing?: { type: string; price?: number }
}

interface ComparePanelProps {
  apps: App[]
  onRemove: (id: string) => void
}

export default function ComparePanel({ apps, onRemove }: ComparePanelProps) {
  if (apps.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-500">
              Compare ({apps.length}/4):
            </span>
            <div className="flex gap-2">
              {apps.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center gap-2 bg-gray-100 rounded-full pl-1 pr-3 py-1"
                >
                  <span className="text-lg">{app.icon}</span>
                  <span className="text-sm font-medium">{app.name}</span>
                  <button
                    onClick={() => onRemove(app.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onRemove(apps[0]?.id)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Clear All
            </button>
            <button
              disabled={apps.length < 2}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Compare Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CompareTable({ apps }: { apps: App[] }) {
  if (apps.length < 2) return null

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4 font-medium text-gray-500">Feature</th>
            {apps.map((app) => (
              <th key={app.id} className="p-4 text-center">
                <Link href={`/apps/${app.id}`} className="block">
                  <div className="text-3xl mb-2">{app.icon}</div>
                  <div className="font-semibold">{app.name}</div>
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="p-4 text-gray-500">Rating</td>
            {apps.map((app) => (
              <td key={app.id} className="p-4 text-center">
                <span className="text-yellow-500">★</span> {app.rating}
              </td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="p-4 text-gray-500">Downloads</td>
            {apps.map((app) => (
              <td key={app.id} className="p-4 text-center">
                {(app.downloads / 1000).toFixed(1)}k
              </td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="p-4 text-gray-500">Category</td>
            {apps.map((app) => (
              <td key={app.id} className="p-4 text-center text-sm">
                {app.category}
              </td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="p-4 text-gray-500">Pricing</td>
            {apps.map((app) => (
              <td key={app.id} className="p-4 text-center">
                {app.pricing?.type === 'free' ? (
                  <span className="text-green-600 font-medium">Free</span>
                ) : app.pricing?.price ? (
                  <span>${app.pricing.price}/mo</span>
                ) : (
                  <span className="text-gray-500">Contact</span>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}