// src/components/dashboard/DashboardLayout.tsx (MOBILE OPTIMIZED)
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/authContext';
import toast from 'react-hot-toast';
import ToastContainer from '@components/ui/ToastContainer';
import { Icons } from '../components/icons';



interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
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
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar - Mobile Optimized */}
      <div className={`fixed top-0 left-0 z-50 w-72 sm:w-80 lg:w-64 h-screen bg-content1 border-r border-divider transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full container-p-sm md:container-p-md">
          {/* Header with close button for mobile */}
          <div className="flex items-center justify-between container-p-md md:container-p-lg border-b border-divider flex-shrink-0 mb-md">
            <div className="flex items-center gap-sm container-p-sm">
              <span className="text-xl font-bold gradient-text">
                Oentex
              </span>
            </div>
            
            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden container-p-sm rounded-lg transition-colors hover:bg-content2 text-foreground/60"
              aria-label="Close sidebar"
            >
              <Icons.close className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile - Clickable section for better mobile UX */}
          <div className="container-p-md md:container-p-lg border-b border-divider flex-shrink-0 mb-md">
            <button
              onClick={handleProfileClick}
              className="w-full flex items-center gap-sm container-p-md rounded-lg transition-all duration-200 hover:bg-content2"
              aria-label="View profile"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-primary to-secondary">
                <Icons.user className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0 text-left container-p-sm">
                <p className="text-sm sm:text-base font-medium truncate text-foreground">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs sm:text-sm truncate text-foreground/60">
                  {user?.email}
                </p>
              </div>
            </button>
          </div>

          {/* Navigation - Scrollable content */}
          <nav className="flex-1 container-p-md md:container-p-lg space-y-sm overflow-y-auto mb-md">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`w-full flex items-center gap-sm container-px-md container-py-md rounded-lg text-left transition-all duration-200 ${
                    isActive
                      ? 'text-white border-r-2 bg-gradient-to-r from-primary to-secondary border-primary'
                      : 'hover:bg-content2 text-foreground/60'
                  }`}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.classList.add('bg-content2', 'text-primary');
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.classList.remove('bg-content2', 'text-primary');
                    }
                  }}
                  aria-label={`Navigate to ${item.name}`}
                >
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="font-medium text-sm sm:text-base container-p-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button - Always visible at bottom */}
          <div className="container-p-md md:container-p-lg border-t border-divider flex-shrink-0 mt-md">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center sm:justify-start gap-sm container-px-md container-py-md rounded-lg transition-colors duration-200 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
              aria-label="Sign out of account"
            >
              <Icons.logout className="w-5 h-5 sm:w-4 sm:h-4" />
              <span className="text-sm sm:text-base font-medium container-p-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    const Icon = Icons.globe;
    setTimeout(() => {
      toast.success(
        <div className="flex items-center gap-3">
          <Icons.success className="w-5 h-5" />
          <div>
            <div className="font-semibold">Welcome to Oentex!</div>
            <div className="text-sm opacity-80">Successfully signed in with {providerName}</div>
          </div>
        </div>,
        {
          id: `welcome-${userId}`,
          duration: 5000,
          position: 'top-right'
        }
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
    <div className="min-h-screen bg-gradient-to-br from-background via-content1/10 to-background relative overflow-hidden">
      {/* Sophisticated background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }}></div>

      <ToastContainer position="top-right" topAnchorSelector="#auth-topbar" topMargin={8} />
      
      {/* Layout Container */}
      <div className="flex min-h-screen relative z-10 container-p-sm md:container-p-md">
        <Sidebar 
          isMobileOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        
        {/* Main Content - Mobile Optimized */}
        <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar - Mobile Optimized */}
        <header id="auth-topbar" className="bg-content1 border-b border-divider container-px-md md:container-px-lg container-py-md md:container-py-lg flex-shrink-0 mb-md">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden container-p-md rounded-lg transition-colors duration-200 -ml-2 hover:bg-content2 text-foreground/60"
              onMouseEnter={(e) => {
                e.currentTarget.classList.add('bg-content2', 'text-foreground');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.classList.remove('bg-content2', 'text-foreground');
              }}
              aria-label="Open sidebar menu"
            >
              <Icons.menu className="w-6 h-6" />
            </button>

            {/* Mobile Logo - Show when sidebar is closed */}
            <div className="lg:hidden flex items-center gap-sm container-p-sm">
              <span className="text-lg font-bold gradient-text">
                Oentex
              </span>
            </div>

            {/* Spacer for desktop */}
            <div className="hidden lg:block"></div>
          </div>
        </header>

          {/* Page Content - Mobile Optimized */}
          <main className="flex-1 container-p-md md:container-p-lg overflow-y-auto">
            <div className="container-p-sm md:container-p-md">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;