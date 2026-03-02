'use client'

interface CategoryFilterProps {
  categories: Array<{
    id: string
    name: string
    icon: string
    count: number
  }>
  selected: string
  onSelect: (id: string) => void
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selected === cat.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span className="mr-2">{cat.icon}</span>
          {cat.name}
          <span className={`ml-2 ${selected === cat.id ? 'text-blue-200' : 'text-gray-400'}`}>
            ({cat.count})
          </span>
        </button>
      ))}
    </div>
  )
}