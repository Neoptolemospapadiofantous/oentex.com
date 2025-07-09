import React from 'react'
import { RatingStars } from './RatingStars'

interface AverageRatingProps {
  rating: number
  totalRatings: number
  size?: 'sm' | 'md' | 'lg'
  showDetails?: boolean
}

export const AverageRating: React.FC<AverageRatingProps> = ({
  rating,
  totalRatings,
  size = 'md',
  showDetails = true
}) => {
  return (
    <div className="flex items-center space-x-2">
      <RatingStars rating={rating} readonly size={size} />
      {showDetails && (
        <div className="text-sm text-textSecondary">
          <span className="font-medium">{rating.toFixed(1)}</span>
          {totalRatings > 0 && (
            <span className="ml-1">
              ({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})
            </span>
          )}
        </div>
      )}
    </div>
  )
}