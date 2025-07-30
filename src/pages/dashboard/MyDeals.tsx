// src/pages/dashboard/MyDeals.tsx - CLEAN VERSION (No top padding for dashboard)
import React, { useState, useMemo, useCallback } from 'react';
import { 
  Search, 
  Star, 
  RefreshCw, 
  Edit3, 
  BarChart3, 
  AlertCircle,
  Users,
  Calendar,
  Award,
  Eye,
  EyeOff,
  SortAsc,
  SortDesc,
  Gift,
  Database
} from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import { useUserRatingsQuery, useDealsQuery } from '../../hooks/queries/useDealsQuery';
import { useCategoriesQuery, useCategoryStatsQuery } from '../../hooks/queries/useCategoriesQuery';
import { RatingModal } from '../../components/rating/RatingModal';

interface UserRatingWithCompany {
  id: string;
  companyId: string;
  companyName: string;
  companySlug: string;
  category: string;
  logo: string;
  website: string;
  overallRating: number;
  platformUsability: number | null;
  customerSupport: number | null;
  feesCommissions: number | null;
  securityTrust: number | null;
  educationalResources: number | null;
  mobileApp: number | null;
  ratingType: 'quick' | 'categories' | 'overall';
  ratedAt: string;
  updatedAt: string;
  company?: any;
}

interface FilterState {
  searchTerm: string;
  selectedCategory: string;
  selectedRatingType: string;
  sortBy: 'date' | 'rating' | 'name';
  sortOrder: 'asc' | 'desc';
  showDetailed: boolean;
}

interface StatsData {
  totalRatings: number;
  avgRating: string;
  categoriesRated: number;
  recentRatings: number;
}

interface AnalyticsData {
  categoryBreakdown: { category: string; count: number; avgRating: number }[];
  ratingDistribution: { rating: number; count: number }[];
  monthlyActivity: { month: string; ratings: number }[];
}

const RATING_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'quick', label: 'Quick Rating' },
  { value: 'categories', label: 'Detailed Rating' },
  { value: 'overall', label: 'Overall Rating' },
];

const SORT_OPTIONS = [
  { value: 'date', label: 'Date' },
  { value: 'rating', label: 'Rating' },
  { value: 'name', label: 'Name' },
];

const useMyRatings = (userId: string | undefined) => {
  const dealsQuery = useDealsQuery();
  const companies = dealsQuery.data?.companies || [];
  const companyIds = useMemo(() => 
    companies.map(c => c.id).filter(Boolean) as string[], 
    [companies]
  );
  const userRatingsQuery = useUserRatingsQuery(userId, companyIds);

  const ratingsWithCompanies = useMemo(() => {
    if (!userRatingsQuery.data || !companies.length) return [];
    
    const ratings: UserRatingWithCompany[] = [];
    userRatingsQuery.data.forEach((rating, companyId) => {
      const company = companies.find(c => c.id === companyId);
      if (company && rating) {
        ratings.push({
          id: rating.id || `${companyId}-${Date.now()}`,
          companyId,
          companyName: company.name,
          companySlug: company.slug || '',
          category: company.category || 'unknown',
          logo: company.logo_url || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop',
          website: company.website_url || '#',
          overallRating: rating.overall_rating || (() => {
            // Calculate overall rating if not stored
            if (rating.rating_type === 'categories') {
              const ratings = [
                rating.platform_usability,
                rating.customer_support,
                rating.fees_commissions,
                rating.security_trust,
                rating.educational_resources,
                rating.mobile_app
              ].filter(r => r !== null && r > 0);
              
              return ratings.length > 0 
                ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length 
                : 0;
            }
            return 0;
          })(),
          platformUsability: rating.platform_usability || null,
          customerSupport: rating.customer_support || null,
          feesCommissions: rating.fees_commissions || null,
          securityTrust: rating.security_trust || null,
          educationalResources: rating.educational_resources || null,
          mobileApp: rating.mobile_app || null,
          ratingType: (rating.rating_type as 'quick' | 'categories' | 'overall') || 'quick',
          ratedAt: new Date(rating.created_at || Date.now()).toLocaleDateString(),
          updatedAt: new Date(rating.updated_at || rating.created_at || Date.now()).toLocaleDateString(),
          company
        });
      }
    });
    
    return ratings;
  }, [userRatingsQuery.data, companies]);

  return {
    ratings: ratingsWithCompanies,
    isLoading: dealsQuery.isLoading || userRatingsQuery.isLoading,
    error: dealsQuery.error || userRatingsQuery.error,
    refetch: () => {
      dealsQuery.refetch();
      userRatingsQuery.refetch();
    }
  };
};

