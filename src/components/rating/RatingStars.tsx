// src/components/rating/RatingStars.tsx - REPLACE your existing RatingStars.tsx
import React, { useState, useId } from 'react'
import { Star } from 'lucide-react'

interface RatingStarsProps {
  rating: number
  onRatingChange?: (rating: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  label?: string
  className?: string
  allowDecimals?: boolean // New prop for decimal display
  precision?: number // For decimal precision (default 1)
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  onRatingChange,
  readonly = false,
  size = 'md',
  showValue = false,
  label = 'Rating',
  className = '',
  allowDecimals = true,
  precision = 1
}) => {
  const [hoverRating, setHoverRating] = useState(0)
  const labelId = useId()

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const starSize = sizeClasses[size]

  const handleKeyDown = (e: React.KeyboardEvent, star: number) => {
    if (readonly) return

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault()
        onRatingChange?.(Math.min(star + 1, 5))
        break
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault()
        onRatingChange?.(Math.max(star - 1, 1))
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        onRatingChange?.(star)
        break
    }
  }

  // Function to render a star with partial fill support for decimals
  const renderStar = (starNumber: number, currentRating: number) => {
    const isFilled = starNumber <= Math.floor(currentRating)
    const isPartiallyFilled = starNumber === Math.ceil(currentRating) && currentRating % 1 !== 0
    const partialPercent = isPartiallyFilled ? (currentRating % 1) * 100 : 0

    if (readonly && allowDecimals && isPartiallyFilled) {
      // Render partially filled star for readonly decimal ratings
      return (
        <div key={starNumber} className="relative">
          <Star className={`${starSize} text-gray-300`} />
          <div 
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${partialPercent}%` }}
          >
            <Star className={`${starSize} text-yellow-400 fill-yellow-400`} />
          </div>
        </div>
      )
    }

    // Regular star rendering
    const isActive = starNumber <= (hoverRating || currentRating)
    
    return readonly ? (
      <Star
        key={starNumber}
        className={`${starSize} ${
          isActive 
            ? 'text-yellow-400 fill-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ) : (
      <button
        key={starNumber}
        type="button"
        onClick={() => onRatingChange?.(starNumber)}
        onMouseEnter={() => setHoverRating(starNumber)}
        onMouseLeave={() => setHoverRating(0)}
        onKeyDown={(e) => handleKeyDown(e, starNumber)}
        className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded'} transition-transform`}
        aria-label={`Rate ${starNumber} out of 5 stars`}
        role="radio"
        aria-checked={starNumber === Math.round(rating)}
        tabIndex={starNumber === 1 ? 0 : -1}
      >
        <Star
          className={`${starSize} ${
            isActive 
              ? 'text-yellow-400 fill-yellow-400' 
              : 'text-gray-300 hover:text-yellow-300'
          } transition-colors`}
        />
      </button>
    )
  }

  const displayRating = allowDecimals ? rating.toFixed(precision) : Math.round(rating).toString()

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <div 
        className="flex items-center"
        role={readonly ? 'img' : 'radiogroup'}
        aria-labelledby={labelId}
        aria-label={readonly ? `Rating: ${displayRating} out of 5 stars` : `Rate out of 5 stars`}
      >
        <span id={labelId} className="sr-only">{label}</span>
        
        {[1, 2, 3, 4, 5].map((star) => renderStar(star, hoverRating || rating))}
      </div>
      
      {showValue && (
        <span className="text-sm text-textSecondary ml-2">
          {rating > 0 ? displayRating : 'No rating'}
        </span>
      )}
    </div>
  )
}

// Enhanced AverageRating component that works with the new RatingStars
interface AverageRatingProps {
  rating: number
  totalRatings: number
  size?: 'sm' | 'md' | 'lg'
  showDetails?: boolean
  precision?: number
}

export const AverageRating: React.FC<AverageRatingProps> = ({
  rating,
  totalRatings,
  size = 'md',
  showDetails = true,
  precision = 1
}) => {
  return (
    <div className="flex items-center space-x-2">
      <RatingStars 
        rating={rating} 
        readonly 
        size={size} 
        allowDecimals={true}
        precision={precision}
      />
      {showDetails && (
        <div className="text-sm text-textSecondary">
          <span className="font-medium">{rating.toFixed(precision)}</span>
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