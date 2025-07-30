// src/components/dashboard/DashboardLayout.tsx (MOBILE OPTIMIZED)
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Star, 
  Menu, 
  LogOut, 
  User,
  Search,
  Chrome,
  X
} from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import toast from 'react-hot-toast';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'deals', name: 'Browse Platforms', icon: Search, path: '/deals' },
    { id: 'my-deals', name: 'My Ratings', icon: Star, path: '/my-deals' },
    { id: 'profile', name: 'Profile', icon: User, path: '/profile' },
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

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar - Mobile Optimized */}
      <div className={`fixed top-0 left-0 z-50 w-72 sm:w-80 lg:w-64 h-screen bg-white border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`} style={{ borderColor: 'var(--border)' }}>
        <div className="flex flex-col h-full">
          {/* Header with close button for mobile */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center space-x-2">
              <img 
                src="src\assets\logo.png" 
                alt="Oentex Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold" style={{
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Oentex
              </span>
            </div>
            
            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile - Moved to top for better mobile UX */}
          <div className="p-4 sm:p-6 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))'
              }}>
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

          {/* Navigation - Scrollable content */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`w-full flex items-center space-x-3 px-4 py-4 sm:py-3 rounded-lg text-left transition-all duration-200 ${
                    isActive
                      ? 'text-white border-r-2'
                      : 'hover:bg-opacity-50'
                  }`}
                  style={isActive ? {
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    borderColor: 'var(--primary)'
                  } : {
                    color: 'var(--text-secondary)',
                    ':hover': {
                      backgroundColor: 'var(--surface)',
                      color: 'var(--primary)'
                    }
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--surface)';
                      e.currentTarget.style.color = 'var(--primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="font-medium text-sm sm:text-base">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button - Always visible at bottom */}
          <div className="p-4 border-t flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center sm:justify-start space-x-3 px-4 py-4 sm:py-3 rounded-lg transition-colors duration-200 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
            >
              <LogOut className="w-5 h-5 sm:w-4 sm:h-4" />
              <span className="text-sm sm:text-base font-medium">Sign Out</span>
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

    // Check if already shown
    if (sessionStorage.getItem(toastKey)) return

    // Mark as shown
    sessionStorage.setItem(toastKey, 'true')

    const providerName = provider === 'google' ? 'Google' : 
                        provider === 'azure' ? 'Microsoft' : 'OAuth'

    const Icon = Chrome;

    // Show toast after small delay
    setTimeout(() => {
      toast.success(
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          <div>
            <div className="font-semibold">Welcome to Oentex!</div>
            <div className="text-sm text-gray-600">Successfully signed in with {providerName}</div>
          </div>
        </div>,
        {
          id: `welcome-${userId}`,
          duration: 5000,
          position: 'top-right',
          style: {
            background: '#10B981',
            color: 'white',
            padding: '16px',
            borderRadius: '12px',
          }
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
    <div className="h-screen flex overflow-hidden" style={{ backgroundColor: 'var(--surface)' }}>
      <Sidebar 
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />
      
      {/* Main Content - Mobile Optimized */}
      <div className="flex-1 flex flex-col lg:ml-64 h-screen overflow-hidden">
        {/* Top Bar - Mobile Optimized */}
        <header className="bg-white border-b px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg transition-colors duration-200 -ml-2"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface)';
                e.currentTarget.style.color = 'var(--text)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Mobile Logo - Show when sidebar is closed */}
            <div className="lg:hidden flex items-center space-x-2">
              <img 
                src="src\assets\logo.png" 
                alt="Oentex Logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-lg font-bold" style={{
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Oentex
              </span>
            </div>

            {/* Spacer for desktop */}
            <div className="hidden lg:block"></div>
          </div>
        </header>

        {/* Page Content - Mobile Optimized */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;