import React, { useState, useMemo } from 'react'
import { 
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Image,
  Tabs,
  Tab,
  Spinner,
  Link
} from '@heroui/react'
import { 
  Search, 
  Gift, 
  TrendingUp, 
  Shield, 
  Users, 
  BarChart3, 
  Star, 
  ExternalLink, 
  RefreshCw, 
  AlertCircle,
  Database,
  ArrowRight,
  CheckCircle,
  Clock
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useFeaturedDealsQuery } from '../hooks/queries/useFeaturedDealsQuery'
import { useCategoriesQuery } from '../hooks/queries/useCategoriesQuery'

const CATEGORY_ICONS = {
  'crypto_exchange': '🪙',
  'stock_broker': '📈',
  'forex_broker': '💱',
  'multi_asset': '🏦',
  'prop_firm': '💼',
  'trading_tool': '🔧'
} as const

const Features = () => {
  const featuredDealsQuery = useFeaturedDealsQuery(6)
  const categoriesQuery = useCategoriesQuery()
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredDeals = useMemo(() => {
    if (!featuredDealsQuery.data?.featuredDeals) return []
    
    if (selectedCategory === 'all') {
      return featuredDealsQuery.data.featuredDeals
    }
    
    return featuredDealsQuery.data.featuredDeals.filter(
      deal => deal.company.category === selectedCategory
    )
  }, [featuredDealsQuery.data?.featuredDeals, selectedCategory])

  const stats = useMemo(() => {
    const data = featuredDealsQuery.data
    if (!data) return { companies: 0, deals: 0, categories: 0, totalReviews: 0, avgRating: 0 }

    const allCompanies = data.companies || []
    const allDeals = data.deals || []
    
    const activeCompanies = allCompanies.filter(company => company.status === 'active')
    const activeDeals = allDeals.filter(deal => deal.is_active === true)
    const totalCategories = categoriesQuery.data ? categoriesQuery.data.length : 0
    const totalReviews = activeCompanies.reduce((sum, company) => sum + (company.total_reviews || 0), 0)
    
    const companiesWithRatings = activeCompanies.filter(company => 
      company.overall_rating > 0 && company.total_reviews > 0
    )
    const avgRating = companiesWithRatings.length > 0 
      ? companiesWithRatings.reduce((sum, company) => sum + (company.overall_rating || 0), 0) / companiesWithRatings.length
      : 0

    return {
      companies: activeCompanies.length,
      deals: activeDeals.length,
      categories: totalCategories,
      totalReviews,
      avgRating: Math.round(avgRating * 10) / 10
    }
  }, [featuredDealsQuery.data, categoriesQuery.data])

  const features = [
    {
      icon: Search,
      title: 'Compare Platforms',
      description: 'Find the perfect trading platform for your needs with our comprehensive comparison tools.',
      image: 'https://images.pexels.com/photos/590041/pexels-photo-590041.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Gift,
      title: 'Exclusive Bonuses',
      description: 'Access member-only deals and bonuses not available anywhere else.',
      image: 'https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: TrendingUp,
      title: 'Market Analysis',
      description: 'Expert reviews and analysis to help you make informed trading decisions.',
      image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Shield,
      title: 'Verified Partners',
      description: 'All platforms are regulated and verified for security and reliability.',
      image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Users,
      title: 'Community Reviews',
      description: 'Real user reviews and ratings help you choose the right platform.',
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: BarChart3,
      title: 'Performance Tracking',
      description: 'Track the average rating for each company & deal.',
      image: 'https://images.pexels.com/photos/355948/pexels-photo-355948.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ]

  if (categoriesQuery.error) {
    return (
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-96">
            <Card className="max-w-md">
              <CardBody className="text-center">
                <Database className="w-12 h-12 text-danger mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Categories Not Available</h2>
                <p className="text-default-600 mb-6">
                  Unable to load trading categories. Please try again later.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>
    )
  }

  if (featuredDealsQuery.error) {
    return (
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-96">
            <Card className="max-w-md">
              <CardBody className="text-center">
                <AlertCircle className="w-12 h-12 text-danger mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Unable to Load Featured Deals</h2>
                <p className="text-default-600 mb-6">
                  {featuredDealsQuery.error instanceof Error 
                    ? featuredDealsQuery.error.message 
                    : 'Failed to load featured deals'
                  }
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>
    )
  }

  const isLoading = featuredDealsQuery.isLoading || categoriesQuery.isLoading

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="gradient-text">
                Loading Featured
              </span>
              <br />
              Trading Deals
            </h2>
          </div>
          
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <Spinner size="lg" color="primary" className="mb-4" />
              <p className="text-default-600">Loading exclusive deals and top platforms...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="features" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="gradient-text">
              Your Gateway to
            </span>
            <br />
            Financial Success
          </h2>
          <p className="text-xl text-default-600 max-w-3xl mx-auto">
            Discover exclusive deals, compare platforms, and maximize your trading potential with our 
            comprehensive affiliate network and expert insights.
          </p>
        </motion.div>

        {/* Featured Deals Section */}
        {featuredDealsQuery.data?.featuredDeals && featuredDealsQuery.data.featuredDeals.length > 0 && (
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold">
                Featured Trading Platforms
              </h3>
              <Button
                as={Link}
                href="/deals"
                variant="light"
                color="primary"
                endContent={<ArrowRight className="w-4 h-4" />}
              >
                View All Deals
              </Button>
            </div>

            {/* Category filters */}
            {categoriesQuery.data && categoriesQuery.data.length > 1 && (
              <div className="mb-6">
                <Tabs 
                  selectedKey={selectedCategory}
                  onSelectionChange={(key) => setSelectedCategory(key as string)}
                  variant="underlined"
                  color="primary"
                  className="w-full"
                >
                  <Tab key="all" title="All Categories" />
                  {categoriesQuery.data
                    .filter(cat => cat.value !== 'all')
                    .slice(0, 5)
                    .map((category) => (
                      <Tab key={category.value} title={category.label} />
                    ))}
                </Tabs>
              </div>
            )}

            {/* Deal cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDeals.slice(0, 6).map((deal, index) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full card-hover">
                    <CardHeader className="flex gap-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {deal.company.logo_url ? (
                            <Image 
                              src={deal.company.logo_url} 
                              alt={deal.company.name}
                              className="w-8 h-8 rounded-lg object-cover"
                              fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iOCIgZmlsbD0iIzAwNkZFRSIvPgo8cGF0aCBkPSJNMTYgOEwxNiAyNCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHA="
                            />
                          ) : (
                            <span>
                              {CATEGORY_ICONS[deal.company.category as keyof typeof CATEGORY_ICONS] || '🏢'}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <p className="text-md font-semibold">{deal.company.name}</p>
                          <Chip size="sm" variant="flat" color="primary">
                            {categoriesQuery.data?.find(cat => cat.value === deal.company.category)?.label || deal.company.category}
                          </Chip>
                        </div>
                      </div>
                      <div className="ml-auto text-right">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-warning fill-current" />
                          <span className="text-small">
                            {(deal.company.overall_rating || 0).toFixed(1)}
                          </span>
                        </div>
                        <div className="text-tiny text-default-500">
                          {deal.company.total_reviews || 0} reviews
                        </div>
                      </div>
                    </CardHeader>

                    <CardBody className="pt-0">
                      <p className="text-small text-default-600 mb-4 line-clamp-2">
                        {deal.description}
                      </p>

                      <div className="mb-4">
                        <Chip
                          startContent={<Gift className="w-3 h-3" />}
                          color="success"
                          variant="flat"
                          size="sm"
                        >
                          {deal.value || deal.title}
                        </Chip>
                      </div>

                      <Button 
                        as={Link}
                        href={deal.affiliate_link}
                        color="primary"
                        className="w-full"
                        endContent={<ExternalLink className="w-4 h-4" />}
                        isExternal
                      >
                        Get Deal Now
                      </Button>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Empty state for filtered category */}
            {filteredDeals.length === 0 && featuredDealsQuery.data?.featuredDeals && featuredDealsQuery.data.featuredDeals.length > 0 && (
              <Card>
                <CardBody className="text-center py-12">
                  <Gift className="w-12 h-12 mx-auto mb-4 text-default-400" />
                  <h3 className="text-lg font-medium mb-2">No deals in this category</h3>
                  <p className="text-default-600 mb-4">Try selecting a different category or view all deals.</p>
                  <Button
                    color="primary"
                    variant="flat"
                    onPress={() => setSelectedCategory('all')}
                  >
                    Show All Deals
                  </Button>
                </CardBody>
              </Card>
            )}
          </motion.div>
        )}

        {/* Platform Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">
              Why Choose Our Platform
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full card-hover">
                  <CardBody className="p-0">
                    <div className="relative overflow-hidden rounded-t-xl">
                      <Image 
                        src={feature.image} 
                        alt={feature.title}
                        className="w-full h-48 object-cover"
                        classNames={{
                          wrapper: "w-full"
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <Card className="bg-primary">
                          <CardBody className="p-3">
                            <feature.icon className="w-6 h-6 text-primary-foreground" />
                          </CardBody>
                        </Card>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                      <p className="text-default-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced CTA Section with Accurate Data */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
            <CardBody className="p-8">
              <div className="mb-6">
                <h3 className="text-3xl font-bold mb-4">
                  Start Trading with Exclusive Bonuses Today
                </h3>
                <p className="text-lg text-default-600 mb-6 max-w-2xl mx-auto">
                  Access handpicked trading platforms with member-exclusive deals across crypto, prop trading, and multi-asset markets.
                </p>
              </div>

              {/* Dynamic Statistics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <Card className="bg-background/50 backdrop-blur-sm">
                  <CardBody className="text-center p-4">
                    <div className="flex items-center justify-center mb-2">
                      <Shield className="w-5 h-5 text-primary mr-2" />
                      <span className="text-2xl font-bold">{stats.companies}</span>
                    </div>
                    <p className="text-small text-default-600">Trading Platforms</p>
                  </CardBody>
                </Card>
                
                <Card className="bg-background/50 backdrop-blur-sm">
                  <CardBody className="text-center p-4">
                    <div className="flex items-center justify-center mb-2">
                      <Gift className="w-5 h-5 text-secondary mr-2" />
                      <span className="text-2xl font-bold">{stats.deals}</span>
                    </div>
                    <p className="text-small text-default-600">Exclusive Deals</p>
                  </CardBody>
                </Card>
                
                <Card className="bg-background/50 backdrop-blur-sm">
                  <CardBody className="text-center p-4">
                    <div className="flex items-center justify-center mb-2">
                      <BarChart3 className="w-5 h-5 text-primary mr-2" />
                      <span className="text-2xl font-bold">{stats.categories}</span>
                    </div>
                    <p className="text-small text-default-600">Market Categories</p>
                  </CardBody>
                </Card>
                
                <Card className="bg-background/50 backdrop-blur-sm">
                  <CardBody className="text-center p-4">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="w-5 h-5 text-secondary mr-2" />
                      <span className="text-2xl font-bold">{stats.totalReviews}</span>
                    </div>
                    <p className="text-small text-default-600">User Reviews</p>
                  </CardBody>
                </Card>
              </div>

              {/* Value Propositions */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  <span className="text-default-600">Member-exclusive bonus offers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  <span className="text-default-600">Detailed platform reviews</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  <span className="text-default-600">Regulated broker partnerships</span>
                </div>
              </div>

              {/* Dynamic Platform Categories Preview */}
              {categoriesQuery.data && categoriesQuery.data.length > 0 && (
                <div className="mb-8">
                  <div className="flex flex-wrap justify-center gap-3">
                    {categoriesQuery.data
                      .filter(cat => cat.value !== 'all')
                      .map((category) => {
                        const categoryDisplay = {
                          'crypto_exchange': { emoji: '🪙', label: 'Crypto Exchanges', color: 'primary' },
                          'prop_firm': { emoji: '💼', label: 'Prop Trading Firms', color: 'secondary' },
                          'multi_asset': { emoji: '🏦', label: 'Multi-Asset Brokers', color: 'success' },
                          'trading_tool': { emoji: '🔧', label: 'Trading Tools', color: 'warning' },
                          'stock_broker': { emoji: '📈', label: 'Stock Brokers', color: 'danger' },
                          'forex_broker': { emoji: '💱', label: 'Forex Brokers', color: 'default' }
                        }
                        
                        const display = categoryDisplay[category.value as keyof typeof categoryDisplay] || {
                          emoji: '🏢',
                          label: category.label || category.value.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                          color: 'default'
                        }
                        
                        return (
                          <Chip 
                            key={category.value}
                            color={display.color as any}
                            variant="flat"
                            startContent={<span>{display.emoji}</span>}
                          >
                            {display.label}
                          </Chip>
                        )
                      })}
                  </div>
                </div>
              )}

              {/* Last Updated Info */}
              {featuredDealsQuery.data?.featuredDeals && featuredDealsQuery.data.featuredDeals.length > 0 && (
                <div className="flex items-center justify-center space-x-2 mb-6 text-small text-default-500">
                  <Clock className="w-4 h-4" />
                  <span>
                    Deals updated: {new Date(Math.max(...featuredDealsQuery.data.featuredDeals.map(deal => new Date(deal.updated_at).getTime()))).toLocaleDateString()}
                  </span>
                </div>
              )}

              {/* CTA Button */}
              <Button 
                as={Link}
                href="/deals"
                color="primary"
                size="lg"
                endContent={<ArrowRight className="w-5 h-5" />}
                className="font-semibold"
              >
                Browse All {stats.deals} Deals
              </Button>

              {/* Trust Indicators */}
              <div className="mt-6 pt-6 border-t border-divider">
                <p className="text-small text-default-500">
                  {stats.companies} verified platforms • {stats.deals} active offers • Updated daily
                  {stats.avgRating > 0 && (
                    <span className="inline-flex items-center ml-2">
                      • <Star className="w-3 h-3 text-warning fill-current mx-1" />
                      {stats.avgRating.toFixed(1)} platform rating
                    </span>
                  )}
                </p>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Empty state for no deals */}
        {featuredDealsQuery.data?.featuredDeals && featuredDealsQuery.data.featuredDeals.length === 0 && (
          <Card>
            <CardBody className="text-center py-12">
              <Gift className="w-16 h-16 mx-auto mb-4 text-default-400" />
              <h3 className="text-xl font-semibold mb-2">No Featured Deals Available</h3>
              <p className="text-default-600 mb-6">
                Featured deals will appear here once they're added to the database.
              </p>
            </CardBody>
          </Card>
        )}
      </div>
    </section>
  )
}

export default Features