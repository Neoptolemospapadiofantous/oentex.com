// src/lib/queryClient.ts (Fixed)
import { QueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // Changed from cacheTime to gcTime (React Query v5)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as any).status
          if (status >= 400 && status < 500) return false
        }
        return failureCount < 3
      },
      onError: (error) => {
        console.error('Query error:', error)
        toast.error('Something went wrong. Please try again.')
      }
    },
    mutations: {
      onError: (error) => {
        console.error('Mutation error:', error)
        toast.error('Something went wrong. Please try again.')
      }
    }
  }
})