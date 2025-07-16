// Fixed AuthCallback.tsx - Simple OAuth flag setting
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/authContext'
import { config } from '../config'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'

const AuthCallback: React.FC = () => {
  const navigate = useNavigate()
  const { retryAuth } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔍 AuthCallback: Starting OAuth processing...')
        console.log('🔍 AuthCallback: Current URL:', window.location.href)
        
        setIsProcessing(true)
        
        // Clear any existing flags to prevent confusion
        localStorage.removeItem('oauth_login_success')
        sessionStorage.removeItem('oauth_welcome_shown')
        
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('🔍 AuthCallback: Session error:', error)
          setError('Authentication failed. Please try again.')
          setIsProcessing(false)
          return
        }

        console.log('🔍 AuthCallback: Session data:', data)

        if (data.session) {
          console.log('🔍 AuthCallback: OAuth successful!')
          console.log('🔍 AuthCallback: User:', data.session.user.email)
          console.log('🔍 AuthCallback: Provider:', data.session.user?.app_metadata?.provider)
          
          // Get provider info
          const provider = data.session.user?.app_metadata?.provider || 'unknown'
          const providerName = provider === 'google' ? 'Google' : 
                              provider === 'azure' ? 'Microsoft' : 
                              provider === 'solana' ? 'Solana Wallet' : 'OAuth'
          
          console.log('🔍 AuthCallback: Setting OAuth success flag:', providerName)
          
          // ✅ Set localStorage flag - AuthContext will pick it up during initialization
          localStorage.setItem('oauth_login_success', providerName)
          
          // Small delay to ensure everything is set
          setTimeout(() => {
            console.log('🔍 AuthCallback: Redirecting to dashboard...')
            const redirectPath = config.auth.redirectPath || '/dashboard'
            navigate(redirectPath, { replace: true })
          }, 300)
          
        } else {
          console.log('🔍 AuthCallback: No session found, redirecting to home')
          setIsProcessing(false)
          navigate('/', { replace: true })
        }
      } catch (error) {
        console.error('🔍 AuthCallback: Unexpected error:', error)
        setError('Authentication failed. Please try again.')
        setIsProcessing(false)
      }
    }

    // Start processing after a small delay to ensure DOM is ready
    const timer = setTimeout(handleAuthCallback, 200)
    
    return () => clearTimeout(timer)
  }, [navigate])

  const handleRetry = async () => {
    console.log('🔍 AuthCallback: Retrying authentication...')
    setError(null)
    setIsProcessing(true)
    
    try {
      await retryAuth()
      navigate('/')
    } catch (error) {
      console.error('🔍 AuthCallback: Retry failed:', error)
      setError('Retry failed. Please try again.')
      setIsProcessing(false)
    }
  }

  const handleGoHome = () => {
    console.log('🔍 AuthCallback: Going to home page...')
    navigate('/')
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h3 className="text-red-800 font-medium mb-2">Authentication Error</h3>
            <p className="text-red-600 text-sm mb-3">{error}</p>
            <p className="text-red-500 text-xs">Please check the console for more details.</p>
          </div>
          <div className="space-x-3">
            <button
              onClick={handleRetry}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleGoHome}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-6" />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-text">
              {isProcessing ? 'Completing Sign In' : 'Processing...'}
            </h2>
            <p className="text-textSecondary">
              {isProcessing 
                ? 'Processing your OAuth authentication...' 
                : 'Please wait while we set up your account...'
              }
            </p>
            <div className="flex items-center justify-center space-x-1 mt-4">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default AuthCallback