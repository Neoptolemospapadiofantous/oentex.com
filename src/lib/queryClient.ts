// src/lib/queryClient.ts - MODERNIZED: Clean and optimized
import { QueryClient } from '@tanstack/react-query'

// ✅ MODERN: Single, optimally configured query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ✅ OPTIMIZED: Balanced caching for real-time updates
      staleTime: 2 * 60 * 1000,        // 2 minutes
      gcTime: 10 * 60 * 1000,          // 10 minutes garbage collection
      
      // ✅ SMART RETRY: Don't retry auth errors
      retry: (failureCount, error) => {
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as any).status
          if (status >= 400 && status < 500) return false
        }
        return failureCount < 2
      },
      
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
      
      // ✅ CONTROLLED REFETCHING
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    
    mutations: {
      // ✅ SMART MUTATION RETRY
      retry: (failureCount, error) => {
        if (error && typeof error === 'object' && 'message' in error) {
          const message = (error as Error).message.toLowerCase()
          if (message.includes('auth') || 
              message.includes('unauthorized') || 
              message.includes('forbidden') ||
              message.includes('user id mismatch')) {
            return false
          }
        }
        return failureCount < 1
      },
    }
  }
})

// ✅ MODERN: Helper functions for coordinating card updates

/**
 * Updates a specific company's data across ALL cards in the app
 * Used by optimistic updates to ensure consistency
 */
export const updateCompanyDataInAllCards = (
  companyId: string, 
  updates: { overall_rating?: number; total_reviews?: number }
) => {
  console.log(`🔄 Updating company ${companyId} across ALL cards:`, updates)
  
  queryClient.setQueryData(['deals'], (oldData: any) => {
    if (!oldData?.deals) return oldData
    
    return {
      ...oldData,
      deals: oldData.deals.map((deal: any) => {
        if (deal.company?.id === companyId) {
          return {
            ...deal,
            company: {
              ...deal.company,
              ...updates
            }
          }
        }
        return deal
      })
    }
  })
  
  console.log(`✅ Updated ALL cards for company ${companyId}`)
}

/**
 * Gets current company data from the cache
 * Useful for optimistic updates
 */
export const getCurrentCompanyData = (companyId: string) => {
  const dealsData = queryClient.getQueryData(['deals']) as any
  
  if (!dealsData?.deals) return null
  
  const deal = dealsData.deals.find((d: any) => d.company?.id === companyId)
  return deal?.company || null
}

/**
 * Invalidates all card-related data
 * Use sparingly - optimistic updates are preferred
 */
export const invalidateAllCardData = () => {
  console.log('🔄 Invalidating all card data...')
  
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: ['deals'] }),
    queryClient.invalidateQueries({ queryKey: ['ratings'] })
  ])
}

/**
 * Forces a complete refresh of card data
 * Only use when optimistic updates fail
 */
export const forceRefreshCardData = () => {
  console.log('🔄 Force refreshing all card data...')
  
  queryClient.invalidateQueries({ queryKey: ['deals'] })
  queryClient.refetchQueries({ queryKey: ['deals'] })
}

// ✅ MODERN: Development helpers
if (process.env.NODE_ENV === 'development') {
  // Log cache updates
  queryClient.getQueryCache().subscribe((event) => {
    if (event.type === 'updated' && event.query.queryKey[0] === 'deals') {
      console.log('📊 Card data updated in cache')
    }
  })
  
  // Log mutations
  queryClient.getMutationCache().subscribe((event) => {
    if (event.type === 'updated') {
      const mutation = event.mutation
      if (mutation.state.status === 'pending') {
        console.log('🔄 Mutation started:', mutation.options.mutationKey || 'unknown')
      } else if (mutation.state.status === 'success') {
        console.log('✅ Mutation succeeded:', mutation.options.mutationKey || 'unknown')
      } else if (mutation.state.status === 'error') {
        console.log('❌ Mutation failed:', mutation.options.mutationKey || 'unknown', mutation.state.error)
      }
    }
  })
}

export default queryClient