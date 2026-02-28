'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export default function Header() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (token) {
      // Fetch user info
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => data && setUser(data))
        .catch(() => {})
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/')
  }

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
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-gray-700">{user.name}</span>
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2">
                  <div className="px-4 py-2 border-b">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                  <Link href="/my-apps" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">My Apps</Link>
                  <Link href="/wishlist" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Wishlist</Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-gray-900 hidden sm:block">Login</Link>
              <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Sign Up
              </Link>
            </>
          )}
          
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
      
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="px-4 py-4 space-y-2">
            <Link href="/" className="block py-2 text-gray-600">Marketplace</Link>
            <Link href="/my-apps" className="block py-2 text-gray-600">My Apps</Link>
            <Link href="/wishlist" className="block py-2 text-gray-600">Wishlist</Link>
            <Link href="/pricing" className="block py-2 text-gray-600">Pricing</Link>
            <Link href="/developers" className="block py-2 text-gray-600">Developers</Link>
            <Link href="/support" className="block py-2 text-gray-600">Support</Link>
            {user ? (
              <button onClick={handleLogout} className="block py-2 text-red-600">Sign Out</button>
            ) : (
              <Link href="/login" className="block py-2 text-gray-600">Login</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}