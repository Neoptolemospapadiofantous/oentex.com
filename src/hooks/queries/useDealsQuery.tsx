// src/hooks/queries/useDealsQuery.tsx - FIXED VERSION WITH NO ICONS
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { ratingService, RatingSubmissionData } from '../../lib/services/ratingService'
import { useAuth } from '../../lib/authContext'
import { showErrorToast, showSuccessToast } from '../../components/ui/AppToast'

// Interfaces for deals data
export interface Deal {
  id: string
  company_id: string
  title: string
  description: string
  deal_type: 'bonus' | 'discount' | 'free_trial' | 'cashback' | 'promotion'
  value: string | null
  terms?: string
  start_date: string
  end_date?: string
  is_active: boolean
  click_count: number
  conversion_rate: number
  affiliate_link: string
  created_at: string
  updated_at: string
  company: Company
  // Compatibility fields
  company_name: string
  merchant_name?: string
  category?: string
  rating?: number
  bonus_amount?: string
  features?: string[]
  tracking_link?: string
}

export interface Company {
  id: string
  name: string
  slug: string
  description: string
  logo_url: string | null
  website_url: string
  category: string
  affiliate_link: string | null
  overall_rating: number
  total_reviews: number
  status: string
}

export interface DealsData {
  deals: Deal[]
  companies: Company[]
  totalCount: number
  totalCompaniesCount: number
  totalDealsCount: number
}

// Main deals query hook
export const useDealsQuery = () => {
  const { isFullyReady } = useAuth()

  return useQuery({
    queryKey: ['deals'],
    queryFn: async (): Promise<DealsData> => {
      try {
        console.log('🔄 Fetching deals and companies...')
        
        // Fetch all active deals
        const { data: dealsData, error: dealsError } = await supabase
          .from('company_deals')
          .select(`
            id,
            company_id,
            title,
            description,
            deal_type,
            value,
            terms,
            start_date,
            end_date,
            is_active,
            click_count,
            conversion_rate,
            affiliate_link,
            created_at,
            updated_at,
            company:trading_companies!company_deals_company_id_fkey (
              id,
              name,
              slug,
              description,
              logo_url,
              website_url,
              category,
              affiliate_link,
              overall_rating,
              total_reviews,
              status
            )
          `)
          .eq('is_active', true)
          .not('company', 'is', null)
          .order('created_at', { ascending: false })

        if (dealsError) {
          throw new Error(`Failed to fetch deals: ${dealsError.message}`)
        }

        // Fetch all active companies
        const { data: companiesData, error: companiesError } = await supabase
          .from('trading_companies')
          .select(`
            id,
            name,
            slug,
            description,
            logo_url,
            website_url,
            category,
            affiliate_link,
            overall_rating,
            total_reviews,
            status
          `)
          .eq('status', 'active')

        if (companiesError) {
          throw new Error(`Failed to fetch companies: ${companiesError.message}`)
        }

        if (!dealsData || !companiesData) {
          return {
            deals: [],
            companies: [],
            totalCount: 0,
            totalCompaniesCount: 0,
            totalDealsCount: 0
          }
        }

        // Process deals
        const deals: Deal[] = dealsData
          .filter(deal => deal.company && deal.company.status === 'active')
          .map(deal => ({
            id: deal.id,
            company_id: deal.company_id,
            title: deal.title,
            description: deal.description,
            deal_type: deal.deal_type as Deal['deal_type'],
            value: deal.value,
            terms: deal.terms,
            start_date: deal.start_date || deal.created_at,
            end_date: deal.end_date,
            is_active: deal.is_active,
            click_count: deal.click_count || 0,
            conversion_rate: deal.conversion_rate || 0,
            affiliate_link: deal.affiliate_link,
            created_at: deal.created_at,
            updated_at: deal.updated_at,
            company: deal.company as Company,
            // Compatibility fields for direct access
            company_name: deal.company?.name || '',
            merchant_name: deal.company?.name,
            category: deal.company?.category,
            rating: deal.company?.overall_rating,
            bonus_amount: deal.value,
            features: [],
            tracking_link: deal.affiliate_link
          }))

        // Process companies
        const companies: Company[] = companiesData.map(company => ({
          id: company.id,
          name: company.name,
          slug: company.slug,
          description: company.description,
          logo_url: company.logo_url,
          website_url: company.website_url,
          category: company.category,
          affiliate_link: company.affiliate_link,
          overall_rating: company.overall_rating,
          total_reviews: company.total_reviews,
          status: company.status
        }))

        console.log('✅ Deals and companies fetched successfully:', {
          dealsCount: deals.length,
          companiesCount: companies.length
        })

        return {
          deals,
          companies,
          totalCount: deals.length,
          totalCompaniesCount: companies.length,
          totalDealsCount: deals.length
        }
        
      } catch (error) {
        console.error('❌ Failed to fetch deals:', error)
        throw error
      }
    },
    enabled: isFullyReady,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      if (error.message?.includes('permission') || error.message?.includes('policy')) {
        return false
      }
      return failureCount < 2
    },
  })
}

