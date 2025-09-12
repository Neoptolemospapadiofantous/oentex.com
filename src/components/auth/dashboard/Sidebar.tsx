// src/components/dashboard/Sidebar.tsx (CLEAN - NO LOGO)
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Icons } from '../../icons'
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
      category: 'Main',
      items: [
        {
          name: 'Dashboard',
          href: '/dashboard',
          icon: Icons.home,
          description: 'Overview & stats'
        },
        {
          name: 'Browse Deals',
          href: '/dashboard/deals',
          icon: Icons.gift,
          description: 'Discover platforms'
        }
      ]
    },
    {
      category: 'Account',
      items: [
        {
          name: 'My Ratings',
          href: '/my-deals',
          icon: Icons.star,
          description: 'Your platform ratings'
        },
        {
          name: 'Profile',
          href: '/profile',
          icon: Icons.user,
          description: 'Account settings'
        }
      ]
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
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
        <Link 
          to="/dashboard" 
          className="flex items-center" 
          onClick={() => setIsMobileOpen(false)}
        >
          <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Oentex
          </span>
        </Link>
        
        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-2 rounded-lg transition-colors hover:bg-gray-100 text-gray-500"
        >
          <Icons.close className="w-5 h-5" />
        </button>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">
              {(user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User').charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-gray-900">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">150</span>
              </div>
              <button className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-full font-medium">
                Upgrade
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - Scrollable */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {navigation.map((category) => (
          <div key={category.category}>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
              {category.category}
            </h3>
            <div className="space-y-1">
              {category.items.map((item) => {
                const active = isActiveRoute(item.href)
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      active 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                        : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <item.icon 
                      className={`w-5 h-5 transition-colors flex-shrink-0 ${
                        active ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'
                      }`} 
                    />
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium ${
                        active ? 'text-white' : 'text-gray-900 group-hover:text-gray-900'
                      }`}>
                        {item.name}
                      </div>
                      <div className={`text-xs ${
                        active ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {item.description}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Utility Links */}
      <div className="p-4 space-y-1">
        <Link to="/whats-new" className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-gray-100 text-gray-600 hover:text-gray-900 group">
          <Icons.sparkles className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
          <span className="text-sm font-medium">What's New</span>
        </Link>
        <Link to="/premium" className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-gray-100 text-gray-600 hover:text-gray-900 group">
          <Icons.trophy className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
          <span className="text-sm font-medium">Premium Plans</span>
        </Link>
        <Link to="/api" className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-gray-100 text-gray-600 hover:text-gray-900 group">
          <Icons.key className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
          <span className="text-sm font-medium">API Access</span>
        </Link>
        <Link to="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-gray-100 text-gray-600 hover:text-gray-900 group">
          <Icons.settings className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
          <span className="text-sm font-medium">Settings</span>
        </Link>
        <Link to="/learn" className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-gray-100 text-gray-600 hover:text-gray-900 group">
          <Icons.bookmark className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
          <span className="text-sm font-medium">Learn</span>
          <Icons.externalLink className="w-3 h-3 text-gray-400 ml-auto" />
        </Link>
        <Link to="/help" className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-gray-100 text-gray-600 hover:text-gray-900 group">
          <Icons.info className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
          <span className="text-sm font-medium">FAQ & Help</span>
          <Icons.externalLink className="w-3 h-3 text-gray-400 ml-auto" />
        </Link>
      </div>

      {/* Footer - Always visible */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0 space-y-3">
        <div className="text-xs text-gray-500 text-center">
          <div className="flex justify-center gap-2">
            <span>Terms</span>
            <span>•</span>
            <span>Privacy</span>
            <span>•</span>
            <span>Support</span>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center sm:justify-start gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-red-50 text-red-600 hover:text-red-700"
        >
          <Icons.logout className="w-4 h-4" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar - Fixed */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 shadow-sm">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar - Overlay */}
      {isMobileOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
          {/* Sidebar - Mobile Optimized Width */}
          <div 
            className="fixed inset-y-0 left-0 w-72 sm:w-80 bg-white z-50 lg:hidden flex flex-col border-r border-gray-200 shadow-xl"
          >
            <SidebarContent />
          </div>
        </>
      )}
    </>
  )
}

export default Sidebar