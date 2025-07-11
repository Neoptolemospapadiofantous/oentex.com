// src/components/rating/AverageRating.tsx - REPLACE your existing AverageRating.tsx
import React from 'react'
import { RatingStars } from './RatingStars'

interface AverageRatingProps {
  rating: number
  totalRatings: number
  size?: 'sm' | 'md' | 'lg'
  showDetails?: boolean
  precision?: number
  className?: string
}

export const AverageRating: React.FC<AverageRatingProps> = ({
  rating,
  totalRatings,
  size = 'md',
  showDetails = true,
  precision = 1,
  className = ''
}) => {
  // Handle edge cases
  const displayRating = isNaN(rating) ? 0 : Math.max(0, Math.min(5, rating))
  const displayTotal = isNaN(totalRatings) ? 0 : Math.max(0, totalRatings)

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <RatingStars 
        rating={displayRating} 
        readonly 
        size={size} 
        allowDecimals={true}
        precision={precision}
      />
      {showDetails && (
        <div className="text-sm text-textSecondary">
          <span className="font-medium">
            {displayRating > 0 ? displayRating.toFixed(precision) : '0.0'}
          </span>
          {displayTotal > 0 ? (
            <span className="ml-1">
              ({displayTotal} {displayTotal === 1 ? 'rating' : 'ratings'})
            </span>
          ) : (
            <span className="ml-1">(No ratings)</span>
          )}
        </div>
      )}
    </div>
  )
}

// Enhanced version with more display options
interface CompactRatingProps {
  rating: number
  totalRatings: number
  showStars?: boolean
}

export const CompactRating: React.FC<CompactRatingProps> = ({
  rating,
  totalRatings,
  showStars = true
}) => {
  const displayRating = isNaN(rating) ? 0 : Math.max(0, Math.min(5, rating))
  const displayTotal = isNaN(totalRatings) ? 0 : Math.max(0, totalRatings)

  return (
    <div className="flex items-center space-x-1">
      {showStars && (
        <RatingStars 
          rating={displayRating} 
          readonly 
          size="sm" 
          allowDecimals={true}
          precision={1}
        />
      )}
      <span className="text-sm font-medium text-text">
        {displayRating.toFixed(1)}
      </span>
      <span className="text-xs text-textSecondary">
        ({displayTotal})
      </span>
    </div>
  )
}