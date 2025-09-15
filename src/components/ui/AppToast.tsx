import React from 'react'
import toast from 'react-hot-toast'
import { Icons } from '../icons'

interface AppToastProps {
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  icon?: React.ReactNode
  title?: string
  details?: string
  action?: {
    label: string
    onClick: () => void
  }
}

// Custom toast component with HeroUI success styling
const AppToast: React.FC<AppToastProps> = ({ 
  message, 
  type = 'success', 
  duration = 4000,
  icon,
  title,
  details,
  action
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
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        {title && <div className="font-semibold text-sm mb-1">{title}</div>}
        <div className={`${title ? "text-sm" : "text-sm font-medium"} ${type === 'error' ? 'text-red-100' : ''}`}>
          {message}
        </div>
        {details && (
          <div className="text-xs opacity-75 mt-1 text-gray-300">
            {details}
          </div>
        )}
        {action && (
          <button
            onClick={action.onClick}
            className="mt-2 text-xs font-medium underline hover:no-underline transition-all duration-200"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  )

  const getToastOptions = () => {
    const baseStyle = {
      borderRadius: '0.75rem',
      padding: '1rem',
      fontWeight: '500',
      backdropFilter: 'blur(16px)',
    }

    switch (type) {
      case 'success':
        return {
          duration,
          position: 'top-right' as const,
          style: {
            ...baseStyle,
            background: 'hsl(var(--heroui-success) / 0.1)',
            color: 'hsl(var(--heroui-success))',
            border: '1px solid hsl(var(--heroui-success) / 0.2)',
            boxShadow: '0 10px 40px hsl(var(--heroui-success) / 0.15), 0 4px 16px hsl(var(--heroui-success) / 0.08)',
          },
          icon: null
        }
      case 'error':
        return {
          duration: duration || 6000, // Longer duration for errors
          position: 'top-right' as const,
          style: {
            ...baseStyle,
            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            color: '#ffffff',
            border: '1px solid #991b1b',
            boxShadow: '0 10px 40px rgba(220, 38, 38, 0.4), 0 4px 16px rgba(185, 28, 28, 0.2)',
            maxWidth: '400px',
            minWidth: '300px',
          },
          icon: null
        }
      case 'warning':
        return {
          duration,
          position: 'top-right' as const,
          style: {
            ...baseStyle,
            background: 'hsl(var(--heroui-warning) / 0.1)',
            color: 'hsl(var(--heroui-warning))',
            border: '1px solid hsl(var(--heroui-warning) / 0.2)',
            boxShadow: '0 10px 40px hsl(var(--heroui-warning) / 0.15), 0 4px 16px hsl(var(--heroui-warning) / 0.08)',
          },
          icon: null
        }
      case 'info':
        return {
          duration,
          position: 'top-right' as const,
          style: {
            ...baseStyle,
            background: 'hsl(var(--heroui-primary) / 0.1)',
            color: 'hsl(var(--heroui-primary))',
            border: '1px solid hsl(var(--heroui-primary) / 0.2)',
            boxShadow: '0 10px 40px hsl(var(--heroui-primary) / 0.15), 0 4px 16px hsl(var(--heroui-primary) / 0.08)',
          },
          icon: null
        }
      default:
        return {
          duration,
          position: 'top-right' as const,
          style: {
            ...baseStyle,
            background: 'hsl(var(--heroui-success) / 0.1)',
            color: 'hsl(var(--heroui-success))',
            border: '1px solid hsl(var(--heroui-success) / 0.2)',
            boxShadow: '0 10px 40px hsl(var(--heroui-success) / 0.15), 0 4px 16px hsl(var(--heroui-success) / 0.08)',
          },
          icon: null
        }
    }
  }

  const toastOptions = getToastOptions()

  // Use the appropriate toast method based on type
  console.log('🔍 AppToast rendering:', { type, message, title, duration })
  
  switch (type) {
    case 'success':
      return toast.success(toastContent, toastOptions)
    case 'error':
      console.log('🔍 Calling toast.error with:', { toastContent, toastOptions })
      return toast.error(toastContent, toastOptions)
    case 'warning':
      return toast(toastContent, { ...toastOptions, icon: '⚠️' })
    case 'info':
      return toast(toastContent, { ...toastOptions, icon: 'ℹ️' })
    default:
      return toast.success(toastContent, toastOptions)
  }
}

// Convenience functions for common use cases
export const showSuccessToast = (message: string, title?: string, duration?: number) => {
  return AppToast({ message, type: 'success', title, duration })
}

export const showErrorToast = (message: string, title?: string, duration?: number, details?: string, action?: { label: string; onClick: () => void }) => {
  console.log('🔍 showErrorToast called with:', { message, title, duration, details, action })
  return AppToast({ message, type: 'error', title, duration, details, action })
}

// Enhanced error toast for authentication errors
export const showAuthErrorToast = (error: any, title: string = 'Authentication Error') => {
  let message = 'An unexpected error occurred'
  let details = ''
  let action = undefined

  if (error?.message) {
    message = error.message
  }

  if (error?.type) {
    switch (error.type) {
      case 'USER_ALREADY_EXISTS':
        message = 'An account with this email already exists'
        action = {
          label: 'Sign In Instead',
          onClick: () => {
            // This will be handled by the component
            console.log('Redirect to sign in')
          }
        }
        break
      case 'INVALID_EMAIL':
        message = 'Please enter a valid email address'
        break
      case 'WEAK_PASSWORD':
        message = 'Password must be at least 12 characters long'
        break
      case 'NETWORK_ERROR':
        message = 'Network error. Please check your connection'
        details = 'Unable to connect to our servers'
        break
      case 'RATE_LIMIT_EXCEEDED':
        message = 'Too many attempts. Please wait a moment'
        details = 'Please try again in a few minutes'
        break
      default:
        if (error?.details) {
          details = error.details
        }
    }
  }

  return showErrorToast(message, title, 6000, details, action)
}

export const showInfoToast = (message: string, title?: string, duration?: number) => {
  return AppToast({ message, type: 'info', title, duration })
}

export const showWarningToast = (message: string, title?: string, duration?: number) => {
  return AppToast({ message, type: 'warning', title, duration })
}

export default AppToast
