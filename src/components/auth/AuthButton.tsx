import React, { useState, useCallback } from 'react'
import { 
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spinner
} from '@heroui/react'
import { User, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../../lib/authContext'
import { AuthModal } from './AuthModals'
import { useNavigate } from 'react-router-dom'

export const AuthButton: React.FC = () => {
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'login' | 'register'>('login')
  const [isSigningOut, setIsSigningOut] = useState(false)
  const { user, signOut, loading, error, retryAuth } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = useCallback(async () => {
    if (isSigningOut) return
    
    setIsSigningOut(true)
    
    try {
      await signOut()
      navigate('/')
    } finally {
      setIsSigningOut(false)
    }
  }, [signOut, isSigningOut, navigate])

  const handleShowLogin = useCallback(() => {
    setModalMode('login')
    setShowModal(true)
  }, [])

  const handleShowRegister = useCallback(() => {
    setModalMode('register')
    setShowModal(true)
  }, [])

  if (loading) {
    return <Spinner size="sm" color="primary" />
  }

  if (error) {
    return (
      <Button
        size="sm"
        variant="flat"
        color="danger"
        onPress={retryAuth}
      >
        Retry
      </Button>
    )
  }

  if (user) {
    return (
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            as="button"
            className="transition-transform"
            color="primary"
            name={user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
            size="sm"
            src={user.user_metadata?.avatar_url}
            fallback={<User className="w-4 h-4" />}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">{user.email}</p>
          </DropdownItem>
          <DropdownItem 
            key="dashboard" 
            startContent={<User className="w-4 h-4" />}
            onPress={() => navigate('/dashboard')}
          >
            Dashboard
          </DropdownItem>
          <DropdownItem 
            key="settings" 
            startContent={<Settings className="w-4 h-4" />}
            onPress={() => navigate('/profile')}
          >
            Settings
          </DropdownItem>
          <DropdownItem 
            key="logout" 
            color="danger" 
            startContent={<LogOut className="w-4 h-4" />}
            onPress={handleSignOut}
            isDisabled={isSigningOut}
          >
            {isSigningOut ? 'Signing out...' : 'Sign Out'}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="light"
        onPress={handleShowLogin}
        size="sm"
      >
        Sign In
      </Button>
      <Button
        color="primary"
        onPress={handleShowRegister}
        size="sm"
      >
        Get Started
      </Button>

      {showModal && (
        <AuthModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          mode={modalMode}
          onModeChange={setModalMode}
        />
      )}
    </div>
  )
}