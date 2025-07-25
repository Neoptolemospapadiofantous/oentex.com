// AuthContext.tsx - Clean OAuth-only version
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
  signInWithGoogle: () => Promise<{ error: CustomAuthError | null }>
  signInWithMicrosoft: () => Promise<{ error: CustomAuthError | null }>
  signOut: () => Promise<{ error: CustomAuthError | null }>
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
  const INIT_TIMEOUT = 10000
  const FORCE_READY_TIMEOUT = 15000

  const isFullyReady = useMemo(() => {
    return state.initialized && !state.loading
  }, [state.initialized, state.loading])

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

  const forceReady = useCallback(() => {
    logger.warn('Forcing auth ready state to prevent infinite loop')
    if (isMountedRef.current) {
      dispatch({ type: 'FORCE_READY' })
    }
  }, [])

  const validateSession = useCallback(async (session: Session | null): Promise<boolean> => {
    if (!session) {
      return true
    }

    try {
      const now = Date.now()
      const expiresAt = (session.expires_at || 0) * 1000
      
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
          const isValid = await validateSession(session)
          
          if (isValid) {
            dispatch({ type: 'SET_SESSION', payload: session })
            dispatch({ type: 'SET_USER', payload: session?.user ?? null })
            
            if (session?.user) {
              authService.createUserProfile(session.user).catch(error => {
                logger.error('Failed to create user profile:', error)
              })
            }
          } else {
            dispatch({ type: 'SET_SESSION', payload: null })
            dispatch({ type: 'SET_USER', payload: null })
          }
        }

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

  useEffect(() => {
    isMountedRef.current = true
    
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
        
        if (forceReadyTimeoutRef.current) {
          clearTimeout(forceReadyTimeoutRef.current)
        }
        
        dispatch({ type: 'SET_ERROR', payload: null })
        dispatch({ type: 'SET_SESSION', payload: session })
        dispatch({ type: 'SET_USER', payload: session?.user ?? null })
        
        // Create user profile for new sign-ins
        if (event === 'SIGNED_IN' && session?.user) {
          authService.createUserProfile(session.user).catch(error => {
            logger.error('Failed to create user profile on sign in:', error)
          })
        }
        
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

  useEffect(() => {
    if (!state.session?.expires_at) return

    const expiresAt = new Date(state.session.expires_at * 1000)
    const now = new Date()
    const timeUntilExpiry = expiresAt.getTime() - now.getTime()
    
    const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 0)

    if (refreshTime > 0 && refreshTime < 24 * 60 * 60 * 1000) {
      authTimeoutRef.current = setTimeout(refreshSession, refreshTime)
    }

    return () => {
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current)
      }
    }
  }, [state.session?.expires_at, refreshSession])

  const signInWithGoogle = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    clearError()

    try {
      console.log('🔍 AuthContext: Starting Google OAuth...')
      const result = await authService.signInWithGoogle()
      
      if (result.error) {
        console.error('🔍 AuthContext: Google OAuth error:', result.error)
      } else {
        console.log('🔍 AuthContext: Google OAuth initiated successfully')
      }
      
      return result
    } catch (error) {
      console.error('🔍 AuthContext: Google OAuth exception:', error)
      return { error: handleAuthError(error) }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [clearError, handleAuthError])

  const signInWithMicrosoft = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    clearError()

    try {
      console.log('🔍 AuthContext: Starting Microsoft OAuth...')
      const result = await authService.signInWithMicrosoft()
      
      if (result.error) {
        console.error('🔍 AuthContext: Microsoft OAuth error:', result.error)
      } else {
        console.log('🔍 AuthContext: Microsoft OAuth initiated successfully')
      }
      
      return result
    } catch (error) {
      console.error('🔍 AuthContext: Microsoft OAuth exception:', error)
      return { error: handleAuthError(error) }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [clearError, handleAuthError])

  const signOut = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    clearError()

    try {
      console.log('🔍 AuthContext: Signing out...')
      
      // Clear all session data (includes toast tracking)
      sessionStorage.clear()
      
      const result = await authService.signOut()
      
      if (!result.error) {
        dispatch({ type: 'RESET_STATE' })
        console.log('🔍 AuthContext: Sign out successful')
      } else {
        console.error('🔍 AuthContext: Sign out error:', result.error)
      }
      
      return result
    } catch (error) {
      console.error('🔍 AuthContext: Sign out exception:', error)
      return { error: handleAuthError(error) }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [clearError, handleAuthError])

  const value = useMemo(() => ({
    ...state,
    isFullyReady,
    signInWithGoogle,
    signInWithMicrosoft,
    signOut,
    clearError,
    retryAuth,
    refreshSession,
  }), [
    state,
    isFullyReady,
    signInWithGoogle,
    signInWithMicrosoft,
    signOut,
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

export { useAuth }