// Hook for fetching user ratings
export const useUserRatingsQuery = (userId: string | undefined, companyIds: string[]) => {
  const { isFullyReady } = useAuth()

  return useQuery({
    queryKey: ['user-ratings', userId, companyIds],
    queryFn: async () => {
      if (!userId || companyIds.length === 0) {
        return {}
      }

      try {
        console.log('🔄 Fetching user ratings for', companyIds.length, 'companies...')
        
        const { data, error } = await supabase
          .from('ratings')
          .select('*')
          .eq('user_id', userId)
          .in('company_id', companyIds)

        if (error) {
          console.error('❌ Error fetching user ratings:', error)
          return {}
        }

        // Create a map of company_id -> rating
        const ratingsMap: Record<string, any> = {}
        data?.forEach(rating => {
          ratingsMap[rating.company_id] = rating
        })

        console.log('✅ User ratings fetched:', Object.keys(ratingsMap).length, 'ratings')
        return ratingsMap

      } catch (error) {
        console.error('❌ Failed to fetch user ratings:', error)
        return {}
      }
    },
    enabled: isFullyReady && !!userId && companyIds.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook for updating deal click count
export const useUpdateDealClickMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ dealId }: { dealId: string }) => {
      try {
        console.log('🔄 Updating deal click count for deal:', dealId)
        
        const { error } = await supabase.rpc('increment_deal_clicks', {
          deal_id: dealId
        })

        if (error) {
          throw error
        }

        console.log('✅ Deal click count updated successfully')
        return { success: true }

      } catch (error) {
        console.error('❌ Failed to update deal click count:', error)
        throw error
      }
    },
    onSuccess: () => {
      // Invalidate deals query to refresh data
      queryClient.invalidateQueries({ queryKey: ['deals'] })
      queryClient.invalidateQueries({ queryKey: ['featured-deals'] })
    }
  })
}

// Simple icon component that returns emoji
const IconComponent = ({ emoji }: { emoji: string }) => <span className="text-lg">{emoji}</span>

// Create icon components using emojis
const GiftIcon = () => <IconComponent emoji="🎁" />
const BoltIcon = () => <IconComponent emoji="⚡" />
const BuildingIcon = () => <IconComponent emoji="🏢" />
const StarIcon = () => <IconComponent emoji="⭐" />
const ChartIcon = () => <IconComponent emoji="📊" />
const ShieldIcon = () => <IconComponent emoji="🛡️" />
const SmartphoneIcon = () => <IconComponent emoji="📱" />

const ICON_MAP = {
  gift: GiftIcon,
  zap: BoltIcon,
  building: BuildingIcon,
  star: StarIcon,
  trending_up: ChartIcon,
  bar_chart: ChartIcon,
  shield: ShieldIcon,
  smartphone: SmartphoneIcon,
} as const

interface DatabaseCategory {
  id: string
  value: string
  label: string
  icon_name: string
  description?: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

interface ProcessedCategory {
  value: string
  label: string
  icon: React.ComponentType<any>
  description?: string
}

// Fallback categories with emoji icons
const DEFAULT_CATEGORIES: ProcessedCategory[] = [
  {
    value: 'crypto_exchange',
    label: 'Crypto Exchanges',
    icon: BuildingIcon,
    description: 'Cryptocurrency trading platforms'
  },
  {
    value: 'prop_firm',
    label: 'Prop Trading Firms',
    icon: ChartIcon,
    description: 'Proprietary trading companies'
  },
  {
    value: 'multi_asset',
    label: 'Multi-Asset Brokers',
    icon: ChartIcon,
    description: 'Multi-asset trading platforms'
  },
  {
    value: 'trading_tool',
    label: 'Trading Tools',
    icon: BoltIcon,
    description: 'Trading software and tools'
  },
  {
    value: 'stock_broker',
    label: 'Stock Brokers',
    icon: ShieldIcon,
    description: 'Stock trading platforms'
  },
  {
    value: 'forex_broker',
    label: 'Forex Brokers',
    icon: SmartphoneIcon,
    description: 'Foreign exchange trading platforms'
  }
]

// Fetch categories with fallback support
const fetchCategories = async (): Promise<DatabaseCategory[]> => {
  console.log('📄 Fetching categories from categories table...')
  
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
    
    if (error) {
      console.error('❌ Categories Error:', error)
      // Don't throw - we'll use fallback
      return []
    }
    
    if (!data || data.length === 0) {
      console.warn('⚠️ No categories found in categories table, using defaults')
      return []
    }
    
    console.log('✅ Categories loaded from database:', data.length, 'categories')
    console.log('✅ Categories data:', data)
    return data
    
  } catch (error) {
    console.error('❌ Failed to fetch categories:', error)
    // Return empty array to trigger fallback
    return []
  }
}

