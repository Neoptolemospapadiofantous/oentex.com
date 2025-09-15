// src/pages/ResetPassword.tsx - Handle password reset
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icons } from '@components/icons'
import { useAuth } from '../../lib/authContext'
import { showErrorToast, showSuccessToast } from '../../components/ui/AppToast'
import { authService } from '../../lib/services/authService'

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isValidSession, setIsValidSession] = useState(false)
  
  const navigate = useNavigate()
  const { updatePassword } = useAuth()

  useEffect(() => {
    // Check if we have valid session for password reset
    const checkSession = async () => {
      const { session } = await authService.getSession()
      if (session) {
        setIsValidSession(true)
      } else {
        showErrorToast('Invalid or expired reset link')
        navigate('/')
      }
    }

    checkSession()
  }, [navigate])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!password.trim()) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const { error } = await updatePassword(password)
      
      if (error) {
        showErrorToast(error.message)
      } else {
        showSuccessToast('Password updated successfully!')
        navigate('/deals')
      }
    } catch (error: any) {
      showErrorToast('Failed to update password')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isValidSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground/70">Verifying reset link...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-20">
        <div className="max-w-md w-full container-p-md">
          <div className="bg-content1 rounded-2xl container-p-2xl border border-border">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Icons.lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-3">
                Set New Password
              </h1>
              <p className="text-foreground/70">
                Enter your new password below
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  New Password
                </label>
                <div className="relative">
                  <Icons.lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/70 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-10 pr-12 container-py-sm bg-background border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                      errors.password ? 'border-red-500' : 'border-border'
                    }`}
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/70 hover:text-foreground"
                  >
                    {showPassword ? <Icons.eyeOff className="w-5 h-5" /> : <Icons.eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <Icons.warning className="w-4 h-4 mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Icons.lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/70 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-10 pr-12 container-py-sm bg-background border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                      errors.confirmPassword ? 'border-red-500' : 'border-border'
                    }`}
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/70 hover:text-foreground"
                  >
                    {showConfirmPassword ? <Icons.eyeOff className="w-5 h-5" /> : <Icons.eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <Icons.warning className="w-4 h-4 mr-1" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white container-py-sm rounded-lg font-medium hover:from-primary/90 hover:to-secondary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Updating Password...
                  </div>
                ) : (
                  'Update Password'
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button
                onClick={() => navigate('/')}
                className="text-foreground/70 hover:text-primary transition-colors text-sm"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
  )
}

export default ResetPassword