// src/pages/dashboard/Profile.tsx
import React, { useState, useCallback } from 'react';
import { User, Mail, Save, Edit3, Star } from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import { RatingModal } from '../../components/rating/RatingModal';
import { useDealsQuery, useUserRatingsQuery } from '../../hooks/queries/useDealsQuery';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  
  // Rating functionality
  const dealsQuery = useDealsQuery();
  const companies = dealsQuery.data?.companies || [];
  const companyIds = companies.map(c => c.id).filter(Boolean) as string[];
  const userRatingsQuery = useUserRatingsQuery(user?.id, companyIds);
  
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    location: user?.user_metadata?.location || '',
    bio: user?.user_metadata?.bio || '',
    website: user?.user_metadata?.website || '',
  });

  const handleSave = async () => {
    try {
      // Update user profile in Supabase
      // Note: You'll need to implement this with your supabase client
      /*
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
          website: formData.website,
        }
      });

      if (error) throw error;
      */

      setIsEditing(false);
      // toast.success('Profile updated successfully!');
      console.log('Profile updated:', formData);
    } catch (error) {
      console.error('Error updating profile:', error);
      // toast.error('Failed to update profile');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Rating functionality
  const handleRateClick = useCallback((company: any) => {
    setSelectedCompany(company);
    setShowRatingModal(true);
  }, []);

  const handleRatingSubmitted = useCallback(() => {
    setShowRatingModal(false);
    setSelectedCompany(null);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Profile</h1>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Manage your account settings and rating preferences</p>
        </div>
        
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-white transition-colors"
            style={{ backgroundColor: 'var(--primary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary)';
            }}
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border rounded-lg transition-colors"
              style={{ 
                borderColor: 'var(--border)', 
                color: 'var(--text-secondary)' 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-white transition-colors"
              style={{ backgroundColor: 'var(--success)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-xl border p-6" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))'
          }}>
            <User className="w-12 h-12 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
              {formData.fullName || 'Your Name'}
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>{formData.email}</p>
            <p className="text-sm" style={{ color: 'var(--primary)' }}>
              Member since {new Date(user?.created_at || '').toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                style={{ 
                  borderColor: 'var(--border)',
                  color: 'var(--text)'
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
            ) : (
              <p className="px-4 py-3 rounded-lg" style={{ 
                backgroundColor: 'var(--surface)', 
                color: 'var(--text)' 
              }}>
                {formData.fullName || 'Not provided'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Email Address
            </label>
            <p className="px-4 py-3 rounded-lg" style={{ 
              backgroundColor: 'var(--surface)', 
              color: 'var(--text)' 
            }}>
              {formData.email}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                style={{ 
                  borderColor: 'var(--border)',
                  color: 'var(--text)'
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
            ) : (
              <p className="px-4 py-3 rounded-lg" style={{ 
                backgroundColor: 'var(--surface)', 
                color: 'var(--text)' 
              }}>
                {formData.phone || 'Not provided'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Location
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                style={{ 
                  borderColor: 'var(--border)',
                  color: 'var(--text)'
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
            ) : (
              <p className="px-4 py-3 rounded-lg" style={{ 
                backgroundColor: 'var(--surface)', 
                color: 'var(--text)' 
              }}>
                {formData.location || 'Not provided'}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Bio
            </label>
            {isEditing ? (
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                style={{ 
                  borderColor: 'var(--border)',
                  color: 'var(--text)'
                }}
                placeholder="Tell us about your trading experience..."
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary)';
                  e.target.style.boxShadow = `0 0 0 2px rgba(30, 64, 175, 0.1)`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            ) : (
              <p className="px-4 py-3 rounded-lg" style={{ 
                backgroundColor: 'var(--surface)', 
                color: 'var(--text)' 
              }}>
                {formData.bio || 'No bio provided'}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Website
            </label>
            {isEditing ? (
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                style={{ 
                  borderColor: 'var(--border)',
                  color: 'var(--text)'
                }}
                placeholder="https://yourwebsite.com"
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary)';
                  e.target.style.boxShadow = `0 0 0 2px rgba(30, 64, 175, 0.1)`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            ) : (
              <p className="px-4 py-3 rounded-lg" style={{ 
                backgroundColor: 'var(--surface)', 
                color: 'var(--text)' 
              }}>
                {formData.website || 'Not provided'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Rating Statistics */}
      <div className="bg-white rounded-xl border p-6" style={{ borderColor: 'var(--border)' }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>Your Rating Statistics</h3>
        
        {dealsQuery.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center p-4 rounded-lg animate-pulse" style={{ backgroundColor: 'var(--surface)' }}>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--surface)' }}>
              <p className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
                {companies.filter(c => c.status === 'active').length}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Available Platforms</p>
            </div>
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--surface)' }}>
              <p className="text-2xl font-bold" style={{ color: 'var(--success)' }}>
                {userRatingsQuery.data?.size || 0}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Platforms You've Rated</p>
            </div>
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--surface)' }}>
              <p className="text-2xl font-bold" style={{ color: 'var(--warning)' }}>
                {companies.length > 0 
                  ? (companies.reduce((sum, c) => sum + (c.overall_rating || 0), 0) / companies.length).toFixed(1)
                  : '0.0'}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Avg. Platform Rating</p>
            </div>
          </div>
        )}
      </div>

      {/* Rate Trading Platforms Section */}
      <div className="bg-white rounded-xl border p-6" style={{ borderColor: 'var(--border)' }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>Rate Trading Platforms</h3>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
          Help the community by rating trading platforms you've used
        </p>
        
        {dealsQuery.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4 animate-pulse" style={{ borderColor: 'var(--border)' }}>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-3"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : companies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.slice(0, 6).map((company) => {
              const userRating = userRatingsQuery.data?.get(company.id);
              return (
                <div key={company.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium" style={{ color: 'var(--text)' }}>{company.name}</h4>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {company.overall_rating?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm mb-3 capitalize" style={{ color: 'var(--text-secondary)' }}>
                    {company.category?.replace('_', ' ') || 'Trading platform'}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 rounded capitalize" style={{ 
                      backgroundColor: 'var(--surface)', 
                      color: 'var(--text-secondary)' 
                    }}>
                      {company.category?.replace('_', ' ') || 'Trading'}
                    </span>
                    
                    <button
                      onClick={() => handleRateClick(company)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        userRating 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'text-white hover:opacity-90'
                      }`}
                      style={!userRating ? {
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))'
                      } : {}}
                    >
                      {userRating ? 'Update Rating' : 'Rate Platform'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Star className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--text-secondary)' }} />
            <p style={{ color: 'var(--text-secondary)' }}>No trading platforms available to rate</p>
          </div>
        )}
        
        {companies.length > 6 && (
          <div className="text-center mt-6">
            <button
              onClick={() => window.location.href = '/deals'}
              className="text-sm font-medium hover:opacity-80 transition-opacity"
              style={{ color: 'var(--primary)' }}
            >
              View all {companies.length} platforms →
            </button>
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && selectedCompany && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => {
            setShowRatingModal(false);
            setSelectedCompany(null);
          }}
          companyId={selectedCompany.id}
          companyName={selectedCompany.name}
          existingRating={userRatingsQuery.data?.get(selectedCompany.id)}
          onRatingSubmitted={handleRatingSubmitted}
          companyRating={{
            averageRating: selectedCompany.overall_rating || 0,
            totalRatings: selectedCompany.total_reviews || 0
          }}
        />
      )}
    </div>
  );
};

export default Profile;