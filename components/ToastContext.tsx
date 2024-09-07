import React, { createContext, useContext, useState, useCallback } from 'react'

export interface ToastProps {
  id?: number
  title?: string
  description: string
  variant?: 'default' | 'destructive'
}

interface ToastContextType {
  toast: (props: Omit<ToastProps, 'id'>) => void
  toasts: ToastProps[]
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = useCallback(
    ({ title, description, variant = 'default' }: Omit<ToastProps, 'id'>) => {
      const id = Date.now()
      setToasts((currentToasts) => [
        ...currentToasts,
        { id, title, description, variant },
      ])

      setTimeout(() => {
        setToasts((currentToasts) => currentToasts.filter((t) => t.id !== id))
      }, 2500)
    },
    []
  )

  return (
    <ToastContext.Provider value={{ toast, toasts }}>
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
