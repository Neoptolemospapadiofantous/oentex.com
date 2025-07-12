// src/components/ui/EnhancedStates.tsx - Better loading and error UX
import React from 'react'
import { AlertCircle, RefreshCw, Star, Gift, TrendingUp } from 'lucide-react'

// Enhanced loading spinner with context
export const ContextualSpinner: React.FC<{
  context?: 'deals' | 'ratings' | 'auth' | 'default'
  size?: 'sm' | 'md' | 'lg'
  message?: string
}> = ({ context = 'default', size = 'md', message }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  }

  const getContextIcon = () => {
    switch (context) {
      case 'deals':
        return <Gift className={`${sizeClasses[size]} animate-spin text-primary`} />
      case 'ratings':
        return <Star className={`${sizeClasses[size]} animate-spin text-yellow-500`} />
      case 'auth':
        return <RefreshCw className={`${sizeClasses[size]} animate-spin text-blue-500`} />
      default:
        return <RefreshCw className={`${sizeClasses[size]} animate-spin text-primary`} />
    }
  }

  const getContextMessage = () => {
    if (message) return message
    switch (context) {
      case 'deals':
        return 'Loading deals...'
      case 'ratings':
        return 'Loading ratings...'
      case 'auth':
        return 'Authenticating...'
      default:
        return 'Loading...'
    }
  }

  return (
    <div className="flex items-center justify-center gap-3 text-textSecondary">
      {getContextIcon()}
      <span className="text-sm font-medium">{getContextMessage()}</span>
    </div>
  )
}

// Enhanced error display with retry functionality
export const ErrorDisplay: React.FC<{
  error: string | Error
  onRetry?: () => void
  context?: 'deals' | 'ratings' | 'auth' | 'default'
  size?: 'sm' | 'md' | 'lg'
}> = ({ error, onRetry, context = 'default', size = 'md' }) => {
  const errorMessage = typeof error === 'string' ? error : error.message

  const getContextTitle = () => {
    switch (context) {
      case 'deals':
        return 'Failed to load deals'
      case 'ratings':
        return 'Failed to load ratings'
      case 'auth':
        return 'Authentication error'
      default:
        return 'Something went wrong'
    }
  }

  const containerClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  }

  const iconClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <div className={`bg-red-50 border border-red-200 rounded-xl ${containerClasses[size]} text-center`}>
      <div className="flex flex-col items-center gap-3">
        <AlertCircle className={`${iconClasses[size]} text-red-500`} />
        <div>
          <h3 className="font-medium text-red-800 mb-1">{getContextTitle()}</h3>
          <p className="text-red-600 text-sm">{errorMessage}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}

// Card skeleton for deal loading
export const DealCardSkeleton: React.FC = () => (
  <div className="bg-surface rounded-2xl border border-border p-6 animate-pulse">
    {/* Header */}
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-12 h-12 bg-gray-200 rounded-xl" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
      <div className="h-6 bg-gray-200 rounded w-16" />
    </div>
    
    {/* Title */}
    <div className="h-6 bg-gray-200 rounded w-full mb-2" />
    <div className="h-6 bg-gray-100 rounded w-2/3 mb-4" />
    
    {/* Bonus */}
    <div className="bg-gray-100 rounded-xl p-4 mb-4">
      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </div>
    
    {/* Description */}
    <div className="space-y-2 mb-4">
      <div className="h-4 bg-gray-100 rounded w-full" />
      <div className="h-4 bg-gray-100 rounded w-3/4" />
      <div className="h-4 bg-gray-100 rounded w-1/2" />
    </div>
    
    {/* Buttons */}
    <div className="flex gap-3">
      <div className="flex-1 h-12 bg-gray-200 rounded-xl" />
      <div className="w-12 h-12 bg-gray-100 rounded-xl" />
    </div>
  </div>
)

// Grid of deal skeletons
export const DealsGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }, (_, i) => (
      <DealCardSkeleton key={i} />
    ))}
  </div>
)

// Rating stars skeleton
export const RatingsSkeleton: React.FC = () => (
  <div className="flex items-center gap-2 animate-pulse">
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
      ))}
    </div>
    <div className="h-4 bg-gray-200 rounded w-12" />
  </div>
)

// Success state component
export const SuccessState: React.FC<{
  title: string
  message: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}> = ({ title, message, icon, action }) => (
  <div className="text-center py-8">
    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
      {icon || <TrendingUp className="w-8 h-8 text-green-600" />}
    </div>
    <h3 className="text-xl font-semibold text-text mb-2">{title}</h3>
    <p className="text-textSecondary mb-6">{message}</p>
    {action && (
      <button
        onClick={action.onClick}
        className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
      >
        {action.label}
      </button>
    )}
  </div>
)

// Empty state component
export const EmptyState: React.FC<{
  title: string
  message: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}> = ({ title, message, icon, action }) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      {icon || <Gift className="w-8 h-8 text-gray-400" />}
    </div>
    <h3 className="text-xl font-semibold text-text mb-2">{title}</h3>
    <p className="text-textSecondary mb-6">{message}</p>
    {action && (
      <button
        onClick={action.onClick}
        className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
      >
        {action.label}
      </button>
    )}
  </div>
)

export default {
  ContextualSpinner,
  ErrorDisplay,
  DealCardSkeleton,
  DealsGridSkeleton,
  RatingsSkeleton,
  SuccessState,
  EmptyState
}