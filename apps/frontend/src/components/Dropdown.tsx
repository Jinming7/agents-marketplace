'use client'

import { useState, useRef, useEffect } from 'react'

interface DropdownItem {
  label: string
  icon?: string
  onClick?: () => void
  danger?: boolean
  divider?: boolean
}

interface DropdownProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  align?: 'left' | 'right'
}

export default function Dropdown({
  trigger,
  items,
  align = 'right',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={`absolute z-50 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {items.map((item, i) =>
            item.divider ? (
              <hr key={i} className="my-1 border-gray-200" />
            ) : (
              <button
                key={i}
                onClick={() => {
                  item.onClick?.()
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50 ${
                  item.danger ? 'text-red-600' : 'text-gray-700'
                }`}
              >
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  )
}

// Action Menu (three dots)
export function ActionMenu({ items }: { items: DropdownItem[] }) {
  return (
    <Dropdown
      trigger={
        <button className="p-2 rounded-lg hover:bg-gray-100">
          <span className="text-gray-500">⋮</span>
        </button>
      }
      items={items}
    />
  )
}

// User Menu
export function UserMenu({
  name,
  email,
  items,
}: {
  name: string
  email: string
  items: DropdownItem[]
}) {
  return (
    <Dropdown
      trigger={
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-medium">
            {name.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:block">{name}</span>
        </button>
      }
      items={[
        { label: name, icon: '👤' },
        { label: email, icon: '📧' },
        { divider: true, label: '' },
        ...items,
      ]}
    />
  )
}