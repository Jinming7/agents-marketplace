'use client'

import { useState } from 'react'
import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    price: 0,
    description: 'Perfect for individuals and small teams getting started',
    features: [
      'Up to 5 team members',
      '5 app installations',
      'Basic support',
      'Community forums access',
      '1 GB storage',
    ],
    limitations: [
      'No priority support',
      'No custom integrations',
    ],
    cta: 'Get Started Free',
    popular: false,
    color: 'gray',
  },
  {
    name: 'Pro',
    price: 29,
    description: 'Advanced features for growing teams and businesses',
    features: [
      'Up to 50 team members',
      'Unlimited app installations',
      'Priority email support',
      'Advanced analytics',
      '50 GB storage',
      'Custom workflows',
      'API access',
      'SSO integration',
    ],
    limitations: [],
    cta: 'Start 14-Day Trial',
    popular: true,
    color: 'blue',
  },
  {
    name: 'Enterprise',
    price: null,
    description: 'Custom solutions for large organizations',
    features: [
      'Unlimited team members',
      'Unlimited everything',
      '24/7 phone & chat support',
      'Dedicated account manager',
      'Unlimited storage',
      'Custom integrations',
      'On-premise deployment',
      'SLA guarantee',
      'Security audit access',
    ],
    limitations: [],
    cta: 'Contact Sales',
    popular: false,
    color: 'purple',
  },
]

const faqs = [
  {
    q: 'Can I switch plans anytime?',
    a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any differences.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and wire transfers for Enterprise plans.',
  },
  {
    q: 'Is there a free trial for Pro?',
    a: 'Yes! We offer a 14-day free trial for the Pro plan. No credit card required to start.',
  },
  {
    q: 'Do you offer discounts for nonprofits?',
    a: 'Yes, we offer 50% off for registered nonprofit organizations. Contact our sales team for more information.',
  },
]

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const getPrice = (price: number | null) => {
    if (price === null) return 'Custom'
    if (billingCycle === 'yearly') return Math.round(price * 0.8)
    return price
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Choose the plan that fits your team. All plans include core marketplace features.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-white/10 rounded-full p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                billingCycle === 'monthly' ? 'bg-white text-blue-600' : 'text-white hover:bg-white/10'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                billingCycle === 'yearly' ? 'bg-white text-blue-600' : 'text-white hover:bg-white/10'
              }`}
            >
              Yearly <span className="text-xs opacity-75">(Save 20%)</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map(plan => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl border-2 ${
                plan.popular ? 'border-blue-500 shadow-xl scale-105' : 'border-gray-200'
              } p-8 relative`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 text-white text-sm font-medium rounded-full">
                  Most Popular
                </div>
              )}

              <h2 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h2>
              <p className="text-gray-500 text-sm mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  ${getPrice(plan.price)}
                </span>
                {plan.price !== null && (
                  <span className="text-gray-500">/{billingCycle === 'monthly' ? 'mo' : 'mo'}</span>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
                {plan.limitations.map((limitation, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <span className="text-gray-300">✗</span>
                    <span className="text-gray-400">{limitation}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.price === 0 ? '/register' : plan.price === null ? '/support' : '/register'}
                className={`block w-full py-3 rounded-lg font-medium text-center transition-colors ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-2xl border p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">All Plans Include</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3">
                🔒
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Secure Platform</h3>
              <p className="text-sm text-gray-500">SOC 2 compliant with end-to-end encryption</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3">
                🔄
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Auto Updates</h3>
              <p className="text-sm text-gray-500">Apps update automatically with version control</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3">
                📊
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Analytics</h3>
              <p className="text-sm text-gray-500">Track usage and performance metrics</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3">
                🛠️
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Easy Setup</h3>
              <p className="text-sm text-gray-500">One-click install with zero configuration</p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
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
                  <div className="px-6 pb-4 text-gray-600">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}