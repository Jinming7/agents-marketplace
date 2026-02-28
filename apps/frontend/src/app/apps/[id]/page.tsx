'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

const apps = [
  { id: '1', name: 'Project Management Plus', description: 'Add Gantt charts, Kanban boards to your ONES projects', category: 'Project Management', installs: 12500, rating: 4.8, icon: '📊' },
  { id: '2', name: 'Workflow Automator', description: 'Create custom automation rules to boost team efficiency', category: 'Automation', installs: 8900, rating: 4.6, icon: '⚡' },
  { id: '3', name: 'Git Integration', description: 'Connect GitHub, GitLab for code-project sync', category: 'Development Tools', installs: 6700, rating: 4.9, icon: '🔗' },
  { id: '4', name: 'Team Collaboration', description: 'Real-time collaboration, comments, @mentions', category: 'Collaboration', installs: 15200, rating: 4.7, icon: '👥' },
  { id: '5', name: 'Data Reports', description: 'Visual reports, custom dashboards, data export', category: 'Reports', installs: 9800, rating: 4.5, icon: '📈' },
  { id: '6', name: 'Security Audit', description: 'Operation logs, permission audit, security alerts', category: 'Security', installs: 4500, rating: 4.8, icon: '🔒' },
]

export default function AppDetailPage() {
  const params = useParams()
  const [tab, setTab] = useState('overview')
  const app = apps.find(a => a.id === params.id)

  if (!app) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">App not found</h1>
          <Link href="/" className="text-blue-600 hover:underline">Back to Marketplace</Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/" className="text-blue-600 hover:underline">← Back to Marketplace</Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl border p-8">
          <div className="flex items-start gap-6 mb-6">
            <span className="text-6xl">{app.icon}</span>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{app.name}</h1>
              <p className="text-gray-500 mt-1">{app.category}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1">
                  <span className="text-yellow-400">⭐</span> {app.rating}
                </span>
                <span className="text-gray-500">{(app.installs / 1000).toFixed(1)}K installs</span>
              </div>
            </div>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Install
            </button>
          </div>

          <p className="text-gray-600 text-lg mb-8">{app.description}</p>

          <div className="border-b mb-6">
            <div className="flex gap-4">
              {['overview', 'reviews', 'pricing', 'installation'].map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-3 border-b-2 capitalize ${
                    tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="py-4">
            {tab === 'overview' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">About this app</h2>
                <p className="text-gray-600">{app.description}</p>
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Key Features</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Seamless integration with ONES platform</li>
                    <li>Real-time data synchronization</li>
                    <li>Customizable workflows</li>
                    <li>Enterprise-grade security</li>
                  </ul>
                </div>
              </div>
            )}
            {tab === 'reviews' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">User Reviews</h2>
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">John D.</span>
                      <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
                    </div>
                    <p className="text-gray-600">Great app! Really improves our team productivity.</p>
                  </div>
                  <div className="border-b pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">Sarah M.</span>
                      <span className="text-yellow-400">⭐⭐⭐⭐</span>
                    </div>
                    <p className="text-gray-600">Very useful, would recommend to others.</p>
                  </div>
                </div>
              </div>
            )}
            {tab === 'pricing' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Pricing Plans</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div className="border rounded-lg p-6">
                    <h3 className="font-semibold text-lg">Free</h3>
                    <p className="text-3xl font-bold my-4">$0</p>
                    <ul className="text-gray-600 space-y-2">
                      <li>✓ Basic features</li>
                      <li>✓ Up to 5 users</li>
                      <li>✓ Community support</li>
                    </ul>
                  </div>
                  <div className="border-2 border-blue-600 rounded-lg p-6">
                    <h3 className="font-semibold text-lg">Pro</h3>
                    <p className="text-3xl font-bold my-4">$9.99<span className="text-sm text-gray-500">/mo</span></p>
                    <ul className="text-gray-600 space-y-2">
                      <li>✓ All features</li>
                      <li>✓ Unlimited users</li>
                      <li>✓ Priority support</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            {tab === 'installation' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Installation Guide</h2>
                <ol className="list-decimal list-inside space-y-4 text-gray-600">
                  <li>Click the Install button above</li>
                  <li>Choose your ONES workspace</li>
                  <li>Configure app settings</li>
                  <li>Start using the app!</li>
                </ol>
                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-500">Requirements: ONES Project or ONES Wiki</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}