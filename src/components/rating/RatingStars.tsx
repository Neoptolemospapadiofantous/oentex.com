// src/components/rating/RatingStars.tsx - Enhanced for perfect UX
import React, { useState, useId, useCallback } from 'react'
import { Star } from 'lucide-react'

interface RatingStarsProps {
  rating: number
  onRatingChange?: (rating: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  label?: string
  className?: string
  allowHalfStars?: boolean
  allowClear?: boolean
  disabled?: boolean
  highlightOnHover?: boolean
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  onRatingChange,
  readonly = false,
  size = 'md',
  showValue = false,
  label = 'Rating',
  className = '',
  allowHalfStars = true,
  allowClear = true,
  disabled = false,
  highlightOnHover = true
}) => {
  const [hoverRating, setHoverRating] = useState(0)
  const [isInteracting, setIsInteracting] = useState(false)
  const labelId = useId()

  const sizeClasses = {
    sm: { star: 'w-4 h-4', text: 'text-sm', gap: 'gap-0.5' },
    md: { star: 'w-5 h-5', text: 'text-base', gap: 'gap-1' },
    lg: { star: 'w-6 h-6', text: 'text-lg', gap: 'gap-1' }
  }

  const { star: starSize, text: textSize, gap } = sizeClasses[size]

  const formatRating = useCallback((value: number): string => {
    if (value === 0) return '0.0'
    return value.toFixed(1)
  }, [])

  const handleStarClick = useCallback((starNumber: number, event: React.MouseEvent) => {
    if (readonly || disabled || !onRatingChange) return

    if (allowHalfStars) {
      const rect = event.currentTarget.getBoundingClientRect()
      const clickX = event.clientX - rect.left
      const starWidth = rect.width
      const isLeftHalf = clickX < starWidth / 2

      let newRating = isLeftHalf ? starNumber - 0.5 : starNumber
      
      // Allow clearing by clicking the same rating
      if (allowClear && newRating === rating) {
        newRating = 0
      }
      
      onRatingChange(Math.max(0, newRating))
    } else {
      const newRating = starNumber === rating && allowClear ? 0 : starNumber
      onRatingChange(newRating)
    }
  }, [rating, allowHalfStars, allowClear, readonly, disabled, onRatingChange])

  const handleStarHover = useCallback((starNumber: number, event: React.MouseEvent) => {
    if (readonly || disabled || !highlightOnHover) return

    if (allowHalfStars) {
      const rect = event.currentTarget.getBoundingClientRect()
      const hoverX = event.clientX - rect.left
      const starWidth = rect.width
      const isLeftHalf = hoverX < starWidth / 2

      setHoverRating(isLeftHalf ? starNumber - 0.5 : starNumber)
    } else {
      setHoverRating(starNumber)
    }
  }, [allowHalfStars, readonly, disabled, highlightOnHover])

  const handleKeyDown = useCallback((e: React.KeyboardEvent, starNumber: number) => {
    if (readonly || disabled) return

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault()
        const nextRating = allowHalfStars ? Math.min(rating + 0.5, 5) : Math.min(starNumber + 1, 5)
        onRatingChange?.(nextRating)
        break
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault()
        const prevRating = allowHalfStars ? Math.max(rating - 0.5, 0) : Math.max(starNumber - 1, 0)
        onRatingChange?.(prevRating)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        onRatingChange?.(starNumber)
        break
      case 'Home':
        e.preventDefault()
        onRatingChange?.(allowClear ? 0 : 0.5)
        break
      case 'End':
        e.preventDefault()
        onRatingChange?.(5)
        break
    }
  }, [rating, allowHalfStars, allowClear, readonly, disabled, onRatingChange])

  // Enhanced star rendering with better decimal support
  const renderStar = useCallback((starNumber: number) => {
    const currentRating = hoverRating || rating
    const isFilled = starNumber <= Math.floor(currentRating)
    const isPartial = starNumber === Math.ceil(currentRating) && currentRating % 1 !== 0
    const fillPercentage = isPartial ? (currentRating % 1) * 100 : 0

    if (readonly) {
      // Readonly stars with precise decimal rendering
      if (isFilled) {
        return (
          <Star
            key={starNumber}
            className={`${starSize} text-yellow-400 fill-yellow-400 transition-all duration-200`}
          />
        )
      } else if (isPartial) {
        return (
          <div key={starNumber} className="relative">
            <Star className={`${starSize} text-gray-300`} />
            <div 
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fillPercentage}%` }}
            >
              <Star className={`${starSize} text-yellow-400 fill-yellow-400`} />
            </div>
          </div>
        )
      } else {
        return (
          <Star
            key={starNumber}
            className={`${starSize} text-gray-300 transition-all duration-200`}
          />
        )
      }
    }

    // Interactive stars
    const isHovered = hoverRating > 0 && starNumber <= hoverRating
    const isSelected = hoverRating === 0 && starNumber <= rating
    const shouldHighlight = isHovered || isSelected

    return (
      <button
        key={starNumber}
        type="button"
        onClick={(e) => handleStarClick(starNumber, e)}
        onMouseEnter={(e) => {
          setIsInteracting(true)
          handleStarHover(starNumber, e)
        }}
        onMouseMove={(e) => allowHalfStars && handleStarHover(starNumber, e)}
        onMouseLeave={() => {
          setHoverRating(0)
          setIsInteracting(false)
        }}
        onKeyDown={(e) => handleKeyDown(e, starNumber)}
        disabled={disabled}
        className={`
          relative transition-all duration-200 rounded-sm
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-110 focus:scale-110'}
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          ${isInteracting ? 'z-10' : ''}
        `}
        aria-label={`Rate ${starNumber} out of 5 stars`}
        title={allowHalfStars ? `Click left for ${starNumber - 0.5}, right for ${starNumber}` : `Rate ${starNumber} stars`}
      >
        {/* Half-star indicator zones */}
        {!readonly && allowHalfStars && (
          <div className="absolute inset-0 flex">
            <div className="w-1/2 hover:bg-yellow-100 hover:bg-opacity-30 rounded-l transition-colors duration-150" />
            <div className="w-1/2 hover:bg-yellow-100 hover:bg-opacity-30 rounded-r transition-colors duration-150" />
          </div>
        )}
        
        {/* Star icon */}
        <Star
          className={`
            ${starSize} transition-all duration-200
            ${shouldHighlight 
              ? 'text-yellow-400 fill-yellow-400 drop-shadow-sm' 
              : 'text-gray-300 hover:text-yellow-300'
            }
          `}
        />
      </button>
    )
  }, [rating, hoverRating, starSize, readonly, disabled, allowHalfStars, isInteracting, handleStarClick, handleStarHover, handleKeyDown])

  return (
    <div className={`flex items-center ${gap} ${className}`}>
      <div 
        className="flex items-center gap-0.5"
        role={readonly ? 'img' : 'radiogroup'}
        aria-labelledby={labelId}
        aria-label={readonly ? `Rating: ${formatRating(rating)} out of 5 stars` : `Rate out of 5 stars`}
      >
        <span id={labelId} className="sr-only">{label}</span>
        {[1, 2, 3, 4, 5].map(renderStar)}
      </div>
      
      {/* Rating value display */}
      {showValue && (
        <div className={`${textSize} font-medium text-text ml-2 min-w-[3rem]`}>
          {rating > 0 ? formatRating(rating) : '0.0'}
        </div>
      )}
      
      {/* Interactive hints */}
      {!readonly && !disabled && (
        <div className="flex items-center gap-2 ml-2">
          {allowHalfStars && (
            <span className="text-xs text-textSecondary opacity-75">
              Half stars
            </span>
          )}
          {allowClear && rating > 0 && (
            <button
              type="button"
              onClick={() => onRatingChange?.(0)}
              className="text-xs text-textSecondary hover:text-text underline transition-colors"
              title="Clear rating"
            >
              Clear
            </button>
          )}
        </div>
      )}
      
      {/* Live rating feedback */}
      {!readonly && hoverRating > 0 && (
        <div className={`${textSize} text-primary font-medium ml-2 animate-pulse`}>
          {formatRating(hoverRating)}
        </div>
      )}
    </div>
  )
}

// Quick rating component for cards
export const CompactRating: React.FC<{
  rating: number
  totalRatings?: number
  size?: 'sm' | 'md'
  showText?: boolean
  className?: string
}> = ({ rating, totalRatings = 0, size = 'sm', showText = true, className = '' }) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <RatingStars
        rating={rating}
        readonly
        size={size}
        showValue={false}
        allowHalfStars={true}
      />
      {showText && (
        <>
          <span className="text-text font-medium text-sm">
            {rating > 0 ? rating.toFixed(1) : '0.0'}
          </span>
          {totalRatings > 0 && (
            <span className="text-textSecondary text-xs">
              ({totalRatings})
            </span>
          )}
        </>
      )}
    </div>
  )
}

export default RatingStars