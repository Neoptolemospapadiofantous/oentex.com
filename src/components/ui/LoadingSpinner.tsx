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
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
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

// Professional skeleton loading for deals
export const DealsSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header skeleton */}
        <div className="text-center mb-12">
          <div className="animate-pulse">
            <div className="h-12 bg-content2/50 rounded-2xl w-96 mx-auto mb-6"></div>
            <div className="h-6 bg-content2/30 rounded-xl w-128 mx-auto mb-3"></div>
            <div className="h-4 bg-content2/20 rounded-lg w-64 mx-auto"></div>
          </div>
        </div>

        {/* Professional filters skeleton */}
        <div className="bg-content1/90 backdrop-blur-xl rounded-2xl border border-divider/40 mb-8 shadow-2xl">
          <div className="p-8">
            {/* Search and Sort Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="relative">
                <div className="h-12 bg-content2/50 rounded-xl w-full"></div>
              </div>
              <div className="h-12 bg-content2/50 rounded-xl w-full"></div>
              <div className="h-12 bg-content2/50 rounded-xl w-full"></div>
            </div>

            {/* Category Quick Filters */}
            <div className="flex flex-wrap gap-4 py-4">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-12 bg-content2/50 rounded-lg w-32"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results summary skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="animate-pulse">
            <div className="h-5 bg-content2/50 rounded-lg w-40"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-5 bg-content2/50 rounded-lg w-32"></div>
          </div>
        </div>

        {/* Professional deals grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-content1/80 backdrop-blur-xl rounded-2xl border border-divider/40 p-6 shadow-lg">
              <div className="animate-pulse">
                {/* Header with company info */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-content2/50 rounded-xl"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-content2/50 rounded w-24"></div>
                      <div className="h-3 bg-content2/30 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="w-20 h-6 bg-content2/50 rounded-full"></div>
                </div>

                {/* Community Trust Section */}
                <div className="my-4 p-3 bg-content2/50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-content2/30 rounded w-24"></div>
                    <div className="h-3 bg-content2/30 rounded w-12"></div>
                  </div>
                </div>

                {/* Deal title */}
                <div className="my-4">
                  <div className="h-5 bg-content2/50 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-content2/30 rounded w-1/2"></div>
                </div>

                {/* Description */}
                <div className="my-4 space-y-2">
                  <div className="h-3 bg-content2/30 rounded w-full"></div>
                  <div className="h-3 bg-content2/30 rounded w-5/6"></div>
                  <div className="h-3 bg-content2/30 rounded w-4/6"></div>
                </div>

                {/* Features */}
                <div className="my-4">
                  <div className="flex flex-wrap gap-2">
                    <div className="h-6 bg-content2/30 rounded-full w-16"></div>
                    <div className="h-6 bg-content2/30 rounded-full w-20"></div>
                    <div className="h-6 bg-content2/30 rounded-full w-14"></div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 mt-6">
                  <div className="h-10 bg-content2/50 rounded-lg flex-1"></div>
                  <div className="h-10 bg-content2/50 rounded-lg w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination skeleton */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="animate-pulse">
            <div className="h-10 bg-content2/50 rounded-lg w-24"></div>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-10 bg-content2/50 rounded-lg w-10"></div>
              </div>
            ))}
          </div>
          <div className="animate-pulse">
            <div className="h-10 bg-content2/50 rounded-lg w-24"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Auth loading component
export const AuthLoader = ({ stage = 'initializing' }: { 
  stage?: 'initializing' | 'validating' | 'loading-profile' | 'complete'
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
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