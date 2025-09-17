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

  // Pagination
  const pageLimit = 12
  const paginatedQuery = usePaginatedDealsQuery(currentPage, pageLimit, {
    searchTerm: debouncedSearchTerm,
    category: filters.category,
    sortBy: filters.sortBy
  })
  
  const deals = paginatedQuery.data?.deals || []
  const companies = paginatedQuery.data?.companies || []
  const totalCount = paginatedQuery.data?.totalCount || 0
  
  const categoriesQuery = useCategoriesQuery()
  const categories = categoriesQuery.data || []

  const companyIds = useMemo(() => 
    deals.map(deal => deal.company?.id).filter(Boolean) as string[], 
    [deals]
  )
  const userRatingsQuery = useUserRatingsQuery(user?.id, companyIds)

  const categoryStatsQuery = useCategoryStatsQuery(deals)
  const categoryStats = categoryStatsQuery.data || new Map()
  
  const categoryInfoQuery = useCategoryInfoQuery(companies)
  const categoryInfo = categoryInfoQuery.data || new Map()

  const updateDealClickMutation = useUpdateDealClickMutation()

  // Enhanced deals with user ratings
  const dealsWithUserRatings = useMemo(() => {
    const userRatings = userRatingsQuery.data || {}
    
    return deals.map(deal => ({
      ...deal,
      userRating: deal.company?.id ? userRatings[deal.company.id] : undefined
    } as any))
  }, [deals, userRatingsQuery.data])

  // Pagination calculations
  const totalPages = Math.ceil(totalCount / pageLimit)
  const hasNextPage = currentPage < totalPages
  const hasPrevPage = currentPage > 1

  // Selected category info
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

  const handleRetry = useCallback(() => {
    paginatedQuery.refetch()
    categoriesQuery.refetch()
  }, [paginatedQuery, categoriesQuery])

  // Error states
  if (categoriesQuery.error) {
    return (
      <ErrorStateComponent 
        isDashboard={isDashboardContext}
        icon={Icons.database}
        title="Categories Not Available"
        description="Categories table not found. Please run the SQL script to create the categories table."
        actionLabel="Retry Connection"
        onAction={handleRetry}
        colorScheme="danger"
      />
    )
  }

  // Loading state
  const isLoading = !isFullyReady || paginatedQuery.isLoading || categoriesQuery.isLoading

  if (isLoading) {
    return (
      <PageWrapper isDashboard={isDashboardContext}>
        <HeaderSection 
          companiesCount={companies.length} 
          categoriesCount={categories.length - 1}
          isDashboard={isDashboardContext}
          isLoading={true}
        />
        <DealsSkeleton />
      </PageWrapper>
    )
  }

  // Deals error state
  if (paginatedQuery.error) {
    return (
      <ErrorStateComponent 
        isDashboard={isDashboardContext}
        icon={Icons.warning}
        title="Unable to Load Deals"
        description={paginatedQuery.error instanceof Error ? paginatedQuery.error.message : 'Failed to load deals'}
        actionLabel="Try Again"
        onAction={handleRetry}
        colorScheme="warning"
      />
    )
  }

  // No categories state
  if (!categories.length) {
    return (
      <ErrorStateComponent 
        isDashboard={isDashboardContext}
        icon={Icons.database}
        title="No Categories Found"
        description="The categories table exists but contains no data. Please add categories to the database."
        actionLabel="Reload Categories"
        onAction={handleRetry}
        colorScheme="default"
      />
    )
  }

  // Main content
  const mainContent = (
    <PageWrapper isDashboard={isDashboardContext}>
      
      {/* Header Section */}
      <HeaderSection 
        companiesCount={companies.length} 
        categoriesCount={categories.length - 1}
        isDashboard={isDashboardContext}
      />

      {/* FIXED: Filters Section - Proper theme spacing and icon alignment */}
      <FiltersSection
        filters={filters}
        categories={categories}
        categoryStats={categoryStats}
        onFilterChange={handleFilterChange}
      />

      {/* Category Description */}
      {selectedCategoryInfo && (
        <CategoryInfoSection categoryInfo={selectedCategoryInfo} />
      )}

      {/* No Results */}
      {dealsWithUserRatings.length === 0 && !paginatedQuery.isLoading && (
        <NoResultsSection 
          searchTerm={filters.searchTerm}
          selectedCategory={filters.category}
          onClearFilters={() => {
            setFilters({ searchTerm: '', category: 'all', sortBy: 'rating' })
            setCurrentPage(1)
          }}
        />
      )}

      {/* Deal Cards */}
      {dealsWithUserRatings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl my-4xl animate-fade-in-up">
          {dealsWithUserRatings.map((deal, index) => (
            <div 
              key={deal.id} 
              className="animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <UnifiedDealCard
                deal={deal}
                onRateClick={handleRateClick}
                onTrackClick={handleTrackClick}
                isGuest={!user}
                showRatingButton={!!user}
              />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <PaginationSection
          currentPage={currentPage}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          onPageChange={handlePageChange}
        />
      )}

      {/* Results Info */}
      {dealsWithUserRatings.length > 0 && (
        <div className="text-center text-foreground/70 text-sm mb-2xl">
          Showing {((currentPage - 1) * pageLimit) + 1} to {Math.min(currentPage * pageLimit, totalCount)} of {totalCount} deals
        </div>
      )}

      {/* Footer Stats */}
      <FooterSection 
        companiesCount={companies.length}
        categories={categories}
        categoryStats={categoryStats}
        totalCount={totalCount}
      />

      {/* Modals */}
      {showRatingModal && selectedDeal && user && (
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

      {showAuthModal && !user && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode={authMode}
          onModeChange={setAuthMode}
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
      <p className="text-xl text-foreground/70 mb-xl text-center">
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
  categories: any[]
  categoryStats: Map<string, number>
  onFilterChange: (key: keyof Filters, value: string) => void
}> = ({ filters, categories, categoryStats, onFilterChange }) => (
  <div className="glass-enhanced rounded-2xl border border-divider/40 mb-2xl shadow-enhanced backdrop-blur-strong animate-slide-in-left">
    <div className="container-p-3xl">
      {/* FIXED: Search and Sort Row - Proper icon spacing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-2xl">
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
        {categories.map((category, index) => {
          const count = categoryStats.get(category.value) || 0
          const isActive = filters.category === category.value
          
          return (
            <button
              key={category.value}
              onClick={() => onFilterChange('category', category.value)}
              className={`relative overflow-hidden gap-md flex items-center px-lg py-md text-sm font-medium transition-all duration-300 rounded-full animate-scale-in ${
                isActive 
                  ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-enhanced animate-glow-pulse' 
                  : 'bg-content2/50 text-foreground/80 border border-divider/50 hover:border-primary/30 hover:bg-content2/70'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="relative z-10">{category.label}</span>
              {category.value !== 'all' && (
                <span className={`relative z-10 text-xs font-bold px-sm py-xs rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary-foreground/20 text-primary-foreground' 
                    : 'bg-foreground/10 text-foreground/70'
                }`}>
                  {count}
                </span>
              )}
              
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent animate-shimmer" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  </div>
)

const CategoryInfoSection: React.FC<{
  categoryInfo: {
    title: string
    description: string
    companies: string[]
    count: number
  }
}> = ({ categoryInfo }) => (
  <div className="bg-gradient-to-r from-primary/15 via-primary/8 to-secondary/15 rounded-xl container-p-lg mb-xl border border-primary/30 shadow-enhanced backdrop-blur-sm animate-slide-in-bottom">
    <h3 className="text-lg font-semibold text-foreground mb-md">
      {categoryInfo.title}
    </h3>
    <p className="text-foreground/70 mb-lg">
      {categoryInfo.description}
    </p>
    <div className="flex flex-wrap gap-md">
      {categoryInfo.companies.slice(0, 8).map((company: string, index) => (
        <span 
          key={company} 
          className="bg-primary/20 text-primary container-px-md container-py-sm rounded-lg text-sm border border-primary/30 animate-scale-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {company}
        </span>
      ))}
      {categoryInfo.companies.length > 8 && (
        <span className="text-foreground/70 text-sm animate-fade-in">
          +{categoryInfo.companies.length - 8} more
        </span>
      )}
    </div>
  </div>
)

const NoResultsSection: React.FC<{
  searchTerm: string
  selectedCategory: string
  onClearFilters: () => void
}> = ({ searchTerm, selectedCategory, onClearFilters }) => (
  <div className="text-center py-4xl animate-fade-in-up">
    <Icons.gift className="w-16 h-16 text-foreground/40 mx-auto mb-xl animate-float" />
    <h3 className="text-lg font-medium text-foreground mb-md">No deals found</h3>
    <p className="text-foreground/70 mb-2xl">
      {searchTerm || selectedCategory !== 'all' 
        ? 'Try adjusting your search or filter criteria'
        : 'No deals are currently available. Check back soon!'
      }
    </p>
    <button
      onClick={onClearFilters}
      className="btn-enhanced bg-primary text-primary-foreground px-xl py-md rounded-lg hover:bg-primary/90 transition-all duration-300 font-medium hover:scale-105"
    >
      Clear Filters
    </button>
  </div>
)

const PaginationSection: React.FC<{
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  onPageChange: (page: number) => void
}> = ({ currentPage, totalPages, hasNextPage, hasPrevPage, onPageChange }) => (
  <div className="flex items-center justify-center gap-xl my-4xl animate-fade-in-up">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={!hasPrevPage}
      className="inline-flex items-center gap-sm bg-content2/50 text-foreground px-xl py-md rounded-lg hover:bg-content2/70 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed card-hover-enhanced focus-enhanced"
    >
      <Icons.chevronLeft className="w-4 h-4" />
      Previous
    </button>
    
    <div className="flex items-center gap-xl">
      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        const pageNum = i + 1
        const isActive = pageNum === currentPage
        
        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 card-hover-enhanced focus-enhanced ${
              isActive 
                ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-enhanced' 
                : 'bg-content2/50 text-foreground hover:bg-content2/70'
            }`}
          >
            {pageNum}
          </button>
        )
      })}
      
      {totalPages > 5 && (
        <>
          <span className="text-foreground/50">...</span>
          <button
            onClick={() => onPageChange(totalPages)}
            className="w-10 h-10 bg-content2/50 text-foreground rounded-lg hover:bg-content2/70 transition-all duration-300 font-medium card-hover-enhanced focus-enhanced"
          >
            {totalPages}
          </button>
        </>
      )}
    </div>
    
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={!hasNextPage}
      className="inline-flex items-center gap-sm bg-content2/50 text-foreground px-xl py-md rounded-lg hover:bg-content2/70 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed card-hover-enhanced focus-enhanced"
    >
      Next
      <Icons.chevronRight className="w-4 h-4" />
    </button>
  </div>
)

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
      <h3 className="text-xl font-semibold text-foreground">Curated Trading Platforms</h3>
    </div>
    <div className="flex flex-col items-center justify-center">
      <p className="text-foreground/70 max-w-3xl mx-auto my-2xl text-center text-lg leading-relaxed">
        {companiesCount} handpicked platforms across {categories.filter(cat => cat.value !== 'all' && (categoryStats.get(cat.value) || 0) > 0).length} categories. 
        Every company is verified, regulated, and trusted by our trading community.
      </p>
    </div>
    <div className="flex flex-wrap items-center justify-center gap-lg text-sm text-foreground/70">
      {categories
        .filter(cat => cat.value !== 'all')
        .filter(cat => (categoryStats.get(cat.value) || 0) > 0)
        .slice(0, 3)
        .map((category, index) => {
          const count = categoryStats.get(category.value) || 0
          return (
            <span 
              key={category.value} 
              className="flex items-center gap-xs bg-content2/50 px-3 py-2 rounded-full border border-divider/30 animate-scale-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <span className="text-success">✓</span>
              <span>{count} {category.label}</span>
            </span>
          )
        })}
      <span className="flex items-center gap-xs bg-content2/50 px-3 py-2 rounded-full border border-divider/30 animate-scale-in" style={{ animationDelay: '600ms' }}>
        <span className="text-success">✓</span>
        <span>Real Reviews</span>
      </span>
    </div>
  </div>
)

const ErrorStateComponent: React.FC<{
  isDashboard: boolean
  icon: React.ComponentType<any>
  title: string
  description: string
  actionLabel: string
  onAction: () => void
  colorScheme: 'danger' | 'warning' | 'default'
}> = ({ isDashboard, icon: Icon, title, description, actionLabel, onAction, colorScheme }) => (
  <PageWrapper isDashboard={isDashboard}>
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center animate-fade-in-up">
        <Icon className={`w-12 h-12 mx-auto mb-xl ${
          colorScheme === 'danger' ? 'text-danger' : 
          colorScheme === 'warning' ? 'text-warning' : 
          'text-foreground/40'
        }`} />
        <h2 className="text-xl font-semibold text-foreground mb-md">{title}</h2>
        <p className="text-foreground/70 mb-2xl max-w-md mx-auto">
          {description}
        </p>
        <button
          onClick={onAction}
          className={`btn-enhanced inline-flex items-center gap-sm px-xl py-md rounded-lg transition-all duration-300 font-medium hover:scale-105 focus-enhanced ${
            colorScheme === 'danger' ? 'bg-danger text-danger-foreground hover:bg-danger/90' :
            colorScheme === 'warning' ? 'bg-warning text-warning-foreground hover:bg-warning/90' :
            'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          <Icons.refresh className="w-4 h-4" />
          {actionLabel}
        </button>
      </div>
    </div>
  </PageWrapper>
)

export default Deals