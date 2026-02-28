interface AvatarProps {
  name: string
  image?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: string
}

export default function Avatar({ 
  name, 
  image, 
  size = 'md',
  color
}: AvatarProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  }

  const colors = [
    'from-blue-500 to-indigo-500',
    'from-green-500 to-emerald-500',
    'from-purple-500 to-pink-500',
    'from-orange-500 to-red-500',
    'from-cyan-500 to-blue-500',
  ]

  const colorClass = color || colors[name.length % colors.length]

  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover`}
      />
    )
  }

  return (
    <div
      className={`${sizes[size]} bg-gradient-to-br ${colorClass} rounded-full flex items-center justify-center text-white font-medium`}
    >
      {initials}
    </div>
  )
}

// Avatar group for showing multiple users
export function AvatarGroup({ 
  users, 
  max = 4 
}: { 
  users: { name: string; image?: string }[]
  max?: number
}) {
  const visible = users.slice(0, max)
  const remaining = users.length - max

  return (
    <div className="flex -space-x-2">
      {visible.map((user, i) => (
        <div key={i} className="ring-2 ring-white rounded-full">
          <Avatar name={user.name} image={user.image} size="sm" />
        </div>
      ))}
      {remaining > 0 && (
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 ring-2 ring-white">
          +{remaining}
        </div>
      )}
    </div>
  )
}