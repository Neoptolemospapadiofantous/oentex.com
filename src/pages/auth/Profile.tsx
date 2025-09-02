// src/pages/auth/Profile.tsx - AUTHENTICATED VERSION
import React, { useState } from 'react'
import { User, Mail, Shield, Key, Save, Edit3, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../lib/authContext'
import toast from 'react-hot-toast'

const Profile: React.FC = () => {
  const { user, updateProfile, updatePassword } = useAuth()
  
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || ''
  })
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = async () => {
    if (!formData.fullName.trim()) {
      toast.error('Full name is required')
      return
    }

    setIsLoading(true)
    try {
      await updateProfile({
        data: { full_name: formData.fullName.trim() }
      })
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('All password fields are required')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long')
      return
    }

    setIsLoading(true)
    try {
      await updatePassword(passwordData.newPassword)
      toast.success('Password changed successfully!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setIsChangingPassword(false)
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error('Failed to change password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const cancelEdit = () => {
    setFormData({
        fullName: user?.user_metadata?.full_name || '',
      email: user?.email || ''
    })
    setIsEditing(false)
  }

  const cancelPasswordChange = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setIsChangingPassword(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your account information and security settings
            </p>
          </div>
          
      {/* Profile Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              Edit
              </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
              </label>
              {isEditing ? (
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your full name"
              />
            ) : (
              <p className="text-gray-900">
                {user?.user_metadata?.full_name || 'Not set'}
                </p>
              )}
            </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
            <p className="text-gray-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              {user?.email}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Email address cannot be changed
              </p>
            </div>

          {isEditing && (
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={cancelEdit}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
                </div>
          {!isChangingPassword && (
            <button
              onClick={() => setIsChangingPassword(true)}
              className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              <Key className="w-4 h-4" />
              Change Password
            </button>
              )}
            </div>

        {isChangingPassword ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Password must be at least 6 characters long
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
                  <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Confirm new password"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleChangePassword}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Key className="w-4 h-4" />
                {isLoading ? 'Changing...' : 'Change Password'}
              </button>
              <button
                onClick={cancelPasswordChange}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
                </div>
              ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Password</h3>
                <p className="text-sm text-gray-600">Last changed: Never</p>
              </div>
              <div className="text-sm text-gray-500">
                • • • • • • • •
            </div>
          </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600">Add an extra layer of security</p>
              </div>
              <div className="text-sm text-gray-500">
                Not enabled
              </div>
            </div>
            </div>
          )}
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">User ID</h3>
              <p className="text-sm text-gray-600">Unique identifier for your account</p>
            </div>
            <div className="text-sm text-gray-500 font-mono">
              {user?.id?.slice(0, 8)}...
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Account Created</h3>
              <p className="text-sm text-gray-600">When you joined Oentex</p>
            </div>
            <div className="text-sm text-gray-500">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Last Sign In</h3>
              <p className="text-sm text-gray-600">Most recent authentication</p>
            </div>
            <div className="text-sm text-gray-500">
              {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Unknown'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile