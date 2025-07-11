// src/components/rating/RatingModal.tsx - FIXED VERSION
import React, { useState, useEffect, useId } from 'react'
import { X, Star, Zap, BarChart3 } from 'lucide-react'
import { useAuth } from '../../lib/authContext'
import { FocusManager } from '../ui/FocusManager'
import { RatingStars } from './RatingStars'
import { ratingService, RATING_CATEGORIES, UserRating, CategoryRatings } from '../../lib/services/ratingService'
import toast from 'react-hot-toast'

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  companyId: string
  companyName: string
  existingRating?: UserRating
  onRatingSubmitted: () => void
}

type RatingMode = 'quick' | 'detailed'

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  companyId,
  companyName,
  existingRating,
  onRatingSubmitted
}) => {
  const titleId = useId()
  const descriptionId = useId()
  const { user } = useAuth()

  // State for dual rating system
  const [ratingMode, setRatingMode] = useState<RatingMode>('quick')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Quick rating state
  const [quickRating, setQuickRating] = useState(0)

  // Detailed rating state
  const [detailedRatings, setDetailedRatings] = useState<CategoryRatings>({
    platform_usability: 0,
    customer_support: 0,
    fees_commissions: 0,
    security_trust: 0,
    educational_resources: 0,
    mobile_app: 0
  })

  // Initialize ratings based on existing data
  useEffect(() => {
    if (isOpen && existingRating) {
      if (existingRating.rating_type === 'overall' && existingRating.overall_rating) {
        setRatingMode('quick')
        setQuickRating(existingRating.overall_rating)
      } else if (existingRating.rating_type === 'categories') {
        setRatingMode('detailed')
        setDetailedRatings({
          platform_usability: existingRating.platform_usability || 0,
          customer_support: existingRating.customer_support || 0,
          fees_commissions: existingRating.fees_commissions || 0,
          security_trust: existingRating.security_trust || 0,
          educational_resources: existingRating.educational_resources || 0,
          mobile_app: existingRating.mobile_app || 0
        })
      }
    } else if (isOpen) {
      // Reset for new rating
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
  }, [isOpen, existingRating])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please sign in to submit a rating')
      return
    }

    if (ratingMode === 'quick' && quickRating === 0) {
      toast.error('Please select a rating')
      return
    }

    if (ratingMode === 'detailed') {
      const hasAnyRating = Object.values(detailedRatings).some(rating => rating > 0)
      if (!hasAnyRating) {
        toast.error('Please rate at least one category')
        return
      }
    }

    setIsSubmitting(true)

    try {
      if (ratingMode === 'quick') {
        await ratingService.submitOverallRating(user.id, companyId, quickRating)
        toast.success(existingRating ? 'Quick rating updated!' : 'Quick rating submitted!')
      } else {
        // Filter out 0 values - only submit categories that were actually rated
        const filteredRatings: CategoryRatings = {
          platform_usability: detailedRatings.platform_usability || 0,
          customer_support: detailedRatings.customer_support || 0,
          fees_commissions: detailedRatings.fees_commissions || 0,
          security_trust: detailedRatings.security_trust || 0,
          educational_resources: detailedRatings.educational_resources || 0,
          mobile_app: detailedRatings.mobile_app || 0
        }

        console.log('📊 Submitting filtered ratings:', filteredRatings)
        
        await ratingService.submitCategoryRatings(user.id, companyId, filteredRatings)
        toast.success(existingRating ? 'Detailed rating updated!' : 'Detailed rating submitted!')
      }

      onRatingSubmitted()
      onClose()
    } catch (error: any) {
      console.error('Error submitting rating:', error)
      
      if (error.code === '23505') {
        toast.error('You have already rated this company. Please refresh and try again.')
      } else if (error.code === '23514') {
        toast.error('Invalid rating values. Please ensure all ratings are between 1-5.')
      } else {
        toast.error('Failed to submit rating. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (isSubmitting) return
    onClose()
  }

  if (!isOpen) return null

  const isQuickRatingValid = ratingMode === 'quick' && quickRating > 0
  const isDetailedRatingValid = ratingMode === 'detailed' && Object.values(detailedRatings).some(r => r > 0)
  const canSubmit = !isSubmitting && (isQuickRatingValid || isDetailedRatingValid)

  return (
    <FocusManager>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div 
          className="bg-surface rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          role="dialog"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          aria-modal="true"
        >
          {/* Header */}
          <div className="sticky top-0 bg-surface border-b border-border p-6 rounded-t-xl">
            <div className="flex items-center justify-between">
              <h2 id={titleId} className="text-xl font-semibold text-text">
                {existingRating ? 'Update Your Rating' : 'Rate This Company'}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-background rounded-lg transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-background rounded-lg p-4 border border-border mt-4">
              <h3 className="font-semibold text-text">{companyName}</h3>
              <p id={descriptionId} className="text-textSecondary text-sm">
                Choose between a quick overall rating or detailed category ratings
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Rating Mode Toggle */}
            <div className="space-y-4">
              <h3 className="font-medium text-text">Rating Method</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRatingMode('quick')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    ratingMode === 'quick'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50 text-textSecondary'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-3">
                    <Zap className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">Quick Rating</div>
                      <div className="text-sm opacity-80">Single overall rating</div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRatingMode('detailed')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    ratingMode === 'detailed'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50 text-textSecondary'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-3">
                    <BarChart3 className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">Detailed Rating</div>
                      <div className="text-sm opacity-80">Rate by categories</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Quick Rating */}
            {ratingMode === 'quick' && (
              <div className="space-y-4">
                <h3 className="font-medium text-text">Overall Rating *</h3>
                <div className="flex items-center space-x-4">
                  <RatingStars
                    rating={quickRating}
                    onRatingChange={setQuickRating}
                    size="lg"
                  />
                  <span className="text-lg font-medium text-text">
                    {quickRating > 0 ? `${quickRating}/5` : 'Select rating'}
                  </span>
                </div>
                <p className="text-sm text-textSecondary">
                  Rate your overall experience with {companyName}
                </p>
              </div>
            )}

            {/* Detailed Rating */}
            {ratingMode === 'detailed' && (
              <div className="space-y-6">
                <h3 className="font-medium text-text">Rate by Categories</h3>
                <div className="space-y-5">
                  {RATING_CATEGORIES.map((category) => (
                    <div key={category.key} className="space-y-2">
                      <label className="block text-sm font-medium text-text">
                        {category.label}
                        <span className="text-textSecondary ml-1">(Optional)</span>
                      </label>
                      <div className="flex items-center space-x-4">
                        <RatingStars
                          rating={detailedRatings[category.key as keyof CategoryRatings]}
                          onRatingChange={(rating) => 
                            setDetailedRatings(prev => ({
                              ...prev,
                              [category.key]: rating
                            }))
                          }
                          size="md"
                        />
                        <span className="text-sm font-medium text-text min-w-[70px]">
                          {detailedRatings[category.key as keyof CategoryRatings] > 0 
                            ? `${detailedRatings[category.key as keyof CategoryRatings]}/5`
                            : 'Not rated'
                          }
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-background rounded-lg p-4 border border-border">
                  <p className="text-sm text-textSecondary">
                    💡 <strong>Tip:</strong> You can rate any combination of categories. 
                    Unrated categories will be ignored in the calculation.
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 border border-border rounded-lg text-text hover:bg-background transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canSubmit}
                className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-3 px-4 rounded-lg font-medium hover:from-primary/90 hover:to-secondary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
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
      </div>
    </FocusManager>
  )
}