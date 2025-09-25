// src/lib/services/authService.ts - MINIMAL FIX: Just add email scope to Microsoft OAuth
import { User, AuthError } from '@supabase/supabase-js'
import { supabase } from '../supabase'
import { config } from '../../config'
import { AuthError as CustomAuthError, AuthErrorType } from '../../types/auth'

interface CreateUserProfileResult {
  success: boolean
  error?: string
}

interface OAuthResult {
  error: CustomAuthError | null
  redirectUrl?: string
}

class AuthService {
  private readonly MAX_RETRIES = 3
  private readonly RETRY_DELAY = 1000
  private readonly profileCreationCache = new Map<string, Promise<CreateUserProfileResult>>()

  // ✅ UNCHANGED: Google OAuth (already working)
  async signInWithGoogle(): Promise<OAuthResult> {
    try {
      const redirectUrl = `${config.baseUrl}/auth/callback`
      
      console.log('🔧 Google OAuth Configuration (Official Supabase):', {
        environment: config.environment,
        baseUrl: config.baseUrl,
        redirectUrl: redirectUrl,
        supabaseProjectUrl: config.supabase.url,
        currentOrigin: typeof window !== 'undefined' ? window.location.origin : 'server'
      })

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })
      
      if (error) {
        console.error('🔧 Google OAuth error:', error)
        return { 
          error: this.handleAuthError(error),
          redirectUrl 
        }
      }
      
      console.log('🔧 Google OAuth Flow Started:')
      console.log('  1. User → Google Auth ✅')
      console.log('  2. Google → Supabase:', `${config.supabase.url}/auth/v1/callback`)
      console.log('  3. Supabase → Your App:', redirectUrl)
      console.log('  ⚠️  Make sure step 3 URL is in Supabase Additional Redirect URLs!')
      
