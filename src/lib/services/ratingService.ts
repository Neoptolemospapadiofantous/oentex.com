// src/lib/ratingService.ts - Updated with consistent calculations and better error handling
import { supabase } from '../supabase'

export interface Rating {
  id: string
  user_id: string
  company_id: string
  overall_rating: number
  platform_usability?: number
  customer_support?: number
  fees_commissions?: number
  security_trust?: number
  educational_resources?: number
  mobile_app?: number
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  user_id: string
  company_id: string
  title: string
  content: string
  pros?: string[]
  cons?: string[]
  trading_experience_level?: string
  account_type?: string
  usage_duration?: string
  would_recommend?: boolean
  verified_user: boolean
  helpful_votes: number
  status: string
  created_at: string
  updated_at: string
  user_profiles?: {
    full_name: string
  }
}

export const ratingService = {
  // Get company ratings with user profile info
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

      console.log('📊 Found', data?.length || 0, 'ratings for company')
      return data || []
    } catch (error) {
      console.error('❌ Unexpected error in getCompanyRatings:', error)
      return []
    }
  },

  // Get user's rating for a specific company - Fixed to handle 406 errors gracefully
  async getUserRating(userId: string, companyId: string) {
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
        .maybeSingle() // Use maybeSingle instead of single to handle no results gracefully

      if (error) {
        console.error('❌ Error fetching user rating:', error)
        return null // Return null instead of throwing to prevent crashes
      }

      if (!data) {
        console.log('📊 No user rating found (normal)')
        return null
      }

      console.log('📊 User rating found:', data.overall_rating)
      return data
    } catch (error) {
      console.error('❌ Unexpected error in getUserRating:', error)
      return null
    }
  },

  // Get company average rating - CONSISTENT with database calculation
  async getCompanyAverageRating(companyId: string) {
    try {
      console.log('📊 Getting average rating for company:', companyId.substring(0, 8) + '...')
      
      // Use the EXACT same calculation as the database trigger for consistency
      const { data, error } = await supabase
        .from('ratings')
        .select('overall_rating')
        .eq('company_id', companyId)

      if (error) {
        console.error('❌ Error fetching company ratings for average:', error)
        return { averageRating: 0, totalRatings: 0 }
      }

      if (!data || data.length === 0) {
        console.log('📊 No ratings found for company:', companyId.substring(0, 8) + '...')
        return { averageRating: 0, totalRatings: 0 }
      }

      const totalRatings = data.length
      // CRITICAL: Use same rounding as database (ROUND to 1 decimal)
      const sum = data.reduce((acc, rating) => acc + (rating.overall_rating || 0), 0)
      const averageRating = Math.round((sum / totalRatings) * 10) / 10

      console.log('📊 Company rating calculated:', { averageRating, totalRatings })
      
      return {
        averageRating,
        totalRatings
      }
    } catch (error) {
      console.error('❌ Unexpected error in getCompanyAverageRating:', error)
      return { averageRating: 0, totalRatings: 0 }
    }
  },

  // Batch get ratings for multiple companies - CONSISTENT calculations
  async getMultipleCompanyRatings(companyIds: string[]) {
    try {
      console.log('📊 Getting ratings for', companyIds.length, 'companies')
      
      const { data, error } = await supabase
        .from('ratings')
        .select('company_id, overall_rating')
        .in('company_id', companyIds)

      if (error) {
        console.error('❌ Error fetching multiple company ratings:', error)
        return {}
      }

      // Group ratings by company_id and calculate averages CONSISTENTLY
      const ratingsByCompany: Record<string, { averageRating: number, totalRatings: number }> = {}
      
      companyIds.forEach(companyId => {
        const companyRatings = data?.filter(r => r.company_id === companyId) || []
        const totalRatings = companyRatings.length
        
        if (totalRatings === 0) {
          ratingsByCompany[companyId] = { averageRating: 0, totalRatings: 0 }
        } else {
          // CRITICAL: Use same rounding as database and single company calculation
          const sum = companyRatings.reduce((acc, r) => acc + (r.overall_rating || 0), 0)
          const averageRating = Math.round((sum / totalRatings) * 10) / 10
          
          ratingsByCompany[companyId] = { averageRating, totalRatings }
        }
      })

      console.log('📊 Batch ratings calculated for', Object.keys(ratingsByCompany).length, 'companies')
      return ratingsByCompany
    } catch (error) {
      console.error('❌ Error in getMultipleCompanyRatings:', error)
      return {}
    }
  },

  // Get the AUTHORITATIVE rating directly from the database (most accurate)
  async getAuthoritativeCompanyRating(companyId: string) {
    try {
      console.log('🎯 Getting authoritative rating from database for:', companyId.substring(0, 8) + '...')
      
      const { data, error } = await supabase
        .from('trading_companies')
        .select('overall_rating, total_reviews')
        .eq('id', companyId)
        .single()

      if (error) {
        console.error('❌ Error fetching authoritative rating:', error)
        return { averageRating: 0, totalRatings: 0 }
      }

      if (!data) {
        return { averageRating: 0, totalRatings: 0 }
      }

      console.log('🎯 Authoritative rating:', { 
        averageRating: data.overall_rating, 
        totalRatings: data.total_reviews 
      })
      
      return {
        averageRating: data.overall_rating || 0,
        totalRatings: data.total_reviews || 0
      }
    } catch (error) {
      console.error('❌ Error in getAuthoritativeCompanyRating:', error)
      return { averageRating: 0, totalRatings: 0 }
    }
  },

  // Create new rating - Enhanced with user profile checking
  async createRating(ratingData: Omit<Rating, 'id' | 'created_at' | 'updated_at'>) {
    try {
      console.log('💾 Creating new rating for user:', ratingData.user_id.substring(0, 8) + '...')
      
      // First, ensure user profile exists - this is critical for the foreign key relationship
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', ratingData.user_id)
        .maybeSingle()

      if (!existingProfile) {
        console.log('👤 Creating user profile for rating submission...')
        
        // Create user profile if it doesn't exist
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([{
            id: ratingData.user_id,
            full_name: 'User',
            email: 'user@example.com' // This will be updated when they complete their profile
          }])

        if (profileError) {
          console.error('❌ Error creating user profile:', profileError)
          // Continue anyway - the rating might still work with just auth.users reference
        }
      }

      const { data, error } = await supabase
        .from('ratings')
        .insert([ratingData])
        .select()
        .single()

      if (error) {
        console.error('❌ Error creating rating:', error)
        throw error
      }

      console.log('✅ Rating created successfully:', data.id)
      // Note: The database trigger will automatically update the company's overall_rating
      return data
    } catch (error) {
      console.error('❌ Unexpected error in createRating:', error)
      throw error
    }
  },

  // Update existing rating
  async updateRating(id: string, updates: Partial<Rating>) {
    try {
      console.log('🔄 Updating rating:', id.substring(0, 8) + '...')
      
      const { data, error } = await supabase
        .from('ratings')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('❌ Error updating rating:', error)
        throw error
      }

      console.log('✅ Rating updated successfully')
      // Note: The database trigger will automatically update the company's overall_rating
      return data
    } catch (error) {
      console.error('❌ Unexpected error in updateRating:', error)
      throw error
    }
  },

  // Delete rating
  async deleteRating(id: string) {
    try {
      console.log('🗑️ Deleting rating:', id.substring(0, 8) + '...')
      
      const { error } = await supabase
        .from('ratings')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('❌ Error deleting rating:', error)
        throw error
      }

      console.log('✅ Rating deleted successfully')
      // Note: The database trigger will automatically update the company's overall_rating
    } catch (error) {
      console.error('❌ Unexpected error in deleteRating:', error)
      throw error
    }
  },

  // Get reviews for a company
  async getCompanyReviews(companyId: string) {
    try {
      console.log('📝 Getting company reviews for:', companyId.substring(0, 8) + '...')
      
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          user_profiles (
            full_name
          )
        `)
        .eq('company_id', companyId)
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error fetching company reviews:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('❌ Unexpected error in getCompanyReviews:', error)
      return []
    }
  },

  // Get user's ratings history
  async getUserRatings(userId: string) {
    try {
      console.log('📊 Getting user ratings history for:', userId.substring(0, 8) + '...')
      
      const { data, error } = await supabase
        .from('ratings')
        .select(`
          *,
          trading_companies (
            name,
            logo_url
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error fetching user ratings:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('❌ Unexpected error in getUserRatings:', error)
      return []
    }
  },

  // Get detailed rating breakdown for a company
  async getCompanyRatingBreakdown(companyId: string) {
    try {
      console.log('📊 Getting company rating breakdown for:', companyId.substring(0, 8) + '...')
      
      const { data, error } = await supabase
        .from('ratings')
        .select(`
          overall_rating,
          platform_usability,
          customer_support,
          fees_commissions,
          security_trust,
          educational_resources,
          mobile_app
        `)
        .eq('company_id', companyId)

      if (error) {
        console.error('❌ Error fetching rating breakdown:', error)
        return {
          overall_rating: 0,
          platform_usability: 0,
          customer_support: 0,
          fees_commissions: 0,
          security_trust: 0,
          educational_resources: 0,
          mobile_app: 0,
          total_ratings: 0
        }
      }

      if (!data || data.length === 0) {
        return {
          overall_rating: 0,
          platform_usability: 0,
          customer_support: 0,
          fees_commissions: 0,
          security_trust: 0,
          educational_resources: 0,
          mobile_app: 0,
          total_ratings: 0
        }
      }

      const totals = data.reduce(
        (acc, rating) => {
          acc.overall_rating += rating.overall_rating || 0
          acc.platform_usability += rating.platform_usability || 0
          acc.customer_support += rating.customer_support || 0
          acc.fees_commissions += rating.fees_commissions || 0
          acc.security_trust += rating.security_trust || 0
          acc.educational_resources += rating.educational_resources || 0
          acc.mobile_app += rating.mobile_app || 0
          return acc
        },
        {
          overall_rating: 0,
          platform_usability: 0,
          customer_support: 0,
          fees_commissions: 0,
          security_trust: 0,
          educational_resources: 0,
          mobile_app: 0
        }
      )

      const totalRatings = data.length

      return {
        overall_rating: Math.round((totals.overall_rating / totalRatings) * 10) / 10,
        platform_usability: Math.round((totals.platform_usability / totalRatings) * 10) / 10,
        customer_support: Math.round((totals.customer_support / totalRatings) * 10) / 10,
        fees_commissions: Math.round((totals.fees_commissions / totalRatings) * 10) / 10,
        security_trust: Math.round((totals.security_trust / totalRatings) * 10) / 10,
        educational_resources: Math.round((totals.educational_resources / totalRatings) * 10) / 10,
        mobile_app: Math.round((totals.mobile_app / totalRatings) * 10) / 10,
        total_ratings: totalRatings
      }
    } catch (error) {
      console.error('❌ Unexpected error in getCompanyRatingBreakdown:', error)
      return {
        overall_rating: 0,
        platform_usability: 0,
        customer_support: 0,
        fees_commissions: 0,
        security_trust: 0,
        educational_resources: 0,
        mobile_app: 0,
        total_ratings: 0
      }
    }
  },

  // Submit rating (helper method for forms) - Enhanced with better error handling
  async submitRating(userId: string, companyId: string, ratings: any, existingRating?: Rating) {
    const ratingData = {
      user_id: userId,
      company_id: companyId,
      overall_rating: ratings.overall_rating,
      platform_usability: ratings.platform_usability || null,
      customer_support: ratings.customer_support || null,
      fees_commissions: ratings.fees_commissions || null,
      security_trust: ratings.security_trust || null,
      educational_resources: ratings.educational_resources || null,
      mobile_app: ratings.mobile_app || null
    }

    if (existingRating) {
      return await this.updateRating(existingRating.id, ratingData)
    } else {
      return await this.createRating(ratingData)
    }
  }
}