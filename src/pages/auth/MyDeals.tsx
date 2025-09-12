// src/pages/auth/MyDeals.tsx - AUTHENTICATED VERSION WITH EDIT
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

  if (ratingsLoading || companiesLoading) {
    return (
      <div className="space-y-lg">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Ratings</h1>
          <p className="mt-2 text-foreground-600">Loading your platform ratings...</p>
        </div>

        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Icons.refresh className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-foreground-600">Loading your ratings...</p>
          </div>
        </div>
      </div>
    )
  }

  if (ratingsError || companiesError) {
    return (
      <div className="space-y-lg">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Ratings</h1>
          <p className="mt-2 text-foreground-600">Error loading your ratings</p>
        </div>

        <div className="bg-content1 rounded-xl border border-divider container-p-lg text-center">
          <p className="text-danger mb-4">Failed to load your ratings</p>
          <button
            onClick={handleRetry}
            className="container-px-md container-py-sm rounded-lg text-white bg-primary hover:bg-primary-600"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const totalRatings = ratingsArray.length
  const averageRating = totalRatings > 0
    ? (ratingsArray.reduce((sum, r: any) => sum + (r.rating || 0), 0) / totalRatings).toFixed(1)
    : '0.0'

  return (
    <div className="space-y-lg">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Ratings</h1>
        <p className="mt-2 text-foreground-600">Manage and review your platform ratings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        <div className="bg-content1 rounded-xl border border-divider container-p-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground-600 mb-1">Total Ratings</p>
              <p className="text-2xl font-bold text-foreground">{totalRatings}</p>
              <p className="text-sm font-medium text-primary mt-1">Platforms rated</p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center">
              <Icons.star className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-content1 rounded-xl border border-divider container-p-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground-600 mb-1">Average Rating</p>
              <p className="text-2xl font-bold text-foreground">{averageRating}</p>
              <p className="text-sm font-medium text-success mt-1">Your average</p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center">
              <Icons.arrowTrendingUp className="w-6 h-6 text-success" />
            </div>
          </div>
        </div>

        <div className="bg-content1 rounded-xl border border-divider container-p-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground-600 mb-1">Last Updated</p>
              <p className="text-2xl font-bold text-foreground">
                {totalRatings > 0
                  ? new Date(Math.max(...ratingsArray.map((r: any) => new Date(r.updated_at).getTime()))).toLocaleDateString()
                  : 'Never'
                }
              </p>
              <p className="text-sm font-medium text-warning mt-1">Most recent</p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center">
              <Icons.calendar className="w-6 h-6 text-warning" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="bg-content1 rounded-xl border border-divider container-p-lg">
        <div className="flex flex-col sm:flex-row gap-sm">
          <div className="flex-1">
            <label className="block text-sm font-medium text-foreground-700 mb-2">Filter by Rating</label>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full container-px-sm container-py-xs border border-divider rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="all">All Ratings</option>
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={2}>2 Stars</option>
              <option value={1}>1 Star</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-foreground-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full container-px-sm container-py-xs border border-divider rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="rating">Highest Rating</option>
              <option value="company">Company A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ratings List */}
      {filteredAndSortedRatings.length > 0 ? (
        <div className="space-y-sm">
          {filteredAndSortedRatings.map((rating: any) => (
            <div key={rating.id} className="bg-content1 rounded-xl border border-divider container-p-lg hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-sm mb-3">
                    <h3 className="text-lg font-semibold text-foreground">{rating.company_name}</h3>
                    <div className="flex items-center gap-xs">
                      {[...Array(5)].map((_, i) => {
                        const filled = Math.round(rating.rating || 0)
                        return (
                          <Icons.star key={i} className={`w-4 h-4 ${i < filled ? 'text-warning fill-current' : 'text-foreground-300'}`} />
                        )
                      })}
                      <span className="ml-2 text-sm font-medium text-foreground-600">
                        {(rating.rating || 0).toFixed(1)}/5
                      </span>
                    </div>
                  </div>

                  {rating.review && <p className="text-foreground-600 mb-3">{rating.review}</p>}

                  <div className="flex items-center gap-md text-sm text-foreground-500">
                    <span>Rated on {new Date(rating.created_at).toLocaleDateString()}</span>
                    {rating.updated_at !== rating.created_at && (
                      <span>Updated on {new Date(rating.updated_at).toLocaleDateString()}</span>
                    )}
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={() => openEditModal(rating)}
                      className="container-px-md container-py-sm rounded-lg text-white bg-primary hover:bg-primary-600"
                    >
                      Edit rating
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-content1 rounded-xl border border-divider container-p-lg text-center">
          <Icons.star className="w-16 h-16 mx-auto mb-4 text-foreground-400" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {filterRating !== 'all' ? `No ${filterRating}-star ratings found` : 'No ratings yet'}
          </h3>
          <p className="text-foreground-600 mb-6">
            {filterRating !== 'all'
              ? 'Try adjusting your filter criteria or rate some platforms first.'
              : 'Start rating platforms to see them appear here.'}
          </p>
          <button
            onClick={() => window.location.href = '/deals'}
            className="bg-primary text-white container-px-lg container-py-sm rounded-lg hover:bg-primary-600 transition-colors"
          >
            Browse Platforms
          </button>
        </div>
      )}

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
  )
}

export default MyDeals