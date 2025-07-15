// src/components/deals/DealCard.tsx - Fixed Layout with Consistent Button Positioning
import React, { useState, useCallback } from 'react'
import { 
  ExternalLink, 
  Star, 
  Clock, 
  Gift, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  CheckCircle,
  Sparkles,
  Award,
  BarChart3,
  Shield,
  Zap
} from 'lucide-react'
import { DealWithRating } from '../../types/deals'

interface DealCardProps {
  deal: DealWithRating
  onRateClick: (deal: DealWithRating) => void
  onTrackClick: (deal: DealWithRating) => void
}

export const DealCard: React.FC<DealCardProps> = ({ 
  deal, 
  onRateClick, 
  onTrackClick 
}) => {
  const [isClaimHovered, setIsClaimHovered] = useState(false)
  const [isRateHovered, setIsRateHovered] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [showRatingDetails, setShowRatingDetails] = useState(false)

  // Get real aggregated rating data from trading_companies table
  const companyRating = deal.company?.overall_rating || 0
  const totalRatings = deal.company?.total_reviews || 0
  const hasUserRated = !!deal.userRating
  const userRatingType = deal.userRating?.rating_type

  // Handle clicks
  const handleTrackClick = useCallback(() => {
    onTrackClick(deal)
  }, [deal, onTrackClick])

  const handleRateClick = useCallback(() => {
    onRateClick(deal)
  }, [deal, onRateClick])

  // Format rating for display
  const formatRating = (rating: number): string => {
    if (rating === 0) return '0.0'
    return rating.toFixed(1)
  }

  // Format category display
  const formatCategory = (category: string) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  // Check if deal is ending soon
  const isEndingSoon = deal.end_date && 
    new Date(deal.end_date).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000

  // Check if deal is highly rated
  const isHighlyRated = companyRating >= 4.5 && totalRatings >= 10
  
  // Check if company is new (few ratings)
  const isNewCompany = totalRatings === 0
  const hasLimitedRatings = totalRatings > 0 && totalRatings < 10

  // Rating trust level
  const getTrustLevel = () => {
    if (totalRatings === 0) return { level: 'unrated', color: 'text-gray-500', label: 'No ratings yet' }
    if (totalRatings < 10) return { level: 'new', color: 'text-blue-600', label: 'New platform' }
    if (totalRatings < 50) return { level: 'emerging', color: 'text-green-600', label: 'Growing community' }
    if (totalRatings < 100) return { level: 'established', color: 'text-primary', label: 'Established' }
    return { level: 'trusted', color: 'text-purple-600', label: 'Community trusted' }
  }

  const trustLevel = getTrustLevel()

  // Render star rating
  const renderStars = (rating: number, size: string = 'w-4 h-4') => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((starNumber) => {
          if (rating >= starNumber) {
            return (
              <Star
                key={starNumber}
                className={`${size} fill-yellow-400 text-yellow-400`}
              />
            )
          } else if (rating > starNumber - 1) {
            const fillPercentage = (rating - (starNumber - 1)) * 100
            return (
              <div key={starNumber} className="relative">
                <Star className={`${size} text-gray-300`} />
                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fillPercentage}%` }}
                >
                  <Star className={`${size} text-yellow-400 fill-yellow-400`} />
                </div>
              </div>
            )
          } else {
            return (
              <Star
                key={starNumber}
                className={`${size} text-gray-300`}
              />
            )
          }
        })}
      </div>
    )
  }

  return (
    // ✅ FIXED: Added flex flex-col h-full to ensure consistent card heights
    <div className="group bg-surface rounded-2xl border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden flex flex-col h-full">
              {/* Content area that will grow to fill available space */}
      <div className="flex-1 flex flex-col">
        {/* Header with company info and badges */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 flex-1">
              {/* Company Logo */}
              <div className="relative">
                {deal.company?.logo_url ? (
                  <div className="relative">
                    <img
                      src={deal.company.logo_url}
                      alt={`${deal.company_name} logo`}
                      className={`w-12 h-12 rounded-xl object-cover bg-background border border-border transition-all duration-300 ${
                        isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                      }`}
                      onLoad={() => setIsImageLoaded(true)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                    {!isImageLoaded && (
                      <div className="absolute inset-0 w-12 h-12 bg-gray-200 animate-pulse rounded-xl" />
                    )}
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-border">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                )}
                
                {/* Status badges */}
                {isHighlyRated && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-sm">
                    <Award className="w-3 h-3 text-yellow-800" />
                  </div>
                )}
                {isNewCompany && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-sm">
                    <Sparkles className="w-3 h-3 text-green-800" />
                  </div>
                )}
                {trustLevel.level === 'trusted' && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center shadow-sm">
                    <Shield className="w-3 h-3 text-purple-800" />
                  </div>
                )}
              </div>

              {/* Company info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-text group-hover:text-primary transition-colors truncate">
                  {deal.company_name}
                </h3>
                
                {/* Real community rating display */}
                <div className="mt-1">
                  {totalRatings > 0 ? (
                    <div className="flex items-center gap-2">
                      {renderStars(companyRating, 'w-3 h-3')}
                      <span className="text-sm font-medium text-text">
                        {formatRating(companyRating)}
                      </span>
                      <div className="flex items-center gap-1 text-primary">
                        <Users className="w-3 h-3" />
                        <span className="text-xs font-medium">
                          {totalRatings.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-textSecondary text-xs">
                      <Star className="w-3 h-3" />
                      <span>No ratings yet</span>
                    </div>
                  )}
                  
                  {/* Trust level indicator */}
                  <div className={`text-xs ${trustLevel.color} font-medium mt-1`}>
                    {trustLevel.label}
                  </div>
                </div>
              </div>
            </div>

            {/* Category and status badges */}
            <div className="flex flex-col gap-2 items-end">
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full whitespace-nowrap">
                {formatCategory(deal.category)}
              </span>
              {isEndingSoon && (
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                  Ending Soon
                </span>
              )}
              {isHighlyRated && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                  Top Rated
                </span>
              )}
              {isNewCompany && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  New Platform
                </span>
              )}
            </div>
          </div>

          {/* Community Trust Section */}
          <div className="mb-4 p-3 bg-background rounded-xl border border-border">
            <button
              onClick={() => setShowRatingDetails(!showRatingDetails)}
              className="w-full flex items-center justify-between hover:text-primary transition-colors"
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-text">
                  Community Ratings
                </span>
              </div>
              <div className="flex items-center gap-2">
                {totalRatings > 0 ? (
                  <>
                    <div className="flex items-center gap-1">
                      {renderStars(companyRating, 'w-4 h-4')}
                      <span className="font-semibold text-text ml-1">
                        {formatRating(companyRating)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-primary">
                      <Users className="w-4 h-4" />
                      <span className="font-semibold">{totalRatings.toLocaleString()}</span>
                      <span className="text-xs text-textSecondary">
                        trader{totalRatings !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600 font-medium">Be the first to rate!</span>
                  </div>
                )}
              </div>
            </button>

            {showRatingDetails && (
              <div className="mt-3 pt-3 border-t border-border">
                {totalRatings > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-textSecondary">Community Trust</span>
                      <span className={`font-medium ${trustLevel.color}`}>
                        {trustLevel.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-textSecondary">Average Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-text">
                          {formatRating(companyRating)} / 5.0
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-textSecondary">Total Reviews</span>
                      <span className="font-medium text-primary">
                        {totalRatings.toLocaleString()} trader{totalRatings !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-sm text-textSecondary mb-2">
                      No ratings yet for <span className="font-medium text-primary">{deal.company_name}</span>
                    </p>
                    <p className="text-xs text-green-600">
                      Be the first to share your experience and help other traders!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Deal title and bonus */}
          <div className="mb-4">
            <h2 className="text-lg font-bold text-text mb-3 line-clamp-2 leading-snug">
              {deal.title}
            </h2>
            
            {/* Bonus amount highlight */}
            {deal.bonus_amount && (
              <div className="relative overflow-hidden bg-gradient-to-r from-secondary/20 to-primary/20 rounded-xl p-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-secondary to-primary rounded-full flex items-center justify-center">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-textSecondary font-medium">Bonus Offer</div>
                    <div className="text-primary font-bold text-lg">
                      {deal.bonus_amount}
                    </div>
                  </div>
                  <Sparkles className="w-5 h-5 text-primary/50 ml-auto" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
              </div>
            )}
          </div>

          {/* Deal description */}
          <p className="text-textSecondary mb-4 line-clamp-3 text-sm leading-relaxed">
            {deal.description}
          </p>

          {/* Features */}
          {deal.features && deal.features.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {deal.features.slice(0, 3).map((feature, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-background border border-border text-textSecondary px-3 py-1 rounded-full hover:border-primary/30 transition-colors"
                  >
                    {feature}
                  </span>
                ))}
                {deal.features.length > 3 && (
                  <span className="text-xs text-primary font-medium px-3 py-1 bg-primary/10 rounded-full">
                    +{deal.features.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* User rating status */}
          {hasUserRated && (
            <div className="mb-4 p-3 bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span className="text-sm text-primary font-medium">
                    You rated this company
                  </span>
                </div>
                <div className="text-xs text-primary bg-white px-2 py-1 rounded-full">
                  {userRatingType === 'overall' ? 'Quick' : 'Detailed'} rating
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Spacer div to push buttons to bottom */}
        <div className="flex-1"></div>
      </div>

      {/* Action Buttons - Always at bottom */}
      <div className="p-6 pt-0 mt-auto">
        {/* Deal metadata - Always at bottom */}
        <div className="flex items-center justify-between text-xs text-textSecondary mb-4 bg-background rounded-lg p-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>
                {deal.end_date 
                  ? `Ends ${new Date(deal.end_date).toLocaleDateString()}`
                  : 'No expiry'
                }
              </span>
            </div>
            {deal.commission_rate && (
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>{deal.commission_rate}% commission</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{deal.click_count || 0} claimed</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleTrackClick}
            onMouseEnter={() => setIsClaimHovered(true)}
            onMouseLeave={() => setIsClaimHovered(false)}
            className="flex-1 relative overflow-hidden bg-gradient-to-r from-primary to-secondary text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 group/button"
          >
            <div className="flex items-center justify-center gap-2 relative z-10">
              <Gift className={`w-5 h-5 transition-transform duration-300 ${isClaimHovered ? 'scale-110 rotate-12' : ''}`} />
              <span>Claim Deal</span>
              <ExternalLink className={`w-4 h-4 transition-transform duration-300 ${isClaimHovered ? 'scale-110 translate-x-1' : ''}`} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/button:translate-x-[100%] transition-transform duration-700" />
          </button>
          
          <button
            onClick={handleRateClick}
            onMouseEnter={() => setIsRateHovered(true)}
            onMouseLeave={() => setIsRateHovered(false)}
            className="bg-surface hover:bg-background border border-border hover:border-primary/50 text-text font-medium py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-md group/rate relative"
            title={hasUserRated ? "Update your rating" : "Rate this company"}
          >
            <div className="flex items-center gap-2">
              <MessageSquare className={`w-5 h-5 transition-transform duration-300 ${isRateHovered ? 'scale-110' : ''}`} />
              <span className="hidden sm:inline">
                {hasUserRated ? 'Update' : 'Rate'}
              </span>
            </div>
            
            {/* Show count of existing ratings on hover */}
            {isRateHovered && totalRatings > 0 && (
              <div className="absolute -top-2 -right-2 bg-primary text-white text-xs px-2 py-1 rounded-full font-medium">
                {totalRatings}
              </div>
            )}
          </button>
        </div>

        {/* Rating encouragement */}
        {isNewCompany ? (
          <div className="mt-3 text-center">
            <p className="text-xs text-textSecondary">
              Be the first to rate <span className="font-medium text-primary">{deal.company_name}</span> 
              and help other traders!
            </p>
          </div>
        ) : hasLimitedRatings ? (
          <div className="mt-3 text-center">
            <p className="text-xs text-textSecondary">
              Help build trust - <span className="font-medium text-primary">{deal.company_name}</span> 
              needs more community reviews
            </p>
          </div>
        ) : (
          <div className="mt-3 text-center">
            <p className="text-xs text-textSecondary">
              Trusted by <span className="font-medium text-primary">{totalRatings.toLocaleString()} traders</span> 
              in our community
            </p>
          </div>
        )}
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
    </div>
  )
}

export default DealCard