// src/components/rating/AverageRating.tsx - Updated to match design system
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
    <div className={`flex items-center gap-sm ${className}`}>
      <RatingStars 
        rating={displayRating} 
        readonly 
        size={size} 
        allowHalfStars={true}
        precision={precision}
      />
      {showDetails && (
        <div className="text-sm text-foreground/70">
          <span className="font-medium text-foreground">
            {displayRating > 0 ? displayRating.toFixed(precision) : '0.0'}
          </span>
          {displayTotal > 0 ? (
            <span className="ml-1">
              ({displayTotal.toLocaleString()} {displayTotal === 1 ? 'rating' : 'ratings'})
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
  size?: 'sm' | 'md'
  className?: string
}

export const CompactRating: React.FC<CompactRatingProps> = ({
  rating,
  totalRatings,
  showStars = true,
  size = 'sm',
  className = ''
}) => {
  const displayRating = isNaN(rating) ? 0 : Math.max(0, Math.min(5, rating))
  const displayTotal = isNaN(totalRatings) ? 0 : Math.max(0, totalRatings)

  return (
    <div className={`flex items-center gap-xs ${className}`}>
      {showStars && (
        <RatingStars 
          rating={displayRating} 
          readonly 
          size={size} 
          allowHalfStars={true}
          precision={1}
        />
      )}
      <span className="text-sm font-medium text-foreground">
        {displayRating.toFixed(1)}
      </span>
      <span className="text-xs text-foreground/60">
        ({displayTotal.toLocaleString()})
      </span>
    </div>
  )
}