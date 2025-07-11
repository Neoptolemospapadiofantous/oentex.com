// src/pages/Deals.tsx - REPLACE your existing Deals.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Search, Filter, Star } from 'lucide-react'
import { useAuth } from '../lib/authContext'
import { DealCard } from '../components/deals/DealCard'
import { RatingModal } from '../components/rating/RatingModal'
import { AuthModal } from '../components/auth/AuthModals'
import { ratingService, UserRating } from '../lib/services/ratingService'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

// Enhanced interfaces
interface Company {
  id: string
  name: string
  slug: string
  description: string
  logo_url?: string
  website_url: string
  overall_rating: number
  total_reviews: number
  category: string
  status: string
}

interface Deal {
  id: string
  merchant_name: string
  title: string
  description: string
  terms?: string
  commission_rate?: number
  tracking_link: string
  start_date: string
  end_date?: string
  category: string
  status: string
  bonus_amount?: string
  rating: number
  features: string[]
  image_url?: string
  click_count: number
}

interface DealWithRating extends Deal {
  company?: Company
  companyRating?: {
    averageRating: number
    totalRatings: number
  }
  userRating?: UserRating
}

interface DealFilters {
  searchTerm: string
  category: string
  sortBy: string
}

const Deals: React.FC = () => {
  // State management
  const [deals, setDeals] = useState<Deal[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [dealsWithRatings, setDealsWithRatings] = useState<DealWithRating[]>([])
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

  const { user } = useAuth()

  // Fetch initial data
  useEffect(() => {
    fetchData()
  }, [])

  // Fetch user ratings when user changes
  useEffect(() => {
    if (user && deals.length > 0) {
      fetchUserRatings()
    }
  }, [user, deals])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch deals and companies in parallel
      const [dealsResult, companiesResult] = await Promise.all([
        supabase
          .from('deals')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false }),
        
        supabase
          .from('trading_companies')
          .select('*')
          .eq('status', 'active')
      ])

      if (dealsResult.error) throw dealsResult.error
      if (companiesResult.error) throw companiesResult.error

      const fetchedDeals = dealsResult.data || []
      const fetchedCompanies = companiesResult.data || []

      setDeals(fetchedDeals)
      setCompanies(fetchedCompanies)

      // Get company ratings for all companies
      await enrichDealsWithRatings(fetchedDeals, fetchedCompanies)

    } catch (error: any) {
      console.error('Error fetching data:', error)
      setError('Failed to load deals. Please try again.')
      toast.error('Failed to load deals')
    } finally {
      setLoading(false)
    }
  }

  const enrichDealsWithRatings = async (dealsList: Deal[], companiesList: Company[]) => {
    try {
      // Create a map of companies for quick lookup
      const companyMap = new Map(companiesList.map(c => [c.name.toLowerCase(), c]))
      
      // Get ratings for all companies
      const companyIds = companiesList.map(c => c.id)
      const companyRatings = await ratingService.getMultipleCompanyRatings(companyIds)

      // Enrich deals with company and rating data
      const enrichedDeals: DealWithRating[] = dealsList.map(deal => {
        const company = companyMap.get(deal.merchant_name.toLowerCase())
        
        return {
          ...deal,
          company,
          companyRating: company ? companyRatings[company.id] : undefined
        }
      })

      setDealsWithRatings(enrichedDeals)
    } catch (error) {
      console.error('Error enriching deals with ratings:', error)
      // Still set deals without ratings
      const basicDeals: DealWithRating[] = dealsList.map(deal => ({
        ...deal,
        company: undefined,
        companyRating: undefined
      }))
      setDealsWithRatings(basicDeals)
    }
  }

  const fetchUserRatings = async () => {
    if (!user) return

    try {
      const updatedDeals = await Promise.all(
        dealsWithRatings.map(async (deal) => {
          if (!deal.company) return deal

          const userRating = await ratingService.getUserRating(user.id, deal.company.id)
          return {
            ...deal,
            userRating: userRating || undefined
          }
        })
      )

      setDealsWithRatings(updatedDeals)
    } catch (error) {
      console.error('Error fetching user ratings:', error)
    }
  }

  // Filter and sort deals
  const filteredDeals = useMemo(() => {
    let filtered = dealsWithRatings.filter(deal => {
      const matchesSearch = deal.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                           deal.merchant_name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                           deal.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
      
      const matchesCategory = filters.category === 'all' || deal.category === filters.category

      return matchesSearch && matchesCategory
    })

    // Sort deals
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'rating':
          const ratingA = a.companyRating?.averageRating || a.company?.overall_rating || 0
          const ratingB = b.companyRating?.averageRating || b.company?.overall_rating || 0
          return ratingB - ratingA
        case 'newest':
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
        case 'popular':
          return (b.click_count || 0) - (a.click_count || 0)
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
      const { error } = await supabase.rpc('increment_deal_clicks', {
        deal_id: deal.id
      })

      if (error) throw error

      // Update local state
      setDealsWithRatings(prev => prev.map(d => 
        d.id === deal.id 
          ? { ...d, click_count: (d.click_count || 0) + 1 }
          : d
      ))

      // Open tracking link
      window.open(deal.tracking_link, '_blank', 'noopener,noreferrer')
      
    } catch (error) {
      console.error('Error tracking deal click:', error)
      // Still open the link even if tracking fails
      window.open(deal.tracking_link, '_blank', 'noopener,noreferrer')
    }
  }, [])

  const handleRatingSubmitted = useCallback(async () => {
    setShowRatingModal(false)
    setSelectedDeal(null)
    
    // Refresh the specific deal's rating data
    if (selectedDeal?.company && user) {
      try {
        const [companyRating, userRating] = await Promise.all([
          ratingService.getCompanyAverageRating(selectedDeal.company.id),
          ratingService.getUserRating(user.id, selectedDeal.company.id)
        ])

        setDealsWithRatings(prev => prev.map(deal => 
          deal.id === selectedDeal.id 
            ? { 
                ...deal, 
                companyRating,
                userRating: userRating || undefined
              }
            : deal
        ))

        toast.success('Rating updated successfully!')
      } catch (error) {
        console.error('Error refreshing rating data:', error)
        toast.success('Rating submitted!')
      }
    }
  }, [selectedDeal, user])

  const handleFilterChange = useCallback((key: keyof DealFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  // Calculate stats
  const stats = useMemo(() => {
    if (filteredDeals.length === 0) {
      return { averageRating: 0, totalClaims: 0 }
    }

    const averageRating = filteredDeals.reduce((sum, deal) => {
      const rating = deal.companyRating?.averageRating || deal.company?.overall_rating || 0
      return sum + rating
    }, 0) / filteredDeals.length

    const totalClaims = filteredDeals.reduce((sum, deal) => sum + (deal.click_count || 0), 0)

    return { 
      averageRating: Math.round(averageRating * 10) / 10,
      totalClaims 
    }
  }, [filteredDeals])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-textSecondary">Loading deals...</span>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchData}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">Trading Deals & Bonuses</h1>
          <p className="text-textSecondary">
            Discover exclusive offers from top trading platforms
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-surface p-4 rounded-lg border border-border">
            <div className="text-2xl font-bold text-text">{filteredDeals.length}</div>
            <div className="text-textSecondary text-sm">Active Deals</div>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-border">
            <div className="text-2xl font-bold text-text">{companies.length}</div>
            <div className="text-textSecondary text-sm">Trading Platforms</div>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-border">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <div className="text-2xl font-bold text-text">{stats.averageRating}</div>
            </div>
            <div className="text-textSecondary text-sm">Average Rating</div>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-border">
            <div className="text-2xl font-bold text-text">{stats.totalClaims.toLocaleString()}</div>
            <div className="text-textSecondary text-sm">Total Claims</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary w-4 h-4" />
            <input
              type="text"
              placeholder="Search deals..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-surface text-text placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Categories</option>
            <option value="crypto">Crypto</option>
            <option value="forex">Forex</option>
            <option value="stocks">Stocks</option>
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>

        {/* Deals Grid */}
        {filteredDeals.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredDeals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                onRateClick={() => handleRateClick(deal)}
                onTrackClick={() => handleTrackClick(deal)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Filter className="w-12 h-12 text-textSecondary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text mb-2">No deals found</h3>
            <p className="text-textSecondary mb-4">
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
    </div>
  )
}

export default Deals