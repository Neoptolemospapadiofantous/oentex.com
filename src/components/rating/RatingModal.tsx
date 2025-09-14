// src/components/rating/RatingModal.tsx - Updated with modern design system
import { useState, useEffect } from 'react'
import { Icons } from '../icons'
import { useAuth } from '../../lib/authContext'
import { useSubmitRatingMutation } from '../../hooks/queries/useDealsQuery'
import { RATING_CATEGORIES, RatingSubmissionData } from '../../lib/services/ratingService'
import { showErrorToast, showSuccessToast } from '../ui/AppToast'

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  companyId: string
  companyName: string
  existingRating?: any
  onRatingSubmitted?: () => void
  companyRating?: {
    averageRating: number
    totalRatings: number
  }
}

interface RatingState {
  mode: 'overall' | 'categories'
  overall_rating: number
  platform_usability: number
  customer_support: number
  fees_commissions: number
  security_trust: number
  educational_resources: number
  mobile_app: number
}

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  companyId,
  companyName,
  existingRating,
  onRatingSubmitted,
  companyRating
}) => {
  const { user } = useAuth()
  const submitRatingMutation = useSubmitRatingMutation()

  const [ratings, setRatings] = useState<RatingState>({
    mode: 'overall',
    overall_rating: 0,
    platform_usability: 0,
    customer_support: 0,
    fees_commissions: 0,
    security_trust: 0,
    educational_resources: 0,
    mobile_app: 0
  })

  // Initialize with existing rating data
  useEffect(() => {
    if (existingRating) {
      const mode = existingRating.overall_rating ? 'overall' : 'categories'
      
      setRatings({
        mode,
        overall_rating: existingRating.overall_rating || 0,
        platform_usability: existingRating.platform_usability || 0,
        customer_support: existingRating.customer_support || 0,
        fees_commissions: existingRating.fees_commissions || 0,
        security_trust: existingRating.security_trust || 0,
        educational_resources: existingRating.educational_resources || 0,
        mobile_app: existingRating.mobile_app || 0
      })
    }
  }, [existingRating])

  // Handle rating submission with mutation hook
  const handleSubmit = async () => {
    if (!user) {
      showErrorToast('Please sign in to submit a rating')
      return
    }

    try {
      // Prepare rating data based on selected mode
      const ratingData: RatingSubmissionData = {}
      
      if (ratings.mode === 'overall') {
        if (ratings.overall_rating === 0) {
          showErrorToast('Please select an overall rating')
          return
        }
        ratingData.overall_rating = ratings.overall_rating
      } else {
        // Categories mode - include all non-zero category ratings
        if (ratings.platform_usability > 0) ratingData.platform_usability = ratings.platform_usability
        if (ratings.customer_support > 0) ratingData.customer_support = ratings.customer_support
        if (ratings.fees_commissions > 0) ratingData.fees_commissions = ratings.fees_commissions
        if (ratings.security_trust > 0) ratingData.security_trust = ratings.security_trust
        if (ratings.educational_resources > 0) ratingData.educational_resources = ratings.educational_resources
        if (ratings.mobile_app > 0) ratingData.mobile_app = ratings.mobile_app

        // Validate at least one category is rated
        const hasAnyRating = Object.values(ratingData).some(rating => rating && rating > 0)
        if (!hasAnyRating) {
          showErrorToast('Please rate at least one category')
          return
        }
      }

      console.log('📊 Modern rating submission via mutation hook...')

      // Use mutation hook - handles ALL optimistic updates automatically
      await submitRatingMutation.mutateAsync({
        userId: user.id,
        companyId,
        ratings: ratingData,
        existingRating
      })

      // Success: Close modal and notify parent
      onClose()
      onRatingSubmitted?.()

      console.log('✅ Modern rating submission completed successfully')

    } catch (error) {
      console.error('❌ Modern rating submission failed:', error)
      // Error toast is handled by the mutation hook
    }
  }

  const StarRating: React.FC<{
    rating: number
    onRatingChange: (rating: number) => void
    label: string
  }> = ({ rating, onRatingChange, label }) => (
    <div className="flex items-center justify-between container-py-md">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="flex items-center gap-xs">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className="container-p-xs hover:scale-110 transition-transform rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            disabled={submitRatingMutation.isPending}
          >
            <Icons.star
              className={`w-6 h-6 transition-colors ${
                star <= rating
                  ? 'fill-warning text-warning'
                  : 'text-content3 hover:text-warning'
              }`}
            />
          </button>
        ))}
        <span className="ml-sm text-sm text-foreground/60 min-w-[3ch]">
          {rating > 0 ? rating.toFixed(1) : ''}
        </span>
      </div>
    </div>
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 container-p-lg">
      <div className="bg-content1/90 backdrop-blur-xl rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-divider/30 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between container-p-2xl border-b border-divider/30">
          <div>
            <h2 className="text-xl font-bold text-foreground">Rate {companyName}</h2>
            {companyRating && (
              <p className="text-sm text-foreground/60 mt-xs">
                Current: {companyRating.averageRating.toFixed(1)}⭐ ({companyRating.totalRatings} reviews)
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="container-p-sm hover:bg-content2 rounded-lg transition-colors"
            disabled={submitRatingMutation.isPending}
          >
            <Icons.close className="w-5 h-5" />
          </button>
        </div>

        {/* Rating Mode Selection */}
        <div className="container-p-2xl border-b border-divider/30">
          <div className="flex gap-sm">
            <button
              type="button"
              onClick={() => setRatings(prev => ({ ...prev, mode: 'overall' }))}
              className={`container-px-lg container-py-sm rounded-xl text-sm font-medium transition-colors ${
                ratings.mode === 'overall'
                  ? 'bg-primary text-white'
                  : 'bg-content2 text-foreground/70 hover:bg-primary/10'
              }`}
              disabled={submitRatingMutation.isPending}
            >
              Overall Rating
            </button>
            <button
              type="button"
              onClick={() => setRatings(prev => ({ ...prev, mode: 'categories' }))}
              className={`container-px-lg container-py-sm rounded-xl text-sm font-medium transition-colors ${
                ratings.mode === 'categories'
                  ? 'bg-primary text-white'
                  : 'bg-content2 text-foreground/70 hover:bg-primary/10'
              }`}
              disabled={submitRatingMutation.isPending}
            >
              Detailed Rating
            </button>
          </div>
        </div>

        {/* Rating Content */}
        <div className="container-p-2xl">
          {ratings.mode === 'overall' ? (
            <div>
              <p className="text-sm text-foreground/60 mb-lg">
                Rate your overall experience with {companyName}
              </p>
              <StarRating
                rating={ratings.overall_rating}
                onRatingChange={(rating) => setRatings(prev => ({ ...prev, overall_rating: rating }))}
                label="Overall Experience"
              />
            </div>
          ) : (
            <div>
              <p className="text-sm text-foreground/60 mb-lg">
                Rate different aspects of {companyName} (optional categories)
              </p>
              <div className="space-y-xs">
                {RATING_CATEGORIES.map((category) => (
                  <StarRating
                    key={category.key}
                    rating={ratings[category.key as keyof RatingState] as number}
                    onRatingChange={(rating) => 
                      setRatings(prev => ({ ...prev, [category.key]: rating }))
                    }
                    label={category.label}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-md container-p-2xl border-t border-divider/30">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 container-px-lg container-py-md border border-divider rounded-xl text-foreground/70 hover:bg-content2 transition-colors"
            disabled={submitRatingMutation.isPending}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitRatingMutation.isPending}
            className="flex-1 container-px-lg container-py-md bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-sm"
          >
            {submitRatingMutation.isPending ? (
              <>
                <Icons.refresh className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Rating'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}