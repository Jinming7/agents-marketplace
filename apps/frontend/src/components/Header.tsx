'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      const savedUser = localStorage.getItem('user')

      if (savedUser) {
        try { setUser(JSON.parse(savedUser)) } catch (e) { localStorage.removeItem('user') }
      }

      if (token) {
        try {
          const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
          if (res.ok) {
            const data = await res.json()
            setUser(data)
            localStorage.setItem('user', JSON.stringify(data))
          } else {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            setUser(null)
          }
        } catch (e) {
          if (!savedUser) setUser(null)
        }
      }
      setLoading(false)
    }
    fetchUser()
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setUserMenuOpen(false)
    router.push('/')
  }

  useEffect(() => {
    const handleClickOutside = () => setUserMenuOpen(false)
    if (userMenuOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [userMenuOpen])

  const navLinks = [
    { href: '/', label: 'Marketplace' },
    { href: '/my-apps', label: 'My Apps' },
    { href: '/developers', label: 'For Developers' },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
      scrolled ? 'bg-white border-b border-gray-200 shadow-sm' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">O</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">ONES</span>
            <span className="text-sm text-gray-500 hidden sm:inline">Marketplace</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-primary bg-primary-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="w-8 h-8 rounded bg-gray-200 animate-pulse" />
            ) : user ? (
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 transition-colors"
                >
                  <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm text-gray-700">{user.name}</span>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-soft-lg border border-gray-200 py-1 animate-scale-in origin-top-right">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500 truncate">{user.email}</div>
                    </div>
                    <div className="py-1">
                      <Link href="/my-apps" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" /></svg>
                        My Apps
                      </Link>
                      <Link href="/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Settings
                      </Link>
                    </div>
                    <div className="border-t border-gray-100 pt-1">
                      <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-error hover:bg-error-50">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Log In
                </Link>
                <Link href="/register" className="btn-primary px-4 py-2 text-sm">
                  Sign Up
                </Link>
              </>
            )}

            <button className="md:hidden p-2 rounded hover:bg-gray-100" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-slide-in-up">
          <nav className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`block px-3 py-2 rounded text-base font-medium ${pathname === link.href ? 'text-primary bg-primary-50' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100 mt-3">
              {user ? (
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded text-error hover:bg-error-50 font-medium">Sign Out</button>
              ) : (
                <>
                  <Link href="/login" className="block px-3 py-2 rounded text-gray-600 hover:bg-gray-50 font-medium" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
                  <Link href="/register" className="block px-3 py-2 rounded text-primary bg-primary-50 font-medium mt-1" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}