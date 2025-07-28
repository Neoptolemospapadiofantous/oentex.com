import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { config } from '../config'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'

interface CallbackState {
  status: 'processing' | 'success' | 'error'
  message: string
  errorCode?: string
}

const AuthCallback: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [callbackState, setCallbackState] = useState<CallbackState>({
    status: 'processing',
    message: 'Processing authentication...'
  })

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Check for OAuth errors first
        const oauthError = searchParams.get('error')
        if (oauthError) {
          setCallbackState({
            status: 'error',
            message: oauthError === 'access_denied' 
              ? 'Sign-in cancelled. Please try again.' 
              : 'Authentication failed. Please try again.',
            errorCode: oauthError
          })
          return
        }

        // Handle authorization code (PKCE flow)
        const code = searchParams.get('code')
        if (code) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          if (exchangeError) throw exchangeError
          if (data.session?.user) {
            setCallbackState({
              status: 'success',
              message: `Welcome back! Redirecting...`
            })
            const redirectPath = config.auth.redirectPath || '/dashboard'
            navigate(redirectPath, { replace: true })
            return
          }
        }

        // Handle hash tokens (implicit flow)
        const hash = window.location.hash
        if (hash.includes('access_token')) {
          const { data, error: sessionError } = await supabase.auth.getSession()
          if (sessionError) throw sessionError
          if (data.session?.user) {
            // Clean up URL hash
            window.history.replaceState(null, '', window.location.pathname)
            setCallbackState({
              status: 'success',
              message: `Welcome back! Redirecting...`
            })
            const redirectPath = config.auth.redirectPath || '/dashboard'
            navigate(redirectPath, { replace: true })
            return
          }
        }

        // Check for existing session
        const { data, error: finalSessionError } = await supabase.auth.getSession()
        if (finalSessionError) throw finalSessionError
        
        if (data.session?.user) {
          setCallbackState({
            status: 'success',
            message: `Welcome back! Redirecting...`
          })
          const redirectPath = config.auth.redirectPath || '/dashboard'
          navigate(redirectPath, { replace: true })
        } else {
          setCallbackState({
            status: 'error',
            message: 'No active session found. Please sign in again.'
          })
        }

      } catch (authError) {
        console.error('Auth error:', authError)
        setCallbackState({
          status: 'error',
          message: 'Authentication failed. Please try again.'
        })
      }
    }

    handleAuth()
  }, [navigate, searchParams])

  const handleGoHome = () => navigate('/', { replace: true })
  const handleTryAgain = () => window.location.href = '/'

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            {callbackState.status === 'processing' && (
              <>
                <LoadingSpinner className="mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {callbackState.message}
                </h2>
                <p className="text-gray-600">
                  Please wait while we sign you in...
                </p>
              </>
            )}

            {callbackState.status === 'success' && (
              <>
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
              </>
            )}

            {callbackState.status === 'error' && (
              <>
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
                    onClick={callbackState.errorCode === 'access_denied' ? handleTryAgain : handleTryAgain}
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
              </>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default AuthCallback