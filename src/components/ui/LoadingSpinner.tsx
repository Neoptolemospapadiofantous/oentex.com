// src/components/ui/LoadingSpinner.tsx - No Icons Version

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'primary' | 'secondary' | 'auth' | 'deals'
  className?: string
  text?: string
  showIcon?: boolean
}

export const LoadingSpinner = ({
  size = 'md',
  variant = 'default',
  className = '',
  text,
  showIcon = true
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4 text-sm',
    md: 'w-6 h-6 text-base',
    lg: 'w-8 h-8 text-lg',
    xl: 'w-12 h-12 text-2xl'
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'text-blue-600'
      case 'secondary':
        return 'text-emerald-600'
      case 'auth':
        return 'text-blue-600'
      case 'deals':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const getSpinner = () => {
    const baseClasses = `${sizeClasses[size]} flex items-center justify-center`
    
    switch (variant) {
      case 'auth':
        return <div className={`${baseClasses} animate-pulse`}>🔐</div>
      case 'deals':
        return <div className={`${baseClasses} animate-pulse`}>💰</div>
      case 'primary':
        return <div className={`${baseClasses} animate-pulse`}>⚡</div>
      default:
        return (
          <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-current border-t-transparent`} />
        )
    }
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`flex items-center gap-2 ${getVariantStyles()}`}>
        {showIcon && getSpinner()}
        {text && (
          <span className={`${textSizeClasses[size]} font-medium`}>
            {text}
          </span>
        )}
      </div>
    </div>
  )
}

// Page-level loading component
export const PageLoader = ({ 
  message = 'Loading...', 
  variant = 'default' 
}: { 
  message?: string 
  variant?: 'auth' | 'deals' | 'default'
}) => {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-white dark:bg-slate-900">
      <div className="text-center">
        <LoadingSpinner size="xl" variant={variant} className="mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-lg">{message}</p>
      </div>
    </div>
  )
}

// Inline loading component
export const InlineLoader = ({ 
  text = 'Loading...', 
  size = 'sm',
  variant = 'default' 
}: { 
  text?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'primary' | 'secondary'
}) => {
  return (
    <div className="flex items-center justify-center py-4">
      <LoadingSpinner size={size} variant={variant} text={text} />
    </div>
  )
}

// Button loading state
export const ButtonLoader = ({ 
  text = 'Loading...', 
  size = 'sm' 
}: { 
  text?: string
  size?: 'sm' | 'md' | 'lg'
}) => {
  const spinnerSize = size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'
  
  return (
    <div className="flex items-center gap-2">
      <div className={`${spinnerSize} animate-spin rounded-full border-2 border-current border-t-transparent`} />
      <span>{text}</span>
    </div>
  )
}

// Skeleton loading for deals
export const DealsSkeleton = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header skeleton */}
        <div className="text-center mb-12">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-96 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-128 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-64 mx-auto"></div>
          </div>
        </div>

        {/* Filters skeleton */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-64"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-48"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
            </div>
          </div>
        </div>

        {/* Results summary skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
          </div>
        </div>

        {/* Deals grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3 mb-4"></div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                </div>
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="animate-pulse">
                <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-16 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24 mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Auth loading component
export const AuthLoader = ({ stage = 'initializing' }: { 
  stage?: 'initializing' | 'validating' | 'loading-profile' | 'complete'
}) => {
  const getStageMessage = () => {
    switch (stage) {
      case 'initializing':
        return 'Initializing authentication...'
      case 'validating':
        return 'Validating session...'
      case 'loading-profile':
        return 'Loading user profile...'
      case 'complete':
        return 'Authentication complete!'
      default:
        return 'Loading...'
    }
  }

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-white dark:bg-slate-900">
      <div className="text-center">
        <LoadingSpinner size="xl" variant="auth" className="mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">{getStageMessage()}</p>
        <div className="w-64 mx-auto">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ 
                width: stage === 'initializing' ? '25%' : 
                       stage === 'validating' ? '50%' : 
                       stage === 'loading-profile' ? '75%' : '100%' 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Connection status loader
export const ConnectionLoader = ({ 
  isConnected, 
  message = 'Connecting...' 
}: { 
  isConnected: boolean
  message?: string
}) => {
  return (
    <div className="flex items-center gap-2 text-sm">
      {isConnected ? (
        <>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-green-600">Connected</span>
        </>
      ) : (
        <>
          <div className="w-4 h-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
          <span className="text-orange-600">{message}</span>
        </>
      )}
    </div>
  )
}

export default LoadingSpinner