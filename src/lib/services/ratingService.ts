// src/lib/services/ratingService.ts - REPLACE your existing ratingService.ts with this
import { supabase } from '../supabase'

// Keep existing interfaces but enhance them
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

// New interfaces for dual rating system
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

export interface CompanyRatingStats {
  averageRating: number
  totalRatings: number
  overallRatingCount: number
  categoryRatingCount: number
  categoryAverages: {
    platform_usability: number
    customer_support: number
    fees_commissions: number
    security_trust: number
    educational_resources: number
    mobile_app: number
  }
}

// Rating categories for the UI
export const RATING_CATEGORIES = [
  { key: 'platform_usability', label: 'Platform Usability', required: false },
  { key: 'customer_support', label: 'Customer Support', required: false },
  { key: 'fees_commissions', label: 'Fees & Commissions', required: false },
  { key: 'security_trust', label: 'Security & Trust', required: false },
  { key: 'educational_resources', label: 'Educational Resources', required: false },
  { key: 'mobile_app', label: 'Mobile App', required: false }
] as const

export const ratingService = {
  
  // Keep existing method names but enhance with dual rating support
  
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

      // Add rating_type to each rating
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

  // Get user's rating for a specific company
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
        console.log('📊 No user rating found (normal)')
        return null
      }

      console.log('📊 User rating found:', data.overall_rating)
      return {
        ...data,
        rating_type: this.determineRatingType(data)
      }
    } catch (error) {
      console.error('❌ Unexpected error in getUserRating:', error)
      return null
    }
  },

  // Get company average rating - Enhanced with decimal support
  async getCompanyAverageRating(companyId: string) {
    try {
      console.log('📊 Getting average rating for company:', companyId.substring(0, 8) + '...')
      
      // Get from authoritative source (trading_companies table)
      const { data, error } = await supabase
        .from('trading_companies')
        .select('overall_rating, total_reviews')
        .eq('id', companyId)
        .single()

      if (error) {
        console.error('❌ Error fetching company average rating:', error)
        return { averageRating: 0, totalRatings: 0 }
      }

      if (!data) {
        return { averageRating: 0, totalRatings: 0 }
      }

      const averageRating = Math.round((data.overall_rating || 0) * 10) / 10
      const totalRatings = data.total_reviews || 0

      console.log('📊 Company rating calculated:', { averageRating, totalRatings })
      
      return { averageRating, totalRatings }
    } catch (error) {
      console.error('❌ Unexpected error in getCompanyAverageRating:', error)
      return { averageRating: 0, totalRatings: 0 }
    }
  },

  // Batch get ratings for multiple companies
  async getMultipleCompanyRatings(companyIds: string[]) {
    try {
      console.log('📊 Getting ratings for', companyIds.length, 'companies')
      
      const { data, error } = await supabase
        .from('trading_companies')
        .select('id, overall_rating, total_reviews')
        .in('id', companyIds)

      if (error) {
        console.error('❌ Error fetching multiple company ratings:', error)
        return {}
      }

      const ratingsByCompany: Record<string, { averageRating: number, totalRatings: number }> = {}
      
      companyIds.forEach(companyId => {
        const company = data?.find(c => c.id === companyId)
        if (company) {
          ratingsByCompany[companyId] = {
            averageRating: Math.round((company.overall_rating || 0) * 10) / 10,
            totalRatings: company.total_reviews || 0
          }
        } else {
          ratingsByCompany[companyId] = { averageRating: 0, totalRatings: 0 }
        }
      })

      console.log('📊 Batch ratings calculated for', Object.keys(ratingsByCompany).length, 'companies')
      return ratingsByCompany
    } catch (error) {
      console.error('❌ Error in getMultipleCompanyRatings:', error)
      return {}
    }
  },

  // Get the AUTHORITATIVE rating directly from the database
  async getAuthoritativeCompanyRating(companyId: string) {
    // Same as getCompanyAverageRating for consistency
    return this.getCompanyAverageRating(companyId)
  },

  // NEW: Submit Overall Rating (dual system)
  async submitOverallRating(userId: string, companyId: string, rating: number): Promise<UserRating> {
    try {
      console.log('⭐ Submitting overall rating:', rating)
      
      const { data, error } = await supabase
        .from('ratings')
        .upsert({
          user_id: userId,
          company_id: companyId,
          overall_rating: Math.round(rating * 10) / 10,
          // Reset all category ratings
          platform_usability: null,
          customer_support: null,
          fees_commissions: null,
          security_trust: null,
          educational_resources: null,
          mobile_app: null,
          review_id: null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,company_id'
        })
        .select()
        .single()

      if (error) {
        console.error('❌ Error submitting overall rating:', error)
        throw error
      }

      console.log('✅ Overall rating submitted successfully')
      return {
        ...data,
        rating_type: 'overall' as const
      }
    } catch (error) {
      console.error('❌ Error in submitOverallRating:', error)
      throw error
    }
  },

  // Update your submitCategoryRatings method in ratingService.ts
  // REPLACE the existing submitCategoryRatings method with this fixed version:

  // NEW: Submit Category Ratings (dual system) - FIXED to handle zero values
  async submitCategoryRatings(userId: string, companyId: string, ratings: CategoryRatings): Promise<UserRating> {
    try {
      console.log('📊 Submitting category ratings', ratings)
      
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
      
      const { data, error } = await supabase
        .from('ratings')
        .upsert({
          user_id: userId,
          company_id: companyId,
          // Reset overall rating
          overall_rating: null,
          // Set category ratings (with nulls for unrated)
          platform_usability: processedRatings.platform_usability,
          customer_support: processedRatings.customer_support,
          fees_commissions: processedRatings.fees_commissions,
          security_trust: processedRatings.security_trust,
          educational_resources: processedRatings.educational_resources,
          mobile_app: processedRatings.mobile_app,
          review_id: null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,company_id'
        })
        .select()
        .single()

      if (error) {
        console.error('❌ Error submitting category ratings:', error)
        throw error
      }

      console.log('✅ Category ratings submitted successfully')
      return {
        ...data,
        rating_type: 'categories' as const
      }
    } catch (error) {
      console.error('❌ Error in submitCategoryRatings:', error)
      throw error
    }
  },

  // Enhanced: Create/Update rating - Modified to support dual system
  async createRating(ratingData: Omit<Rating, 'id' | 'created_at' | 'updated_at'>) {
    try {
      console.log('💾 Creating new rating for user:', ratingData.user_id.substring(0, 8) + '...')
      
      // Ensure user profile exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', ratingData.user_id)
        .maybeSingle()

      if (!existingProfile) {
        console.log('👤 Creating user profile for rating submission...')
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([{
            id: ratingData.user_id,
            full_name: 'User',
            email: 'user@example.com'
          }])

        if (profileError) {
          console.error('❌ Error creating user profile:', profileError)
        }
      }

      const { data, error } = await supabase
        .from('ratings')
        .insert([{
          ...ratingData,
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) {
        console.error('❌ Error creating rating:', error)
        throw error
      }

      console.log('✅ Rating created successfully:', data.id)
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
    } catch (error) {
      console.error('❌ Unexpected error in deleteRating:', error)
      throw error
    }
  },

  // NEW: Get detailed company statistics
  async getCompanyStats(companyId: string): Promise<CompanyRatingStats> {
    try {
      console.log('📈 Getting company rating stats')
      
      const { data, error } = await supabase
        .from('ratings')
        .select('*')
        .eq('company_id', companyId)

      if (error) {
        console.error('❌ Error getting company stats:', error)
        throw error
      }

      if (!data || data.length === 0) {
        return {
          averageRating: 0,
          totalRatings: 0,
          overallRatingCount: 0,
          categoryRatingCount: 0,
          categoryAverages: {
            platform_usability: 0,
            customer_support: 0,
            fees_commissions: 0,
            security_trust: 0,
            educational_resources: 0,
            mobile_app: 0
          }
        }
      }

      // Calculate statistics with decimal support
      const overallRatings = data.filter(r => r.overall_rating !== null)
      const categoryRatings = data.filter(r => 
        r.platform_usability !== null || r.customer_support !== null ||
        r.fees_commissions !== null || r.security_trust !== null ||
        r.educational_resources !== null || r.mobile_app !== null
      )

      // Calculate overall average
      let averageRating = 0
      if (overallRatings.length > 0) {
        const sum = overallRatings.reduce((acc, r) => acc + (r.overall_rating || 0), 0)
        averageRating = Math.round((sum / overallRatings.length) * 10) / 10
      } else if (categoryRatings.length > 0) {
        // Calculate from category averages if no overall ratings
        const categoryAverageSum = categoryRatings.reduce((acc, r) => {
          const values = [
            r.platform_usability, r.customer_support, r.fees_commissions,
            r.security_trust, r.educational_resources, r.mobile_app
          ].filter(v => v !== null) as number[]
          
          if (values.length > 0) {
            const avgForThisRating = values.reduce((s, v) => s + v, 0) / values.length
            return acc + avgForThisRating
          }
          return acc
        }, 0)
        
        if (categoryRatings.length > 0) {
          averageRating = Math.round((categoryAverageSum / categoryRatings.length) * 10) / 10
        }
      }

      // Calculate category averages
      const categoryAverages = {
        platform_usability: 0,
        customer_support: 0,
        fees_commissions: 0,
        security_trust: 0,
        educational_resources: 0,
        mobile_app: 0
      }

      RATING_CATEGORIES.forEach(({ key }) => {
        const values = data
          .map(r => r[key as keyof typeof r] as number)
          .filter(v => v !== null && v !== undefined)
        
        if (values.length > 0) {
          const sum = values.reduce((acc, v) => acc + v, 0)
          categoryAverages[key as keyof typeof categoryAverages] = Math.round((sum / values.length) * 10) / 10
        }
      })

      return {
        averageRating,
        totalRatings: data.length,
        overallRatingCount: overallRatings.length,
        categoryRatingCount: categoryRatings.length,
        categoryAverages
      }
    } catch (error) {
      console.error('❌ Error in getCompanyStats:', error)
      return {
        averageRating: 0,
        totalRatings: 0,
        overallRatingCount: 0,
        categoryRatingCount: 0,
        categoryAverages: {
          platform_usability: 0,
          customer_support: 0,
          fees_commissions: 0,
          security_trust: 0,
          educational_resources: 0,
          mobile_app: 0
        }
      }
    }
  },

  // Helper: Determine rating type
  determineRatingType(rating: Rating): 'overall' | 'categories' | 'none' {
    if (rating.overall_rating !== null) {
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
  }
}

// Helper function to calculate category average
export const calculateCategoryAverage = (ratings: Partial<CategoryRatings>): number => {
  const values = Object.values(ratings).filter(val => val !== null && val !== undefined && val > 0) as number[]
  if (values.length === 0) return 0
  const sum = values.reduce((acc, val) => acc + val, 0)
  return Math.round((sum / values.length) * 10) / 10
}