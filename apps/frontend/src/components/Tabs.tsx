'use client'

import { useState } from 'react'

interface Tab {
  id: string
  label: string
  icon?: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  variant?: 'default' | 'pills' | 'underline'
}

export default function Tabs({ 
  tabs, 
  defaultTab,
  variant = 'default'
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const variants = {
    default: {
      container: 'border-b border-gray-200',
      tab: 'px-4 py-3 -mb-px text-sm font-medium border-b-2 transition-colors',
      active: 'border-blue-600 text-blue-600',
      inactive: 'border-transparent text-gray-500 hover:text-gray-700',
    },
    pills: {
      container: 'flex gap-2 p-1 bg-gray-100 rounded-lg',
      tab: 'px-4 py-2 text-sm font-medium rounded-md transition-colors',
      active: 'bg-white text-gray-900 shadow',
      inactive: 'text-gray-500 hover:text-gray-700',
    },
    underline: {
      container: 'flex gap-6 border-b border-gray-200',
      tab: 'pb-3 text-sm font-medium border-b-2 transition-colors',
      active: 'border-gray-900 text-gray-900',
      inactive: 'border-transparent text-gray-500 hover:text-gray-700',
    },
  }

  const style = variants[variant]
  const activeContent = tabs.find(t => t.id === activeTab)?.content

  return (
    <div>
      <div className={style.container}>
        <div className={variant === 'default' ? 'flex gap-8' : 'flex'}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${style.tab} ${
                activeTab === tab.id ? style.active : style.inactive
              }`}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4">{activeContent}</div>
    </div>
  )
}

// Simple Tab List for controlled usage
export function TabList({
  tabs,
  activeTab,
  onChange,
}: {
  tabs: { id: string; label: string; icon?: string }[]
  activeTab: string
  onChange: (id: string) => void
}) {
  return (
    <div className="border-b border-gray-200">
      <div className="flex gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-1 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}