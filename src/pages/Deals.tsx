import React, { useState, useMemo, useCallback } from 'react'
import { 
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
  Button,
  Chip,
  Spinner,
  Tabs,
  Tab
} from '@heroui/react'
import { Search, AlertCircle, RefreshCw, Gift, Users, Database } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../lib/authContext'
import { DealCard } from '../components/deals/DealCard'
import { RatingModal } from '../components/rating/RatingModal'
import { AuthModal } from '../components/auth/AuthModals'
import { 
  useDealsQuery, 
  useUserRatingsQuery, 
  useUpdateDealClickMutation,
  useSubmitRatingMutation 
} from '../hooks/queries/useDealsQuery'
import { 
  useCategoriesQuery, 
  useCategoryStatsQuery, 
  useCategoryInfoQuery 
} from '../hooks/queries/useCategoriesQuery'

interface Filters {
  searchTerm: string
  category: string
  sortBy: string
}

const Deals: React.FC = () => {
  const { user, isFullyReady } = useAuth()
  const isInDashboard = !!user
  
  const containerClasses = isInDashboard 
    ? "min-h-screen bg-background"
    : "min-h-screen bg-background pt-20"

  const dealsQuery = useDealsQuery()
  const deals = dealsQuery.data?.deals || []
  const companies = dealsQuery.data?.companies || []
  
  const categoriesQuery = useCategoriesQuery()
  const categories = categoriesQuery.data || []

  const companyIds = useMemo(() => 
    deals.map(deal => deal.company?.id).filter(Boolean) as string[], 
    [deals]
  )
  const userRatingsQuery = useUserRatingsQuery(user?.id, companyIds)

  const categoryStatsQuery = useCategoryStatsQuery(deals)
  const categoryStats = categoryStatsQuery.data || new Map()
  
  const categoryInfoQuery = useCategoryInfoQuery(companies)
  const categoryInfo = categoryInfoQuery.data || new Map()

  const updateDealClickMutation = useUpdateDealClickMutation()
  const submitRatingMutation = useSubmitRatingMutation()

  const [filters, setFilters] = useState<Filters>({
    searchTerm: '',
    category: 'all',
    sortBy: 'rating'
  })
  const [selectedDeal, setSelectedDeal] = useState<any>(null)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  const dealsWithUserRatings = useMemo(() => {
    const userRatings = userRatingsQuery.data || new Map()
    
    return deals.map(deal => ({
      ...deal,
      userRating: deal.company?.id ? userRatings.get(deal.company.id) : undefined
    }))
  }, [deals, userRatingsQuery.data])

  const filteredDeals = useMemo(() => {
    let filtered = dealsWithUserRatings

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(deal =>
        deal.company_name.toLowerCase().includes(searchLower) ||
        deal.title.toLowerCase().includes(searchLower) ||
        deal.description.toLowerCase().includes(searchLower)
      )
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(deal => 
        deal.company?.category === filters.category
      )
    }

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'rating':
          return (b.company?.overall_rating || 0) - (a.company?.overall_rating || 0)
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'popular':
          return (b.click_count || 0) - (a.click_count || 0)
        case 'name':
          return a.company_name.localeCompare(b.company_name)
        default:
          return 0
      }
    })

    return filtered
  }, [dealsWithUserRatings, filters])

  const selectedCategoryInfo = useMemo(() => {
    if (filters.category === 'all') return null
    
    const category = categories.find(cat => cat.value === filters.category)
    const info = categoryInfo.get(filters.category)
    
    return {
      title: category?.label || 'Category Deals',
      description: category?.description || 'Exclusive deals in this category',
      companies: info?.companies || [],
      count: info?.count || 0
    }
  }, [filters.category, categories, categoryInfo])

  const handleFilterChange = useCallback((key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const handleRateClick = useCallback((deal: any) => {
    if (!user) {
      setAuthMode('login')
      setShowAuthModal(true)
      return
    }

    if (!deal.company) return

    setSelectedDeal(deal)
    setShowRatingModal(true)
  }, [user])

  const handleTrackClick = useCallback(async (deal: any) => {
    try {
      await updateDealClickMutation.mutateAsync(deal.id)
      window.open(deal.affiliate_link, '_blank', 'noopener,noreferrer')
    } catch (error) {
      console.error('Error tracking deal click:', error)
      window.open(deal.affiliate_link, '_blank', 'noopener,noreferrer')
    }
  }, [updateDealClickMutation])

  const handleRatingSubmitted = useCallback(() => {
    setShowRatingModal(false)
    setSelectedDeal(null)
  }, [])

  const handleRetry = useCallback(() => {
    dealsQuery.refetch()
    categoriesQuery.refetch()
  }, [dealsQuery, categoriesQuery])

  // Error states
  if (categoriesQuery.error) {
    return (
      <div className={containerClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-96">
            <Card className="max-w-md">
              <CardBody className="text-center">
                <Database className="w-12 h-12 text-danger mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Categories Not Available</h2>
                <p className="text-default-600 mb-6">
                  Categories table not found. Please run the SQL script to create the categories table.
                </p>
                <Button
                  color="danger"
                  startContent={<RefreshCw className="w-4 h-4" />}
                  onPress={handleRetry}
                >
                  Retry Connection
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  const isLoading = !isFullyReady || dealsQuery.isLoading || categoriesQuery.isLoading

  if (isLoading) {
    return (
      <div className={containerClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Trading Deals & Bonuses</h1>
            <p className="text-xl text-default-600">Loading exclusive offers with real-time ratings...</p>
          </div>
          
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <Spinner size="lg" color="primary" className="mb-4" />
              <p className="text-default-600">Loading deals, categories, and community ratings...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (dealsQuery.error) {
    return (
      <div className={containerClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-96">
            <Card className="max-w-md">
              <CardBody className="text-center">
                <AlertCircle className="w-12 h-12 text-danger mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Unable to Load Deals</h2>
                <p className="text-default-600 mb-6">
                  {dealsQuery.error instanceof Error ? dealsQuery.error.message : 'Failed to load deals'}
                </p>
                <Button
                  color="primary"
                  startContent={<RefreshCw className="w-4 h-4" />}
                  onPress={handleRetry}
                >
                  Try Again
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!categories.length) {
    return (
      <div className={containerClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-96">
            <Card className="max-w-md">
              <CardBody className="text-center">
                <Database className="w-12 h-12 text-default-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No Categories Found</h2>
                <p className="text-default-600 mb-6">
                  The categories table exists but contains no data. Please add categories to the database.
                </p>
                <Button
                  color="primary"
                  startContent={<RefreshCw className="w-4 h-4" />}
                  onPress={handleRetry}
                >
                  Reload Categories
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={containerClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold mb-4">
            Trading Deals & Exclusive Bonuses
          </h1>
          <p className="text-xl text-default-600 mb-2">
            Curated offers from top platforms across {categories.length - 1} categories
          </p>
          <p className="text-default-600">
            {companies.length} vetted platforms • Real community ratings • Updated daily
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="mb-8">
            <CardBody className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Input
                  placeholder="Search deals, companies..."
                  value={filters.searchTerm}
                  onValueChange={(value) => handleFilterChange('searchTerm', value)}
                  startContent={<Search className="w-4 h-4 text-default-400" />}
                  variant="bordered"
                />

                <Select
                  placeholder="Select category"
                  selectedKeys={[filters.category]}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string
                    handleFilterChange('category', selectedKey)
                  }}
                  variant="bordered"
                >
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label} {category.value !== 'all' && `(${categoryStats.get(category.value) || 0})`}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  placeholder="Sort by"
                  selectedKeys={[filters.sortBy]}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string
                    handleFilterChange('sortBy', selectedKey)
                  }}
                  variant="bordered"
                >
                  <SelectItem key="rating" value="rating">Highest Rated</SelectItem>
                  <SelectItem key="newest" value="newest">Newest First</SelectItem>
                  <SelectItem key="popular" value="popular">Most Claimed</SelectItem>
                  <SelectItem key="name" value="name">Company A-Z</SelectItem>
                </Select>
              </div>

              {/* Category Quick Filters */}
              <Tabs 
                selectedKey={filters.category}
                onSelectionChange={(key) => handleFilterChange('category', key as string)}
                variant="underlined"
                color="primary"
                className="w-full"
              >
                {categories.map((category) => {
                  const count = categoryStats.get(category.value) || 0
                  return (
                    <Tab 
                      key={category.value} 
                      title={
                        <div className="flex items-center gap-2">
                          <category.icon className="w-4 h-4" />
                          {category.label}
                          {category.value !== 'all' && (
                            <Chip size="sm" variant="flat" color="primary">
                              {count}
                            </Chip>
                          )}
                        </div>
                      }
                    />
                  )
                })}
              </Tabs>
            </CardBody>
          </Card>
        </motion.div>

        {/* Category Description */}
        {selectedCategoryInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mb-8 bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
              <CardBody className="p-6">
                <h3 className="text-lg font-semibold mb-2">
                  {selectedCategoryInfo.title}
                </h3>
                <p className="text-default-600 mb-3">
                  {selectedCategoryInfo.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedCategoryInfo.companies.slice(0, 8).map((company) => (
                    <Chip key={company} color="primary" variant="flat" size="sm">
                      {company}
                    </Chip>
                  ))}
                  {selectedCategoryInfo.companies.length > 8 && (
                    <Chip color="default" variant="flat" size="sm">
                      +{selectedCategoryInfo.companies.length - 8} more
                    </Chip>
                  )}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}

        {/* No Results */}
        {filteredDeals.length === 0 && deals.length > 0 && (
          <Card>
            <CardBody className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No deals found</h3>
              <p className="text-default-600 mb-6">Try adjusting your search or filter criteria</p>
              <Button
                color="primary"
                onPress={() => setFilters({ searchTerm: '', category: 'all', sortBy: 'rating' })}
              >
                Clear Filters
              </Button>
            </CardBody>
          </Card>
        )}

        {/* Deal Cards */}
        {filteredDeals.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredDeals.map((deal, index) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <DealCard
                    deal={deal}
                    onRateClick={handleRateClick}
                    onTrackClick={handleTrackClick}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
            <CardBody className="p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Users className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">Curated Trading Platforms</h3>
              </div>
              <p className="text-default-600 max-w-2xl mx-auto mb-6">
                {companies.length} handpicked platforms across {categories.filter(cat => cat.value !== 'all' && (categoryStats.get(cat.value) || 0) > 0).length} categories. 
                Every company is verified, regulated, and trusted by our trading community.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 text-small text-default-600">
                {categories
                  .filter(cat => cat.value !== 'all')
                  .filter(cat => (categoryStats.get(cat.value) || 0) > 0)
                  .slice(0, 3)
                  .map((category) => {
                    const count = categoryStats.get(category.value) || 0
                    return (
                      <Chip key={category.value} color="success" variant="flat" size="sm">
                        {count} {category.label}
                      </Chip>
                    )
                  })}
                <Chip color="success" variant="flat" size="sm">
                  Real Reviews
                </Chip>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Empty Deals State */}
        {deals.length === 0 && !dealsQuery.isLoading && (
          <Card>
            <CardBody className="text-center py-12">
              <Gift className="w-16 h-16 mx-auto mb-4 text-default-400" />
              <h3 className="text-xl font-semibold mb-2">No Deals Available</h3>
              <p className="text-default-600 mb-6">
                No trading deals found. Please check back later or contact support.
              </p>
              <Button
                color="primary"
                startContent={<RefreshCw className="w-4 h-4" />}
                onPress={handleRetry}
              >
                Reload Deals
              </Button>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Modals */}
      {showRatingModal && selectedDeal && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => {
            setShowRatingModal(false)
            setSelectedDeal(null)
          }}
          companyId={selectedDeal.company.id}
          companyName={selectedDeal.company.name}
          existingRating={selectedDeal.userRating}
          onRatingSubmitted={handleRatingSubmitted}
          companyRating={{
            averageRating: selectedDeal.company?.overall_rating || 0,
            totalRatings: selectedDeal.company?.total_reviews || 0
          }}
        />
      )}

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode={authMode}
          onModeChange={setAuthMode}
        />
      )}
    </div>
  )
}

export default Deals