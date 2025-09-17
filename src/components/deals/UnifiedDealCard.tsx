// src/components/deals/UnifiedDealCard.tsx - FIXED with Proper Theme System
import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Icons } from '../icons'
import { DealWithRating } from '../../types/deals'

interface UnifiedDealCardProps {
  deal: DealWithRating
  onRateClick?: (deal: DealWithRating) => void
  onTrackClick: (deal: DealWithRating) => void
  isGuest?: boolean
  showRatingButton?: boolean
}

interface ParsedTerm {
  type: 'header' | 'section' | 'bullet' | 'paragraph'
  content: string
  level?: number
}

export const UnifiedDealCard: React.FC<UnifiedDealCardProps> = ({ 
  deal, 
  onRateClick, 
  onTrackClick,
  isGuest = false,
  showRatingButton = true
}) => {
  const [isClaimHovered, setIsClaimHovered] = useState(false)
  const [isRateHovered, setIsRateHovered] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [showRatingDetails, setShowRatingDetails] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [isCardHovered, setIsCardHovered] = useState(false)
  
  const cardRef = useRef<HTMLDivElement>(null)

  // Get real aggregated rating data
  const companyRating = deal.company?.overall_rating || 0
  const totalRatings = deal.company?.total_reviews || 0
  const hasUserRated = !!deal.userRating
  const userRatingType = deal.userRating?.rating_type

  // Handle clicks
  const handleTrackClick = useCallback(() => {
    onTrackClick(deal)
  }, [deal, onTrackClick])

  const handleRateClick = useCallback(() => {
    if (onRateClick && !isGuest) {
      onRateClick(deal)
    }
  }, [deal, onRateClick, isGuest])

  // Handle terms toggle
  const handleTermsClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowTerms(prev => !prev)
  }, [])

  // Auto-hide terms on mouse leave
  useEffect(() => {
    const handleMouseLeave = () => {
      if (showTerms && !isCardHovered) {
        const timer = setTimeout(() => {
          if (!isCardHovered) {
            setShowTerms(false)
          }
        }, 300)
        return () => clearTimeout(timer)
      }
    }

    if (cardRef.current) {
      cardRef.current.addEventListener('mouseleave', handleMouseLeave)
      return () => {
        cardRef.current?.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [showTerms, isCardHovered])

  // Parse terms content
  const parseTermsContent = useCallback((terms: any): ParsedTerm[] => {
    if (!terms) return []
    
    const termsArray = Array.isArray(terms) ? terms : [terms]
    const filtered = termsArray.filter(line => line && String(line).trim() !== '')
    
    return filtered.map(line => {
      const trimmedLine = String(line).trim()
      
      if (trimmedLine.toLowerCase().includes('terms and conditions')) {
        return { type: 'header', content: trimmedLine }
      }
      
      if (/^\d+\.\s+[A-Z\s&]+$/i.test(trimmedLine)) {
        return { type: 'section', content: trimmedLine, level: 1 }
      }
      
      if (/^\d+\.\d+\s+/.test(trimmedLine)) {
        return { type: 'section', content: trimmedLine, level: 2 }
      }
      
      if (/^[•▪▫-]\s+/.test(trimmedLine) || /^\s{2,}[•▪▫-]\s+/.test(trimmedLine)) {
        return { type: 'bullet', content: trimmedLine.replace(/^[\s•▪▫-]+/, '') }
      }
      
      return { type: 'paragraph', content: trimmedLine }
    })
  }, [])

  const parsedTerms = parseTermsContent(deal.terms)

  // Format rating for display
  const formatRating = (rating: number): string => {
    if (rating === 0) return '0.0'
    return rating.toFixed(1)
  }

  // Format category display
  const formatCategory = (category: string) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  // Deal status checks
  const isEndingSoon = deal.end_date && 
    new Date(deal.end_date).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000
  const isHighlyRated = companyRating >= 4.5 && totalRatings >= 10
  const isNewCompany = totalRatings === 0
  const hasLimitedRatings = totalRatings > 0 && totalRatings < 10

  // Trust level calculation
  const getTrustLevel = () => {
    if (totalRatings === 0) return { level: 'unrated', color: 'text-foreground/50', label: 'No ratings yet' }
    if (totalRatings < 10) return { level: 'new', color: 'text-success', label: 'New platform' }
    if (totalRatings < 50) return { level: 'emerging', color: 'text-success', label: 'Growing community' }
    if (totalRatings < 100) return { level: 'established', color: 'text-primary', label: 'Established' }
    return { level: 'trusted', color: 'text-secondary', label: 'Community trusted' }
  }

  const trustLevel = getTrustLevel()

  // Render star rating
  const renderStars = (rating: number, size: string = 'w-4 h-4') => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((starNumber) => {
          if (rating >= starNumber) {
            return (
              <Icons.star
                key={starNumber}
                className={`${size} fill-warning text-warning`}
              />
            )
          } else if (rating > starNumber - 1) {
            const fillPercentage = (rating - (starNumber - 1)) * 100
            return (
              <div key={starNumber} className="relative">
                <Icons.star className={`${size} text-foreground/30`} />
                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fillPercentage}%` }}
                >
                  <Icons.star className={`${size} text-warning fill-warning`} />
                </div>
              </div>
            )
          } else {
            return (
              <Icons.star
                key={starNumber}
                className={`${size} text-foreground/30`}
              />
            )
          }
        })}
      </div>
    )
  }

  // Render terms content within card
  const renderTermsContent = (term: ParsedTerm, index: number) => {
    switch (term.type) {
      case 'header':
        return (
          <div key={index} className="text-center py-md animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
            <h3 className="text-base font-bold text-foreground mb-sm">
              {term.content}
            </h3>
            <div className="w-12 h-0.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full animate-pulse" />
          </div>
        )

      case 'section':
        const sectionLevel = term.level || 1
        const headingSize = sectionLevel === 1 ? 'text-sm' : 'text-xs'
        const marginTop = sectionLevel === 1 ? 'mt-md' : 'mt-sm'
        
        return (
          <div key={index} className={`${marginTop} mb-sm animate-slide-in-left`} style={{ animationDelay: `${index * 100}ms` }}>
            <h4 className={`${headingSize} font-semibold text-foreground flex items-center gap-sm hover:text-primary transition-all duration-300 group hover:scale-105`}>
              <div className="w-1.5 h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full flex-shrink-0 group-hover:scale-125 transition-transform duration-300" />
              {term.content}
            </h4>
            <div className="w-full h-px bg-gradient-to-r from-divider/30 to-transparent mt-sm group-hover:from-primary/50 transition-colors duration-300" />
          </div>
        )

      case 'bullet':
        return (
          <div key={index} className="flex items-start gap-sm ml-md py-xs hover:bg-content2/30 rounded-md container-px-sm transition-all duration-300 group animate-slide-in-left" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="w-1 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mt-1.5 flex-shrink-0 group-hover:scale-125 transition-transform duration-300" />
            <p className="text-foreground/80 leading-relaxed text-xs group-hover:text-foreground transition-colors duration-300">
              {term.content}
            </p>
          </div>
        )

      case 'paragraph':
        return (
          <p key={index} className="text-foreground/80 leading-relaxed text-xs hover:bg-content2/20 rounded-md container-p-sm transition-all duration-300 animate-fade-in-up hover:scale-105" style={{ animationDelay: `${index * 100}ms` }}>
            {term.content}
          </p>
        )

      default:
        return null
    }
  }

  return (
    <div 
      ref={cardRef}
      className="group glass-enhanced rounded-2xl border border-divider/40 hover:border-primary/30 transition-all duration-500 hover:shadow-enhanced-lg hover:shadow-primary/10 card-hover-enhanced overflow-hidden flex flex-col h-full relative background-enhanced"
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
    >
      {/* Terms Overlay */}
      {showTerms && (
        <div className="absolute inset-0 glass-enhanced z-20 overflow-hidden animate-scale-in duration-500 flex flex-col">
          {/* Terms Header */}
          <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 container-p-lg border-b border-divider/30 flex-shrink-0">
            <div className="text-center">
              <h3 className="text-base font-bold text-foreground">Terms & Conditions</h3>
              <p className="text-xs text-foreground/60">{deal.company_name}</p>
            </div>
          </div>

          {/* Terms Content */}
          <div className="flex-1 overflow-y-auto container-p-lg scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent">
            {parsedTerms.length > 0 ? (
              <div className="space-y-sm">
                {parsedTerms.map(renderTermsContent)}
              </div>
            ) : (
              <div className="text-center py-xl animate-scale-in duration-500">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-sm animate-pulse">
                  <Icons.document className="w-6 h-6 text-primary/60" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-sm">No Terms Available</h3>
                <p className="text-xs text-foreground/60">
                  Please visit {deal.company_name}'s website for complete terms and conditions.
                </p>
              </div>
            )}
          </div>

          {/* Terms Footer */}
          <div className="bg-content2/95 backdrop-blur-sm border-t border-divider/30 container-p-lg flex-shrink-0">
            <div className="flex gap-sm">
              <button
                onClick={() => setShowTerms(false)}
                className="flex-1 container-px-md container-py-sm text-foreground/70 border border-divider/50 rounded-lg hover:bg-content2 hover:text-foreground transition-all duration-300 font-medium text-sm hover:scale-105 active:scale-95 focus-enhanced"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowTerms(false)
                  handleTrackClick()
                }}
                className="btn-enhanced flex-1 container-px-md container-py-sm bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-enhanced hover:scale-105 active:scale-95 transition-all duration-300 font-medium text-sm flex items-center justify-center gap-xs focus-enhanced"
              >
                <Icons.gift className="w-3 h-3" />
                Claim Deal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Card Content */}
      <div className={`flex-1 flex flex-col transition-opacity duration-300 ${showTerms ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {/* Header */}
        <div className="container-p-lg pb-md">
          <div className="flex items-start justify-between my-md gap-sm">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Company Logo */}
              <div className="relative flex-shrink-0">
                {deal.company?.logo_url ? (
                  <div className="relative">
                    <img
                      src={deal.company.logo_url}
                      alt={`${deal.company_name} logo`}
                      className={`w-16 h-16 rounded-xl object-cover bg-content2 border-2 border-divider/50 group-hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md ${
                        isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                      }`}
                      onLoad={() => setIsImageLoaded(true)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        setIsImageLoaded(true)
                      }}
                    />
                    {!isImageLoaded && (
                      <div className="absolute inset-0 w-16 h-16 bg-gradient-to-br from-content2 to-content3 animate-shimmer rounded-xl border-2 border-divider/50" />
                    )}
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-2 border-divider/50 group-hover:border-primary/50 transition-all duration-300 shadow-sm">
                    <Icons.arrowTrendingUp className="w-8 h-8 text-primary" />
                  </div>
                )}
                
                {/* Status Badges */}
                {isHighlyRated && (
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-warning to-warning/80 rounded-full flex items-center justify-center shadow-enhanced border-2 border-white animate-pulse-glow">
                    <Icons.trophy className="w-4 h-4 text-warning-foreground" />
                  </div>
                )}
                {isNewCompany && (
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-success to-success/80 rounded-full flex items-center justify-center shadow-enhanced border-2 border-white animate-float">
                    <Icons.sparkles className="w-4 h-4 text-success-foreground" />
                  </div>
                )}
                {trustLevel.level === 'trusted' && (
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-secondary to-secondary/80 rounded-full flex items-center justify-center shadow-enhanced border-2 border-white">
                    <Icons.shield className="w-4 h-4 text-secondary-foreground" />
                  </div>
                )}
              </div>

              {/* Company Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
                  {deal.company_name}
                </h3>
                
                {/* Rating Display */}
                <div className="mt-1">
                  {totalRatings > 0 ? (
                    <div className="flex items-center gap-2">
                      {renderStars(companyRating, 'w-3 h-3')}
                      <span className="text-sm font-medium text-foreground">
                        {formatRating(companyRating)}
                      </span>
                      <div className="flex items-center gap-1 text-primary">
                        <Icons.users className="w-3 h-3" />
                        <span className="text-xs font-medium">
                          {totalRatings.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-foreground/60 text-xs">
                      <Icons.star className="w-3 h-3" />
                      <span>No ratings yet</span>
                    </div>
                  )}
                  
                  {/* Trust Level Indicator */}
                  <div className={`text-xs ${trustLevel.color} font-medium mt-1`}>
                    {trustLevel.label}
                  </div>
                </div>
              </div>
            </div>

            {/* Category and Status Badges */}
            <div className="flex flex-col gap-2 items-end flex-shrink-0">
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full whitespace-nowrap border border-primary/20">
                {formatCategory(deal.category || '')}
              </span>
              {isEndingSoon && (
                <span className="px-2 py-1 bg-danger/10 text-danger text-xs font-medium rounded-full border border-danger/20 animate-pulse">
                  Ending Soon
                </span>
              )}
              {isHighlyRated && (
                <span className="px-2 py-1 bg-warning/10 text-warning text-xs font-medium rounded-full border border-warning/20">
                  Top Rated
                </span>
              )}
              {isNewCompany && (
                <span className="px-2 py-1 bg-success/10 text-success text-xs font-medium rounded-full border border-success/20">
                  New Platform
                </span>
              )}
            </div>
          </div>

          {/* Community Trust Section */}
          <div className="my-md container-p-sm glass rounded-xl border border-divider/30">
            <button
              onClick={() => setShowRatingDetails(!showRatingDetails)}
              className="w-full flex items-center justify-between hover:text-primary transition-colors focus-enhanced"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Icons.chart className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">
                  Community Ratings
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {totalRatings > 0 ? (
                  <>
                    <div className="flex items-center gap-1">
                      {renderStars(companyRating, 'w-3 h-3')}
                      <span className="font-semibold text-foreground text-sm">
                        {formatRating(companyRating)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-primary">
                      <Icons.users className="w-3 h-3 flex-shrink-0" />
                      <span className="font-semibold text-xs">{totalRatings.toLocaleString()}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-1">
                    <Icons.bolt className="w-4 h-4 text-success flex-shrink-0 animate-pulse" />
                    <span className="text-xs text-success font-medium">Be first!</span>
                  </div>
                )}
              </div>
            </button>

            {showRatingDetails && (
              <div className="mt-sm pt-sm border-t border-divider/30 animate-fade-in-up">
                {totalRatings > 0 ? (
                  <div className="space-y-sm">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground/70">Community Trust</span>
                      <span className={`font-medium ${trustLevel.color}`}>
                        {trustLevel.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground/70">Average Rating</span>
                      <div className="flex items-center gap-1">
                        <Icons.star className="w-4 h-4 fill-warning text-warning" />
                        <span className="font-medium text-foreground">
                          {formatRating(companyRating)} / 5.0
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground/70">Total Reviews</span>
                      <span className="font-medium text-primary">
                        {totalRatings.toLocaleString()} trader{totalRatings !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-sm text-foreground/70 mb-2">
                      No ratings yet for <span className="font-medium text-primary">{deal.company_name}</span>
                    </p>
                    <p className="text-xs text-success">
                      Be the first to share your experience!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Deal Title and Bonus */}
          <div className="my-md">
            <h2 className="text-base font-semibold text-foreground my-sm line-clamp-2 leading-snug break-words">
              {deal.title}
            </h2>
            
            {/* Bonus Display */}
            {deal.bonus_amount && (
              <div className="relative overflow-hidden bg-gradient-to-r from-secondary/20 to-primary/20 rounded-lg container-p-md my-sm h-16 flex items-center border border-primary/20">
                <div className="flex items-center gap-sm w-full">
                  <div className="w-8 h-8 bg-gradient-to-r from-secondary to-primary rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Icons.gift className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-foreground/70 font-medium">Bonus Offer</div>
                    <div className="text-primary font-semibold text-sm truncate">
                      {deal.bonus_amount}
                    </div>
                  </div>
                  <Icons.sparkles className="w-4 h-4 text-primary/50 flex-shrink-0 animate-pulse" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-foreground/70 my-md line-clamp-3 text-sm leading-relaxed">
            {deal.description}
          </p>

          {/* Features */}
          {deal.features && deal.features.length > 0 && (
            <div className="my-md">
              <div className="flex flex-wrap gap-sm">
                {deal.features.slice(0, 3).map((feature, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-content2 border border-divider/50 text-foreground/70 container-px-sm container-py-xs rounded-full hover:border-primary/30 transition-colors animate-scale-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {feature}
                  </span>
                ))}
                {deal.features.length > 3 && (
                  <span className="text-xs text-primary font-medium container-px-sm container-py-xs bg-primary/10 rounded-full border border-primary/20">
                    +{deal.features.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* User Rating Status */}
          {!isGuest && hasUserRated && (
            <div className="my-md container-p-sm bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-sm">
                  <Icons.success className="w-4 h-4 text-primary" />
                  <span className="text-sm text-primary font-medium">
                    You rated this company
                  </span>
                </div>
                <div className="text-xs text-primary bg-white container-px-xs container-py-xs rounded-full">
                  {userRatingType === 'overall' ? 'Quick' : 'Detailed'} rating
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>
      </div>

      {/* Action Buttons */}
      <div className={`container-p-lg pt-0 mt-auto transition-opacity duration-300 ${showTerms ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {/* Deal Metadata */}
        <div className="flex items-center gap-md text-xs text-foreground/70 my-md bg-content2/50 rounded-lg container-p-sm border border-divider/30">
          <div className="flex items-center gap-1">
            <Icons.time className="w-3 h-3" />
            <span>
              {deal.end_date 
                ? `Expires ${new Date(deal.end_date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}`
                : 'No expiration date'
              }
            </span>
          </div>
          {deal.commission_rate && (
            <div className="flex items-center gap-1">
              <Icons.arrowTrendingUp className="w-3 h-3" />
              <span>{deal.commission_rate}% commission</span>
            </div>
          )}
        </div>

        <div className="flex gap-sm">
          <button
            onClick={handleTrackClick}
            onMouseEnter={() => setIsClaimHovered(true)}
            onMouseLeave={() => setIsClaimHovered(false)}
            className="btn-enhanced flex-1 relative overflow-hidden bg-gradient-to-r from-primary to-secondary text-white font-medium text-sm container-py-sm container-px-md rounded-lg transition-all duration-300 hover:shadow-enhanced hover:scale-105 group/button focus-enhanced"
          >
            <div className="flex items-center justify-center gap-xs relative z-10">
              <Icons.gift className={`w-4 h-4 transition-transform duration-300 ${isClaimHovered ? 'scale-110 rotate-12' : ''}`} />
              <span>Claim Deal</span>
              <Icons.externalLink className={`w-3 h-3 transition-transform duration-300 ${isClaimHovered ? 'scale-110 translate-x-1' : ''}`} />
            </div>
          </button>
          
          {!isGuest && showRatingButton && onRateClick && (
            <button
              onClick={handleRateClick}
              onMouseEnter={() => setIsRateHovered(true)}
              onMouseLeave={() => setIsRateHovered(false)}
              className="bg-content2 hover:bg-content3 border border-divider/50 hover:border-primary/50 text-foreground font-medium text-sm container-py-sm container-px-md rounded-lg transition-all duration-300 hover:shadow-md group/rate relative card-hover-enhanced focus-enhanced"
              title={hasUserRated ? "Update your rating" : "Rate this company"}
            >
              <div className="flex items-center gap-xs">
                <Icons.chat className={`w-4 h-4 transition-transform duration-300 ${isRateHovered ? 'scale-110' : ''}`} />
                <span className="hidden sm:inline">
                  {hasUserRated ? 'Update' : 'Rate'}
                </span>
              </div>
              
              {isRateHovered && totalRatings > 0 && (
                <div className="absolute -top-1 -right-1 bg-primary text-white text-xs px-2 py-1 rounded-full font-medium shadow-enhanced z-10 min-w-6 text-center animate-scale-in">
                  {totalRatings}
                </div>
              )}
            </button>
          )}
        </div>

        {/* Terms Link */}
        <div className="mt-md flex justify-center">
          <button
            onClick={handleTermsClick}
            className="text-xs text-foreground/70 hover:text-primary transition-all duration-300 underline hover:no-underline container-px-md container-py-sm rounded-lg hover:bg-content2/50 focus-enhanced hover:scale-105 active:scale-95"
          >
            Terms & Conditions
          </button>
        </div>

        {/* Encouragement Messages */}
        {!isGuest && (
          <>
            {isNewCompany ? (
              <div className="mt-sm text-center">
                <p className="text-xs text-foreground/70">
                  Be the first to rate <span className="font-medium text-primary">{deal.company_name}</span> 
                  {' '}and help other traders!
                </p>
              </div>
            ) : hasLimitedRatings ? (
              <div className="mt-sm text-center">
                <p className="text-xs text-foreground/70">
                  Help build trust - <span className="font-medium text-primary">{deal.company_name}</span> 
                  {' '}needs more community reviews
                </p>
              </div>
            ) : (
              <div className="mt-sm text-center">
                <p className="text-xs text-foreground/70">
                  Trusted by <span className="font-medium text-primary">{totalRatings.toLocaleString()} traders</span> 
                  {' '}in our community
                </p>
              </div>
            )}
          </>
        )}

        {/* Guest Message */}
        {isGuest && (
          <div className="mt-sm text-center">
            <p className="text-xs text-foreground/70">
              <span className="font-medium text-primary">Sign up</span> to rate companies and help the community!
            </p>
          </div>
        )}
      </div>

      {/* Hover Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl ${showTerms ? 'hidden' : ''}`} />
    </div>
  )
}

export default UnifiedDealCard