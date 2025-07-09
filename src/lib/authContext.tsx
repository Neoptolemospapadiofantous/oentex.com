// src/lib/authContext.tsx (Fixed - Prevents Infinite Loops)
import React, { createContext, useContext, useEffect, useReducer, useCallback, useMemo, useRef } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { authService } from './services/authService'
import { logger } from '../utils/logger'
import { AuthError as CustomAuthError, AuthErrorType } from '../types/auth'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: CustomAuthError | null
  initialized: boolean
}

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: CustomAuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: CustomAuthError | null }>
  signInWithGoogle: () => Promise<{ error: CustomAuthError | null }>
  signOut: () => Promise<{ error: CustomAuthError | null }>
  resetPassword: (email: string) => Promise<{ error: CustomAuthError | null }>
  updatePassword: (password: string) => Promise<{ error: CustomAuthError | null }>
  clearError: () => void
  retryAuth: () => Promise<void>
  refreshSession: () => Promise<void>
  isFullyReady: boolean
}

type AuthAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_SESSION'; payload: Session | null }
  | { type: 'SET_ERROR'; payload: CustomAuthError | null }
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'RESET_STATE' }
  | { type: 'FORCE_READY' }

const initialState: AuthState = {
  user: null,
  session: null,
  loading: true,
  error: null,
  initialized: false,
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'SET_SESSION':
      return { ...state, session: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SET_INITIALIZED':
      return { ...state, initialized: action.payload }
    case 'RESET_STATE':
      return { 
        ...initialState, 
        loading: false, 
        initialized: true
      }
    case 'FORCE_READY':
      return {
        ...state,
        loading: false,
        initialized: true,
        error: null
      }
    default:
      return state
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Export hook separately to avoid Fast Refresh issues
const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const initializationRef = useRef<Promise<void> | null>(null)
  const authTimeoutRef = useRef<NodeJS.Timeout>()
  const isMountedRef = useRef(true)
  const initAttempts = useRef(0)
  const forceReadyTimeoutRef = useRef<NodeJS.Timeout>()

  const MAX_INIT_ATTEMPTS = 3
  const INIT_TIMEOUT = 10000 // 10 seconds
  const FORCE_READY_TIMEOUT = 15000 // 15 seconds

  // Computed property - simplified
  const isFullyReady = useMemo(() => {
    return state.initialized && !state.loading
  }, [state.initialized, state.loading])

  // Stable error handler
  const handleAuthError = useCallback((error: AuthError | Error | unknown): CustomAuthError => {
    const authError = authService.handleAuthError(error)
    if (isMountedRef.current) {
      dispatch({ type: 'SET_ERROR', payload: authError })
    }
    return authError
  }, [])

  const clearError = useCallback(() => {
    if (isMountedRef.current) {
      dispatch({ type: 'SET_ERROR', payload: null })
    }
  }, [])

  // Force ready after timeout to prevent infinite loops
  const forceReady = useCallback(() => {
    logger.warn('Forcing auth ready state to prevent infinite loop')
    if (isMountedRef.current) {
      dispatch({ type: 'FORCE_READY' })
    }
  }, [])

  // Simplified session validation with timeout
  const validateSession = useCallback(async (session: Session | null): Promise<boolean> => {
    if (!session) {
      return true // No session is valid state
    }

    try {
      const now = Date.now()
      const expiresAt = (session.expires_at || 0) * 1000
      
      // If session expires in less than 1 minute, try to refresh
      if (now >= expiresAt - 60000) {
        logger.info('Session expiring soon, attempting refresh...')
        
        const refreshPromise = supabase.auth.refreshSession()
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Session refresh timeout')), 5000)
        })

        const { data: { session: newSession }, error } = await Promise.race([
          refreshPromise,
          timeoutPromise
        ])
        
        if (error) {
          logger.error('Session refresh failed:', error)
          return false
        }
        
        if (newSession && isMountedRef.current) {
          dispatch({ type: 'SET_SESSION', payload: newSession })
          dispatch({ type: 'SET_USER', payload: newSession.user })
        }
      }
      
      return true
    } catch (error) {
      logger.error('Session validation failed:', error)
      return false
    }
  }, [])

  // Simplified initialization with timeout and retry logic
  const initializeAuth = useCallback(async (): Promise<void> => {
    if (initializationRef.current) {
      return initializationRef.current
    }

    if (initAttempts.current >= MAX_INIT_ATTEMPTS) {
      logger.error('Max auth initialization attempts reached, forcing ready state')
      forceReady()
      return
    }

    initializationRef.current = (async () => {
      try {
        if (!isMountedRef.current) return

        initAttempts.current++
        logger.info(`Initializing auth state (attempt ${initAttempts.current}/${MAX_INIT_ATTEMPTS})...`)
        
        dispatch({ type: 'SET_LOADING', payload: true })
        dispatch({ type: 'SET_ERROR', payload: null })
        
        // Set up timeout to prevent infinite hanging
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Auth initialization timeout')), INIT_TIMEOUT)
        })

        const sessionPromise = supabase.auth.getSession()
        
        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ])
        
        if (!isMountedRef.current) return

        if (error) {
          logger.error('Failed to get session:', error)
          handleAuthError(error)
        } else {
          // Validate session without blocking
          const isValid = await validateSession(session)
          
          if (isValid) {
            dispatch({ type: 'SET_SESSION', payload: session })
            dispatch({ type: 'SET_USER', payload: session?.user ?? null })
            
            // Create user profile if needed (non-blocking)
            if (session?.user) {
              authService.createUserProfile(session.user).catch(error => {
                logger.error('Failed to create user profile:', error)
                // Don't fail auth initialization for profile creation errors
              })
            }
          } else {
            dispatch({ type: 'SET_SESSION', payload: null })
            dispatch({ type: 'SET_USER', payload: null })
          }
        }

        // Reset attempts on success
        initAttempts.current = 0
      } catch (error) {
        logger.error('Auth initialization failed:', error)
        if (isMountedRef.current) {
          handleAuthError(error)
          dispatch({ type: 'SET_SESSION', payload: null })
          dispatch({ type: 'SET_USER', payload: null })
        }
      } finally {
        if (isMountedRef.current) {
          dispatch({ type: 'SET_LOADING', payload: false })
          dispatch({ type: 'SET_INITIALIZED', payload: true })
        }
        initializationRef.current = null
      }
    })()

    return initializationRef.current
  }, [handleAuthError, validateSession, forceReady])

  const retryAuth = useCallback(async (): Promise<void> => {
    logger.info('Retrying auth initialization...')
    clearError()
    initAttempts.current = 0
    initializationRef.current = null
    
    dispatch({ type: 'SET_INITIALIZED', payload: false })
    dispatch({ type: 'SET_LOADING', payload: true })
    
    await initializeAuth()
  }, [clearError, initializeAuth])

  const refreshSession = useCallback(async (): Promise<void> => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession()
      
      if (error) {
        handleAuthError(error)
      } else if (isMountedRef.current) {
        dispatch({ type: 'SET_SESSION', payload: session })
        dispatch({ type: 'SET_USER', payload: session?.user ?? null })
      }
    } catch (error) {
      handleAuthError(error)
    }
  }, [handleAuthError])

  // Initialize auth and set up listeners
  useEffect(() => {
    isMountedRef.current = true
    
    // Set up force ready timeout as a safety net
    forceReadyTimeoutRef.current = setTimeout(forceReady, FORCE_READY_TIMEOUT)
    
    const setupAuth = async () => {
      if (!isMountedRef.current) return
      await initializeAuth()
    }

    setupAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMountedRef.current) return

        logger.info('Auth event:', event)
        
        // Clear force ready timeout since we got an auth event
        if (forceReadyTimeoutRef.current) {
          clearTimeout(forceReadyTimeoutRef.current)
        }
        
        dispatch({ type: 'SET_ERROR', payload: null })
        dispatch({ type: 'SET_SESSION', payload: session })
        dispatch({ type: 'SET_USER', payload: session?.user ?? null })
        
        if (event === 'SIGNED_IN' && session?.user) {
          authService.createUserProfile(session.user).catch(error => {
            logger.error('Failed to create user profile on sign in:', error)
          })
        }
        
        // Ensure we're marked as ready after any auth event
        dispatch({ type: 'SET_LOADING', payload: false })
        dispatch({ type: 'SET_INITIALIZED', payload: true })
      }
    )

    return () => {
      isMountedRef.current = false
      subscription.unsubscribe()
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current)
      }
      if (forceReadyTimeoutRef.current) {
        clearTimeout(forceReadyTimeoutRef.current)
      }
      initializationRef.current = null
    }
  }, [initializeAuth, forceReady])

  // Auto-refresh session before expiration (simplified)
  useEffect(() => {
    if (!state.session?.expires_at) return

    const expiresAt = new Date(state.session.expires_at * 1000)
    const now = new Date()
    const timeUntilExpiry = expiresAt.getTime() - now.getTime()
    
    // Refresh 5 minutes before expiry
    const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 0)

    if (refreshTime > 0 && refreshTime < 24 * 60 * 60 * 1000) { // Don't set crazy long timeouts
      authTimeoutRef.current = setTimeout(refreshSession, refreshTime)
    }

    return () => {
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current)
      }
    }
  }, [state.session?.expires_at, refreshSession])

  // Auth methods with simplified error handling
  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    clearError()

    try {
      const result = await authService.signUp(email, password, fullName)
      return result
    } catch (error) {
      return { error: handleAuthError(error) }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [clearError, handleAuthError])

  const signIn = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    clearError()

    try {
      const result = await authService.signIn(email, password)
      return result
    } catch (error) {
      return { error: handleAuthError(error) }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [clearError, handleAuthError])

  const signInWithGoogle = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    clearError()

    try {
      const result = await authService.signInWithGoogle()
      return result
    } catch (error) {
      return { error: handleAuthError(error) }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [clearError, handleAuthError])

  const signOut = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    clearError()

    try {
      const result = await authService.signOut()
      if (!result.error) {
        dispatch({ type: 'RESET_STATE' })
      }
      return result
    } catch (error) {
      return { error: handleAuthError(error) }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [clearError, handleAuthError])

  const resetPassword = useCallback(async (email: string) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    clearError()

    try {
      const result = await authService.resetPassword(email)
      return result
    } catch (error) {
      return { error: handleAuthError(error) }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [clearError, handleAuthError])

  const updatePassword = useCallback(async (password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    clearError()

    try {
      const result = await authService.updatePassword(password)
      return result
    } catch (error) {
      return { error: handleAuthError(error) }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [clearError, handleAuthError])

  const value = useMemo(() => ({
    ...state,
    isFullyReady,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    clearError,
    retryAuth,
    refreshSession,
  }), [
    state,
    isFullyReady,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    clearError,
    retryAuth,
    refreshSession,
  ])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Export hook at the end to avoid Fast Refresh issues
export { useAuth }