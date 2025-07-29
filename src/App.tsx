// src/App.tsx - Corrected version with all missing components fixed
import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './lib/authContext'
import { queryClient } from './lib/queryClient'

// ✅ FIXED: Import all missing components
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import PageTransition from './components/PageTransition'
import { AuthLoader, PageLoader } from './components/ui/LoadingSpinner'
import { AuthErrorBoundary } from './components/ui/AuthErrorBoundary'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

import DashboardLayout from './components/dashboard/DashboardLayout'

// Lazy-loaded page components
const Home = React.lazy(() => import('./pages/Home'))
const About = React.lazy(() => import('./pages/About'))
const PublicDeals = React.lazy(() => import('./pages/Deals'))
const FAQ = React.lazy(() => import('./pages/FAQ'))
const Contact = React.lazy(() => import('./pages/Contact'))
const Terms = React.lazy(() => import('./pages/Terms'))
const Privacy = React.lazy(() => import('./pages/Privacy'))
const AuthCallback = React.lazy(() => import('./pages/AuthCallback'))
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'))
const Unsubscribe = React.lazy(() => import('./pages/Unsubscribe'))

// Dashboard pages
const Dashboard = React.lazy(() => import('./pages/dashboard/Dashboard'))
const MyDeals = React.lazy(() => import('./pages/dashboard/MyDeals'))
const Profile = React.lazy(() => import('./pages/dashboard/Profile')) // ✅ FIXED: Complete import

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

const OAuthCallbackHandler: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader message="Processing OAuth tokens..." />}>
      <AuthCallback />
    </Suspense>
  )
}

// ✅ IMPROVED: Add proper route protection
const AuthenticatedApp: React.FC = () => {
  return (
    <DashboardLayout>
      <Suspense fallback={<PageLoader message="Loading dashboard..." />}>
        <Routes>
          <Route path="/auth/callback" element={<OAuthCallbackHandler />} />
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/deals" element={<PublicDeals />} />
          
          {/* ✅ IMPROVED: Protected routes with fallback */}
          <Route 
            path="/my-deals" 
            element={
              <ProtectedRoute fallback={<Navigate to="/dashboard" replace />}>
                <MyDeals />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute fallback={<Navigate to="/dashboard" replace />}>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </DashboardLayout>
  )
}

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
                <Route path="/unsubscribe" element={<Unsubscribe/>} />
                <Route path="/auth/callback" element={<OAuthCallbackHandler />} />
                <Route path="/auth/reset-password" element={<ResetPassword />} />
                
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

const AppContent: React.FC = () => {
  const { 
    user,
    loading: authLoading, 
    initialized, 
    isFullyReady,
    error: authError
  } = useAuth()

  const isOAuthCallback = typeof window !== 'undefined' && 
    (window.location.pathname === '/auth/callback' || 
     window.location.hash.includes('access_token'))

  if (isOAuthCallback) {
    return <OAuthCallbackHandler />
  }

  if (authLoading || !initialized) {
    return <AuthLoader stage="initializing" />
  }

  if (authError && !isFullyReady) {
    return <AuthErrorBoundary error={authError} showReturnHome={false} />
  }

  if (!isFullyReady) {
    return <AuthLoader stage="validating" />
  }

  if (user) {
    return <AuthenticatedApp />
  } else {
    return <PublicApp />
  }
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <AppContent />
            
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

export default App