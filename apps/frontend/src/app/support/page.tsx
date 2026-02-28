'use client'

import { useState } from 'react'

const supportCategories = [
  { id: 'technical', name: 'Technical Issue', icon: '🔧' },
  { id: 'billing', name: 'Billing Question', icon: '💳' },
  { id: 'feature', name: 'Feature Request', icon: '💡' },
  { id: 'other', name: 'Other', icon: '📝' },
]

const helpTopics = [
  {
    title: 'Getting Started',
    icon: '🚀',
    articles: ['Quick Start Guide', 'Installation Help', 'Account Setup'],
  },
  {
    title: 'Troubleshooting',
    icon: '🔍',
    articles: ['Common Issues', 'Error Codes', 'Performance Tips'],
  },
  {
    title: 'Account & Billing',
    icon: '💳',
    articles: ['Manage Subscription', 'Payment Methods', 'Invoices'],
  },
  {
    title: 'Developer Resources',
    icon: '👨‍💻',
    articles: ['API Documentation', 'SDK Reference', 'Integration Guides'],
  },
]

export default function SupportPage() {
  const [category, setCategory] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
            ✓
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Message Sent!</h1>
          <p className="text-gray-500 mb-6">
            We've received your message and will get back to you within 24 hours.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Send Another Message
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How Can We Help?</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Get support from our team or browse our help center
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Help Topics */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {helpTopics.map(topic => (
            <div key={topic.title} className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">{topic.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-3">{topic.title}</h3>
              <ul className="space-y-2">
                {topic.articles.map(article => (
                  <li key={article}>
                    <a href="#" className="text-sm text-blue-600 hover:underline">{article}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Support</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="grid grid-cols-2 gap-3">
                  {supportCategories.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-4 border rounded-lg text-left flex items-center gap-3 transition-colors ${
                        category === cat.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <span className="text-sm font-medium">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  placeholder="Please provide as much detail as possible..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !category}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Alternative Contact */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border p-6 text-center">
              <div className="text-3xl mb-3">📧</div>
              <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-sm text-gray-500 mb-3">For general inquiries</p>
              <a href="mailto:support@ones.com" className="text-blue-600 hover:underline">
                support@ones.com
              </a>
            </div>
            <div className="bg-white rounded-xl border p-6 text-center">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-sm text-gray-500 mb-3">Available Mon-Fri, 9am-6pm</p>
              <button className="text-blue-600 hover:underline">Start Chat</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}