const useRatingAnalytics = (ratings: UserRatingWithCompany[], categories: any[]): AnalyticsData & StatsData => {
  return useMemo(() => {
    const totalRatings = ratings.length;
    const avgRating = totalRatings > 0 
      ? (ratings.reduce((sum, rating) => sum + rating.overallRating, 0) / totalRatings).toFixed(1)
      : '0.0';
    const categoriesRated = new Set(ratings.map(r => r.category)).size;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentRatings = ratings.filter(r => new Date(r.ratedAt) >= thirtyDaysAgo).length;

    // Category breakdown using database categories
    const categoryBreakdown = categories
      .filter(cat => cat.value !== 'all')
      .map(cat => {
        const categoryRatings = ratings.filter(r => r.category === cat.value);
        return {
          category: cat.label,
          count: categoryRatings.length,
          avgRating: categoryRatings.length > 0 
            ? categoryRatings.reduce((sum, r) => sum + r.overallRating, 0) / categoryRatings.length
            : 0
        };
      })
      .filter(c => c.count > 0);

    // Rating distribution
    const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
      rating,
      count: ratings.filter(r => Math.floor(r.overallRating) === rating).length
    }));

    // Monthly activity (last 6 months)
    const monthlyActivity = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      const monthRatings = ratings.filter(r => {
        const ratingDate = new Date(r.ratedAt);
        return ratingDate.getMonth() === date.getMonth() && ratingDate.getFullYear() === date.getFullYear();
      });
      
      monthlyActivity.push({
        month: monthKey,
        ratings: monthRatings.length
      });
    }

    return { 
      totalRatings, 
      avgRating, 
      categoriesRated, 
      recentRatings,
      categoryBreakdown,
      ratingDistribution,
      monthlyActivity
    };
  }, [ratings, categories]);
};

const useFilteredAndSortedRatings = (ratings: UserRatingWithCompany[], filters: FilterState) => {
  return useMemo(() => {
    let filtered = ratings.filter(rating => {
      const searchTerm = filters.searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || 
        rating.companyName.toLowerCase().includes(searchTerm) ||
        rating.category.toLowerCase().includes(searchTerm) ||
        rating.ratingType.toLowerCase().includes(searchTerm);
      
      const matchesCategory = filters.selectedCategory === 'all' || rating.category === filters.selectedCategory;
      const matchesType = filters.selectedRatingType === 'all' || rating.ratingType === filters.selectedRatingType;
      const matchesDetail = !filters.showDetailed || rating.ratingType === 'categories';
      
      return matchesSearch && matchesCategory && matchesType && matchesDetail;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'date':
          comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          break;
        case 'rating':
          comparison = b.overallRating - a.overallRating;
          break;
        case 'name':
          comparison = a.companyName.localeCompare(b.companyName);
          break;
      }
      
      return filters.sortOrder === 'desc' ? comparison : -comparison;
    });

    return filtered;
  }, [ratings, filters]);
};

