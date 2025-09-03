import React, { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'

interface ToastContainerProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center'
  topAnchorSelector?: string
  topMargin?: number
}

const ToastContainer: React.FC<ToastContainerProps> = ({ position = 'top-right', topAnchorSelector, topMargin = 8 }) => {
  const [computedTop, setComputedTop] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!topAnchorSelector || typeof window === 'undefined') {
      setComputedTop(undefined)
      return
    }
    const compute = () => {
      const el = document.querySelector(topAnchorSelector) as HTMLElement | null
      if (!el) {
        setComputedTop(undefined)
        return
      }
      const rect = el.getBoundingClientRect()
      // rect.bottom is relative to viewport top
      setComputedTop(`${Math.max(0, rect.bottom + topMargin)}px`)
    }
    compute()
    const onResize = () => compute()
    const onScroll = () => compute()
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll, true)
    const id = window.setTimeout(compute, 0)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll, true)
      window.clearTimeout(id)
    }
  }, [topAnchorSelector, topMargin])

  const containerStyle: React.CSSProperties = { zIndex: 9999 }

  if (position.startsWith('top')) {
    containerStyle.top = computedTop || '5rem'
  }
  if (position.startsWith('bottom')) {
    containerStyle.bottom = '1rem'
  }
  if (position.endsWith('right')) {
    containerStyle.right = '1rem'
  }
  if (position.endsWith('left')) {
    containerStyle.left = '1rem'
  }
  if (position.endsWith('center')) {
    // Let Toaster center horizontally; only apply vertical offset
  }

  return (
    <Toaster 
      position={position}
      toastOptions={{
        duration: 4000,
        success: {
          duration: 3000,
          style: { background: '#10B981', color: '#FFFFFF', fontWeight: '500' },
        },
        error: {
          duration: 5000,
          style: { background: '#EF4444', color: '#FFFFFF', fontWeight: '500' },
        },
        loading: {
          style: { background: '#3B82F6', color: '#FFFFFF' },
        },
      }}
      containerStyle={containerStyle}
      gutter={8}
      reverseOrder={false}
    />
  )
}

export default ToastContainer


