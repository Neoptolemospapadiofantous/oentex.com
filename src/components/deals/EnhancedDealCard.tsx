// src/components/deals/EnhancedDealCard.tsx
import React, { useState, useEffect } from 'react'
import { ExternalLink, Star, Clock, Gift, MessageSquare, Users } from 'lucide-react'
import { useAuth } from '../../lib/authContext'
import { AverageRating } from '../rating/AverageRating'
import { RatingModal } from '../rating/RatingModal'
import { AuthModal } from '../auth/AuthModals'
import { ratingService } from '../../lib/services/ratingService'
import toast from 'react-hot-toast'

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
}

interface CompanyRatingData {
  averageRating: number
  totalRatings: number
  userRating?: {
    id: string
    overall_rating: number
    platform_usability?: number
    customer_support?: number
    fees_commissions?: number
    security_trust?: number
    educational_resources?: number
    mobile_app?: number
  }
}

interface EnhancedDealCardProps {
  deal: Deal
  company?: Company
  onAffiliateClick: (platform: string, url: string) => void
}

export const EnhancedDealCard: React.FC<EnhancedDealCardProps> = ({ 
  deal, 
  company, 
  onAffiliateClick 
}) => {
  const [ratingData, setRatingData] = useState<CompanyRatingData>({
    averageRating: company?.overall_rating || 0,
    totalRatings: company?.total_reviews || 0
  })
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  
  const { user } = useAuth()

  useEffect(() => {
    if (company && user) {
      fetchRatingData()
    }
  }, [company?.id, user])

  const fetchRatingData = async () => {
    if (!company) return
    
    try {
      setLoading(true)
      
      const [averageData, userRating] = await Promise.all([
        ratingService.getCompanyAverageRating(company.id),
        user ? ratingService.getUserRating(user.id, company.id) : Promise.resolve(null)
      ])
      
      setRatingData({
        averageRating: averageData.averageRating,
        totalRatings: averageData.totalRatings,
        userRating: userRating || undefined
      })
    } catch (error) {
      console.error('Error fetching rating data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRateClick = () => {
    if (!user) {
      setAuthMode('login')
      setShowAuthModal(true)
      return
    }
    
    if (!company) {
      toast.error('Company information not available')
      return
    }
    
    setShowRatingModal(true)
  }

  const handleRatingSubmitted = () => {
    fetchRatingData() // Refresh rating data
    toast.success('Thank you for your rating!')
  }

  return (
    <div className="group bg-surface/50 backdrop-blur-lg rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:transform hover:scale-[1.02]">
      {/* Deal Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {deal.image_url && (
            <img 
              src={deal.image_url} 
              alt={deal.merchant_name}
              className="w-12 h-12 rounded-lg object-cover"
            />
          )}
          <div>
            <h3 className="text-lg font-semibold text-text">{deal.title}</h3>
            <p className="text-sm text-textSecondary">{deal.merchant_name}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-primary">{deal.bonus_amount}</div>
          <span className="text-xs text-textSecondary bg-primary/10 px-2 py-1 rounded-full">
            {deal.category}
          </span>
        </div>
      </div>

      {/* Rating Section */}
      {company && (
        <div className="mb-4 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {loading ? (
                <div className="animate-pulse flex items-center space-x-2">
                  <div className="w-20 h-4 bg-gray-300 rounded"></div>
                  <div className="w-16 h-3 bg-gray-200 rounded"></div>
                </div>
              ) : (
                <AverageRating 
                  rating={ratingData.averageRating} 
                  totalRatings={ratingData.totalRatings}
                  size="sm"
                />
              )}
            </div>
            
            <button
              onClick={handleRateClick}
              className="flex items-center space-x-1 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <Star className="w-4 h-4" />
              <span>
                {ratingData.userRating ? 'Update Rating' : 'Rate Company'}
              </span>
            </button>
          </div>
          
          {ratingData.userRating && (
            <div className="mt-2 text-xs text-textSecondary">
              You rated this company {ratingData.userRating.overall_rating}/5 stars
            </div>
          )}
        </div>
      )}

      {/* Deal Description */}
      <p className="text-textSecondary mb-4 line-clamp-3">{deal.description}</p>

      {/* Features */}
      {deal.features && deal.features.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {deal.features.slice(0, 3).map((feature, index) => (
              <span 
                key={index}
                className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full"
              >
                {feature}
              </span>
            ))}
            {deal.features.length > 3 && (
              <span className="text-xs text-textSecondary">
                +{deal.features.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Terms */}
      {deal.terms && (
        <div className="mb-4 p-3 bg-background rounded-lg">
          <p className="text-xs text-textSecondary">{deal.terms}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={() => onAffiliateClick(deal.merchant_name, deal.tracking_link)}
          className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-3 px-4 rounded-lg font-medium hover:from-primary/90 hover:to-secondary/90 transition-all flex items-center justify-center space-x-2"
        >
          <Gift className="w-4 h-4" />
          <span>Claim Deal</span>
          <ExternalLink className="w-4 h-4" />
        </button>
        
        <button
          onClick={handleRateClick}
          className="px-4 py-3 border border-border rounded-lg text-textSecondary hover:text-text hover:border-primary/50 transition-all"
        >
          <MessageSquare className="w-4 h-4" />
        </button>
      </div>

      {/* Deal Metadata */}
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-textSecondary">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>
              {deal.end_date 
                ? `Ends ${new Date(deal.end_date).toLocaleDateString()}`
                : 'Ongoing'
              }
            </span>
          </div>
          {deal.commission_rate && (
            <div>Commission: {deal.commission_rate}%</div>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <Users className="w-3 h-3" />
          <span>{ratingData.totalRatings} reviews</span>
        </div>
      </div>

      {/* Rating Modal */}
      {company && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          companyId={company.id}
          companyName={company.name}
          existingRating={ratingData.userRating}
          onRatingSubmitted={handleRatingSubmitted}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onSwitchMode={setAuthMode}
      />
    </div>
  )
}