// src/App.tsx - Fixed HeroUI integration
import * as React from "react";
import { HeroUIProvider } from '@heroui/react'  // ✅ v2.8+ stable
import { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { AuthProvider, useAuth } from './lib/authContext'
import { queryClient } from './lib/queryClient'
// ✅ FIXED: Import all missing components
import ScrollToTop from '@components/ScrollToTop'
import { AuthLoader, PageLoader } from '@components/ui/LoadingSpinner'
import { AuthErrorBoundary } from '@components/ui/AuthErrorBoundary'
import { ErrorBoundary } from '@components/ui/ErrorBoundary'
import ConsentManager from '@components/ConsentManager'

import AuthLayout from './layouts/AuthLayout'
import GuestLayout from './layouts/GuestLayout'

// Lazy-loaded page components
const Home = React.lazy(() => import('./pages/guest/Home'))
const About = React.lazy(() => import('./pages/guest/About'))
const PublicDeals = React.lazy(() => import('./pages/guest/Deals'))
const FAQ = React.lazy(() => import('./pages/guest/FAQ'))
const Contact = React.lazy(() => import('./pages/guest/Contact'))
const Terms = React.lazy(() => import('./pages/guest/Terms'))
const Privacy = React.lazy(() => import('./pages/guest/Privacy'))
const Cookies = React.lazy(() => import('./pages/guest/Cookies'))
const Authentication = React.lazy(() => import('./pages/guest/Authentication'))
const AuthCallback = React.lazy(() => import('./pages/guest/AuthCallback'))
const ResetPassword = React.lazy(() => import('./pages/guest/ResetPassword'))
const Unsubscribe = React.lazy(() => import('./pages/guest/Unsubscribe'))

// Dashboard pages
const Dashboard = React.lazy(() => import('./pages/auth/Dashboard'))
const AuthDeals = React.lazy(() => import('./pages/auth/Deals'))
const MyDeals = React.lazy(() => import('./pages/auth/MyDeals'))
const Profile = React.lazy(() => import('./pages/auth/Profile'))

const OAuthCallbackHandler: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader message="Processing OAuth tokens..." />}>
      <AuthCallback />
    </Suspense>
  )
}

// Custom wrapper for authentication pages with hidden header/footer
const AuthPageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <GuestLayout hideHeader={true} hideFooter={true}>
      {children}
    </GuestLayout>
  )
}

// ✅ IMPROVED: Add proper route protection
const AuthenticatedApp: React.FC = () => {
  return (
    <AuthLayout>
      <Suspense fallback={<PageLoader message="Loading dashboard..." />}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/deals" element={<AuthDeals />} />
          <Route path="/my-deals" element={<MyDeals />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/unsubscribe" element={<Unsubscribe />} />
          
          {/* ✅ IMPROVED: Catch-all redirect for authenticated users */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </AuthLayout>
  )
}

const PublicApp: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      
      <ErrorBoundary>
        <Suspense fallback={<PageLoader message="Loading page..." />}>
          <Routes>
            <Route path="/" element={
              <GuestLayout>
                <Home />
              </GuestLayout>
            } />
            <Route path="/about" element={
              <GuestLayout>
                <About />
              </GuestLayout>
            } />
            <Route path="/deals" element={
              <GuestLayout>
                <PublicDeals />
              </GuestLayout>
            } />
            <Route path="/faq" element={
              <GuestLayout>
                <FAQ />
              </GuestLayout>
            } />
            <Route path="/contact" element={
              <GuestLayout>
                <Contact />
              </GuestLayout>
            } />
            <Route path="/terms" element={
              <GuestLayout>
                <Terms />
              </GuestLayout>
            } />
            <Route path="/privacy" element={
              <GuestLayout>
                <Privacy />
              </GuestLayout>
            } />
            <Route path="/cookies" element={
              <GuestLayout>
                <Cookies />
              </GuestLayout>
            } />
            <Route path="/unsubscribe" element={
              <GuestLayout>
                <Unsubscribe />
              </GuestLayout>
            } />
            <Route path="/authentication" element={
              <AuthPageWrapper>
                <Authentication />
              </AuthPageWrapper>
            } />
            <Route path="/auth/callback" element={
              <GuestLayout>
                <OAuthCallbackHandler />
              </GuestLayout>
            } />
            <Route path="/auth/reset-password" element={
              <GuestLayout>
                <ResetPassword />
              </GuestLayout>
            } />
            
            <Route path="*" element={
              <GuestLayout>
                <div className="min-h-screen flex items-center justify-center pt-20">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-text mb-4">404</h1>
                    <p className="text-textSecondary mb-6">Page not found</p>
                    <a 
                      href="/" 
                      className="btn-primary"
                    >
                      Go Home
                    </a>
                  </div>
                </div>
              </GuestLayout>
            } />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
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
          {/* ✅ FIXED: HeroUIProvider from @heroui/system */}
          <HeroUIProvider
            navigate={(path) => {
              // Simple navigation - you can improve this with proper router integration
              window.location.href = path
            }}
            locale="en-US"
            disableAnimation={false}
            disableRipple={false}
            validationBehavior="native"
            reducedMotion="user"
          >
            <AuthProvider>
              <Router>
              <Routes>
                <Route 
                  path="/unsubscribe" 
                  element={
                    <Suspense fallback={<PageLoader message="Loading unsubscribe..." />}>
                      <Unsubscribe />
                    </Suspense>
                  } 
                />
                <Route path="/*" element={<AppContent />} />
              </Routes>
              
              {/* Cookie Consent Manager */}
              <ConsentManager />
              
              {/* Toasts are rendered inside layouts via ToastContainer */}
              
              {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools 
                  initialIsOpen={false}
                  position="bottom"
                />
              )}
              </Router>
            </AuthProvider>
          </HeroUIProvider>
        </QueryClientProvider>
      </ErrorBoundary>
  )
}

export default App