// src/pages/AuthCallback.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/authContext'
import { config } from '../config'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'
import toast from 'react-hot-toast'

const AuthCallback: React.FC = () => {
  const navigate = useNavigate()
  const { retryAuth } = useAuth()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          setError('Authentication failed. Please try again.')
          return
        }

        if (data.session) {
          toast.success('Successfully signed in!')
          navigate(config.auth.redirectPath)
        } else {
          navigate('/')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        setError('Authentication failed. Please try again.')
      }
    }

    handleAuthCallback()
  }, [navigate])

  const handleRetry = async () => {
    setError(null)
    await retryAuth()
    navigate('/')
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
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
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-textSecondary">Completing sign in...</p>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default AuthCallback