export function Skeleton({ 
  className = '',
  rounded = 'md'
}: { 
  className?: string
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
}) {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }

  return (
    <div 
      className={`bg-gray-200 animate-pulse ${roundedClasses[rounded]} ${className}`}
    />
  )
}

// Text Skeleton
export function TextSkeleton({ 
  lines = 3,
  className = ''
}: { 
  lines?: number
  className?: string
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  )
}

// Avatar Skeleton
export function AvatarSkeleton({ 
  size = 'md' 
}: { 
  size?: 'sm' | 'md' | 'lg' | 'xl' 
}) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  return <Skeleton className={sizes[size]} rounded="full" />
}

// Card Skeleton
export function CardSkeleton({ 
  className = '' 
}: { 
  className?: string 
}) {
  return (
    <div className={`bg-white rounded-xl border p-6 ${className}`}>
      <div className="flex items-start gap-4">
        <Skeleton className="w-14 h-14 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
      <div className="mt-4 pt-4 border-t flex justify-between">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  )
}

// Table Skeleton
export function TableSkeleton({ 
  rows = 5,
  columns = 4
}: { 
  rows?: number
  columns?: number
}) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-4 py-3">
                <Skeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="border-b last:border-b-0">
              {Array.from({ length: columns }).map((_, j) => (
                <td key={j} className="px-4 py-3">
                  <Skeleton className="h-4 w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// List Skeleton
export function ListSkeleton({ 
  items = 5 
}: { 
  items?: number 
}) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-lg border">
          <AvatarSkeleton />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  )
}

// Stats Skeleton
export function StatsSkeleton({ 
  count = 4 
}: { 
  count?: number 
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border p-6">
          <div className="flex justify-between mb-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="w-10 h-10 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  )
}