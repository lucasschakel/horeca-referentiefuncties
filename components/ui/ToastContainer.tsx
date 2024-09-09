import { useToast } from '../ToastContext'
import { useState, useEffect } from 'react'

export function ToastContainer() {
  const { toasts } = useToast()
  const [visibleToasts, setVisibleToasts] = useState<
    Array<(typeof toasts)[number] & { visible: boolean }>
  >([])

  useEffect(() => {
    setVisibleToasts(toasts.map((toast) => ({ ...toast, visible: true })))
  }, [toasts])

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleToasts((prevToasts) =>
        prevToasts.map((toast) =>
          toast.visible ? { ...toast, visible: false } : toast
        )
      )
    }, 2200)

    return () => clearTimeout(timer)
  }, [visibleToasts])

  // If there are no visible toasts, don't render anything
  if (visibleToasts.length === 0) {
    return null
  }

  return (
    <>
      <style jsx global>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .slide-up {
          animation: slideUp 0.15s ease-out;
        }
      `}</style>
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-end justify-center p-4">
        <div className="mb-16 max-w-md space-y-2">
          {visibleToasts.map((toast) => (
            <div
              key={toast.id}
              className={`slide-up rounded-xl px-8 py-2 text-center shadow-sm ${toast.variant === 'destructive' ? 'bg-red-500 text-white' : 'bg-black text-white'} transition-opacity duration-300 ease-in-out ${toast.visible ? 'opacity-100' : 'opacity-0'} `}
            >
              <p>{toast.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
