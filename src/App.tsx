// src/App.tsx - MODERNIZED: Clean and optimized
import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './lib/authContext'

// ✅ MODERN: Import the clean query client
import { queryClient } from './lib/queryClient'

import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import PageTransition from './components/PageTransition'
import { AuthLoader, PageLoader } from './components/ui/LoadingSpinner'
import { AuthErrorBoundary } from './components/ui/AuthErrorBoundary'
import { ErrorBoundary } from './components/ui/ErrorBoundary'

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'))
const About = React.lazy(() => import('./pages/About'))
const Deals = React.lazy(() => import('./pages/Deals'))
const FAQ = React.lazy(() => import('./pages/FAQ'))
const Contact = React.lazy(() => import('./pages/Contact'))
const Terms = React.lazy(() => import('./pages/Terms'))
const Privacy = React.lazy(() => import('./pages/Privacy'))
const AuthCallback = React.lazy(() => import('./pages/AuthCallback'))
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'))

// ✅ MODERN: Optimized toast configuration
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

// ✅ MODERN: Clean page loader
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

// ✅ MODERN: Clean app content component
const AppContent: React.FC = () => {
  const { 
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="flex-1">
        <ScrollToTop />
        
        <ErrorBoundary>
          <Suspense fallback={<PageLoaderComponent />}>
            <PageTransition>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/deals" element={<Deals />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
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

// ✅ MODERN: Clean main app component
function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <AppContent />
            
            {/* ✅ MODERN: Optimized toast notifications */}
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
            
            {/* ✅ MODERN: React Query DevTools for debugging */}
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

// ✅ MODERN: Clean error handling
if (process.env.NODE_ENV === 'development') {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
  })
}

export default App