interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  children: React.ReactNode
  onClose?: () => void
  action?: {
    label: string
    onClick: () => void
  }
}

export default function Alert({
  type = 'info',
  title,
  children,
  onClose,
  action,
}: AlertProps) {
  const styles = {
    info: {
      bg: 'bg-blue-50 border-blue-200',
      icon: 'ℹ️',
      title: 'text-blue-800',
      text: 'text-blue-700',
    },
    success: {
      bg: 'bg-green-50 border-green-200',
      icon: '✅',
      title: 'text-green-800',
      text: 'text-green-700',
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      icon: '⚠️',
      title: 'text-yellow-800',
      text: 'text-yellow-700',
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      icon: '❌',
      title: 'text-red-800',
      text: 'text-red-700',
    },
  }

  const style = styles[type]

  return (
    <div className={`${style.bg} border rounded-lg p-4`}>
      <div className="flex">
        <span className="text-xl mr-3">{style.icon}</span>
        <div className="flex-1">
          {title && (
            <h3 className={`font-medium ${style.title} mb-1`}>{title}</h3>
          )}
          <div className={`text-sm ${style.text}`}>{children}</div>
          {action && (
            <button
              onClick={action.onClick}
              className={`mt-3 text-sm font-medium ${style.title} hover:underline`}
            >
              {action.label} →
            </button>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`${style.text} hover:opacity-70`}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

// Dismissible Alert
export function DismissibleAlert({
  type = 'info',
  title,
  children,
  onClose,
}: AlertProps) {
  return (
    <Alert type={type} title={title} onClose={onClose}>
      {children}
    </Alert>
  )
}

// Inline Alert (smaller)
export function InlineAlert({
  type = 'info',
  children,
}: {
  type?: 'info' | 'success' | 'warning' | 'error'
  children: React.ReactNode
}) {
  const styles = {
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    error: 'bg-red-50 text-red-700 border-red-200',
  }

  const icons = {
    info: 'ℹ️',
    success: '✓',
    warning: '⚠',
    error: '✕',
  }

  return (
    <div className={`${styles[type]} border rounded px-3 py-2 text-sm flex items-center gap-2`}>
      <span>{icons[type]}</span>
      {children}
    </div>
  )
}

// Banner Alert (full width)
export function BannerAlert({
  type = 'info',
  children,
  action,
}: {
  type?: 'info' | 'success' | 'warning' | 'error'
  children: React.ReactNode
  action?: { label: string; onClick: () => void }
}) {
  const styles = {
    info: 'bg-blue-600 text-white',
    success: 'bg-green-600 text-white',
    warning: 'bg-yellow-500 text-white',
    error: 'bg-red-600 text-white',
  }

  return (
    <div className={`${styles[type]} px-4 py-3`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">{children}</div>
        {action && (
          <button
            onClick={action.onClick}
            className="text-sm font-medium hover:underline"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  )
}