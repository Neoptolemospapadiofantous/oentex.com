// src/pages/AuthCallback.tsx - IMPROVED: Better OAuth handling
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/authContext'
import { config } from '../config'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'

interface CallbackState {
  status: 'processing' | 'success' | 'error' | 'redirecting'
  message: string
  details?: any
}

const AuthCallback: React.FC = () => {
  const navigate = useNavigate()
  const { retryAuth } = useAuth()
  const [callbackState, setCallbackState] = useState<CallbackState>({
    status: 'processing',
    message: 'Processing authentication...'
  })

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔍 AuthCallback: Starting OAuth callback processing...')
        console.log('🔍 AuthCallback: Current URL:', window.location.href)
        console.log('🔍 AuthCallback: Search params:', window.location.search)
        console.log('🔍 AuthCallback: Hash params:', window.location.hash)
        
        setCallbackState({
          status: 'processing',
          message: 'Validating authentication...'
        })

        // ✅ CRITICAL: Handle the OAuth callback using Supabase's session management
        const { data, error } = await supabase.auth.getSession()
        
        console.log('🔍 AuthCallback: Session data:', data)
        
        if (error) {
          console.error('🔍 AuthCallback: Session error:', error)
          setCallbackState({
            status: 'error',
            message: 'Authentication failed. Please try again.',
            details: error
          })
          return
        }

        if (data.session && data.session.user) {
          const user = data.session.user
          console.log('🔍 AuthCallback: OAuth successful!')
          console.log('🔍 AuthCallback: User ID:', user.id)
          console.log('🔍 AuthCallback: Email:', user.email)
          console.log('🔍 AuthCallback: Provider:', user.app_metadata?.provider)
          console.log('🔍 AuthCallback: Created at:', user.created_at)
          
          setCallbackState({
            status: 'success',
            message: `Welcome ${user.email}! Redirecting to dashboard...`,
            details: {
              userId: user.id,
              email: user.email,
              provider: user.app_metadata?.provider
            }
          })

          // ✅ IMPROVED: Give time for auth context to update, then redirect
          setTimeout(() => {
            console.log('🔍 AuthCallback: Redirecting to dashboard...')
            setCallbackState({
              status: 'redirecting',
              message: 'Taking you to your dashboard...'
            })
            
            // Navigate to dashboard
            const redirectPath = config.auth.redirectPath || '/dashboard'
            navigate(redirectPath, { replace: true })
          }, 1500) // Give user time to see success message
          
        } else {
          console.log('🔍 AuthCallback: No session found')
          console.log('🔍 AuthCallback: URL params:', window.location.search)
          
          // Check if there are error parameters in the URL
          const urlParams = new URLSearchParams(window.location.search)
          const errorParam = urlParams.get('error')
          const errorDescription = urlParams.get('error_description')
          
          if (errorParam) {
            console.error('🔍 AuthCallback: OAuth error in URL:', errorParam, errorDescription)
            setCallbackState({
              status: 'error',
              message: `Authentication failed: ${errorDescription || errorParam}`,
              details: { error: errorParam, description: errorDescription }
            })
            return
          }
          
          // No session and no error - might be a timing issue
          console.log('🔍 AuthCallback: No session, will retry...')
          setCallbackState({
            status: 'processing',
            message: 'Finalizing authentication...'
          })
          
          // Wait a bit and try again
          setTimeout(async () => {
            const { data: retryData, error: retryError } = await supabase.auth.getSession()
            
            if (retryData.session) {
              console.log('🔍 AuthCallback: Session found on retry!')
              setCallbackState({
                status: 'success',
                message: 'Authentication successful! Redirecting...'
              })
              
              setTimeout(() => {
                const redirectPath = config.auth.redirectPath || '/dashboard'
                navigate(redirectPath, { replace: true })
              }, 1000)
            } else {
              console.log('🔍 AuthCallback: Still no session, redirecting to home')
              setCallbackState({
                status: 'error',
                message: 'Authentication incomplete. Redirecting to home...'
              })
              
              setTimeout(() => {
                navigate('/', { replace: true })
              }, 2000)
            }
          }, 1000)
        }
      } catch (error) {
        console.error('🔍 AuthCallback: Unexpected error:', error)
        setCallbackState({
          status: 'error',
          message: 'An unexpected error occurred during authentication.',
          details: error
        })
      }
    }

    // Small delay to let the page settle
    const timer = setTimeout(handleAuthCallback, 300)
    return () => clearTimeout(timer)
  }, [navigate])

  const handleRetry = async () => {
    setCallbackState({
      status: 'processing',
      message: 'Retrying authentication...'
    })
    
    try {
      await retryAuth()
      // Will trigger useEffect again
    } catch (error) {
      setCallbackState({
        status: 'error',
        message: 'Retry failed. Please try signing in again.',
        details: error
      })
    }
  }

  const handleGoHome = () => {
    navigate('/', { replace: true })
  }

  // Render based on current state
  const renderContent = () => {
    switch (callbackState.status) {
      case 'processing':
        return (
          <div className="text-center">
            <LoadingSpinner className="mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {callbackState.message}
            </h2>
            <p className="text-gray-600">
              Please wait while we complete your sign-in...
            </p>
          </div>
        )

      case 'success':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Successful!
            </h2>
            <p className="text-gray-600">
              {callbackState.message}
            </p>
            {callbackState.details && (
              <div className="mt-4 text-sm text-gray-500">
                Signed in via {callbackState.details.provider}
              </div>
            )}
          </div>
        )

      case 'redirecting':
        return (
          <div className="text-center">
            <LoadingSpinner className="mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {callbackState.message}
            </h2>
          </div>
        )

      case 'error':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Failed
            </h2>
            <p className="text-gray-600 mb-6">
              {callbackState.message}
            </p>
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={handleGoHome}
                className="w-full bg-gray-200 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Return Home
              </button>
            </div>
            
            {/* Debug info in development */}
            {process.env.NODE_ENV === 'development' && callbackState.details && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">
                  Debug Info (Development Only)
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(callbackState.details, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          {renderContent()}
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default AuthCallback