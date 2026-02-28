'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
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
            <Link href="/" className="text-gray-600 hover:text-blue-600">Marketplace</Link>
            <Link href="/my-apps" className="text-gray-600 hover:text-blue-600">My Apps</Link>
            <Link href="/wishlist" className="text-gray-600 hover:text-blue-600">Wishlist</Link>
            <Link href="/pricing" className="text-gray-600 hover:text-blue-600">Pricing</Link>
            <Link href="/developers" className="text-gray-600 hover:text-blue-600">Developers</Link>
            <Link href="/support" className="text-gray-600 hover:text-blue-600">Support</Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-gray-600 hover:text-gray-900 hidden sm:block">Login</Link>
          <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Sign Up
          </Link>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="px-4 py-4 space-y-2">
            <Link href="/" className="block py-2 text-gray-600">Marketplace</Link>
            <Link href="/my-apps" className="block py-2 text-gray-600">My Apps</Link>
            <Link href="/wishlist" className="block py-2 text-gray-600">Wishlist</Link>
            <Link href="/pricing" className="block py-2 text-gray-600">Pricing</Link>
            <Link href="/developers" className="block py-2 text-gray-600">Developers</Link>
            <Link href="/support" className="block py-2 text-gray-600">Support</Link>
            <Link href="/login" className="block py-2 text-gray-600">Login</Link>
          </nav>
        </div>
      )}
    </header>
  )
}