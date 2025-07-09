// src/App.tsx (Updated with enhanced auth handling)
import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './lib/authContext'

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


// Page loading component with auth awareness
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

// App content component with auth state management
const AppContent: React.FC = () => {
  const { 
    loading: authLoading, 
    initialized, 
    isFullyReady,
    error: authError,
    // sessionValidated,
    // userDataLoaded
  } = useAuth()

  // Show auth loader during initialization
  if (authLoading || !initialized) {
    return <AuthLoader stage="initializing" />
  }

  // // Show auth error if critical auth failure
  // if (authError && (!sessionValidated || !userDataLoaded)) {
  //   return <AuthErrorBoundary error={authError} showReturnHome={false} />
  // }

  // // Show validation loader if session/user data still loading
  // if (!isFullyReady) {
  //   const stage = !sessionValidated ? 'validating' : 'loading-profile'
  //   return <AuthLoader stage={stage} />
  // }

  return (
    <div className="min-h-screen bg-background text-text overflow-x-hidden">
      <ScrollToTop />
      <Header />
      <PageTransition>
        <Suspense fallback={<PageLoaderComponent />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            
            {/* Auth Routes */}
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </PageTransition>
      <Footer />
      

    </div>
  )
}

// 404 Component
const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-text mb-4">404</h1>
        <p className="text-textSecondary mb-8">Page not found</p>
        <a 
          href="/" 
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  )
}

// Toast configuration
const toastConfig = {
  duration: 4000,
  style: {
    background: '#ffffff',
    color: '#1f2937',
    border: '1px solid #e5e7eb',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  success: {
    iconTheme: {
      primary: '#10b981',
      secondary: '#ffffff',
    },
  },
  error: {
    iconTheme: {
      primary: '#ef4444',
      secondary: '#ffffff',
    },
  },
}

// Query client error recovery
const handleQueryError = (error: Error) => {
  console.error('Query error:', error)
  
  // Check if it's an auth-related error
  if (error.message?.includes('auth') || 
      error.message?.includes('unauthorized') || 
      error.message?.includes('forbidden')) {
    // Don't show toast for auth errors - let AuthErrorBoundary handle it
    return
  }
  
  // Show toast for other errors
  if (!error.message?.includes('Query was cancelled')) {
    console.error('Non-auth query error:', error)
  }
}

// Enhanced query client with better error handling
const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: (failureCount, error) => {
          // Don't retry on auth errors
          if (error && typeof error === 'object' && 'message' in error) {
            const message = (error as Error).message.toLowerCase()
            if (message.includes('auth') || 
                message.includes('unauthorized') || 
                message.includes('forbidden')) {
              return false
            }
          }
          
          // Don't retry on 4xx errors
          if (error && typeof error === 'object' && 'status' in error) {
            const status = (error as any).status
            if (status >= 400 && status < 500) return false
          }
          
          return failureCount < 3
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        onError: handleQueryError,
      },
      mutations: {
        retry: (failureCount, error) => {
          // Don't retry auth-related mutations
          if (error && typeof error === 'object' && 'message' in error) {
            const message = (error as Error).message.toLowerCase()
            if (message.includes('auth') || 
                message.includes('unauthorized') || 
                message.includes('forbidden')) {
              return false
            }
          }
          return failureCount < 2
        },
        onError: handleQueryError,
      }
    }
  })
}

// Main App component
function App() {
  // Create query client instance
  const queryClientInstance = React.useMemo(() => createQueryClient(), [])

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClientInstance}>
        <AuthProvider>
          <Router>
            <AppContent />
            
            {/* Toast notifications */}
            <Toaster 
              position="top-right"
              toastOptions={toastConfig}
              containerStyle={{
                top: '5rem', // Account for header height
              }}
            />
            
            {/* React Query DevTools (only in development) */}
            {process.env.NODE_ENV === 'development' && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App