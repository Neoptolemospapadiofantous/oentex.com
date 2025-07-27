import React from 'react'
import { useAuth } from '../../lib/authContext'
import { AuthModal } from './AuthModals'
import { useState } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectToLogin?: boolean
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback,
  redirectToLogin = false 
}) => {
  const { user, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-textSecondary">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  if (redirectToLogin) {
    return (
      <>
        <div className="min-h-screen pt-20 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-text mb-4">Authentication Required</h2>
            <p className="text-textSecondary mb-6">
              Please sign in to access this content.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setAuthMode('login')
                  setShowAuthModal(true)
                }}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 px-4 rounded-lg font-medium hover:from-primary/90 hover:to-secondary/90 transition-all"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthMode('register')
                  setShowAuthModal(true)
                }}
                className="w-full border border-border text-text py-3 px-4 rounded-lg font-medium hover:bg-background transition-all"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode={authMode}
          onModeChange={setAuthMode}
        />
      </>
    )
  }

  return <>{children}</>
}