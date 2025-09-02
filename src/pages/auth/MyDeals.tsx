// src/pages/auth/MyDeals.tsx - AUTHENTICATED VERSION
import React, { useState, useMemo } from 'react'
import { Star, RefreshCw, Filter, Calendar, TrendingUp } from 'lucide-react'
import { useAuth } from '../../lib/authContext'
import { useUserRatingsQuery } from '../../hooks/queries/useDealsQuery'
import { useDealsQuery } from '../../hooks/queries/useDealsQuery'

interface Rating {
  id: string
  company_id: string
  company_name: string
  rating: number
  review: string
  created_at: string
  updated_at: string
}

const MyDeals: React.FC = () => {
  const { user } = useAuth()
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating' | 'company'>('newest')
  const [filterRating, setFilterRating] = useState<number | 'all'>('all')

  // Get user's ratings
  const dealsQuery = useDealsQuery()
  const deals = dealsQuery.data?.deals || []
  const companies = dealsQuery.data?.companies || []

  const companyIds = useMemo(() => 
    deals.map(deal => deal.company?.id).filter(Boolean) as string[], 
    [deals]
  )
  
  const userRatingsQuery = useUserRatingsQuery(user?.id, companyIds)
  const userRatings = userRatingsQuery.data || new Map()

  // Convert ratings map to array and add company info
  const ratingsArray = useMemo(() => {
    const ratings: (Rating & { company?: any })[] = []
    
    userRatings.forEach((rating, companyId) => {
      const company = companies.find(c => c.id === companyId)
      if (company) {
        ratings.push({
          ...rating,
          company_name: company.name,
          company
        })
      }
    })

    return ratings
  }, [userRatings, companies])

  // Filter and sort ratings
  const filteredAndSortedRatings = useMemo(() => {
    let filtered = ratingsArray

    // Filter by rating
    if (filterRating !== 'all') {
      filtered = filtered.filter(rating => rating.rating === filterRating)
    }

    // Sort ratings
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'rating':
          return b.rating - a.rating
        case 'company':
          return a.company_name.localeCompare(b.company_name)
        default:
          return 0
      }
    })

    return filtered
  }, [ratingsArray, sortBy, filterRating])

  const handleRetry = () => {
    userRatingsQuery.refetch()
    dealsQuery.refetch()
  }

  if (userRatingsQuery.isLoading || dealsQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Ratings</h1>
          <p className="mt-2 text-gray-600">Loading your platform ratings...</p>
        </div>
        
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading your ratings...</p>
          </div>
        </div>
      </div>
    )
  }

  if (userRatingsQuery.error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Ratings</h1>
          <p className="mt-2 text-gray-600">Error loading your ratings</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <p className="text-red-600 mb-4">Failed to load your ratings</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const totalRatings = ratingsArray.length
  const averageRating = totalRatings > 0 
    ? (ratingsArray.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(1)
    : '0.0'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Ratings</h1>
        <p className="mt-2 text-gray-600">
          Manage and review your platform ratings
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Ratings</p>
              <p className="text-2xl font-bold text-gray-900">{totalRatings}</p>
              <p className="text-sm font-medium text-blue-600 mt-1">Platforms rated</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">{averageRating}</p>
              <p className="text-sm font-medium text-green-600 mt-1">Your average</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Last Updated</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalRatings > 0 
                  ? new Date(Math.max(...ratingsArray.map(r => new Date(r.updated_at).getTime()))).toLocaleDateString()
                  : 'Never'
                }
              </p>
              <p className="text-sm font-medium text-amber-600 mt-1">Most recent</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Rating</label>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        <div className="space-y-4">
          {filteredAndSortedRatings.map((rating) => (
            <div key={rating.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{rating.company_name}</h3>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < rating.rating 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm font-medium text-gray-600">
                        {rating.rating}/5
                      </span>
                    </div>
                  </div>
                  
                  {rating.review && (
                    <p className="text-gray-600 mb-3">{rating.review}</p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Rated on {new Date(rating.created_at).toLocaleDateString()}</span>
                    {rating.updated_at !== rating.created_at && (
                      <span>Updated on {new Date(rating.updated_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Star className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {filterRating !== 'all' ? `No ${filterRating}-star ratings found` : 'No ratings yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {filterRating !== 'all' 
              ? 'Try adjusting your filter criteria or rate some platforms first.'
              : 'Start rating platforms to see them appear here.'
            }
          </p>
          <button
            onClick={() => window.location.href = '/deals'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Platforms
          </button>
        </div>
      )}
    </div>
  )
}

export default MyDeals