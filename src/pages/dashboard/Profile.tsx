// src/pages/dashboard/Profile.tsx
import React, { useState, useEffect } from 'react';
import { User, Mail, Save, Edit3, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import { supabase } from '../../lib/supabase';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  location?: string;
  general?: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
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

  // Clear success message after 3 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // Validation functions
  const validateFullName = (name: string): string | undefined => {
    if (!name.trim()) {
      return 'Full name is required';
    }
    if (name.trim().length < 2) {
      return 'Full name must be at least 2 characters';
    }
    if (name.trim().length > 50) {
      return 'Full name must be less than 50 characters';
    }
    if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) {
      return 'Full name can only contain letters, spaces, hyphens, and apostrophes';
    }
    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    if (!phone.trim()) {
      return undefined; // Phone is optional
    }
    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return 'Phone number must be at least 10 digits';
    }
    if (cleanPhone.length > 15) {
      return 'Phone number must be less than 15 digits';
    }
    // Basic international phone format validation
    if (!/^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      return 'Please enter a valid phone number';
    }
    return undefined;
  };

  const validateLocation = (location: string): string | undefined => {
    if (!location.trim()) {
      return undefined; // Location is optional
    }
    if (location.trim().length < 2) {
      return 'Location must be at least 2 characters';
    }
    if (location.trim().length > 100) {
      return 'Location must be less than 100 characters';
    }
    return undefined;
  };

  // Validate all fields
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    
    const fullNameError = validateFullName(formData.fullName);
    if (fullNameError) newErrors.fullName = fullNameError;
    
    const phoneError = validatePhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;
    
    const locationError = validateLocation(formData.location);
    if (locationError) newErrors.location = locationError;
    
    return newErrors;
  };

  // Check if form is valid
  const isFormValid = (): boolean => {
    const formErrors = validateForm();
    return Object.keys(formErrors).length === 0;
  };

  const handleSave = async () => {
    // Validate all fields
    const formErrors = validateForm();
    setErrors(formErrors);
    
    if (Object.keys(formErrors).length > 0) {
      // Mark all fields as touched to show errors
      setTouched(new Set(['fullName', 'phone', 'location']));
      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      // ✅ FIXED: Actually update user profile in Supabase
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName.trim(),
          phone: formData.phone.trim(),
          location: formData.location.trim(),
        }
      });

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      setIsEditing(false);
      setTouched(new Set());
      setShowSuccess(true);
      console.log('Profile updated successfully:', formData);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ 
        general: 'Failed to update profile. Please check your connection and try again.' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Real-time validation for touched fields
    if (touched.has(field)) {
      const newErrors = { ...errors };
      
      switch (field) {
        case 'fullName':
          const fullNameError = validateFullName(value);
          if (fullNameError) {
            newErrors.fullName = fullNameError;
          } else {
            delete newErrors.fullName;
          }
          break;
        case 'phone':
          const phoneError = validatePhone(value);
          if (phoneError) {
            newErrors.phone = phoneError;
          } else {
            delete newErrors.phone;
          }
          break;
        case 'location':
          const locationError = validateLocation(value);
          if (locationError) {
            newErrors.location = locationError;
          } else {
            delete newErrors.location;
          }
          break;
      }
      
      setErrors(newErrors);
    }
  };

  const handleFieldBlur = (field: string) => {
    setTouched(prev => new Set(prev).add(field));
    
    // Validate the field when it loses focus
    const newErrors = { ...errors };
    
    switch (field) {
      case 'fullName':
        const fullNameError = validateFullName(formData.fullName);
        if (fullNameError) {
          newErrors.fullName = fullNameError;
        } else {
          delete newErrors.fullName;
        }
        break;
      case 'phone':
        const phoneError = validatePhone(formData.phone);
        if (phoneError) {
          newErrors.phone = phoneError;
        } else {
          delete newErrors.phone;
        }
        break;
      case 'location':
        const locationError = validateLocation(formData.location);
        if (locationError) {
          newErrors.location = locationError;
        } else {
          delete newErrors.location;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleCancel = () => {
    // Reset form to original values
    setFormData({
      fullName: user?.user_metadata?.full_name || '',
      email: user?.email || '',
      phone: user?.user_metadata?.phone || '',
      location: user?.user_metadata?.location || '',
    });
    setIsEditing(false);
    setErrors({});
    setTouched(new Set());
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-green-800 font-medium">Profile updated successfully!</p>
            <p className="text-green-600 text-sm">Your changes have been saved.</p>
          </div>
        </div>
      )}

      {/* General Error Message */}
      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <div>
            <p className="text-red-800 font-medium">Error updating profile</p>
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        </div>
      )}

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
              onClick={handleCancel}
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
              disabled={isSaving || !isFormValid()}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-white transition-colors"
              style={{ 
                backgroundColor: (!isFormValid() || isSaving) ? 'var(--border)' : 'var(--success)',
                opacity: isSaving ? '0.7' : '1',
                cursor: (isSaving || !isFormValid()) ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!isSaving && isFormValid()) {
                  e.currentTarget.style.opacity = '0.9';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSaving && isFormValid()) {
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
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Full Name <span className="text-red-500">*</span>
            </label>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  onBlur={() => handleFieldBlur('fullName')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                    errors.fullName ? 'border-red-500 bg-red-50' : ''
                  }`}
                  style={{ 
                    borderColor: errors.fullName ? '#ef4444' : 'var(--border)',
                    color: 'var(--text)'
                  }}
                  onFocus={(e) => {
                    if (!errors.fullName) {
                      e.target.style.borderColor = 'var(--primary)';
                      e.target.style.boxShadow = `0 0 0 2px rgba(30, 64, 175, 0.1)`;
                    }
                  }}
                  onBlur={(e) => {
                    handleFieldBlur('fullName');
                    if (!errors.fullName) {
                      e.target.style.borderColor = 'var(--border)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                  placeholder="Enter your full name"
                  maxLength={50}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">{formData.fullName.length}/50 characters</p>
              </div>
            ) : (
              <p className="px-4 py-3 rounded-lg" style={{ 
                backgroundColor: 'var(--surface)', 
                color: 'var(--text)' 
              }}>
                {formData.fullName || 'Not provided'}
              </p>
            )}
          </div>

          {/* Email */}
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

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Phone Number
            </label>
            {isEditing ? (
              <div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  onBlur={() => handleFieldBlur('phone')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                    errors.phone ? 'border-red-500 bg-red-50' : ''
                  }`}
                  style={{ 
                    borderColor: errors.phone ? '#ef4444' : 'var(--border)',
                    color: 'var(--text)'
                  }}
                  onFocus={(e) => {
                    if (!errors.phone) {
                      e.target.style.borderColor = 'var(--primary)';
                      e.target.style.boxShadow = `0 0 0 2px rgba(30, 64, 175, 0.1)`;
                    }
                  }}
                  onBlur={(e) => {
                    handleFieldBlur('phone');
                    if (!errors.phone) {
                      e.target.style.borderColor = 'var(--border)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.phone}</span>
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">Optional - Include country code for international numbers</p>
              </div>
            ) : (
              <p className="px-4 py-3 rounded-lg" style={{ 
                backgroundColor: 'var(--surface)', 
                color: 'var(--text)' 
              }}>
                {formData.phone || 'Not provided'}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Location
            </label>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  onBlur={() => handleFieldBlur('location')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                    errors.location ? 'border-red-500 bg-red-50' : ''
                  }`}
                  style={{ 
                    borderColor: errors.location ? '#ef4444' : 'var(--border)',
                    color: 'var(--text)'
                  }}
                  onFocus={(e) => {
                    if (!errors.location) {
                      e.target.style.borderColor = 'var(--primary)';
                      e.target.style.boxShadow = `0 0 0 2px rgba(30, 64, 175, 0.1)`;
                    }
                  }}
                  onBlur={(e) => {
                    handleFieldBlur('location');
                    if (!errors.location) {
                      e.target.style.borderColor = 'var(--border)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                  placeholder="City, Country"
                  maxLength={100}
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.location}</span>
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">{formData.location.length}/100 characters</p>
              </div>
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

        {/* Form Help Text */}
        {isEditing && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Fields marked with <span className="text-red-500">*</span> are required. 
              Your profile information helps us provide you with better service and personalized recommendations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;