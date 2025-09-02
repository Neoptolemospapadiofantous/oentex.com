// AuthCallback.tsx - MINIMAL FIX: Just add Microsoft email error detection
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { config } from '../../config'
import { LoadingSpinner } from '@components/ui/LoadingSpinner'

const AuthCallback: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // 🎯 SIMPLE FIX: Check for Microsoft email error first
        const urlError = searchParams.get('error')
        const errorCode = searchParams.get('error_code')
        const errorDescription = searchParams.get('error_description')
        
        if (urlError) {
          // Special handling for Microsoft email error
          if (errorCode === 'unexpected_failure' && errorDescription?.includes('email')) {
            setError('Microsoft email access required. Please verify your email at account.microsoft.com or try Google sign-in.')
            return
          }
          
          setError('Authentication failed. Please try again.')
          return
        }

        // Get redirect destination
        const redirectTo = searchParams.get('redirect_to') || config.auth?.redirectPath || '/dashboard'

        // Handle auth code (most common case)
        const code = searchParams.get('code')
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (exchangeError) {
            // 🎯 SIMPLE FIX: Check for Microsoft email error in exchange
            if (exchangeError.message?.includes('email') && 
                exchangeError.message?.includes('external provider')) {
              setError('Microsoft email access required. Please verify your email at account.microsoft.com or try Google sign-in.')
              return
            }
            
            setError('Authentication failed. Please try again.')
            return
          }

          // Success - redirect immediately
          navigate(redirectTo, { replace: true })
          return
        }

        // Handle hash tokens (less common)
        if (window.location.hash.includes('access_token')) {
          if (window.history.replaceState) {
            window.history.replaceState(null, '', window.location.pathname)
          }
          
          navigate(redirectTo, { replace: true })
          return
        }

        // Fallback: Check existing session
        const { data } = await supabase.auth.getSession()
        if (data.session) {
          navigate(redirectTo, { replace: true })
          return
        }

        // No auth found
        setError('Please try signing in again.')
        
      } catch (err) {
        setError('Something went wrong. Please try again.')
      }
    }

    handleAuth()
  }, [navigate, searchParams])

  if (error) {
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
          <button
            onClick={() => navigate('/', { replace: true })}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <LoadingSpinner className="mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Signing you in...</h2>
      </div>
    </div>
  )
}

export default AuthCallback