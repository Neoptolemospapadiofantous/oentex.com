// src/pages/auth/Profile.tsx - IMPROVED VERSION
import React, { useState } from 'react'
import { Icons } from '@components/icons'
import { useAuth } from '../../lib/authContext'
import { showErrorToast, showSuccessToast } from '../../components/ui/AppToast'

const Profile: React.FC = () => {
  const { user, updatePassword } = useAuth()
  
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
      showErrorToast('Full name is required')
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000))
      showSuccessToast('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      showErrorToast('Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showErrorToast('All password fields are required')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showErrorToast('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      showErrorToast('New password must be at least 6 characters long')
      return
    }

    setIsLoading(true)
    try {
      await updatePassword(passwordData.newPassword)
      showSuccessToast('Password changed successfully!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setIsChangingPassword(false)
    } catch (error) {
      console.error('Error changing password:', error)
      showErrorToast('Failed to change password. Please try again.')
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
    <div className="min-h-screen">
      <div className="container-page section-py-xl">
        {/* Header */}
        <div className="text-center mb-4xl">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-lg">
            Profile Settings
          </h1>
          <p className="text-xl text-foreground/70 mb-sm">
            Manage your account information and security settings
          </p>
        </div>
          
        {/* Profile Information Card */}
        <div className="bg-content1/80 backdrop-blur-2xl rounded-3xl border border-divider/40 container-p-2xl hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group mb-2xl">
          <div className="flex items-center justify-between mb-2xl">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-sm group-hover:text-primary transition-colors duration-300">
                Profile Information
              </h2>
              <p className="text-foreground/60">Manage your personal details</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Icons.user className="w-6 h-6 text-primary" />
            </div>
          </div>

          <div className="space-y-lg">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-sm">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full container-px-lg container-py-lg border border-divider rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary text-base bg-content2/50 transition-all duration-300"
                  placeholder="Enter your full name"
                />
              ) : (
                <p className="text-lg text-foreground container-p-lg bg-content2/30 rounded-2xl">
                  {user?.user_metadata?.full_name || 'Not set'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-sm">
                Email Address
              </label>
              <div className="container-p-lg bg-content2/30 rounded-2xl">
                <p className="text-lg text-foreground flex items-center gap-md">
                  <Icons.mail className="w-5 h-5 text-primary" />
                  {user?.email}
                </p>
                <p className="text-sm text-foreground/60 mt-sm">
                  Email address cannot be changed
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-lg pt-xl border-t border-divider/30">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-primary to-primary/80 text-white container-px-2xl container-py-lg rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-105"
                >
                  <Icons.edit className="w-5 h-5 mr-sm" />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-primary to-primary/80 text-white container-px-2xl container-py-lg rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 hover:scale-105"
                  >
                    <Icons.check className="w-5 h-5 mr-sm" />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-content2 hover:bg-content3 text-foreground container-px-2xl container-py-lg rounded-2xl font-semibold text-lg transition-all duration-300"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Security Settings Card */}
        <div className="bg-content1/80 backdrop-blur-2xl rounded-3xl border border-divider/40 container-p-2xl hover:shadow-2xl hover:shadow-success/5 transition-all duration-500 group mb-2xl">
          <div className="flex items-center justify-between mb-2xl">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-sm group-hover:text-success transition-colors duration-300">
                Security Settings
              </h2>
              <p className="text-foreground/60">Manage your account security</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-success/20 to-success/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Icons.shield className="w-6 h-6 text-success" />
            </div>
          </div>

          {!isChangingPassword ? (
            <div className="space-y-lg">
              {/* Password Info */}
              <div className="flex items-center justify-between container-p-lg bg-content2/30 rounded-2xl hover:bg-content2/50 transition-all duration-300">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Password</h3>
                  <p className="text-sm text-foreground/60">Last changed: Never</p>
                </div>
                <div className="text-lg text-foreground/50 font-mono">
                  •••••••••••
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="flex items-center justify-between container-p-lg bg-content2/30 rounded-2xl hover:bg-content2/50 transition-all duration-300">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Two-Factor Authentication</h3>
                  <p className="text-sm text-foreground/60">Add an extra layer of security</p>
                </div>
                <div className="text-sm text-foreground/60 bg-content1/50 container-px-lg container-py-sm rounded-xl">
                  Not enabled
                </div>
              </div>

              {/* Change Password Button */}
              <div className="pt-xl border-t border-divider/30">
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="bg-gradient-to-r from-success to-success/80 text-white container-px-2xl container-py-lg rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-success/25 hover:scale-105"
                >
                  <Icons.key className="w-5 h-5 mr-sm" />
                  Change Password
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-lg">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-sm">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    className="w-full container-px-lg container-py-lg pr-12 border border-divider rounded-2xl focus:ring-2 focus:ring-success focus:border-success text-base bg-content2/50 transition-all duration-300"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-foreground/60 hover:text-foreground transition-colors duration-200"
                  >
                    {showPassword ? <Icons.eyeOff className="w-5 h-5" /> : <Icons.eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-sm">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    className="w-full container-px-lg container-py-lg pr-12 border border-divider rounded-2xl focus:ring-2 focus:ring-success focus:border-success text-base bg-content2/50 transition-all duration-300"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-foreground/60 hover:text-foreground transition-colors duration-200"
                  >
                    {showNewPassword ? <Icons.eyeOff className="w-5 h-5" /> : <Icons.eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-sm text-foreground/60 mt-sm">
                  Password must be at least 6 characters long
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-sm">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  className="w-full container-px-lg container-py-lg border border-divider rounded-2xl focus:ring-2 focus:ring-success focus:border-success text-base bg-content2/50 transition-all duration-300"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="flex gap-lg pt-xl border-t border-divider/30">
                <button
                  onClick={handleChangePassword}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-success to-success/80 text-white container-px-2xl container-py-lg rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-success/25 disabled:opacity-50 hover:scale-105"
                >
                  <Icons.key className="w-5 h-5 mr-sm" />
                  {isLoading ? 'Changing...' : 'Change Password'}
                </button>
                <button
                  onClick={cancelPasswordChange}
                  className="bg-content2 hover:bg-content3 text-foreground container-px-2xl container-py-lg rounded-2xl font-semibold text-lg transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Account Information Card */}
        <div className="bg-content1/80 backdrop-blur-2xl rounded-3xl border border-divider/40 container-p-2xl hover:shadow-2xl hover:shadow-secondary/5 transition-all duration-500 group">
          <div className="flex items-center justify-between mb-2xl">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-sm group-hover:text-secondary transition-colors duration-300">
                Account Information
              </h2>
              <p className="text-foreground/60">View your account details</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Icons.user className="w-6 h-6 text-secondary" />
            </div>
          </div>

          <div className="space-y-lg">
            <div className="flex items-center justify-between container-p-lg bg-content2/30 rounded-2xl hover:bg-content2/50 transition-all duration-300">
              <div>
                <h3 className="text-lg font-semibold text-foreground">User ID</h3>
                <p className="text-sm text-foreground/60">Unique identifier for your account</p>
              </div>
              <div className="text-lg text-foreground/80 font-mono bg-content1/50 container-px-lg container-py-sm rounded-xl">
                {user?.id?.slice(0, 8)}...
              </div>
            </div>

            <div className="flex items-center justify-between container-p-lg bg-content2/30 rounded-2xl hover:bg-content2/50 transition-all duration-300">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Account Created</h3>
                <p className="text-sm text-foreground/60">When you joined Oentex</p>
              </div>
              <div className="text-lg text-foreground/80 bg-content1/50 container-px-lg container-py-sm rounded-xl">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
              </div>
            </div>

            <div className="flex items-center justify-between container-p-lg bg-content2/30 rounded-2xl hover:bg-content2/50 transition-all duration-300">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Last Sign In</h3>
                <p className="text-sm text-foreground/60">Most recent authentication</p>
              </div>
              <div className="text-lg text-foreground/80 bg-content1/50 container-px-lg container-py-sm rounded-xl">
                {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Unknown'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile