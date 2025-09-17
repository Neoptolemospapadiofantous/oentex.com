// src/pages/Deals.tsx - FIXED VERSION WITH PROPER THEME USAGE
import React, { useState, useMemo, useCallback } from 'react'
import { Icons } from '@components/icons'
import { useAuth } from '../../lib/authContext'
import { UnifiedDealCard } from '@components/deals/UnifiedDealCard'
import { RatingModal } from '@components/rating/RatingModal'
import { AuthModal } from '@components/auth/AuthModals'
import { 
  usePaginatedDealsQuery,
  useUserRatingsQuery, 
  useUpdateDealClickMutation
} from '../../hooks/queries/useDealsQuery'
import { useDebounce } from '../../hooks/useDebounce'
import { DealsSkeleton } from '@components/ui/LoadingSpinner'
import { 
  useCategoriesQuery, 
  useCategoryStatsQuery, 
  useCategoryInfoQuery 
} from '../../hooks/queries/useCategoriesQuery'
import GuestLayout from '../../layouts/GuestLayout'

interface Filters {
  searchTerm: string
  category: string
  sortBy: string
}

interface DealsProps {
  isInDashboard?: boolean
}

const Deals: React.FC<DealsProps> = ({ isInDashboard = false }) => {
  const { user, isFullyReady } = useAuth()

  // Determine layout context
  const isDashboardContext = isInDashboard || !!user

  // UI State
  const [filters, setFilters] = useState<Filters>({
    searchTerm: '',
    category: 'all',
    sortBy: 'rating'
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedDeal, setSelectedDeal] = useState<any>(null)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  // Debounced search with optimized delay
  const debouncedSearchTerm = useDebounce(filters.searchTerm, 300)

  // Data fetching
  const { data: dealsData, isLoading: dealsLoading, error: dealsError } = usePaginatedDealsQuery({
    page: currentPage,
    searchTerm: debouncedSearchTerm,
    category: filters.category,
    sortBy: filters.sortBy
  })

  const { data: categoriesData } = useCategoriesQuery()
  const { data: categoryStatsData } = useCategoryStatsQuery()
  const { data: categoryInfoData } = useCategoryInfoQuery()

  // User ratings for authenticated users
  const { data: userRatings } = useUserRatingsQuery(user?.id, {
    enabled: !!user
  })

  const updateDealClickMutation = useUpdateDealClickMutation()

  // Process data
  const deals = dealsData?.deals || []
  const totalCount = dealsData?.totalCount || 0
  const totalPages = dealsData?.totalPages || 0
  const categories = categoriesData?.categories || []
  const categoryStats = categoryStatsData?.categoryStats || new Map()
  const categoryInfo = categoryInfoData?.categoryInfo || new Map()

  // Calculate stats
  const companiesCount = useMemo(() => {
    const uniqueCompanies = new Set(deals.map(deal => deal.company?.id)).size
    return uniqueCompanies
  }, [deals])

  const categoriesCount = useMemo(() => {
    return categories.filter(cat => cat.value !== 'all' && (categoryStats.get(cat.value) || 0) > 0).length
  }, [categories, categoryStats])

  // Event handlers
  const handleFilterChange = useCallback((key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleRateClick = useCallback((deal: any) => {
    if (!user) {
      if (isDashboardContext) {
        console.warn('Unauthenticated user in dashboard context')
        return
      }
      setAuthMode('login')
      setShowAuthModal(true)
      return
    }

    if (!deal.company) return
    setSelectedDeal(deal)
    setShowRatingModal(true)
  }, [user, isDashboardContext])

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

  // Loading state
  if (!isFullyReady) {
    return <DealsSkeleton />
  }

  // Error state
  if (dealsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icons.error className="w-16 h-16 text-danger mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Error Loading Deals</h2>
          <p className="text-foreground/70">Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  // Main content
  const mainContent = (
    <PageWrapper isDashboard={isDashboardContext}>
      <HeaderSection 
        companiesCount={companiesCount}
        categoriesCount={categoriesCount}
        isDashboard={isDashboardContext}
        isLoading={dealsLoading}
      />
      
      <FiltersSection 
        filters={filters}
        onFilterChange={handleFilterChange}
        categories={categories}
        categoryStats={categoryStats}
      />

      {filters.category !== 'all' && (
        <CategoryInfoSection 
          category={filters.category}
          categories={categories}
          categoryInfo={categoryInfo}
        />
      )}

      {dealsLoading ? (
        <DealsSkeleton />
      ) : deals.length === 0 ? (
        <NoResultsSection 
          searchTerm={filters.searchTerm}
          category={filters.category}
          onClearFilters={() => setFilters({ searchTerm: '', category: 'all', sortBy: 'rating' })}
        />
      ) : (
        <>
          <div className="grid-deals">
            {deals.map((deal) => (
              <UnifiedDealCard
                key={deal.id}
                deal={deal}
                userRating={userRatings?.find(r => r.company_id === deal.company?.id)}
                onRateClick={() => handleRateClick(deal)}
                onTrackClick={() => handleTrackClick(deal)}
                isAuthenticated={!!user}
                showAuthModal={() => {
                  setAuthMode('login')
                  setShowAuthModal(true)
                }}
              />
            ))}
          </div>

          <PaginationSection
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <FooterSection 
        companiesCount={companiesCount}
        categories={categories}
        categoryStats={categoryStats}
        totalCount={totalCount}
      />

      {/* Modals */}
      {showRatingModal && selectedDeal && (
        <RatingModal
          deal={selectedDeal}
          onClose={() => setShowRatingModal(false)}
          onSubmitted={handleRatingSubmitted}
        />
      )}

      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSwitchMode={(mode) => setAuthMode(mode)}
        />
      )}
    </PageWrapper>
  )

  // Return with appropriate layout wrapper
  return isDashboardContext ? mainContent : <GuestLayout hideFooter={true}>{mainContent}</GuestLayout>
}

// FIXED: Sub-components with proper theme usage

const PageWrapper: React.FC<{ isDashboard: boolean; children: React.ReactNode }> = ({ 
  isDashboard, 
  children 
}) => (
  <div className={`min-h-screen ${isDashboard ? '' : 'background-enhanced'}`}>
    <div className={isDashboard ? 'container-p-sm md:container-p-md lg:container-p-lg' : 'container-page section-px-lg section-py-xl'}>
      {children}
    </div>
  </div>
)

const HeaderSection: React.FC<{
  companiesCount: number
  categoriesCount: number
  isDashboard: boolean
  isLoading?: boolean
}> = ({ companiesCount, categoriesCount, isDashboard, isLoading = false }) => (
  <div className="text-center mb-6xl animate-fade-in-up">
    <div className="glass-enhanced rounded-3xl container-p-2xl border border-divider/30 shadow-enhanced-lg">
      <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-3xl">
        <span className="gradient-text-animated">
          {isDashboard ? 'Browse Trading Platforms' : 'Trading Deals & Exclusive Bonuses'}
        </span>
      </h1>
      <p className={`text-foreground/70 mx-auto ${isDashboard ? 'text-sm mb-md' : 'text-xl mb-xl'}`}>
        {isLoading 
          ? 'Loading exclusive offers with real-time ratings...'
          : `Curated offers from top platforms across ${categoriesCount} categories`
        }
      </p>
      {!isLoading && (
        <p className="text-foreground/70">
          {companiesCount} vetted platforms • Real community ratings • Updated daily
        </p>
      )}
    </div>
  </div>
)

// FIXED: Filters section with proper icon spacing and theme usage
const FiltersSection: React.FC<{
  filters: Filters
  onFilterChange: (key: keyof Filters, value: string) => void
  categories: any[]
  categoryStats: Map<string, number>
}> = ({ filters, onFilterChange, categories, categoryStats }) => (
  <div className="glass-enhanced rounded-2xl container-p-2xl border border-divider/30 shadow-enhanced-lg mb-2xl animate-fade-in-up">
    <div className="flex items-center gap-md mb-lg">
      <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
        <Icons.filter className="w-4 h-4 text-white" />
      </div>
      <h2 className="text-xl font-bold text-foreground">Filter & Search</h2>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
      {/* FIXED: Search Input - Using theme padding system */}
      <div className="relative">
        <Icons.search className="absolute text-foreground/60 w-5 h-5 z-10" style={{ left: 'var(--heroui-padding-lg)', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          placeholder="Search deals, companies..."
          value={filters.searchTerm}
          onChange={(e) => onFilterChange('searchTerm', e.target.value)}
          className="w-full py-3 bg-content1 border border-divider/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none text-foreground text-base font-medium backdrop-blur-sm transition-all duration-300 hover:border-divider/70 hover:bg-content2 placeholder:text-foreground/60 h-12 focus-enhanced shadow-sm"
          style={{ paddingLeft: 'var(--heroui-padding-3xl)', paddingRight: 'var(--heroui-padding-md)' }}
        />
      </div>

      {/* FIXED: Category Filter - Using theme padding system */}
      <div className="relative">
        <Icons.filter className="absolute text-foreground/60 w-5 h-5 z-10" style={{ left: 'var(--heroui-padding-lg)', top: '50%', transform: 'translateY(-50%)' }} />
        <select
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="w-full py-3 bg-content1 border border-divider/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none text-foreground backdrop-blur-sm transition-all duration-300 hover:border-divider/70 hover:bg-content2 h-12 appearance-none focus-enhanced shadow-sm"
          style={{ paddingLeft: 'var(--heroui-padding-3xl)', paddingRight: 'var(--heroui-padding-2xl)' }}
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label} {category.value !== 'all' && `(${categoryStats.get(category.value) || 0})`}
            </option>
          ))}
        </select>
        <Icons.chevronDown className="absolute text-foreground/60 w-4 h-4 pointer-events-none" style={{ right: 'var(--heroui-padding-sm)', top: '50%', transform: 'translateY(-50%)' }} />
      </div>

      {/* FIXED: Sort By - Using theme padding system */}
      <div className="relative">
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange('sortBy', e.target.value)}
          className="w-full py-3 bg-content1 border border-divider/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none text-foreground backdrop-blur-sm transition-all duration-300 hover:border-divider/70 hover:bg-content2 h-12 appearance-none focus-enhanced shadow-sm"
          style={{ paddingLeft: 'var(--heroui-padding-md)', paddingRight: 'var(--heroui-padding-2xl)' }}
        >
          <option value="rating">Highest Rated</option>
          <option value="newest">Newest First</option>
          <option value="popular">Most Claimed</option>
          <option value="name">Company A-Z</option>
        </select>
        <Icons.chevronDown className="absolute text-foreground/60 w-4 h-4 pointer-events-none" style={{ right: 'var(--heroui-padding-sm)', top: '50%', transform: 'translateY(-50%)' }} />
      </div>
    </div>

    {/* FIXED: Category Quick Filters - Proper theme spacing */}
    <div className="flex flex-wrap gap-lg py-xl">
      {categories.slice(0, 6).map((category) => (
        <button
          key={category.value}
          onClick={() => onFilterChange('category', category.value)}
          className={`px-lg py-sm rounded-full text-sm font-medium transition-all duration-300 ${
            filters.category === category.value
              ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-enhanced animate-glow-pulse' 
              : 'bg-content2/50 text-foreground/80 border border-divider/50 hover:border-primary/30 hover:bg-content2/70'
          }`}
        >
          {category.label} {category.value !== 'all' && `(${categoryStats.get(category.value) || 0})`}
        </button>
      ))}
    </div>
  </div>
)

const CategoryInfoSection: React.FC<{
  category: string
  categories: any[]
  categoryInfo: Map<string, any>
}> = ({ category, categories, categoryInfo }) => {
  const categoryData = categories.find(cat => cat.value === category)
  const info = categoryInfo.get(category)
  
  if (!categoryData || !info) return null

  return (
    <div className="glass-enhanced rounded-2xl container-p-2xl border border-divider/30 shadow-enhanced-lg mb-2xl animate-fade-in-up">
      <div className="flex items-center gap-md mb-lg">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
          <Icons.chart className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-xl font-bold text-foreground">{categoryData.label}</h3>
      </div>
      <p className="text-foreground/70 mb-lg">{categoryData.description}</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{info.count}</div>
          <div className="text-sm text-foreground/70">Platforms</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary">{info.avgRating?.toFixed(1) || 'N/A'}</div>
          <div className="text-sm text-foreground/70">Avg Rating</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-warning">{info.totalReviews || 0}</div>
          <div className="text-sm text-foreground/70">Reviews</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-success">{info.activeDeals || 0}</div>
          <div className="text-sm text-foreground/70">Active Deals</div>
        </div>
      </div>
    </div>
  )
}

const NoResultsSection: React.FC<{
  searchTerm: string
  category: string
  onClearFilters: () => void
}> = ({ searchTerm, category, onClearFilters }) => (
  <div className="text-center py-3xl">
    <Icons.search className="w-16 h-16 text-foreground/40 mx-auto mb-lg" />
    <h3 className="text-2xl font-bold text-foreground mb-lg">No Results Found</h3>
    <p className="text-foreground/70 mb-2xl">
      {searchTerm 
        ? `No deals found for "${searchTerm}"${category !== 'all' ? ` in ${category}` : ''}`
        : `No deals found in ${category} category`
      }
    </p>
    <button
      onClick={onClearFilters}
      className="btn-primary container-px-xl container-py-md"
    >
      Clear Filters
    </button>
  </div>
)

const PaginationSection: React.FC<{
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  const pages = []
  const maxVisible = 5
  const start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
  const end = Math.min(totalPages, start + maxVisible - 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return (
    <div className="flex justify-center items-center gap-sm my-2xl">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn-secondary container-px-lg container-py-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icons.chevronLeft className="w-4 h-4" />
        Previous
      </button>
      
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`container-px-lg container-py-sm rounded-lg transition-all duration-300 ${
            page === currentPage
              ? 'bg-primary text-primary-foreground shadow-enhanced'
              : 'bg-content1 text-foreground hover:bg-content2'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn-secondary container-px-lg container-py-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
      Next
      <Icons.chevronRight className="w-4 h-4" />
    </button>
  </div>
)
}

const FooterSection: React.FC<{
  companiesCount: number
  categories: any[]
  categoryStats: Map<string, number>
  totalCount: number
}> = ({ companiesCount, categories, categoryStats }) => (
  <div className="glass-enhanced rounded-2xl container-p-2xl text-center shadow-enhanced-lg border border-divider/30 animate-fade-in-up background-enhanced">
    <div className="flex items-center justify-center gap-md my-xl">
      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-enhanced animate-float">
        <Icons.users className="w-6 h-6 text-white" />
      </div>
      <div className="text-left">
        <h3 className="text-2xl font-bold text-foreground">Join Our Community</h3>
        <p className="text-foreground/70">Share your experiences and help others make informed decisions</p>
      </div>
    </div>
    <div className="flex flex-col items-center justify-center">
      <p className="text-foreground/70 mx-auto text-center leading-relaxed my-lg text-sm">
        {companiesCount} handpicked platforms across {categories.filter(cat => cat.value !== 'all' && (categoryStats.get(cat.value) || 0) > 0).length} categories. 
        Every company is verified, regulated, and trusted by our trading community.
      </p>
    </div>
    <div className="flex flex-wrap items-center justify-center gap-lg text-sm text-foreground/70">
      {categories
        .filter(cat => cat.value !== 'all')
        .slice(0, 4)
        .map((category, index) => (
          <span 
            key={category.value} 
            className="flex items-center gap-xs bg-content2/50 px-3 py-2 rounded-full border border-divider/30 animate-scale-in"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <span className="text-primary">✓</span>
            <span>{category.label} ({categoryStats.get(category.value) || 0})</span>
          </span>
        ))}
      <span className="flex items-center gap-xs bg-content2/50 px-3 py-2 rounded-full border border-divider/30 animate-scale-in" style={{ animationDelay: '600ms' }}>
        <span className="text-success">✓</span>
        <span>Verified & Regulated</span>
      </span>
    </div>
  </div>
)

const ErrorStateComponent: React.FC<{
  error: any
  onRetry: () => void
}> = ({ error, onRetry }) => (
  <PageWrapper isDashboard={false}>
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center animate-fade-in-up">
        <Icons.error className="w-12 h-12 mx-auto mb-xl text-danger" />
        <h2 className="text-xl font-semibold text-foreground mb-md">Something went wrong</h2>
        <p className="text-foreground/70 mb-2xl max-w-md mx-auto">
          {error?.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={onRetry}
          className="btn-primary inline-flex items-center gap-sm px-xl py-md rounded-lg transition-all duration-300 font-medium hover:scale-105 focus-enhanced"
        >
          <Icons.refresh className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  </PageWrapper>
)

export default Deals