import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { config } from '../config'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'

const AuthCallback: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Check for URL error first (no API call needed)
        const urlError = searchParams.get('error')
        if (urlError) {
          setError('Authentication failed. Please try again.')
          return
        }

        // Get redirect destination
        const redirectTo = searchParams.get('redirect_to') || config.auth?.redirectPath || '/dashboard'

        // Handle auth code (most common case) - SINGLE API call
        const code = searchParams.get('code')
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (exchangeError) {
            setError('Authentication failed. Please try again.')
            return
          }

          // Success - redirect immediately (no additional session check needed)
          navigate(redirectTo, { replace: true })
          return
        }

        // Handle hash tokens (less common) - SINGLE API call
        if (window.location.hash.includes('access_token')) {
          // Clean URL hash
          if (window.history.replaceState) {
            window.history.replaceState(null, '', window.location.pathname)
          }
          
          // Supabase automatically handles hash tokens, just redirect
          navigate(redirectTo, { replace: true })
          return
        }

        // Fallback: Check existing session - SINGLE API call
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