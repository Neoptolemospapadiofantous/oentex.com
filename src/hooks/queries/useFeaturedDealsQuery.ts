// src/hooks/queries/useFeaturedDealsQuery.ts - FIXED FOR ACCURATE STATISTICS
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/authContext'

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
  created_at: string
  updated_at: string
  company: FeaturedCompany
}

export interface FeaturedDealsData {
  deals: FeaturedDeal[]
  companies: FeaturedCompany[]
  featuredDeals: FeaturedDeal[] // Limited subset for display
  totalCount: number
  totalCompaniesCount: number
  totalDealsCount: number
}

const FEATURED_DEALS_QUERY_KEY = ['featured-deals'] as const

export const useFeaturedDealsQuery = (limit: number = 6) => {
  const { isFullyReady } = useAuth()

  return useQuery({
    queryKey: [...FEATURED_DEALS_QUERY_KEY, limit],
    queryFn: async (): Promise<FeaturedDealsData> => {
      try {
        // Fetch ALL active deals for accurate statistics
        const { data: allDealsData, error: dealsError } = await supabase
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

        // Fetch ALL active companies for accurate statistics
        const { data: allCompaniesData, error: companiesError } = await supabase
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

        if (!allDealsData || !allCompaniesData) {
          return {
            deals: [],
            companies: [],
            featuredDeals: [],
            totalCount: 0,
            totalCompaniesCount: 0,
            totalDealsCount: 0
          }
        }

        // Process ALL deals
        const allDeals: FeaturedDeal[] = allDealsData
          .filter(deal => deal.company && deal.company.status === 'active')
          .map(deal => ({
            id: deal.id,
            company_id: deal.company_id,
            title: deal.title,
            description: deal.description,
            deal_type: deal.deal_type as FeaturedDeal['deal_type'],
            value: deal.value,
            affiliate_link: deal.affiliate_link,
            is_active: deal.is_active,
            created_at: deal.created_at,
            updated_at: deal.updated_at,
            company: deal.company as FeaturedCompany
          }))

        // Process ALL companies
        const allCompanies: FeaturedCompany[] = allCompaniesData.map(company => ({
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

        // Create featured subset for display (sorted by rating and reviews)
        const featuredDeals = allDeals
          .sort((a, b) => {
            const ratingDiff = (b.company.overall_rating || 0) - (a.company.overall_rating || 0)
            if (ratingDiff !== 0) return ratingDiff
            
            return (b.company.total_reviews || 0) - (a.company.total_reviews || 0)
          })
          .slice(0, limit)

        return {
          deals: allDeals, // ALL deals for statistics
          companies: allCompanies, // ALL companies for statistics
          featuredDeals, // Limited subset for display
          totalCount: featuredDeals.length,
          totalCompaniesCount: allCompanies.length,
          totalDealsCount: allDeals.length
        }
        
      } catch (error) {
        throw error
      }
    },
    enabled: isFullyReady,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error.message?.includes('permission') || error.message?.includes('policy')) {
        return false
      }
      return failureCount < 2
    },
  })
}

export const useFeaturedDealsByCategory = (category: string, limit: number = 3) => {
  const { isFullyReady } = useAuth()

  return useQuery({
    queryKey: [...FEATURED_DEALS_QUERY_KEY, 'by-category', category, limit],
    queryFn: async (): Promise<FeaturedDealsData> => {
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
            created_at: deal.created_at,
            updated_at: deal.updated_at,
            company: deal.company as FeaturedCompany
          }))
          .sort((a, b) => {
            const ratingDiff = (b.company.overall_rating || 0) - (a.company.overall_rating || 0)
            if (ratingDiff !== 0) return ratingDiff
            
            return (b.company.total_reviews || 0) - (a.company.total_reviews || 0)
          })
          .slice(0, limit)

        const companiesMap = new Map<string, FeaturedCompany>()
        deals.forEach(deal => {
          if (deal.company && !companiesMap.has(deal.company.id)) {
            companiesMap.set(deal.company.id, deal.company)
          }
        })
        const companies = Array.from(companiesMap.values())

        return {
          deals,
          companies,
          featuredDeals: deals,
          totalCount: deals.length,
          totalCompaniesCount: companies.length,
          totalDealsCount: deals.length
        }
        
      } catch (error) {
        throw error
      }
    },
    enabled: isFullyReady && !!category,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export const useTopCompaniesQuery = (limit: number = 12) => {
  const { isFullyReady } = useAuth()

  return useQuery({
    queryKey: ['top-companies', limit],
    queryFn: async (): Promise<FeaturedCompany[]> => {
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
          .gte('overall_rating', 4.0)
          .gte('total_reviews', 5)
          .order('overall_rating', { ascending: false })
          .order('total_reviews', { ascending: false })
          .limit(limit)

        if (companiesError) {
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

        return companies
        
      } catch (error) {
        throw error
      }
    },
    enabled: isFullyReady,
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  })
}