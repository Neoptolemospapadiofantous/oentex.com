import React, { useState, useCallback } from 'react'
import { User, LogOut, AlertCircle } from 'lucide-react'
import { useAuth } from '../../lib/authContext'
import { AuthModal } from './AuthModals'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { ErrorBoundary } from '../ui/ErrorBoundary'

export const AuthButton: React.FC = () => {
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'login' | 'register'>('login')
  const [isSigningOut, setIsSigningOut] = useState(false)
  const { user, signOut, loading, error, retryAuth } = useAuth()

  const handleSignOut = useCallback(async () => {
    if (isSigningOut) return
    
    setIsSigningOut(true)
    
    try {
      await signOut()
    } finally {
      setIsSigningOut(false)
    }
  }, [signOut, isSigningOut])

  const handleShowLogin = useCallback(() => {
    setModalMode('login')
    setShowModal(true)
  }, [])

  const handleShowRegister = useCallback(() => {
    setModalMode('register')
    setShowModal(true)
  }, [])

  if (loading) {
    return <LoadingSpinner variant="auth" size="sm" text="Loading..." />
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2">
        <AlertCircle className="w-4 h-4 text-red-500" />
        <button
          onClick={retryAuth}
          className="text-sm text-red-500 hover:text-red-700 underline"
        >
          Retry
        </button>
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 text-textSecondary">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium hidden sm:block">
            {user.user_metadata?.full_name || 
             user.email?.split('@')[0] || 
             'User'}
          </span>
        </div>
        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="flex items-center space-x-1 text-textSecondary hover:text-text transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-surface hover:bg-background border border-border rounded-lg px-3 py-2"
          title="Sign Out"
        >
          {isSigningOut ? (
            <LoadingSpinner variant="auth" size="sm" showIcon={true} />
          ) : (
            <LogOut className="w-4 h-4" />
          )}
          <span className="text-sm hidden sm:block">
            {isSigningOut ? 'Signing out...' : 'Sign Out'}
          </span>
        </button>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="flex items-center space-x-3">
        <button
          onClick={handleShowLogin}
          className="text-textSecondary hover:text-text transition-colors duration-300 font-medium px-3 py-2 rounded-lg hover:bg-surface"
        >
          Sign In
        </button>
        <button
          onClick={handleShowRegister}
          className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg font-medium hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 transform hover:scale-105"
        >
          Get Started
        </button>
      </div>

      {showModal && (
        <AuthModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          mode={modalMode}
          onModeChange={setModalMode}
        />
      )}
    </ErrorBoundary>
  )
}