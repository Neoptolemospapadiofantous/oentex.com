// src/components/dashboard/DashboardLayout.tsx (MOBILE OPTIMIZED)
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/authContext';
import { showSuccessToast } from '../components/ui/AppToast';
import ToastContainer from '@components/ui/ToastContainer';
import { Icons } from '../components/icons';
import logo from '../assets/logo.png';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen, isCollapsed, onToggleCollapse }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Icons.home, path: '/dashboard' },
    { id: 'deals', name: 'Browse Platforms', icon: Icons.search, path: '/dashboard/deals' },
    { id: 'my-deals', name: 'My Ratings', icon: Icons.star, path: '/my-deals' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMobileOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      navigate('/');
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar - Flex Layout */}
      <div className={`hidden lg:block h-screen lg:flex-shrink-0 transition-all duration-300 relative ${isCollapsed ? 'w-16' : 'w-64'}`}>
        {/* Toggle Button - Positioned at the tip/edge with offset */}
        <button
          onClick={onToggleCollapse}
          className="absolute top-1/2 -right-4 z-50 w-8 h-8 bg-content1 border-2 border-border rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-content2 hover:border-primary/30 group hover:scale-105 active:scale-95"
          style={{ transform: 'translateY(-50%)' }}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <Icons.chevronRight className="w-4 h-4 text-foreground/70 group-hover:text-primary transition-colors duration-200" />
          ) : (
            <Icons.chevronLeft className="w-4 h-4 text-foreground/70 group-hover:text-primary transition-colors duration-200" />
          )}
        </button>

        <div className="flex flex-col h-full w-full bg-content1 border-r border-border overflow-x-hidden">

          <div className={`flex flex-col h-full ${isCollapsed ? 'container-p-sm pb-0' : 'container-p-xs'}`}>
            {/* Header */}
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} container-p-sm border-b border-border flex-shrink-0 mb-md`}>
              {!isCollapsed && (
                <div className="flex items-center gap-xs container-p-xs">
                  <img src={logo} alt="Oentex" className="h-8 w-auto" />
                  <span className="text-lg font-bold text-foreground">Oentex</span>
                </div>
              )}
              {isCollapsed && (
                <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">

                  <img src={logo} alt="Oentex" className="h-6 w-auto" />
                </div>
              )}
            </div>

            {/* User Profile Section */}
            <div className={`${isCollapsed ? 'flex justify-center' : ''} container-p-sm border-b border-border flex-shrink-0 mb-md`}>
                <button 
                  onClick={handleProfileClick}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center group' : 'gap-xs'} container-p-sm rounded-lg transition-colors duration-200 hover:bg-content2`}
                  aria-label="View profile"
                  title={isCollapsed ? (user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User') : undefined}
                >
                  {/* avatar/icon – same visual weight as nav icons */}
                  <div className={`${isCollapsed ? 'w-12 h-12' : 'w-8 h-8'} flex items-center justify-center flex-shrink-0 ${isCollapsed ? 'rounded-lg' : 'rounded-full bg-content2'}`}>
                    <Icons.user className={`${isCollapsed ? 'w-6 h-6 group-hover:text-primary group-focus:text-primary' : 'w-4 h-4'} text-foreground/70`} />
                  </div>

                {!isCollapsed && (
                  <div className="flex-1 min-w-0 text-left container-p-xs">
                    <p className="text-xs font-medium truncate text-foreground">
                      {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs truncate text-foreground/60">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                )}
              </button>
            </div>

            {/* Navigation */}
             <nav className={`flex-1 ${isCollapsed ? 'flex flex-col items-center' : 'container-p-sm'} space-y-1 overflow-y-auto overflow-x-hidden mb-md`}>

              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <a
                      key={item.id}
                      href={item.path}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(item.path);
                        setIsMobileOpen(false);
                      }}
                      className={`${isCollapsed ? 'w-12 h-12' : 'w-full'} flex items-center ${isCollapsed ? 'justify-center' : 'gap-xs'} ${isCollapsed ? 'container-p-sm' : 'container-px-sm container-py-xs'} rounded-lg text-left transition-colors duration-200 ${
                        isActive 
                          ? isCollapsed
                            ? 'text-primary'
                            : 'text-primary'
                          : isCollapsed
                            ? 'hover:text-primary hover:bg-content2 text-foreground/60'
                            : 'hover:text-primary hover:bg-content2 text-foreground/60'
                      }`}
                      aria-label={`Navigate to ${item.name}`}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <item.icon className="w-6 h-6" />
                      {!isCollapsed && (
                        <span className="font-medium text-xs container-p-xs">{item.name}</span>
                      )}
                    </a>
                );
              })}
            </nav>

            {/* Sign Out Button */}
            <div className={`${isCollapsed ? 'flex justify-center' : ''} container-p-sm border-t border-border flex-shrink-0 mt-md mb-0`}>
              <button
                onClick={handleSignOut}
                className={`${isCollapsed ? 'w-12 h-12' : 'w-full'} flex items-center ${isCollapsed ? 'justify-center' : 'justify-center sm:justify-start gap-xs'} ${isCollapsed ? 'container-p-sm' : 'container-px-sm container-py-sm'} rounded-lg transition-colors duration-200 bg-content2 hover:bg-content3 text-foreground/70 hover:text-foreground`}
                aria-label="Sign out of account"
                title={isCollapsed ? 'Sign Out' : undefined}
              >
                <Icons.logout className="w-6 h-6" />
                {!isCollapsed && (
                  <span className="text-xs font-medium container-p-xs">Sign Out</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar - Overlay */}
      {isMobileOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close sidebar"
          />
          {/* Mobile Sidebar */}
          <div className="fixed top-0 left-0 z-50 w-72 sm:w-80 h-screen bg-content1 border-r border-border lg:hidden">
            <div className="flex flex-col h-full container-p-xs">
              {/* Header with close button for mobile */}
              <div className="flex items-center justify-between container-p-sm border-b border-border flex-shrink-0 mb-md">
                <div className="flex items-center gap-xs container-p-xs">
                  <img src={logo} alt="Oentex" className="h-8 w-auto" />
                  <span className="text-lg font-bold text-foreground">Oentex</span>
                </div>
                
                {/* Mobile close button */}
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="lg:hidden container-p-xs rounded-lg transition-colors hover:bg-content2 text-foreground/60"
                  aria-label="Close sidebar"
                >
                  <Icons.close className="w-5 h-5" />
                </button>
              </div>

              {/* User Profile Section */}
              <div className="container-p-sm border-b border-border flex-shrink-0 mb-md">
                <button 
                  onClick={handleProfileClick}
                  className="w-full flex items-center gap-xs container-p-sm rounded-lg transition-colors duration-200 hover:bg-content2" 
                  aria-label="View profile"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary">
                    <Icons.user className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0 text-left container-p-xs">
                    <p className="text-xs font-medium truncate text-foreground">
                      {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs truncate text-foreground/60">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 container-p-sm space-y-1 overflow-y-auto mb-md">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <a
                      key={item.id}
                      href={item.path}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(item.path);
                        setIsMobileOpen(false);
                      }}
                      className={`w-full flex items-center gap-xs container-px-sm container-py-xs rounded-lg text-left transition-colors duration-200 ${
                        isActive 
                          ? 'text-white bg-primary' 
                          : 'hover:bg-content2 text-foreground/60'
                      }`}
                      aria-label={`Navigate to ${item.name}`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium text-xs container-p-xs">{item.name}</span>
                    </a>
                  );
                })}
              </nav>

              {/* Sign Out Button */}
              <div className="container-p-sm border-t border-border flex-shrink-0 mt-md">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center sm:justify-start gap-xs container-px-sm container-py-sm rounded-lg transition-colors duration-200 bg-content2 hover:bg-content3 text-foreground/70 hover:text-foreground"
                  aria-label="Sign out of account"
                >
                  <Icons.logout className="w-4 h-4" />
                  <span className="text-xs font-medium container-p-xs">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user, session } = useAuth();

  // ✅ WELCOME TOAST: Show welcome toast once per session
  useEffect(() => {
    if (!user || !session?.user?.app_metadata?.provider) return
    const provider = session.user.app_metadata.provider
    const userId = session.user.id
    const toastKey = `welcome_toast_${userId}`
    if (sessionStorage.getItem(toastKey)) return
    sessionStorage.setItem(toastKey, 'true')
    const providerName = provider === 'google' ? 'Google' : 
                        provider === 'azure' ? 'Microsoft' : 'OAuth'
    setTimeout(() => {
      showSuccessToast(
        `Successfully signed in with ${providerName}`,
        'Welcome to Oentex!',
        5000
      );
    }, 500);
  }, [user?.id, session?.user?.app_metadata?.provider])

  // ✅ CLEANUP: When user signs out
  useEffect(() => {
    if (!user) {
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('welcome_toast_')) {
          sessionStorage.removeItem(key)
        }
      })
    }
  }, [user])

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-screen bg-background flex">
      <ToastContainer position="top-right" topAnchorSelector="#auth-topbar" topMargin={8} />
      
      {/* Sidebar - Fixed Position */}
      <Sidebar 
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      {/* Main Content - Flex to fill remaining space */}
      <div className="flex-1 h-screen overflow-y-auto">
        {/* Top Bar - Mobile Optimized */}
        <header id="auth-topbar" className="bg-content1 border-b border-border container-px-sm md:container-px-md container-py-sm md:container-py-md flex-shrink-0">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden container-p-sm rounded-lg transition-colors duration-200 -ml-2 hover:bg-content2 text-foreground/60"
              aria-label="Open sidebar menu"
            >
              <Icons.menu className="w-6 h-6" />
            </button>

            {/* Mobile Logo - Show when sidebar is closed */}
            <div className="lg:hidden flex items-center gap-xs container-p-xs">
              <span className="text-lg font-bold text-foreground">
                Oentex
              </span>
            </div>

            {/* Spacer for desktop */}
            <div className="hidden lg:block"></div>
          </div>
        </header>

        {/* Page Content - Mobile Optimized */}
        <main className="flex-1 overflow-y-auto">
          <div className="container-p-sm md:container-p-md lg:container-p-lg">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;