// src/components/auth/AuthModals.tsx (Enhanced with validation)
import React, { useState, useEffect } from 'react'
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle, Chrome } from 'lucide-react'
import { useAuth } from '../../lib/authContext'
import { useFormValidation } from '../../hooks/useFormValidation'
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

  const { signIn, signUp, resetPassword, signInWithGoogle } = useAuth()

  // Form validation setup based on mode
  const getInitialValues = () => {
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
  }

  const getSchema = () => {
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
  }

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset
  } = useFormValidation(getSchema(), getInitialValues())

  // Reset form when mode changes
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
          toast.success('Successfully signed in!')
          onClose()
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
    } catch (error: any) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const { error } = await signInWithGoogle()
      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Successfully signed in with Google!')
        onClose()
      }
    } catch (error: any) {
      toast.error('Failed to sign in with Google')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSwitchMode = (newMode: 'login' | 'register' | 'forgot-password') => {
    reset()
    onModeChange(newMode)
  }

  if (!isOpen) return null

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Welcome Back'
      case 'register': return 'Create Account'
      case 'forgot-password': return 'Reset Password'
    }
  }

  const getDescription = () => {
    switch (mode) {
      case 'login': return 'Sign in to rate deals and manage your preferences'
      case 'register': return 'Join thousands of traders finding the best deals'
      case 'forgot-password': return 'Enter your email to receive a password reset link'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <FocusManager trapFocus restoreFocus>
        <div className="bg-surface rounded-2xl max-w-md w-full p-6 relative border border-border">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-textSecondary hover:text-text transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-text mb-2">
              {getTitle()}
            </h2>
            <p className="text-textSecondary">
              {getDescription()}
            </p>
          </div>

          {/* Google Sign In - Only show for login and register */}
          {mode !== 'forgot-password' && (
            <>
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-border rounded-lg hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                <Chrome className="w-5 h-5 text-textSecondary" />
                <span className="text-text font-medium">
                  Continue with Google
                </span>
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-surface text-textSecondary">or</span>
                </div>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
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

            {mode === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => handleSwitchMode('forgot-password')}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-medium hover:from-primary/90 hover:to-secondary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {mode === 'login' ? 'Signing In...' : mode === 'register' ? 'Creating Account...' : 'Sending Email...'}
                </div>
              ) : (
                mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Reset Email'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            {mode === 'login' && (
              <p className="text-textSecondary">
                Don't have an account?{' '}
                <button
                  onClick={() => handleSwitchMode('register')}
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Sign Up
                </button>
              </p>
            )}
            
            {mode === 'register' && (
              <p className="text-textSecondary">
                Already have an account?{' '}
                <button
                  onClick={() => handleSwitchMode('login')}
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Sign In
                </button>
              </p>
            )}
            
            {mode === 'forgot-password' && (
              <p className="text-textSecondary">
                Remember your password?{' '}
                <button
                  onClick={() => handleSwitchMode('login')}
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Back to Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </FocusManager>
    </div>
  )
}