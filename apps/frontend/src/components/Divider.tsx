interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  label?: string
  dashed?: boolean
  className?: string
}

export default function Divider({
  orientation = 'horizontal',
  label,
  dashed = false,
  className = '',
}: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        className={`w-px h-full bg-gray-200 ${dashed ? 'border-l border-dashed' : ''} ${className}`}
      />
    )
  }

  if (label) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className={`flex-1 h-px bg-gray-200 ${dashed ? 'border-t border-dashed' : ''}`} />
        <span className="text-sm text-gray-500">{label}</span>
        <div className={`flex-1 h-px bg-gray-200 ${dashed ? 'border-t border-dashed' : ''}`} />
      </div>
    )
  }

  return (
    <div
      className={`w-full h-px bg-gray-200 ${dashed ? 'border-t border-dashed' : ''} ${className}`}
    />
  )
}

// Section Divider
export function SectionDivider({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="py-6">
      <Divider label={title} />
      {description && (
        <p className="text-center text-sm text-gray-500 mt-2">{description}</p>
      )}
    </div>
  )
}