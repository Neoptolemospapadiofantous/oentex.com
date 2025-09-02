import React, { useState, useCallback } from 'react'
import { User, LogOut, AlertCircle } from 'lucide-react'
import {
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
  Spinner
} from '@heroui/react'
import { useAuth } from '../../lib/authContext'
import { AuthModal } from './AuthModals'
import { ErrorBoundary } from '../ui/ErrorBoundary'

export const AuthButton: React.FC = () => {
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'login' | 'register'>('login')
  const [isSigningOut, setIsSigningOut] = useState(false)
  const { user, signOut, loading, error, retryAuth } = useAuth()

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
    setModalMode('login')
    setShowModal(true)
  }, [])

  const handleShowRegister = useCallback(() => {
    setModalMode('register')
    setShowModal(true)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <Spinner size="sm" color="primary" />
        <span className="text-sm text-foreground-500 hidden sm:block">Loading...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2">
        <AlertCircle className="w-4 h-4 text-danger" />
        <Button
          size="sm"
          variant="light"
          color="danger"
          onPress={retryAuth}
          className="text-sm underline"
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
      <div className="flex items-center space-x-3">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
              <Avatar
                name={userInitials}
                src={user.user_metadata?.avatar_url}
                size="sm"
                className="bg-gradient-to-r from-primary to-secondary text-white"
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
                  <LogOut className="w-4 h-4" />
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
      <div className="flex items-center space-x-3">
        <Button
          variant="light"
          onPress={handleShowLogin}
          className="text-foreground hover:text-primary font-medium"
        >
          Sign In
        </Button>
        
        <Button
          color="primary"
          variant="solid"
          onPress={handleShowRegister}
          className="bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transform hover:scale-105 transition-all"
        >
          Get Started
        </Button>
      </div>

      {showModal && (
        <AuthModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          mode={modalMode}
          onModeChange={setModalMode}
        />
      )}
    </ErrorBoundary>
  )
}