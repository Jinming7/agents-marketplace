'use client'

import { createContext, useContext, useState, useCallback } from 'react'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, type?: Toast['type'], duration?: number) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: Toast['type'] = 'info', duration = 4000) => {
    const id = Math.random().toString(36).slice(2)
    const toast: Toast = { id, message, type, duration }
    
    setToasts(prev => [...prev, toast])

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[], removeToast: (id: string) => void }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onClose }: { toast: Toast, onClose: () => void }) {
  const styles: Record<Toast['type'], { bg: string, icon: string, border: string }> = {
    success: { bg: 'bg-green-50', icon: '✓', border: 'border-green-200' },
    error: { bg: 'bg-red-50', icon: '✕', border: 'border-red-200' },
    warning: { bg: 'bg-yellow-50', icon: '⚠', border: 'border-yellow-200' },
    info: { bg: 'bg-blue-50', icon: 'ℹ', border: 'border-blue-200' },
  }

  const style = styles[toast.type]

  return (
    <div
      className={`${style.bg} ${style.border} border rounded-lg shadow-lg p-4 min-w-[300px] max-w-md flex items-center gap-3 animate-slide-in`}
    >
      <span className="text-lg">{style.icon}</span>
      <p className="flex-1 text-gray-800">{toast.message}</p>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>
    </div>
  )
}