const MyDeals: React.FC = () => {
  const { user } = useAuth();
  
  // ✅ DYNAMIC: Categories from dedicated table
  const categoriesQuery = useCategoriesQuery();
  const categories = categoriesQuery.data || [];
  
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState<UserRatingWithCompany | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedRatings, setSelectedRatings] = useState<Set<string>>(new Set());
  
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedCategory: 'all',
    selectedRatingType: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
    showDetailed: false
  });

  const { ratings, isLoading: ratingsLoading, error: ratingsError, refetch } = useMyRatings(user?.id);
  const analytics = useRatingAnalytics(ratings, categories);
  const filteredRatings = useFilteredAndSortedRatings(ratings, filters);

  const categoryStatsQuery = useCategoryStatsQuery(ratings);
  const categoryStats = categoryStatsQuery.data || new Map();

  const handleFilterChange = useCallback((key: keyof FilterState, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleRetry = useCallback(() => {
    refetch();
    categoriesQuery.refetch();
  }, [refetch, categoriesQuery]);

  const handleEditRating = useCallback((rating: UserRatingWithCompany) => {
    setSelectedRating(rating);
    setShowRatingModal(true);
  }, []);

  const handleRatingUpdated = useCallback(async () => {
    setIsUpdating(true);
    try {
      await refetch();
      setShowRatingModal(false);
      setSelectedRating(null);
    } catch (error) {
      console.error('Error refreshing ratings:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [refetch]);

  const handleToggleSelection = useCallback((ratingId: string) => {
    setSelectedRatings(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ratingId)) {
        newSet.delete(ratingId);
      } else {
        newSet.add(ratingId);
      }
      return newSet;
    });
  }, []);

  const handleClearSelections = useCallback(() => {
    setSelectedRatings(new Set());
  }, []);

  // ✅ FIXED: Proper star rendering with fallback for null/undefined ratings
  const renderStars = useCallback((rating: number | null | undefined, size: string = 'w-4 h-4', showValue: boolean = true) => {
    const validRating = rating || 0;
    const roundedRating = Math.round(validRating * 2) / 2; // Round to nearest 0.5
    
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= Math.floor(roundedRating);
          const isHalfFilled = star === Math.ceil(roundedRating) && roundedRating % 1 !== 0;
          
          return (
            <div key={star} className="relative">
              <Star
                className={`${size} ${
                  isFilled 
                    ? 'text-yellow-400' 
                    : isHalfFilled 
                      ? 'text-yellow-400' 
                      : 'text-gray-300'
                }`}
                fill={isFilled ? 'currentColor' : isHalfFilled ? 'url(#half-star)' : 'none'}
                stroke="currentColor"
              />
              {isHalfFilled && (
                <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                  <Star
                    className={`${size} text-yellow-400`}
                    fill="currentColor"
                    stroke="currentColor"
                  />
                </div>
              )}
            </div>
          );
        })}
        {showValue && (
          <span className="ml-2 text-sm font-medium text-gray-900">
            {validRating.toFixed(1)}
          </span>
        )}
        
        {/* SVG definition for half-star gradient */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="half-star" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      selectedCategory: 'all',
      selectedRatingType: 'all',
      sortBy: 'date',
      sortOrder: 'desc',
      showDetailed: false
    });
  }, []);

  const isLoading = ratingsLoading || categoriesQuery.isLoading;
  const hasError = ratingsError || categoriesQuery.error;

  // ✅ CATEGORIES ERROR STATE
  if (categoriesQuery.error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <Database className="w-12 h-12 text-red-600 mx-auto mb-4" />
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
                <RefreshCw className="w-4 h-4" />
                Retry Connection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ LOADING STATE
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">My Ratings</h1>
            <p className="text-xl text-gray-600">Loading your platform ratings...</p>
          </div>
          
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading ratings and categories...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ ERROR STATE
  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Ratings</h2>
              <p className="text-gray-600 mb-6">
                {hasError instanceof Error ? hasError.message : 'Failed to load your ratings'}
              </p>
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ NO CATEGORIES STATE
  if (!categories.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Categories Found</h2>
              <p className="text-gray-600 mb-6">
                The categories table exists but contains no data. Please add categories to the database.
              </p>
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Categories
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ MAIN CONTENT
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Platform Ratings</h1>
          <p className="text-xl text-gray-600 mb-2">
            {ratings.length > 0 
              ? `You've rated ${ratings.length} trading platform${ratings.length !== 1 ? 's' : ''}`
              : 'Track and manage your platform ratings and reviews'
            }
          </p>
          <p className="text-gray-600 mb-6">
            All ratings help the trading community make informed decisions • {categories.length - 1} categories available
          </p>

          {/* Action Buttons */}
          {ratings.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {showAnalytics ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showAnalytics ? 'Hide' : 'Show'} Analytics
              </button>
            </div>
          )}
        </div>

        {/* Analytics Dashboard */}
        {showAnalytics && ratings.length > 0 && (
          <div className="mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Rating Analytics
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-3">Category Breakdown</h4>
                  <div className="space-y-2">
                    {analytics.categoryBreakdown.map(cat => (
                      <div key={cat.category} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-900">{cat.category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600">{cat.count} rating{cat.count !== 1 ? 's' : ''}</span>
                          <div className="flex items-center gap-1">
                            {renderStars(cat.avgRating, 'w-3 h-3', false)}
                            <span className="text-xs font-medium ml-1">{cat.avgRating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-3">Rating Distribution</h4>
                  <div className="space-y-2">
                    {analytics.ratingDistribution.filter(r => r.count > 0).map(dist => (
                      <div key={dist.rating} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-900">{dist.rating} star{dist.rating !== 1 ? 's' : ''}</span>
                        <span className="text-xs text-gray-600">{dist.count} rating{dist.count !== 1 ? 's' : ''}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-600 mb-3">Monthly Activity</h4>
                <div className="flex items-end gap-2 h-20">
                  {analytics.monthlyActivity.map(month => (
                    <div key={month.month} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-blue-100 rounded-t flex items-end justify-center min-h-4"
                        style={{ height: `${Math.max(20, (month.ratings / Math.max(...analytics.monthlyActivity.map(m => m.ratings))) * 60)}px` }}
                      >
                        {month.ratings > 0 && (
                          <span className="text-xs text-blue-600 font-medium mb-1">{month.ratings}</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-600 mt-2">{month.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-6 rounded-xl border border-blue-500/20">
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6 text-blue-500" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{analytics.totalRatings}</div>
                <div className="text-gray-600 text-sm">Total Ratings</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 p-6 rounded-xl border border-green-500/20">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-green-500" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{analytics.avgRating}</div>
                <div className="text-gray-600 text-sm">Avg Rating</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 p-6 rounded-xl border border-purple-500/20">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-purple-500" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{analytics.categoriesRated}</div>
                <div className="text-gray-600 text-sm">Categories</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 p-6 rounded-xl border border-orange-500/20">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-orange-500" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{analytics.recentRatings}</div>
                <div className="text-gray-600 text-sm">Recent (30d)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {ratings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Star className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No ratings yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't rated any trading platforms yet. Start by rating platforms you've used to help the community make informed decisions.
            </p>
            <button
              onClick={() => window.location.href = '/deals'}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
            >
              Browse Platforms to Rate
            </button>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Filter Your Ratings ({filteredRatings.length} of {ratings.length})
                </h3>
                <div className="flex items-center gap-2">
                  {selectedRatings.size > 0 && (
                    <button
                      onClick={handleClearSelections}
                      className="text-sm px-3 py-1 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Clear ({selectedRatings.size})
                    </button>
                  )}
                  {(filters.searchTerm || filters.selectedCategory !== 'all' || filters.selectedRatingType !== 'all' || filters.showDetailed) && (
                    <button
                      onClick={clearFilters}
                      className="text-sm px-3 py-1 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search platforms..."
                    value={filters.searchTerm}
                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-gray-900"
                  />
                </div>
                
                <select
                  value={filters.selectedCategory}
                  onChange={(e) => handleFilterChange('selectedCategory', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-gray-900"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                
                <select
                  value={filters.selectedRatingType}
                  onChange={(e) => handleFilterChange('selectedRatingType', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-gray-900"
                >
                  {RATING_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-gray-900"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      Sort by {option.label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
                  title={`Sort ${filters.sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                >
                  {filters.sortOrder === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
                </button>
              </div>

              {/* Category Quick Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((category) => {
                  const Icon = category.icon || Gift
                  const isActive = filters.selectedCategory === category.value
                  const count = category.value === 'all' 
                    ? ratings.length 
                    : ratings.filter(r => r.category === category.value).length
                  
                  return (
                    <button
                      key={category.value}
                      onClick={() => handleFilterChange('selectedCategory', category.value)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {category.label}
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-white/20' : 'bg-gray-200'
                      }`}>
                        {count}
                      </span>
                    </button>
                  )
                })}
                
                <div className="ml-auto flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={filters.showDetailed}
                      onChange={(e) => handleFilterChange('showDetailed', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    Detailed only
                  </label>
                </div>
              </div>
            </div>

            {/* Rating Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredRatings.map((rating) => (
                <div key={rating.id} className="group bg-white rounded-2xl border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden relative">
                  
                  {/* Selection Checkbox */}
                  <div className="absolute top-4 left-4 z-10">
                    <input
                      type="checkbox"
                      checked={selectedRatings.has(rating.id)}
                      onChange={() => handleToggleSelection(rating.id)}
                      className="w-4 h-4 rounded border-gray-300 bg-white/90"
                    />
                  </div>

                  {/* Platform Image */}
                  <div className="relative">
                    <img
                      src={rating.logo}
                      alt={rating.companyName}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop';
                      }}
                    />
                    <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-2">
                      {renderStars(rating.overallRating, 'w-4 h-4')}
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 capitalize">
                        {rating.ratingType} Rating
                      </span>
                    </div>
                  </div>

                  {/* Rating Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full capitalize">
                        {rating.category?.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-gray-500">
                        {rating.ratedAt}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                      {rating.companyName}
                    </h3>

                    {/* Category Ratings */}
                    {rating.ratingType === 'categories' && (
                      <div className="space-y-2 mb-4">
                        {[
                          { key: 'platformUsability', label: 'Platform', value: rating.platformUsability },
                          { key: 'customerSupport', label: 'Support', value: rating.customerSupport },
                          { key: 'feesCommissions', label: 'Fees', value: rating.feesCommissions },
                          { key: 'securityTrust', label: 'Security', value: rating.securityTrust }
                        ].filter(item => item.value !== null && item.value > 0).slice(0, 4).map(item => (
                          <div key={item.key} className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">{item.label}</span>
                            {renderStars(item.value, 'w-3 h-3', false)}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-6">
                      <span className="text-xs text-gray-500">
                        Updated {rating.updatedAt}
                      </span>
                      <button 
                        onClick={() => handleEditRating(rating)}
                        disabled={isUpdating}
                        className="bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-300 text-gray-900 font-medium py-2 px-4 rounded-xl transition-all duration-300 hover:shadow-md disabled:opacity-50"
                      >
                        <div className="flex items-center gap-2">
                          <Edit3 className="w-4 h-4" />
                          <span className="text-sm">
                            {isUpdating ? 'Updating...' : 'Edit'}
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredRatings.length === 0 && ratings.length > 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No ratings found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Footer */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Users className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">Your Trading Journey</h3>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto mb-4">
                {analytics.totalRatings > 0 
                  ? `You've contributed ${analytics.totalRatings} rating${analytics.totalRatings !== 1 ? 's' : ''} to help fellow traders make informed decisions.`
                  : 'Start rating platforms to build your trading profile and help the community.'
                }
              </p>
              {analytics.categoryBreakdown.length > 0 && (
                <div className="flex justify-center gap-4 text-sm">
                  {analytics.categoryBreakdown.slice(0, 3).map(cat => (
                    <span key={cat.category} className="text-blue-600">
                      {cat.category}: {cat.avgRating.toFixed(1)}/5
                    </span>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Rating Modal */}
        {showRatingModal && selectedRating && (
          <RatingModal
            isOpen={showRatingModal}
            onClose={() => {
              setShowRatingModal(false);
              setSelectedRating(null);
            }}
            companyId={selectedRating.companyId}
            companyName={selectedRating.companyName}
            existingRating={{
              overall_rating: selectedRating.overallRating,
              platform_usability: selectedRating.platformUsability,
              customer_support: selectedRating.customerSupport,
              fees_commissions: selectedRating.feesCommissions,
              security_trust: selectedRating.securityTrust,
              educational_resources: selectedRating.educationalResources,
              mobile_app: selectedRating.mobileApp,
              rating_type: selectedRating.ratingType,
              created_at: selectedRating.ratedAt,
              updated_at: selectedRating.updatedAt
            }}
            onRatingSubmitted={handleRatingUpdated}
            companyRating={{
              averageRating: selectedRating.company?.overall_rating || 0,
              totalRatings: selectedRating.company?.total_reviews || 0
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MyDeals;