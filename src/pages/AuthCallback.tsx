import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { config } from '../config'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'

const AuthCallback: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<string>('Signing you in...')

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Get dynamic values from URL or config
        const urlError = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')
        const provider = searchParams.get('provider') || 'your account'
        const redirectTo = searchParams.get('redirect_to') || config.auth?.redirectPath || '/dashboard'
        const code = searchParams.get('code')

        // Handle URL errors dynamically
        if (urlError) {
          const errorMessages: Record<string, string> = {
            'access_denied': `You cancelled the ${provider} sign-in. Please try again if you want to continue.`,
            'invalid_request': 'Invalid sign-in request. Please try again.',
            'server_error': 'Sign-in server error. Please try again in a moment.',
            'temporarily_unavailable': 'Sign-in service temporarily unavailable. Please try again later.'
          }
          setError(errorMessages[urlError] || errorDescription || 'Authentication failed. Please try again.')
          return
        }

        // Handle authorization code flow
        if (code) {
          setLoading(`Completing ${provider} sign-in...`)
          
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (exchangeError) {
            setError(`Failed to complete ${provider} sign-in. Please try again.`)
            return
          }

          if (data.session) {
            // Clean up URL
            if (window.history.replaceState) {
              window.history.replaceState(null, '', window.location.pathname)
            }
            
            // Dynamic redirect
            navigate(redirectTo, { replace: true })
            return
          }
        }

        // Handle hash-based tokens (implicit flow)
        const hash = window.location.hash
        if (hash && hash.includes('access_token')) {
          setLoading('Processing authentication tokens...')
          
          const { data: sessionData } = await supabase.auth.getSession()
          
          if (sessionData.session) {
            // Clean up URL hash
            if (window.history.replaceState) {
              window.history.replaceState(null, '', window.location.pathname)
            }
            
            navigate(redirectTo, { replace: true })
            return
          }
        }

        // Check for existing session
        setLoading('Checking authentication status...')
        const { data: sessionData } = await supabase.auth.getSession()
        
        if (sessionData.session) {
          navigate(redirectTo, { replace: true })
          return
        }

        // No authentication found
        setError('No authentication session found. Please try signing in again.')
        
      } catch (err: any) {
        console.error('Auth callback error:', err)
        setError(err.message || 'Something went wrong during sign-in. Please try again.')
      }
    }

    handleAuth()
  }, [navigate, searchParams])

  // Dynamic error handling
  const getRetryAction = () => {
    const provider = searchParams.get('provider')
    const errorCode = searchParams.get('error')
    
    if (errorCode === 'access_denied') {
      return {
        text: `Try ${provider || 'signing in'} again`,
        action: () => navigate('/', { replace: true })
      }
    }
    
    return {
      text: 'Try again',
      action: () => window.location.href = '/'
    }
  }

  // Dynamic loading messages
  const getLoadingMessage = () => {
    const provider = searchParams.get('provider')
    const code = searchParams.get('code')
    
    if (code) return `Completing ${provider || ''} sign-in...`.trim()
    if (window.location.hash.includes('access_token')) return 'Processing authentication...'
    return 'Checking your sign-in status...'
  }

  if (error) {
    const retryAction = getRetryAction()
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign-in Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          
          <div className="space-y-3">
            <button
              onClick={retryAction.action}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {retryAction.text}
            </button>
            
            <button
              onClick={() => navigate('/', { replace: true })}
              className="w-full bg-gray-200 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Return Home
            </button>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm text-gray-500">Debug Info</summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify({
                  searchParams: Object.fromEntries(searchParams),
                  hash: window.location.hash,
                  error
                }, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <LoadingSpinner className="mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{getLoadingMessage()}</h2>
        <p className="text-gray-600">Please wait a moment</p>
      </div>
    </div>
  )
}

export default AuthCallback