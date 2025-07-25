// src/hooks/queries/useFeaturedDealsQuery.ts
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/authContext'

// ✅ STRATEGIC: Interfaces matching your database schema
export interface FeaturedCompany {
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

export interface FeaturedDeal {
  id: string
  company_id: string
  title: string
  description: string
  deal_type: 'bonus' | 'discount' | 'free_trial' | 'cashback' | 'promotion'
  value: string | null
  affiliate_link: string
  is_active: boolean
  click_count: number
  created_at: string
  company: FeaturedCompany
}

export interface FeaturedDealsData {
  deals: FeaturedDeal[]
  companies: FeaturedCompany[]
  totalCount: number
}

// ✅ STRATEGIC: Query key for caching
const FEATURED_DEALS_QUERY_KEY = ['featured-deals'] as const

// ✅ ROBUST: Main hook for featured deals
export const useFeaturedDealsQuery = (limit: number = 6) => {
  const { isFullyReady } = useAuth()

  return useQuery({
    queryKey: [...FEATURED_DEALS_QUERY_KEY, limit],
    queryFn: async (): Promise<FeaturedDealsData> => {
      console.log('🔄 Fetching featured deals for homepage...')

      try {
        // ✅ STRATEGIC: Get active deals with company data (ordered by click_count)
        const { data: dealsData, error: dealsError } = await supabase
          .from('company_deals')
          .select(`
            id,
            company_id,
            title,
            description,
            deal_type,
            value,
            affiliate_link,
            is_active,
            click_count,
            created_at,
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
          .order('click_count', { ascending: false })
          .limit(limit * 2) // Get more deals to filter and sort later

        if (dealsError) {
          console.error('❌ Error fetching featured deals:', dealsError)
          console.error('❌ Full error details:', JSON.stringify(dealsError, null, 2))
          throw new Error(`Failed to fetch featured deals: ${dealsError.message}`)
        }

        if (!dealsData || dealsData.length === 0) {
          console.log('⚠️ No featured deals found')
          return {
            deals: [],
            companies: [],
            totalCount: 0
          }
        }

        // ✅ STRATEGIC: Transform and sort data by company rating, filter active companies
        const deals: FeaturedDeal[] = dealsData
          .filter(deal => deal.company && deal.company.status === 'active') // Filter active companies here
          .map(deal => ({
            id: deal.id,
            company_id: deal.company_id,
            title: deal.title,
            description: deal.description,
            deal_type: deal.deal_type as FeaturedDeal['deal_type'],
            value: deal.value,
            affiliate_link: deal.affiliate_link,
            is_active: deal.is_active,
            click_count: deal.click_count,
            created_at: deal.created_at,
            company: deal.company as FeaturedCompany
          }))
          .sort((a, b) => {
            // First sort by company rating (descending)
            const ratingDiff = (b.company.overall_rating || 0) - (a.company.overall_rating || 0)
            if (ratingDiff !== 0) return ratingDiff
            
            // Then by click count (descending)
            return (b.click_count || 0) - (a.click_count || 0)
          })
          .slice(0, limit) // Take only the requested amount

        // ✅ STRATEGIC: Extract unique companies
        const companiesMap = new Map<string, FeaturedCompany>()
        deals.forEach(deal => {
          if (deal.company && !companiesMap.has(deal.company.id)) {
            companiesMap.set(deal.company.id, deal.company)
          }
        })
        const companies = Array.from(companiesMap.values())

        console.log(`✅ Fetched ${deals.length} featured deals from ${companies.length} companies`)

        return {
          deals,
          companies,
          totalCount: deals.length
        }
        
      } catch (error) {
        console.error('❌ Unexpected error in useFeaturedDealsQuery:', error)
        throw error
      }
    },
    enabled: isFullyReady,
    staleTime: 5 * 60 * 1000,    // 5 minutes
    gcTime: 10 * 60 * 1000,      // 10 minutes cache
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error.message?.includes('permission') || error.message?.includes('policy')) {
        return false
      }
      return failureCount < 2
    },
  })
}

// ✅ STRATEGIC: Hook for category-specific featured deals
export const useFeaturedDealsByCategory = (category: string, limit: number = 3) => {
  const { isFullyReady } = useAuth()

  return useQuery({
    queryKey: [...FEATURED_DEALS_QUERY_KEY, 'by-category', category, limit],
    queryFn: async (): Promise<FeaturedDealsData> => {
      console.log(`🔄 Fetching featured deals for category: ${category}`)

      try {
        const { data: dealsData, error: dealsError } = await supabase
          .from('company_deals')
          .select(`
            id,
            company_id,
            title,
            description,
            deal_type,
            value,
            affiliate_link,
            is_active,
            click_count,
            created_at,
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
          .order('click_count', { ascending: false })
          .limit(limit * 2)

        if (dealsError) {
          console.error(`❌ Error fetching featured deals for ${category}:`, dealsError)
          console.error('❌ Full error details:', JSON.stringify(dealsError, null, 2))
          throw new Error(`Failed to fetch featured deals for ${category}: ${dealsError.message}`)
        }

        const deals: FeaturedDeal[] = (dealsData || [])
          .filter(deal => deal.company && deal.company.status === 'active' && deal.company.category === category)
          .map(deal => ({
            id: deal.id,
            company_id: deal.company_id,
            title: deal.title,
            description: deal.description,
            deal_type: deal.deal_type as FeaturedDeal['deal_type'],
            value: deal.value,
            affiliate_link: deal.affiliate_link,
            is_active: deal.is_active,
            click_count: deal.click_count,
            created_at: deal.created_at,
            company: deal.company as FeaturedCompany
          }))
          .sort((a, b) => {
            // First sort by company rating (descending)
            const ratingDiff = (b.company.overall_rating || 0) - (a.company.overall_rating || 0)
            if (ratingDiff !== 0) return ratingDiff
            
            // Then by click count (descending)
            return (b.click_count || 0) - (a.click_count || 0)
          })
          .slice(0, limit)

        const companiesMap = new Map<string, FeaturedCompany>()
        deals.forEach(deal => {
          if (deal.company && !companiesMap.has(deal.company.id)) {
            companiesMap.set(deal.company.id, deal.company)
          }
        })
        const companies = Array.from(companiesMap.values())

        console.log(`✅ Fetched ${deals.length} featured deals for ${category}`)

        return {
          deals,
          companies,
          totalCount: deals.length
        }
        
      } catch (error) {
        console.error(`❌ Unexpected error in useFeaturedDealsByCategory for ${category}:`, error)
        throw error
      }
    },
    enabled: isFullyReady && !!category,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

// ✅ STRATEGIC: Hook for top companies across categories
export const useTopCompaniesQuery = (limit: number = 12) => {
  const { isFullyReady } = useAuth()

  return useQuery({
    queryKey: ['top-companies', limit],
    queryFn: async (): Promise<FeaturedCompany[]> => {
      console.log('🔄 Fetching top companies...')

      try {
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
          .gte('overall_rating', 4.0) // Only highly rated companies
          .gte('total_reviews', 5)    // Companies with sufficient reviews
          .order('overall_rating', { ascending: false })
          .order('total_reviews', { ascending: false })
          .limit(limit)

        if (companiesError) {
          console.error('❌ Error fetching top companies:', companiesError)
          console.error('❌ Full error details:', JSON.stringify(companiesError, null, 2))
          throw new Error(`Failed to fetch top companies: ${companiesError.message}`)
        }

        const companies: FeaturedCompany[] = (companiesData || []).map(company => ({
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

        console.log(`✅ Fetched ${companies.length} top companies`)
        return companies
        
      } catch (error) {
        console.error('❌ Unexpected error in useTopCompaniesQuery:', error)
        throw error
      }
    },
    enabled: isFullyReady,
    staleTime: 10 * 60 * 1000,   // 10 minutes
    gcTime: 20 * 60 * 1000,      // 20 minutes cache
  })
}