// src/hooks/queries/useDealsQuery.ts - MODERNIZED: Clean and optimized
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { ratingService, RatingTransactionResult, RatingSubmissionData } from '../../lib/services/ratingService'
import { useAuth } from '../../lib/authContext'
import { updateCompanyDataInAllCards, getCurrentCompanyData } from '../../lib/queryClient'
import toast from 'react-hot-toast'

// ✅ MODERN: Consistent query keys
const DEALS_QUERY_KEY = ['deals'] as const
const RATINGS_QUERY_KEY = ['ratings'] as const

// ✅ MODERN: TypeScript interfaces
interface RatingSubmissionVariables {
  userId: string
  companyId: string
  ratings: RatingSubmissionData
  existingRating?: { id: string }
}

// ✅ MODERN: Clean deals fetching
const fetchDeals = async () => {
  try {
    console.log('🔄 Fetching deals with real-time company ratings...')
    
    const { data: dealsData, error } = await supabase
      .from('company_deals')
      .select(`
        *,
        company:trading_companies(*)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Failed to fetch deals:', error)
      throw new Error(`Failed to fetch deals: ${error.message}`)
    }

    if (!dealsData) {
      return { deals: [], companies: [] }
    }

    // ✅ MODERN: Clean data transformation
    const transformedDeals = dealsData.map(deal => {
      const company = Array.isArray(deal.company) ? deal.company[0] : deal.company
      
      if (company?.overall_rating !== undefined) {
        console.log(`📊 ${company.name}: ${company.overall_rating}⭐ (${company.total_reviews} reviews)`)
      }
      
      return {
        // Core deal data
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
        
        // Display fields
        company_name: company?.name || 'Unknown Company',
        category: company?.category || deal.deal_type,
        bonus_amount: deal.value || 'Special Offer',
        features: company?.features || [],
        
        // ✅ REAL-TIME: Company data with current ratings
        company: company ? {
          ...company,
          overall_rating: company.overall_rating || 0,
          total_reviews: company.total_reviews || 0
        } : undefined
      }
    })

    // Extract unique companies
    const uniqueCompanies = transformedDeals
      .map(deal => deal.company)
      .filter((company, index, arr) => 
        company && arr.findIndex(c => c?.id === company.id) === index
      )

    console.log(`✅ Fetched ${transformedDeals.length} deals from ${uniqueCompanies.length} companies`)
    
    return { deals: transformedDeals, companies: uniqueCompanies }

  } catch (error) {
    console.error('❌ Failed to fetch deals:', error)
    throw error
  }
}

// ✅ MODERN: Main deals query
export const useDealsQuery = () => {
  const { isFullyReady, error: authError } = useAuth()

  return useQuery({
    queryKey: DEALS_QUERY_KEY,
    queryFn: fetchDeals,
    
    staleTime: 2 * 60 * 1000,      // 2 minutes
    gcTime: 10 * 60 * 1000,        // 10 minutes
    
    retry: (failureCount, error) => {
      if (authError || 
          error.message?.includes('unauthorized') || 
          error.message?.includes('forbidden')) {
        return false
      }
      return failureCount < 2
    },
    
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    enabled: isFullyReady,
    
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  })
}

// ✅ MODERN: User ratings query
const fetchUserRatings = async (userId: string, companyIds: string[]) => {
  if (companyIds.length === 0) return new Map()

  try {
    const ratings = await Promise.allSettled(
      companyIds.map(async (companyId) => {
        const userRating = await ratingService.getUserRating(userId, companyId)
        return { companyId, userRating }
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
    enabled: isFullyReady && !!session && !!userId && !!user && companyIds.length > 0,
    staleTime: 60 * 1000,          // 1 minute
    gcTime: 5 * 60 * 1000,         // 5 minutes
    retry: (failureCount, error) => {
      if (authError || error.message?.includes('unauthorized')) {
        return false
      }
      return failureCount < 1
    },
  })
}

// ✅ MODERN: Deal click tracking mutation
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

      if (error) throw error
      return data
    },
    
    onSuccess: (data) => {
      // ✅ SURGICAL UPDATE: Only update the specific deal's click count
      queryClient.setQueryData(DEALS_QUERY_KEY, (oldData: any) => {
        if (!oldData?.deals) return oldData
        
        return {
          ...oldData,
          deals: oldData.deals.map((deal: any) => 
            deal.id === data.id 
              ? { ...deal, click_count: data.click_count }
              : deal
          )
        }
      })
    },
    
    onError: (error) => {
      console.error('❌ Failed to track deal click:', error)
    }
  })
}

// ✅ MODERN: Rating submission mutation with optimistic updates
export const useSubmitRatingMutation = () => {
  const queryClient = useQueryClient()
  const { isFullyReady, user, session } = useAuth()

  return useMutation<RatingTransactionResult, Error, RatingSubmissionVariables>({
    mutationFn: async (variables) => {
      if (!isFullyReady || !user || !session) {
        throw new Error('Authentication required')
      }

      if (variables.userId !== user.id) {
        throw new Error('User ID mismatch')
      }

      console.log('🔄 Modern rating submission starting...')
      
      const result = await ratingService.submitRating(
        variables.userId, 
        variables.companyId, 
        variables.ratings, 
        variables.existingRating
      )
      
      if (result.error) {
        throw result.error
      }

      if (!result.data) {
        throw new Error('No data returned from rating submission')
      }

      return result.data
    },
    
    // ✅ OPTIMISTIC UPDATES: Show changes immediately
    onMutate: async (variables) => {
      console.log('🚀 Starting optimistic update for ALL cards...')
      
      await queryClient.cancelQueries({ queryKey: DEALS_QUERY_KEY })
      const previousDeals = queryClient.getQueryData(DEALS_QUERY_KEY)
      
      // Calculate optimistic rating
      const optimisticRating = variables.ratings.overall_rating || 
        calculateAverageFromCategories(variables.ratings)
      
      const currentCompany = getCurrentCompanyData(variables.companyId)
      const newReviewCount = (currentCompany?.total_reviews || 0) + 1
      
      // ✅ UPDATE ALL CARDS: Immediate visual feedback
      updateCompanyDataInAllCards(variables.companyId, {
        overall_rating: optimisticRating,
        total_reviews: newReviewCount
      })
      
      console.log(`✅ Optimistic update: ALL cards now show ${optimisticRating}⭐ (${newReviewCount} reviews)`)
      return { previousDeals }
    },
    
    // ✅ SUCCESS: Replace optimistic data with real database values
    onSuccess: (result, variables) => {
      console.log('✅ Rating submission successful - updating with real data...')
      
      updateCompanyDataInAllCards(variables.companyId, {
        overall_rating: result.overall_rating,
        total_reviews: result.total_reviews
      })
      
      queryClient.invalidateQueries({ 
        queryKey: [...RATINGS_QUERY_KEY, 'user', variables.userId] 
      })
      
      console.log(`✅ ALL cards updated: ${result.overall_rating}⭐ (${result.total_reviews} reviews)`)
      toast.success('Rating submitted successfully!')
    },
    
    // ✅ ERROR HANDLING: Rollback optimistic updates
    onError: (error, variables, context) => {
      console.error('❌ Rating submission failed - rolling back updates...')
      
      if (context?.previousDeals) {
        queryClient.setQueryData(DEALS_QUERY_KEY, context.previousDeals)
      }
      
      console.log('✅ Optimistic updates rolled back')
      toast.error('Failed to submit rating. Please try again.')
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

// ✅ MODERN: Helper function for category rating averages
function calculateAverageFromCategories(ratings: RatingSubmissionData): number {
  const categories = [
    ratings.platform_usability,
    ratings.customer_support,
    ratings.fees_commissions,
    ratings.security_trust,
    ratings.educational_resources,
    ratings.mobile_app
  ].filter(rating => rating && rating > 0)
  
  return categories.length > 0 
    ? Math.round((categories.reduce((sum, rating) => sum + rating, 0) / categories.length) * 10) / 10
    : 0
}

// ✅ MODERN: Company rating breakdown query
export const useCompanyRatingBreakdownQuery = (companyId: string) => {
  const { isFullyReady } = useAuth()

  return useQuery({
    queryKey: [...RATINGS_QUERY_KEY, 'breakdown', companyId],
    queryFn: () => ratingService.getCompanyRatings(companyId),
    enabled: isFullyReady && !!companyId,
    staleTime: 60 * 1000,          // 1 minute
    gcTime: 5 * 60 * 1000,         // 5 minutes
  })
}