// src/pages/dashboard/Dashboard.tsx
import React from 'react';
import { Star, Users, Award, TrendingUp, BarChart3, Settings, RefreshCw } from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import { useDealsQuery } from '../../hooks/queries/useDealsQuery';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const dealsQuery = useDealsQuery();
  
  const deals = dealsQuery.data?.deals || [];
  const companies = dealsQuery.data?.companies || [];

  // Calculate real stats from database - Rating focused
  const totalPlatforms = companies.length;
  const activePlatforms = companies.filter(c => c.status === 'active').length;
  const avgPlatformRating = companies.length > 0 
    ? (companies.reduce((sum, c) => sum + (c.overall_rating || 0), 0) / companies.length).toFixed(1)
    : '0.0';
  const totalReviews = companies.reduce((sum, c) => sum + (c.total_reviews || 0), 0);

  // Get top rated platforms
  const topRatedPlatforms = companies
    .filter(c => c.overall_rating > 0)
    .sort((a, b) => (b.overall_rating || 0) - (a.overall_rating || 0))
    .slice(0, 4)
    .map(company => ({
      id: company.id,
      name: company.name,
      category: company.category?.replace('_', ' ') || 'Trading',
      rating: company.overall_rating?.toFixed(1) || '0.0',
      reviews: company.total_reviews || 0
    }));

  // Get platform categories distribution
  const categoryStats = companies.reduce((acc, company) => {
    const category = company.category?.replace('_', ' ') || 'Unknown';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([category, count]) => ({ category, count }));

  if (dealsQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Dashboard</h1>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Loading your rating platform overview...</p>
        </div>
        
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: 'var(--primary)' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (dealsQuery.error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Dashboard</h1>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Error loading dashboard data</p>
        </div>
        
        <div className="bg-white rounded-xl border p-6 text-center" style={{ borderColor: 'var(--border)' }}>
          <p className="text-red-600 mb-4">Failed to load dashboard data</p>
          <button
            onClick={() => dealsQuery.refetch()}
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
      <div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Dashboard</h1>
        <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
          Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}! Here's your platform rating overview.
        </p>
      </div>

      {/* Stats Grid - Rating focused data from database */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow duration-300" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Total Platforms</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{totalPlatforms}</p>
              <p className="text-sm font-medium mt-1" style={{ color: 'var(--success)' }}>
                Available to rate
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary-muted)' }}>
              <Users className="w-6 h-6" style={{ color: 'var(--primary)' }} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow duration-300" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Active Platforms</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{activePlatforms}</p>
              <p className="text-sm font-medium mt-1" style={{ color: 'var(--success)' }}>
                Currently active
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--secondary-muted)' }}>
              <TrendingUp className="w-6 h-6" style={{ color: 'var(--secondary)' }} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow duration-300" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Total Reviews</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{totalReviews.toLocaleString()}</p>
              <p className="text-sm font-medium mt-1" style={{ color: 'var(--warning)' }}>
                Community reviews
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--warning-muted)' }}>
              <Award className="w-6 h-6" style={{ color: 'var(--warning)' }} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow duration-300" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Avg. Platform Rating</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{avgPlatformRating}</p>
              <p className="text-sm font-medium mt-1" style={{ color: 'var(--success)' }}>
                Overall quality
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--success-muted)' }}>
              <Star className="w-6 h-6" style={{ color: 'var(--success)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Rated Platforms */}
        <div className="bg-white rounded-xl border p-6" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>Top Rated Platforms</h2>
            <button className="text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: 'var(--primary)' }}>
              View All
            </button>
          </div>
          
          {topRatedPlatforms.length > 0 ? (
            <div className="space-y-4">
              {topRatedPlatforms.map((platform, index) => (
                <div key={platform.id} className="flex items-center justify-between p-4 rounded-lg hover:opacity-90 transition-colors" style={{ backgroundColor: 'var(--surface)' }}>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{
                      background: 'linear-gradient(135deg, var(--primary), var(--secondary))'
                    }}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium" style={{ color: 'var(--text)' }}>{platform.name}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm capitalize" style={{ color: 'var(--text-secondary)' }}>{platform.category}</span>
                        <span className="text-sm font-medium" style={{ color: 'var(--primary)' }}>{platform.reviews} reviews</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium" style={{ color: 'var(--text)' }}>{platform.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Star className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--text-secondary)' }} />
              <p style={{ color: 'var(--text-secondary)' }}>No rated platforms yet</p>
            </div>
          )}
        </div>

        {/* Platform Categories */}
        <div className="bg-white rounded-xl border p-6" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text)' }}>Platform Categories</h2>
          
          {topCategories.length > 0 ? (
            <div className="space-y-4">
              {topCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                      backgroundColor: `var(--${['primary', 'secondary', 'warning'][index]}-muted)`
                    }}>
                      <Users className="w-4 h-4" style={{ 
                        color: `var(--${['primary', 'secondary', 'warning'][index]})`
                      }} />
                    </div>
                    <div>
                      <h3 className="font-medium capitalize" style={{ color: 'var(--text)' }}>{category.category}</h3>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Trading category</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold" style={{ color: 'var(--text)' }}>{category.count}</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>platforms</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--text-secondary)' }} />
              <p style={{ color: 'var(--text-secondary)' }}>No categories available</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl p-6 border" style={{ 
        background: 'linear-gradient(135deg, var(--primary-muted), var(--secondary-muted))',
        borderColor: 'var(--primary)'
      }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text)' }}>Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => window.location.href = '/deals'}
            className="bg-white hover:opacity-90 p-4 rounded-lg border text-left transition-colors" 
            style={{ borderColor: 'var(--border)' }}
          >
            <Users className="w-6 h-6 mb-2" style={{ color: 'var(--primary)' }} />
            <h3 className="font-medium" style={{ color: 'var(--text)' }}>Browse Platforms</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Discover and rate trading platforms</p>
          </button>
          <button 
            onClick={() => window.location.href = '/my-deals'}
            className="bg-white hover:opacity-90 p-4 rounded-lg border text-left transition-colors" 
            style={{ borderColor: 'var(--border)' }}
          >
            <Star className="w-6 h-6 mb-2" style={{ color: 'var(--secondary)' }} />
            <h3 className="font-medium" style={{ color: 'var(--text)' }}>My Ratings</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>View and manage your platform ratings</p>
          </button>
          <button 
            onClick={() => window.location.href = '/profile'}
            className="bg-white hover:opacity-90 p-4 rounded-lg border text-left transition-colors" 
            style={{ borderColor: 'var(--border)' }}
          >
            <Settings className="w-6 h-6 mb-2" style={{ color: 'var(--warning)' }} />
            <h3 className="font-medium" style={{ color: 'var(--text)' }}>Profile Settings</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Manage your account preferences</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;