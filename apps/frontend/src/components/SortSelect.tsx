'use client'

interface SortSelectProps {
  value: string
  onChange: (value: string) => void
  options?: Array<{ value: string; label: string }>
}

export default function SortSelect({ 
  value, 
  onChange,
  options = [
    { value: 'installs', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'newest', label: 'Newest' },
  ]
}: SortSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-500">Sort by:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}