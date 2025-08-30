import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Card,
  CardBody,
  Button,
  Avatar,
  Divider,
  Chip
} from '@heroui/react';
import { 
  Home, 
  Star, 
  Menu, 
  LogOut, 
  User,
  Search,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    { id: 'dashboard', name: 'Dashboard', icon: Home, path: '/dashboard', description: 'Overview & stats' },
    { id: 'deals', name: 'Browse Platforms', icon: Search, path: '/deals', description: 'Discover platforms' },
    { id: 'my-deals', name: 'My Ratings', icon: Star, path: '/my-deals', description: 'Your platform ratings' },
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

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === href
    }
    return location.pathname.startsWith(href)
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-content1">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-divider">
        <Link to="/dashboard" className="flex items-center" onClick={() => setIsMobileOpen(false)}>
          <span className="font-bold text-2xl gradient-text">
            Oentex
          </span>
        </Link>
        
        <Button
          isIconOnly
          variant="light"
          onPress={() => setIsMobileOpen(false)}
          className="lg:hidden"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* User Profile */}
      <div className="p-6 border-b border-divider">
        <Card 
          isPressable
          onPress={handleProfileClick}
          className="bg-content2 hover:bg-content3 transition-colors"
        >
          <CardBody className="p-4">
            <div className="flex items-center space-x-3">
              <Avatar
                icon={<User className="w-6 h-6" />}
                className="bg-gradient-to-r from-primary to-secondary text-white"
                size="md"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-small text-default-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActiveRoute(item.path);
          return (
            <Button
              key={item.id}
              as={Link}
              to={item.path}
              variant={active ? "solid" : "light"}
              color={active ? "primary" : "default"}
              className={`w-full justify-start h-auto p-4 ${active ? '' : 'hover:bg-content2'}`}
              startContent={<item.icon className="w-5 h-5" />}
              onPress={() => setIsMobileOpen(false)}
            >
              <div className="flex flex-col items-start">
                <span className="font-medium">{item.name}</span>
                <span className="text-tiny text-default-500">{item.description}</span>
              </div>
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-divider">
        <Button
          color="danger"
          variant="flat"
          className="w-full"
          startContent={<LogOut className="w-4 h-4" />}
          onPress={handleSignOut}
        >
          Sign Out
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 z-40">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
            />
            
            {/* Sidebar */}
            <motion.div 
              className="fixed inset-y-0 left-0 w-80 z-50 lg:hidden"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, session } = useAuth();

  // Welcome toast
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
      toast.success(
        `Welcome to Oentex! Successfully signed in with ${providerName}`,
        {
          id: `welcome-${userId}`,
          duration: 5000,
          position: 'top-right',
        }
      );
    }, 500);
  }, [user?.id, session?.user?.app_metadata?.provider])

  useEffect(() => {
    if (!user) {
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('welcome_toast_')) {
          sessionStorage.removeItem(key)
        }
      })
    }
  }, [user])

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
    <div className="h-screen flex overflow-hidden bg-background">
      <Sidebar 
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64 h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="bg-content1 border-b border-divider px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <Button
              isIconOnly
              variant="light"
              onPress={() => setIsMobileMenuOpen(true)}
              className="lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </Button>

            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center space-x-2">
              <span className="text-lg font-bold gradient-text">
                Oentex
              </span>
            </div>

            <div className="hidden lg:block"></div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-background">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;