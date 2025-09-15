// src/pages/auth/MyDeals.tsx - ENHANCED PROFESSIONAL VERSION
import React, { useState, useMemo } from 'react'
import { Icons } from '@components/icons'
import { useAuth } from '../../lib/authContext'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { RatingModal } from '@components/rating/RatingModal'

interface Rating {
  id: string
  user_id: string
  company_id: string
  overall_rating?: number
  rating: number
  review: string
  created_at: string
  updated_at: string
}

// Enhanced Loading Skeleton Components
const StatCardSkeleton = () => (
  <div className="bg-content1/60 backdrop-blur-xl rounded-3xl container-p-lg border border-divider/30 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="flex-1 space-y-md">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 bg-content2 rounded-2xl"></div>
          <div className="w-16 h-6 bg-content2 rounded-lg"></div>
        </div>
        <div className="space-y-sm">
          <div className="w-20 h-8 bg-content2 rounded-lg"></div>
          <div className="w-32 h-4 bg-content2 rounded-md"></div>
        </div>
      </div>
    </div>
  </div>
)

const RatingCardSkeleton = () => (
  <div className="bg-content1/60 backdrop-blur-xl rounded-3xl container-p-lg border border-divider/30 animate-pulse">
    <div className="space-y-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-md">
          <div className="w-12 h-12 bg-content2 rounded-2xl"></div>
          <div className="space-y-sm">
            <div className="w-32 h-5 bg-content2 rounded-md"></div>
            <div className="w-24 h-4 bg-content2 rounded-md"></div>
          </div>
        </div>
        <div className="w-16 h-8 bg-content2 rounded-lg"></div>
      </div>
      <div className="w-full h-16 bg-content2 rounded-lg"></div>
      <div className="flex items-center justify-between">
        <div className="w-24 h-4 bg-content2 rounded-md"></div>
        <div className="w-20 h-8 bg-content2 rounded-lg"></div>
      </div>
    </div>
  </div>
)

// helper
function averageFromCategories(r: any): number {
  const nums = [
    r.platform_usability,
    r.customer_support,
    r.fees_commissions,
    r.security_trust,
    r.educational_resources,
    r.mobile_app,
  ].filter((n: number) => typeof n === 'number' && n > 0)
  if (!nums.length) return 0
  return Math.round((nums.reduce((s, n) => s + n, 0) / nums.length) * 10) / 10
}

