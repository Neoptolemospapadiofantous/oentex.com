// src/components/auth/AuthModals.tsx - Updated with HeroUI theme integration
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Button,
  Spinner
} from '@heroui/react'
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


  // ✅ ACCESSIBILITY: Microsoft icon component
  const MicrosoftIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 21 21" fill="none" aria-hidden="true">
      <path d="M10 1H1v9h9V1z" fill="#f25022"/>
      <path d="M20 1h-9v9h9V1z" fill="#7fba00"/>
      <path d="M10 11H1v9h9v-9z" fill="#00a4ef"/>
      <path d="M20 11h-9v9h9v-9z" fill="#ffb900"/>
    </svg>
  )

  // ✅ OPTIMIZED: Provider button component using HeroUI
  const ProviderButton: React.FC<{
    provider: 'google' | 'microsoft'
    icon: React.ReactNode
    label: string
    variant: 'bordered' | 'solid'
    color: 'default' | 'primary'
  }> = ({ provider, icon, label, variant, color }) => {
    const isProviderLoading = state.loadingProvider === provider
    const isDisabled = state.isLoading
    
    return (
      <Button
        onPress={() => handleOAuthSignIn(provider)}
        isDisabled={isDisabled}
        variant={variant}
        color={color}
        size="lg"
        className="w-full font-medium"
        startContent={isProviderLoading ? <Spinner size="sm" /> : icon}
        isLoading={isProviderLoading}
      >
        {isProviderLoading ? 'Connecting...' : label}
      </Button>
    )
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="md"
      isDismissable={!state.isLoading}
      hideCloseButton={state.isLoading}
      classNames={{
        base: "bg-background text-foreground shadow-2xl border border-divider",
        header: "border-b border-divider px-8 py-8 bg-gradient-to-r from-background to-default-50",
        body: "px-8 py-12 bg-background",
        footer: "border-t border-divider px-8 py-8 bg-gradient-to-r from-default-50 to-background"
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold text-foreground">
                {mode === 'login' ? 'Welcome Back' : 'Join Oentex'}
              </h2>
              <p className="text-sm text-foreground-500">
                {mode === 'login' 
                  ? 'Sign in to access your trading dashboard' 
                  : 'Start discovering the best trading platforms'
                }
              </p>
            </ModalHeader>

            <ModalBody>
              {state.success ? (
                /* ✅ IMPROVED: Success State */
                <div className="text-center py-16 px-8 bg-gradient-to-br from-success-50 to-success-100 rounded-2xl border border-success-200" role="alert" aria-live="polite">
                  <div className="w-24 h-24 bg-success-200 rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg">
                    <Icons.success className="w-12 h-12 text-success" />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-6">
                    Success!
                  </h3>
                  <p className="text-foreground-600 text-xl mb-8">
                    Redirecting you to your dashboard...
                  </p>
                  <div className="mt-10">
                    <div className="w-48 h-2 bg-success-200 rounded-full mx-auto overflow-hidden shadow-inner">
                      <div className="w-full h-full bg-success animate-pulse rounded-full" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-10 py-4">
                  {/* ✅ ACCESSIBILITY: Error Alert */}
                  {state.error && (
                    <div className="bg-gradient-to-r from-danger-50 to-danger-100 border-2 border-danger-200 rounded-2xl p-8 shadow-lg" role="alert" aria-live="assertive">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-danger-200 rounded-full flex items-center justify-center">
                          <Icons.warning className="w-6 h-6 text-danger flex-shrink-0" />
                        </div>
                        <p className="text-danger text-base font-medium">{state.error}</p>
                      </div>
                    </div>
                  )}

                  {/* ✅ OPTIMIZED: OAuth Buttons */}
                  <div className="space-y-8 py-4">
                    <ProviderButton
                      provider="google"
                      icon={<Icons.globe className="w-6 h-6" />}
                      label="Continue with Google"
                      variant="bordered"
                      color="default"
                    />

                    <ProviderButton
                      provider="microsoft"
                      icon={<MicrosoftIcon />}
                      label="Continue with Microsoft"
                      variant="solid"
                      color="primary"
                    />
                  </div>
                </div>
              )}
            </ModalBody>

            {!state.success && (
              <ModalFooter className="flex flex-col gap-10 py-4">
                {/* ✅ ACCESSIBILITY: Mode Switch */}
                <div className="text-center text-base text-foreground-500 border-t-2 border-divider pt-10 w-full bg-gradient-to-r from-default-50 to-transparent rounded-t-2xl -mx-8 px-8">
                  {mode === 'login' ? (
                    <>
                      New to trading affiliate deals?{' '}
                      <Button
                        variant="light"
                        color="primary"
                        size="sm"
                        onPress={() => onModeChange('register')}
                        isDisabled={state.isLoading}
                        className="text-primary font-medium p-0 h-auto min-w-0"
                      >
                        Create account
                      </Button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <Button
                        variant="light"
                        color="primary"
                        size="sm"
                        onPress={() => onModeChange('login')}
                        isDisabled={state.isLoading}
                        className="text-primary font-medium p-0 h-auto min-w-0"
                      >
                        Sign in
                      </Button>
                    </>
                  )}
                </div>

                {/* Security Notice */}
                <div className="text-center w-full space-y-4 bg-gradient-to-r from-default-100 to-default-50 rounded-2xl p-6 border border-default-200">
              
                  <p className="text-sm text-foreground-400">
                    By continuing, you agree to our{' '}
                    <a href="/terms" className="underline hover:text-foreground-600 focus:outline-none focus:text-foreground-600 font-medium">
                      Terms
                    </a>
                    {' '}and{' '}
                    <a href="/privacy" className="underline hover:text-foreground-600 focus:outline-none focus:text-foreground-600 font-medium">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  )
}