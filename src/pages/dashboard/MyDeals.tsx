// src/pages/dashboard/MyDeals.tsx
import React, { useState, useEffect } from 'react';
import { Search, Star, TrendingUp, RefreshCw, Edit3 } from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import { supabase } from '../../lib/supabase';

interface UserRating {
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
  ratingType: string;
  ratedAt: string;
  updatedAt: string;
}

const MyDeals: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRatingType, setSelectedRatingType] = useState('all');
  const [ratings, setRatings] = useState<UserRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's ratings from database
  useEffect(() => {
    const fetchUserRatings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('ratings')
          .select(`
            *,
            trading_companies(
              name,
              slug,
              logo_url,
              website_url,
              category
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        // Transform data to match component interface
        const transformedRatings = data?.map(rating => ({
          id: rating.id,
          companyId: rating.company_id,
          companyName: rating.trading_companies?.name || 'Unknown Company',
          companySlug: rating.trading_companies?.slug || '',
          category: rating.trading_companies?.category?.replace('_', ' ') || 'Unknown',
          logo: rating.trading_companies?.logo_url || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop',
          website: rating.trading_companies?.website_url || '#',
          overallRating: rating.overall_rating || 0,
          platformUsability: rating.platform_usability,
          customerSupport: rating.customer_support,
          feesCommissions: rating.fees_commissions,
          securityTrust: rating.security_trust,
          educationalResources: rating.educational_resources,
          mobileApp: rating.mobile_app,
          ratingType: rating.rating_type,
          ratedAt: new Date(rating.created_at).toLocaleDateString(),
          updatedAt: new Date(rating.updated_at).toLocaleDateString()
        })) || [];

        setRatings(transformedRatings);
      } catch (err) {
        console.error('Error fetching user ratings:', err);
        setError('Failed to load your ratings');
        setRatings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRatings();
  }, [user]);

  const categories = ['all', 'crypto exchange', 'stock broker', 'forex broker', 'multi asset'];
  const ratingTypes = ['all', 'quick', 'category', 'overall', 'categories'];

  const filteredRatings = ratings.filter(rating => {
    const matchesSearch = rating.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || rating.category === selectedCategory;
    const matchesType = selectedRatingType === 'all' || rating.ratingType === selectedRatingType;
    return matchesSearch && matchesCategory && matchesType;
  });

  // Calculate stats from user's ratings
  const totalRatings = ratings.length;
  const avgRating = ratings.length > 0 
    ? (ratings.reduce((sum, rating) => sum + rating.overallRating, 0) / ratings.length).toFixed(1)
    : '0';
  const categoriesRated = new Set(ratings.map(r => r.category)).size;
  const recentRatings = ratings.filter(r => {
    const ratedDate = new Date(r.ratedAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return ratedDate >= thirtyDaysAgo;
  }).length;

  const renderStars = (rating: number, size: string = 'w-4 h-4') => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>My Deals</h1>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Loading your platform ratings...</p>
        </div>
        
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: 'var(--primary)' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading your ratings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>My Deals</h1>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Error loading your ratings</p>
        </div>
        
        <div className="bg-white rounded-xl border p-6 text-center" style={{ borderColor: 'var(--border)' }}>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg text-white"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>My Deals</h1>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
            View and manage your platform ratings and reviews
          </p>
        </div>
        <button 
          onClick={() => {
            // Navigate to platforms page to rate more
            window.location.href = '/deals';
          }}
          className="mt-4 lg:mt-0 px-6 py-3 rounded-lg font-medium text-white transition-all duration-300 hover:shadow-lg"
          style={{ 
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))'
          }}
        >
          Rate More Platforms
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4" style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Ratings</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
            {totalRatings}
          </p>
        </div>
        
        <div className="bg-white rounded-lg border p-4" style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Average Rating</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--warning)' }}>
            {avgRating}
          </p>
        </div>
        
        <div className="bg-white rounded-lg border p-4" style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Categories Rated</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--success)' }}>
            {categoriesRated}
          </p>
        </div>
        
        <div className="bg-white rounded-lg border p-4" style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Recent (30d)</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
            {recentRatings}
          </p>
        </div>
      </div>

      {/* Show message if no ratings */}
      {ratings.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center" style={{ borderColor: 'var(--border)' }}>
          <Star className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text)' }}>No ratings yet</h3>
          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
            You haven't rated any trading platforms yet. Start by rating platforms you've used.
          </p>
          <button
            onClick={() => window.location.href = '/deals'}
            className="px-6 py-3 rounded-lg font-medium text-white transition-all duration-300"
            style={{ 
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))'
            }}
          >
            Browse Platforms
          </button>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="bg-white rounded-xl border p-6" style={{ borderColor: 'var(--border)' }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                  <input
                    type="text"
                    placeholder="Search platforms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ 
                      borderColor: 'var(--border)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--primary)';
                      e.target.style.boxShadow = `0 0 0 2px rgba(30, 64, 175, 0.1)`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>
              
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ 
                    borderColor: 'var(--border)'
                  }}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <select
                  value={selectedRatingType}
                  onChange={(e) => setSelectedRatingType(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ 
                    borderColor: 'var(--border)'
                  }}
                >
                  {ratingTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : `${type.charAt(0).toUpperCase() + type.slice(1)} Rating`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Ratings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRatings.map((rating) => (
              <div key={rating.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow duration-300" style={{ borderColor: 'var(--border)' }}>
                {/* Platform Image */}
                <div className="relative">
                  <img
                    src={rating.logo}
                    alt={rating.companyName}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-2">
                    {renderStars(rating.overallRating, 'w-4 h-4')}
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {rating.ratingType} Rating
                    </span>
                  </div>
                </div>

                {/* Rating Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium px-2 py-1 rounded capitalize" style={{ 
                      backgroundColor: 'var(--surface)', 
                      color: 'var(--text-secondary)' 
                    }}>
                      {rating.category}
                    </span>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Rated {rating.ratedAt}</span>
                  </div>

                  <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>{rating.companyName}</h3>

                  {/* Category Ratings */}
                  {rating.ratingType === 'categories' && (
                    <div className="space-y-3 mb-4">
                      {rating.platformUsability && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Platform Usability</span>
                          {renderStars(rating.platformUsability, 'w-3 h-3')}
                        </div>
                      )}
                      {rating.customerSupport && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Customer Support</span>
                          {renderStars(rating.customerSupport, 'w-3 h-3')}
                        </div>
                      )}
                      {rating.feesCommissions && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Fees & Commissions</span>
                          {renderStars(rating.feesCommissions, 'w-3 h-3')}
                        </div>
                      )}
                      {rating.securityTrust && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Security & Trust</span>
                          {renderStars(rating.securityTrust, 'w-3 h-3')}
                        </div>
                      )}
                      {rating.educationalResources && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Educational Resources</span>
                          {renderStars(rating.educationalResources, 'w-3 h-3')}
                        </div>
                      )}
                      {rating.mobileApp && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Mobile App</span>
                          {renderStars(rating.mobileApp, 'w-3 h-3')}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Last updated: {rating.updatedAt}
                    </span>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          // Navigate to deals page
                          window.location.href = '/deals';
                        }}
                        className="px-4 py-2 rounded-lg transition-colors font-medium text-white hover:opacity-90"
                        style={{ backgroundColor: 'var(--primary)' }}
                      >
                        <div className="flex items-center gap-2">
                          <Edit3 className="w-4 h-4" />
                          <span>Edit Rating</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredRatings.length === 0 && ratings.length > 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--surface)' }}>
                <Search className="w-8 h-8" style={{ color: 'var(--text-secondary)' }} />
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text)' }}>No ratings found</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search criteria</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyDeals;