// AuthCallback.tsx - OPTION 1: Simple redirect, Dashboard handles OAuth detection
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
        console.log('🔍 AuthCallback: Processing OAuth callback...')
        
        setIsProcessing(true)
        
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('🔍 AuthCallback: Session error:', error)
          setError('Authentication failed. Please try again.')
          setIsProcessing(false)
          return
        }

        if (data.session) {
          console.log('🔍 AuthCallback: OAuth successful!')
          console.log('🔍 AuthCallback: User:', data.session.user.email)
          console.log('🔍 AuthCallback: Provider:', data.session.user?.app_metadata?.provider)
          
          // Simple redirect - Dashboard will handle OAuth detection via session
          setTimeout(() => {
            console.log('🔍 AuthCallback: Redirecting to dashboard...')
            const redirectPath = config.auth.redirectPath || '/dashboard'
            navigate(redirectPath, { replace: true })
          }, 300)
          
        } else {
          console.log('🔍 AuthCallback: No session, redirecting to home')
          navigate('/', { replace: true })
        }
      } catch (error) {
        console.error('🔍 AuthCallback: Error:', error)
        setError('Authentication failed. Please try again.')
        setIsProcessing(false)
      }
    }

    const timer = setTimeout(handleAuthCallback, 200)
    return () => clearTimeout(timer)
  }, [navigate])

  const handleRetry = async () => {
    setError(null)
    setIsProcessing(true)
    
    try {
      await retryAuth()
      navigate('/')
    } catch (error) {
      setError('Retry failed. Please try again.')
      setIsProcessing(false)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h3 className="text-red-800 font-medium mb-2">Authentication Error</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <button
            onClick={handleRetry}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-6" />
          <h2 className="text-xl font-semibold text-text mb-2">
            Completing Sign In
          </h2>
          <p className="text-textSecondary">
            Processing your authentication...
          </p>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default AuthCallback