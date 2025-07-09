// src/hooks/usePersistedState.ts (Enhanced version)
import { useState, useEffect, useCallback, useRef } from 'react'

interface PersistedStateOptions<T> {
  serialize?: (value: T) => string
  deserialize?: (value: string) => T
  storage?: Storage
  syncAcrossTabs?: boolean
  onError?: (error: Error, operation: 'read' | 'write' | 'remove') => void
}

export const usePersistedState = <T>(
  key: string,
  defaultValue: T,
  options: PersistedStateOptions<T> = {}
) => {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    storage = localStorage,
    syncAcrossTabs = true,
    onError = (error, operation) => console.warn(`Error ${operation} localStorage key "${key}":`, error)
  } = options

  const [state, setState] = useState<T>(() => {
    try {
      const item = storage.getItem(key)
      return item ? deserialize(item) : defaultValue
    } catch (error) {
      onError(error as Error, 'read')
      return defaultValue
    }
  })

  const currentValueRef = useRef(state)
  
  // Update ref when state changes
  useEffect(() => {
    currentValueRef.current = state
  }, [state])

  const setPersistedState = useCallback((value: T | ((prevState: T) => T)) => {
    try {
      const newValue = typeof value === 'function' ? (value as (prevState: T) => T)(currentValueRef.current) : value
      setState(newValue)
      storage.setItem(key, serialize(newValue))
      currentValueRef.current = newValue
    } catch (error) {
      onError(error as Error, 'write')
    }
  }, [key, serialize, storage, onError])

  const removePersistedState = useCallback(() => {
    try {
      storage.removeItem(key)
      setState(defaultValue)
      currentValueRef.current = defaultValue
    } catch (error) {
      onError(error as Error, 'remove')
    }
  }, [key, defaultValue, storage, onError])

  // Sync state when storage changes in other tabs
  useEffect(() => {
    if (!syncAcrossTabs) return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        try {
          if (e.newValue === null) {
            setState(defaultValue)
            currentValueRef.current = defaultValue
          } else {
            const newValue = deserialize(e.newValue)
            setState(newValue)
            currentValueRef.current = newValue
          }
        } catch (error) {
          onError(error as Error, 'read')
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, deserialize, defaultValue, syncAcrossTabs, onError])

  return [state, setPersistedState, removePersistedState] as const
}

// Enhanced user preferences hook
export const useUserPreferences = () => {
  const [preferences, setPreferences] = usePersistedState('user-preferences', {
    theme: 'dark',
    dealsPerPage: 12,
    sortBy: 'rating',
    categories: ['all'],
    notifications: true
  }, {
    onError: (error, operation) => {
      console.warn(`Failed to ${operation} user preferences:`, error)
      // Could also send to error tracking service
    }
  })

  return { preferences, setPreferences }
}