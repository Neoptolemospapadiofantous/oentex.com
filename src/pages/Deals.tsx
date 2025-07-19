// src/pages/Deals.tsx - UPDATED with curated categories
import React, { useState, useMemo, useCallback } from 'react'
import { Search, Filter, Star, AlertCircle, RefreshCw, Gift, Users, TrendingUp, Zap, Building } from 'lucide-react'
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

// ✅ UPDATED: Categories matching your curated company list
interface Filters {
  searchTerm: string
  category: string
  sortBy: string
}

const DEAL_CATEGORIES = [
  { value: 'all', label: 'All Deals', icon: Gift },
  { value: 'crypto_exchange', label: 'Crypto Exchanges', icon: Zap },
  { value: 'prop_firm', label: 'Prop Trading Firms', icon: Building },
  { value: 'trading_tool', label: 'Trading Tools', icon: Star },
  { value: 'multi_asset', label: 'Multi Asset Platforms', icon: TrendingUp },
]

// ✅ UPDATED: Category descriptions for better UX
const CATEGORY_INFO = {
  crypto_exchange: {
    title: 'Crypto Exchange Deals',
    description: 'Exclusive bonuses from leading cryptocurrency exchanges',
    companies: ['Binance', 'Bybit', 'KuCoin', 'Crypto.com', 'Coinbase', 'OKX']
  },
  prop_firm: {
    title: 'Prop Trading Firm Deals', 
    description: 'Funded account challenges and prop firm bonuses',
    companies: ['DayTraders', 'FundingTicks', 'The Legends Trading', 'Funded Futures Network', 'BlueSkyPro']
  },
  trading_tool: {
    title: 'Trading Tools & Software',
    description: 'Professional charting and analysis platform discounts',
    companies: ['TradingView']
  },
  multi_asset: {
    title: 'Multi Asset Trading Platforms',
    description: 'Platforms supporting stocks, crypto, ETFs and more',
    companies: ['eToro']
  }
}

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

  // ✅ UPDATED: Category statistics
  const categoryStats = useMemo(() => {
    const stats = new Map()
    
    DEAL_CATEGORIES.forEach(category => {
      if (category.value === 'all') {
        stats.set('all', deals.length)
      } else {
        const count = deals.filter(deal => deal.company?.category === category.value).length
        stats.set(category.value, count)
      }
    })
    
    return stats
  }, [deals])

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
        
        {/* ✅ UPDATED: Header with focus on curated platforms */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text mb-4">
            Trading Deals & Exclusive Bonuses
          </h1>
          <p className="text-xl text-textSecondary mb-2">
            Curated offers from top crypto exchanges, prop firms, and trading platforms
          </p>
          <p className="text-textSecondary">
            13 vetted platforms • Real community ratings • Updated daily
          </p>
        </div>

        {/* ✅ UPDATED: Enhanced stats with category breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-6 rounded-xl border border-blue-500/20">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-6 h-6 text-blue-500" />
              <div>
                <div className="text-2xl font-bold text-text">{categoryStats.get('crypto_exchange') || 0}</div>
                <div className="text-textSecondary text-sm">Crypto Exchanges</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 p-6 rounded-xl border border-green-500/20">
            <div className="flex items-center gap-3 mb-2">
              <Building className="w-6 h-6 text-green-500" />
              <div>
                <div className="text-2xl font-bold text-text">{categoryStats.get('prop_firm') || 0}</div>
                <div className="text-textSecondary text-sm">Prop Firms</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 p-6 rounded-xl border border-purple-500/20">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-6 h-6 text-purple-500" />
              <div>
                <div className="text-2xl font-bold text-text">{categoryStats.get('trading_tool') || 0}</div>
                <div className="text-textSecondary text-sm">Trading Tools</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 p-6 rounded-xl border border-orange-500/20">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-orange-500" />
              <div>
                <div className="text-2xl font-bold text-text">{categoryStats.get('multi_asset') || 0}</div>
                <div className="text-textSecondary text-sm">Multi Asset</div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ UPDATED: Enhanced category filter with counts */}
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
                    {category.label} {category.value !== 'all' && `(${categoryStats.get(category.value) || 0})`}
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

          {/* ✅ NEW: Category quick filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {DEAL_CATEGORIES.map((category) => {
              const Icon = category.icon
              const count = categoryStats.get(category.value) || 0
              const isActive = filters.category === category.value
              
              return (
                <button
                  key={category.value}
                  onClick={() => handleFilterChange('category', category.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-primary text-white' 
                      : 'bg-background text-textSecondary hover:bg-surface hover:text-text border border-border'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                  {category.value !== 'all' && (
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-white/20' : 'bg-textSecondary/10'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* ✅ UPDATED: Category description when filtered */}
        {filters.category !== 'all' && CATEGORY_INFO[filters.category as keyof typeof CATEGORY_INFO] && (
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 mb-8 border border-primary/10">
            <h3 className="text-lg font-semibold text-text mb-2">
              {CATEGORY_INFO[filters.category as keyof typeof CATEGORY_INFO].title}
            </h3>
            <p className="text-textSecondary mb-3">
              {CATEGORY_INFO[filters.category as keyof typeof CATEGORY_INFO].description}
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_INFO[filters.category as keyof typeof CATEGORY_INFO].companies.map((company) => (
                <span key={company} className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                  {company}
                </span>
              ))}
            </div>
          </div>
        )}

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

        {/* ✅ UPDATED: Community trust with platform focus */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold text-text">Curated Trading Platforms</h3>
          </div>
          <p className="text-textSecondary max-w-2xl mx-auto mb-4">
            13 handpicked platforms across crypto exchanges, prop firms, and trading tools. 
            Every company is verified, regulated, and trusted by our trading community.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-textSecondary">
            <span>✓ 6 Crypto Exchanges</span>
            <span>✓ 5 Prop Firms</span>
            <span>✓ Professional Tools</span>
            <span>✓ Real Reviews</span>
          </div>
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