      return { 
        error: null,
        redirectUrl 
      }
    } catch (error) {
      console.error('🔧 Google OAuth exception:', error)
      return { 
        error: this.handleAuthError(error)
      }
    }
  }

  // 🎯 SIMPLE FIX: Just add email scope to Microsoft OAuth
  async signInWithMicrosoft(): Promise<OAuthResult> {
    try {
      const redirectUrl = `${config.baseUrl}/auth/callback`
      
      console.log('🔧 Microsoft OAuth Configuration (WITH EMAIL SCOPE):', {
        environment: config.environment,
        baseUrl: config.baseUrl,
        redirectUrl: redirectUrl,
        supabaseProjectUrl: config.supabase.url
      })

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            prompt: 'select_account',
            // 🎯 ONLY CHANGE: Add email scope to fix the issue
            scope: 'openid email profile User.Read'
          }
        }
      })
      
      if (error) {
        console.error('🔧 Microsoft OAuth error:', error)
        return { 
          error: this.handleAuthError(error),
          redirectUrl 
        }
      }
      
      console.log('🔧 Microsoft OAuth initiated successfully')
      return { 
        error: null,
        redirectUrl 
      }
    } catch (error) {
      console.error('🔧 Microsoft OAuth exception:', error)
      return { 
        error: this.handleAuthError(error)
      }
    }
  }

  // ✅ UNCHANGED: All other methods remain exactly the same
  async signOut() {
    try {
      this.profileCreationCache.clear()
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return { error: this.handleAuthError(error) }
      }
      
      return { error: null }
    } catch (error) {
      return { error: this.handleAuthError(error) }
    }
  }

  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Session error:', error)
        return { session: null, error }
      }
      
      return { session: data.session, error: null }
    } catch (error) {
      console.error('Session exception:', error)
      return { session: null, error }
    }
  }

  async updatePassword(newPassword: string) {
    try {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) {
        return { error }
      }
      return { error: null, data }
    } catch (error) {
      return { error }
    }
  }

  async exchangeCodeForSession(code: string) {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Code exchange error:', error)
        return { data: null, error }
      }
      
      console.log('🔧 Code exchange successful:', {
        userId: data.user?.id,
        email: data.user?.email,
        expiresAt: data.session?.expires_at
      })
      
      return { data, error: null }
    } catch (error) {
      console.error('Code exchange exception:', error)
      return { data: null, error }
    }
  }

  async validateOAuthConfig(): Promise<{
    isValid: boolean
    issues: string[]
    recommendations: string[]
  }> {
    const issues: string[] = []
    const recommendations: string[] = []
    
    try {
      const redirectUrl = `${config.baseUrl}/auth/callback`
      
      if (typeof window !== 'undefined') {
        const currentOrigin = window.location.origin
        const expectedBaseUrl = config.baseUrl
        
        if (currentOrigin !== expectedBaseUrl) {
          issues.push(`Origin mismatch: current=${currentOrigin}, config=${expectedBaseUrl}`)
          recommendations.push('Check environment detection in config')
        }
      }
      
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        issues.push(`Supabase auth connection issue: ${error.message}`)
        recommendations.push('Check Supabase URL and anon key')
      }
      
      console.log('🔧 OAuth Validation:', {
        environment: config.environment,
        baseUrl: config.baseUrl,
        redirectUrl: redirectUrl,
        supabaseUrl: config.supabase.url,
        hasSession: !!data?.session
      })
      
      return {
        isValid: issues.length === 0,
        issues,
        recommendations: [
          ...recommendations,
          `Add "${redirectUrl}" to Supabase Additional Redirect URLs`,
          'Use wildcard patterns: https://oentex.com/** and https://www.oentex.com/**',
          'Verify Google OAuth redirect points to Supabase: ' + config.supabase.url + '/auth/v1/callback',
          'Check console logs for detailed OAuth flow'
        ]
      }
    } catch (error) {
      return {
        isValid: false,
        issues: [`Validation failed: ${error}`],
        recommendations: ['Check console for errors']
      }
    }
  }

  async createUserProfile(user: User): Promise<CreateUserProfileResult> {
    if (this.profileCreationCache.has(user.id)) {
      return this.profileCreationCache.get(user.id)!
    }

    const profileCreationPromise = this.performProfileCreation(user)
    this.profileCreationCache.set(user.id, profileCreationPromise)

    try {
      const result = await profileCreationPromise
      setTimeout(() => {
        this.profileCreationCache.delete(user.id)
      }, 5 * 60 * 1000)
      
      return result
    } catch (error) {
      this.profileCreationCache.delete(user.id)
      throw error
    }
  }

  private async performProfileCreation(user: User, retries = 0): Promise<CreateUserProfileResult> {
    try {
      const { data: existingProfile, error: checkError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle()

      if (checkError) {
        if (retries < this.MAX_RETRIES) {
          await this.delay(this.RETRY_DELAY * (retries + 1))
          return this.performProfileCreation(user, retries + 1)
        }
        return { success: false, error: 'Failed to check existing profile' }
      }

      if (existingProfile) {
        return { success: true }
      }

      const profileData = {
        id: user.id,
        email: user.email || '',
        full_name: this.extractFullName(user),
        avatar_url: user.user_metadata?.avatar_url || null,
        provider: user.app_metadata?.provider || 'unknown',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('user_profiles')
        .insert([profileData])

      if (error) {
        if (error.code === '23505') {
          return { success: true }
        } else {
          if (retries < this.MAX_RETRIES) {
            await this.delay(this.RETRY_DELAY * (retries + 1))
            return this.performProfileCreation(user, retries + 1)
          }
          return { success: false, error: 'Failed to create user profile' }
        }
      }

      return { success: true }
    } catch (error) {
      if (retries < this.MAX_RETRIES) {
        await this.delay(this.RETRY_DELAY * (retries + 1))
        return this.performProfileCreation(user, retries + 1)
      }
      return { success: false, error: 'Unexpected error creating user profile' }
    }
  }

  private extractFullName(user: User): string {
    return (
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      'User'
    )
  }

  // ✅ NEW: Email signup function
  async signUpWithEmail(email: string, password: string, metadata?: { full_name?: string }): Promise<OAuthResult> {
    try {
      console.log('🔧 Starting email signup:', { 
        email, 
        hasPassword: !!password, 
        passwordLength: password?.length,
        metadata 
      })

      // Validate inputs
      if (!email || !password) {
        return {
          error: this.createError(AuthErrorType.INVALID_CREDENTIALS, 'Email and password are required')
        }
      }

      if (password.length < 12) {
        return {
          error: this.createError(AuthErrorType.INVALID_CREDENTIALS, 'Password must be at least 12 characters long')
        }
      }

      // Check if Supabase is properly configured
      if (!supabase) {
        console.error('🔧 Supabase client not initialized')
        return {
          error: this.createError(AuthErrorType.UNKNOWN_ERROR, 'Authentication service not available. Please try again later.')
        }
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata || {}
        }
      })

      console.log('🔧 Supabase signup response:', { data, error })

      if (error) {
        console.error('🔧 Email signup error:', {
          code: error.code,
          message: error.message,
          status: error.status,
          fullError: error
        })
        
        const customError = this.handleAuthError(error)
        console.log('🔧 Custom error created:', customError)
        
        return { 
          error: customError
        }
      }

      console.log('🔧 Email signup success:', { 
        email, 
        userId: data.user?.id,
        userConfirmed: data.user?.email_confirmed_at,
        session: !!data.session
      })
      
      return { error: null }
    } catch (error) {
      console.error('🔧 Email signup exception:', error)
      return { 
        error: this.handleAuthError(error as Error)
      }
    }
  }

  handleAuthError(error: AuthError | Error | unknown): CustomAuthError {
    if (error && typeof error === 'object' && 'code' in error) {
      const authError = error as AuthError
      
      switch (authError.code) {
        case 'email_address_invalid':
          return this.createError(AuthErrorType.INVALID_EMAIL, 'Please enter a valid email address')
        case 'invalid_credentials':
          return this.createError(AuthErrorType.INVALID_CREDENTIALS, 'Invalid credentials. Please try again')
        case 'email_not_confirmed':
          return this.createError(AuthErrorType.EMAIL_NOT_CONFIRMED, 'Please check your email and click the confirmation link')
        case 'too_many_requests':
          return this.createError(AuthErrorType.RATE_LIMIT_EXCEEDED, 'Too many attempts. Please wait a moment and try again')
        case 'user_already_exists':
          return this.createError(AuthErrorType.USER_ALREADY_EXISTS, 'An account with this email already exists')
        case 'session_not_found':
          return this.createError(AuthErrorType.SESSION_EXPIRED, 'Your session has expired. Please sign in again')
        case 'provider_disabled':
          return this.createError(AuthErrorType.PROVIDER_DISABLED, 'This sign-in method is not available')
        case 'user_not_found':
          return this.createError(AuthErrorType.INVALID_CREDENTIALS, 'User not found. Please try again')
        case 'signup_disabled':
          return this.createError(AuthErrorType.PROVIDER_DISABLED, 'Account creation is temporarily disabled')
        case 'email_address_not_authorized':
          return this.createError(AuthErrorType.INVALID_CREDENTIALS, 'This email address is not authorized')
        case 'weak_password':
          return this.createError(AuthErrorType.INVALID_CREDENTIALS, 'Password must be at least 12 characters long')
        case 'password_too_short':
          return this.createError(AuthErrorType.INVALID_CREDENTIALS, 'Password must be at least 12 characters long')
        case 'invalid_email':
          return this.createError(AuthErrorType.INVALID_EMAIL, 'Please enter a valid email address')
        case 'signup_not_allowed':
          return this.createError(AuthErrorType.PROVIDER_DISABLED, 'Email signup is not enabled. Please contact support')
        case 'email_rate_limit_exceeded':
          return this.createError(AuthErrorType.RATE_LIMIT_EXCEEDED, 'Too many signup attempts. Please wait before trying again')
        case 'email_provider_disabled':
          return this.createError(AuthErrorType.PROVIDER_DISABLED, 'Email signups are currently disabled. Please contact support or use social login.')
        default:
          console.warn('🔧 Unhandled auth error code:', authError.code, authError.message)
          return this.createError(AuthErrorType.UNKNOWN_ERROR, authError.message || 'An unexpected error occurred. Please try again')
      }
    }
    
    if (error instanceof Error) {
      const message = error.message.toLowerCase()
      
      if (message.includes('user already registered')) {
        return this.createError(AuthErrorType.USER_ALREADY_EXISTS, 'An account with this provider already exists. Please sign in instead')
      }
      
      if (message.includes('invalid login credentials')) {
        return this.createError(AuthErrorType.INVALID_CREDENTIALS, 'Invalid credentials. Please try again')
      }
      
      if (message.includes('too many requests')) {
        return this.createError(AuthErrorType.RATE_LIMIT_EXCEEDED, 'Too many attempts. Please wait a moment and try again')
      }
      
      if (message.includes('session') || message.includes('jwt')) {
        return this.createError(AuthErrorType.SESSION_EXPIRED, 'Your session has expired. Please sign in again')
      }
      
      if (message.includes('network') || message.includes('fetch')) {
        return this.createError(AuthErrorType.NETWORK_ERROR, 'Network error. Please check your connection and try again')
      }
      
      return this.createError(AuthErrorType.UNKNOWN_ERROR, error.message)
    }
    
    return this.createError(AuthErrorType.UNKNOWN_ERROR, 'An unexpected error occurred. Please try again')
  }

  private createError(type: AuthErrorType, message: string): CustomAuthError {
    return {
      type,
      message,
      timestamp: new Date().toISOString(),
      details: null,
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const authService = new AuthService()