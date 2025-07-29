// src/components/dashboard/Sidebar.tsx
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Star, 
  User, 
  Gift, 
  Settings, 
  LogOut, 
  X,
  TrendingUp,
  BarChart3
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
      href: '/deals',
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
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">TR</span>
          </div>
          <span className="font-bold text-xl" style={{ color: 'var(--text)' }}>
            TradingRater
          </span>
        </Link>
        
        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-2 rounded-lg transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* User Info */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
              {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const active = isActiveRoute(item.href)
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                active 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'hover:bg-surface text-textSecondary hover:text-text'
              }`}
            >
              <item.icon 
                className={`w-5 h-5 transition-colors ${
                  active ? 'text-primary' : 'text-textSecondary group-hover:text-text'
                }`} 
              />
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${
                  active ? 'text-primary' : 'text-text'
                }`}>
                  {item.name}
                </div>
                <div className="text-xs text-textSecondary">
                  {item.description}
                </div>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-textSecondary hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </>
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
          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 w-64 bg-white z-50 lg:hidden flex flex-col border-r" style={{ borderColor: 'var(--border)' }}>
            <SidebarContent />
          </div>
        </>
      )}
    </>
  )
}

export default Sidebar