const MyDeals: React.FC = () => {
  const { user } = useAuth()
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating' | 'company'>('newest')
  const [filterRating, setFilterRating] = useState<number | 'all'>('all')

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null)
  const [activeCompanyName, setActiveCompanyName] = useState<string>('')
  const [existingRating, setExistingRating] = useState<any>(null)
  const [activeCompanyStats, setActiveCompanyStats] = useState<{ averageRating: number; totalRatings: number } | undefined>(undefined)

  // 1) Fetch user's ratings directly
  const {
    data: myRatings = [],
    isLoading: ratingsLoading,
    error: ratingsError,
    refetch: refetchRatings
  } = useQuery({
    queryKey: ['my-ratings', user?.id],
    enabled: !!user?.id,
    queryFn: async (): Promise<Rating[]> => {
      const { data, error } = await supabase
        .from('ratings')
        .select('*')
        .eq('user_id', user!.id)
        .order('updated_at', { ascending: false })

      if (error) throw error

      return (data || []).map((r: any) => ({
        ...r,
        rating: r.overall_rating && r.overall_rating > 0 ? r.overall_rating : averageFromCategories(r),
      }))
    }
  })

  // 2) Fetch companies for rated items (include rating stats for modal header)
  const companyIds = useMemo(
    () => Array.from(new Set(myRatings.map(r => r.company_id))),
    [myRatings]
  )

  const {
    data: companies = [],
    isLoading: companiesLoading,
    error: companiesError,
    refetch: refetchCompanies
  } = useQuery({
    queryKey: ['my-rated-companies', companyIds.sort().join(',')],
    enabled: companyIds.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trading_companies')
        .select('id, name, slug, logo_url, category, overall_rating, total_reviews')
        .in('id', companyIds)
      if (error) throw error
      return data || []
    }
  })

  // 3) Merge ratings with company info
  const ratingsArray = useMemo(() => {
    const byId = new Map(companies.map((c: any) => [c.id, c]))
    return myRatings.map((r: any) => {
      const company = byId.get(r.company_id)
      return {
        ...r,
        company,
        company_name: company?.name || 'Unknown Company'
      }
    })
  }, [myRatings, companies])

  // 4) Filter + sort
  const filteredAndSortedRatings = useMemo(() => {
    let filtered = ratingsArray
    if (filterRating !== 'all') {
      filtered = filtered.filter(r => Number(r.rating) === Number(filterRating))
    }
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'oldest': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'rating': return (b.rating || 0) - (a.rating || 0)
        case 'company': return (a.company_name || '').localeCompare(b.company_name || '')
        default: return 0
      }
    })
    return filtered
  }, [ratingsArray, sortBy, filterRating])

  const openEditModal = (r: any) => {
    const company = companies.find((c: any) => c.id === r.company_id)
    setActiveCompanyId(r.company_id)
    setActiveCompanyName(company?.name || 'Unknown Company')
    setExistingRating(r)
    setActiveCompanyStats(
      company
        ? {
            averageRating: company.overall_rating || 0,
            totalRatings: company.total_reviews || 0
          }
        : undefined
    )
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setActiveCompanyId(null)
    setExistingRating(null)
  }

  const handleRatingSubmitted = () => {
    // Refresh lists after edit
    refetchRatings()
    refetchCompanies()
  }

  const handleRetry = () => {
    refetchRatings()
    refetchCompanies()
  }

  // Loading state
  if (ratingsLoading || companiesLoading) {
    return (
      <div className="min-h-screen">
        <div className="container-page section-py-xl">
          {/* Loading Header */}
          <div className="text-center mb-2xl">
            <div className="w-48 h-8 bg-content2 rounded-lg mx-auto mb-lg animate-pulse"></div>
            <div className="w-64 h-6 bg-content2 rounded-lg mx-auto animate-pulse"></div>
          </div>
          
          {/* Loading Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-2xl">
            {[...Array(3)].map((_, index) => (
              <StatCardSkeleton key={index} />
            ))}
          </div>
          
          {/* Loading Content */}
          <div className="space-y-md">
            {[...Array(4)].map((_, index) => (
              <RatingCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (ratingsError || companiesError) {
    return (
      <div className="min-h-screen">
        <div className="container-page section-py-xl">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center animate-fade-in-up">
              <div className="w-20 h-20 bg-gradient-to-br from-danger to-danger/80 rounded-3xl flex items-center justify-center mb-2xl shadow-2xl shadow-danger/20">
                <Icons.warning className="w-10 h-10 text-danger-foreground" />
              </div>
              <h2 className="text-3xl font-bold gradient-text mb-lg">Failed to load your ratings</h2>
              <p className="text-xl text-foreground/70 mb-2xl max-w-lg mx-auto">
                There was an error loading your ratings data. Please try refreshing the page.
              </p>
              <button
                onClick={handleRetry}
                className="px-2xl py-lg bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/25"
              >
                <Icons.refresh className="w-5 h-5 mr-sm inline" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const totalRatings = ratingsArray.length
  const averageRating = totalRatings > 0
    ? (ratingsArray.reduce((sum, r: any) => sum + (r.rating || 0), 0) / totalRatings).toFixed(1)
    : '0.0'

  const lastUpdated = totalRatings > 0
    ? new Date(Math.max(...ratingsArray.map((r: any) => new Date(r.updated_at).getTime()))).toLocaleDateString()
    : 'Never'

  return (
    <div className="min-h-screen">
      <div className="container-page section-py-xl">
        {/* Enhanced Header */}
        <div className="text-center mb-2xl">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-lg">
            My Platform Ratings
          </h1>
          <p className="text-lg text-foreground/70 mb-sm">
            Manage and review your platform ratings and reviews
          </p>
          <p className="text-sm text-foreground/60">
            Track your trading platform experiences and share feedback with the community
          </p>
        </div>

        {/* Enhanced Stats Grid */}
        <section className="mb-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {/* Total Ratings */}
            <div className="group relative overflow-hidden bg-content1/60 backdrop-blur-xl rounded-3xl container-p-lg border border-divider/30 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 transform hover:scale-[1.02]">
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-lg">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <Icons.star className="w-7 h-7 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="text-xs font-semibold px-sm py-xs rounded-lg bg-primary/20 text-primary border border-primary/30">
                    Platforms rated
                  </div>
                </div>

                <div className="space-y-sm">
                  <h3 className="text-4xl font-bold text-primary group-hover:text-primary transition-colors duration-300 tracking-tight">
                    {totalRatings}
                  </h3>
                  <p className="text-base font-semibold text-foreground group-hover:text-foreground transition-colors duration-300">
                    Total Ratings
                  </p>
                  <p className="text-sm text-foreground/60 leading-relaxed">
                    Platforms you've reviewed
                  </p>
                </div>
              </div>
            </div>

            {/* Average Rating */}
            <div className="group relative overflow-hidden bg-content1/60 backdrop-blur-xl rounded-3xl container-p-lg border border-divider/30 hover:border-success/30 transition-all duration-500 hover:shadow-2xl hover:shadow-success/10 transform hover:scale-[1.02]">
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-lg">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-success to-success/80 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <Icons.arrowTrendingUp className="w-7 h-7 text-success-foreground" />
                    </div>
                  </div>
                  <div className="text-xs font-semibold px-sm py-xs rounded-lg bg-success/20 text-success border border-success/30">
                    Your average
                  </div>
                </div>

                <div className="space-y-sm">
                  <h3 className="text-4xl font-bold text-success group-hover:text-success transition-colors duration-300 tracking-tight">
                    {averageRating}
                  </h3>
                  <p className="text-base font-semibold text-foreground group-hover:text-foreground transition-colors duration-300">
                    Average Rating
                  </p>
                  <p className="text-sm text-foreground/60 leading-relaxed">
                    Your satisfaction score
                  </p>
                </div>
              </div>
            </div>

            {/* Last Updated */}
            <div className="group relative overflow-hidden bg-content1/60 backdrop-blur-xl rounded-3xl container-p-lg border border-divider/30 hover:border-warning/30 transition-all duration-500 hover:shadow-2xl hover:shadow-warning/10 transform hover:scale-[1.02]">
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-lg">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-warning to-warning/80 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <Icons.calendar className="w-7 h-7 text-warning-foreground" />
                    </div>
                  </div>
                  <div className="text-xs font-semibold px-sm py-xs rounded-lg bg-warning/20 text-warning border border-warning/30">
                    Most recent
                  </div>
                </div>

                <div className="space-y-sm">
                  <h3 className="text-lg font-bold text-warning group-hover:text-warning transition-colors duration-300 tracking-tight">
                    {lastUpdated}
                  </h3>
                  <p className="text-base font-semibold text-foreground group-hover:text-foreground transition-colors duration-300">
                    Last Updated
                  </p>
                  <p className="text-sm text-foreground/60 leading-relaxed">
                    Latest rating activity
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Filters */}
        <section className="mb-xl">
          <div className="bg-content1/80 backdrop-blur-2xl rounded-3xl border border-divider/40 container-p-lg hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
            <div className="flex items-center gap-md mb-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
                <Icons.filter className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Filter & Sort</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="space-y-sm">
                <label className="block text-sm font-medium text-foreground mb-sm">Filter by Rating</label>
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="w-full container-px-lg container-py-md border border-divider/50 rounded-2xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none text-foreground bg-background/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50"
                >
                  <option value="all">All Ratings</option>
                  <option value={5}>5 Stars ⭐⭐⭐⭐⭐</option>
                  <option value={4}>4 Stars ⭐⭐⭐⭐</option>
                  <option value={3}>3 Stars ⭐⭐⭐</option>
                  <option value={2}>2 Stars ⭐⭐</option>
                  <option value={1}>1 Star ⭐</option>
                </select>
              </div>

              <div className="space-y-sm">
                <label className="block text-sm font-medium text-foreground mb-sm">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full container-px-lg container-py-md border border-divider/50 rounded-2xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none text-foreground bg-background/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="rating">Highest Rating</option>
                  <option value="company">Company A-Z</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Ratings List */}
        <section>
          {filteredAndSortedRatings.length > 0 ? (
            <div className="space-y-md">
              {filteredAndSortedRatings.map((rating: any, index) => (
                <div 
                  key={rating.id} 
                  className="group bg-content1/80 backdrop-blur-2xl rounded-3xl border border-divider/40 container-p-lg hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:border-primary/20 transform hover:scale-[1.01]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Company Header */}
                      <div className="flex items-center gap-md mb-lg">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                          <Icons.star className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                            {rating.company_name}
                          </h3>
                          <div className="flex items-center gap-md">
                            <div className="flex items-center gap-xs">
                              {[...Array(5)].map((_, i) => {
                                const filled = Math.round(rating.rating || 0)
                                return (
                                  <Icons.star 
                                    key={i} 
                                    className={`w-4 h-4 ${i < filled ? 'text-warning fill-current' : 'text-foreground/300'}`} 
                                  />
                                )
                              })}
                              <span className="ml-sm text-sm font-semibold text-foreground/80">
                                {(rating.rating || 0).toFixed(1)}/5
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Review Content */}
                      {rating.review && (
                        <div className="bg-content2/30 rounded-2xl container-p-lg mb-lg border border-divider/20">
                          <p className="text-foreground/80 leading-relaxed italic">
                            "{rating.review}"
                          </p>
                        </div>
                      )}

                      {/* Rating Details */}
                      <div className="flex flex-wrap items-center gap-lg text-sm text-foreground/60 mb-lg">
                        <span className="flex items-center gap-xs">
                          <Icons.calendar className="w-4 h-4" />
                          Rated on {new Date(rating.created_at).toLocaleDateString()}
                        </span>
                        {rating.updated_at !== rating.created_at && (
                          <span className="flex items-center gap-xs">
                            <Icons.refresh className="w-4 h-4" />
                            Updated on {new Date(rating.updated_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => openEditModal(rating)}
                        className="flex items-center gap-sm px-xl py-md bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
                      >
                        <Icons.edit className="w-4 h-4" />
                        Edit Rating
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Enhanced Empty State */
            <div className="text-center py-4xl">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center mb-2xl mx-auto shadow-2xl shadow-primary/20">
                <Icons.star className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold gradient-text mb-lg">
                {filterRating !== 'all' ? `No ${filterRating}-star ratings found` : 'No ratings yet'}
              </h3>
              <p className="text-xl text-foreground/70 mb-2xl max-w-lg mx-auto">
                {filterRating !== 'all'
                  ? 'Try adjusting your filter criteria or rate some platforms first.'
                  : 'Start rating platforms to see them appear here and help the community.'}
              </p>
              <button
                onClick={() => window.location.href = '/deals'}
                className="px-2xl py-lg bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/25"
              >
                <Icons.search className="w-5 h-5 mr-sm inline" />
                Browse Platforms
              </button>
            </div>
          )}
        </section>

        {/* Enhanced Footer */}
        <footer className="section-py-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-lg mb-md">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <p className="text-sm text-foreground/60">
                Your ratings help improve our platform recommendations
              </p>
            </div>
            <p className="text-xs text-foreground/40">
              Keep rating platforms to build your profile • {totalRatings} ratings and counting
            </p>
          </div>
        </footer>

        {/* Rating Modal */}
        {isModalOpen && activeCompanyId && (
          <RatingModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            companyId={activeCompanyId}
            companyName={activeCompanyName}
            existingRating={existingRating}
            onRatingSubmitted={handleRatingSubmitted}
            companyRating={activeCompanyStats}
          />
        )}
      </div>
    </div>
  )
}

export default MyDeals