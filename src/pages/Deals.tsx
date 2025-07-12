// src/pages/Deals.tsx - ENHANCED with Real Database Ratings
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Search, Filter, Star, AlertCircle, RefreshCw, Gift, Users, TrendingUp } from 'lucide-react'
import { useAuth } from '../lib/authContext'
import { DealCard } from '../components/deals/DealCard'
import { RatingModal } from '../components/rating/RatingModal'
import { AuthModal } from '../components/auth/AuthModals'
import { ratingService, UserRating } from '../lib/services/ratingService'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

// Enhanced interfaces matching your database schema
interface Company {
  id: string
  name: string
  slug: string
  description: string
  logo_url?: string
  website_url: string
  overall_rating: number  // ✅ Real aggregated rating from database
  total_reviews: number   // ✅ Real review count from database
  category: string
  status: string
  founded_year?: number
  headquarters?: string
  regulation?: string[]
  supported_markets?: string[]
  minimum_deposit?: number
  commission_structure?: string
  features?: string[]
  pros?: string[]
  cons?: string[]
  affiliate_link?: string
}

interface Deal {
  id: string
  company_id: string
  title: string
  description: string
  deal_type: string
  value?: string
  terms?: string
  start_date: string
  end_date?: string
  is_active: boolean
  click_count: number
  conversion_rate?: number
  affiliate_link: string
  created_at: string
  updated_at: string
}

interface DealWithRating extends Deal {
  company?: Company
  company_name: string
  category: string
  bonus_amount?: string
  features: string[]
  userRating?: UserRating
}

interface DealFilters {
  searchTerm: string
  category: string
  sortBy: string
}

