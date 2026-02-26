import { useState, useEffect, createContext, useContext, ReactNode } from 'react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        removeToast(toasts[0].id)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [toasts])

  const getToastStyles = (type: ToastType) => {
    const baseStyles = {
      padding: '14px 20px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '500',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      animation: 'slideIn 0.3s ease-out'
    }
    
    switch (type) {
      case 'success':
        return { ...baseStyles, background: 'linear-gradient(135deg, #52c41a, #73d13d)' }
      case 'error':
        return { ...baseStyles, background: 'linear-gradient(135deg, #ff4d4f, #ff7875)' }
      case 'warning':
        return { ...baseStyles, background: 'linear-gradient(135deg, #faad14, #ffc53d)' }
      case 'info':
      default:
        return { ...baseStyles, background: 'linear-gradient(135deg, #0070f3, #40a9ff)' }
    }
  }

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success': return '✓'
      case 'error': return '✕'
      case 'warning': return '⚠'
      case 'info': return 'ℹ'
    }
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{ 
        position: 'fixed', 
        top: '20px', 
        right: '20px', 
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            style={getToastStyles(toast.type)}
            onClick={() => removeToast(toast.id)}
          >
            <span style={{ fontSize: '16px' }}>{getIcon(toast.type)}</span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </ToastContext.Provider>
  )
}
