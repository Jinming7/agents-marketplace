'use client'

import { useState } from 'react'

interface PricingTier {
  users: string
  monthly: number
  yearly: number
}

interface PricingData {
  model: 'free' | 'paid' | 'freemium' | 'enterprise'
  tiers: PricingTier[] | null
  trialDays: number | null
  freeUsers?: number
  message: string
}

interface PricingTableProps {
  pricing: PricingData
  appName: string
}

export default function PricingTable({ pricing, appName }: PricingTableProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly')

  // Free app
  if (pricing.model === 'free') {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <span className="text-3xl">🆓</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
          <p className="text-gray-600 mb-4">{pricing.message}</p>
          <button className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
            Install Now
          </button>
        </div>
      </div>
    )
  }

  // Enterprise app
  if (pricing.model === 'enterprise') {
    return (
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-200">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <span className="text-3xl">🏢</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
          <p className="text-gray-600 mb-4">{pricing.message}</p>
          <div className="flex gap-3 justify-center">
            <button className="px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700">
              Contact Sales
            </button>
            {pricing.trialDays && (
              <button className="px-6 py-3 border border-orange-300 text-orange-700 rounded-lg font-medium hover:bg-orange-50">
                Start {pricing.trialDays}-Day Trial
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Paid/Freemium with tiers
  if (!pricing.tiers) {
    return null
  }

  return (
    <div>
      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <span className={billingPeriod === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}>
          Monthly
        </span>
        <button
          onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
          className={`relative w-14 h-7 rounded-full transition-colors ${
            billingPeriod === 'yearly' ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
              billingPeriod === 'yearly' ? 'left-8' : 'left-1'
            }`}
          />
        </button>
        <span className={billingPeriod === 'yearly' ? 'text-gray-900 font-medium' : 'text-gray-500'}>
          Yearly
          <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            Save 17%
          </span>
        </span>
      </div>

      {/* Freemium Banner */}
      {pricing.model === 'freemium' && pricing.freeUsers && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-center">
          <span className="text-blue-700">
            ✨ Free for up to <strong>{pricing.freeUsers} users</strong>. Upgrade for more.
          </span>
        </div>
      )}

      {/* Pricing Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-500">Users</th>
              <th className="text-right py-3 px-4 font-medium text-gray-500">
                {billingPeriod === 'monthly' ? 'Monthly' : 'Annual'}
              </th>
            </tr>
          </thead>
          <tbody>
            {pricing.tiers.map((tier, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900">{tier.users} users</td>
                <td className="py-3 px-4 text-right">
                  {tier.monthly === 0 ? (
                    <span className="text-gray-500 italic">Contact Sales</span>
                  ) : (
                    <span className="font-semibold text-gray-900">
                      ${billingPeriod === 'monthly' ? tier.monthly : tier.yearly}
                      <span className="text-sm font-normal text-gray-500">
                        /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                      </span>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">{pricing.message}</p>
        <div className="flex gap-3">
          {pricing.trialDays && (
            <button className="px-6 py-2 border border-blue-300 text-blue-700 rounded-lg font-medium hover:bg-blue-50">
              Start {pricing.trialDays}-Day Trial
            </button>
          )}
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}