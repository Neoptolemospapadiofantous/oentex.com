import React, { useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Button,
  Card,
  CardBody,
  Divider
} from '@heroui/react'
import { Chrome, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../../lib/authContext'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'login' | 'register'
  onModeChange: (mode: 'login' | 'register') => void
}

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

  const MicrosoftIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 21 21" fill="none" aria-hidden="true">
      <path d="M10 1H1v9h9V1z" fill="#f25022"/>
      <path d="M20 1h-9v9h9V1z" fill="#7fba00"/>
      <path d="M10 11H1v9h9v-9z" fill="#00a4ef"/>
      <path d="M20 11h-9v9h9v-9z" fill="#ffb900"/>
    </svg>
  )

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      placement="center"
      backdrop="blur"
      classNames={{
        backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-center">
              <h2 className="text-2xl font-bold">
                {mode === 'login' ? 'Welcome Back' : 'Join Oentex'}
              </h2>
              <p className="text-small text-default-500">
                {mode === 'login' 
                  ? 'Sign in to access your trading dashboard' 
                  : 'Start discovering the best trading platforms'
                }
              </p>
            </ModalHeader>
            
            <ModalBody>
              {state.success ? (
                <Card className="bg-success-50 border-success-200">
                  <CardBody className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-success mb-2">
                      Success!
                    </h3>
                    <p className="text-success-600">
                      Redirecting you to your dashboard...
                    </p>
                  </CardBody>
                </Card>
              ) : (
                <div className="space-y-4">
                  {state.error && (
                    <Card className="bg-danger-50 border-danger-200">
                      <CardBody>
                        <div className="flex items-center gap-3">
                          <AlertCircle className="w-5 h-5 text-danger flex-shrink-0" />
                          <p className="text-danger text-small">{state.error}</p>
                        </div>
                      </CardBody>
                    </Card>
                  )}

                  <div className="space-y-3">
                    <Button
                      className="w-full"
                      variant="bordered"
                      size="lg"
                      startContent={<Chrome className="w-5 h-5" />}
                      onPress={() => handleOAuthSignIn('google')}
                      isLoading={state.loadingProvider === 'google'}
                      isDisabled={state.isLoading}
                    >
                      {state.loadingProvider === 'google' ? 'Connecting...' : 'Continue with Google'}
                    </Button>

                    <Button
                      className="w-full"
                      color="primary"
                      size="lg"
                      startContent={<MicrosoftIcon />}
                      onPress={() => handleOAuthSignIn('microsoft')}
                      isLoading={state.loadingProvider === 'microsoft'}
                      isDisabled={state.isLoading}
                    >
                      {state.loadingProvider === 'microsoft' ? 'Connecting...' : 'Continue with Microsoft'}
                    </Button>
                  </div>
                </div>
              )}
            </ModalBody>
            
            <ModalFooter className="flex-col">
              <div className="text-center text-small text-default-500">
                {mode === 'login' ? (
                  <>
                    New to trading affiliate deals?{' '}
                    <Button
                      variant="light"
                      size="sm"
                      onPress={() => onModeChange('register')}
                      isDisabled={state.isLoading}
                      className="p-0 h-auto min-w-0 text-primary"
                    >
                      Create account
                    </Button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <Button
                      variant="light"
                      size="sm"
                      onPress={() => onModeChange('login')}
                      isDisabled={state.isLoading}
                      className="p-0 h-auto min-w-0 text-primary"
                    >
                      Sign in
                    </Button>
                  </>
                )}
              </div>
              
              <div className="text-center">
                <p className="text-tiny text-default-400 mb-2">
                  🔒 Secure OAuth authentication • No passwords needed
                </p>
                <p className="text-tiny text-default-400">
                  By continuing, you agree to our{' '}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}