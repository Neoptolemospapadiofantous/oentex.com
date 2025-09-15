// src/components/auth/AuthModals.tsx - REPLACE THIS FILE SIXTH (OPTIONAL - Better UX)
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Icons } from '../icons'
import { useAuth } from '../../lib/authContext'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'login' | 'register'
  onModeChange: (mode: 'login' | 'register') => void
}

// ✅ SIMPLIFIED: Clean state management
interface ModalState {
  isLoading: boolean
  loadingProvider: string | null
  success: boolean
  error: string | null
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  mode, 
  onModeChange 
}) => {
  const [state, setState] = useState<ModalState>({
    isLoading: false,
    loadingProvider: null,
    success: false,
    error: null
  })

  const { signInWithGoogle, signInWithMicrosoft } = useAuth()
  const modalRef = useRef<HTMLDivElement>(null)
  const focusTrapRef = useRef<HTMLButtonElement>(null)

  // ✅ OPTIMIZED: Memoized state updaters
  const updateState = useCallback((updates: Partial<ModalState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  const clearError = useCallback(() => {
    updateState({ error: null })
  }, [updateState])

  const resetState = useCallback(() => {
    setState({
      isLoading: false,
      loadingProvider: null,
      success: false,
      error: null
    })
  }, [])

  // ✅ ACCESSIBILITY: Focus management
  useEffect(() => {
    if (isOpen) {
      // Clear state when modal opens
      resetState()
      
      // Focus the first focusable element
      setTimeout(() => {
        focusTrapRef.current?.focus()
      }, 100)
    }
  }, [isOpen, resetState])

  // ✅ ACCESSIBILITY: Escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !state.isLoading) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose, state.isLoading])

  // ✅ ACCESSIBILITY: Focus trap
  useEffect(() => {
    if (!isOpen) return

    const modal = modalRef.current
    if (!modal) return

    const focusableElements = modal.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    modal.addEventListener('keydown', handleTabKey)
    return () => modal.removeEventListener('keydown', handleTabKey)
  }, [isOpen, state.success, state.error])

  // ✅ OPTIMIZED: OAuth sign-in handler
  const handleOAuthSignIn = useCallback(async (provider: 'google' | 'microsoft') => {
    if (state.isLoading) return
    
    clearError()
    updateState({ 
      isLoading: true, 
      loadingProvider: provider 
    })
    
    try {
      const result = provider === 'google' 
        ? await signInWithGoogle()
        : await signInWithMicrosoft()

      if (result.error) {
        updateState({ 
          isLoading: false, 
          loadingProvider: null, 
          error: result.error.message || `Failed to sign in with ${provider}. Please try again.`
        })
      } else {
        updateState({ 
          isLoading: false, 
          loadingProvider: null, 
          success: true 
        })
        
        // Auto-close after success
        setTimeout(onClose, 2000)
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : `Failed to sign in with ${provider}. Please try again.`
      
      updateState({ 
        isLoading: false, 
        loadingProvider: null, 
        error: errorMessage
      })
    }
  }, [state.isLoading, clearError, updateState, signInWithGoogle, signInWithMicrosoft, onClose])

  // ✅ OPTIMIZED: Backdrop click handler
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !state.isLoading) {
      onClose()
    }
  }, [onClose, state.isLoading])

  // ✅ ACCESSIBILITY: Microsoft icon component
  const MicrosoftIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 21 21" fill="none" aria-hidden="true">
      <path d="M10 1H1v9h9V1z" fill="#f25022"/>
      <path d="M20 1h-9v9h9V1z" fill="#7fba00"/>
      <path d="M10 11H1v9h9v-9z" fill="#00a4ef"/>
      <path d="M20 11h-9v9h9v-9z" fill="#ffb900"/>
    </svg>
  )

  // ✅ OPTIMIZED: Provider button component
  const ProviderButton: React.FC<{
    provider: 'google' | 'microsoft'
    icon: React.ReactNode
    label: string
    className: string
  }> = ({ provider, icon, label, className }) => {
    const isProviderLoading = state.loadingProvider === provider
    const isDisabled = state.isLoading
    
    return (
      <button
        onClick={() => handleOAuthSignIn(provider)}
        disabled={isDisabled}
        aria-label={`${label} - ${mode === 'login' ? 'Sign in' : 'Create account'}`}
        className={`
          relative w-full py-4 px-6 rounded-xl font-medium transition-all duration-300 
          flex items-center justify-center gap-3 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${className}
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5'}
        `}
      >
        {isProviderLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center">
            <Icons.refresh className="w-5 h-5 animate-spin" />
          </div>
        )}
        
        <div className="flex items-center gap-3">
          {icon}
          <span className="text-lg">
            {isProviderLoading ? 'Connecting...' : label}
          </span>
        </div>
      </button>
    )
  }

  if (!isOpen) return null

  const modalContent = (
    <div 
      className="fixed inset-0 z-[999999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        onClick={handleBackdropClick}
        className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="text-center flex-1">
            <h2 id="modal-title" className="text-2xl font-bold text-gray-900 mb-1">
              {mode === 'login' ? 'Welcome Back' : 'Join Oentex'}
            </h2>
            <p className="text-sm text-gray-600">
              {mode === 'login' 
                ? 'Sign in to access your trading dashboard' 
                : 'Start discovering the best trading platforms'
              }
            </p>
          </div>
          <button
            ref={focusTrapRef}
            onClick={onClose}
            disabled={state.isLoading}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close authentication modal"
          >
            <Icons.close className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {state.success ? (
            /* ✅ IMPROVED: Success State */
            <div className="text-center py-8" role="alert" aria-live="polite">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icons.success className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Success!
              </h3>
              <p className="text-gray-600">
                Redirecting you to your dashboard...
              </p>
              <div className="mt-4">
                <div className="w-32 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
                  <div className="w-full h-full bg-green-600 animate-pulse" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* ✅ ACCESSIBILITY: Error Alert */}
              {state.error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4" role="alert" aria-live="assertive">
                  <div className="flex items-center gap-3">
                    <Icons.warning className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{state.error}</p>
                  </div>
                </div>
              )}

              {/* ✅ OPTIMIZED: OAuth Buttons */}
              <div className="space-y-3">
                <ProviderButton
                  provider="google"
                  icon={<Icons.globe className="w-6 h-6" />}
                  label="Continue with Google"
                  className="bg-white border-2 border-gray-200 text-gray-900 hover:border-gray-300 hover:bg-gray-50"
                />

                <ProviderButton
                  provider="microsoft"
                  icon={<MicrosoftIcon />}
                  label="Continue with Microsoft"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                />
              </div>

              {/* Footer */}
              <div className="pt-6 space-y-4">
                {/* ✅ ACCESSIBILITY: Mode Switch */}
                <div className="text-center text-sm text-gray-600 border-t border-gray-100 pt-4">
                  {mode === 'login' ? (
                    <>
                      New to trading affiliate deals?{' '}
                      <button
                        onClick={() => onModeChange('register')}
                        disabled={state.isLoading}
                        className="text-blue-600 font-medium hover:text-blue-800 hover:underline disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:underline"
                      >
                        Create account
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        onClick={() => onModeChange('login')}
                        disabled={state.isLoading}
                        className="text-blue-600 font-medium hover:text-blue-800 hover:underline disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:underline"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </div>

                {/* Security Notice */}
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-2">
                    🔒 Secure OAuth authentication • No passwords needed
                  </p>
                  <p className="text-xs text-gray-400">
                    By continuing, you agree to our{' '}
                    <a href="/terms" className="underline hover:text-gray-600 focus:outline-none focus:text-gray-600">
                      Terms
                    </a>
                    {' '}and{' '}
                    <a href="/privacy" className="underline hover:text-gray-600 focus:outline-none focus:text-gray-600">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}