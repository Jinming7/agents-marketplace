interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  icon?: string
}

export default function Badge({ 
  variant = 'default', 
  size = 'md',
  children,
  icon
}: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
      {icon && <span>{icon}</span>}
      {children}
    </span>
  )
}

// Preset badges
export function VerifiedBadge() {
  return (
    <Badge variant="info" size="sm" icon="✓">
      Verified
    </Badge>
  )
}

export function FeaturedBadge() {
  return (
    <Badge variant="warning" size="sm" icon="⭐">
      Featured
    </Badge>
  )
}

export function NewBadge() {
  return (
    <Badge variant="success" size="sm" icon="✨">
      New
    </Badge>
  )
}

export function PopularBadge() {
  return (
    <Badge variant="error" size="sm" icon="🔥">
      Popular
    </Badge>
  )
}

export function FreeBadge() {
  return (
    <Badge variant="success" size="sm">
      Free
    </Badge>
  )
}

export function PremiumBadge() {
  return (
    <Badge variant="info" size="sm" icon="💎">
      Premium
    </Badge>
  )
}