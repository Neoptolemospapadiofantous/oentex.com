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
        style: {
          background: 'hsl(var(--heroui-content1))',
          color: 'hsl(var(--heroui-foreground))',
          border: '1px solid hsl(var(--heroui-divider))',
          borderRadius: '0.75rem',
          padding: '1rem',
          fontWeight: '500',
          boxShadow: '0 10px 40px hsl(var(--heroui-foreground) / 0.15), 0 4px 16px hsl(var(--heroui-foreground) / 0.1)',
          backdropFilter: 'blur(16px)',
        },
        success: {
          duration: 3000,
          style: {
            background: 'hsl(var(--heroui-success) / 0.1)',
            color: 'hsl(var(--heroui-success))',
            border: '1px solid hsl(var(--heroui-success) / 0.2)',
            borderRadius: '0.75rem',
            padding: '1rem',
            fontWeight: '500',
            boxShadow: '0 10px 40px hsl(var(--heroui-success) / 0.15), 0 4px 16px hsl(var(--heroui-success) / 0.08)',
            backdropFilter: 'blur(16px)',
          },
        },
        error: {
          duration: 5000,
          style: {
            background: 'hsl(var(--heroui-danger) / 0.1)',
            color: 'hsl(var(--heroui-danger))',
            border: '1px solid hsl(var(--heroui-danger) / 0.2)',
            borderRadius: '0.75rem',
            padding: '1rem',
            fontWeight: '500',
            boxShadow: '0 10px 40px hsl(var(--heroui-danger) / 0.15), 0 4px 16px hsl(var(--heroui-danger) / 0.08)',
            backdropFilter: 'blur(16px)',
          },
        },
        loading: {
          style: {
            background: 'hsl(var(--heroui-primary) / 0.1)',
            color: 'hsl(var(--heroui-primary))',
            border: '1px solid hsl(var(--heroui-primary) / 0.2)',
            borderRadius: '0.75rem',
            padding: '1rem',
            fontWeight: '500',
            boxShadow: '0 10px 40px hsl(var(--heroui-primary) / 0.15), 0 4px 16px hsl(var(--heroui-primary) / 0.08)',
            backdropFilter: 'blur(16px)',
          },
        },
        warning: {
          duration: 4000,
          style: {
            background: 'hsl(var(--heroui-warning) / 0.1)',
            color: 'hsl(var(--heroui-warning))',
            border: '1px solid hsl(var(--heroui-warning) / 0.2)',
            borderRadius: '0.75rem',
            padding: '1rem',
            fontWeight: '500',
            boxShadow: '0 10px 40px hsl(var(--heroui-warning) / 0.15), 0 4px 16px hsl(var(--heroui-warning) / 0.08)',
            backdropFilter: 'blur(16px)',
          },
        },
      }}
      containerStyle={containerStyle}
      gutter={8}
      reverseOrder={false}
    />
  )
}

export default ToastContainer


