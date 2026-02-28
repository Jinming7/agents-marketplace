'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { appsApi } from '@/lib/api'

interface App {
  id: string
  name: string
  description: string
  shortDescription?: string
  longDescription?: string
  category: string
  downloads: number
  rating: number
  reviews?: number
  icon: string
  verified?: boolean
  developer?: string
  features?: string[]
  screenshots?: string[]
  pricing?: { type: string; price?: number }
}

interface Review {
  id: number
  author: string
  avatar: string
  rating: number
  date: string
  content: string
}

export default function AppDetailPage() {
  const params = useParams()
  const [app, setApp] = useState<App | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [relatedApps, setRelatedApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('overview')
  const [isInstalling, setIsInstalling] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const [appRes, reviewsRes, allAppsRes] = await Promise.all([
        appsApi.get(params.id as string),
        appsApi.getReviews(params.id as string),
        appsApi.list()
      ])
      if (appRes.success && appRes.data) setApp(appRes.data)
      if (reviewsRes.success && reviewsRes.data) setReviews(reviewsRes.data)
      if (allAppsRes.success && allAppsRes.data && appRes.data) {
        setRelatedApps(allAppsRes.data.filter((a: App) => a.id !== params.id && a.category === appRes.data?.category).slice(0, 3))
      }
      setLoading(false)
    }
    if (params.id) fetchData()
  }, [params.id])
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  if (!app) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">App not found</h1>
          <Link href="/" className="text-blue-600 hover:underline">← Back to Marketplace</Link>
        </div>
      </div>
    )
  }

  const handleInstall = () => {
    setIsInstalling(true)
    setTimeout(() => setIsInstalling(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">O</span>
              </div>
              <span className="text-xl font-bold text-gray-900">ONES Marketplace</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Marketplace</Link>
              <Link href="/my-apps" className="text-gray-600 hover:text-gray-900">My Apps</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
            <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Sign Up</Link>
          </div>
        </div>
      </header>

      {/* App Hero */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 py-12 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-start gap-8">
            {/* Icon */}
            <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center text-5xl border border-gray-100">
              {app.icon}
            </div>
            
            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-3xl font-bold text-gray-900">{app.name}</h1>
                {app.verified && (
                  <>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                      ✓ Verified
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full flex items-center gap-1">
                      🔒 Security Reviewed
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full flex items-center gap-1">
                      ☁️ Cloud Ready
                    </span>
                  </>
                )}
              </div>
              <p className="text-gray-500 mb-4">{app.category} • by {app.developer}</p>
              <div className="flex items-center gap-6 text-sm">
                <span className="flex items-center gap-1 text-yellow-500">
                  <span className="text-lg">★★★★★</span>
                  <span className="text-gray-700 font-medium">{app.rating}</span>
                </span>
                <span className="text-gray-500">{app.reviews || 0} reviews</span>
                <span className="text-gray-500">{(app.downloads/1000).toFixed(1)}K downloads</span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleInstall}
                disabled={isInstalling}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
              >
                {isInstalling ? 'Installing...' : 'Install'}
              </button>
              <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                Try Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Screenshots */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Screenshots</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border border-gray-200">
              <div className="text-center">
                <div className="text-4xl mb-2">🖼️</div>
                <span className="text-gray-500">Screenshot {i}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="border-b border-gray-200">
          <div className="flex gap-8">
            {['overview', 'features', 'pricing', 'reviews', 'installation'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-1 py-4 text-sm font-medium capitalize border-b-2 transition-colors ${
                  tab === t
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {tab === 'overview' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About this app</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">{app.longDescription || app.description}</p>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                <div className="grid grid-cols-2 gap-4">
                  {app.features?.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                        ✓
                      </div>
                      <span className="font-medium text-gray-900">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'features' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Features</h2>
                <div className="space-y-4">
                  {app.features?.map((feature, i) => (
                    <div key={i} className="p-6 bg-white rounded-xl border border-gray-200">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white text-xl">
                          {['🚀', '⚡', '🔗', '📊'][i % 4]}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{feature}</h3>
                          <p className="text-sm text-gray-500">Enhanced functionality for your workflow</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'pricing' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Pricing Plans</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-white rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Free</h3>
                    <p className="text-3xl font-bold text-gray-900 mb-4">$0<span className="text-sm font-normal text-gray-500">/month</span></p>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center gap-2 text-sm text-gray-600"><span className="text-green-500">✓</span> Basic features</li>
                      <li className="flex items-center gap-2 text-sm text-gray-600"><span className="text-green-500">✓</span> Up to 5 users</li>
                      <li className="flex items-center gap-2 text-sm text-gray-600"><span className="text-green-500">✓</span> Community support</li>
                      <li className="flex items-center gap-2 text-sm text-gray-400"><span>✗</span> Advanced features</li>
                    </ul>
                    <button className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Get Started</button>
                  </div>
                  
                  <div className="p-6 bg-white rounded-xl border-2 border-blue-600 relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                      RECOMMENDED
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Pro</h3>
                    <p className="text-3xl font-bold text-gray-900 mb-4">$29<span className="text-sm font-normal text-gray-500">/month</span></p>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center gap-2 text-sm text-gray-600"><span className="text-green-500">✓</span> All features</li>
                      <li className="flex items-center gap-2 text-sm text-gray-600"><span className="text-green-500">✓</span> Up to 50 users</li>
                      <li className="flex items-center gap-2 text-sm text-gray-600"><span className="text-green-500">✓</span> Priority support</li>
                      <li className="flex items-center gap-2 text-sm text-gray-600"><span className="text-green-500">✓</span> Custom integrations</li>
                    </ul>
                    <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Choose Plan</button>
                  </div>
                  
                  <div className="p-6 bg-white rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Enterprise</h3>
                    <p className="text-3xl font-bold text-gray-900 mb-4">Custom</p>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center gap-2 text-sm text-gray-600"><span className="text-green-500">✓</span> Everything in Pro</li>
                      <li className="flex items-center gap-2 text-sm text-gray-600"><span className="text-green-500">✓</span> Unlimited users</li>
                      <li className="flex items-center gap-2 text-sm text-gray-600"><span className="text-green-500">✓</span> Dedicated support</li>
                      <li className="flex items-center gap-2 text-sm text-gray-600"><span className="text-green-500">✓</span> SLA guarantee</li>
                    </ul>
                    <button className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Contact Sales</button>
                  </div>
                </div>
              </div>
            )}

            {tab === 'reviews' && (
              <div>
                <div className="flex items-start gap-8 mb-8">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900">{app.rating}</div>
                    <div className="text-yellow-500 text-lg mb-1">★★★★★</div>
                    <div className="text-sm text-gray-500">{app.reviews} reviews</div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 w-8">{stars}★</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : 10}%` }} />
                        </div>
                        <span className="text-sm text-gray-500 w-8">{stars === 5 ? '70%' : stars === 4 ? '20%' : '10%'}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-6 bg-white rounded-xl border border-gray-200">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                          {review.avatar}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{review.author}</div>
                          <div className="text-sm text-gray-500">{review.date}</div>
                        </div>
                        <div className="ml-auto text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</div>
                      </div>
                      <p className="text-gray-600">{review.content}</p>
                    </div>
                  ))}
                </div>
                
                <button className="mt-6 w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                  Write a Review
                </button>
              </div>
            )}

            {tab === 'installation' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Installation Guide</h2>
                <div className="space-y-4">
                  {[
                    { step: 1, title: 'Click Install', desc: 'Click the Install button at the top of this page' },
                    { step: 2, title: 'Choose Workspace', desc: 'Select your ONES workspace where you want to install the app' },
                    { step: 3, title: 'Configure Settings', desc: 'Customize the app settings according to your needs' },
                    { step: 4, title: 'Start Using', desc: 'The app is now ready! Start exploring its features' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Requirements</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2"><span className="text-blue-600">•</span> ONES platform v2.0 or higher</li>
                    <li className="flex items-center gap-2"><span className="text-blue-600">•</span> Admin permissions for installation</li>
                    <li className="flex items-center gap-2"><span className="text-blue-600">•</span> Active internet connection</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Developer Card */}
            <div className="p-6 bg-white rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Developer</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                  {app.developer?.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{app.developer}</div>
                  {app.verified && <div className="text-xs text-green-600">✓ Verified Developer</div>}
                </div>
              </div>
              <button className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                View Profile
              </button>
            </div>

            {/* Related Apps */}
            <div className="p-6 bg-white rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">You might also like</h3>
              <div className="space-y-4">
                {relatedApps.map((relatedApp) => (
                  <Link key={relatedApp.id} href={`/apps/${relatedApp.id}`} className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg -mx-2">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                      {relatedApp.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{relatedApp.name}</div>
                      <div className="text-xs text-gray-500">★ {relatedApp.rating}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Support */}
            <div className="p-6 bg-white rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <a href="#" className="flex items-center gap-2 text-blue-600 hover:underline text-sm">
                  📚 Documentation
                </a>
                <a href="#" className="flex items-center gap-2 text-blue-600 hover:underline text-sm">
                  💬 Support Forum
                </a>
                <a href="#" className="flex items-center gap-2 text-blue-600 hover:underline text-sm">
                  ✉️ Contact Developer
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">O</span>
              </div>
              <span className="font-bold text-white">ONES Marketplace</span>
            </div>
            <p className="text-sm text-gray-500">© 2024 ONES. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}