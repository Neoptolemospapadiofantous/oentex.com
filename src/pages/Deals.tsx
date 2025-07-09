// src/pages/Deals.tsx (Fixed - Proper State Handling)
import React, { useState, useCallback, useMemo } from 'react'
import { useAuth } from '../lib/authContext'
import { RatingModal } from '../components/rating/RatingModal'
import { AuthModal } from '../components/auth/AuthModals'
import { DealsFilters } from '../components/deals/DealsFilters'
import { DealsList } from '../components/deals/DealsList'
import { DealsStats } from '../components/deals/DealsStats'
import { DealsSkeleton } from '../components/ui/SkeletonLoader'
import { AuthErrorBoundary } from '../components/ui/AuthErrorBoundary'
import { 
  useDealsQuery, 
  useCompanyRatingsQuery, 
  useUserRatingsQuery, 
  useUpdateDealClickMutation 
} from '../hooks/queries/useDealsQuery'
import { useErrorHandler } from '../hooks/useErrorHandler'
import { usePersistedState } from '../hooks/usePersistedState'
import { DealWithRating, DealFilters } from '../types/deals'
import { AlertCircle, RefreshCw } from 'lucide-react'

const Deals: React.FC = () => {
  const { 
    user, 
    loading: authLoading, 
    error: authError, 
    initialized,
    isFullyReady 
  } = useAuth()
  
  const { handleError } = useErrorHandler()
  
  // Persisted filters
  const [filters, setFilters] = usePersistedState<DealFilters>('deals-filters', {
    searchTerm: '',
    category: 'all',
    sortBy: 'rating'
  })
  
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot-password'>('login')
  const [selectedDeal, setSelectedDeal] = useState<DealWithRating | null>(null)

  // FIXED: Use isFullyReady instead of initialized for better state management
  const shouldShowLoading = useMemo(() => {
    return authLoading || !initialized || !isFullyReady
  }, [authLoading, initialized, isFullyReady])

  // FIXED: Show loading state until auth is fully ready
  if (shouldShowLoading) {
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
              {authLoading ? 'Loading authentication...' : 
               !initialized ? 'Initializing app...' : 
               'Preparing deals page...'}
            </p>
          </div>
          <DealsSkeleton />
        </div>
      </div>
    )
  }

  // FIXED: Show auth error boundary only for critical errors
  if (authError && !isFullyReady) {
    return <AuthErrorBoundary error={authError} />
  }

  // FIXED: Now that auth is ready, we can safely run queries
  const { 
    data: dealsData, 
    isLoading: dealsLoading, 
    error: dealsError,
    refetch: refetchDeals 
  } = useDealsQuery()
  
  const deals = dealsData?.deals || []
  const companies = dealsData?.companies || []
  
  // Get company IDs for rating queries
  const companyIds = useMemo(() => 
    [...new Set(deals.map(deal => deal.company?.id).filter(Boolean))] as string[],
    [deals]
  )

  // FIXED: Only fetch ratings when we have company IDs and auth is ready
  const { 
    data: companyRatings = {}, 
    isLoading: ratingsLoading,
    error: ratingsError 
  } = useCompanyRatingsQuery(companyIds)
  
  const { 
    data: userRatings = new Map(), 
    isLoading: userRatingsLoading,
    error: userRatingsError 
  } = useUserRatingsQuery(user?.id, companyIds)

  // Mutations
  const updateDealClickMutation = useUpdateDealClickMutation()

  // FIXED: Better error handling for data queries
  const hasDataErrors = useMemo(() => {
    return !!(dealsError || ratingsError || userRatingsError)
  }, [dealsError, ratingsError, userRatingsError])

  // FIXED: More precise loading state for data
  const isDataLoading = useMemo(() => {
    return dealsLoading || (companyIds.length > 0 && ratingsLoading)
  }, [dealsLoading, companyIds.length, ratingsLoading])

  // Combine deals with rating data
  const dealsWithRatings = useMemo(() => {
    if (deals.length === 0) return []
    
    return deals.map(deal => {
      if (!deal.company?.id) return deal

      const companyRating = companyRatings[deal.company.id] || { 
        averageRating: deal.company.overall_rating || 0, 
        totalRatings: deal.company.total_reviews || 0 
      }
      
      const userRating = userRatings.get(deal.company.id) || null

      return {
        ...deal,
        companyRating,
        userRating
      }
    })
  }, [deals, companyRatings, userRatings])

  // Filter deals
  const filteredDeals = useMemo(() => {
    let filtered = [...dealsWithRatings]

    // Search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(deal => 
        deal.title.toLowerCase().includes(searchLower) ||
        deal.company_name.toLowerCase().includes(searchLower) ||
        deal.description.toLowerCase().includes(searchLower)
      )
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(deal => deal.category === filters.category)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'rating':
          return (b.companyRating?.averageRating || 0) - (a.companyRating?.averageRating || 0)
        case 'popularity':
          return b.click_count - a.click_count
        case 'newest':
          return new Date(b.id).getTime() - new Date(a.id).getTime()
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

    setSelectedDeal(deal)
    setShowRatingModal(true)
  }, [user])

  const handleTrackClick = useCallback((deal: DealWithRating) => {
    if (!deal.id) return
    
    updateDealClickMutation.mutate(deal.id, {
      onError: (error) => {
        handleError(error)
      }
    })
  }, [updateDealClickMutation, handleError])

  const handleRatingSubmitted = useCallback(() => {
    setShowRatingModal(false)
    setSelectedDeal(null)
  }, [])

  const handleFilterChange = useCallback((key: keyof DealFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [setFilters])

  const handleRetry = useCallback(() => {
    refetchDeals()
  }, [refetchDeals])

  // Calculate stats
  const stats = useMemo(() => {
    if (filteredDeals.length === 0) {
      return { averageRating: 0, totalClaims: 0 }
    }

    const averageRating = Math.round(
      filteredDeals.reduce((sum, deal) => 
        sum + (deal.companyRating?.averageRating || deal.company?.overall_rating || deal.rating || 0), 0
      ) / filteredDeals.length * 10
    ) / 10

    const totalClaims = filteredDeals.reduce((sum, deal) => sum + deal.click_count, 0)

    return { averageRating, totalClaims }
  }, [filteredDeals])

  // FIXED: Handle data errors gracefully
  if (hasDataErrors) {
    const primaryError = dealsError || ratingsError || userRatingsError
    
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-800 mb-4">
              Error Loading Deals
            </h2>
            <p className="text-red-700 mb-6">
              {(primaryError as Error)?.message || 'An unexpected error occurred'}
            </p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={handleRetry}
                className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // FIXED: Show loading state for data queries
  if (isDataLoading) {
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
              {dealsLoading ? 'Loading deals...' : 
               ratingsLoading ? 'Loading ratings...' : 
               'Loading data...'}
            </p>
          </div>
          <DealsSkeleton />
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
            Exclusive Trading <span className="text-primary">Deals</span>
          </h1>
          <p className="text-xl text-textSecondary max-w-3xl mx-auto">
            Discover the best deals and bonuses from top-rated trading platforms. 
            Get exclusive offers available only through our platform.
          </p>
          {userRatingsLoading && (
            <p className="text-sm text-primary mt-2 animate-pulse">
              Loading personalized ratings...
            </p>
          )}
        </div>

        {/* Filters */}
        <DealsFilters
          searchTerm={filters.searchTerm}
          setSearchTerm={(term) => handleFilterChange('searchTerm', term)}
          selectedCategory={filters.category}
          setSelectedCategory={(category) => handleFilterChange('category', category)}
          sortBy={filters.sortBy}
          setSortBy={(sort) => handleFilterChange('sortBy', sort)}
        />

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-textSecondary">
            Showing {filteredDeals.length} of {dealsWithRatings.length} deals
          </p>
          {companies.length > 0 && (
            <p className="text-textSecondary text-sm">
              From {companies.length} trading platforms
            </p>
          )}
        </div>

        {/* No Results */}
        {filteredDeals.length === 0 && !isDataLoading && (
          <div className="text-center py-12">
            <p className="text-textSecondary text-lg mb-4">
              No deals found matching your criteria.
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

        {/* Deals List */}
        {filteredDeals.length > 0 && (
          <div className="mb-12">
            <DealsList
              deals={filteredDeals}
              onRateClick={handleRateClick}
              onTrackClick={handleTrackClick}
              searchTerm={filters.searchTerm}
              selectedCategory={filters.category}
            />
          </div>
        )}

        {/* Stats */}
        <DealsStats
          filteredDealsCount={filteredDeals.length}
          totalDealsCount={dealsWithRatings.length}
          companiesCount={companies.length}
          averageRating={stats.averageRating}
          totalClaims={stats.totalClaims}
        />
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