import { Session, User } from "@supabase/supabase-js"

// src/types/auth.ts
export enum AuthErrorType {
  INVALID_EMAIL = 'INVALID_EMAIL',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  EMAIL_NOT_CONFIRMED = 'EMAIL_NOT_CONFIRMED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  PROVIDER_DISABLED = 'PROVIDER_DISABLED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface AuthError {
  details: any
  type: AuthErrorType
  message: string
  timestamp: string
}

export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: AuthError | null
}