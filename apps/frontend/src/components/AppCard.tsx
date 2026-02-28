import Link from 'next/link'

interface AppCardProps {
  id: string
  name: string
  description: string
  icon: string
  category: string
  rating: number
  installs: number
  verified?: boolean
  featured?: boolean
}

export default function AppCard({
  id,
  name,
  description,
  icon,
  category,
  rating,
  installs,
  verified = false,
  featured = false,
}: AppCardProps) {
  return (
    <Link
      href={`/apps/${id}`}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative"
    >
      {featured && (
        <div className="absolute top-3 left-3">
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            ✨ Featured
          </span>
        </div>
      )}
      
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-3xl">
            {icon}
          </div>
          {verified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mt-1">{description}</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {category}
          </span>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-yellow-500">
              ★ {rating.toFixed(1)}
            </span>
            <span className="text-gray-400">
              {(installs / 1000).toFixed(1)}k installs
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}