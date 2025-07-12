// src/lib/services/ratingService.ts - FIXED VERSION with proper aggregation
import { supabase } from '../supabase'

export interface Rating {
  id: string
  user_id: string
  company_id: string
  review_id?: string
  overall_rating?: number | null
  platform_usability?: number | null
  customer_support?: number | null
  fees_commissions?: number | null
  security_trust?: number | null
  educational_resources?: number | null
  mobile_app?: number | null
  created_at: string
  updated_at: string
  rating_type: string
}

export interface UserRating extends Rating {
  rating_type: 'overall' | 'categories' | 'none'
}

export interface CategoryRatings {
  platform_usability: number
  customer_support: number
  fees_commissions: number
  security_trust: number
  educational_resources: number
  mobile_app: number
}

export const RATING_CATEGORIES = [
  { key: 'platform_usability', label: 'Platform Usability', required: false },
  { key: 'customer_support', label: 'Customer Support', required: false },
  { key: 'fees_commissions', label: 'Fees & Commissions', required: false },
  { key: 'security_trust', label: 'Security & Trust', required: false },
  { key: 'educational_resources', label: 'Educational Resources', required: false },
  { key: 'mobile_app', label: 'Mobile App', required: false }
] as const

export const ratingService = {
  
  // ✅ ENHANCED: Get user's rating for a specific company
  async getUserRating(userId: string, companyId: string): Promise<UserRating | null> {
    try {
      console.log('🔍 Getting user rating:', { 
        userId: userId.substring(0, 8) + '...', 
        companyId: companyId.substring(0, 8) + '...' 
      })
      
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
        console.log('📊 No user rating found')
        return null
      }

      const ratingType = this.determineRatingType(data)
      console.log('📊 User rating found:', {
        type: ratingType,
        overall: data.overall_rating,
        hasCategories: !!(data.platform_usability || data.customer_support || data.fees_commissions)
      })
      
      return {
        ...data,
        rating_type: ratingType
      }
    } catch (error) {
      console.error('❌ Unexpected error in getUserRating:', error)
      return null
    }
  },

  // ✅ ENHANCED: Get company rating directly from trading_companies (updated by triggers)
  async getCompanyAverageRating(companyId: string) {
    try {
      console.log('📊 Getting company rating from trading_companies table:', companyId.substring(0, 8) + '...')
      
      const { data, error } = await supabase
        .from('trading_companies')
        .select('overall_rating, total_reviews, name')
        .eq('id', companyId)
        .single()

      if (error) {
        console.error('❌ Error fetching company rating:', error)
        return { averageRating: 0, totalRatings: 0 }
      }

      if (!data) {
        console.log('📊 No company found')
        return { averageRating: 0, totalRatings: 0 }
      }

      const averageRating = data.overall_rating || 0
      const totalRatings = data.total_reviews || 0

      console.log(`📊 ${data.name}: ${averageRating} stars (${totalRatings} reviews) - from trading_companies table`)
      
      return { 
        averageRating, 
        totalRatings 
      }
    } catch (error) {
      console.error('❌ Unexpected error in getCompanyAverageRating:', error)
      return { averageRating: 0, totalRatings: 0 }
    }
  },

  // ✅ OPTIMIZED: Batch get ratings using trading_companies table
  async getMultipleCompanyRatings(companyIds: string[]) {
    try {
      console.log('📊 Getting ratings for', companyIds.length, 'companies from trading_companies table')
      
      const { data, error } = await supabase
        .from('trading_companies')
        .select('id, overall_rating, total_reviews, name')
        .in('id', companyIds)

      if (error) {
        console.error('❌ Error fetching multiple company ratings:', error)
        return {}
      }

      const ratingsByCompany: Record<string, { averageRating: number, totalRatings: number }> = {}
      
      data?.forEach(company => {
        ratingsByCompany[company.id] = {
          averageRating: company.overall_rating || 0,
          totalRatings: company.total_reviews || 0
        }
        console.log(`📊 ${company.name}: ${company.overall_rating} stars (${company.total_reviews} reviews)`)
      })

      console.log('📊 Batch ratings loaded for', Object.keys(ratingsByCompany).length, 'companies')
      return ratingsByCompany
    } catch (error) {
      console.error('❌ Error in getMultipleCompanyRatings:', error)
      return {}
    }
  },

  // ✅ ENHANCED: Submit Overall Rating with proper constraint handling
  async submitOverallRating(userId: string, companyId: string, rating: number): Promise<UserRating> {
    try {
      console.log('⭐ Submitting overall rating:', rating)
      
      const ratingData = {
        user_id: userId,
        company_id: companyId,
        overall_rating: Math.round(rating * 10) / 10,
        // Clear all category ratings when submitting overall
        platform_usability: null,
        customer_support: null,
        fees_commissions: null,
        security_trust: null,
        educational_resources: null,
        mobile_app: null,
        rating_type: 'overall',
        review_id: null,
        updated_at: new Date().toISOString()
      }

      console.log('💾 Upserting overall rating data:', ratingData)

      const { data, error } = await supabase
        .from('ratings')
        .upsert(ratingData, {
          onConflict: 'user_id,company_id',
          ignoreDuplicates: false
        })
        .select()
        .single()

      if (error) {
        console.error('❌ Error submitting overall rating:', error)
        throw error
      }

      console.log('✅ Overall rating submitted successfully - database triggers will update company rating')

      // ✅ Wait a moment for triggers to execute, then verify update
      setTimeout(async () => {
        const companyRating = await this.getCompanyAverageRating(companyId)
        console.log('📊 Updated company rating:', companyRating)
      }, 1000)

      return {
        ...data,
        rating_type: 'overall' as const
      }
    } catch (error) {
      console.error('❌ Error in submitOverallRating:', error)
      throw error
    }
  },

  // ✅ ENHANCED: Submit Category Ratings with proper constraint handling  
  async submitCategoryRatings(userId: string, companyId: string, ratings: CategoryRatings): Promise<UserRating> {
    try {
      console.log('📊 Submitting category ratings:', ratings)
      
      // Convert 0 values to null for database storage
      const processedRatings = {
        platform_usability: ratings.platform_usability > 0 ? Math.round(ratings.platform_usability * 10) / 10 : null,
        customer_support: ratings.customer_support > 0 ? Math.round(ratings.customer_support * 10) / 10 : null,
        fees_commissions: ratings.fees_commissions > 0 ? Math.round(ratings.fees_commissions * 10) / 10 : null,
        security_trust: ratings.security_trust > 0 ? Math.round(ratings.security_trust * 10) / 10 : null,
        educational_resources: ratings.educational_resources > 0 ? Math.round(ratings.educational_resources * 10) / 10 : null,
        mobile_app: ratings.mobile_app > 0 ? Math.round(ratings.mobile_app * 10) / 10 : null
      }
      
      console.log('📊 Processed ratings (nulls for unrated):', processedRatings)
      
      // Validate that at least one category is rated
      const hasValidRating = Object.values(processedRatings).some(rating => rating !== null)
      if (!hasValidRating) {
        throw new Error('At least one category must be rated')
      }

      const ratingData = {
        user_id: userId,
        company_id: companyId,
        // Clear overall rating when submitting categories
        overall_rating: null,
        // Set category ratings (with nulls for unrated)
        platform_usability: processedRatings.platform_usability,
        customer_support: processedRatings.customer_support,
        fees_commissions: processedRatings.fees_commissions,
        security_trust: processedRatings.security_trust,
        educational_resources: processedRatings.educational_resources,
        mobile_app: processedRatings.mobile_app,
        rating_type: 'categories',
        review_id: null,
        updated_at: new Date().toISOString()
      }

      console.log('💾 Upserting category rating data:', ratingData)
      
      const { data, error } = await supabase
        .from('ratings')
        .upsert(ratingData, {
          onConflict: 'user_id,company_id',
          ignoreDuplicates: false
        })
        .select()
        .single()

      if (error) {
        console.error('❌ Error submitting category ratings:', error)
        throw error
      }

      console.log('✅ Category ratings submitted successfully - database triggers will update company rating')

      // ✅ Wait a moment for triggers to execute, then verify update
      setTimeout(async () => {
        const companyRating = await this.getCompanyAverageRating(companyId)
        console.log('📊 Updated company rating:', companyRating)
      }, 1000)

      return {
        ...data,
        rating_type: 'categories' as const
      }
    } catch (error) {
      console.error('❌ Error in submitCategoryRatings:', error)
      throw error
    }
  },

  // ✅ ENHANCED: Submit rating - unified method with better logging
  async submitRating(userId: string, companyId: string, ratings: any, existingRating?: any) {
    try {
      console.log('🔄 submitRating called with:', { 
        userId: userId.substring(0, 8) + '...', 
        companyId: companyId.substring(0, 8) + '...', 
        ratings,
        hasExisting: !!existingRating 
      })

      // Determine if this is an overall rating or category ratings
      if (ratings.overall_rating !== undefined && ratings.overall_rating !== null) {
        // Overall rating submission
        console.log('➡️ Submitting as overall rating')
        const result = await this.submitOverallRating(userId, companyId, ratings.overall_rating)
        return { data: result, error: null }
      } else {
        // Category ratings submission
        console.log('➡️ Submitting as category ratings')
        const categoryRatings: CategoryRatings = {
          platform_usability: ratings.platform_usability || 0,
          customer_support: ratings.customer_support || 0,
          fees_commissions: ratings.fees_commissions || 0,
          security_trust: ratings.security_trust || 0,
          educational_resources: ratings.educational_resources || 0,
          mobile_app: ratings.mobile_app || 0
        }
        const result = await this.submitCategoryRatings(userId, companyId, categoryRatings)
        return { data: result, error: null }
      }
    } catch (error) {
      console.error('❌ Error in submitRating:', error)
      return { data: null, error }
    }
  },

  // ✅ ENHANCED: Force refresh company ratings (manual trigger)
  async refreshCompanyRatings(companyId: string) {
    try {
      console.log('🔄 Manually refreshing company ratings for:', companyId)
      
      // Call the database function to recalculate ratings
      const { data, error } = await supabase.rpc('update_company_ratings_manual', {
        target_company_id: companyId
      })

      if (error) {
        console.error('❌ Error refreshing company ratings:', error)
        throw error
      }

      console.log('✅ Company ratings refreshed manually')
      return data
    } catch (error) {
      console.error('❌ Error in refreshCompanyRatings:', error)
      throw error
    }
  },

  // Helper: Determine rating type
  determineRatingType(rating: Rating): 'overall' | 'categories' | 'none' {
    if (rating.overall_rating !== null && rating.overall_rating !== undefined) {
      return 'overall'
    } else if (
      rating.platform_usability !== null ||
      rating.customer_support !== null ||
      rating.fees_commissions !== null ||
      rating.security_trust !== null ||
      rating.educational_resources !== null ||
      rating.mobile_app !== null
    ) {
      return 'categories'
    }
    return 'none'
  },

  // ✅ ENHANCED: Get company ratings with user profile info
  async getCompanyRatings(companyId: string) {
    try {
      console.log('📊 Getting company ratings for:', companyId.substring(0, 8) + '...')
      
      const { data, error } = await supabase
        .from('ratings')
        .select(`
          *,
          user_profiles (
            full_name
          )
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error fetching company ratings:', error)
        return []
      }

      const ratingsWithType = data?.map(rating => ({
        ...rating,
        rating_type: this.determineRatingType(rating)
      })) || []

      console.log('📊 Found', ratingsWithType.length, 'ratings for company')
      return ratingsWithType
    } catch (error) {
      console.error('❌ Unexpected error in getCompanyRatings:', error)
      return []
    }
  },

  // ✅ NEW: Debug function to check rating consistency
  async debugRatingConsistency(companyId: string) {
    try {
      console.log('🔍 DEBUG: Checking rating consistency for company:', companyId)
      
      // Get company data
      const { data: companyData } = await supabase
        .from('trading_companies')
        .select('name, overall_rating, total_reviews')
        .eq('id', companyId)
        .single()

      // Get actual ratings
      const { data: ratingsData } = await supabase
        .from('ratings')
        .select('*')
        .eq('company_id', companyId)

      console.log('🔍 Company Data:', companyData)
      console.log('🔍 Actual Ratings:', ratingsData?.length, 'ratings found')
      console.log('🔍 Rating Details:', ratingsData)

      return {
        company: companyData,
        ratings: ratingsData,
        consistent: (companyData?.total_reviews || 0) === (ratingsData?.length || 0)
      }
    } catch (error) {
      console.error('❌ Error in debugRatingConsistency:', error)
      return null
    }
  },


  async getUpdatedCompanyRating(companyId: string) {
    try {
      console.log('🔄 Getting fresh company rating from database...')
      
      const { data, error } = await supabase
        .from('trading_companies')
        .select('overall_rating, total_reviews, name')
        .eq('id', companyId)
        .single()

      if (error) {
        console.error('❌ Error fetching fresh company rating:', error)
        return { averageRating: 0, totalRatings: 0 }
      }

      console.log(`✅ Fresh rating for ${data.name}: ${data.overall_rating}⭐ (${data.total_reviews} reviews)`)
      
      return {
        averageRating: data.overall_rating || 0,
        totalRatings: data.total_reviews || 0,
        name: data.name
      }
    } catch (error) {
      console.error('❌ Error in getUpdatedCompanyRating:', error)
      return { averageRating: 0, totalRatings: 0 }
    }
  },

  // ✅ DEBUGGING: Add this function to check what's in your database
  async checkRatingData(companyId: string) {
    try {
      // Check company table
      const { data: company } = await supabase
        .from('trading_companies')
        .select('name, overall_rating, total_reviews')
        .eq('id', companyId)
        .single()

      // Check ratings table  
      const { data: ratings } = await supabase
        .from('ratings')
        .select('*')
        .eq('company_id', companyId)

      console.log('🔍 DEBUG COMPANY:', company)
      console.log('🔍 DEBUG RATINGS:', ratings)
      
      return { company, ratings }
    } catch (error) {
      console.error('❌ Debug check failed:', error)
      return null
    }
  }
}