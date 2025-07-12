// src/hooks/queries/useDealsQuery.ts - FIXED with proper rating refresh
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { ratingService } from '../../lib/services/ratingService'
import { DealWithRating, Company } from '../../types/deals'
import { logger } from '../../utils/logger'
import { useAuth } from '../../lib/authContext'

// Query keys
const DEALS_QUERY_KEY = ['deals'] as const
const RATINGS_QUERY_KEY = ['ratings'] as const

// ✅ ENHANCED: Main deals query with proper rating data
const fetchDeals = async (): Promise<{ deals: DealWithRating[]; companies: Company[] }> => {
  try {
    console.log('🔄 Fetching deals with real-time company ratings...')
    
    const { data: dealsData, error: dealsError } = await supabase
      .from('company_deals')
      .select(`
        *,
        company:trading_companies(*)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (dealsError) {
      console.error('❌ Failed to fetch deals:', dealsError)
      throw new Error(`Failed to fetch deals: ${dealsError.message}`)
    }

    if (!dealsData) {
      console.warn('⚠️ No deals data returned')
      return { deals: [], companies: [] }
    }

    // Transform deals data with real-time company ratings
    const transformedDeals: DealWithRating[] = dealsData.map(deal => {
      const company = Array.isArray(deal.company) ? deal.company[0] : deal.company
      
      // ✅ LOG: Real-time database ratings
      if (company?.overall_rating !== undefined) {
        console.log(`📊 ${company.name}: ${company.overall_rating}⭐ (${company.total_reviews} reviews) - REAL-TIME`)
      }
      
      return {
        id: deal.id,
        company_id: deal.company_id,
        title: deal.title,
        description: deal.description,
        deal_type: deal.deal_type,
        value: deal.value,
        terms: deal.terms,
        start_date: deal.start_date,
        end_date: deal.end_date,
        is_active: deal.is_active,
        click_count: deal.click_count || 0,
        conversion_rate: deal.conversion_rate,
        affiliate_link: deal.affiliate_link,
        created_at: deal.created_at,
        updated_at: deal.updated_at,
        // Compatibility fields
        company_name: company?.name || 'Unknown Company',
        category: company?.category || deal.deal_type,
        bonus_amount: deal.value || 'Special Offer',
        features: company?.features || [],
        // ✅ REAL COMPANY DATA with up-to-date ratings
        company: company ? {
          ...company,
          overall_rating: company.overall_rating || 0,  // Real-time aggregated rating
          total_reviews: company.total_reviews || 0     // Real-time review count
        } : undefined
      }
    })

    // Extract unique companies
    const uniqueCompanies = transformedDeals
      .map(deal => deal.company)
      .filter((company, index, arr) => 
        company && arr.findIndex(c => c?.id === company.id) === index
      ) as Company[]

    // ✅ LOG: Real-time rating summary
    const ratingSummary = uniqueCompanies.map(c => `${c.name}: ${c.overall_rating}⭐(${c.total_reviews})`).join(', ')
    console.log(`✅ Fetched ${transformedDeals.length} deals from ${uniqueCompanies.length} companies`)
    console.log(`📊 REAL-TIME RATINGS: ${ratingSummary}`)
    
    return { deals: transformedDeals, companies: uniqueCompanies }
  } catch (error) {
    console.error('❌ Failed to fetch deals:', error)
    throw error
  }
}

// ✅ ENHANCED: Main deals query with aggressive refreshing after ratings
export const useDealsQuery = () => {
  const { isFullyReady, error: authError } = useAuth()

  return useQuery({
    queryKey: DEALS_QUERY_KEY,
    queryFn: fetchDeals,
    staleTime: 30 * 1000, // ✅ REDUCED: 30 seconds for faster updates
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (authError || error.message?.includes('unauthorized') || error.message?.includes('forbidden')) {
        return false
      }
      return failureCount < 3
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: isFullyReady,
    // ✅ ENHANCED: More aggressive refetching for rating updates
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 60 * 1000, // Refetch every minute when ratings might be changing
  })
}

// ✅ USER RATINGS QUERY: Keep this for user-specific ratings
const fetchUserRatings = async (userId: string, companyIds: string[]) => {
  if (companyIds.length === 0) {
    return new Map()
  }

  try {
    const ratings = await Promise.allSettled(
      companyIds.map(async (companyId) => {
        try {
          const userRating = await ratingService.getUserRating(userId, companyId)
          return { companyId, userRating }
        } catch (error) {
          console.warn(`Failed to fetch user rating for company ${companyId}:`, error)
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

    console.log(`📊 Fetched user ratings for ${userRatingsMap.size} companies`)
    return userRatingsMap
  } catch (error) {
    console.error('❌ Failed to fetch user ratings:', error)
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
    staleTime: 30 * 1000, // ✅ REDUCED: 30 seconds for faster updates
    gcTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      if (authError || error.message?.includes('unauthorized')) {
        return false
      }
      return failureCount < 2
    },
  })
}

// ✅ DEAL CLICK TRACKING: Keep this functionality
export const useUpdateDealClickMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (dealId: string) => {
      const { data, error } = await supabase
        .from('company_deals')
        .update({ 
          click_count: supabase.sql`click_count + 1`
        })
        .eq('id', dealId)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    },
    onSuccess: () => {
      // Invalidate deals query to refresh click counts
      queryClient.invalidateQueries({ queryKey: DEALS_QUERY_KEY })
    }
  })
}

// ✅ ENHANCED: Rating submission with aggressive cache invalidation
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
      ratings: {
        overall_rating?: number
        platform_usability?: number
        customer_support?: number
        fees_commissions?: number
        security_trust?: number
        educational_resources?: number
        mobile_app?: number
      }
      existingRating?: { id: string }
    }) => {
      if (!isFullyReady || !user || !session) {
        throw new Error('Authentication required')
      }

      if (userId !== user.id) {
        throw new Error('User ID mismatch')
      }

      try {
        console.log('🔄 Submitting rating - will trigger database aggregation...')
        
        const result = await ratingService.submitRating(userId, companyId, ratings, existingRating)
        
        if (result.error) {
          console.error('❌ Rating submission returned error:', result.error)
          throw result.error
        }

        if (!result.data) {
          throw new Error('No data returned from rating submission')
        }

        console.log('✅ Rating submitted - database triggers should update company ratings')
        return result.data
        
      } catch (error) {
        console.error('❌ Failed to submit rating:', error)
        throw error
      }
    },
    onSuccess: async (data, variables) => {
      console.log('🔄 Rating submitted successfully - invalidating caches...')
      
      // ✅ AGGRESSIVE CACHE INVALIDATION
      // Invalidate user ratings
      queryClient.invalidateQueries({ queryKey: [...RATINGS_QUERY_KEY, 'user', variables.userId] })
      
      // ✅ CRITICAL: Invalidate deals query to get updated company ratings
      queryClient.invalidateQueries({ queryKey: DEALS_QUERY_KEY })
      
      // ✅ Wait for database triggers to complete, then force refresh
      setTimeout(() => {
        console.log('🔄 Force refreshing deals after rating submission...')
        queryClient.invalidateQueries({ queryKey: DEALS_QUERY_KEY })
        queryClient.refetchQueries({ queryKey: DEALS_QUERY_KEY })
      }, 2000) // Wait 2 seconds for triggers
      
      // ✅ Also refresh specific company rating
      setTimeout(async () => {
        try {
          const debugInfo = await ratingService.debugRatingConsistency(variables.companyId)
          console.log('🔍 DEBUG: Rating consistency check:', debugInfo)
        } catch (error) {
          console.error('❌ Debug check failed:', error)
        }
      }, 3000)
      
      console.log('✅ All caches invalidated - UI should update with new ratings')
    },
    onError: (error) => {
      console.error('❌ Rating submission failed:', error)
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

// ✅ RATING BREAKDOWN: For detailed rating display
export const useCompanyRatingBreakdownQuery = (companyId: string) => {
  const { isFullyReady } = useAuth()

  return useQuery({
    queryKey: [...RATINGS_QUERY_KEY, 'breakdown', companyId],
    queryFn: () => ratingService.getCompanyRatings(companyId),
    enabled: isFullyReady && !!companyId,
    staleTime: 30 * 1000, // ✅ REDUCED: 30 seconds for faster updates
    gcTime: 2 * 60 * 1000, // 2 minutes
  })
}

// ✅ NEW: Manual refresh helper
export const useRefreshDealsData = () => {
  const queryClient = useQueryClient()
  
  return {
    refreshDeals: () => {
      console.log('🔄 Manually refreshing deals data...')
      queryClient.invalidateQueries({ queryKey: DEALS_QUERY_KEY })
      queryClient.refetchQueries({ queryKey: DEALS_QUERY_KEY })
    },
    
    refreshUserRatings: (userId: string) => {
      console.log('🔄 Manually refreshing user ratings...')
      queryClient.invalidateQueries({ queryKey: [...RATINGS_QUERY_KEY, 'user', userId] })
    },
    
    refreshAll: (userId?: string) => {
      console.log('🔄 Manually refreshing all data...')
      queryClient.invalidateQueries({ queryKey: DEALS_QUERY_KEY })
      if (userId) {
        queryClient.invalidateQueries({ queryKey: [...RATINGS_QUERY_KEY, 'user', userId] })
      }
      queryClient.refetchQueries({ queryKey: DEALS_QUERY_KEY })
    }
  }
}