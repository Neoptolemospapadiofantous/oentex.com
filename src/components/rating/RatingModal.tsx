import React, { useState, useEffect } from 'react'
import { 
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
  Tabs,
  Tab,
  Divider
} from '@heroui/react'
import { Star, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../../lib/authContext'
import { useSubmitRatingMutation } from '../../hooks/queries/useDealsQuery'
import { RATING_CATEGORIES, RatingSubmissionData } from '../../lib/services/ratingService'
import toast from 'react-hot-toast'

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

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please sign in to submit a rating')
      return
    }

    try {
      const ratingData: RatingSubmissionData = {}
      
      if (ratings.mode === 'overall') {
        if (ratings.overall_rating === 0) {
          toast.error('Please select an overall rating')
          return
        }
        ratingData.overall_rating = ratings.overall_rating
      } else {
        if (ratings.platform_usability > 0) ratingData.platform_usability = ratings.platform_usability
        if (ratings.customer_support > 0) ratingData.customer_support = ratings.customer_support
        if (ratings.fees_commissions > 0) ratingData.fees_commissions = ratings.fees_commissions
        if (ratings.security_trust > 0) ratingData.security_trust = ratings.security_trust
        if (ratings.educational_resources > 0) ratingData.educational_resources = ratings.educational_resources
        if (ratings.mobile_app > 0) ratingData.mobile_app = ratings.mobile_app

        const hasAnyRating = Object.values(ratingData).some(rating => rating && rating > 0)
        if (!hasAnyRating) {
          toast.error('Please rate at least one category')
          return
        }
      }

      await submitRatingMutation.mutateAsync({
        userId: user.id,
        companyId,
        ratings: ratingData,
        existingRating
      })

      onClose()
      onRatingSubmitted?.()

    } catch (error) {
      console.error('Rating submission failed:', error)
    }
  }

  const StarRating: React.FC<{
    rating: number
    onRatingChange: (rating: number) => void
    label: string
  }> = ({ rating, onRatingChange, label }) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-small font-medium">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className="p-1 rounded-small"
            disabled={submitRatingMutation.isPending}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Star
              className={`w-6 h-6 transition-colors ${
                star <= rating
                  ? 'fill-warning text-warning'
                  : 'text-default-300 hover:text-warning'
              }`}
            />
          </motion.button>
        ))}
        <span className="ml-2 text-small text-default-500 min-w-[3ch]">
          {rating > 0 ? rating.toFixed(1) : ''}
        </span>
      </div>
    </div>
  )

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="md"
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <div>
                <h2 className="text-xl font-bold">Rate {companyName}</h2>
                {companyRating && (
                  <p className="text-small text-default-500">
                    Current: {companyRating.averageRating.toFixed(1)}⭐ ({companyRating.totalRatings} reviews)
                  </p>
                )}
              </div>
            </ModalHeader>

            <ModalBody>
              {/* Rating Mode Selection */}
              <Tabs 
                selectedKey={ratings.mode}
                onSelectionChange={(key) => setRatings(prev => ({ ...prev, mode: key as 'overall' | 'categories' }))}
                variant="underlined"
                color="primary"
                className="w-full"
                isDisabled={submitRatingMutation.isPending}
              >
                <Tab key="overall" title="Overall Rating" />
                <Tab key="categories" title="Detailed Rating" />
              </Tabs>

              <Divider />

              {/* Rating Content */}
              <div className="py-4">
                {ratings.mode === 'overall' ? (
                  <div>
                    <p className="text-small text-default-600 mb-4">
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
                    <p className="text-small text-default-600 mb-4">
                      Rate different aspects of {companyName} (optional categories)
                    </p>
                    <div className="space-y-1">
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
            </ModalBody>

            <ModalFooter>
              <Button
                variant="light"
                onPress={onClose}
                isDisabled={submitRatingMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleSubmit}
                isLoading={submitRatingMutation.isPending}
                startContent={!submitRatingMutation.isPending && <Star className="w-4 h-4" />}
              >
                {submitRatingMutation.isPending ? 'Submitting...' : 'Submit Rating'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}