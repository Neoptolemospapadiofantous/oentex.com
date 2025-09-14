import React from 'react'
import toast from 'react-hot-toast'
import { Icons } from '../icons'

interface AppToastProps {
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  icon?: React.ReactNode
  title?: string
}

// Custom toast component with HeroUI success styling
const AppToast: React.FC<AppToastProps> = ({ 
  message, 
  type = 'success', 
  duration = 4000,
  icon,
  title 
}) => {
  const getIcon = () => {
    if (icon) return icon
    
    switch (type) {
      case 'success':
        return <Icons.success className="w-5 h-5" />
      case 'error':
        return <Icons.error className="w-5 h-5" />
      case 'warning':
        return <Icons.warning className="w-5 h-5" />
      case 'info':
        return <Icons.info className="w-5 h-5" />
      default:
        return <Icons.success className="w-5 h-5" />
    }
  }

  const toastContent = (
    <div className="flex items-center gap-3">
      {getIcon()}
      <div>
        {title && <div className="font-semibold">{title}</div>}
        <div className={title ? "text-sm opacity-80" : ""}>{message}</div>
      </div>
    </div>
  )

  // Always use success styling regardless of type for consistency
  const toastOptions = {
    duration,
    position: 'top-right' as const,
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
    icon: null // Explicitly disable automatic icon
  }

  // Always use toast.success to get the success styling, regardless of type
  return toast.success(toastContent, toastOptions)
}

// Convenience functions for common use cases
export const showSuccessToast = (message: string, title?: string, duration?: number) => {
  return AppToast({ message, type: 'success', title, duration })
}

export const showErrorToast = (message: string, title?: string, duration?: number) => {
  return AppToast({ message, type: 'error', title, duration })
}

export const showInfoToast = (message: string, title?: string, duration?: number) => {
  return AppToast({ message, type: 'info', title, duration })
}

export const showWarningToast = (message: string, title?: string, duration?: number) => {
  return AppToast({ message, type: 'warning', title, duration })
}

export default AppToast
