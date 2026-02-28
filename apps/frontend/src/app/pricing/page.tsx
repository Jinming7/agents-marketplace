'use client'

import Link from 'next/link'
import { useState } from 'react'

// Atlassian-style pricing: each app has its own pricing
// This page explains how pricing works on the marketplace

const pricingModels = [
  {
    type: 'Free',
    icon: '🆓',
    description: 'Free forever, no credit card required',
    features: [
      'Unlimited users',
      'Community support',
      'Basic features',
    ],
    color: 'green',
  },
  {
    type: 'Paid',
    icon: '💳',
    description: 'One-time purchase or subscription',
    features: [
      'Per-user pricing',
      'Vendor support',
      'All features included',
      'Free trial available',
    ],
    color: 'blue',
  },
  {
    type: 'Freemium',
    icon: '🎁',
    description: 'Free tier with premium upgrades',
    features: [
      'Free basic plan',
      'Paid premium features',
      'Upgrade anytime',
    ],
    color: 'purple',
  },
  {
    type: 'Enterprise',
    icon: '🏢',
    description: 'Custom pricing for large teams',
    features: [
      'Volume discounts',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantees',
    ],
    color: 'orange',
  },
]

const faqs = [
  {
    q: 'How does app pricing work?',
    a: 'Each app on ONES Marketplace sets its own pricing. You pay the app vendor directly for paid apps. Prices are typically based on the number of users or a flat monthly/yearly fee.',
  },
  {
    q: 'Are there any marketplace fees?',
    a: 'No, ONES Marketplace does not charge additional fees. You pay only the app price shown. Vendors handle their own billing and support.',
  },
  {
    q: 'Can I try paid apps before buying?',
    a: 'Most paid apps offer a free trial period (usually 30 days). You can evaluate the app with your team before making a purchase decision.',
  },
  {
    q: 'What payment methods are supported?',
    a: 'Payment methods vary by vendor. Most accept credit cards, and some support invoicing for enterprise customers. Check the app\'s pricing page for details.',
  },
  {
    q: 'How do refunds work?',
    a: 'Refund policies are set by each vendor. Most offer refunds within 30 days if the app doesn\'t meet your needs. Contact the vendor directly for refund requests.',
  },
  {
    q: 'Can I cancel my subscription?',
    a: 'Yes, you can cancel anytime. Your access continues until the end of the current billing period. Some vendors offer prorated refunds.',
  },
]

const popularApps = [
  { name: 'ProjectPro', price: '$5/user/mo', icon: '📊', category: 'Project Management' },
  { name: 'AutoFlow', price: 'Free', icon: '⚡', category: 'Automation' },
  { name: 'TeamChat Pro', price: '$3/user/mo', icon: '💬', category: 'Communication' },
  { name: 'Analytics Plus', price: '$10/user/mo', icon: '📈', category: 'Analytics' },
  { name: 'DesignKit', price: 'Freemium', icon: '🎨', category: 'Design' },
  { name: 'DevTools', price: '$8/user/mo', icon: '👨‍💻', category: 'Development' },
]

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How Pricing Works</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Each app sets its own pricing. Browse thousands of apps with transparent, vendor-direct pricing.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Pricing Models */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">App Pricing Models</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingModels.map((model) => (
              <div
                key={model.type}
                className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{model.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{model.type}</h3>
                <p className="text-gray-500 text-sm mb-4">{model.description}</p>
                <ul className="space-y-2">
                  {model.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-green-500">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl border p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                1️⃣
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Browse Apps</h3>
              <p className="text-sm text-gray-500">
                Explore thousands of apps. Each listing shows clear pricing information.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                2️⃣
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Try Free</h3>
              <p className="text-sm text-gray-500">
                Most paid apps offer a free trial. Test with your team before committing.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                3️⃣
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Pay Vendor Directly</h3>
              <p className="text-sm text-gray-500">
                Purchase directly from the vendor. No marketplace fees added.
              </p>
            </div>
          </div>
        </div>

        {/* Popular Apps with Pricing */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Popular Apps & Pricing</h2>
            <Link href="/" className="text-blue-600 hover:underline">
              View all apps →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularApps.map((app) => (
              <Link
                key={app.name}
                href="/"
                className="bg-white rounded-xl border p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                  {app.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{app.name}</h3>
                  <p className="text-sm text-gray-500">{app.category}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-blue-600">{app.price}</div>
                  <div className="text-xs text-gray-400">starting price</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Pricing Tiers Example */}
        <div className="bg-white rounded-2xl border p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Example: Per-User Pricing
          </h2>
          <p className="text-gray-500 text-center mb-8 max-w-xl mx-auto">
            Many apps use per-user pricing. Here's an example of how pricing scales with your team size.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Team Size</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Users</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Monthly Cost</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Annual Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-3 px-4">Small Team</td>
                  <td className="py-3 px-4">1-10</td>
                  <td className="py-3 px-4">$5/user = $5-$50/mo</td>
                  <td className="py-3 px-4">$4/user = $4-$40/mo (20% off)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Growing Team</td>
                  <td className="py-3 px-4">11-50</td>
                  <td className="py-3 px-4">$4/user = $44-$200/mo</td>
                  <td className="py-3 px-4">$3.20/user = $35-$160/mo</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Large Team</td>
                  <td className="py-3 px-4">51-200</td>
                  <td className="py-3 px-4">$3/user = $153-$600/mo</td>
                  <td className="py-3 px-4">$2.40/user = $122-$480/mo</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Enterprise</td>
                  <td className="py-3 px-4">200+</td>
                  <td className="py-3 px-4" colSpan={2}>Contact vendor for volume pricing</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between"
                >
                  <span className="font-medium text-gray-900">{faq.q}</span>
                  <span className={`transform transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-gray-600">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Find Your Apps?</h2>
          <p className="text-blue-100 mb-6">
            Browse thousands of apps with transparent pricing. No hidden fees.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50"
          >
            Browse Marketplace
          </Link>
        </div>
      </div>
    </div>
  )
}