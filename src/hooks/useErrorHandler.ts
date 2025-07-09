// src/hooks/useErrorHandler.ts
import { useState, useCallback } from 'react'
import { logger } from '../utils/logger'
import toast from 'react-hot-toast'

export interface AppError {
  message: string
  code?: string
  type?: 'network' | 'validation' | 'authentication' | 'authorization' | 'server' | 'unknown'
  timestamp: string
}

export const useErrorHandler = () => {
  const [error, setError] = useState<AppError | null>(null)

  const handleError = useCallback((error: unknown, context?: string) => {
    const appError = normalizeError(error, context)
    
    logger.error('Error handled:', appError)
    setError(appError)
    
    // Show toast for user-facing errors
    if (appError.type !== 'validation') {
      toast.error(appError.message)
    }
    
    return appError
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const retryWithErrorHandling = useCallback(async (
    fn: () => Promise<void>,
    maxRetries = 3,
    delay = 1000
  ) => {
    let lastError: AppError | null = null
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        await fn()
        clearError()
        return
      } catch (error) {
        lastError = handleError(error, `Retry attempt ${i + 1}`)
        
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }
    
    if (lastError) {
      throw lastError
    }
  }, [handleError, clearError])

  return {
    error,
    handleError,
    clearError,
    retryWithErrorHandling
  }
}

const normalizeError = (error: unknown, context?: string): AppError => {
  const timestamp = new Date().toISOString()
  
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    
    // Network errors
    if (message.includes('network') || message.includes('fetch')) {
      return {
        message: 'Network error. Please check your connection and try again.',
        type: 'network',
        timestamp,
        code: 'NETWORK_ERROR'
      }
    }
    
    // Authentication errors
    if (message.includes('auth') || message.includes('unauthorized')) {
      return {
        message: 'Authentication required. Please sign in again.',
        type: 'authentication',
        timestamp,
        code: 'AUTH_ERROR'
      }
    }
    
    // Server errors
    if (message.includes('server') || message.includes('500')) {
      return {
        message: 'Server error. Please try again later.',
        type: 'server',
        timestamp,
        code: 'SERVER_ERROR'
      }
    }
    
    return {
      message: error.message,
      type: 'unknown',
      timestamp,
      code: 'UNKNOWN_ERROR'
    }
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return {
      message: error,
      type: 'unknown',
      timestamp,
      code: 'STRING_ERROR'
    }
  }
  
  // Handle object errors (like from APIs)
  if (error && typeof error === 'object') {
    const errorObj = error as Record<string, unknown>
    return {
      message: String(errorObj.message || 'An unexpected error occurred'),
      type: 'unknown',
      timestamp,
      code: String(errorObj.code || 'OBJECT_ERROR')
    }
  }
  
  return {
    message: 'An unexpected error occurred',
    type: 'unknown',
    timestamp,
    code: 'UNKNOWN_ERROR'
  }
}