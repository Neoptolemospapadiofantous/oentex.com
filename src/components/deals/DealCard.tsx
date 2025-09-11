// src/components/deals/DealCard.tsx - Complete implementation with Enhanced Terms Modal
import React, { useState, useCallback } from 'react'
import { Icons } from '../icons'
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
  const [showTermsModal, setShowTermsModal] = useState(false)

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
              <Icons.star
                key={starNumber}
                className={`${size} fill-yellow-400 text-yellow-400`}
              />
            )
          } else if (rating > starNumber - 1) {
            const fillPercentage = (rating - (starNumber - 1)) * 100
            return (
              <div key={starNumber} className="relative">
                <Icons.star className={`${size} text-gray-300`} />
                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fillPercentage}%` }}
                >
                  <Icons.star className={`${size} text-yellow-400 fill-yellow-400`} />
                </div>
              </div>
            )
          } else {
            return (
              <Icons.star
                key={starNumber}
                className={`${size} text-gray-300`}
              />
            )
          }
        })}
      </div>
    )
  }

  // Enhanced Terms & Conditions Modal - Completely Redesigned
  const TermsModal = () => {
    if (!showTermsModal) return null

    // Helper function to format terms array into readable content
    const formatTermsContent = (terms: any) => {
      if (!terms) return []
      
      // Handle both array and string formats
      const termsArray = Array.isArray(terms) ? terms : [terms]
      return termsArray.filter(line => line && line.trim() !== '')
    }

    const formattedTerms = formatTermsContent(deal.terms)

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 container-p-lg animate-in fade-in duration-300">
        <div className="bg-content1 rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-hidden shadow-2xl border border-border/50 animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 mx-auto">
          
          {/* Header */}
          <div className="relative bg-gradient-to-r from-primary/5 via-secondary/3 to-primary/5 container-p-2xl container-pb-lg border-b border-border/30 overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-secondary/3 animate-pulse"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-xl"></div>
            
            <div className="relative flex items-center justify-center mt-lg">
              <div className="flex items-center gap-lg flex-1 min-w-0 justify-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group/icon">
                  <Icons.document className="w-6 h-6 text-white group-hover/icon:scale-110 transition-transform duration-300" />
                </div>
                <div className="min-w-0 flex-1 text-center">
                  <h3 className="text-2xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text mb-sm">
                    Terms & Conditions
                  </h3>
                  <p className="text-base text-foreground/60 font-medium">{deal.company_name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowTermsModal(false)}
                className="absolute top-4 right-4 container-p-md hover:bg-content2 rounded-xl transition-all duration-200 flex-shrink-0 group hover:scale-105 active:scale-95"
              >
                <Icons.close className="w-6 h-6 text-foreground/60 group-hover:text-foreground transition-colors group-hover:rotate-90 duration-300" />
              </button>
            </div>
            
            {/* Offer Summary in Header */}
            <div className="mt-xl container-p-lg bg-content2/50 rounded-2xl border border-border/30 backdrop-blur-sm hover:bg-content2/70 transition-all duration-300 group/summary">
              <div className="flex items-center justify-center text-center">
                <div className="flex flex-col items-center gap-md">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center group-hover/summary:scale-110 transition-transform duration-300">
                    <Icons.gift className="w-5 h-5 text-primary group-hover/summary:animate-bounce" />
                  </div>
                  <div>
                    <span className="text-lg font-semibold text-foreground group-hover/summary:text-primary transition-colors duration-300">{deal.value}</span>
                    <p className="text-sm text-foreground/60 font-medium">Exclusive Offer</p>
                  </div>
                  <div className="text-center">
                    <div className="text-base font-medium text-foreground group-hover/summary:text-primary transition-colors duration-300">
                      {deal.end_date ? new Date(deal.end_date).toLocaleDateString() : 'No expiry'}
                    </div>
                    <p className="text-sm text-foreground/60 font-medium">Expires</p>
                  </div>
                </div>
              </div>
              {/* Subtle shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover/summary:translate-x-[100%] transition-transform duration-1000 rounded-2xl"></div>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[50vh] container-p-lg scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent hover:scrollbar-thumb-primary/50">
            {formattedTerms.length > 0 ? (
              <div className="space-y-lg animate-in slide-in-from-top-2 duration-700">
                {formattedTerms.map((line, index) => {
                  const trimmedLine = line.trim()
                  
                  // Check if it's a main header
                  if (trimmedLine.includes('Terms and Conditions')) {
                    return (
                      <div key={index} className="text-center container-py-lg animate-in fade-in slide-in-from-top-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                        <h2 className="text-2xl font-bold text-foreground mb-sm bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                          {trimmedLine}
                        </h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full animate-pulse"></div>
                        <div className="w-16 h-0.5 bg-gradient-to-r from-secondary/50 to-primary/50 mx-auto rounded-full mt-1"></div>
                      </div>
                    )
                  }
                  
                  // Check if it's a section header (numbered)
                  if (trimmedLine.match(/^\d+\.\s+[A-Z\s&]+$/)) {
                    return (
                      <div key={index} className="mt-2xl mb-md animate-in fade-in slide-in-from-left-4 duration-500 hover:bg-content2/30 rounded-xl container-p-sm transition-all duration-300 group/section" style={{ animationDelay: `${index * 150}ms` }}>
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-sm group-hover/section:text-primary transition-colors duration-300">
                          <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full flex-shrink-0 group-hover/section:scale-125 transition-transform duration-300"></div>
                          {trimmedLine}
                        </h3>
                        <div className="w-full h-px bg-gradient-to-r from-border/50 to-transparent mt-sm group-hover/section:from-primary/30 group-hover/section:to-primary/10 transition-all duration-300"></div>
                      </div>
                    )
                  }
                  
                  // Check if it's a bullet point
                  if (trimmedLine.startsWith('•') || trimmedLine.startsWith('   •')) {
                    return (
                      <div key={index} className="flex items-start gap-sm ml-md animate-in fade-in slide-in-from-left-2 duration-400 hover:bg-content2/20 rounded-lg container-p-sm transition-all duration-300 group/bullet" style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full mt-sm flex-shrink-0 group-hover/bullet:scale-125 group-hover/bullet:animate-pulse transition-all duration-300"></div>
                        <p className="text-foreground/80 leading-relaxed text-sm group-hover/bullet:text-foreground transition-colors duration-300">
                          {trimmedLine.replace(/^\s*•\s*/, '')}
                        </p>
                      </div>
                    )
                  }
                  
                  // Regular content
                  return (
                    <p key={index} className="text-foreground/80 leading-relaxed text-sm animate-in fade-in slide-in-from-bottom-2 duration-400 hover:bg-content2/10 rounded-lg container-p-sm transition-all duration-300 group/paragraph" style={{ animationDelay: `${index * 80}ms` }}>
                      {trimmedLine}
                    </p>
                  )
                })}
              </div>
            ) : (
              <div className="text-center container-py-3xl animate-in fade-in zoom-in-95 duration-600">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-md animate-pulse hover:scale-110 transition-transform duration-300 group/empty">
                  <Icons.document className="w-8 h-8 text-primary/60 group-hover/empty:text-primary group-hover/empty:animate-bounce" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-sm bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  No Terms Available
                </h3>
                <p className="text-foreground/60 text-sm font-medium">Please visit {deal.company_name}'s website for complete terms and conditions.</p>
                <div className="mt-md w-24 h-1 bg-gradient-to-r from-primary/30 to-secondary/30 mx-auto rounded-full animate-pulse"></div>
              </div>
            )}
          </div>


          {/* Footer */}
          <div className="border-t border-border/30 container-p-lg bg-content2/30 backdrop-blur-sm relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/2 via-transparent to-secondary/2 animate-pulse"></div>
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-lg"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-secondary/5 to-transparent rounded-full blur-md"></div>
            
            <div className="relative flex flex-col sm:flex-row gap-sm sm:justify-end">
              <button
                onClick={() => setShowTermsModal(false)}
                className="container-px-lg container-py-sm text-foreground/70 border border-border rounded-xl hover:bg-content2 hover:text-foreground hover:scale-105 active:scale-95 transition-all duration-200 font-medium hover:shadow-md group/close"
              >
                <span className="group-hover/close:animate-pulse">Close</span>
              </button>
              <button
                onClick={() => {
                  setShowTermsModal(false)
                  handleTrackClick()
                }}
                className="container-px-lg container-py-sm bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg hover:shadow-primary/25 hover:scale-105 active:scale-95 transition-all duration-200 font-medium flex items-center justify-center gap-sm group/claim relative overflow-hidden"
              >
                <Icons.gift className="w-4 h-4 group-hover/claim:scale-110 group-hover/claim:rotate-12 transition-all duration-300" />
                <span className="group-hover/claim:animate-pulse">Claim Deal</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/claim:translate-x-[100%] transition-transform duration-700"></div>
              </button>
            </div>
          </div>

        </div>
      </div>
    )
  }

  return (
    <>
      {/* ✅ FIXED: Added flex flex-col h-full to ensure consistent card heights */}
      <div className="group bg-surface rounded-2xl border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden flex flex-col h-full">
        {/* Content area that will grow to fill available space */}
        <div className="flex-1 flex flex-col">
          {/* Header with company info and badges */}
          <div className="p-lg pb-md">
            <div className="flex items-start justify-between my-md gap-sm">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Company Logo */}
                <div className="relative flex-shrink-0">
                  {deal.company?.logo_url ? (
                    <div className="relative">
                      <img
                        src={deal.company.logo_url}
                        alt={`${deal.company_name} logo`}
                        className={`w-16 h-16 rounded-xl object-cover bg-background border-2 border-border group-hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md ${
                          isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                        }`}
                        onLoad={() => setIsImageLoaded(true)}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          setIsImageLoaded(true) // Show fallback when image fails
                        }}
                      />
                      {!isImageLoaded && (
                        <div className="absolute inset-0 w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-xl border-2 border-border" />
                      )}
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-2 border-border group-hover:border-primary/50 transition-all duration-300 shadow-sm">
                      <Icons.arrowTrendingUp className="w-8 h-8 text-primary" />
                    </div>
                  )}
                  
                  {/* Status badges */}
                  {isHighlyRated && (
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                      <Icons.trophy className="w-4 h-4 text-yellow-800" />
                    </div>
                  )}
                  {isNewCompany && (
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                      <Icons.sparkles className="w-4 h-4 text-green-800" />
                    </div>
                  )}
                  {trustLevel.level === 'trusted' && (
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                      <Icons.shield className="w-4 h-4 text-purple-800" />
                    </div>
                  )}
                </div>

                {/* Company info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-text group-hover:text-primary transition-colors truncate">
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
                          <Icons.users className="w-3 h-3" />
                          <span className="text-xs font-medium">
                            {totalRatings.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-textSecondary text-xs">
                        <Icons.star className="w-3 h-3" />
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
              <div className="flex flex-col gap-2 items-end flex-shrink-0">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full whitespace-nowrap">
                  {formatCategory(deal.category || '')}
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
            <div className="my-md p-sm bg-background rounded-xl border border-border">
              <button
                onClick={() => setShowRatingDetails(!showRatingDetails)}
                className="w-full flex items-center justify-between hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Icons.chart className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium text-text">
                    Community Ratings
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {totalRatings > 0 ? (
                    <>
                      <div className="flex items-center gap-1">
                        {renderStars(companyRating, 'w-3 h-3')}
                        <span className="font-semibold text-text text-sm">
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
                      <Icons.bolt className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-xs text-green-600 font-medium">Be first!</span>
                    </div>
                  )}
                </div>
              </button>

              {showRatingDetails && (
                <div className="mt-sm pt-sm border-t border-border">
                  {totalRatings > 0 ? (
                    <div className="space-y-sm">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-textSecondary">Community Trust</span>
                        <span className={`font-medium ${trustLevel.color}`}>
                          {trustLevel.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-textSecondary">Average Rating</span>
                        <div className="flex items-center gap-1">
                          <Icons.star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
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
                        Be the first to share your experience!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Deal title and bonus */}
            <div className="my-md">
              <h2 className="text-base font-semibold text-text my-sm line-clamp-2 leading-snug break-words">
                {deal.title}
              </h2>
              
              {/* Bonus amount highlight */}
              {deal.bonus_amount && (
                <div className="relative overflow-hidden bg-gradient-to-r from-secondary/20 to-primary/20 rounded-lg p-md my-sm h-16 flex items-center">
                  <div className="flex items-center gap-sm w-full">
                    <div className="w-8 h-8 bg-gradient-to-r from-secondary to-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icons.gift className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-textSecondary font-medium">Bonus Offer</div>
                      <div className="text-primary font-semibold text-sm truncate">
                        {deal.bonus_amount}
                      </div>
                    </div>
                    <Icons.sparkles className="w-4 h-4 text-primary/50 flex-shrink-0" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                </div>
              )}
            </div>

            {/* Deal description */}
            <p className="text-textSecondary my-md line-clamp-3 text-sm leading-relaxed">
              {deal.description}
            </p>

            {/* Features */}
            {deal.features && deal.features.length > 0 && (
              <div className="my-md">
                <div className="flex flex-wrap gap-sm">
                  {deal.features.slice(0, 3).map((feature, index) => (
                    <span 
                      key={index}
                      className="text-xs bg-background border border-border text-textSecondary container-px-sm container-py-xs rounded-full hover:border-primary/30 transition-colors"
                    >
                      {feature}
                    </span>
                  ))}
                  {deal.features.length > 3 && (
                    <span className="text-xs text-primary font-medium container-px-sm container-py-xs bg-primary/10 rounded-full">
                      +{deal.features.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* User rating status */}
            {hasUserRated && (
              <div className="my-md p-sm bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-lg">
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

          {/* Spacer div to push buttons to bottom */}
          <div className="flex-1"></div>
        </div>

        {/* Action Buttons - Always at bottom */}
        <div className="p-lg pt-0 mt-auto">
          {/* Deal metadata - Always at bottom */}
          <div className="flex items-center gap-md text-xs text-textSecondary my-md bg-background rounded-lg p-sm">
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
              className="flex-1 relative overflow-hidden bg-gradient-to-r from-primary to-secondary text-white font-medium text-sm container-py-sm container-px-md rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 group/button"
            >
              <div className="flex items-center justify-center gap-xs relative z-10">
                <Icons.gift className={`w-4 h-4 transition-transform duration-300 ${isClaimHovered ? 'scale-110 rotate-12' : ''}`} />
                <span>Claim Deal</span>
                <Icons.externalLink className={`w-3 h-3 transition-transform duration-300 ${isClaimHovered ? 'scale-110 translate-x-1' : ''}`} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/button:translate-x-[100%] transition-transform duration-700" />
            </button>
            
            <button
              onClick={handleRateClick}
              onMouseEnter={() => setIsRateHovered(true)}
              onMouseLeave={() => setIsRateHovered(false)}
              className="bg-surface hover:bg-background border border-border hover:border-primary/50 text-text font-medium text-sm container-py-sm container-px-md rounded-lg transition-all duration-300 hover:shadow-md group/rate relative"
              title={hasUserRated ? "Update your rating" : "Rate this company"}
            >
              <div className="flex items-center gap-xs">
                <Icons.chat className={`w-4 h-4 transition-transform duration-300 ${isRateHovered ? 'scale-110' : ''}`} />
                <span className="hidden sm:inline">
                  {hasUserRated ? 'Update' : 'Rate'}
                </span>
              </div>
              
              {/* Show count of existing ratings on hover */}
              {isRateHovered && totalRatings > 0 && (
                <div className="absolute -top-1 -right-1 bg-primary text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg z-10 min-w-6 text-center">
                  {totalRatings}
                </div>
              )}
            </button>
          </div>

          {/* Terms & Conditions Link */}
          <div className="mt-md flex justify-center">
            <button
              onClick={() => setShowTermsModal(true)}
              className="text-xs text-textSecondary hover:text-primary transition-colors underline hover:no-underline flex items-center gap-xs container-px-md container-py-sm rounded-lg hover:bg-background/50"
            >
              <Icons.document className="w-3 h-3" />
              Terms & Conditions
            </button>
          </div>

          {/* Rating encouragement */}
          {isNewCompany ? (
            <div className="mt-sm text-center">
              <p className="text-xs text-textSecondary">
                Be the first to rate <span className="font-medium text-primary">{deal.company_name}</span> 
                {' '}and help other traders!
              </p>
            </div>
          ) : hasLimitedRatings ? (
            <div className="mt-sm text-center">
              <p className="text-xs text-textSecondary">
                Help build trust - <span className="font-medium text-primary">{deal.company_name}</span> 
                {' '}needs more community reviews
              </p>
            </div>
          ) : (
            <div className="mt-sm text-center">
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

      {/* Enhanced Terms & Conditions Modal */}
      <TermsModal />
    </>
  )
}

export default DealCard