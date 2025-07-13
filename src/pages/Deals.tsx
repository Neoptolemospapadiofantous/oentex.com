// src/pages/Deals.tsx - MODERNIZED: Pure React Query, no legacy code
import React, { useState, useMemo, useCallback } from 'react'
import { Search, Filter, Star, AlertCircle, RefreshCw, Gift, Users, TrendingUp } from 'lucide-react'
import { useAuth } from '../lib/authContext'
import { DealCard } from '../components/deals/DealCard'
import { RatingModal } from '../components/rating/RatingModal'
import { AuthModal } from '../components/auth/AuthModals'
import { 
  useDealsQuery, 
  useUserRatingsQuery, 
  useUpdateDealClickMutation,
  useSubmitRatingMutation 
} from '../hooks/queries/useDealsQuery'

// ✅ MODERN: Simple, clean interfaces
interface Filters {
  searchTerm: string
  category: string
  sortBy: string
}

const DEAL_CATEGORIES = [
  { value: 'all', label: 'All Deals' },
  { value: 'crypto_exchange', label: 'Crypto Exchange' },
  { value: 'stock_broker', label: 'Stock Broker' },
  { value: 'forex_broker', label: 'Forex Broker' },
  { value: 'multi_asset', label: 'Multi Asset' },
]

const Deals: React.FC = () => {
  const { user, isFullyReady } = useAuth()

  // ✅ MODERN: All data from React Query
  const dealsQuery = useDealsQuery()
  const deals = dealsQuery.data?.deals || []
  const companies = dealsQuery.data?.companies || []

  const companyIds = useMemo(() => 
    deals.map(deal => deal.company?.id).filter(Boolean) as string[], 
    [deals]
  )
  const userRatingsQuery = useUserRatingsQuery(user?.id, companyIds)

  // ✅ MODERN: Mutations for updates
  const updateDealClickMutation = useUpdateDealClickMutation()
  const submitRatingMutation = useSubmitRatingMutation()

  // ✅ MODERN: Only UI state
  const [filters, setFilters] = useState<Filters>({
    searchTerm: '',
    category: 'all',
    sortBy: 'rating'
  })
  const [selectedDeal, setSelectedDeal] = useState<any>(null)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  // ✅ MODERN: Computed data (no state storage)
  const dealsWithUserRatings = useMemo(() => {
    const userRatings = userRatingsQuery.data || new Map()
    
    return deals.map(deal => ({
      ...deal,
      userRating: deal.company?.id ? userRatings.get(deal.company.id) : undefined
    }))
  }, [deals, userRatingsQuery.data])

  const filteredDeals = useMemo(() => {
    let filtered = dealsWithUserRatings

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(deal =>
        deal.company_name.toLowerCase().includes(searchLower) ||
        deal.title.toLowerCase().includes(searchLower) ||
        deal.description.toLowerCase().includes(searchLower)
      )
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(deal => 
        deal.company?.category === filters.category
      )
    }

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'rating':
          return (b.company?.overall_rating || 0) - (a.company?.overall_rating || 0)
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
  }, [dealsWithUserRatings, filters])

  // ✅ MODERN: Clean event handlers
  const handleFilterChange = useCallback((key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const handleRateClick = useCallback((deal: any) => {
    if (!user) {
      setAuthMode('login')
      setShowAuthModal(true)
      return
    }

    if (!deal.company) {
      return
    }

    setSelectedDeal(deal)
    setShowRatingModal(true)
  }, [user])

  const handleTrackClick = useCallback(async (deal: any) => {
    try {
      // ✅ MODERN: Mutation handles all updates automatically
      await updateDealClickMutation.mutateAsync(deal.id)
      window.open(deal.affiliate_link, '_blank', 'noopener,noreferrer')
    } catch (error) {
      console.error('Error tracking deal click:', error)
      window.open(deal.affiliate_link, '_blank', 'noopener,noreferrer')
    }
  }, [updateDealClickMutation])

  const handleRatingSubmitted = useCallback(() => {
    // ✅ MODERN: Just close modal - mutation handles all updates
    setShowRatingModal(false)
    setSelectedDeal(null)
  }, [])

  const handleRetry = useCallback(() => {
    dealsQuery.refetch()
  }, [dealsQuery])

  // ✅ MODERN: Loading states
  if (!isFullyReady) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-textSecondary">Initializing app...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (dealsQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-text mb-4">
              Trading Deals & Bonuses
            </h1>
            <p className="text-xl text-textSecondary">
              Loading exclusive offers with real-time ratings...
            </p>
          </div>
          
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-textSecondary">Loading deals and community ratings...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (dealsQuery.error) {
    const error = dealsQuery.error instanceof Error 
      ? dealsQuery.error.message 
      : 'Failed to load deals'

    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
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

        {/* ✅ MODERN: Real-time stats */}
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
              <Star className="w-8 h-8 text-primary" />
              <div>
                <div className="text-3xl font-bold text-text">
                  {companies.reduce((sum, c) => sum + (c.total_reviews || 0), 0)}
                </div>
                <div className="text-textSecondary text-sm">Community Reviews</div>
              </div>
            </div>
          </div>
          
          <div className="bg-surface p-6 rounded-xl border border-border">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <div className="text-3xl font-bold text-text">
                  {Math.round(companies.reduce((sum, c) => sum + (c.overall_rating || 0), 0) / Math.max(companies.length, 1) * 10) / 10}
                </div>
                <div className="text-textSecondary text-sm">Average Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ MODERN: Clean filters */}
        <div className="bg-surface p-6 rounded-xl border border-border mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search deals, companies..."
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-text"
                />
              </div>
            </div>

            <div>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-text appearance-none"
              >
                {DEAL_CATEGORIES.map((category) => (
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
        {filteredDeals.length === 0 && deals.length > 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-text mb-2">
              No deals found
            </h3>
            <p className="text-textSecondary mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => setFilters({ searchTerm: '', category: 'all', sortBy: 'rating' })}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* ✅ MODERN: Cards automatically update via React Query */}
        {filteredDeals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredDeals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                onRateClick={handleRateClick}
                onTrackClick={handleTrackClick}
                isSubmittingRating={submitRatingMutation.isPending}
              />
            ))}
          </div>
        )}

        {/* Community Trust Footer */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold text-text">Community Trust Network</h3>
          </div>
          <p className="text-textSecondary max-w-2xl mx-auto">
            All ratings and reviews come from verified traders in our community. 
            Help fellow traders by sharing your honest experience with these platforms.
          </p>
        </div>
      </div>

      {/* ✅ MODERN: Modals use modern mutation hooks */}
      {showRatingModal && selectedDeal && (
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
            averageRating: selectedDeal.company?.overall_rating || 0,
            totalRatings: selectedDeal.company?.total_reviews || 0
          }}
        />
      )}

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