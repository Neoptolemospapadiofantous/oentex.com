// src/App.tsx - INTEGRATED: Dashboard + Public Site
import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './lib/authContext'
import UnsubscribePage from './pages/UnsubscribePage'
// ✅ Import the clean query client
import { queryClient } from './lib/queryClient'

// Public site components
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import PageTransition from './components/PageTransition'
import { AuthLoader, PageLoader } from './components/ui/LoadingSpinner'
import { AuthErrorBoundary } from './components/ui/AuthErrorBoundary'
import { ErrorBoundary } from './components/ui/ErrorBoundary'

// Dashboard components
import DashboardLayout from './components/dashboard/DashboardLayout'
import OAuthDebugger from './components/OAuthDebugger'

// Lazy load public pages
const Home = React.lazy(() => import('./pages/Home'))
const About = React.lazy(() => import('./pages/About'))
const PublicDeals = React.lazy(() => import('./pages/Deals')) // Rename your current deals page
const FAQ = React.lazy(() => import('./pages/FAQ'))
const Contact = React.lazy(() => import('./pages/Contact'))
const Terms = React.lazy(() => import('./pages/Terms'))
const Privacy = React.lazy(() => import('./pages/Privacy'))
const AuthCallback = React.lazy(() => import('./pages/AuthCallback'))
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'))

// Lazy load dashboard pages
const Dashboard = React.lazy(() => import('./pages/dashboard/Dashboard'))
// const BrowseDeals = React.lazy(() => import('./pages/dashboard/BrowseDeals'))
const MyDeals = React.lazy(() => import('./pages/dashboard/MyDeals'))
// const Analytics = React.lazy(() => import('./pages/dashboard/Analytics'))
const Profile = React.lazy(() => import('./pages/dashboard/Profile'))
// ✅ Toast configuration
const toastConfig = {
  duration: 4000,
  position: 'top-right' as const,
  
  success: {
    duration: 3000,
    style: {
      background: '#10B981',
      color: '#FFFFFF',
      fontWeight: '500',
    },
  },
  error: {
    duration: 5000,
    style: {
      background: '#EF4444',
      color: '#FFFFFF',
      fontWeight: '500',
    },
  },
  loading: {
    style: {
      background: '#3B82F6',
      color: '#FFFFFF',
    },
  },
}

// ✅ Dashboard App for authenticated users
const AuthenticatedApp: React.FC = () => {
  return (
    <DashboardLayout>
      <Suspense fallback={<PageLoader message="Loading dashboard..." />}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/deals" element={<PublicDeals />} />
          <Route path="/my-deals" element={<MyDeals />} />
          {/* <Route path="/analytics" element={<Analytics />} /> */}
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
          
        </Routes>
      </Suspense>
    </DashboardLayout>
  )
}

// ✅ Public website for non-authenticated users
const PublicApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="flex-1">
        <ScrollToTop />
        
        <ErrorBoundary>
          <Suspense fallback={<PageLoader message="Loading page..." />}>
            <PageTransition>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/deals" element={<PublicDeals />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/auth/reset-password" element={<ResetPassword />} />
                 <Route path="/unsubscribe" element={<UnsubscribePage />} />
                <Route path="*" element={
                  <div className="min-h-screen flex items-center justify-center pt-20">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-text mb-4">404</h1>
                      <p className="text-textSecondary mb-6">Page not found</p>
                      <a 
                        href="/" 
                        className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Go Home
                      </a>
                    </div>
                  </div>
                } />
              </Routes>
            </PageTransition>
          </Suspense>
        </ErrorBoundary>
      </main>
      
      <Footer />
    </div>
  )
}

// ✅ Page loader component
const PageLoaderComponent = () => {
  const { loading, initialized, isFullyReady } = useAuth()
  
  if (loading || !initialized) {
    return <AuthLoader stage="initializing" />
  }
  
  if (!isFullyReady) {
    return <AuthLoader stage="validating" />
  }
  
  return <PageLoader message="Loading page..." />
}

// ✅ Main app content with authentication routing
const AppContent: React.FC = () => {
  const { 
    user,
    loading: authLoading, 
    initialized, 
    isFullyReady,
    error: authError
  } = useAuth()

  // Show loading while initializing auth
  if (authLoading || !initialized) {
    return <AuthLoader stage="initializing" />
  }

  // Show auth error if there's an error and not ready
  if (authError && !isFullyReady) {
    return <AuthErrorBoundary error={authError} showReturnHome={false} />
  }

  // Show validating state
  if (!isFullyReady) {
    return <AuthLoader stage="validating" />
  }

  // ✅ KEY CHANGE: Route based on authentication status
  if (user) {
    // User is authenticated - show dashboard app
    return <AuthenticatedApp />
  } else {
    // User is not authenticated - show public website
    return <PublicApp />
  }
}

// ✅ Main App component
function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <AppContent />
            {process.env.NODE_ENV === 'development' && <OAuthDebugger />}
            {/* ✅ Toast notifications */}
            <Toaster 
              position="top-right"
              toastOptions={toastConfig}
              containerStyle={{
                top: '5rem',
                right: '1rem',
                zIndex: 9999,
              }}
              gutter={8}
              reverseOrder={false}
            />
            
            {/* ✅ React Query DevTools for debugging */}
            {process.env.NODE_ENV === 'development' && (
              <ReactQueryDevtools 
                initialIsOpen={false}
                position="bottom-right"
                toggleButtonProps={{
                  style: {
                    marginRight: '1rem',
                    marginBottom: '1rem',
                  }
                }}
              />
            )}
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

// ✅ Error handling for development
if (process.env.NODE_ENV === 'development') {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
  })
}

export default App