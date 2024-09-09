'use client'

import { ToastProvider } from '@/components/ToastContext'
import { ToastContainer } from '@/components/ui/ToastContainer'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ToastContainer />
      {children}
    </ToastProvider>
  )
}
