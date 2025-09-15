// src/pages/auth/Deals.tsx - AUTHENTICATED VERSION FOR DASHBOARD
import React, { useState, useMemo, useCallback } from 'react'
import { Icons } from '@components/icons'
import { useAuth } from '../../lib/authContext'
import { DealCard } from '@components/deals/DealCard'
import { RatingModal } from '@components/rating/RatingModal'
import { 
  useDealsQuery, 
  useUserRatingsQuery, 
  useUpdateDealClickMutation,
  useSubmitRatingMutation 
} from '../../hooks/queries/useDealsQuery'
import { 
  useCategoriesQuery, 
  useCategoryStatsQuery, 
  useCategoryInfoQuery 
} from '../../hooks/queries/useCategoriesQuery'

interface Filters {
  searchTerm: string
  category: string
  sortBy: string
}

const Deals = () => {
  const { user, isFullyReady } = useAuth()
  
  // ✅ AUTHENTICATED: Always use dashboard layout (no top padding needed)
  const containerClasses = "min-h-screen bg-gray-50"

  // ✅ DYNAMIC: All data from React Query
  const dealsQuery = useDealsQuery()
  const deals = dealsQuery.data?.deals || []
  const companies = dealsQuery.data?.companies || []
  
  // ✅ CRITICAL: Categories from dedicated categories table
  const categoriesQuery = useCategoriesQuery()
  const categories = categoriesQuery.data || []

  const companyIds = useMemo(() => 
    deals.map(deal => deal.company?.id).filter(Boolean) as string[], 
    [deals]
  )
  const userRatingsQuery = useUserRatingsQuery(user?.id, companyIds)

  // ✅ DYNAMIC: Category statistics and info
  const categoryStatsQuery = useCategoryStatsQuery(deals)
  const categoryStats = categoryStatsQuery.data || new Map()
  
  const categoryInfoQuery = useCategoryInfoQuery(companies)
  const categoryInfo = categoryInfoQuery.data || new Map()

  // ✅ MODERN: Mutations for updates
  const updateDealClickMutation = useUpdateDealClickMutation()
  const submitRatingMutation = useSubmitRatingMutation()

  // ✅ UI State
  const [filters, setFilters] = useState<Filters>({
    searchTerm: '',
    category: 'all',
    sortBy: 'rating'
  })
  const [selectedDeal, setSelectedDeal] = useState<any>(null)
  const [showRatingModal, setShowRatingModal] = useState(false)

  // ✅ COMPUTED: Deals with user ratings
  const dealsWithUserRatings = useMemo(() => {
    const userRatings = userRatingsQuery.data || new Map()
    
    return deals.map(deal => ({
      ...deal,
      userRating: deal.company?.id ? userRatings.get(deal.company.id) : undefined
    }))
  }, [deals, userRatingsQuery.data])

  // ✅ FILTERED: Deals based on filters
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

  // ✅ DYNAMIC: Selected category info
  const selectedCategoryInfo = useMemo(() => {
    if (filters.category === 'all') return null
    
    const category = categories.find(cat => cat.value === filters.category)
    const info = categoryInfo.get(filters.category)
    
    return {
      title: category?.label || 'Category Deals',
      description: category?.description || 'Exclusive deals in this category',
      companies: info?.companies || [],
      count: info?.count || 0
    }
  }, [filters.category, categories, categoryInfo])

  // ✅ EVENT HANDLERS
  const handleFilterChange = useCallback((key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const handleRateClick = useCallback((deal: any) => {
    if (!deal.company) return
    setSelectedDeal(deal)
    setShowRatingModal(true)
  }, [])

  const handleTrackClick = useCallback(async (deal: any) => {
    try {
      await updateDealClickMutation.mutateAsync(deal.id)
      window.open(deal.affiliate_link, '_blank', 'noopener,noreferrer')
    } catch (error) {
      console.error('Error tracking deal click:', error)
      window.open(deal.affiliate_link, '_blank', 'noopener,noreferrer')
    }
  }, [updateDealClickMutation])

  const handleRatingSubmitted = useCallback(() => {
    setShowRatingModal(false)
    setSelectedDeal(null)
  }, [])

  const handleRetry = useCallback(() => {
    dealsQuery.refetch()
    categoriesQuery.refetch()
  }, [dealsQuery, categoriesQuery])

  // ✅ ERROR STATES
  if (categoriesQuery.error) {
    return (
      <div className={containerClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <Icons.database className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Categories Not Available</h2>
              <p className="text-gray-600 mb-6">
                Categories table not found. Please run the SQL script to create the categories table.
              </p>
              <div className="space-y-2 text-sm text-gray-500 mb-6">
                <p>• Run the categories SQL in your Supabase SQL editor</p>
                <p>• Ensure the categories table has data</p>
                <p>• Check RLS policies allow public read access</p>
              </div>
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Icons.refresh className="w-4 h-4" />
                Retry Connection
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ✅ LOADING STATE
  const isLoading = !isFullyReady || dealsQuery.isLoading || categoriesQuery.isLoading

  if (isLoading) {
    return (
      <div className={containerClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Trading Deals & Bonuses</h1>
            <p className="text-xl text-gray-600">Loading exclusive offers with real-time ratings...</p>
          </div>
          
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <Icons.refresh className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading deals, categories, and community ratings...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ✅ DEALS ERROR STATE
  if (dealsQuery.error) {
    return (
      <div className={containerClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <Icons.warning className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Deals</h2>
              <p className="text-gray-600 mb-6">
                {dealsQuery.error instanceof Error ? dealsQuery.error.message : 'Failed to load deals'}
              </p>
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Icons.refresh className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ✅ NO CATEGORIES STATE
  if (!categories.length) {
    return (
      <div className={containerClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <Icons.database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Categories Found</h2>
              <p className="text-gray-600 mb-6">
                The categories table exists but contains no data. Please add categories to the database.
              </p>
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Icons.refresh className="w-4 h-4" />
                Reload Categories
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ✅ MAIN CONTENT
  return (
    <div className={containerClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Trading Deals & Exclusive Bonuses
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Curated offers from top platforms across {categories.length - 1} categories
          </p>
          <p className="text-gray-600">
            {companies.length} vetted platforms • Real community ratings • Updated daily
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="relative">
              <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search deals, companies..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-gray-900"
              />
            </div>

            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-gray-900"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label} {category.value !== 'all' && `(${categoryStats.get(category.value) || 0})`}
                </option>
              ))}
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-gray-900"
            >
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
              <option value="popular">Most Claimed</option>
              <option value="name">Company A-Z</option>
            </select>
          </div>

          {/* Category Quick Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon
              const count = categoryStats.get(category.value) || 0
              const isActive = filters.category === category.value
              
              return (
                <button
                  key={category.value}
                  onClick={() => handleFilterChange('category', category.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                  {category.value !== 'all' && (
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-white/20' : 'bg-gray-200'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Category Description */}
        {selectedCategoryInfo && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {selectedCategoryInfo.title}
            </h3>
            <p className="text-gray-600 mb-3">
              {selectedCategoryInfo.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedCategoryInfo.companies.slice(0, 8).map((company: string) => (
                <span key={company} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                  {company}
                </span>
              ))}
              {selectedCategoryInfo.companies.length > 8 && (
                <span className="text-gray-600 text-sm">
                  +{selectedCategoryInfo.companies.length - 8} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredDeals.length === 0 && deals.length > 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No deals found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => setFilters({ searchTerm: '', category: 'all', sortBy: 'rating' })}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Deal Cards */}
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

        {/* Footer */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 sm:p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icons.users className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Curated Trading Platforms</h3>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            {companies.length} handpicked platforms across {categories.filter(cat => cat.value !== 'all' && (categoryStats.get(cat.value) || 0) > 0).length} categories. 
            Every company is verified, regulated, and trusted by our trading community.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-gray-600">
            {categories
              .filter(cat => cat.value !== 'all')
              .filter(cat => (categoryStats.get(cat.value) || 0) > 0)
              .slice(0, 3)
              .map((category) => {
                const count = categoryStats.get(category.value) || 0
                return (
                  <span key={category.value} className="flex items-center gap-1">
                    <span className="text-green-500">✓</span>
                    <span>{count} {category.label}</span>
                  </span>
                )
              })}
            {categories.filter(cat => cat.value !== 'all' && (categoryStats.get(cat.value) || 0) > 0).length === 0 ? (
              <span className="flex items-center gap-1">
                <span className="text-green-500">✓</span>
                <span>Verified Companies</span>
              </span>
            ) : null}
            <span className="flex items-center gap-1">
              <span className="text-green-500">✓</span>
              <span>Real Reviews</span>
            </span>
          </div>
        </div>
        
        {/* Empty Deals State */}
        {deals.length === 0 && !dealsQuery.isLoading && (
          <div className="text-center py-12">
            <Icons.gift className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Deals Available</h3>
            <p className="text-gray-600 mb-6">
              No trading deals found. Please check back later or contact support.
            </p>
            <button
              onClick={handleRetry}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2 inline" />
              Reload Deals
            </button>
          </div>
        )}
      </div>

      {/* Rating Modal */}
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
    </div>
  )
}

export default Deals
