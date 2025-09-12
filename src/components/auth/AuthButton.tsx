import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../icons'
import {
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spinner
} from '@heroui/react'
import { useAuth } from '../../lib/authContext'
import { ErrorBoundary } from '../ui/ErrorBoundary'

export const AuthButton: React.FC = () => {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const { user, signOut, loading, error, retryAuth } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = useCallback(async () => {
    if (isSigningOut) return
    
    setIsSigningOut(true)
    
    try {
      await signOut()
    } finally {
      setIsSigningOut(false)
    }
  }, [signOut, isSigningOut])

  const handleShowLogin = useCallback(() => {
    navigate('/login')
  }, [navigate])

  const handleShowRegister = useCallback(() => {
    navigate('/register')
  }, [navigate])

  if (loading) {
    return (
      <div className="flex items-center space-x-4 px-6 py-3 bg-gradient-to-r from-default-100 to-default-50 rounded-2xl border border-default-200 shadow-sm">
        <Spinner size="sm" color="primary" />
        <span className="text-sm text-foreground-500 hidden sm:block font-medium">Loading...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center space-x-4 px-6 py-3 bg-gradient-to-r from-danger-100 to-danger-50 rounded-2xl border border-danger-200 shadow-sm">
        <div className="w-8 h-8 bg-danger-200 rounded-full flex items-center justify-center">
          <Icon name="warning" size="sm" color="danger" />
        </div>
        <Button
          size="sm"
          variant="light"
          color="danger"
          onPress={retryAuth}
          className="text-sm underline font-medium"
        >
          Retry
        </Button>
      </div>
    )
  }

  if (user) {
    const userName = user.user_metadata?.full_name || 
                    user.email?.split('@')[0] || 
                    'User'

                    const userInitials = userName
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)

    return (
      <div className="flex items-center space-x-4 px-4 py-2">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <div className="flex items-center space-x-4 cursor-pointer hover:opacity-80 transition-all duration-300 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-default-100 hover:to-default-50 border border-transparent hover:border-default-200 shadow-sm hover:shadow-md">
              <Avatar
                name={userInitials}
                src={user.user_metadata?.avatar_url}
                size="sm"
                className="bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
              />
              <span className="text-sm font-medium hidden sm:block text-foreground">
                {userName}
              </span>
            </div>
          </DropdownTrigger>
          
          <DropdownMenu aria-label="User menu">
            <DropdownItem
              key="profile"
              className="h-14 gap-2"
              textValue={`Signed in as ${userName}`}
            >
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Signed in as</span>
                <span className="text-sm text-foreground-500">{user.email}</span>
              </div>
            </DropdownItem>
            
            <DropdownItem
              key="dashboard"
              href="/dashboard"
              className="text-foreground"
            >
              Dashboard
            </DropdownItem>
            
            <DropdownItem
              key="profile-page"
              href="/profile"
              className="text-foreground"
            >
              Profile Settings
            </DropdownItem>
            
            <DropdownItem
              key="my-deals"
              href="/my-deals"
              className="text-foreground"
            >
              My Deals
            </DropdownItem>
            
            <DropdownItem
              key="logout"
              color="danger"
              className="text-danger"
              onPress={handleSignOut}
              startContent={
                isSigningOut ? (
                  <Spinner size="sm" color="danger" />
                ) : (
                  <Icon name="logout" size="sm" />
                )
              }
            >
              {isSigningOut ? 'Signing out...' : 'Sign Out'}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="flex items-center space-x-6 px-4 py-3 bg-gradient-to-r from-background to-default-50 rounded-2xl border border-default-200 shadow-sm">
        <Button
          variant="light"
          onPress={handleShowLogin}
          className="text-foreground hover:text-primary font-medium px-8 py-3 rounded-xl hover:bg-default-100 transition-all duration-300"
        >
          Sign In
        </Button>
        
        <Button
          color="primary"
          variant="solid"
          onPress={handleShowRegister}
          className="bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transform hover:scale-105 transition-all px-8 py-3 rounded-xl shadow-lg"
        >
          Get Started
        </Button>
      </div>

    </ErrorBoundary>
  )
}