// src/components/deals/DealCard.tsx (FIXED - Null Safety for replace() calls)
import React from 'react'
import { ExternalLink, Star, Clock, Users, MessageSquare } from 'lucide-react'
import { DealWithRating } from '../../types/deals'

interface DealCardProps {
  deal: DealWithRating
  onRateClick: (deal: DealWithRating) => void
  onTrackClick: (deal: DealWithRating) => void
}

export const DealCard: React.FC<DealCardProps> = React.memo(({
  deal,
  onRateClick,
  onTrackClick
}) => {
  const handleRateClick = () => onRateClick(deal)
  const handleTrackClick = () => onTrackClick(deal)

  // FIXED: Safe functions for string replacement
  const formatCategory = (category: string | undefined | null): string => {
    if (!category) return 'Other'
    return category.replace(/_/g, ' ')
  }

  const formatDealType = (dealType: string | undefined | null): string => {
    if (!dealType) return 'Special Offer'
    return dealType.replace(/_/g, ' ')
  }

  const formatMerchantName = (name: string | undefined | null): string => {
    if (!name) return 'Unknown Merchant'
    return name
  }

  const formatBonusAmount = (amount: string | undefined | null): string => {
    if (!amount) return 'Special Offer'
    return amount
  }

  const formatDescription = (description: string | undefined | null): string => {
    if (!description) return 'Great trading opportunity'
    return description
  }

  const formatTitle = (title: string | undefined | null): string => {
    if (!title) return 'Exclusive Deal'
    return title
  }

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 group">
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {deal.company?.logo_url ? (
              <img 
                src={deal.company.logo_url} 
                alt={formatMerchantName(deal.company_name)}
                className="w-10 h-10 rounded-lg object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.style.display = 'none'
                  if (e.currentTarget.nextElementSibling) {
                    (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex'
                  }
                }}
              />
            ) : null}
            
            {/* Fallback logo */}
            <div 
              className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center"
              style={{ display: deal.company?.logo_url ? 'none' : 'flex' }}
            >
              <span className="text-primary font-bold text-sm">
                {formatMerchantName(deal.company_name).charAt(0).toUpperCase()}
              </span>
            </div>
            
            <div>
              <h3 className="font-semibold text-text">
                {formatMerchantName(deal.company_name)}
              </h3>
              <p className="text-sm text-textSecondary capitalize">
                {formatCategory(deal.category)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-text">
              {deal.companyRating?.averageRating || deal.company?.overall_rating || deal.rating || 0}
            </span>
            <span className="text-xs text-textSecondary">
              ({deal.companyRating?.totalRatings || deal.company?.total_reviews || 0})
            </span>
          </div>
        </div>

        <h4 className="text-lg font-bold text-text mb-2 group-hover:text-primary transition-colors">
          {formatTitle(deal.title)}
        </h4>
        
        <p className="text-textSecondary text-sm mb-4 line-clamp-2">
          {formatDescription(deal.description)}
        </p>

        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text">Deal Value:</span>
            <span className="text-primary font-bold">
              {formatBonusAmount(deal.bonus_amount)}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm text-textSecondary">Type:</span>
            <span className="text-sm font-medium text-text capitalize">
              {formatDealType(deal.deal_type)}
            </span>
          </div>
        </div>

        {deal.terms && (
          <div className="text-xs text-textSecondary mb-4 p-2 bg-background rounded border border-border">
            <p className="font-medium mb-1">Terms & Conditions:</p>
            <p className="line-clamp-2">{deal.terms}</p>
          </div>
        )}

        {deal.userRating && (
          <div className="text-xs text-primary bg-primary/10 rounded px-2 py-1 mb-4">
            You rated: {deal.userRating.overall_rating}/5 stars
          </div>
        )}
      </div>

      <div className="px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-textSecondary">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>
                {deal.end_date 
                  ? `Ends ${new Date(deal.end_date).toLocaleDateString()}`
                  : 'No expiry'
                }
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{deal.click_count || 0} claimed</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleTrackClick}
            className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Claim Deal</span>
          </button>
          
          <button
            onClick={handleRateClick}
            className="bg-surface hover:bg-background border border-border text-text font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            title={deal.userRating ? "Update your rating" : "Rate this company"}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{deal.userRating ? 'Update' : 'Rate'}</span>
          </button>
        </div>
      </div>
    </div>
  )
})

DealCard.displayName = 'DealCard'