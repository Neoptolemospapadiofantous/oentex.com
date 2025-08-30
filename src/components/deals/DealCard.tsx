import React, { useState, useCallback } from 'react'
import { 
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Chip,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Avatar,
  Divider
} from '@heroui/react'
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
  Zap,
  FileText
} from 'lucide-react'
import { motion } from 'framer-motion'
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
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const { isOpen: isTermsOpen, onOpen: onTermsOpen, onClose: onTermsClose } = useDisclosure()

  const companyRating = deal.company?.overall_rating || 0
  const totalRatings = deal.company?.total_reviews || 0
  const hasUserRated = !!deal.userRating
  const userRatingType = deal.userRating?.rating_type

  const handleTrackClick = useCallback(() => {
    onTrackClick(deal)
  }, [deal, onTrackClick])

  const handleRateClick = useCallback(() => {
    onRateClick(deal)
  }, [deal, onRateClick])

  const formatRating = (rating: number): string => {
    if (rating === 0) return '0.0'
    return rating.toFixed(1)
  }

  const formatCategory = (category: string) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const isEndingSoon = deal.end_date && 
    new Date(deal.end_date).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000

  const isHighlyRated = companyRating >= 4.5 && totalRatings >= 10
  const isNewCompany = totalRatings === 0
  const hasLimitedRatings = totalRatings > 0 && totalRatings < 10

  const getTrustLevel = () => {
    if (totalRatings === 0) return { level: 'unrated', color: 'default', label: 'No ratings yet' }
    if (totalRatings < 10) return { level: 'new', color: 'primary', label: 'New platform' }
    if (totalRatings < 50) return { level: 'emerging', color: 'success', label: 'Growing community' }
    if (totalRatings < 100) return { level: 'established', color: 'secondary', label: 'Established' }
    return { level: 'trusted', color: 'warning', label: 'Community trusted' }
  }

  const trustLevel = getTrustLevel()

  const renderStars = (rating: number, size: string = 'w-4 h-4') => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((starNumber) => (
          <Star
            key={starNumber}
            className={`${size} ${
              starNumber <= rating 
                ? 'fill-warning text-warning' 
                : 'text-default-300'
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card className="h-full card-hover">
          <CardHeader className="flex gap-3 pb-0">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Company Logo */}
              <div className="relative flex-shrink-0">
                {deal.company?.logo_url ? (
                  <Avatar
                    src={deal.company.logo_url}
                    name={deal.company_name}
                    size="lg"
                    className="border-2 border-divider"
                    fallback={<TrendingUp className="w-6 h-6" />}
                  />
                ) : (
                  <Avatar
                    name={deal.company_name}
                    size="lg"
                    className="bg-gradient-to-br from-primary-200 to-secondary-200"
                    fallback={<TrendingUp className="w-6 h-6" />}
                  />
                )}
                
                {/* Status badges */}
                {isHighlyRated && (
                  <div className="absolute -top-1 -right-1">
                    <Chip size="sm" color="warning" variant="solid" className="min-w-6 h-6 px-1">
                      <Award className="w-3 h-3" />
                    </Chip>
                  </div>
                )}
                {isNewCompany && (
                  <div className="absolute -top-1 -right-1">
                    <Chip size="sm" color="success" variant="solid" className="min-w-6 h-6 px-1">
                      <Sparkles className="w-3 h-3" />
                    </Chip>
                  </div>
                )}
              </div>

              {/* Company info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">
                  {deal.company_name}
                </h3>
                
                {/* Real community rating display */}
                <div className="mt-1">
                  {totalRatings > 0 ? (
                    <div className="flex items-center gap-2">
                      {renderStars(companyRating, 'w-3 h-3')}
                      <span className="text-small font-medium">
                        {formatRating(companyRating)}
                      </span>
                      <div className="flex items-center gap-1 text-primary">
                        <Users className="w-3 h-3" />
                        <span className="text-tiny font-medium">
                          {totalRatings.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-default-500 text-tiny">
                      <Star className="w-3 h-3" />
                      <span>No ratings yet</span>
                    </div>
                  )}
                  
                  <Chip
                    size="sm"
                    color={trustLevel.color as any}
                    variant="flat"
                    className="mt-1"
                  >
                    {trustLevel.label}
                  </Chip>
                </div>
              </div>
            </div>

            {/* Category and status badges */}
            <div className="flex flex-col gap-2 items-end flex-shrink-0">
              <Chip
                size="sm"
                color="primary"
                variant="flat"
              >
                {formatCategory(deal.category)}
              </Chip>
              {isEndingSoon && (
                <Chip size="sm" color="danger" variant="flat">
                  Ending Soon
                </Chip>
              )}
              {isHighlyRated && (
                <Chip size="sm" color="warning" variant="flat">
                  Top Rated
                </Chip>
              )}
              {isNewCompany && (
                <Chip size="sm" color="success" variant="flat">
                  New Platform
                </Chip>
              )}
            </div>
          </CardHeader>

          <CardBody className="pt-4">
            {/* Community Trust Section */}
            <Card className="mb-4 bg-content2">
              <CardBody className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <BarChart3 className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-small font-medium">
                      Community Ratings
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {totalRatings > 0 ? (
                      <>
                        <div className="flex items-center gap-1">
                          {renderStars(companyRating, 'w-3 h-3')}
                          <span className="font-semibold text-small">
                            {formatRating(companyRating)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-primary">
                          <Users className="w-3 h-3 flex-shrink-0" />
                          <span className="font-semibold text-tiny">{totalRatings.toLocaleString()}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Zap className="w-4 h-4 text-success flex-shrink-0" />
                        <span className="text-tiny text-success font-medium">Be first!</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Deal title and bonus */}
            <div className="mb-4">
              <h2 className="text-lg font-bold mb-3 line-clamp-2 leading-snug">
                {deal.title}
              </h2>
              
              {/* Bonus amount highlight */}
              {deal.bonus_amount && (
                <Card className="bg-gradient-to-r from-secondary-50 to-primary-50 border-primary-200 mb-3">
                  <CardBody className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        icon={<Gift className="w-5 h-5" />}
                        className="bg-gradient-to-r from-secondary to-primary text-white"
                        size="sm"
                      />
                      <div>
                        <div className="text-tiny text-default-600 font-medium">Bonus Offer</div>
                        <div className="text-primary font-bold text-lg">
                          {deal.bonus_amount}
                        </div>
                      </div>
                      <Sparkles className="w-5 h-5 text-primary/50 ml-auto" />
                    </div>
                  </CardBody>
                </Card>
              )}
            </div>

            {/* Deal description */}
            <p className="text-default-600 mb-4 line-clamp-3 text-small leading-relaxed">
              {deal.description}
            </p>

            {/* Features */}
            {deal.features && deal.features.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {deal.features.slice(0, 3).map((feature, index) => (
                    <Chip 
                      key={index}
                      size="sm"
                      variant="bordered"
                      className="text-tiny"
                    >
                      {feature}
                    </Chip>
                  ))}
                  {deal.features.length > 3 && (
                    <Chip size="sm" color="primary" variant="flat">
                      +{deal.features.length - 3} more
                    </Chip>
                  )}
                </div>
              </div>
            )}

            {/* User rating status */}
            {hasUserRated && (
              <Card className="mb-4 bg-primary-50 border-primary-200">
                <CardBody className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-small text-primary font-medium">
                        You rated this company
                      </span>
                    </div>
                    <Chip size="sm" color="primary" variant="flat">
                      {userRatingType === 'overall' ? 'Quick' : 'Detailed'} rating
                    </Chip>
                  </div>
                </CardBody>
              </Card>
            )}
          </CardBody>

          <CardFooter className="flex-col gap-3">
            {/* Deal metadata */}
            <Card className="w-full bg-content2">
              <CardBody className="p-3">
                <div className="flex items-center gap-4 text-tiny text-default-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
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
                      <TrendingUp className="w-3 h-3" />
                      <span>{deal.commission_rate}% commission</span>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>

            <div className="flex gap-3 w-full">
              <Button
                color="primary"
                className="flex-1"
                startContent={<Gift className="w-4 h-4" />}
                endContent={<ExternalLink className="w-4 h-4" />}
                onPress={handleTrackClick}
              >
                Claim Deal
              </Button>
              
              <Button
                variant="bordered"
                isIconOnly
                onPress={handleRateClick}
                title={hasUserRated ? "Update your rating" : "Rate this company"}
              >
                <MessageSquare className="w-4 h-4" />
              </Button>
            </div>

            {/* Terms & Conditions Link */}
            <Button
              variant="light"
              size="sm"
              startContent={<FileText className="w-3 h-3" />}
              onPress={onTermsOpen}
              className="text-tiny"
            >
              Terms & Conditions
            </Button>

            {/* Rating encouragement */}
            {isNewCompany ? (
              <p className="text-tiny text-default-500 text-center">
                Be the first to rate <span className="font-medium text-primary">{deal.company_name}</span> 
                {' '}and help other traders!
              </p>
            ) : hasLimitedRatings ? (
              <p className="text-tiny text-default-500 text-center">
                Help build trust - <span className="font-medium text-primary">{deal.company_name}</span> 
                {' '}needs more community reviews
              </p>
            ) : (
              <p className="text-tiny text-default-500 text-center">
                Trusted by <span className="font-medium text-primary">{totalRatings.toLocaleString()} traders</span> 
                in our community
              </p>
            )}
          </CardFooter>
        </Card>
      </motion.div>

      {/* Terms & Conditions Modal */}
      <Modal 
        isOpen={isTermsOpen} 
        onClose={onTermsClose}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-semibold">Terms & Conditions</h3>
                  <p className="text-small text-default-500">{deal.company_name}</p>
                </div>
              </ModalHeader>
              
              <ModalBody>
                {deal.terms ? (
                  <div className="space-y-4">
                    {Array.isArray(deal.terms) ? (
                      deal.terms.map((term, index) => (
                        <p key={index} className="text-small text-default-700 leading-relaxed">
                          {term}
                        </p>
                      ))
                    ) : (
                      <p className="text-small text-default-700 leading-relaxed">
                        {deal.terms}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-default-300 mx-auto mb-3" />
                    <h3 className="font-medium mb-2">No Terms Available</h3>
                    <p className="text-small text-default-600">Please visit {deal.company_name}'s website for terms.</p>
                  </div>
                )}
              </ModalBody>
              
              <ModalFooter>
                <Card className="w-full bg-content2">
                  <CardBody className="p-4">
                    <div className="flex items-center justify-between text-small">
                      <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-primary" />
                        <span className="font-medium">{deal.value}</span>
                      </div>
                      <div className="text-default-600">
                        Expires: {deal.end_date ? new Date(deal.end_date).toLocaleDateString() : 'No expiry'}
                      </div>
                    </div>
                  </CardBody>
                </Card>
                
                <div className="flex gap-3 w-full">
                  <Button variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button 
                    color="primary" 
                    onPress={() => {
                      onClose()
                      handleTrackClick()
                    }}
                    startContent={<Gift className="w-4 h-4" />}
                  >
                    Claim Deal
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default DealCard