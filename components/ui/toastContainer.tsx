import { useToast } from './toastContext'
import { useState, useEffect } from 'react'

export function ToastContainer() {
  const { toasts } = useToast()
  const [visibleToasts, setVisibleToasts] = useState<Array<typeof toasts[number] & { visible: boolean }>>(
    []
  )

  useEffect(() => {
    setVisibleToasts(toasts.map(toast => ({ ...toast, visible: true })))
  }, [toasts])

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleToasts(prevToasts => 
        prevToasts.map(toast => 
          toast.visible ? { ...toast, visible: false } : toast
        )
      )
    }, 2700)
    
    return () => clearTimeout(timer)
  }, [visibleToasts])

  // If there are no visible toasts, don't render anything
  if (visibleToasts.length === 0) {
    return null;
  }

  return (
    <>
      <style jsx global>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .slide-up {
          animation: slideUp 0.1s ease-out;
        }
      `}</style>
      <div className="fixed bottom-0 left-0 right-0 flex justify-center items-end p-4 z-50">
        <div className="space-y-2 max-w-md mb-16">
          {visibleToasts.map((toast) => (
            <div
              key={toast.id}
              className={`px-8 py-2 rounded-xl shadow-md text-center slide-up
                ${toast.variant === 'destructive' ? 'bg-red-500 text-white' : 'bg-black text-white'}
                transition-opacity duration-300 ease-in-out
                ${toast.visible ? 'opacity-100' : 'opacity-0'}
              `}
            >
              <p>{toast.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}