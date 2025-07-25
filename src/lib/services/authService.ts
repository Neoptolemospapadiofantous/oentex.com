// src/lib/services/authService.ts - Updated for OAuth-only
import { User, AuthError } from '@supabase/supabase-js'
import { supabase } from '../supabase'
import { logger } from '../../utils/logger'
import { config } from '../../config'
import { AuthError as CustomAuthError, AuthErrorType } from '../../types/auth'

interface CreateUserProfileResult {
  success: boolean
  error?: string
}

class AuthService {
  private readonly MAX_RETRIES = 3
  private readonly RETRY_DELAY = 1000
  private readonly profileCreationCache = new Map<string, Promise<CreateUserProfileResult>>()

  // ✅ OAUTH METHODS ONLY - Removed email/password and Solana methods

  async signInWithGoogle() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${config.baseUrl}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })
      
      if (error) {
        logger.error('Google OAuth error:', error)
        return { error: this.handleAuthError(error) }
      }
      
      logger.info('Google sign in initiated')
      return { error: null }
    } catch (error) {
      logger.error('Unexpected Google OAuth error:', error)
      return { error: this.handleAuthError(error) }
    }
  }

  async signInWithMicrosoft() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: `${config.baseUrl}/auth/callback`,
          queryParams: {
            prompt: 'select_account',
          }
        }
      })
      
      if (error) {
        logger.error('Microsoft OAuth error:', error)
        return { error: this.handleAuthError(error) }
      }
      
      logger.info('Microsoft sign in initiated')
      return { error: null }
    } catch (error) {
      logger.error('Unexpected Microsoft OAuth error:', error)
      return { error: this.handleAuthError(error) }
    }
  }

  async signOut() {
    try {
      // Clear profile creation cache
      this.profileCreationCache.clear()
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        logger.error('Error during signOut:', error)
        return { error: this.handleAuthError(error) }
      }
      
      logger.info('Successfully signed out')
      return { error: null }
    } catch (error) {
      logger.error('Unexpected signOut error:', error)
      return { error: this.handleAuthError(error) }
    }
  }

  async createUserProfile(user: User): Promise<CreateUserProfileResult> {
    // Use cache to prevent duplicate profile creation attempts
    if (this.profileCreationCache.has(user.id)) {
      return this.profileCreationCache.get(user.id)!
    }

    const profileCreationPromise = this.performProfileCreation(user)
    this.profileCreationCache.set(user.id, profileCreationPromise)

    try {
      const result = await profileCreationPromise
      // Keep successful results in cache for 5 minutes
      setTimeout(() => {
        this.profileCreationCache.delete(user.id)
      }, 5 * 60 * 1000)
      
      return result
    } catch (error) {
      // Remove failed attempts from cache immediately
      this.profileCreationCache.delete(user.id)
      throw error
    }
  }

  private async performProfileCreation(user: User, retries = 0): Promise<CreateUserProfileResult> {
    try {
      // Check if profile already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle()

      if (checkError) {
        logger.error('Error checking existing profile:', checkError)
        if (retries < this.MAX_RETRIES) {
          await this.delay(this.RETRY_DELAY * (retries + 1))
          return this.performProfileCreation(user, retries + 1)
        }
        return { success: false, error: 'Failed to check existing profile' }
      }

      if (existingProfile) {
        logger.info('User profile already exists')
        return { success: true }
      }

      // Create new profile
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
          // Duplicate key - profile already exists
          logger.info('User profile already exists (duplicate key)')
          return { success: true }
        } else {
          logger.error('Error creating user profile:', error)
          if (retries < this.MAX_RETRIES) {
            await this.delay(this.RETRY_DELAY * (retries + 1))
            return this.performProfileCreation(user, retries + 1)
          }
          return { success: false, error: 'Failed to create user profile' }
        }
      }

      logger.info('User profile created successfully')
      return { success: true }
    } catch (error) {
      logger.error('Unexpected error creating user profile:', error)
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
          return this.createError(AuthErrorType.SERVICE_UNAVAILABLE, 'Account creation is temporarily disabled')
        case 'email_address_not_authorized':
          return this.createError(AuthErrorType.AUTHORIZATION_ERROR, 'This email address is not authorized')
        default:
          logger.error('Unhandled auth error code:', authError.code, authError.message)
          return this.createError(AuthErrorType.UNKNOWN_ERROR, 'An unexpected error occurred. Please try again')
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
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const authService = new AuthService()