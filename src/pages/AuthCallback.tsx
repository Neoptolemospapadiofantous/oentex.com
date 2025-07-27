// src/pages/AuthCallback.tsx - Following Official Supabase PKCE Documentation
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/authContext'
import { config } from '../config'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'

interface CallbackState {
  status: 'processing' | 'success' | 'error' | 'redirecting'
  message: string
  details?: any
  errorCode?: string
  errorDescription?: string
}

const AuthCallback: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { retryAuth } = useAuth()
  const [callbackState, setCallbackState] = useState<CallbackState>({
    status: 'processing',
    message: 'Processing OAuth callback...'
  })

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const currentUrl = window.location.href
        const code = searchParams.get('code')
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')
        
        console.log('🔍 AuthCallback: Starting OAuth callback processing...')
        console.log('🔍 AuthCallback: Current URL:', currentUrl)
        console.log('🔍 AuthCallback: Code parameter:', code ? 'present' : 'missing')
        console.log('🔍 AuthCallback: Error parameter:', error || 'none')
        
        // ✅ OFFICIAL SUPABASE: Handle OAuth errors first
        if (error) {
          console.error('🔍 AuthCallback: OAuth error found:', error, errorDescription)
          setCallbackState({
            status: 'error',
            message: 'Authentication failed',
            details: { error, errorDescription },
            errorCode: error,
            errorDescription: errorDescription || undefined
          })
          return
        }
        
        // ✅ OFFICIAL SUPABASE: Handle PKCE code exchange
        if (code) {
          console.log('🔍 AuthCallback: PKCE code found, exchanging for session...')
          setCallbackState({
            status: 'processing',
            message: 'Exchanging authorization code for session...'
          })

          // Following official Supabase documentation for code exchange
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (exchangeError) {
            console.error('🔍 AuthCallback: Code exchange error:', exchangeError)
            setCallbackState({
              status: 'error',
              message: 'Failed to exchange authorization code for session',
              details: exchangeError,
              errorCode: exchangeError.code,
              errorDescription: exchangeError.message
            })
            return
          }

          if (data.session && data.user) {
            const user = data.user
            const session = data.session
            
            console.log('🔍 AuthCallback: PKCE code exchange successful!')
            console.log('🔍 AuthCallback: User ID:', user.id)
            console.log('🔍 AuthCallback: Email:', user.email)
            console.log('🔍 AuthCallback: Provider:', user.app_metadata?.provider)
            console.log('🔍 AuthCallback: Session expires:', new Date(session.expires_at! * 1000).toISOString())
            
            setCallbackState({
              status: 'success',
              message: `Welcome ${user.email || 'back'}! Setting up your dashboard...`,
              details: {
                userId: user.id,
                email: user.email,
                provider: user.app_metadata?.provider,
                expiresAt: session.expires_at
              }
            })

            // ✅ Redirect after successful authentication
            setTimeout(() => {
              console.log('🔍 AuthCallback: Redirecting to dashboard...')
              setCallbackState({
                status: 'redirecting',
                message: 'Taking you to your dashboard...'
              })
              
              const redirectPath = config.auth.redirectPath || '/dashboard'
              navigate(redirectPath, { replace: true })
            }, 1500)
            
          } else {
            console.error('🔍 AuthCallback: Code exchange succeeded but no session/user returned')
            setCallbackState({
              status: 'error',
              message: 'Authentication succeeded but session could not be established',
              details: { data, noSession: true }
            })
          }
          return
        }
        
        // ✅ FALLBACK: Try to get existing session (implicit flow or session already exists)
        console.log('🔍 AuthCallback: No code parameter, checking for existing session...')
        setCallbackState({
          status: 'processing',
          message: 'Checking authentication status...'
        })
        
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('🔍 AuthCallback: Session check error:', sessionError)
          setCallbackState({
            status: 'error',
            message: 'Failed to verify authentication session',
            details: sessionError,
            errorCode: sessionError.code,
            errorDescription: sessionError.message
          })
          return
        }

        if (sessionData.session && sessionData.session.user) {
          const user = sessionData.session.user
          console.log('🔍 AuthCallback: Existing session found!')
          console.log('🔍 AuthCallback: User:', user.email)
          
          setCallbackState({
            status: 'success',
            message: `Welcome back ${user.email}! Redirecting...`,
            details: {
              userId: user.id,
              email: user.email,
              provider: user.app_metadata?.provider
            }
          })
          
          setTimeout(() => {
            const redirectPath = config.auth.redirectPath || '/dashboard'
            navigate(redirectPath, { replace: true })
          }, 1000)
          
        } else {
          console.log('🔍 AuthCallback: No session found, redirecting to home')
          setCallbackState({
            status: 'error',
            message: 'No authentication session found. Please try signing in again.',
            details: { noSession: true, url: currentUrl }
          })
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
  }, [navigate, searchParams])

  const handleRetry = async () => {
    setCallbackState({
      status: 'processing',
      message: 'Retrying authentication...'
    })
    
    try {
      await retryAuth()
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

  const handleTryAgain = () => {
    // Clear URL parameters and redirect to home for fresh sign-in
    window.location.href = '/'
  }

  // ✅ SUPABASE: Error message mapping based on OAuth error codes
  const getErrorMessage = (): string => {
    const { errorCode, errorDescription } = callbackState
    
    if (!errorCode) return callbackState.message
    
    // Map OAuth error codes to user-friendly messages
    switch (errorCode) {
      case 'access_denied':
        return 'You cancelled the sign-in process. Please try again if you want to continue.'
      case 'invalid_request':
        return 'Invalid authentication request. Please try signing in again.'
      case 'unsupported_response_type':
        return 'Authentication method not supported. Please contact support.'
      case 'invalid_scope':
        return 'Invalid permissions requested. Please contact support.'
      case 'server_error':
        return 'Authentication server error. Please try again in a moment.'
      case 'temporarily_unavailable':
        return 'Authentication service temporarily unavailable. Please try again later.'
      default:
        if (errorCode.startsWith('4')) {
          return `Authentication failed: ${errorDescription || 'Please try again'}`
        }
        return errorDescription || 'Authentication failed. Please try again.'
    }
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
              Following official Supabase OAuth flow...
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
              {getErrorMessage()}
            </p>
            
            <div className="space-y-3">
              {callbackState.errorCode === 'access_denied' ? (
                <button
                  onClick={handleTryAgain}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Signing In Again
                </button>
              ) : (
                <button
                  onClick={handleRetry}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Retry Authentication
                </button>
              )}
              
              <button
                onClick={handleGoHome}
                className="w-full bg-gray-200 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Return Home
              </button>
            </div>
            
            {/* Error details for debugging */}
            {callbackState.errorCode && (
              <div className="mt-4 text-xs text-gray-500">
                Error Code: {callbackState.errorCode}
              </div>
            )}
            
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