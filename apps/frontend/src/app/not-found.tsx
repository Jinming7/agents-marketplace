import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="text-[150px] font-bold text-gray-100 leading-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl animate-bounce">🔍</div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        {/* Quick Links */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            ← Back to Home
          </Link>
          <Link
            href="/support"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
          >
            Contact Support
          </Link>
        </div>

        {/* Popular Pages */}
        <div className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto">
          <h2 className="font-semibold text-gray-900 mb-4">Popular Pages</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/" className="p-3 bg-white rounded-lg border hover:shadow-md transition-shadow text-left">
              <span className="text-xl">🏠</span>
              <span className="block text-sm font-medium text-gray-900 mt-1">Home</span>
            </Link>
            <Link href="/featured" className="p-3 bg-white rounded-lg border hover:shadow-md transition-shadow text-left">
              <span className="text-xl">⭐</span>
              <span className="block text-sm font-medium text-gray-900 mt-1">Featured</span>
            </Link>
            <Link href="/docs" className="p-3 bg-white rounded-lg border hover:shadow-md transition-shadow text-left">
              <span className="text-xl">📚</span>
              <span className="block text-sm font-medium text-gray-900 mt-1">Docs</span>
            </Link>
            <Link href="/pricing" className="p-3 bg-white rounded-lg border hover:shadow-md transition-shadow text-left">
              <span className="text-xl">💳</span>
              <span className="block text-sm font-medium text-gray-900 mt-1">Pricing</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}