// src/hooks/queries/useDealsQuery.ts (Updated with auth state guards)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { ratingService } from '../../lib/services/ratingService'
import { Deal, DealWithRating, Company } from '../../types/deals'
import { logger } from '../../utils/logger'
import { useAuth } from '../../lib/authContext'

// Query keys
const DEALS_QUERY_KEY = ['deals'] as const
const RATINGS_QUERY_KEY = ['ratings'] as const

// Enhanced deals fetching with better error handling
const fetchDeals = async (): Promise<{ deals: DealWithRating[]; companies: Company[] }> => {
  try {
    logger.info('Fetching deals...')
    
    const { data: dealsData, error: dealsError } = await supabase
      .from('company_deals')
      .select(`
        *,
        company:trading_companies(*)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (dealsError) {
      logger.error('Failed to fetch deals:', dealsError)
      throw new Error(`Failed to fetch deals: ${dealsError.message}`)
    }

    if (!dealsData) {
      logger.warn('No deals data returned')
      return { deals: [], companies: [] }
    }

    // Transform deals data
    const transformedDeals: DealWithRating[] = dealsData.map(deal => {
      const company = Array.isArray(deal.company) ? deal.company[0] : deal.company
      
      return {
        id: deal.id,
        title: deal.title,
        description: deal.description,
        company_name: company?.name || 'Unknown Company',
        category: company?.category || deal.deal_type,
        rating: company?.overall_rating || 0,
        bonus_amount: deal.value || 'Special Offer',
        features: [],
        tracking_link: deal.affiliate_link,
        click_count: deal.click_count || 0,
        company: company || undefined
      }
    })

    // Extract unique companies
    const uniqueCompanies = transformedDeals
      .map(deal => deal.company)
      .filter((company, index, arr) => 
        company && arr.findIndex(c => c?.id === company.id) === index
      ) as Company[]

    logger.info(`Fetched ${transformedDeals.length} deals from ${uniqueCompanies.length} companies`)
    
    return { deals: transformedDeals, companies: uniqueCompanies }
  } catch (error) {
    logger.error('Failed to fetch deals:', error)
    throw error
  }
}

// Main deals query with auth state awareness
export const useDealsQuery = () => {
  const { isFullyReady, error: authError } = useAuth()

  return useQuery({
    queryKey: DEALS_QUERY_KEY,
    queryFn: fetchDeals,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (authError || error.message?.includes('unauthorized') || error.message?.includes('forbidden')) {
        return false
      }
      return failureCount < 3
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Don't fetch until auth is fully ready for consistency
    enabled: isFullyReady,
  })
}

// Fetch ratings for multiple companies with auth guards
const fetchCompanyRatings = async (companyIds: string[]) => {
  if (companyIds.length === 0) {
    return {}
  }

  try {
    const ratings = await ratingService.getMultipleCompanyRatings(companyIds)
    logger.info(`Fetched ratings for ${Object.keys(ratings).length} companies`)
    return ratings
  } catch (error) {
    logger.error('Failed to fetch company ratings:', error)
    throw error
  }
}

export const useCompanyRatingsQuery = (companyIds: string[]) => {
  const { isFullyReady, error: authError } = useAuth()

  return useQuery({
    queryKey: [...RATINGS_QUERY_KEY, 'companies', ...companyIds.sort()],
    queryFn: () => fetchCompanyRatings(companyIds),
    enabled: isFullyReady && companyIds.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (authError || error.message?.includes('unauthorized')) {
        return false
      }
      return failureCount < 2
    },
  })
}

// Enhanced user ratings fetching with better error handling
const fetchUserRatings = async (userId: string, companyIds: string[]) => {
  if (companyIds.length === 0) {
    return new Map()
  }

  try {
    // Use Promise.allSettled to handle individual failures gracefully
    const ratings = await Promise.allSettled(
      companyIds.map(async (companyId) => {
        try {
          const userRating = await ratingService.getUserRating(userId, companyId)
          return { companyId, userRating }
        } catch (error) {
          logger.warn(`Failed to fetch user rating for company ${companyId}:`, error)
          return { companyId, userRating: null }
        }
      })
    )

    const userRatingsMap = new Map()
    ratings.forEach((result) => {
      if (result.status === 'fulfilled') {
        const { companyId, userRating } = result.value
        if (userRating) {
          userRatingsMap.set(companyId, userRating)
        }
      }
    })

    logger.info(`Fetched user ratings for ${userRatingsMap.size} companies`)
    return userRatingsMap
  } catch (error) {
    logger.error('Failed to fetch user ratings:', error)
    throw error
  }
}

export const useUserRatingsQuery = (userId: string | undefined, companyIds: string[]) => {
  const { isFullyReady, user, session, error: authError } = useAuth()

  return useQuery({
    queryKey: [...RATINGS_QUERY_KEY, 'user', userId, ...companyIds.sort()],
    queryFn: () => fetchUserRatings(userId!, companyIds),
    enabled: isFullyReady && 
             !!session && 
             !!userId && 
             !!user && 
             companyIds.length > 0,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 3 * 60 * 1000, // 3 minutes
    retry: (failureCount, error) => {
      if (authError || error.message?.includes('unauthorized') || error.message?.includes('auth')) {
        return false
      }
      return failureCount < 2
    },
  })
}

// Update deal click count with better error handling
export const useUpdateDealClickMutation = () => {
  const queryClient = useQueryClient()
  const { isFullyReady, user } = useAuth()

  return useMutation({
    mutationFn: async (dealId: string) => {
      if (!isFullyReady) {
        throw new Error('Authentication not ready')
      }

      try {
        const { data, error } = await supabase
          .rpc('increment_deal_clicks', { deal_id: dealId })

        if (error) {
          logger.error('Error incrementing deal clicks:', error)
          throw new Error(`Failed to update deal clicks: ${error.message}`)
        }
        
        logger.info(`Updated click count for deal ${dealId}`)
        return data
      } catch (error) {
        logger.error('Failed to update deal click count:', error)
        throw error
      }
    },
    onSuccess: (_, dealId) => {
      // Invalidate deals query to refresh click counts
      queryClient.invalidateQueries({ queryKey: DEALS_QUERY_KEY })
      logger.info(`Invalidated deals cache after updating deal ${dealId}`)
    },
    onError: (error) => {
      logger.error('Deal click mutation failed:', error)
    },
    retry: (failureCount, error) => {
      if (error.message?.includes('Authentication not ready')) {
        return false
      }
      return failureCount < 2
    },
  })
}

// Submit rating mutation with auth guards
export const useSubmitRatingMutation = () => {
  const queryClient = useQueryClient()
  const { isFullyReady, user, session } = useAuth()

  return useMutation({
    mutationFn: async ({ 
      userId, 
      companyId, 
      ratings, 
      existingRating 
    }: {
      userId: string
      companyId: string
      ratings: any
      existingRating?: any
    }) => {
      if (!isFullyReady || !user || !session) {
        throw new Error('Authentication required')
      }

      if (userId !== user.id) {
        throw new Error('User ID mismatch')
      }

      try {
        const result = await ratingService.submitRating(userId, companyId, ratings, existingRating)
        logger.info(`Rating ${existingRating ? 'updated' : 'submitted'} for company ${companyId}`)
        return result
      } catch (error) {
        logger.error('Failed to submit rating:', error)
        throw error
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [...RATINGS_QUERY_KEY, 'companies'] })
      queryClient.invalidateQueries({ queryKey: [...RATINGS_QUERY_KEY, 'user', variables.userId] })
      queryClient.invalidateQueries({ queryKey: DEALS_QUERY_KEY })
      
      logger.info(`Invalidated rating caches for user ${variables.userId} and company ${variables.companyId}`)
    },
    onError: (error) => {
      logger.error('Rating submission failed:', error)
    },
    retry: (failureCount, error) => {
      if (error.message?.includes('Authentication required') || 
          error.message?.includes('User ID mismatch')) {
        return false
      }
      return failureCount < 1
    },
  })
}

// // Hook to check if queries are ready to run
// export const useQueriesReady = () => {
//   const { isFullyReady, user, session } = useAuth()
  
//   return {
//     dealsReady: isFullyReady,
//     ratingsReady: isFullyReady,
//     userRatingsReady: isFullyReady && !!user && !!session,
//   }
// }