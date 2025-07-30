// src/pages/dashboard/Profile.tsx
import React, { useState, useEffect } from 'react';
import { User, Save, Edit3, AlertCircle, CheckCircle, ChevronDown, X } from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import { supabase } from '../../lib/supabase';
import { COUNTRIES, validateCountry } from '../../data/countries';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  country: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  location?: string;
  country?: string;
  general?: string;
}

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void;
  error?: string;
  disabled?: boolean;
}

// Reusable Country Select Component with improved mobile styling
const CountrySelect: React.FC<CountrySelectProps> = ({ 
  value, 
  onChange, 
  onBlur, 
  error, 
  disabled = false 
}) => {
  return (
    <div>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          className={`w-full px-3 py-3 sm:px-4 border rounded-lg focus:ring-2 focus:border-transparent transition-colors appearance-none bg-white text-sm sm:text-base ${
            error ? 'border-red-500 bg-red-50' : ''
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{ 
            borderColor: error ? '#ef4444' : 'var(--border)',
            color: 'var(--text)'
          }}
          onFocus={(e) => {
            if (!error && !disabled) {
              e.target.style.borderColor = 'var(--primary)';
              e.target.style.boxShadow = `0 0 0 2px rgba(30, 64, 175, 0.1)`;
            }
          }}
        >
          <option value="">Select a country</option>
          {COUNTRIES.map((country) => (
            <option key={country.code} value={country.name}>
              {country.name}
            </option>
          ))}
        </select>
        <ChevronDown 
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none ${
            disabled ? 'opacity-50' : ''
          }`} 
          style={{ color: 'var(--text-secondary)' }} 
        />
      </div>
      {error && (
        <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center space-x-1">
          <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="break-words">{error}</span>
        </p>
      )}
      <p className="mt-1 text-xs text-gray-500">Optional - Select your country</p>
    </div>
  );
};

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
    country: user?.user_metadata?.country || '',
  });

  // ✅ UPDATE: Load data from both auth metadata and database
  useEffect(() => {
    const loadProfileData = async () => {
      if (user) {
        // Start with auth metadata as fallback
        let profileData = {
          fullName: user?.user_metadata?.full_name || '',
          email: user?.email || '',
          phone: user?.user_metadata?.phone || '',
          location: user?.user_metadata?.location || '',
          country: user?.user_metadata?.country || '',
        };

        try {
          // Try to get more complete data from database
          const { data: dbProfile, error } = await supabase
            .from('user_profiles')
            .select('full_name, phone, location, country')
            .eq('id', user.id)
            .single();

          if (!error && dbProfile) {
            // Use database values if available, fallback to auth metadata
            profileData = {
              fullName: dbProfile.full_name || profileData.fullName,
              email: profileData.email, // Email stays from auth
              phone: dbProfile.phone || profileData.phone,
              location: dbProfile.location || profileData.location,
              country: dbProfile.country || profileData.country,
            };
          }
        } catch (error) {
          console.warn('Could not load profile from database, using auth metadata:', error);
        }

        setFormData(profileData);
      }
    };

    loadProfileData();
  }, [user]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // Validation functions (same as before)
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
    
    const countryError = validateCountry(formData.country);
    if (countryError) newErrors.country = countryError;
    
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
      setTouched(new Set(['fullName', 'phone', 'location', 'country']));
      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      // ✅ STEP 1: Update auth user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName.trim(),
          phone: formData.phone.trim(),
          location: formData.location.trim(),
          country: formData.country.trim(),
        }
      });

      if (authError) {
        console.error('Auth update error:', authError);
        throw authError;
      }

      // ✅ STEP 2: Update user_profiles table
      const { error: dbError } = await supabase
        .from('user_profiles')
        .update({
          full_name: formData.fullName.trim(),
          phone: formData.phone.trim(),
          location: formData.location.trim(),
          country: formData.country.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (dbError) {
        console.error('Database update error:', dbError);
        throw dbError;
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
        case 'country':
          const countryError = validateCountry(value);
          if (countryError) {
            newErrors.country = countryError;
          } else {
            delete newErrors.country;
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
      case 'country':
        const countryError = validateCountry(formData.country);
        if (countryError) {
          newErrors.country = countryError;
        } else {
          delete newErrors.country;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  // ✅ FIXED: Combined onBlur handlers
  const handleBlur = (field: string, e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    // Handle field validation
    handleFieldBlur(field);
    
    // Handle styling reset
    const fieldError = errors[field as keyof FormErrors];
    if (!fieldError) {
      e.target.style.borderColor = 'var(--border)';
      e.target.style.boxShadow = 'none';
    }
  };

  const handleCancel = async () => {
    // Reset form to original values from both sources
    if (user) {
      let profileData = {
        fullName: user?.user_metadata?.full_name || '',
        email: user?.email || '',
        phone: user?.user_metadata?.phone || '',
        location: user?.user_metadata?.location || '',
        country: user?.user_metadata?.country || '',
      };

      try {
        // Get current database values
        const { data: dbProfile, error } = await supabase
          .from('user_profiles')
          .select('full_name, phone, location, country')
          .eq('id', user.id)
          .single();

        if (!error && dbProfile) {
          profileData = {
            fullName: dbProfile.full_name || profileData.fullName,
            email: profileData.email,
            phone: dbProfile.phone || profileData.phone,
            location: dbProfile.location || profileData.location,
            country: dbProfile.country || profileData.country,
          };
        }
      } catch (error) {
        console.warn('Could not reload profile from database:', error);
      }

      setFormData(profileData);
    }

    setIsEditing(false);
    setErrors({});
    setTouched(new Set());
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Success Message - Mobile Optimized */}
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-green-800 font-medium text-sm sm:text-base">Profile updated successfully!</p>
              <p className="text-green-600 text-xs sm:text-sm">Your changes have been saved.</p>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="text-green-600 hover:text-green-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* General Error Message - Mobile Optimized */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-red-800 font-medium text-sm sm:text-base">Error updating profile</p>
              <p className="text-red-600 text-xs sm:text-sm break-words">{errors.general}</p>
            </div>
            <button
              onClick={() => setErrors(prev => ({ ...prev, general: undefined }))}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header - Responsive Stack */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold truncate" style={{ color: 'var(--text)' }}>
              Profile
            </h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
              Manage your account settings and preferences
            </p>
          </div>
          
          {/* Action Buttons - Mobile Stack */}
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center justify-center space-x-2 w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-lg font-medium text-white transition-colors text-sm sm:text-base"
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
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="flex-1 sm:flex-none px-4 py-2.5 sm:py-2 border rounded-lg transition-colors text-sm sm:text-base"
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
                className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 sm:py-2 rounded-lg font-medium text-white transition-colors text-sm sm:text-base"
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

        {/* Profile Information - Mobile Optimized */}
        <div className="bg-white rounded-xl border p-4 sm:p-6" style={{ borderColor: 'var(--border)' }}>
          {/* Profile Header - Responsive Layout */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto sm:mx-0 rounded-full flex items-center justify-center flex-shrink-0" style={{
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))'
            }}>
              <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            <div className="text-center sm:text-left flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold truncate" style={{ color: 'var(--text)' }}>
                {formData.fullName || 'Your Name'}
              </h2>
              <p className="text-sm sm:text-base break-all sm:break-words" style={{ color: 'var(--text-secondary)' }}>
                {formData.email}
              </p>
              <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--primary)' }}>
                Member since {new Date(user?.created_at || '').toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Form Fields - Mobile-First Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Full Name */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Full Name <span className="text-red-500">*</span>
              </label>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`w-full px-3 py-3 sm:px-4 border rounded-lg focus:ring-2 focus:border-transparent transition-colors text-sm sm:text-base ${
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
                    onBlur={(e) => handleBlur('fullName', e)}
                    placeholder="Enter your full name"
                    maxLength={50}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="break-words">{errors.fullName}</span>
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">{formData.fullName.length}/50 characters</p>
                </div>
              ) : (
                <p className="px-3 py-3 sm:px-4 rounded-lg text-sm sm:text-base break-words" style={{ 
                  backgroundColor: 'var(--surface)', 
                  color: 'var(--text)' 
                }}>
                  {formData.fullName || 'Not provided'}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Email Address
              </label>
              <p className="px-3 py-3 sm:px-4 rounded-lg text-sm sm:text-base break-all" style={{ 
                backgroundColor: 'var(--surface)', 
                color: 'var(--text)' 
              }}>
                {formData.email}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                Email cannot be changed
              </p>
            </div>

            {/* Phone */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Phone Number
              </label>
              {isEditing ? (
                <div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-3 py-3 sm:px-4 border rounded-lg focus:ring-2 focus:border-transparent transition-colors text-sm sm:text-base ${
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
                    onBlur={(e) => handleBlur('phone', e)}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="break-words">{errors.phone}</span>
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Optional - Include country code for international numbers
                  </p>
                </div>
              ) : (
                <p className="px-3 py-3 sm:px-4 rounded-lg text-sm sm:text-base break-words" style={{ 
                  backgroundColor: 'var(--surface)', 
                  color: 'var(--text)' 
                }}>
                  {formData.phone || 'Not provided'}
                </p>
              )}
            </div>

            {/* Country */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Country
              </label>
              {isEditing ? (
                <CountrySelect
                  value={formData.country}
                  onChange={(value) => handleInputChange('country', value)}
                  onBlur={(e) => handleBlur('country', e)}
                  error={errors.country}
                />
              ) : (
                <p className="px-3 py-3 sm:px-4 rounded-lg text-sm sm:text-base break-words" style={{ 
                  backgroundColor: 'var(--surface)', 
                  color: 'var(--text)' 
                }}>
                  {formData.country || 'Not provided'}
                </p>
              )}
            </div>

            {/* Location/City - Full Width on Large Screens */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                City/Location
              </label>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className={`w-full px-3 py-3 sm:px-4 border rounded-lg focus:ring-2 focus:border-transparent transition-colors text-sm sm:text-base ${
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
                    onBlur={(e) => handleBlur('location', e)}
                    placeholder="Enter your city"
                    maxLength={100}
                  />
                  {errors.location && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="break-words">{errors.location}</span>
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">{formData.location.length}/100 characters</p>
                </div>
              ) : (
                <p className="px-3 py-3 sm:px-4 rounded-lg text-sm sm:text-base break-words" style={{ 
                  backgroundColor: 'var(--surface)', 
                  color: 'var(--text)' 
                }}>
                  {formData.location || 'Not provided'}
                </p>
              )}
            </div>
          </div>

          {/* Form Help Text - Mobile Optimized */}
          {isEditing && (
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs sm:text-sm text-blue-800">
                <strong>Note:</strong> Fields marked with <span className="text-red-500">*</span> are required. 
                Your profile information helps us provide you with better service and personalized recommendations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;