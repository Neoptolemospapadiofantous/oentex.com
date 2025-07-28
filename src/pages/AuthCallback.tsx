import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/authContext'
import { config } from '../config'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'

interface CallbackState {
  status: 'processing' | 'error'
  message: string
  details?: any
  errorCode?: string
  errorDescription?: string
}

interface OAuthTokens {
  access_token?: string
  refresh_token?: string
  expires_at?: string
  expires_in?: string
  provider_token?: string
  provider_refresh_token?: string
  token_type?: string
}

const AuthCallback: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { retryAuth } = useAuth()
  const [callbackState, setCallbackState] = useState<CallbackState>({
    status: 'processing',
    message: 'Processing authentication...'
  })

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const currentUrl = window.location.href
        const urlHash = window.location.hash
        const code = searchParams.get('code')
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')
        
        // Handle OAuth errors immediately
        if (error) {
          setCallbackState({
            status: 'error',
            message: 'Authentication failed',
            details: { error, errorDescription },
            errorCode: error,
            errorDescription: errorDescription || undefined
          })
          return
        }
        
        // Handle implicit flow (hash-based tokens)
        if (urlHash && urlHash.includes('access_token')) {
          setCallbackState({
            status: 'processing',
            message: 'Verifying authentication...'
          })

          const tokens = parseTokensFromHash(urlHash)

          if (tokens.access_token) {
            try {
              const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
              
              if (sessionError) {
                setCallbackState({
                  status: 'error',
                  message: 'Failed to verify authentication session',
                  details: sessionError,
                  errorCode: sessionError.code,
                  errorDescription: sessionError.message
                })
                return
              }

              if (sessionData.session?.user) {
                const user = sessionData.session.user
                
                // Clean up URL hash immediately
                if (window.history.replaceState) {
                  window.history.replaceState(null, '', window.location.pathname)
                }

                // Clean up URL hash immediately
                if (window.history.replaceState) {
                  window.history.replaceState(null, '', window.location.pathname)
                }

                // Direct redirect without any delay
                const redirectPath = config.auth.redirectPath || '/dashboard'
                navigate(redirectPath, { replace: true })
                
              } else {
                setCallbackState({
                  status: 'error',
                  message: 'Authentication tokens received but session could not be established',
                  details: { tokens, noSession: true }
                })
              }
            } catch (sessionError) {
              setCallbackState({
                status: 'error',
                message: 'Error processing authentication session',
                details: sessionError
              })
            }
            return
          }
        }
        
        // Handle authorization code flow (PKCE)
        if (code) {
          setCallbackState({
            status: 'processing',
            message: 'Completing sign-in...'
          })

          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (exchangeError) {
            setCallbackState({
              status: 'error',
              message: 'Failed to complete authentication',
              details: exchangeError,
              errorCode: exchangeError.code,
              errorDescription: exchangeError.message
            })
            return
          }

          if (data.session?.user) {
            // Direct redirect without showing success state
            const redirectPath = config.auth.redirectPath || '/dashboard'
            navigate(redirectPath, { replace: true })
          }
          return
        }
        
        // Fallback: check for existing session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          setCallbackState({
            status: 'error',
            message: 'Failed to verify authentication session',
            details: sessionError
          })
          return
        }

        if (sessionData.session?.user) {
          // Direct redirect for existing sessions
          const redirectPath = config.auth.redirectPath || '/dashboard'
          navigate(redirectPath, { replace: true })
        } else {
          setCallbackState({
            status: 'error',
            message: 'No authentication session found. Please try signing in again.',
            details: { noSession: true, url: currentUrl }
          })
        }
        
      } catch (error) {
        setCallbackState({
          status: 'error',
          message: 'An unexpected error occurred during authentication.',
          details: error
        })
      }
    }

    const parseTokensFromHash = (hash: string): OAuthTokens => {
      const tokens: OAuthTokens = {}
      const params = new URLSearchParams(hash.slice(1))
      
      tokens.access_token = params.get('access_token') || undefined
      tokens.refresh_token = params.get('refresh_token') || undefined
      tokens.expires_at = params.get('expires_at') || undefined
      tokens.expires_in = params.get('expires_in') || undefined
      tokens.provider_token = params.get('provider_token') || undefined
      tokens.provider_refresh_token = params.get('provider_refresh_token') || undefined
      tokens.token_type = params.get('token_type') || undefined
      
      return tokens
    }

    // Start auth callback handling immediately (no delay)
    handleAuthCallback()
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
    window.location.href = '/'
  }

  const getErrorMessage = (): string => {
    const { errorCode, errorDescription } = callbackState
    
    if (!errorCode) return callbackState.message
    
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
              Please wait a moment...
            </p>
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