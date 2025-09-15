// src/pages/guest/Authentication.tsx - Fixed Email Input with White Colors
import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Button,
  Spinner,
  Input,
  Card,
  CardBody
} from '@heroui/react'
import { Icons } from '../../components/icons'
import { useAuth } from '../../lib/authContext'
import { showSuccessToast, showErrorToast } from '../../components/ui/AppToast'
import logo from '../../assets/logo.png'


export const Authentication: React.FC = () => {
  const [state, setState] = useState({
    isLoading: false,
    loadingProvider: null as string | null,
    success: false,
    error: null as string | null,
    // Registration form state
    registrationStep: 'email' as 'email' | 'password',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    isEmailValid: false,
    isPasswordValid: false,
    isConfirmPasswordValid: false
  })

  const { signInWithGoogle, signInWithMicrosoft, signUpWithEmail } = useAuth()
  const navigate = useNavigate()

  // Clear state when component mounts
  useEffect(() => {
    setState({
      isLoading: false,
      loadingProvider: null,
      success: false,
      error: null,
      registrationStep: 'email',
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      isEmailValid: false,
      isPasswordValid: false,
      isConfirmPasswordValid: false
    })
  }, [])

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Password validation
  const validatePassword = (password: string) => {
    return password.length >= 12
  }

  // Handle email input - Fixed to properly add space and maintain white text
  const handleEmailChange = (value: string) => {
    // Ensure there's always a leading space for visual consistency
    let formattedValue = value
    if (value.length > 0 && !value.startsWith(' ')) {
      formattedValue = ` ${value}`
    }
    
    // Validate using trimmed value
    const trimmedValue = formattedValue.trim()
    const isValid = validateEmail(trimmedValue)
    
    setState(prev => ({
      ...prev,
      email: formattedValue,
      isEmailValid: isValid
    }))
    
    // Clear any previous validation errors only if they're email-related and we're on email step
    if (state.error && (state.error.includes('email') || state.error.includes('Email')) && state.registrationStep === 'email') {
      setState(prev => ({ ...prev, error: null }))
    }
  }

  // Handle password input - Fixed to properly add space and maintain white text
  const handlePasswordChange = (value: string) => {
    // Ensure there's always a leading space for visual consistency
    let formattedValue = value
    if (value.length > 0 && !value.startsWith(' ')) {
      formattedValue = ` ${value}`
    }
    
    // Validate using trimmed value
    const trimmedValue = formattedValue.trim()
    const isValid = validatePassword(trimmedValue)
    
    setState(prev => ({
      ...prev,
      password: formattedValue,
      isPasswordValid: isValid
    }))
    
    // Clear any previous validation errors only if they're password-related and we're on password step
    if (state.error && (state.error.includes('password') || state.error.includes('Password')) && state.registrationStep === 'password') {
      setState(prev => ({ ...prev, error: null }))
    }
  }

  // Handle confirm password input - Fixed to properly add space and maintain white text
  const handleConfirmPasswordChange = (value: string) => {
    // Ensure there's always a leading space for visual consistency
    let formattedValue = value
    if (value.length > 0 && !value.startsWith(' ')) {
      formattedValue = ` ${value}`
    }
    
    // Validate using trimmed values
    const trimmedValue = formattedValue.trim()
    const trimmedPassword = state.password.trim()
    const isValid = trimmedValue === trimmedPassword && trimmedValue.length >= 12
    
    setState(prev => ({
      ...prev,
      confirmPassword: formattedValue,
      isConfirmPasswordValid: isValid
    }))
    
    // Clear any previous validation errors only if they're password-related and we're on password step
    if (state.error && (state.error.includes('password') || state.error.includes('Password')) && state.registrationStep === 'password') {
      setState(prev => ({ ...prev, error: null }))
    }
  }

  // Handle full name input - Fixed to properly add space and maintain white text
  const handleFullNameChange = (value: string) => {
    // Ensure there's always a leading space for visual consistency
    let formattedValue = value
    if (value.length > 0 && !value.startsWith(' ')) {
      formattedValue = ` ${value}`
    }
    
    setState(prev => ({
      ...prev,
      fullName: formattedValue
    }))
    
    // Clear any previous validation errors only if they're name-related and we're on password step
    if (state.error && (state.error.includes('name') || state.error.includes('Name')) && state.registrationStep === 'password') {
      setState(prev => ({ ...prev, error: null }))
    }
  }

  // Proceed to password step
  const handleEmailSubmit = () => {
    if (state.isEmailValid) {
      setState(prev => ({
        ...prev,
        registrationStep: 'password',
        error: null
      }))
    } else {
      showErrorToast('Please enter a valid email address', 'Invalid Email')
    }
  }

  // Handle manual registration
  const handleManualRegister = async () => {
    // Clear any previous errors
    setState(prev => ({ ...prev, error: null }))

    // Validation checks
    if (!state.isEmailValid || !state.isPasswordValid || !state.isConfirmPasswordValid) {
      const errorMessage = 'Please fill in all fields correctly'
      setState(prev => ({
        ...prev,
        error: errorMessage
      }))
      showErrorToast(errorMessage, 'Validation Error')
      return
    }

    // Use trimmed values for comparison
    const trimmedPassword = state.password.trim()
    const trimmedConfirmPassword = state.confirmPassword.trim()
    
    if (trimmedPassword !== trimmedConfirmPassword) {
      const errorMessage = 'Passwords do not match'
      setState(prev => ({
        ...prev,
        error: errorMessage
      }))
      showErrorToast(errorMessage, 'Password Error')
      return
    }

    // Check for empty required fields
    if (!state.email.trim() || !trimmedPassword || !state.fullName.trim()) {
      const errorMessage = 'All fields are required'
      setState(prev => ({
        ...prev,
        error: errorMessage
      }))
      showErrorToast(errorMessage, 'Required Fields')
      return
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    // Add timeout handler
    const timeoutId = setTimeout(() => {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Request timed out. Please check your connection and try again.'
      }))
    }, 30000) // 30 second timeout

    try {
      // Use trimmed values for registration
      const result = await signUpWithEmail(
        state.email.trim(), 
        trimmedPassword, 
        {
          full_name: state.fullName.trim()
        }
      )

      clearTimeout(timeoutId)

      if (result.error) {
        const errorMessage = result.error.message || 'Failed to create account. Please try again.'
        
        console.log('🔍 Registration error in component:', {
          error: result.error,
          errorMessage,
          errorType: result.error.type,
          fullError: JSON.stringify(result.error, null, 2)
        })
        
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage
        }))
        
        // Show error toast
        showErrorToast(errorMessage, 'Registration Failed')
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          success: true
        }))
        
        // Show success toast
        showSuccessToast('Account created successfully! Redirecting to dashboard...', 'Welcome to Oentex!', 3000)
        
        // Redirect to dashboard after success
        setTimeout(() => navigate('/dashboard'), 2000)
      }
    } catch (error) {
      clearTimeout(timeoutId)
      console.error('Registration error:', error)
      
      let errorMessage = 'Failed to create account. Please try again.'
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again.'
        } else if (error.message.includes('rate limit')) {
          errorMessage = 'Too many attempts. Please wait a moment and try again.'
        } else if (error.message.includes('abort')) {
          errorMessage = 'Request was cancelled. Please try again.'
        } else {
          errorMessage = error.message
        }
      }
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))
      
      // Show error toast for catch block
      showErrorToast(errorMessage, 'Registration Failed')
    }
  }

  // Go back to email step
  const handleBackToEmail = () => {
    setState(prev => ({
      ...prev,
      registrationStep: 'email',
      error: null
    }))
  }

  // Retry failed operation
  const handleRetry = () => {
    setState(prev => ({ ...prev, error: null }))
    
    if (state.registrationStep === 'password') {
      handleManualRegister()
    } else {
      handleEmailSubmit()
    }
  }

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
        let errorMessage = result.error.message || `Failed to sign in with ${provider}. Please try again.`
        
        // Handle specific OAuth errors
        if (result.error.message.includes('popup')) {
          errorMessage = 'Popup blocked. Please allow popups and try again.'
        } else if (result.error.message.includes('cancelled')) {
          errorMessage = 'Sign-in was cancelled. Please try again.'
        } else if (result.error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else if (result.error.message.includes('rate limit')) {
          errorMessage = 'Too many attempts. Please wait a moment and try again.'
        }
        
        setState(prev => ({ 
          ...prev,
          isLoading: false, 
          loadingProvider: null, 
          error: errorMessage
        }))
        
        // Show error toast
        showErrorToast(errorMessage, `${provider.charAt(0).toUpperCase() + provider.slice(1)} Sign-in Failed`)
      } else {
        setState(prev => ({ 
          ...prev,
          isLoading: false, 
          loadingProvider: null, 
          success: true 
        }))
        
        // Show success toast
        showSuccessToast(`Successfully signed in with ${provider}! Redirecting to dashboard...`, 'Welcome Back!', 3000)
        
        // Redirect to dashboard after success
        setTimeout(() => navigate('/dashboard'), 2000)
      }
    } catch (error) {
      console.error('OAuth sign-in error:', error)
      
      let errorMessage = `Failed to sign in with ${provider}. Please try again.`
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('popup')) {
          errorMessage = 'Popup blocked. Please allow popups and try again.'
        } else if (error.message.includes('cancelled')) {
          errorMessage = 'Sign-in was cancelled. Please try again.'
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again.'
        } else if (error.message.includes('rate limit')) {
          errorMessage = 'Too many attempts. Please wait a moment and try again.'
        } else {
          errorMessage = error.message
        }
      }
      
      setState(prev => ({ 
        ...prev,
        isLoading: false, 
        loadingProvider: null, 
        error: errorMessage
      }))
      
      // Show error toast for OAuth catch block
      showErrorToast(errorMessage, `${provider.charAt(0).toUpperCase() + provider.slice(1)} Sign-in Failed`)
    }
  }, [state.isLoading, signInWithGoogle, signInWithMicrosoft, navigate])

  // Microsoft icon component
  const MicrosoftIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 21 21" fill="none" aria-hidden="true">
      <path d="M10 1H1v9h9V1z" fill="#f25022"/>
      <path d="M20 1h-9v9h9V1z" fill="#7fba00"/>
      <path d="M10 11H1v9h9v-9z" fill="#00a4ef"/>
      <path d="M20 11h-9v9h9v-9z" fill="#ffb900"/>
    </svg>
  )

  // Google icon component
  const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )

  // Provider button component
  const ProviderButton: React.FC<{
    provider: 'google' | 'microsoft'
    icon: React.ReactNode
    label: string
  }> = ({ provider, icon, label }) => {
    const isProviderLoading = state.loadingProvider === provider
    const isDisabled = state.isLoading
    
    return (
      <Button
        onPress={() => handleOAuthSignIn(provider)}
        isDisabled={isDisabled}
        variant="solid"
        color="default"
        size="md"
        className="w-full font-medium py-md text-sm rounded-lg bg-default-100 hover:bg-default-200 text-foreground border-0 shadow-none transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
        startContent={
          isProviderLoading ? (
            <Spinner size="sm" className="text-current" />
          ) : (
            <div className="flex items-center justify-center">
              {icon}
            </div>
          )
        }
        isLoading={isProviderLoading}
      >
        <span className="ml-md">
          {isProviderLoading ? 'Connecting...' : label}
        </span>
      </Button>
    )
  }

  if (state.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background section-px-lg">
        <div className="w-full max-w-md text-center border border-divider rounded-large bg-content1 shadow-medium p-lg">
          <div className="w-20 h-20 bg-gradient-to-br from-success-200 to-success-300 rounded-full flex items-center justify-center mx-auto mb-2xl shadow-lg">
            <Icons.success className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-lg">
            Welcome to Oentex!
          </h2>
          <p className="text-foreground-500 text-lg mb-2xl">
            Your account has been created. Redirecting to dashboard...
          </p>
          <div className="w-64 h-2 bg-success-200 rounded-full mx-auto overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-success to-success-400 animate-pulse rounded-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background section-px-md py-md">
      <div className="w-full max-w-sm border border-divider rounded-large bg-content1 shadow-medium p-lg">
        {/* Header with Logo and Title */}
        <div className="text-center mb-lg">
          <div className="flex items-center justify-center gap-md mb-md">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
              <img 
                src={logo} 
                alt="Oentex Logo" 
                className="w-8 h-8 object-contain"
              />
            </div>
          </div>
            <p className="text-foreground-500 text-base">Sign up or Login with</p>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-md mb-lg">
          <ProviderButton
            provider="google"
            icon={<GoogleIcon />}
            label="Google"
          />

          <ProviderButton
            provider="microsoft"
            icon={<MicrosoftIcon />}
            label="Microsoft"
          />
        </div>

        {/* Error Display */}
        {state.error && (
          <div className="bg-danger-50 border border-danger-300 rounded-large container-p-md mb-md shadow-small">
            <div className="flex items-center justify-between gap-sm">
              <div className="flex items-center gap-sm">
                <Icons.warning className="w-4 h-4 text-danger flex-shrink-0" />
                <p className="text-danger text-sm font-medium">{state.error}</p>
              </div>
              <div className="flex gap-xs">
                {state.error.includes('already exists') && (
                  <Button
                    size="sm"
                    variant="solid"
                    color="primary"
                    onPress={() => {
                      setState(prev => ({ ...prev, error: null, registrationStep: 'email' }))
                    }}
                    className="text-white"
                  >
                    Sign In Instead
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="light"
                  color="danger"
                  onPress={handleRetry}
                  className="text-danger hover:bg-danger-100"
                >
                  Retry
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* OR Separator */}
        <div className="relative mb-md">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-divider"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-md bg-content1 text-foreground-500 border border-divider rounded-full">OR</span>
          </div>
        </div>

        {/* Registration Form */}
        <Card className="mb-md border border-divider shadow-small bg-content2">
          <CardBody className="container-p-md">
            {state.registrationStep === 'email' ? (
              // Email Step
              <div className="space-y-md">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-sm">
                    Enter your email
                  </h3>
                  <p className="text-sm text-foreground-500">
                    We'll send you a verification link
                  </p>
                </div>
                
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={state.email}
                  onValueChange={handleEmailChange}
                  isInvalid={state.email.length > 0 && !state.isEmailValid}
                  className="w-full"
                  size="md"
                  startContent={<Icons.mail className="w-4 h-4 text-foreground-400 mr-2" />}
                  endContent={
                    state.email.length > 0 && state.isEmailValid ? (
                      <Icons.check className="w-4 h-4 text-success" />
                    ) : state.email.length > 0 && !state.isEmailValid ? (
                      <Icons.warning className="w-4 h-4 text-danger" />
                    ) : null
                  }
                  classNames={{
                    input: "pl-4 text-white placeholder:text-foreground-400 ml-2",
                    inputWrapper: `focus-within:border-primary focus-within:shadow-none bg-content2 ${
                      state.email.length > 0 && !state.isEmailValid 
                        ? 'border-danger' 
                        : state.email.length > 0 && state.isEmailValid 
                        ? 'border-success' 
                        : ''
                    }`,
                    innerWrapper: "gap-3"
                  }}
                />
                
                <Button
                  onPress={handleEmailSubmit}
                  isDisabled={!state.isEmailValid}
                  color="primary"
                  size="md"
                  className="w-full font-medium"
                >
                  Continue
                </Button>
              </div>
            ) : (
              // Password Step
              <div className="space-y-md">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-sm">
                    Create your password
                  </h3>
                  <p className="text-sm text-foreground-500">
                    Choose a strong password for your account
                  </p>
                </div>
                
                <div className="space-y-sm">
                  <Input
                    type="text"
                    placeholder=" Full Name"
                    value={state.fullName}
                    onValueChange={handleFullNameChange}
                    isInvalid={state.fullName.length > 0 && state.fullName.trim().length === 0}
                    className="w-full"
                    size="md"
                    startContent={<Icons.user className="w-4 h-4 text-foreground-400" />}
                    endContent={
                      state.fullName.length > 0 && state.fullName.trim().length > 0 ? (
                        <Icons.check className="w-4 h-4 text-success" />
                      ) : state.fullName.length > 0 && state.fullName.trim().length === 0 ? (
                        <Icons.warning className="w-4 h-4 text-danger" />
                      ) : null
                    }
                    classNames={{
                      input: "pl-md text-white placeholder:text-foreground-400",
                      inputWrapper: `focus-within:border-primary focus-within:shadow-none bg-content2 ${
                        state.fullName.length > 0 && state.fullName.trim().length === 0 
                          ? 'border-danger' 
                          : state.fullName.length > 0 && state.fullName.trim().length > 0 
                          ? 'border-success' 
                          : ''
                      }`
                    }}
                  />
                  
                  <div className="space-y-sm">
                    <Input
                      type="password"
                      placeholder=" Password (min. 12 characters)"
                      value={state.password}
                      onValueChange={handlePasswordChange}
                      isInvalid={state.password.length > 0 && !state.isPasswordValid}
                      className="w-full"
                      size="md"
                      startContent={<Icons.lock className="w-4 h-4 text-foreground-400" />}
                      endContent={
                        state.password.length > 0 && state.isPasswordValid ? (
                          <Icons.check className="w-4 h-4 text-success" />
                        ) : state.password.length > 0 && !state.isPasswordValid ? (
                          <Icons.warning className="w-4 h-4 text-danger" />
                        ) : null
                      }
                      classNames={{
                        input: "pl-md text-white placeholder:text-foreground-400",
                        inputWrapper: `focus-within:border-primary focus-within:shadow-none bg-content2 ${
                          state.password.length > 0 && !state.isPasswordValid 
                            ? 'border-danger' 
                            : state.password.length > 0 && state.isPasswordValid 
                            ? 'border-success' 
                            : ''
                        }`
                      }}
                    />
                    
                    {/* Password Strength Indicator */}
                    {state.password.length > 0 && (
                      <div className="flex items-center gap-sm">
                        <div className="flex-1 bg-content3 rounded-full h-1">
                          <div 
                            className={`h-1 rounded-full transition-all duration-300 ${
                              state.password.length < 6 
                                ? 'bg-danger w-1/4' 
                                : state.password.length < 9 
                                ? 'bg-warning w-1/2' 
                                : state.password.length < 12 
                                ? 'bg-warning w-3/4' 
                                : 'bg-success w-full'
                            }`}
                          />
                        </div>
                        <span className={`text-xs font-medium ${
                          state.password.length < 6 
                            ? 'text-danger' 
                            : state.password.length < 9 
                            ? 'text-warning' 
                            : state.password.length < 12 
                            ? 'text-warning' 
                            : 'text-success'
                        }`}>
                          {state.password.length < 6 
                            ? 'Weak' 
                            : state.password.length < 9 
                            ? 'Fair' 
                            : state.password.length < 12 
                            ? 'Good' 
                            : 'Strong'
                          }
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <Input
                    type="password"
                    placeholder=" Confirm Password"
                    value={state.confirmPassword}
                    onValueChange={handleConfirmPasswordChange}
                    isInvalid={state.confirmPassword.length > 0 && !state.isConfirmPasswordValid}
                    className="w-full"
                    size="md"
                    startContent={<Icons.lock className="w-4 h-4 text-foreground-400" />}
                    endContent={
                      state.confirmPassword.length > 0 && state.isConfirmPasswordValid ? (
                        <Icons.check className="w-4 h-4 text-success" />
                      ) : state.confirmPassword.length > 0 && !state.isConfirmPasswordValid ? (
                        <Icons.warning className="w-4 h-4 text-danger" />
                      ) : null
                    }
                    classNames={{
                      input: "pl-md text-white placeholder:text-foreground-400",
                      inputWrapper: `focus-within:border-primary focus-within:shadow-none bg-content2 ${
                        state.confirmPassword.length > 0 && !state.isConfirmPasswordValid 
                          ? 'border-danger' 
                          : state.confirmPassword.length > 0 && state.isConfirmPasswordValid 
                          ? 'border-success' 
                          : ''
                      }`
                    }}
                  />
                </div>
                
                <div className="flex gap-md pt-sm">
                  <Button
                    onPress={handleBackToEmail}
                    variant="bordered"
                    size="md"
                    className="flex-1 font-medium"
                  >
                    Back
                  </Button>
                  
                  <Button
                    onPress={handleManualRegister}
                    isDisabled={!state.isEmailValid || !state.isPasswordValid || !state.isConfirmPasswordValid || state.isLoading}
                    color="primary"
                    size="md"
                    className="flex-1 font-medium"
                    isLoading={state.isLoading}
                  >
                    {state.isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Terms and Privacy */}
        <div className="text-center mt-md">
          <p className="text-xs text-foreground-400">
            By continuing, you agree to our{' '}
            <button 
              onClick={() => navigate('/terms')}
              className="text-primary hover:text-primary-600 underline font-medium cursor-pointer transition-colors duration-200"
            >
              Terms
            </button>
            {' '}and{' '}
            <button 
              onClick={() => navigate('/privacy')}
              className="text-primary hover:text-primary-600 underline font-medium cursor-pointer transition-colors duration-200"
            >
              Privacy Policy
            </button>
          </p>
        </div>

        {/* Help Link */}
        <div className="text-center mt-sm">
          <button className="text-xs bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:opacity-80 transition-opacity duration-200">
            Need help?
          </button>
        </div>
      </div>
    </div>
  )
}

export default Authentication