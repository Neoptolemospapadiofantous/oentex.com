// src/pages/dashboard/Profile.tsx
import React, { useState, useEffect } from 'react';
import { User, Mail, Save, Edit3 } from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import { supabase } from '../../lib/supabase';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    location: user?.user_metadata?.location || '',
  });

  // ✅ UPDATE: Sync form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user?.user_metadata?.full_name || '',
        email: user?.email || '',
        phone: user?.user_metadata?.phone || '',
        location: user?.user_metadata?.location || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // ✅ FIXED: Actually update user profile in Supabase
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
          phone: formData.phone,
          location: formData.location,
        }
      });

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      setIsEditing(false);
      console.log('Profile updated successfully:', formData);
      
      // Note: The user context should automatically refresh with the new data
      
    } catch (error) {
      console.error('Error updating profile:', error);
      // Keep editing mode active on error
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Profile</h1>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Manage your account settings and preferences</p>
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
              disabled={isSaving}
              className="px-4 py-2 border rounded-lg transition-colors"
              style={{ 
                borderColor: 'var(--border)', 
                color: 'var(--text-secondary)',
                opacity: isSaving ? '0.5' : '1',
                cursor: isSaving ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.backgroundColor = 'var(--surface)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-white transition-colors"
              style={{ 
                backgroundColor: 'var(--success)',
                opacity: isSaving ? '0.7' : '1',
                cursor: isSaving ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.opacity = '0.9';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.opacity = '1';
                }
              }}
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
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
        </div>
      </div>
    </div>
  );
};

export default Profile;