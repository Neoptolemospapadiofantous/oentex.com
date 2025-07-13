// src/components/auth/AuthModals.tsx (Fixed infinite render issue)
import React, { useState, useEffect, useMemo } from 'react'
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle, Chrome } from 'lucide-react'
import { useAuth } from '../../lib/authContext'
import { useFormValidation } from '../../hooks/useFormValidation'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'
import { 
  authLoginSchema, 
  authRegisterSchema, 
  forgotPasswordSchema,
  AuthLoginData,
  AuthRegisterData,
  ForgotPasswordData
} from '../../lib/validation/schemas'
import { FocusManager } from '../ui/FocusManager'
import toast from 'react-hot-toast'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'login' | 'register' | 'forgot-password'
  onModeChange: (mode: 'login' | 'register' | 'forgot-password') => void
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onModeChange }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)

  const { signIn, signUp, resetPassword, signInWithGoogle } = useAuth()

  // Body scroll lock when modal is open
  useBodyScrollLock(isOpen)

  // Handle escape key
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

  // Memoize initial values and schema to prevent new object references on every render
  const initialValues = useMemo(() => {
    switch (mode) {
      case 'login':
        return { email: '', password: '' }
      case 'register':
        return { email: '', password: '', confirmPassword: '', fullName: '' }
      case 'forgot-password':
        return { email: '' }
      default:
        return { email: '' }
    }
  }, [mode])

  const schema = useMemo(() => {
    switch (mode) {
      case 'login':
        return authLoginSchema
      case 'register':
        return authRegisterSchema
      case 'forgot-password':
        return forgotPasswordSchema
      default:
        return forgotPasswordSchema
    }
  }, [mode])

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset
  } = useFormValidation(schema, initialValues)

  // Reset form when mode changes - this will no longer cause infinite loops
  useEffect(() => {
    reset()
    setShowPassword(false)
    setShowConfirmPassword(false)
  }, [mode, reset])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateAll()) {
      return
    }

    setIsLoading(true)
    
    try {
      let result

      if (mode === 'login') {
        const { email, password } = values as AuthLoginData
        result = await signIn(email, password)
        if (!result.error) {
          setLoginSuccess(true)
          // Brief delay to show success state before closing
          setTimeout(() => {
            onClose()
            setLoginSuccess(false)
          }, 800)
        }
      } else if (mode === 'register') {
        const { email, password, fullName } = values as AuthRegisterData
        result = await signUp(email, password, fullName)
        if (!result.error) {
          toast.success('Account created! Please check your email to verify your account.')
          onClose()
        }
      } else if (mode === 'forgot-password') {
        const { email } = values as ForgotPasswordData
        result = await resetPassword(email)
        if (!result.error) {
          toast.success('Password reset email sent! Check your inbox.')
          onModeChange('login')
        }
      }

      if (result?.error) {
        toast.error(result.error.message)
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const result = await signInWithGoogle()
      if (!result.error) {
        setLoginSuccess(true)
        // Brief delay to show success state before closing
        setTimeout(() => {
          onClose()
          setLoginSuccess(false)
        }, 800)
      } else {
        toast.error(result.error.message)
      }
    } catch (error) {
      toast.error('Failed to sign in with Google. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose()
    }
  }

  return (
    <FocusManager>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={handleOverlayClick}
      >
        <div className="bg-surface border border-border rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-text">
              {mode === 'login' ? 'Sign In' : 
               mode === 'register' ? 'Create Account' : 
               'Reset Password'}
            </h2>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-textSecondary hover:text-text transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {mode === 'register' && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-text mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary w-5 h-5" />
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={values.fullName || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-4 py-3 bg-background border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                      errors.fullName && touched.fullName ? 'border-red-500' : 'border-border'
                    }`}
                    placeholder="Enter your full name"
                    aria-invalid={!!(errors.fullName && touched.fullName)}
                    aria-describedby={errors.fullName && touched.fullName ? 'fullName-error' : undefined}
                  />
                </div>
                {errors.fullName && touched.fullName && (
                  <p id="fullName-error" className="text-red-500 text-sm mt-1 flex items-center" role="alert">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.fullName}
                  </p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary w-5 h-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={values.email || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-10 pr-4 py-3 bg-background border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                    errors.email && touched.email ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder="Enter your email"
                  aria-invalid={!!(errors.email && touched.email)}
                  aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
                />
              </div>
              {errors.email && touched.email && (
                <p id="email-error" className="text-red-500 text-sm mt-1 flex items-center" role="alert">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {mode !== 'forgot-password' && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary w-5 h-5" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-12 py-3 bg-background border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                      errors.password && touched.password ? 'border-red-500' : 'border-border'
                    }`}
                    placeholder="Enter your password"
                    aria-invalid={!!(errors.password && touched.password)}
                    aria-describedby={errors.password && touched.password ? 'password-error' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-textSecondary hover:text-text"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <p id="password-error" className="text-red-500 text-sm mt-1 flex items-center" role="alert">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-text mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary w-5 h-5" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={values.confirmPassword || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-12 py-3 bg-background border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                      errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-border'
                    }`}
                    placeholder="Confirm your password"
                    aria-invalid={!!(errors.confirmPassword && touched.confirmPassword)}
                    aria-describedby={errors.confirmPassword && touched.confirmPassword ? 'confirmPassword-error' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-textSecondary hover:text-text"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && touched.confirmPassword && (
                  <p id="confirmPassword-error" className="text-red-500 text-sm mt-1 flex items-center" role="alert">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || loginSuccess}
              className={`w-full font-medium py-3 px-4 rounded-lg transition-all duration-300 ${
                loginSuccess 
                  ? 'bg-green-600 text-white' 
                  : 'bg-primary hover:bg-primary/90 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loginSuccess ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Success!
                </span>
              ) : isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {mode === 'login' ? 'Signing In...' : 
                   mode === 'register' ? 'Creating Account...' : 
                   'Sending Email...'}
                </span>
              ) : (
                mode === 'login' ? 'Sign In' : 
                mode === 'register' ? 'Create Account' : 
                'Send Reset Email'
              )}
            </button>

            {/* Google Sign In (only for login/register) */}
            {mode !== 'forgot-password' && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-surface text-textSecondary">Or continue with</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading || loginSuccess}
                  className={`w-full border font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                    loginSuccess 
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : 'border-border hover:bg-background/50 text-text'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loginSuccess ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Success!
                    </>
                  ) : (
                    <>
                      <Chrome className="w-5 h-5" />
                      Continue with Google
                    </>
                  )}
                </button>
              </>
            )}
          </form>

          {/* Footer */}
          <div className="px-6 pb-6 text-center text-sm text-textSecondary">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => onModeChange('register')}
                  disabled={isLoading}
                  className="text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sign up
                </button>
                <br />
                <button
                  onClick={() => onModeChange('forgot-password')}
                  disabled={isLoading}
                  className="text-primary hover:underline mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Forgot your password?
                </button>
              </>
            ) : mode === 'register' ? (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => onModeChange('login')}
                  disabled={isLoading}
                  className="text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Remember your password?{' '}
                <button
                  onClick={() => onModeChange('login')}
                  disabled={isLoading}
                  className="text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </FocusManager>
  )
}