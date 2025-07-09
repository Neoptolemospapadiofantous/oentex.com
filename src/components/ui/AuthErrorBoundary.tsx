// src/components/ui/AuthErrorBoundary.tsx (Enhanced with better error handling)
import React, { useState, useCallback } from 'react'
import { AlertCircle, RefreshCw, LogIn, Home, Shield, Wifi, WifiOff } from 'lucide-react'
import { useAuth } from '../../lib/authContext'
import { AuthError } from '../../types/auth'
import { AuthModal } from '../auth/AuthModals'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

interface AuthErrorBoundaryProps {
  error: AuthError
  onRetry?: () => void
  showReturnHome?: boolean
}

export const AuthErrorBoundary: React.FC<AuthErrorBoundaryProps> = ({ 
  error, 
  onRetry,
  showReturnHome = true 
}) => {
  const { retryAuth, clearError, user } = useAuth()
  const navigate = useNavigate()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot-password'>('login')
  const [isRetrying, setIsRetrying] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const MAX_RETRIES = 3

  // Determine error type and appropriate action
  const getErrorInfo = useCallback(() => {
    switch (error.type) {
      case 'SESSION_EXPIRED':
        return {
          title: 'Session Expired',
          message: 'Your session has expired. Please sign in again to continue.',
          icon: <Shield className="w-12 h-12 text-amber-600" />,
          showAuthButton: true,
          showRetryButton: false,
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          textColor: 'text-amber-800'
        }
      case 'INVALID_CREDENTIALS':
        return {
          title: 'Authentication Failed',
          message: 'Invalid credentials provided. Please check your email and password.',
          icon: <AlertCircle className="w-12 h-12 text-red-600" />,
          showAuthButton: true,
          showRetryButton: false,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800'
        }
      case 'NETWORK_ERROR':
        return {
          title: 'Connection Error',
          message: 'Unable to connect to the server. Please check your internet connection.',
          icon: <WifiOff className="w-12 h-12 text-orange-600" />,
          showAuthButton: false,
          showRetryButton: true,
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-800'
        }
      case 'TOKEN_EXPIRED':
        return {
          title: 'Access Token Expired',
          message: 'Your access token has expired. Attempting to refresh...',
          icon: <RefreshCw className="w-12 h-12 text-blue-600" />,
          showAuthButton: true,
          showRetryButton: true,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800'
        }
      default:
        return {
          title: 'Authentication Error',
          message: error.message || 'An unexpected error occurred. Please try again.',
          icon: <AlertCircle className="w-12 h-12 text-red-600" />,
          showAuthButton: true,
          showRetryButton: true,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800'
        }
    }
  }, [error])

  const handleRetry = useCallback(async () => {
    if (retryCount >= MAX_RETRIES) {
      toast.error('Maximum retry attempts reached. Please refresh the page.')
      return
    }

    setIsRetrying(true)
    setRetryCount(prev => prev + 1)

    try {
      clearError()
      await retryAuth()
      
      if (onRetry) {
        await onRetry()
      }
      
      toast.success('Authentication retry successful!')
    } catch (error) {
      console.error('Auth retry failed:', error)
      toast.error('Retry failed. Please try again.')
    } finally {
      setIsRetrying(false)
    }
  }, [retryCount, clearError, retryAuth, onRetry])

  const handleSignIn = useCallback(() => {
    setAuthMode('login')
    setShowAuthModal(true)
  }, [])

  const handleGoHome = useCallback(() => {
    clearError()
    navigate('/')
  }, [clearError, navigate])

  const handleRefreshPage = useCallback(() => {
    window.location.reload()
  }, [])

  const errorInfo = getErrorInfo()

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className={`${errorInfo.bgColor} border ${errorInfo.borderColor} rounded-xl p-8 text-center`}>
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            {errorInfo.icon}
          </div>

          {/* Error Title */}
          <h2 className={`text-2xl font-bold ${errorInfo.textColor} mb-4`}>
            {errorInfo.title}
          </h2>

          {/* Error Message */}
          <p className={`${errorInfo.textColor} mb-6 leading-relaxed`}>
            {errorInfo.message}
          </p>

          {/* Error Details (for debugging) */}
          {error.details && (
            <details className="mb-6 text-left">
              <summary className={`${errorInfo.textColor} cursor-pointer text-sm font-medium`}>
                Technical Details
              </summary>
              <pre className={`${errorInfo.textColor} text-xs mt-2 p-3 bg-white rounded border overflow-x-auto`}>
                {JSON.stringify(error.details, null, 2)}
              </pre>
            </details>
          )}

          {/* Current User Info */}
          {user && (
            <div className={`${errorInfo.textColor} text-sm mb-6 p-3 bg-white rounded border`}>
              <p>Currently signed in as: <strong>{user.email}</strong></p>
              <p>User ID: <code className="text-xs">{user.id}</code></p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Retry Button */}
            {errorInfo.showRetryButton && (
              <button
                onClick={handleRetry}
                disabled={isRetrying || retryCount >= MAX_RETRIES}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  isRetrying || retryCount >= MAX_RETRIES
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
                {isRetrying ? 'Retrying...' : `Retry${retryCount > 0 ? ` (${retryCount}/${MAX_RETRIES})` : ''}`}
              </button>
            )}

            {/* Sign In Button */}
            {errorInfo.showAuthButton && (
              <button
                onClick={handleSignIn}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}

            {/* Go Home Button */}
            {showReturnHome && (
              <button
                onClick={handleGoHome}
                className="flex items-center justify-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                <Home className="w-4 h-4" />
                Go Home
              </button>
            )}

            {/* Refresh Page Button */}
            <button
              onClick={handleRefreshPage}
              className="flex items-center justify-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Page
            </button>
          </div>

          {/* Help Text */}
          <div className={`${errorInfo.textColor} text-sm mt-6 p-3 bg-white rounded border`}>
            <p className="font-medium mb-2">Need help?</p>
            <ul className="text-left space-y-1">
              <li>• Check your internet connection</li>
              <li>• Clear your browser cache and cookies</li>
              <li>• Try signing out and signing in again</li>
              <li>• Contact support if the problem persists</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode={authMode}
          onModeChange={setAuthMode}
        />
      )}
    </div>
  )
}