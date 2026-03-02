interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  onClick?: () => void
}

export default function Card({
  children,
  className = '',
  padding = 'md',
  hover = false,
  onClick,
}: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border ${
        hover ? 'hover:shadow-lg transition-shadow cursor-pointer' : ''
      } ${paddings[padding]} ${className}`}
    >
      {children}
    </div>
  )
}

// Card Header
export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

// Card Content
export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="text-gray-600">{children}</div>
}

// Card Footer
export function CardFooter({
  children,
  align = 'right',
}: {
  children: React.ReactNode
  align?: 'left' | 'right' | 'center' | 'between'
}) {
  const aligns = {
    left: 'justify-start',
    right: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
  }

  return (
    <div className={`flex items-center gap-3 mt-4 pt-4 border-t ${aligns[align]}`}>
      {children}
    </div>
  )
}

// Stat Card
export function StatCardSimple({
  label,
  value,
  icon,
  trend,
}: {
  label: string
  value: string | number
  icon?: string
  trend?: { value: number; positive: boolean }
}) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">{label}</span>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {trend && (
        <div
          className={`text-sm mt-1 ${
            trend.positive ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
        </div>
      )}
    </Card>
  )
}

// Feature Card
export function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string
  title: string
  description: string
}) {
  return (
    <Card hover className="text-center">
      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </Card>
  )
}

// Info Card
export function InfoCard({
  icon,
  title,
  children,
}: {
  icon: string
  title: string
  children: React.ReactNode
}) {
  return (
    <Card className="flex gap-4">
      <div className="text-3xl">{icon}</div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{children}</p>
      </div>
    </Card>
  )
}