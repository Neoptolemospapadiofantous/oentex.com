// src/lib/services/ratingService.ts - MODERNIZED: No legacy functions
import { supabase } from '../supabase'

// ✅ MODERN INTERFACES: Clean and consistent
export interface UserRating {
  id: string
  user_id: string
  company_id: string
  overall_rating?: number
  platform_usability?: number
  customer_support?: number
  fees_commissions?: number
  security_trust?: number
  educational_resources?: number
  mobile_app?: number
  rating_type: 'quick' | 'category' | 'overall' | 'categories'
  created_at: string
  updated_at: string
}

export interface CategoryRatings {
  platform_usability: number
  customer_support: number
  fees_commissions: number
  security_trust: number
  educational_resources: number
  mobile_app: number
}

// ✅ MODERN: Rating categories for components
export const RATING_CATEGORIES = [
  { key: 'platform_usability', label: 'Platform Usability', required: false },
  { key: 'customer_support', label: 'Customer Support', required: false },
  { key: 'fees_commissions', label: 'Fees & Commissions', required: false },
  { key: 'security_trust', label: 'Security & Trust', required: false },
  { key: 'educational_resources', label: 'Educational Resources', required: false },
  { key: 'mobile_app', label: 'Mobile App', required: false }
] as const

// ✅ MODERN: Transaction result from database function
export interface RatingTransactionResult {
  company_id: string
  overall_rating: number
  total_reviews: number
  user_rating_type: string
  user_rating_id: string
  updated_at: string
}

// ✅ MODERN: Rating submission data structure
export interface RatingSubmissionData {
  overall_rating?: number
  platform_usability?: number
  customer_support?: number
  fees_commissions?: number
  security_trust?: number
  educational_resources?: number
  mobile_app?: number
}

export const ratingService = {
  
  // ✅ MODERN: Main atomic rating submission
  async submitRating(
    userId: string, 
    companyId: string, 
    ratings: RatingSubmissionData, 
    existingRating?: any
  ): Promise<{ data: RatingTransactionResult | null; error: any }> {
    try {
      console.log('🔄 Modern atomic rating submission starting...')
      console.log('📊 Rating data:', ratings)

      // ✅ ATOMIC DATABASE TRANSACTION
      const { data, error } = await supabase.rpc('submit_rating_transaction', {
        p_user_id: userId,
        p_company_id: companyId,
        p_overall_rating: ratings.overall_rating || null,
        p_platform_usability: ratings.platform_usability || null,
        p_customer_support: ratings.customer_support || null,
        p_fees_commissions: ratings.fees_commissions || null,
        p_security_trust: ratings.security_trust || null,
        p_educational_resources: ratings.educational_resources || null,
        p_mobile_app: ratings.mobile_app || null,
        p_rating_type: ratings.overall_rating ? 'overall' : 'categories'
      })

      if (error) {
        console.error('❌ Atomic transaction failed:', error)
        throw error
      }

      if (!data) {
        throw new Error('No data returned from atomic transaction')
      }

      console.log('✅ Modern atomic transaction completed:', data)
      return { data, error: null }

    } catch (error) {
      console.error('❌ Modern rating submission failed:', error)
      return { data: null, error }
    }
  },

  // ✅ MODERN: Get user's existing rating
  async getUserRating(userId: string, companyId: string): Promise<UserRating | null> {
    try {
      console.log('📊 Fetching user rating...')
      
      const { data, error } = await supabase
        .from('ratings')
        .select('*')
        .eq('user_id', userId)
        .eq('company_id', companyId)
        .maybeSingle()

      if (error) {
        console.error('❌ Error fetching user rating:', error)
        return null
      }

      if (!data) {
        return null
      }

      // Determine rating type
      let ratingType: 'quick' | 'category' | 'overall' | 'categories' = 'overall'
      
      if (data.overall_rating) {
        ratingType = 'overall'
      } else if (data.platform_usability || data.customer_support || data.fees_commissions || 
                 data.security_trust || data.educational_resources || data.mobile_app) {
        ratingType = 'categories'
      }

      return {
        ...data,
        rating_type: ratingType
      }

    } catch (error) {
      console.error('❌ Error in getUserRating:', error)
      return null
    }
  },

  // ✅ MODERN: Batch company ratings for efficient loading
  async getMultipleCompanyRatings(companyIds: string[]): Promise<Record<string, { averageRating: number; totalRatings: number }>> {
    try {
      if (companyIds.length === 0) return {}

      console.log('📊 Batch fetching ratings for', companyIds.length, 'companies')
      
      const { data, error } = await supabase
        .from('trading_companies')
        .select('id, overall_rating, total_reviews, name')
        .in('id', companyIds)

      if (error) {
        console.error('❌ Error fetching batch ratings:', error)
        return {}
      }

      const ratingsByCompany: Record<string, { averageRating: number; totalRatings: number }> = {}
      
      data?.forEach(company => {
        ratingsByCompany[company.id] = {
          averageRating: company.overall_rating || 0,
          totalRatings: company.total_reviews || 0
        }
        console.log(`📊 ${company.name}: ${company.overall_rating}⭐ (${company.total_reviews} reviews)`)
      })

      return ratingsByCompany

    } catch (error) {
      console.error('❌ Error in getMultipleCompanyRatings:', error)
      return {}
    }
  },

  // ✅ MODERN: Single company rating
  async getCompanyAverageRating(companyId: string): Promise<{ averageRating: number; totalRatings: number; name?: string }> {
    try {
      console.log('📊 Fetching company rating from database...')
      
      const { data, error } = await supabase
        .from('trading_companies')
        .select('overall_rating, total_reviews, name')
        .eq('id', companyId)
        .single()

      if (error) {
        console.error('❌ Error fetching company rating:', error)
        return { averageRating: 0, totalRatings: 0 }
      }

      return {
        averageRating: data.overall_rating || 0,
        totalRatings: data.total_reviews || 0,
        name: data.name
      }

    } catch (error) {
      console.error('❌ Error in getCompanyAverageRating:', error)
      return { averageRating: 0, totalRatings: 0 }
    }
  },

  // ✅ MODERN: Company ratings breakdown
  async getCompanyRatings(companyId: string) {
    try {
      console.log('📊 Fetching detailed company ratings...')
      
      const { data, error } = await supabase
        .from('ratings')
        .select(`
          overall_rating,
          platform_usability,
          customer_support,
          fees_commissions,
          security_trust,
          educational_resources,
          mobile_app,
          rating_type,
          created_at
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error fetching company ratings breakdown:', error)
        throw error
      }

      return data || []

    } catch (error) {
      console.error('❌ Error in getCompanyRatings:', error)
      throw error
    }
  },

  // ✅ MODERN: Debug helper
  async debugRatingConsistency(companyId: string) {
    try {
      console.log('🔍 DEBUG: Checking rating consistency...')
      
      const { data: company } = await supabase
        .from('trading_companies')
        .select('name, overall_rating, total_reviews')
        .eq('id', companyId)
        .single()

      const { data: ratings } = await supabase
        .from('ratings')
        .select('overall_rating, platform_usability, customer_support, rating_type')
        .eq('company_id', companyId)

      const debugInfo = {
        company_name: company?.name,
        stored_rating: company?.overall_rating,
        stored_reviews: company?.total_reviews,
        actual_ratings_count: ratings?.length || 0,
        ratings_sample: ratings?.slice(0, 3)
      }

      console.log('🔍 DEBUG RESULTS:', debugInfo)
      return debugInfo

    } catch (error) {
      console.error('❌ Debug check failed:', error)
      return null
    }
  }
}