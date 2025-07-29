// src/pages/dashboard/Dashboard.tsx (TOAST REMOVED)
import React from 'react';
import { Star, Users, Award, TrendingUp, Settings, RefreshCw } from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import { useDealsQuery } from '../../hooks/queries/useDealsQuery';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const dealsQuery = useDealsQuery();

  // Rest of your dashboard code...
  const deals = dealsQuery.data?.deals || [];
  const companies = dealsQuery.data?.companies || [];

  const totalPlatforms = companies.length;
  const activePlatforms = companies.filter(c => c.status === 'active').length;
  const avgPlatformRating = companies.length > 0 
    ? (companies.reduce((sum, c) => sum + (c.overall_rating || 0), 0) / companies.length).toFixed(1)
    : '0.0';
  const totalReviews = companies.reduce((sum, c) => sum + (c.total_reviews || 0), 0);

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

  const categoryStats = companies.reduce((acc, company) => {
    const category = company.category?.replace('_', ' ') || 'Unknown';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryStats)
    .sort(([,a], [,b]) => b - a)
    .map(([category, count]) => ({ category, count }));

  if (dealsQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Loading your platform overview...</p>
        </div>
        
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (dealsQuery.error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Error loading dashboard data</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <p className="text-red-600 mb-4">Failed to load dashboard data</p>
          <button
            onClick={() => dealsQuery.refetch()}
            className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}! Here's your platform overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Platforms</p>
              <p className="text-2xl font-bold text-gray-900">{totalPlatforms}</p>
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
              <p className="text-2xl font-bold text-gray-900">{activePlatforms}</p>
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
              <p className="text-2xl font-bold text-gray-900">{totalReviews.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-gray-900">{avgPlatformRating}</p>
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
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Top Rated Platforms</h2>
            <button className="text-sm font-medium text-blue-600 hover:opacity-80 transition-opacity">View All</button>
          </div>
          
          {topRatedPlatforms.length > 0 ? (
            <div className="space-y-4">
              {topRatedPlatforms.map((platform, index) => (
                <div key={platform.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:opacity-90 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{platform.name}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm capitalize text-gray-600">{platform.category}</span>
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

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Platform Categories</h2>
          
          {topCategories.length > 0 ? (
            <div className="space-y-4">
              {topCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      index % 3 === 0 ? 'bg-blue-100' : index % 3 === 1 ? 'bg-green-100' : 'bg-amber-100'
                    }`}>
                      <Users className={`w-4 h-4 ${
                        index % 3 === 0 ? 'text-blue-600' : index % 3 === 1 ? 'text-green-600' : 'text-amber-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-medium capitalize text-gray-900">{category.category}</h3>
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

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => window.location.href = '/deals'} 
            className="bg-white hover:bg-gray-50 p-4 rounded-lg border border-gray-200 text-left transition-colors"
          >
            <Users className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-medium text-gray-900">Browse Platforms</h3>
            <p className="text-sm text-gray-600">Discover and rate trading platforms</p>
          </button>
          
          <button 
            onClick={() => window.location.href = '/my-deals'} 
            className="bg-white hover:bg-gray-50 p-4 rounded-lg border border-gray-200 text-left transition-colors"
          >
            <Star className="w-6 h-6 text-green-600 mb-2" />
            <h3 className="font-medium text-gray-900">My Ratings</h3>
            <p className="text-sm text-gray-600">View and manage your platform ratings</p>
          </button>
          
          <button 
            onClick={() => window.location.href = '/profile'} 
            className="bg-white hover:bg-gray-50 p-4 rounded-lg border border-gray-200 text-left transition-colors"
          >
            <Settings className="w-6 h-6 text-amber-600 mb-2" />
            <h3 className="font-medium text-gray-900">Profile Settings</h3>
            <p className="text-sm text-gray-600">Manage your account preferences</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;