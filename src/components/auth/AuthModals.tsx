import React, { useState, useEffect } from 'react'
import { X, Chrome } from 'lucide-react'
import { useAuth } from '../../lib/authContext'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'
import { FocusManager } from '../ui/FocusManager'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import toast from 'react-hot-toast'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'login' | 'register'
  onModeChange: (mode: 'login' | 'register') => void
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onModeChange }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)
  const [loginSuccess, setLoginSuccess] = useState(false)

  const { signInWithGoogle, signInWithMicrosoft } = useAuth()

  useBodyScrollLock(isOpen)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose, isLoading])

  const handleOAuthSignIn = async (provider: 'google' | 'microsoft') => {
    if (isLoading) return
    
    setIsLoading(true)
    setLoadingProvider(provider)
    
    try {
      let result
      
      switch (provider) {
        case 'google':
          result = await signInWithGoogle()
          break
        case 'microsoft':
          result = await signInWithMicrosoft()
          break
        default:
          throw new Error('Unknown provider')
      }

      if (!result.error) {
        setLoginSuccess(true)
        
        setTimeout(() => {
          onClose()
          setLoginSuccess(false)
        }, 1000)
      } else {
        toast.error(result.error.message)
      }
    } catch (error) {
      toast.error(`Failed to sign in with ${provider}. Please try again.`)
    } finally {
      setIsLoading(false)
      setLoadingProvider(null)
    }
  }

  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose()
    }
  }

  const MicrosoftIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 21 21" fill="none">
      <path d="M10 1H1v9h9V1z" fill="#f25022"/>
      <path d="M20 1h-9v9h9V1z" fill="#7fba00"/>
      <path d="M10 11H1v9h9v-9z" fill="#00a4ef"/>
      <path d="M20 11h-9v9h9v-9z" fill="#ffb900"/>
    </svg>
  )

  return (
    <FocusManager>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={handleOverlayClick}
      >
        <div className="bg-surface border border-border rounded-xl max-w-md w-full">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="text-center flex-1">
              <h2 className="text-xl font-semibold text-text">
                {mode === 'login' ? 'Welcome Back' : 'Join TradeBest'}
              </h2>
              <p className="text-sm text-textSecondary mt-1">
                {mode === 'login' 
                  ? 'Sign in to access exclusive trading deals' 
                  : 'Start discovering the best trading affiliate offers'
                }
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-textSecondary hover:text-text transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-4"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {loginSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text mb-2">Authentication Started!</h3>
                <p className="text-textSecondary">Redirecting you to complete sign in...</p>
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleOAuthSignIn('google')}
                  disabled={isLoading}
                  className="w-full bg-white border border-border text-text py-4 px-6 rounded-lg font-medium hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {loadingProvider === 'google' ? (
                    <LoadingSpinner variant="auth" size="sm" />
                  ) : (
                    <Chrome className="w-6 h-6" />
                  )}
                  <span className="text-lg">Continue with Google</span>
                </button>

                <button
                  onClick={() => handleOAuthSignIn('microsoft')}
                  disabled={isLoading}
                  className="w-full bg-[#0078d4] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#106ebe] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loadingProvider === 'microsoft' ? (
                    <LoadingSpinner variant="auth" size="sm" />
                  ) : (
                    <MicrosoftIcon />
                  )}
                  Continue with Microsoft
                </button>

                <div className="text-center text-sm text-textSecondary pt-4 border-t border-border">
                  {mode === 'login' ? (
                    <>
                      New to trading affiliate deals?{' '}
                      <button
                        onClick={() => onModeChange('register')}
                        disabled={isLoading}
                        className="text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        Join now
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        onClick={() => onModeChange('login')}
                        disabled={isLoading}
                        className="text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </div>

                <div className="text-center pt-4">
                  <p className="text-xs text-textSecondary">
                    🔒 Secure OAuth authentication • No passwords needed
                  </p>
                  <p className="text-xs text-textSecondary mt-1">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </FocusManager>
  )
}