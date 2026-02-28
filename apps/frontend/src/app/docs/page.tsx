'use client'

import { useState } from 'react'
import Link from 'next/link'

const docSections = [
  {
    title: 'Getting Started',
    icon: '🚀',
    articles: [
      { title: 'Quick Start Guide', time: '5 min read', slug: 'quick-start' },
      { title: 'Account Setup', time: '3 min read', slug: 'account-setup' },
      { title: 'Installing Your First App', time: '4 min read', slug: 'first-app' },
      { title: 'Understanding Permissions', time: '6 min read', slug: 'permissions' },
    ],
  },
  {
    title: 'Managing Apps',
    icon: '📦',
    articles: [
      { title: 'App Installation', time: '5 min read', slug: 'app-install' },
      { title: 'Configuration & Settings', time: '8 min read', slug: 'app-config' },
      { title: 'Updating Apps', time: '3 min read', slug: 'app-updates' },
      { title: 'Uninstalling Apps', time: '2 min read', slug: 'app-uninstall' },
    ],
  },
  {
    title: 'User Management',
    icon: '👥',
    articles: [
      { title: 'Team Management', time: '7 min read', slug: 'team-management' },
      { title: 'Role-Based Access', time: '6 min read', slug: 'rbac' },
      { title: 'SSO Configuration', time: '10 min read', slug: 'sso' },
      { title: 'Audit Logs', time: '4 min read', slug: 'audit-logs' },
    ],
  },
  {
    title: 'Billing & Plans',
    icon: '💳',
    articles: [
      { title: 'Pricing Overview', time: '3 min read', slug: 'pricing' },
      { title: 'Upgrading Your Plan', time: '4 min read', slug: 'upgrade' },
      { title: 'Payment Methods', time: '3 min read', slug: 'payment' },
      { title: 'Invoices & Receipts', time: '2 min read', slug: 'invoices' },
    ],
  },
  {
    title: 'Developer Resources',
    icon: '👨‍💻',
    articles: [
      { title: 'API Documentation', time: '15 min read', slug: 'api-docs' },
      { title: 'SDK Reference', time: '12 min read', slug: 'sdk' },
      { title: 'Webhooks', time: '8 min read', slug: 'webhooks' },
      { title: 'Publishing Your App', time: '10 min read', slug: 'publishing' },
    ],
  },
  {
    title: 'Security & Compliance',
    icon: '🔒',
    articles: [
      { title: 'Security Overview', time: '8 min read', slug: 'security' },
      { title: 'Data Privacy', time: '6 min read', slug: 'privacy' },
      { title: 'SOC 2 Compliance', time: '5 min read', slug: 'soc2' },
      { title: 'GDPR Guidelines', time: '7 min read', slug: 'gdpr' },
    ],
  },
]

const popularArticles = [
  { title: 'How to install an app', views: '12.5k', category: 'Getting Started' },
  { title: 'Troubleshooting installation errors', views: '8.2k', category: 'Managing Apps' },
  { title: 'Setting up SSO', views: '6.8k', category: 'User Management' },
  { title: 'API rate limits', views: '5.4k', category: 'Developer Resources' },
]

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSection, setExpandedSection] = useState<string | null>('Getting Started')

  const filteredSections = docSections.map(section => ({
    ...section,
    articles: section.articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(section => section.articles.length > 0 || !searchQuery)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Documentation</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Everything you need to know about using ONES Marketplace
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documentation..."
              className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border p-4 sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4">Contents</h3>
              <nav className="space-y-1">
                {docSections.map(section => (
                  <button
                    key={section.title}
                    onClick={() => setExpandedSection(
                      expandedSection === section.title ? null : section.title
                    )}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                      expandedSection === section.title
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{section.icon}</span>
                    <span>{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Popular Articles */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Articles</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {popularArticles.map((article, i) => (
                  <a
                    key={i}
                    href="#"
                    className="bg-white rounded-xl border p-4 hover:shadow-md transition-shadow flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">{article.title}</h3>
                      <p className="text-sm text-gray-500">{article.category}</p>
                    </div>
                    <span className="text-xs text-gray-400">{article.views} views</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Doc Sections */}
            <div className="space-y-8">
              {filteredSections.map(section => (
                <div key={section.title} className="bg-white rounded-xl border overflow-hidden">
                  <button
                    onClick={() => setExpandedSection(
                      expandedSection === section.title ? null : section.title
                    )}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{section.icon}</span>
                      <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                    </div>
                    <span className={`transform transition-transform ${
                      expandedSection === section.title ? 'rotate-180' : ''
                    }`}>
                      ▼
                    </span>
                  </button>

                  {expandedSection === section.title && (
                    <div className="px-6 pb-4">
                      <div className="grid md:grid-cols-2 gap-3">
                        {section.articles.map(article => (
                          <a
                            key={article.slug}
                            href="#"
                            className="p-4 rounded-lg border hover:bg-blue-50 hover:border-blue-200 transition-colors"
                          >
                            <h3 className="font-medium text-gray-900 mb-1">{article.title}</h3>
                            <p className="text-sm text-gray-500">{article.time}</p>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Help CTA */}
            <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
              <p className="text-blue-100 mb-6">
                Our support team is here to help you with any questions.
              </p>
              <Link
                href="/support"
                className="inline-block px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}