const Deals: React.FC = () => {
  // State management
  const [dealsWithRatings, setDealsWithRatings] = useState<DealWithRating[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Modal states
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState<DealWithRating | null>(null)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  
  // Filter states
  const [filters, setFilters] = useState<DealFilters>({
    searchTerm: '',
    category: 'all',
    sortBy: 'rating'
  })

  const { user, isFullyReady } = useAuth()

  // Fetch initial data
  useEffect(() => {
    if (isFullyReady) {
      fetchData()
    }
  }, [isFullyReady])

  // Fetch user ratings when user changes
  useEffect(() => {
    if (user && dealsWithRatings.length > 0) {
      fetchUserRatings()
    }
  }, [user])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('🔄 Fetching deals with real company rating data...')

      // ✅ ENHANCED: Fetch deals with complete company data including real ratings
      const { data: dealsData, error: dealsError } = await supabase
        .from('company_deals')
        .select(`
          *,
          company:trading_companies(*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (dealsError) {
        console.error('❌ Error fetching deals:', dealsError)
        throw dealsError
      }

      if (!dealsData || dealsData.length === 0) {
        console.log('⚠️ No deals found')
        setDealsWithRatings([])
        setCompanies([])
        return
      }

      // ✅ ENHANCED: Transform deals with real company rating data
      const transformedDeals: DealWithRating[] = dealsData.map(deal => {
        const company = Array.isArray(deal.company) ? deal.company[0] : deal.company
        
        console.log(`📊 ${company?.name}: ${company?.overall_rating} stars (${company?.total_reviews} reviews)`)
        
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
          // Derived fields for compatibility
          company_name: company?.name || 'Unknown Company',
          category: company?.category || deal.deal_type,
          bonus_amount: deal.value || 'Special Offer',
          features: company?.features || [],
          // ✅ REAL COMPANY DATA with aggregated ratings
          company: company ? {
            ...company,
            overall_rating: company.overall_rating || 0,  // Real aggregated rating
            total_reviews: company.total_reviews || 0     // Real review count
          } : undefined
        }
      })

      // Extract unique companies
      const uniqueCompanies = transformedDeals
        .map(deal => deal.company)
        .filter((company, index, arr) => 
          company && arr.findIndex(c => c?.id === company.id) === index
        ) as Company[]

      console.log(`✅ Loaded ${transformedDeals.length} deals from ${uniqueCompanies.length} companies`)
      console.log('📊 Rating summary:', uniqueCompanies.map(c => 
        `${c.name}: ${c.overall_rating}⭐ (${c.total_reviews} reviews)`
      ).join(', '))

      setDealsWithRatings(transformedDeals)
      setCompanies(uniqueCompanies)

    } catch (error: any) {
      console.error('❌ Error fetching data:', error)
      setError('Failed to load deals. Please try again.')
      toast.error('Failed to load deals')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserRatings = async () => {
    if (!user) return

    try {
      console.log('🔄 Fetching user ratings...')
      
      const updatedDeals = await Promise.all(
        dealsWithRatings.map(async (deal) => {
          if (!deal.company) return deal

          try {
            const userRating = await ratingService.getUserRating(user.id, deal.company.id)
            return {
              ...deal,
              userRating: userRating || undefined
            }
          } catch (error) {
            console.error(`Error fetching user rating for ${deal.company.name}:`, error)
            return deal
          }
        })
      )

      setDealsWithRatings(updatedDeals)
      console.log('✅ User ratings loaded')
    } catch (error) {
      console.error('❌ Error fetching user ratings:', error)
    }
  }

  // ✅ ENHANCED: Filter and sort deals with real rating data
  const filteredDeals = useMemo(() => {
    let filtered = dealsWithRatings.filter(deal => {
      const matchesSearch = deal.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                           deal.company_name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                           deal.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
      
      const matchesCategory = filters.category === 'all' || deal.category === filters.category

      return matchesSearch && matchesCategory
    })

    // Sort deals using real rating data
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'rating':
          // ✅ Use real aggregated ratings from database
          const ratingA = a.company?.overall_rating || 0
          const ratingB = b.company?.overall_rating || 0
          
          // Secondary sort by review count for ties
          if (ratingA === ratingB) {
            return (b.company?.total_reviews || 0) - (a.company?.total_reviews || 0)
          }
          return ratingB - ratingA
          
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          
        case 'popular':
          return (b.click_count || 0) - (a.click_count || 0)
          
        case 'name':
          return a.company_name.localeCompare(b.company_name)
          
        default:
          return 0
      }
    })

    return filtered
  }, [dealsWithRatings, filters])

  // Event handlers
  const handleRateClick = useCallback((deal: DealWithRating) => {
    if (!user) {
      setAuthMode('login')
      setShowAuthModal(true)
      return
    }

    if (!deal.company) {
      toast.error('Cannot rate this deal - company information not available')
      return
    }

    setSelectedDeal(deal)
    setShowRatingModal(true)
  }, [user])

  const handleTrackClick = useCallback(async (deal: DealWithRating) => {
    try {
      // Increment click count
      const { error } = await supabase
        .from('company_deals')
        .update({ 
          click_count: supabase.sql`click_count + 1`
        })
        .eq('id', deal.id)

      if (error) throw error

      // Update local state
      setDealsWithRatings(prev => prev.map(d => 
        d.id === deal.id 
          ? { ...d, click_count: (d.click_count || 0) + 1 }
          : d
      ))

      // Open tracking link
      window.open(deal.affiliate_link, '_blank', 'noopener,noreferrer')
      
    } catch (error) {
      console.error('Error tracking deal click:', error)
      // Still open the link even if tracking fails
      window.open(deal.affiliate_link, '_blank', 'noopener,noreferrer')
    }
  }, [])

  const handleRatingSubmitted = useCallback(async () => {
    setShowRatingModal(false)
    setSelectedDeal(null)
    
    if (selectedDeal?.company && user) {
      try {
        // ✅ IMMEDIATE UI UPDATE: Manually refresh the company rating from database
        console.log('🔄 Refreshing company rating after submission...')
        
        // Fetch the updated company data directly
        const { data: updatedCompany, error } = await supabase
          .from('trading_companies')
          .select('overall_rating, total_reviews')
          .eq('id', selectedDeal.company.id)
          .single()

        if (error) {
          console.error('❌ Error fetching updated company data:', error)
        } else {
          console.log('✅ Updated company rating:', updatedCompany)
          
          // Update the local state immediately with fresh data
          setDealsWithRatings(prev => prev.map(deal => 
            deal.id === selectedDeal.id 
              ? { 
                  ...deal, 
                  company: {
                    ...deal.company!,
                    overall_rating: updatedCompany.overall_rating || 0,
                    total_reviews: updatedCompany.total_reviews || 0
                  }
                }
              : deal
          ))
        }

        // Also fetch user rating
        const userRating = await ratingService.getUserRating(user.id, selectedDeal.company.id)
        
        // Update user rating in state
        setDealsWithRatings(prev => prev.map(deal => 
          deal.id === selectedDeal.id 
            ? { 
                ...deal, 
                userRating: userRating || undefined
              }
            : deal
        ))

        toast.success('Rating updated successfully!')
        
        // ✅ BACKUP: Force page refresh after 2 seconds if needed
        setTimeout(() => {
          console.log('🔄 Backup refresh of all data...')
          fetchData() // Your main data fetch function
        }, 2000)
        
      } catch (error) {
        console.error('❌ Error refreshing rating data:', error)
        toast.success('Rating submitted!')
        
        // Fallback: just refresh all data
        setTimeout(() => {
          fetchData()
        }, 1000)
      }
    }
  }, [selectedDeal, user, setDealsWithRatings, fetchData])

  const handleFilterChange = useCallback((key: keyof DealFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const handleRetry = useCallback(() => {
    fetchData()
  }, [])

  // ✅ ENHANCED: Calculate stats with real rating data
  const stats = useMemo(() => {
    if (filteredDeals.length === 0 || companies.length === 0) {
      return { 
        averageRating: 0, 
        totalClaims: 0,
        totalReviews: 0,
        topRatedCompanies: 0
      }
    }

    // Calculate overall average rating from all companies (weighted by review count)
    let totalWeightedRating = 0
    let totalReviews = 0
    let topRatedCompanies = 0

    companies.forEach(company => {
      if (company.total_reviews > 0) {
        totalWeightedRating += company.overall_rating * company.total_reviews
        totalReviews += company.total_reviews
        
        if (company.overall_rating >= 4.5 && company.total_reviews >= 10) {
          topRatedCompanies++
        }
      }
    })

    const averageRating = totalReviews > 0 ? 
      Math.round((totalWeightedRating / totalReviews) * 10) / 10 : 0

    const totalClaims = filteredDeals.reduce((sum, deal) => sum + (deal.click_count || 0), 0)

    return { 
      averageRating,
      totalClaims,
      totalReviews,
      topRatedCompanies
    }
  }, [filteredDeals, companies])

  // Available categories from actual data
  const availableCategories = useMemo(() => {
    const categories = [...new Set(companies.map(c => c.category))].filter(Boolean)
    return [
      { value: 'all', label: 'All Categories' },
      ...categories.map(cat => ({
        value: cat,
        label: cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      }))
    ]
  }, [companies])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-300 rounded w-96 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-128 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
            </div>
            <p className="text-sm text-primary mt-4 animate-pulse">
              Loading deals with community ratings...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-surface rounded-2xl p-6 animate-pulse">
                <div className="h-32 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-text mb-2">
              Unable to Load Deals
            </h2>
            <p className="text-textSecondary mb-6">{error}</p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text mb-4">
            Trading Deals & Bonuses
          </h1>
          <p className="text-xl text-textSecondary mb-2">
            Discover exclusive offers from top-rated trading platforms
          </p>
          <p className="text-textSecondary">
            All ratings based on real trader reviews and experiences
          </p>
        </div>

        {/* ✅ ENHANCED: Stats with real community data */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-surface p-6 rounded-xl border border-border">
            <div className="flex items-center gap-3 mb-2">
              <Gift className="w-8 h-8 text-primary" />
              <div>
                <div className="text-3xl font-bold text-text">{filteredDeals.length}</div>
                <div className="text-textSecondary text-sm">Active Deals</div>
              </div>
            </div>
          </div>
          
          <div className="bg-surface p-6 rounded-xl border border-border">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-primary" />
              <div>
                <div className="text-3xl font-bold text-text">{companies.length}</div>
                <div className="text-textSecondary text-sm">Trading Platforms</div>
              </div>
            </div>
          </div>
          
          <div className="bg-surface p-6 rounded-xl border border-border">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
              <div>
                <div className="text-3xl font-bold text-text">{stats.averageRating}</div>
                <div className="text-textSecondary text-sm">Average Rating</div>
              </div>
            </div>
          </div>
          
          <div className="bg-surface p-6 rounded-xl border border-border">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <div className="text-3xl font-bold text-text">{stats.totalReviews.toLocaleString()}</div>
                <div className="text-textSecondary text-sm">Community Reviews</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-surface border border-border rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary w-5 h-5" />
              <input
                type="text"
                placeholder="Search deals..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-text"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary w-5 h-5" />
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-text appearance-none"
              >
                {availableCategories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-text appearance-none"
              >
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
                <option value="popular">Most Claimed</option>
                <option value="name">Company A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* No Results */}
        {filteredDeals.length === 0 && dealsWithRatings.length > 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-text mb-2">
              No deals found
            </h3>
            <p className="text-textSecondary mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => setFilters({
                searchTerm: '',
                category: 'all',
                sortBy: 'rating'
              })}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Deals Grid */}
        {filteredDeals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredDeals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                onRateClick={handleRateClick}
                onTrackClick={handleTrackClick}
              />
            ))}
          </div>
        )}

        {/* ✅ ENHANCED: Community Trust Footer */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-text mb-4">
            Trusted by Traders Worldwide
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {stats.totalReviews.toLocaleString()}+
              </div>
              <div className="text-textSecondary">
                Community Reviews
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {stats.topRatedCompanies}
              </div>
              <div className="text-textSecondary">
                Top-Rated Platforms
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {stats.totalClaims.toLocaleString()}+
              </div>
              <div className="text-textSecondary">
                Deals Claimed
              </div>
            </div>
          </div>
          <p className="text-textSecondary mt-6">
            All ratings are based on real trader experiences and verified reviews
          </p>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && selectedDeal && selectedDeal.company && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => {
            setShowRatingModal(false)
            setSelectedDeal(null)
          }}
          companyId={selectedDeal.company.id}
          companyName={selectedDeal.company.name}
          existingRating={selectedDeal.userRating}
          onRatingSubmitted={handleRatingSubmitted}
          companyRating={{
            averageRating: selectedDeal.company.overall_rating,
            totalRatings: selectedDeal.company.total_reviews
          }}
        />
      )}
      
      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode={authMode}
          onModeChange={setAuthMode}
        />
      )}
    </div>
  )
}

export default Deals