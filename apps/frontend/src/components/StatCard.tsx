interface StatCardProps {
  title: string
  value: string | number
  icon?: string
  change?: {
    value: number
    positive: boolean
  }
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
}

export default function StatCard({
  title,
  value,
  icon,
  change,
  color = 'blue',
}: StatCardProps) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
  }

  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">{title}</span>
        {icon && (
          <div className={`w-10 h-10 rounded-lg ${colors[color]} flex items-center justify-center text-xl`}>
            {icon}
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
      {change && (
        <div className={`flex items-center gap-1 text-sm ${
          change.positive ? 'text-green-600' : 'text-red-600'
        }`}>
          <span>{change.positive ? '↑' : '↓'}</span>
          <span>{Math.abs(change.value)}%</span>
          <span className="text-gray-400">vs last month</span>
        </div>
      )}
    </div>
  )
}

export function StatGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {children}
    </div>
  )
}