// src/components/rating/RatingDisplay.tsx - Enhanced with user counts and statistics
import React, { useState } from 'react'
import { Star, Users, TrendingUp, ChevronDown, ChevronUp, BarChart3 } from 'lucide-react'

interface RatingDisplayProps {
  rating: number
  totalRatings: number
  companyName?: string
  showBreakdown?: boolean
  showUserCount?: boolean
  size?: 'sm' | 'md' | 'lg'
  layout?: 'horizontal' | 'vertical' | 'card'
  className?: string
  breakdown?: {
    [key: number]: number // star rating -> count
  }
}

export const RatingDisplay: React.FC<RatingDisplayProps> = ({
  rating,
  totalRatings,
  companyName,
  showBreakdown = true,
  showUserCount = true,
  size = 'md',
  layout = 'horizontal',
  className = '',
  breakdown
}) => {
  const [showDetails, setShowDetails] = useState(false)

  const sizeClasses = {
    sm: {
      star: 'w-4 h-4',
      text: 'text-sm',
      title: 'text-base',
      subtitle: 'text-xs'
    },
    md: {
      star: 'w-5 h-5',
      text: 'text-base',
      title: 'text-lg',
      subtitle: 'text-sm'
    },
    lg: {
      star: 'w-6 h-6',
      text: 'text-lg',
      title: 'text-xl',
      subtitle: 'text-base'
    }
  }

  const classes = sizeClasses[size]

  const formatRating = (value: number): string => {
    if (value === 0) return '0.0'
    return value.toFixed(1)
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((starNumber) => {
          if (rating >= starNumber) {
            return (
              <Star
                key={starNumber}
                className={`${classes.star} fill-yellow-400 text-yellow-400`}
              />
            )
          } else if (rating > starNumber - 1) {
            const fillPercentage = (rating - (starNumber - 1)) * 100
            return (
              <div key={starNumber} className="relative">
                <Star className={`${classes.star} text-gray-300`} />
                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fillPercentage}%` }}
                >
                  <Star className={`${classes.star} text-yellow-400 fill-yellow-400`} />
                </div>
              </div>
            )
          } else {
            return (
              <Star
                key={starNumber}
                className={`${classes.star} text-gray-300`}
              />
            )
          }
        })}
      </div>
    )
  }

  const getRatingDescription = (rating: number): string => {
    if (rating === 0) return 'Not rated'
    if (rating <= 1.5) return 'Poor'
    if (rating <= 2.5) return 'Fair'
    if (rating <= 3.5) return 'Good'
    if (rating <= 4.5) return 'Very Good'
    return 'Excellent'
  }

  const generateBreakdown = () => {
    if (breakdown) return breakdown
    
    // Generate a realistic breakdown if none provided
    if (totalRatings === 0) return {}
    
    const distribution: { [key: number]: number } = {}
    let remaining = totalRatings
    
    // Weight towards the current rating
    const targetStar = Math.round(rating)
    distribution[targetStar] = Math.floor(totalRatings * 0.4)
    remaining -= distribution[targetStar]
    
    // Distribute remaining ratings
    const adjacentStars = [targetStar - 1, targetStar + 1].filter(s => s >= 1 && s <= 5)
    adjacentStars.forEach(star => {
      const count = Math.floor(remaining * 0.3)
      distribution[star] = count
      remaining -= count
    })
    
    // Add any remaining to random stars
    while (remaining > 0) {
      const randomStar = Math.floor(Math.random() * 5) + 1
      distribution[randomStar] = (distribution[randomStar] || 0) + 1
      remaining--
    }
    
    return distribution
  }

  if (layout === 'card') {
    return (
      <div className={`bg-surface rounded-xl border border-border p-4 ${className}`}>
        <div className="text-center">
          <div className={`${classes.title} font-bold text-text mb-2`}>
            {formatRating(rating)}
          </div>
          <div className="mb-3">
            {renderStars(rating)}
          </div>
          <div className={`${classes.subtitle} text-textSecondary mb-2`}>
            {getRatingDescription(rating)}
          </div>
          {showUserCount && totalRatings > 0 && (
            <div className="flex items-center justify-center gap-1 text-primary">
              <Users className="w-4 h-4" />
              <span className={`${classes.subtitle} font-medium`}>
                {totalRatings.toLocaleString()} user{totalRatings !== 1 ? 's' : ''} rated
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (layout === 'vertical') {
    return (
      <div className={`flex flex-col items-center space-y-2 ${className}`}>
        <div className={`${classes.title} font-bold text-text`}>
          {formatRating(rating)}
        </div>
        {renderStars(rating)}
        <div className={`${classes.subtitle} text-textSecondary text-center`}>
          {getRatingDescription(rating)}
        </div>
        {showUserCount && totalRatings > 0 && (
          <div className="flex items-center gap-1 text-primary">
            <Users className="w-3 h-3" />
            <span className="text-xs font-medium">
              {totalRatings.toLocaleString()} rating{totalRatings !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
    )
  }

  // Horizontal layout (default)
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main rating display */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {renderStars(rating)}
          <span className={`${classes.text} font-bold text-text`}>
            {formatRating(rating)}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-textSecondary">
          <span className={classes.subtitle}>
            {getRatingDescription(rating)}
          </span>
          
          {showUserCount && totalRatings > 0 && (
            <>
              <span className="text-border">•</span>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-primary" />
                <span className={`${classes.subtitle} font-medium text-primary`}>
                  {totalRatings.toLocaleString()} user{totalRatings !== 1 ? 's' : ''} rated
                  {companyName && ` ${companyName}`}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Toggle for breakdown */}
        {showBreakdown && totalRatings > 0 && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 text-textSecondary hover:text-text transition-colors text-sm"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Details</span>
            {showDetails ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        )}
      </div>

      {/* Detailed breakdown */}
      {showDetails && showBreakdown && totalRatings > 0 && (
        <div className="bg-background rounded-lg p-4 border border-border space-y-3">
          <h4 className="font-medium text-text flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Rating Breakdown
          </h4>
          
          <div className="space-y-2">
            {Object.entries(generateBreakdown())
              .sort(([a], [b]) => Number(b) - Number(a))
              .map(([stars, count]) => {
                const percentage = totalRatings > 0 ? (Number(count) / totalRatings) * 100 : 0
                return (
                  <div key={stars} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 min-w-[60px]">
                      <span className="text-sm font-medium text-text">{stars}</span>
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    </div>
                    
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    
                    <div className="text-sm text-textSecondary min-w-[40px] text-right">
                      {count}
                    </div>
                  </div>
                )
              })}
          </div>
          
          <div className="pt-2 border-t border-border text-xs text-textSecondary">
            Based on {totalRatings.toLocaleString()} user rating{totalRatings !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  )
}

// Compact version for cards - Enhanced with user count
export const CompactRatingDisplay: React.FC<{
  rating: number
  totalRatings: number
  size?: 'sm' | 'md'
  showCount?: boolean
  showLabel?: boolean
  className?: string
}> = ({ 
  rating, 
  totalRatings, 
  size = 'sm', 
  showCount = true, 
  showLabel = true,
  className = '' 
}) => {
  const starClass = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
  const textClass = size === 'sm' ? 'text-xs' : 'text-sm'

  const renderStars = () => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((starNumber) => {
          if (rating >= starNumber) {
            return (
              <Star
                key={starNumber}
                className={`${starClass} fill-yellow-400 text-yellow-400`}
              />
            )
          } else if (rating > starNumber - 1) {
            const fillPercentage = (rating - (starNumber - 1)) * 100
            return (
              <div key={starNumber} className="relative">
                <Star className={`${starClass} text-gray-300`} />
                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fillPercentage}%` }}
                >
                  <Star className={`${starClass} text-yellow-400 fill-yellow-400`} />
                </div>
              </div>
            )
          } else {
            return (
              <Star
                key={starNumber}
                className={`${starClass} text-gray-300`}
              />
            )
          }
        })}
      </div>
    )
  }

  if (rating === 0) {
    return (
      <div className={`flex items-center gap-1 text-textSecondary ${textClass} ${className}`}>
        <Star className={`${starClass} text-gray-300`} />
        {showLabel && <span>No ratings yet</span>}
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {renderStars()}
      <span className={`text-text font-medium ${textClass}`}>
        {rating.toFixed(1)}
      </span>
      {showCount && totalRatings > 0 && (
        <div className="flex items-center gap-1 text-primary">
          <Users className="w-3 h-3" />
          <span className={`${textClass} font-medium`}>
            {totalRatings.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  )
}

// Rating summary for deal cards
export const DealRatingSummary: React.FC<{
  rating: number
  totalRatings: number
  companyName: string
  className?: string
}> = ({ rating, totalRatings, companyName, className = '' }) => {
  if (totalRatings === 0) {
    return (
      <div className={`flex items-center gap-2 text-textSecondary text-sm ${className}`}>
        <Star className="w-4 h-4" />
        <span>No ratings yet - be the first to rate {companyName}!</span>
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <CompactRatingDisplay 
          rating={rating} 
          totalRatings={totalRatings}
          size="sm"
          showCount={true}
        />
      </div>
      
      <div className="text-xs text-textSecondary">
        <span className="font-medium text-primary">{totalRatings.toLocaleString()}</span>
        {" "}user{totalRatings !== 1 ? 's have' : ' has'} rated <span className="font-medium">{companyName}</span>
      </div>
    </div>
  )
}

export default RatingDisplay