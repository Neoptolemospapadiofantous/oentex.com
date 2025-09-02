// src/components/dashboard/Sidebar.tsx (CLEAN - NO LOGO)
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Star, 
  User, 
  Gift, 
  LogOut, 
  X,
} from 'lucide-react'
import { useAuth } from '../../lib/authContext'

interface SidebarProps {
  isMobileOpen: boolean
  setIsMobileOpen: (open: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const location = useLocation()
  const { user, signOut } = useAuth()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      description: 'Overview & stats'
    },
    {
      name: 'Browse Deals',
      href: '/dashboard/deals',
      icon: Gift,
      description: 'Discover platforms'
    },
    {
      name: 'My Ratings',
      href: '/my-deals',
      icon: Star,
      description: 'Your platform ratings'
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
      description: 'Account settings'
    }
  ]

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === href
    }
    return location.pathname.startsWith(href)
  }

  const handleSignOut = async () => {
    await signOut()
    setIsMobileOpen(false)
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
        <Link to="/dashboard" className="flex items-center" onClick={() => setIsMobileOpen(false)}>
          <span className="font-bold text-xl sm:text-2xl" style={{
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Oentex
          </span>
        </Link>
        
        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-2 rounded-lg transition-colors hover:bg-gray-100"
          style={{ color: 'var(--text-secondary)' }}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User Info */}
      <div className="p-4 sm:p-6 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm sm:text-base font-medium truncate" style={{ color: 'var(--text)' }}>
              {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-xs sm:text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation - Scrollable */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const active = isActiveRoute(item.href)
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center space-x-3 px-4 py-4 sm:py-3 rounded-lg transition-all duration-200 group ${
                active 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'hover:bg-surface text-textSecondary hover:text-text'
              }`}
            >
              <item.icon 
                className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors flex-shrink-0 ${
                  active ? 'text-primary' : 'text-textSecondary group-hover:text-text'
                }`} 
              />
              <div className="flex-1 min-w-0">
                <div className={`text-sm sm:text-base font-medium ${
                  active ? 'text-primary' : 'text-text'
                }`}>
                  {item.name}
                </div>
                <div className="text-xs sm:text-sm text-textSecondary">
                  {item.description}
                </div>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer - Always visible */}
      <div className="p-4 sm:p-6 border-t flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center sm:justify-start space-x-3 px-4 py-4 sm:py-3 rounded-lg transition-colors bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
        >
          <LogOut className="w-5 h-5 sm:w-4 sm:h-4" />
          <span className="text-sm sm:text-base font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar - Fixed */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r" style={{ borderColor: 'var(--border)' }}>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar - Overlay */}
      {isMobileOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
          {/* Sidebar - Mobile Optimized Width */}
          <div 
            className="fixed inset-y-0 left-0 w-72 sm:w-80 bg-white z-50 lg:hidden flex flex-col border-r shadow-xl" 
            style={{ borderColor: 'var(--border)' }}
          >
            <SidebarContent />
          </div>
        </>
      )}
    </>
  )
}

export default Sidebar