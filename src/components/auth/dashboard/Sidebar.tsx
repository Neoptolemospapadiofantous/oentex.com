// src/components/dashboard/Sidebar.tsx — Compact, theme-aligned
import React, { memo, useCallback, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Icons } from '../../icons'
import { useAuth } from '../../lib/authContext'

interface SidebarProps {
  isMobileOpen: boolean
  setIsMobileOpen: (open: boolean) => void
  /** Optional collapse support — keeps width tight & hides labels when true */
  isCollapsed?: boolean
  /** Optional: toggles collapsed state when using the bottom scrollbar control */
  onToggleCollapse?: () => void
}

interface NavItem {
  id: string
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', name: 'Dashboard', href: '/dashboard', icon: Icons.home },
  { id: 'deals', name: 'Browse Platforms', href: '/dashboard/deals', icon: Icons.search },
  { id: 'ratings', name: 'My Ratings', href: '/my-deals', icon: Icons.star },
  { id: 'profile', name: 'Profile', href: '/profile', icon: Icons.user }
]

const SidebarBase: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen, isCollapsed = false, onToggleCollapse }) => {
  const location = useLocation()
  const { user, signOut } = useAuth()

  const userDisplayName = useMemo(() => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  }, [user?.user_metadata?.full_name, user?.email])

  const userEmail = useMemo(() => user?.email || 'user@example.com', [user?.email])

  const userInitial = useMemo(() => userDisplayName.charAt(0).toUpperCase(), [userDisplayName])

  const isActive = useCallback(
    (href: string) => (href === '/dashboard' ? location.pathname === href : location.pathname.startsWith(href)),
    [location.pathname]
  )

  const handleSignOut = useCallback(async () => {
    try {
      await signOut()
      setIsMobileOpen(false)
    } catch (e) {
      // no-op
    }
  }, [signOut, setIsMobileOpen])

  const SidebarContent = memo(() => (
    <div className="flex h-full flex-col bg-content1 border-r border-border text-foreground">
      {/* Header */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} container-p-sm border-b border-border bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent transition-none duration-0 hover:bg-transparent focus:bg-transparent active:bg-transparent transition-none`}>
        {isCollapsed ? (
          <div className="w-8 h-8 flex items-center justify-center bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent transition-none duration-0 hover:bg-transparent focus:bg-transparent active:bg-transparent transition-none">
            <span className="text-[10px] font-bold text-foreground">OE</span>
          </div>
        ) : (
          <Link to="/dashboard" onClick={() => setIsMobileOpen(false)} className="flex items-center gap-xs">
            <span className="text-sm font-bold">Oentex</span>
          </Link>
        )}
      </div>

      {/* User */}
      <button
        onClick={() => setIsMobileOpen(false)}
        className={`w-full ${isCollapsed ? 'justify-center' : 'justify-start gap-sm'} flex items-center container-p-sm border-b border-border bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent transition-none duration-0 hover:bg-transparent focus:bg-transparent active:bg-transparent transition-none hover:bg-content2 transition-colors`}
        aria-label="View profile"
      >
        <div className={`${isCollapsed ? 'w-8 h-8' : 'w-8 h-8'} rounded-full bg-primary flex items-center justify-center flex-shrink-0`}>
          <span className="text-[10px] font-bold text-white">{userInitial}</span>
        </div>
        {!isCollapsed && (
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium truncate">{userDisplayName}</p>
            <p className="text-[11px] text-foreground/60 truncate">{userEmail}</p>
          </div>
        )}
      </button>

      {/* Nav */}
      <nav className={`${isCollapsed ? 'px-0' : 'container-px-sm'} py-xs flex-1 space-y-1 overflow-y-auto`} aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
          const ActiveIcon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.id}
              to={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`group flex items-center ${isCollapsed ? 'justify-center' : 'justify-start gap-sm'} ${
                isCollapsed ? 'container-py-xs' : 'container-px-sm container-py-xs'
              } rounded-lg transition-colors ${
                active ? 'bg-primary text-white' : 'text-foreground/70 hover:text-foreground hover:bg-content2'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <ActiveIcon className={`${isCollapsed ? 'w-5 h-5' : 'w-5 h-5'} flex-shrink-0`} />
              {!isCollapsed && <span className="text-xs font-medium">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className={`${isCollapsed ? 'container-px-xs' : 'container-p-sm'} border-t border-border`}>
        {/* Horizontal scrollbar-like toggle */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex w-full items-center justify-center py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            <span className={`block rounded-full ${isCollapsed ? 'w-8' : 'w-12'} h-1.5 bg-content3 hover:bg-content2 transition-all`} />
          </button>
        )}

        <button
          onClick={handleSignOut}
          className={`w-full ${isCollapsed ? 'justify-center' : 'justify-center sm:justify-start gap-sm'} flex items-center container-py-sm rounded-lg bg-content2 hover:bg-content3 transition-colors text-foreground/70 hover:text-foreground`}
          aria-label="Sign out"
        >
          <Icons.logout className="w-5 h-5" />
          {!isCollapsed && <span className="text-xs font-medium">Sign Out</span>}
        </button>
      </div>
    </div>
  ))

  return (
    <>
      {/* Desktop */}
      <div
        className={`hidden lg:block lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 transition-all duration-300 ${
          isCollapsed ? 'lg:w-16' : 'lg:w-60'
        }`}
      >
        <SidebarContent />
      </div>

      {/* Mobile */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 w-72 sm:w-80 bg-content1 z-50 lg:hidden border-r border-border shadow-xl animate-in slide-in-from-left duration-300">
            <SidebarContent />
          </div>
        </>
      )}
    </>
  )
}

const Sidebar = memo(SidebarBase)
Sidebar.displayName = 'Sidebar'
export default Sidebar
