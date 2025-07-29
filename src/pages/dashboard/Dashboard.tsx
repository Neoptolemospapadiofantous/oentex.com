// src/pages/Dashboard.tsx - Optimized: Performance, simplicity, and robustness
import React, { useEffect, useMemo, useCallback } from 'react'
import { Star, Users, Award, TrendingUp, Settings, RefreshCw, Chrome, AlertCircle } from 'lucide-react'
import { useAuth } from '../lib/authContext'
import { useDealsQuery } from '../hooks/queries/useDealsQuery'
import toast, { Toaster } from 'react-hot-toast'

// ✅ FIXED: Added missing AlertCircle import
// ✅ OPTIMIZED: Memoized expensive calculations
// ✅ SIMPLIFIED: Removed complex custom toast DOM manipulation

const Dashboard: React.FC = () => {
  const { user, session } = useAuth()
  const dealsQuery = useDealsQuery()

  // ✅ SIMPLIFIED: Clean OAuth success toast using react-hot-toast
  useEffect(() => {
    const showOAuthSuccessToast = () => {
      if (!user || !session?.user?.app_metadata?.provider) return

      // ✅ ROBUST: Safe sessionStorage access with error handling
      const toastKey = `oauth_success_${session.user.id}`
      try {
        if (sessionStorage.getItem(toastKey)) return
        sessionStorage.setItem(toastKey, 'true')
      } catch (error) {
        console.warn('SessionStorage not available:', error)
        return // Don't show toast if we can't track it
      }

      const provider = session.user.app_metadata.provider
      const providerName = provider === 'google' ? 'Google' : 
                          provider === 'azure' ? 'Microsoft' : 
                          'OAuth Provider'

      console.log('🎉 Showing OAuth success toast for:', providerName)

      // ✅ SIMPLIFIED: Use react-hot-toast instead of custom DOM manipulation
      toast.success(
        (t) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Chrome className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <div className="font-semibold">🎉 Welcome to Oentex!</div>
              <div className="text-sm text-gray-600">
                Successfully signed in with {providerName}
              </div>
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        ),
        {
          duration: 5000,
          style: {
            background: 'linear-gradient(135deg, #10B981, #059669)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          }
        }
      )
    }

    // ✅ OPTIMIZED: Debounced with setTimeout to prevent multiple calls
    const timeoutId = setTimeout(showOAuthSuccessToast, 500)
    return () => clearTimeout(timeoutId)
  }, [user, session])

  // ✅ OPTIMIZED: Memoized data extraction to prevent unnecessary re-calculations
  const { deals, companies } = useMemo(() => {
    const deals = dealsQuery.data?.deals || []
    const companies = dealsQuery.data?.companies || []
    return { deals, companies }
  }, [dealsQuery.data])
  
  // ✅ OPTIMIZED: Memoized stats calculations
  const stats = useMemo(() => {
    const totalPlatforms = companies.length
    const activePlatforms = companies.filter(c => c.status === 'active').length
    const avgPlatformRating = companies.length > 0 
      ? (companies.reduce((sum, c) => sum + (c.overall_rating || 0), 0) / companies.length).toFixed(1)
      : '0.0'
    const totalReviews = companies.reduce((sum, c) => sum + (c.total_reviews || 0), 0)

    return {
      totalPlatforms,
      activePlatforms,
      avgPlatformRating,
      totalReviews
    }
  }, [companies])

  // ✅ OPTIMIZED: Memoized top rated platforms calculation
  const topRatedPlatforms = useMemo(() => {
    return companies
      .filter(c => c.overall_rating > 0)
      .sort((a, b) => (b.overall_rating || 0) - (a.overall_rating || 0))
      .slice(0, 4)
      .map(company => ({
        id: company.id,
        name: company.name,
        category: company.category?.replace('_', ' ') || 'Trading',
        rating: company.overall_rating?.toFixed(1) || '0.0',
        reviews: company.total_reviews || 0
      }))
  }, [companies])

  // ✅ OPTIMIZED: Memoized category stats calculation
  const topCategories = useMemo(() => {
    const categoryStats = companies.reduce((acc, company) => {
      const category = company.category?.replace('_', ' ') || 'Unknown'
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(categoryStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category, count]) => ({ category, count }))
  }, [companies])

  // ✅ OPTIMIZED: Memoized navigation handlers
  const navigateToDeals = useCallback(() => {
    window.location.href = '/deals'
  }, [])

  const navigateToMyDeals = useCallback(() => {
    window.location.href = '/my-deals'
  }, [])

  const navigateToProfile = useCallback(() => {
    window.location.href = '/profile'
  }, [])

  const handleRetry = useCallback(() => {
    dealsQuery.refetch()
  }, [dealsQuery])

  // ✅ OPTIMIZED: Memoized user display name
  const userDisplayName = useMemo(() => {
    return user?.user_metadata?.full_name || 
           user?.email?.split('@')[0] || 
           'User'
  }, [user])

  // Loading state
  if (dealsQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Loading your trading platform overview...</p>
        </div>
        
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    )
  }

  // ✅ FIXED: Error state with proper AlertCircle import
  if (dealsQuery.error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Error loading dashboard data</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">Failed to load dashboard data</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {userDisplayName}! Here's your platform rating overview.
        </p>
      </div>

      {/* ✅ OPTIMIZED: Stats Grid with memoized calculations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Platforms</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPlatforms}</p>
              <p className="text-sm font-medium text-green-600 mt-1">Available to rate</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Active Platforms</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activePlatforms}</p>
              <p className="text-sm font-medium text-green-600 mt-1">Currently active</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalReviews.toLocaleString()}</p>
              <p className="text-sm font-medium text-amber-600 mt-1">Community reviews</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Avg. Platform Rating</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgPlatformRating}</p>
              <p className="text-sm font-medium text-green-600 mt-1">Overall quality</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ✅ OPTIMIZED: Top Rated Platforms with memoized data */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Top Rated Platforms</h2>
            <button 
              onClick={navigateToDeals}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              View All
            </button>
          </div>
          
          {topRatedPlatforms.length > 0 ? (
            <div className="space-y-4">
              {topRatedPlatforms.map((platform, index) => (
                <div key={platform.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{platform.name}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-600 capitalize">{platform.category}</span>
                        <span className="text-sm font-medium text-blue-600">{platform.reviews} reviews</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium text-gray-900">{platform.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Star className="w-8 h-8 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-600">No rated platforms yet</p>
            </div>
          )}
        </div>

        {/* ✅ OPTIMIZED: Platform Categories with memoized data */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Platform Categories</h2>
          
          {topCategories.length > 0 ? (
            <div className="space-y-4">
              {topCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      index === 0 ? 'bg-blue-100' : index === 1 ? 'bg-green-100' : 'bg-amber-100'
                    }`}>
                      <Users className={`w-4 h-4 ${
                        index === 0 ? 'text-blue-600' : index === 1 ? 'text-green-600' : 'text-amber-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 capitalize">{category.category}</h3>
                      <p className="text-sm text-gray-600">Trading category</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{category.count}</p>
                    <p className="text-sm text-gray-600">platforms</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-8 h-8 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-600">No categories available</p>
            </div>
          )}
        </div>
      </div>

      {/* ✅ OPTIMIZED: Quick Actions with memoized handlers */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={navigateToDeals} 
            className="bg-white hover:bg-gray-50 p-4 rounded-lg border border-gray-200 text-left transition-colors"
          >
            <Users className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-medium text-gray-900">Browse Platforms</h3>
            <p className="text-sm text-gray-600">Discover and rate trading platforms</p>
          </button>
          
          <button 
            onClick={navigateToMyDeals} 
            className="bg-white hover:bg-gray-50 p-4 rounded-lg border border-gray-200 text-left transition-colors"
          >
            <Star className="w-6 h-6 text-green-600 mb-2" />
            <h3 className="font-medium text-gray-900">My Ratings</h3>
            <p className="text-sm text-gray-600">View and manage your platform ratings</p>
          </button>
          
          <button 
            onClick={navigateToProfile} 
            className="bg-white hover:bg-gray-50 p-4 rounded-lg border border-gray-200 text-left transition-colors"
          >
            <Settings className="w-6 h-6 text-amber-600 mb-2" />
            <h3 className="font-medium text-gray-900">Profile Settings</h3>
            <p className="text-sm text-gray-600">Manage your account preferences</p>
          </button>
        </div>
      </div>

      {/* ✅ SIMPLIFIED: Clean React Hot Toast Container */}
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  )
}

export default Dashboard