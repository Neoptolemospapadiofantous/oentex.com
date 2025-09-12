import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@heroui/react'
import { useAuth } from '../../lib/authContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectToLogin?: boolean
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback,
  redirectToLogin = false 
}) => {
  const { user, loading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (user) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  if (redirectToLogin) {
    try {
      localStorage.setItem('returnTo', location.pathname + location.search)
    } catch {}
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-background via-default-50 to-background px-6">
        <div className="text-center max-w-2xl mx-auto py-16 bg-background rounded-3xl shadow-2xl border border-divider p-16">
          <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-primary text-2xl font-bold">🔐</span>
            </div>
          </div>
          <h2 className="text-5xl font-bold text-foreground mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Authentication Required
          </h2>
          <p className="text-foreground-500 mb-16 text-2xl font-medium">
            Please sign in to access this content.
          </p>
          <div className="space-y-8">
            <Button
              onPress={() => navigate('/login')}
              color="primary"
              variant="solid"
              size="lg"
              className="w-full font-medium py-8 text-lg shadow-lg"
            >
              Sign In
            </Button>
            <Button
              onPress={() => navigate('/register')}
              color="default"
              variant="bordered"
              size="lg"
              className="w-full font-medium py-8 text-lg shadow-lg border-2"
            >
              Create Account
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}