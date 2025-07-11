// src/components/deals/DealCard.tsx - FIXED VERSION WITH PROPER EXPORT
import React from 'react'
import { ExternalLink, Star, Clock, Gift, MessageSquare, Users, TrendingUp } from 'lucide-react'
import { AverageRating, CompactRating } from '../rating/AverageRating'
import { UserRating } from '../../lib/services/ratingService'

interface Company {
  id: string
  name: string
  slug: string
  description: string
  logo_url?: string
  website_url: string
  overall_rating: number
  total_reviews: number
  category: string
  status: string
}

interface Deal {
  id: string
  merchant_name: string
  title: string
  description: string
  terms?: string
  commission_rate?: number
  tracking_link: string
  start_date: string
  end_date?: string
  category: string
  status: string
  bonus_amount?: string
  rating: number
  features: string[]
  image_url?: string
  click_count: number
}

interface DealWithRating extends Deal {
  company?: Company
  companyRating?: {
    averageRating: number
    totalRatings: number
  }
  userRating?: UserRating
}

interface DealCardProps {
  deal: DealWithRating
  onRateClick: () => void
  onTrackClick: () => void
}

// Main component with proper export
export const DealCard: React.FC<DealCardProps> = ({ 
  deal, 
  onRateClick, 
  onTrackClick 
}) => {
  const handleTrackClick = () => {
    onTrackClick()
  }

  const handleRateClick = () => {
    onRateClick()
  }

  // Get the best available rating
  const displayRating = deal.companyRating?.averageRating || deal.company?.overall_rating || deal.rating || 0
  const displayRatingCount = deal.companyRating?.totalRatings || deal.company?.total_reviews || 0
  
  // Determine if user has rated this company
  const hasUserRated = !!deal.userRating
  const userRatingType = deal.userRating?.rating_type

  return (
    <div className="bg-surface rounded-xl border border-border hover:border-primary/30 transition-all duration-200 hover:shadow-lg group">
      <div className="p-6">
        {/* Header with company info and rating */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {deal.company?.logo_url ? (
              <img
                src={deal.company.logo_url}
                alt={`${deal.merchant_name} logo`}
                className="w-12 h-12 rounded-lg object-cover bg-background"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-text group-hover:text-primary transition-colors">
                {deal.merchant_name}
              </h3>
              <div className="flex items-center space-x-2">
                <CompactRating 
                  rating={displayRating} 
                  totalRatings={displayRatingCount} 
                  showStars={true}
                />
              </div>
            </div>
          </div>

          {/* Deal category badge */}
          <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full capitalize">
            {deal.category}
          </span>
        </div>

        {/* Deal title and bonus */}
        <div className="mb-4">
          <h2 className="text-lg font-bold text-text mb-2 line-clamp-2">
            {deal.title}
          </h2>
          
          {deal.bonus_amount && (
            <div className="flex items-center space-x-2 mb-3">
              <Gift className="w-5 h-5 text-secondary" />
              <span className="text-secondary font-semibold">
                {deal.bonus_amount}
              </span>
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
                  className="text-xs bg-background border border-border text-textSecondary px-2 py-1 rounded-full"
                >
                  {feature}
                </span>
              ))}
              {deal.features.length > 3 && (
                <span className="text-xs text-textSecondary font-medium">
                  +{deal.features.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Terms */}
        {deal.terms && (
          <div className="mb-4 p-3 bg-background rounded-lg border border-border">
            <p className="text-xs text-textSecondary leading-relaxed">
              <strong>Terms:</strong> {deal.terms}
            </p>
          </div>
        )}

        {/* Deal metadata */}
        <div className="flex items-center justify-between text-sm text-textSecondary mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>
                {deal.end_date 
                  ? `Ends ${new Date(deal.end_date).toLocaleDateString()}`
                  : 'No expiry'
                }
              </span>
            </div>
            {deal.commission_rate && (
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4" />
                <span>{deal.commission_rate}% commission</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{deal.click_count || 0} claimed</span>
          </div>
        </div>

        {/* User rating status */}
        {hasUserRated && (
          <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-primary fill-primary" />
              <span className="text-sm text-primary font-medium">
                You rated this company
                {userRatingType === 'overall' && deal.userRating?.overall_rating && (
                  <span className="ml-1">({deal.userRating.overall_rating}/5 overall)</span>
                )}
                {userRatingType === 'categories' && (
                  <span className="ml-1">(detailed categories)</span>
                )}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleTrackClick}
            className="flex-1 bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 px-4 rounded-lg hover:from-primary/90 hover:to-secondary/90 transition-all flex items-center justify-center space-x-2 group"
          >
            <Gift className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Claim Deal</span>
            <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
          
          <button
            onClick={handleRateClick}
            className="bg-surface hover:bg-background border border-border hover:border-primary/50 text-text font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center space-x-2"
            title={hasUserRated ? "Update your rating" : "Rate this company"}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">
              {hasUserRated ? 'Update' : 'Rate'}
            </span>
          </button>
        </div>

        {/* Enhanced rating display for company */}
        {deal.company && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-textSecondary">Company Rating:</span>
                <AverageRating 
                  rating={displayRating} 
                  totalRatings={displayRatingCount}
                  size="sm"
                  precision={1}
                />
              </div>
              
              {hasUserRated && (
                <div className="text-xs text-textSecondary">
                  Your rating: {userRatingType === 'overall' ? 'Quick' : 'Detailed'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Set display name for debugging
DealCard.displayName = 'DealCard'

// Default export as well for compatibility
export default DealCard