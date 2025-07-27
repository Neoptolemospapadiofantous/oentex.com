// src/pages/AuthCallback.tsx - FIXED: Handle implicit flow tokens from URL hash
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
    message: 'Processing OAuth callback...'
  })

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const currentUrl = window.location.href
        const urlHash = window.location.hash
        const code = searchParams.get('code')
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')
        
        console.log('🔍 AuthCallback: Starting OAuth callback processing...')
        console.log('🔍 AuthCallback: Current URL:', currentUrl)
        console.log('🔍 AuthCallback: Hash fragment:', urlHash)
        console.log('🔍 AuthCallback: Code parameter:', code ? 'present' : 'missing')
        console.log('🔍 AuthCallback: Error parameter:', error || 'none')
        
        // ✅ Handle OAuth errors first
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
        
        // ✅ CRITICAL: Handle implicit flow tokens in hash fragment
        if (urlHash && urlHash.includes('access_token')) {
          console.log('🔍 AuthCallback: Implicit flow tokens detected in hash fragment')
          
          setCallbackState({
            status: 'processing',
            message: 'Processing OAuth tokens...'
          })

          // Parse tokens from hash fragment
          const tokens = parseTokensFromHash(urlHash)
          console.log('🔍 AuthCallback: Parsed tokens:', {
            hasAccessToken: !!tokens.access_token,
            hasRefreshToken: !!tokens.refresh_token,
            expiresAt: tokens.expires_at,
            tokenType: tokens.token_type
          })

          if (tokens.access_token) {
            // ✅ IMPLICIT FLOW: Tokens are already available, just need to set session
            console.log('🔍 AuthCallback: Setting session with implicit flow tokens...')
            
            try {
              // For implicit flow, the session should already be set by Supabase
              // Let's verify the session exists
              const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
              
              if (sessionError) {
                console.error('🔍 AuthCallback: Session verification error:', sessionError)
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
                const session = sessionData.session
                
                console.log('🔍 AuthCallback: Implicit flow session verified!')
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
                    expiresAt: session.expires_at,
                    flowType: 'implicit'
                  }
                })

                // Clear the hash fragment from URL for security
                if (window.history.replaceState) {
                  window.history.replaceState(null, '', window.location.pathname)
                }

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
                // Session not found, but tokens are present - this shouldn't happen
                console.error('🔍 AuthCallback: Tokens present but no session found')
                setCallbackState({
                  status: 'error',
                  message: 'Authentication tokens received but session could not be established',
                  details: { tokens, noSession: true }
                })
              }
            } catch (sessionError) {
              console.error('🔍 AuthCallback: Session processing error:', sessionError)
              setCallbackState({
                status: 'error',
                message: 'Error processing authentication session',
                details: sessionError
              })
            }
            return
          }
        }
        
        // ✅ Handle PKCE flow (code parameter)
        if (code) {
          console.log('🔍 AuthCallback: PKCE code found, exchanging for session...')
          setCallbackState({
            status: 'processing',
            message: 'Exchanging authorization code for session...'
          })

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
            
            setCallbackState({
              status: 'success',
              message: `Welcome ${user.email || 'back'}! Setting up your dashboard...`,
              details: {
                userId: user.id,
                email: user.email,
                provider: user.app_metadata?.provider,
                expiresAt: session.expires_at,
                flowType: 'pkce'
              }
            })

            setTimeout(() => {
              console.log('🔍 AuthCallback: Redirecting to dashboard...')
              setCallbackState({
                status: 'redirecting',
                message: 'Taking you to your dashboard...'
              })
              
              const redirectPath = config.auth.redirectPath || '/dashboard'
              navigate(redirectPath, { replace: true })
            }, 1500)
          }
          return
        }
        
        // ✅ FALLBACK: Try to get existing session
        console.log('🔍 AuthCallback: No tokens or code found, checking for existing session...')
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
            details: sessionError
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
              provider: user.app_metadata?.provider,
              flowType: 'existing'
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

    // Parse tokens from URL hash fragment (implicit flow)
    const parseTokensFromHash = (hash: string): OAuthTokens => {
      const tokens: OAuthTokens = {}
      
      // Remove the # and parse as URLSearchParams
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

  // ✅ Error message mapping
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
              {callbackState.message.includes('tokens') 
                ? 'Processing OAuth tokens from Google...'
                : 'Following Supabase OAuth flow...'
              }
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
                Signed in via {callbackState.details.provider} ({callbackState.details.flowType} flow)
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