export const useCategoriesQuery = () => {
  const query = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      console.log(`🔄 Categories query retry attempt ${failureCount + 1}`, error?.message)
      
      // Don't retry if categories table doesn't exist - use fallback
      if (error?.message?.includes('relation "categories" does not exist')) {
        console.log('❌ Categories table not found - using fallback!')
        return false
      }
      
      // Don't retry if it's a permissions error - use fallback
      if (error?.message?.includes('permission') || error?.message?.includes('policy')) {
        console.log('❌ Categories permission error - using fallback!')
        return false
      }
      
      // Retry network errors up to 2 times
      return failureCount < 2
    },
    select: (data: DatabaseCategory[]): ProcessedCategory[] => {
      console.log('🔄 Processing categories...')
      console.log('🔍 Raw categories data:', data)
      
      // Always include "All Categories" first
      const allCategory: ProcessedCategory = {
        value: 'all',
        label: 'All Categories',
        icon: GiftIcon,
        description: 'View all available deals and platforms'
      }

      let processedCategories: ProcessedCategory[] = []

      if (data && data.length > 0) {
        // Use database categories
        processedCategories = data.map((category): ProcessedCategory => ({
          value: category.value,
          label: category.label,
          icon: ICON_MAP[category.icon_name as keyof typeof ICON_MAP] || StarIcon,
          description: category.description
        }))
        console.log('✅ Using database categories:', processedCategories.length)
      } else {
        // Use fallback categories
        processedCategories = DEFAULT_CATEGORIES
        console.log('✅ Using fallback categories:', processedCategories.length)
      }

      const finalCategories = [allCategory, ...processedCategories]
      console.log('✅ Final categories:', finalCategories.length, 'total')
      return finalCategories
    },
  })

  // Always return categories: Either from database or fallback
  return {
    ...query,
    data: query.data || [
      {
        value: 'all',
        label: 'All Categories',
        icon: GiftIcon,
        description: 'View all available deals and platforms'
      },
      ...DEFAULT_CATEGORIES
    ], // Always return categories (fallback if needed)
    error: query.error,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetching: query.isFetching
  }
}

// Hook to get category statistics
export const useCategoryStatsQuery = (deals: any[]) => {
  return useQuery({
    queryKey: ['category-stats', deals.length],
    queryFn: () => {
      const stats = new Map()
      
      // Count all deals
      stats.set('all', deals.length)
      
      // Count by category - handle both company.category and direct category
      deals.forEach(deal => {
        const category = deal.company?.category || deal.category
        if (category) {
          stats.set(category, (stats.get(category) || 0) + 1)
        }
      })
      
      console.log('📊 Category stats calculated:', Object.fromEntries(stats))
      return stats
    },
    enabled: deals.length > 0
  })
}

// Hook to get category info with companies
export const useCategoryInfoQuery = (companies: any[]) => {
  return useQuery({
    queryKey: ['category-info', companies.length],
    queryFn: () => {
      const categoryInfo = new Map()
      
      // Group companies by category
      const categoryGroups = companies.reduce((acc, company) => {
        const category = company.category
        if (category) {
          if (!acc[category]) {
            acc[category] = []
          }
          acc[category].push(company.name)
        }
        return acc
      }, {} as Record<string, string[]>)
      
      // Create category info
      Object.entries(categoryGroups).forEach(([category, companyNames]) => {
        categoryInfo.set(category, {
          companies: companyNames,
          count: companyNames.length
        })
      })
      
      console.log('📊 Category info calculated:', Object.fromEntries(categoryInfo))
      return categoryInfo
    },
    enabled: companies.length > 0
  })
}

// Hook for submitting ratings with optimistic updates
export const useSubmitRatingMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      userId,
      companyId,
      ratings,
      existingRating
    }: {
      userId: string
      companyId: string
      ratings: RatingSubmissionData
      existingRating?: any
    }) => {
      console.log('🔄 Submitting rating via mutation hook...')
      
      const result = await ratingService.submitRating(userId, companyId, ratings, existingRating)
      
      if (result.error) {
        throw result.error
      }
      
      return result.data
    },
    onMutate: async ({ companyId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['deals'] })
      await queryClient.cancelQueries({ queryKey: ['company-ratings', companyId] })
      
      // Snapshot the previous value
      const previousDeals = queryClient.getQueryData(['deals'])
      
      return { previousDeals }
    },
    onError: (error, variables, context) => {
      console.error('❌ Rating submission failed:', error)
      showErrorToast('Failed to submit rating. Please try again.')
      
      // Restore previous data
      if (context?.previousDeals) {
        queryClient.setQueryData(['deals'], context.previousDeals)
      }
    },
    onSuccess: (data, { companyId }) => {
      console.log('✅ Rating submitted successfully:', data)
      showSuccessToast('Rating submitted successfully!')
      
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['deals'] })
      queryClient.invalidateQueries({ queryKey: ['company-ratings', companyId] })
      queryClient.invalidateQueries({ queryKey: ['featured-deals'] })
    }
  })
}