// src/components/rating/RatingStars.tsx (Enhanced)
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
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  onRatingChange,
  readonly = false,
  size = 'md',
  showValue = false,
  label = 'Rating',
  className = ''
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

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <div 
        className="flex items-center"
        role={readonly ? 'img' : 'radiogroup'}
        aria-labelledby={labelId}
        aria-label={readonly ? `Rating: ${rating} out of 5 stars` : `Rate out of 5 stars`}
      >
        <span id={labelId} className="sr-only">{label}</span>
        
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= (hoverRating || rating)
          
          return readonly ? (
            <Star
              key={star}
              className={`${starSize} ${
                isFilled 
                  ? 'text-yellow-400 fill-yellow-400' 
                  : 'text-gray-300'
              }`}
            />
          ) : (
            <button
              key={star}
              type="button"
              onClick={() => onRatingChange?.(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onKeyDown={(e) => handleKeyDown(e, star)}
              className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded'} transition-transform`}
              aria-label={`Rate ${star} out of 5 stars`}
              role="radio"
              aria-checked={star === rating}
              tabIndex={star === 1 ? 0 : -1}
            >
              <Star
                className={`${starSize} ${
                  isFilled 
                    ? 'text-yellow-400 fill-yellow-400' 
                    : 'text-gray-300'
                } transition-colors`}
              />
            </button>
          )
        })}
      </div>
      
      {showValue && (
        <span className="text-sm text-textSecondary ml-2" aria-live="polite">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}