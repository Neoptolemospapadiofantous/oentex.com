// src/pages/guest/Register.tsx - Dedicated Register Page
import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Button,
  Spinner,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Divider
} from '@heroui/react'
import { Icons } from '../../components/icons'
import { useAuth } from '../../lib/authContext'
import logo from '../../assets/logo.png'

export const Register: React.FC = () => {
  const [state, setState] = useState({
    isLoading: false,
    loadingProvider: null as string | null,
    success: false,
    error: null as string | null
  })

  const { signInWithGoogle, signInWithMicrosoft } = useAuth()
  const navigate = useNavigate()

  // Clear state when component mounts
  useEffect(() => {
    setState({
      isLoading: false,
      loadingProvider: null,
      success: false,
      error: null
    })
  }, [])

  // OAuth sign-in handler
  const handleOAuthSignIn = useCallback(async (provider: 'google' | 'microsoft') => {
    if (state.isLoading) return
    
    setState(prev => ({ 
      ...prev,
      isLoading: true, 
      loadingProvider: provider,
      error: null
    }))
    
    try {
      const result = provider === 'google' 
        ? await signInWithGoogle()
        : await signInWithMicrosoft()

      if (result.error) {
        setState(prev => ({ 
          ...prev,
          isLoading: false, 
          loadingProvider: null, 
          error: result.error?.message || `Failed to sign in with ${provider}. Please try again.`
        }))
      } else {
        setState(prev => ({ 
          ...prev,
          isLoading: false, 
          loadingProvider: null, 
          success: true 
        }))
        
        // Redirect to dashboard after success
        setTimeout(() => navigate('/dashboard'), 2000)
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : `Failed to sign in with ${provider}. Please try again.`
      
      setState(prev => ({ 
        ...prev,
        isLoading: false, 
        loadingProvider: null, 
        error: errorMessage
      }))
    }
  }, [state.isLoading, signInWithGoogle, signInWithMicrosoft, navigate])

  // Microsoft icon component
  const MicrosoftIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 21 21" fill="none" aria-hidden="true">
      <path d="M10 1H1v9h9V1z" fill="#f25022"/>
      <path d="M20 1h-9v9h9V1z" fill="#7fba00"/>
      <path d="M10 11H1v9h9v-9z" fill="#00a4ef"/>
      <path d="M20 11h-9v9h9v-9z" fill="#ffb900"/>
    </svg>
  )

  // Provider button component
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
        className="w-full font-semibold py-7 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-2 hover:border-primary/30 group relative overflow-hidden"
        startContent={
          isProviderLoading ? (
            <Spinner size="sm" className="text-current" />
          ) : (
            <div className="group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          )
        }
        isLoading={isProviderLoading}
      >
        <span className="relative z-10">
          {isProviderLoading ? 'Connecting...' : label}
        </span>
        {!isProviderLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        )}
      </Button>
    )
  }

  if (state.success) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-background via-default-50 to-background px-6 relative overflow-hidden">
        {/* Rich animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-success/8 via-secondary/6 to-success/8 backdrop-blur-sm"></div>
        
        {/* Floating success shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-success/15 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-secondary/12 rounded-full blur-lg animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-success/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-secondary/8 rounded-full blur-xl animate-pulse delay-3000"></div>
        </div>
        
        <Card className="max-w-2xl w-full shadow-2xl border border-divider/50 relative z-10 backdrop-blur-md bg-content1/95 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-700">
          <CardBody className="text-center section-py-2xl section-px-lg">
            <div className="w-32 h-32 bg-gradient-to-br from-success-200 to-success-300 rounded-full flex items-center justify-center mx-auto mb-12 shadow-2xl animate-in zoom-in-95 duration-500 delay-200">
              <Icons.success className="w-16 h-16 text-success animate-pulse" />
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-8 bg-gradient-to-r from-foreground to-success bg-clip-text animate-in fade-in slide-in-from-top-2 duration-500 delay-400">
              Welcome to Oentex!
            </h2>
            <p className="text-foreground-600 text-2xl mb-12 font-medium animate-in fade-in slide-in-from-bottom-2 duration-500 delay-600">
              Your account has been created. Redirecting to dashboard...
            </p>
            <div className="mt-12 animate-in fade-in duration-500 delay-800">
              <div className="w-64 h-3 bg-success-200 rounded-full mx-auto overflow-hidden shadow-inner">
                <div className="w-full h-full bg-gradient-to-r from-success to-success-400 animate-pulse rounded-full" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-background via-default-50 to-background px-6 relative overflow-hidden">
      {/* Rich animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/8 via-primary/6 to-secondary/8 backdrop-blur-sm"></div>
      
      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-secondary/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-primary/15 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-secondary/8 rounded-full blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-primary/12 rounded-full blur-xl animate-pulse delay-3000"></div>
      </div>
      
      <Card className="max-w-2xl w-full shadow-2xl border border-divider/50 relative z-10 backdrop-blur-md bg-content1/95 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-700">
        <CardHeader className="text-center section-py-xl section-px-lg bg-gradient-to-r from-content1 via-content2/50 to-content1 border-b border-divider/30 flex flex-col items-center justify-center">
          <div className="w-full space-y-4 flex flex-col items-center">
            <div className="w-20 h-20 bg-gradient-to-br from-secondary to-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg animate-in zoom-in-95 duration-500 delay-200">
              <img 
                src={logo} 
                alt="Oentex Logo" 
                className="max-w-full max-h-full object-contain"
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-center">
              Join Oentex
            </h1>
            <p className="text-foreground-500 text-xl font-medium text-center">
              Start discovering the best trading platforms
            </p>
          </div>
        </CardHeader>

        <Divider className="bg-gradient-to-r from-transparent via-divider to-transparent" />

        <CardBody className="section-px-lg section-py-xl">
          {state.error && (
            <div className="bg-gradient-to-r from-danger-50 to-danger-100 border-2 border-danger-200 rounded-2xl container-p-lg mb-10 shadow-lg animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-danger-200 rounded-full flex items-center justify-center animate-pulse">
                  <Icons.warning className="w-7 h-7 text-danger flex-shrink-0" />
                </div>
                <p className="text-danger text-lg font-medium">{state.error}</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
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
        </CardBody>

        <Divider className="bg-gradient-to-r from-transparent via-divider to-transparent" />

        <CardFooter className="section-px-lg section-py-xl bg-gradient-to-r from-content2/50 via-content1 to-content2/50">
          <div className="text-center w-full space-y-6">
            <p className="text-lg text-foreground-500">
              Already have an account?{' '}
              <button 
                onClick={() => navigate('/login')}
                className="text-primary font-semibold hover:text-primary-600 hover:underline transition-all duration-300 text-xl cursor-pointer hover:scale-105 active:scale-95"
              >
                Sign in
              </button>
            </p>
            
            <div className="bg-gradient-to-r from-content2/80 to-content3/60 rounded-2xl container-p-lg border border-divider/50 shadow-sm hover:shadow-md transition-all duration-300">
                <p className="text-base text-foreground-400">
                  By continuing, you agree to our{' '}
                  <button 
                    onClick={() => navigate('/terms')}
                    className="underline hover:text-foreground-600 focus:outline-none focus:text-foreground-600 font-medium cursor-pointer transition-colors duration-200"
                  >
                    Terms
                  </button>
                  {' '}and{' '}
                  <button 
                    onClick={() => navigate('/privacy')}
                    className="underline hover:text-foreground-600 focus:outline-none focus:text-foreground-600 font-medium cursor-pointer transition-colors duration-200"
                  >
                    Privacy Policy
                  </button>
                </p>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Register
