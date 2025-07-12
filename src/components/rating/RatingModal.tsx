// src/components/rating/RatingModal.tsx - Enhanced with Community Ratings
import React, { useState, useEffect, useId, useCallback } from 'react'
import { X, Star, Zap, BarChart3, CheckCircle, AlertCircle, Info, Users, TrendingUp } from 'lucide-react'
import { useAuth } from '../../lib/authContext'
import { FocusManager } from '../ui/FocusManager'
import { RatingStars } from './RatingStars'
import { RatingDisplay } from './RatingDisplay'
import { ratingService, RATING_CATEGORIES, UserRating, CategoryRatings } from '../../lib/services/ratingService'
import toast from 'react-hot-toast'

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  companyId: string
  companyName: string
  existingRating?: UserRating
  onRatingSubmitted: () => void
  companyRating?: {
    averageRating: number
    totalRatings: number
  }
}

type RatingMode = 'quick' | 'detailed'

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  companyId,
  companyName,
  existingRating,
  onRatingSubmitted,
  companyRating
}) => {
  const titleId = useId()
  const descriptionId = useId()
  const { user } = useAuth()

  // Core state
  const [ratingMode, setRatingMode] = useState<RatingMode>('quick')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Rating state
  const [quickRating, setQuickRating] = useState(0)
  const [detailedRatings, setDetailedRatings] = useState<CategoryRatings>({
    platform_usability: 0,
    customer_support: 0,
    fees_commissions: 0,
    security_trust: 0,
    educational_resources: 0,
    mobile_app: 0
  })

  // Community data state
  const [communityRatings, setCommunityRatings] = useState<any[]>([])
  const [loadingCommunity, setLoadingCommunity] = useState(false)
  const [showCommunity, setShowCommunity] = useState(false)

  // UI state
  const [showPreview, setShowPreview] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  // Load community ratings
  useEffect(() => {
    if (isOpen && companyId && (companyRating?.totalRatings || 0) > 0) {
      loadCommunityRatings()
    }
  }, [isOpen, companyId, companyRating?.totalRatings])

  const loadCommunityRatings = async () => {
    try {
      setLoadingCommunity(true)
      const ratings = await ratingService.getCompanyRatings(companyId)
      // Filter out current user's rating and limit to recent 5
      const otherRatings = ratings
        .filter((r: any) => r.user_id !== user?.id)
        .slice(0, 5)
      setCommunityRatings(otherRatings)
    } catch (error) {
      console.error('Failed to load community ratings:', error)
    } finally {
      setLoadingCommunity(false)
    }
  }

  // Initialize form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSubmitSuccess(false)
      setValidationError(null)
      setShowCommunity(false)
      
      if (existingRating) {
        if (existingRating.rating_type === 'overall' && existingRating.overall_rating) {
          setRatingMode('quick')
          setQuickRating(existingRating.overall_rating)
          setDetailedRatings({
            platform_usability: 0,
            customer_support: 0,
            fees_commissions: 0,
            security_trust: 0,
            educational_resources: 0,
            mobile_app: 0
          })
        } else if (existingRating.rating_type === 'categories') {
          setRatingMode('detailed')
          setQuickRating(0)
          setDetailedRatings({
            platform_usability: existingRating.platform_usability || 0,
            customer_support: existingRating.customer_support || 0,
            fees_commissions: existingRating.fees_commissions || 0,
            security_trust: existingRating.security_trust || 0,
            educational_resources: existingRating.educational_resources || 0,
            mobile_app: existingRating.mobile_app || 0
          })
        }
      } else {
        setRatingMode('quick')
        setQuickRating(0)
        setDetailedRatings({
          platform_usability: 0,
          customer_support: 0,
          fees_commissions: 0,
          security_trust: 0,
          educational_resources: 0,
          mobile_app: 0
        })
      }
    }
  }, [isOpen, existingRating, user?.id])

  // Calculate preview rating
  const calculatePreviewRating = useCallback(() => {
    if (ratingMode === 'quick') {
      return quickRating
    } else {
      const validRatings = Object.values(detailedRatings).filter(r => r > 0)
      if (validRatings.length === 0) return 0
      const sum = validRatings.reduce((acc, r) => acc + r, 0)
      return Math.round((sum / validRatings.length) * 10) / 10
    }
  }, [ratingMode, quickRating, detailedRatings])

  const previewRating = calculatePreviewRating()

  // Validation
  const validateForm = useCallback(() => {
    if (ratingMode === 'quick') {
      if (quickRating === 0) {
        setValidationError('Please select a rating')
        return false
      }
    } else {
      const hasAnyRating = Object.values(detailedRatings).some(r => r > 0)
      if (!hasAnyRating) {
        setValidationError('Please rate at least one category')
        return false
      }
    }
    setValidationError(null)
    return true
  }, [ratingMode, quickRating, detailedRatings])

  // Handle mode change
  const handleModeChange = useCallback((newMode: RatingMode) => {
    setRatingMode(newMode)
    setValidationError(null)
    setShowPreview(true)
    setTimeout(() => setShowPreview(false), 2000)
  }, [])

  // Handle rating changes
  const handleQuickRatingChange = useCallback((rating: number) => {
    setQuickRating(rating)
    setValidationError(null)
  }, [])

  const handleDetailedRatingChange = useCallback((category: string, rating: number) => {
    setDetailedRatings(prev => ({
      ...prev,
      [category]: rating
    }))
    setValidationError(null)
  }, [])

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please sign in to submit a rating')
      return
    }

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      if (ratingMode === 'quick') {
        await ratingService.submitOverallRating(user.id, companyId, quickRating)
      } else {
        await ratingService.submitCategoryRatings(user.id, companyId, detailedRatings)
      }

      setSubmitSuccess(true)
      toast.success('Rating submitted successfully!')
      
      setTimeout(() => {
        onRatingSubmitted()
        onClose()
      }, 1500)

    } catch (error: any) {
      console.error('Error submitting rating:', error)
      toast.error('Failed to submit rating. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = useCallback(() => {
    if (isSubmitting) return
    onClose()
  }, [isSubmitting, onClose])

  if (!isOpen) return null

  const canSubmit = !isSubmitting && previewRating > 0
  const hasExistingRatings = (companyRating?.totalRatings || 0) > 0

  return (
    <FocusManager trapFocus={true}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div 
          className="bg-surface rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex"
          role="dialog"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          aria-modal="true"
        >
          {/* Left Side - Rating Form */}
          <div className="flex-1 flex flex-col">
            {/* Success State */}
            {submitSuccess && (
              <div className="absolute inset-0 bg-surface rounded-2xl flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-text mb-2">Rating Submitted!</h3>
                  <p className="text-textSecondary">Thank you for your feedback</p>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h2 id={titleId} className="text-xl font-semibold text-text">
                    {existingRating ? 'Update Your Rating' : 'Rate This Company'}
                  </h2>
                  <p id={descriptionId} className="text-textSecondary text-sm mt-1">
                    Share your experience with {companyName}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-background/50 rounded-lg transition-colors"
                  aria-label="Close dialog"
                  disabled={isSubmitting}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Preview Rating */}
              {previewRating > 0 && (
                <div className={`mt-4 p-3 bg-white rounded-lg border transition-all duration-300 ${showPreview ? 'ring-2 ring-primary' : ''}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text">Your Rating:</span>
                    <div className="flex items-center gap-2">
                      <RatingStars rating={previewRating} readonly size="sm" />
                      <span className="font-bold text-text">{previewRating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex-1 p-6 overflow-y-auto">
              {/* Rating Mode Selection */}
              <div className="space-y-4 mb-6">
                <h3 className="font-medium text-text flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary" />
                  Choose Rating Method
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleModeChange('quick')}
                    disabled={isSubmitting}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      ratingMode === 'quick'
                        ? 'border-primary bg-primary/10 text-primary shadow-lg scale-105'
                        : 'border-border hover:border-primary/50 text-textSecondary hover:bg-background'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 shrink-0" />
                      <div>
                        <div className="font-medium">Quick Rating</div>
                        <div className="text-sm opacity-80">Single overall rating</div>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleModeChange('detailed')}
                    disabled={isSubmitting}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      ratingMode === 'detailed'
                        ? 'border-primary bg-primary/10 text-primary shadow-lg scale-105'
                        : 'border-border hover:border-primary/50 text-textSecondary hover:bg-background'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 shrink-0" />
                      <div>
                        <div className="font-medium">Detailed Rating</div>
                        <div className="text-sm opacity-80">Rate by categories</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Quick Rating */}
              {ratingMode === 'quick' && (
                <div className="space-y-4 mb-6">
                  <h3 className="font-medium text-text">Overall Rating *</h3>
                  <div className="bg-background rounded-xl p-6 border border-border">
                    <div className="text-center space-y-4">
                      <RatingStars
                        rating={quickRating}
                        onRatingChange={handleQuickRatingChange}
                        size="lg"
                        allowHalfStars={true}
                        showValue={true}
                        disabled={isSubmitting}
                        highlightOnHover={true}
                      />
                      <p className="text-textSecondary text-sm">
                        How would you rate your overall experience with {companyName}?
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Detailed Rating */}
              {ratingMode === 'detailed' && (
                <div className="space-y-6 mb-6">
                  <h3 className="font-medium text-text">Rate by Categories</h3>
                  <div className="space-y-4">
                    {RATING_CATEGORIES.map(({ key, label }) => (
                      <div key={key} className="bg-background rounded-xl p-4 border border-border">
                        <div className="flex items-center justify-between mb-3">
                          <label className="font-medium text-text">{label}</label>
                          <span className="text-textSecondary text-sm">
                            {detailedRatings[key as keyof CategoryRatings] > 0 
                              ? `${detailedRatings[key as keyof CategoryRatings].toFixed(1)}/5.0`
                              : 'Not rated'
                            }
                          </span>
                        </div>
                        <RatingStars
                          rating={detailedRatings[key as keyof CategoryRatings]}
                          onRatingChange={(rating) => handleDetailedRatingChange(key, rating)}
                          size="md"
                          allowHalfStars={true}
                          disabled={isSubmitting}
                          label={`${label} Rating`}
                          className="justify-center"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Validation Error */}
              {validationError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-red-700 text-sm font-medium">{validationError}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 border border-border rounded-xl text-text hover:bg-background transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                    canSubmit
                      ? 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    existingRating ? 'Update Rating' : 'Submit Rating'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Side - Community Ratings */}
          {hasExistingRatings && (
            <div className="w-80 bg-background border-l border-border flex flex-col">
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-text flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Community Ratings
                  </h3>
                  <button
                    onClick={() => setShowCommunity(!showCommunity)}
                    className="text-textSecondary hover:text-text text-sm"
                  >
                    {showCommunity ? 'Hide' : 'Show'}
                  </button>
                </div>
                
                {/* Company Rating Summary */}
                <div className="mt-3">
                  <RatingDisplay
                    rating={companyRating?.averageRating || 0}
                    totalRatings={companyRating?.totalRatings || 0}
                    companyName={companyName}
                    layout="card"
                    size="sm"
                    showBreakdown={false}
                  />
                </div>
              </div>

              {showCommunity && (
                <div className="flex-1 overflow-y-auto p-4">
                  {loadingCommunity ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : communityRatings.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-text mb-3">Recent Reviews</h4>
                      {communityRatings.map((rating, index) => (
                        <div key={index} className="bg-surface rounded-lg p-3 border border-border">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-textSecondary">
                              {rating.user_profiles?.full_name || 'Anonymous User'}
                            </span>
                            <span className="text-xs text-textSecondary">
                              {new Date(rating.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <RatingStars
                              rating={rating.overall_rating || 0}
                              readonly
                              size="sm"
                            />
                            <span className="text-sm font-medium text-text">
                              {(rating.overall_rating || 0).toFixed(1)}
                            </span>
                          </div>
                          <div className="text-xs text-textSecondary mt-1">
                            {rating.rating_type === 'overall' ? 'Quick rating' : 'Detailed rating'}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-textSecondary text-sm">No recent reviews to show</p>
                    </div>
                  )}
                </div>
              )}

              <div className="p-4 border-t border-border">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                    <div className="text-blue-700 text-xs">
                      <p className="font-medium mb-1">Your rating matters!</p>
                      <p>Help other traders by sharing your honest experience with {companyName}.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </FocusManager>
  )
}