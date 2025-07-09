// src/components/rating/RatingModal.tsx (Enhanced with React Query)
import React, { useState, useEffect, useId } from 'react'
import { X, Star } from 'lucide-react'
import { useAuth } from '../../lib/authContext'
import { FocusManager } from '../ui/FocusManager'
import { RatingStars } from './RatingStars'
import { useSubmitRatingMutation } from '../../hooks/queries/useDealsQuery'
import { useFormValidation } from '../../hooks/useFormValidation'
import { ratingSchema, RatingData } from '../../lib/validation/schemas'
import toast from 'react-hot-toast'

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  companyId: string
  companyName: string
  existingRating?: {
    id: string
    overall_rating: number
    platform_usability?: number
    customer_support?: number
    fees_commissions?: number
    security_trust?: number
    educational_resources?: number
    mobile_app?: number
  }
  onRatingSubmitted: () => void
}

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
  const submitRatingMutation = useSubmitRatingMutation()

  const initialValues: RatingData = {
    overall_rating: existingRating?.overall_rating || 0,
    platform_usability: existingRating?.platform_usability || 0,
    customer_support: existingRating?.customer_support || 0,
    fees_commissions: existingRating?.fees_commissions || 0,
    security_trust: existingRating?.security_trust || 0,
    educational_resources: existingRating?.educational_resources || 0,
    mobile_app: existingRating?.mobile_app || 0
  }

  const {
    values: ratings,
    errors,
    setValue,
    validateAll,
    reset
  } = useFormValidation(ratingSchema, initialValues)

  useEffect(() => {
    if (isOpen && existingRating) {
      // Reset form with existing rating values
      Object.keys(initialValues).forEach(key => {
        setValue(key, (existingRating as any)[key] || 0)
      })
    }
  }, [isOpen, existingRating, setValue])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please sign in to submit a rating')
      return
    }

    if (!validateAll()) {
      toast.error('Please fix the validation errors')
      return
    }

    submitRatingMutation.mutate({
      userId: user.id,
      companyId,
      ratings,
      existingRating
    }, {
      onSuccess: () => {
        toast.success(existingRating ? 'Rating updated!' : 'Rating submitted!')
        onRatingSubmitted()
        onClose()
      },
      onError: (error: any) => {
        console.error('Error submitting rating:', error)
        
        if (error.code === '23505') {
          toast.error('You have already rated this company. Try updating your existing rating.')
        } else if (error.code === '23503') {
          if (error.message.includes('user_id')) {
            toast.error('User authentication error. Please sign out and sign in again.')
          } else if (error.message.includes('company_id')) {
            toast.error('Invalid company selected. Please refresh the page.')
          } else {
            toast.error('Database constraint error. Please contact support.')
          }
        } else {
          toast.error(error.message || 'Failed to submit rating. Please try again.')
        }
      }
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  if (!isOpen) return null

  const ratingCategories = [
    { key: 'overall_rating' as keyof RatingData, label: 'Overall Rating', required: true },
    { key: 'platform_usability' as keyof RatingData, label: 'Platform Usability' },
    { key: 'customer_support' as keyof RatingData, label: 'Customer Support' },
    { key: 'fees_commissions' as keyof RatingData, label: 'Fees & Commissions' },
    { key: 'security_trust' as keyof RatingData, label: 'Security & Trust' },
    { key: 'educational_resources' as keyof RatingData, label: 'Educational Resources' },
    { key: 'mobile_app' as keyof RatingData, label: 'Mobile App' }
  ]

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onKeyDown={handleKeyDown}
    >
      <FocusManager trapFocus restoreFocus>
        <div className="bg-surface rounded-2xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto border border-border">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-textSecondary hover:text-text transition-colors"
            aria-label="Close rating modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-6">
            <h2 id={titleId} className="text-2xl font-bold text-text mb-2">
              {existingRating ? 'Update Your Rating' : 'Rate This Company'}
            </h2>
            <div className="bg-background rounded-lg p-4 border border-border">
              <h3 className="font-semibold text-text">{companyName}</h3>
              <p id={descriptionId} className="text-textSecondary text-sm">
                Rate different aspects of this trading platform
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <fieldset>
              <legend className="sr-only">Company Rating Categories</legend>
              
              {ratingCategories.map((category) => (
                <div key={category.key} className="mb-6">
                  <label className="block text-sm font-medium text-text mb-3">
                    {category.label}
                    {category.required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
                  </label>
                  <div className="flex items-center space-x-4">
                    <div role="radiogroup" aria-labelledby={`${category.key}-label`}>
                      <RatingStars
                        rating={ratings[category.key] || 0}
                        onRatingChange={(rating) => setValue(category.key, rating)}
                        size="lg"
                      />
                    </div>
                    <span className="text-lg font-medium text-text" aria-live="polite">
                      {ratings[category.key] > 0 ? `${ratings[category.key]}/5` : 'Not rated'}
                    </span>
                  </div>
                  {errors[category.key] && (
                    <p className="text-red-500 text-sm mt-1" role="alert">
                      {errors[category.key]}
                    </p>
                  )}
                </div>
              ))}
            </fieldset>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 px-4 border border-border rounded-lg text-text hover:bg-background transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitRatingMutation.isPending || ratings.overall_rating === 0}
                className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-3 px-4 rounded-lg font-medium hover:from-primary/90 hover:to-secondary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-describedby={ratings.overall_rating === 0 ? 'rating-required' : undefined}
              >
                {submitRatingMutation.isPending ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {existingRating ? 'Updating...' : 'Submitting...'}
                  </div>
                ) : (
                  existingRating ? 'Update Rating' : 'Submit Rating'
                )}
              </button>
            </div>
            
            {ratings.overall_rating === 0 && (
              <div id="rating-required" className="text-red-500 text-sm" role="alert">
                Please provide an overall rating before submitting
              </div>
            )}
          </form>
        </div>
      </FocusManager>
    </div>
  )
}