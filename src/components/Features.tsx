import React, { useState, useMemo } from 'react'
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

const DEAL_TYPE_STYLES = {
  bonus: 'from-green-400/20 to-green-600/20 border-green-400/30 text-green-600',
  discount: 'from-blue-400/20 to-blue-600/20 border-blue-400/30 text-blue-600',
  free_trial: 'from-purple-400/20 to-purple-600/20 border-purple-400/30 text-purple-600',
  cashback: 'from-amber-400/20 to-amber-600/20 border-amber-400/30 text-amber-600',
  promotion: 'from-pink-400/20 to-pink-600/20 border-pink-400/30 text-pink-600'
}

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

  // Calculate dynamic statistics from actual data
  const stats = useMemo(() => {
    const data = featuredDealsQuery.data
    if (!data) return { companies: 0, deals: 0, categories: 0, totalReviews: 0, avgRating: 0 }

    // Get ALL companies and deals from the full dataset
    const allCompanies = data.companies || []
    const allDeals = data.deals || []
    
    // Filter active companies (status = 'active')
    const activeCompanies = allCompanies.filter(company => company.status === 'active')
    
    // Filter active deals (is_active = true)  
    const activeDeals = allDeals.filter(deal => deal.is_active === true)
    
    // Get total categories from categoriesQuery (all available categories)
    const totalCategories = categoriesQuery.data ? categoriesQuery.data.length : 0
    
    // Calculate total reviews from trading_companies.total_reviews field
    const totalReviews = activeCompanies.reduce((sum, company) => sum + (company.total_reviews || 0), 0)
    
    // Calculate average rating from companies that have ratings > 0
    const companiesWithRatings = activeCompanies.filter(company => 
      company.overall_rating > 0 && company.total_reviews > 0
    )
    const avgRating = companiesWithRatings.length > 0 
      ? companiesWithRatings.reduce((sum, company) => sum + (company.overall_rating || 0), 0) / companiesWithRatings.length
      : 0

    return {
      companies: activeCompanies.length, // Dynamic: actual count of active companies
      deals: activeDeals.length, // Dynamic: actual count of active deals
      categories: totalCategories, // Dynamic: from categories table
      totalReviews, // Dynamic: sum of all company reviews
      avgRating: Math.round(avgRating * 10) / 10 // Dynamic: calculated average
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

  // Error states
  if (categoriesQuery.error) {
    return (
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <Database className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-text mb-2">Categories Not Available</h2>
              <p className="text-textSecondary mb-6">
                Unable to load trading categories. Please try again later.
              </p>
            </div>
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
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-text mb-2">Unable to Load Featured Deals</h2>
              <p className="text-textSecondary mb-6">
                {featuredDealsQuery.error instanceof Error 
                  ? featuredDealsQuery.error.message 
                  : 'Failed to load featured deals'
                }
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Loading state
  const isLoading = featuredDealsQuery.isLoading || categoriesQuery.isLoading

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-text mb-6">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Loading Featured
              </span>
              <br />
              Trading Deals
            </h2>
          </div>
          
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-textSecondary">Loading exclusive deals and top platforms...</p>
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
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-text mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Your Gateway to
            </span>
            <br />
            Financial Success
          </h2>
          <p className="text-xl text-textSecondary max-w-3xl mx-auto">
            Discover exclusive deals, compare platforms, and maximize your trading potential with our 
            comprehensive affiliate network and expert insights.
          </p>
        </div>

        {/* Featured Deals Section */}
        {featuredDealsQuery.data?.featuredDeals && featuredDealsQuery.data.featuredDeals.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-text">
                Featured Trading Platforms
              </h3>
              <a
                href="/deals"
                className="inline-flex items-center text-primary hover:text-primaryHover transition-colors"
              >
                View All Deals
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>

            {/* Category filters */}
            {categoriesQuery.data && categoriesQuery.data.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-primary text-white'
                      : 'bg-surface/50 text-textSecondary hover:bg-surface hover:text-text border border-border'
                  }`}
                >
                  All Categories
                </button>
                {categoriesQuery.data
                  .filter(cat => cat.value !== 'all')
                  .slice(0, 5)
                  .map((category) => (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === category.value
                          ? 'bg-primary text-white'
                          : 'bg-surface/50 text-textSecondary hover:bg-surface hover:text-text border border-border'
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
              </div>
            )}

            {/* Deal cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDeals.slice(0, 6).map((deal) => (
                <div 
                  key={deal.id}
                  className="group bg-surface/50 backdrop-blur-lg rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {deal.company.logo_url ? (
                          <img 
                            src={deal.company.logo_url} 
                            alt={deal.company.name}
                            className="w-8 h-8 rounded-lg object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.setAttribute('style', 'display: inline');
                            }}
                          />
                        ) : null}
                        <span className={deal.company.logo_url ? 'hidden' : ''}>
                          {CATEGORY_ICONS[deal.company.category as keyof typeof CATEGORY_ICONS] || '🏢'}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-text">{deal.company.name}</h4>
                        <span className="text-xs text-textSecondary bg-primary/10 px-2 py-1 rounded-full">
                          {categoriesQuery.data?.find(cat => cat.value === deal.company.category)?.label || deal.company.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-warning fill-current mr-1" />
                        <span className="text-xs text-textSecondary">
                          {(deal.company.overall_rating || 0).toFixed(1)}
                        </span>
                      </div>
                      <div className="text-xs text-textSecondary">
                        {deal.company.total_reviews || 0} reviews
                      </div>
                    </div>
                  </div>

                  <p className="text-textSecondary text-sm mb-4 line-clamp-2">{deal.description}</p>

                  <div className="mb-4">
                    <span className={`inline-flex items-center px-3 py-1 bg-gradient-to-r border rounded-full text-xs font-medium ${
                      DEAL_TYPE_STYLES[deal.deal_type] || DEAL_TYPE_STYLES.bonus
                    }`}>
                      <Gift className="w-3 h-3 mr-1" />
                      {deal.value || deal.title}
                    </span>
                  </div>

                  <a 
                    href={deal.affiliate_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full bg-gradient-to-r from-primary to-secondary px-4 py-3 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center text-center no-underline"
                  >
                    Get Deal Now
                    <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              ))}
            </div>

            {/* Empty state for filtered category */}
            {filteredDeals.length === 0 && featuredDealsQuery.data?.featuredDeals && featuredDealsQuery.data.featuredDeals.length > 0 && (
              <div className="text-center py-12">
                <Gift className="w-12 h-12 mx-auto mb-4 text-textSecondary" />
                <h3 className="text-lg font-medium text-text mb-2">No deals in this category</h3>
                <p className="text-textSecondary mb-4">Try selecting a different category or view all deals.</p>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="text-primary hover:text-primaryHover transition-colors"
                >
                  Show All Deals
                </button>
              </div>
            )}
          </div>
        )}

        {/* Platform Features Section */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-text mb-4">
            Why Choose Our Platform
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-surface/50 backdrop-blur-lg rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-text mb-3">{feature.title}</h3>
              <p className="text-textSecondary leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Enhanced CTA Section with Accurate Data */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20">
            <div className="mb-6">
              <h3 className="text-3xl font-bold text-text mb-4">
                Start Trading with Exclusive Bonuses Today
              </h3>
              <p className="text-lg text-textSecondary mb-6 max-w-2xl mx-auto">
                Access handpicked trading platforms with member-exclusive deals across crypto, prop trading, and multi-asset markets.
              </p>
            </div>

            {/* Dynamic Statistics Grid - Based on Actual Schema */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-center mb-2">
                  <Shield className="w-5 h-5 text-primary mr-2" />
                  <span className="text-2xl font-bold text-text">{stats.companies}</span>
                </div>
                <p className="text-sm text-textSecondary">Trading Platforms</p>
              </div>
              
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-center mb-2">
                  <Gift className="w-5 h-5 text-secondary mr-2" />
                  <span className="text-2xl font-bold text-text">{stats.deals}</span>
                </div>
                <p className="text-sm text-textSecondary">Exclusive Deals</p>
              </div>
              
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-center mb-2">
                  <BarChart3 className="w-5 h-5 text-primary mr-2" />
                  <span className="text-2xl font-bold text-text">{stats.categories}</span>
                </div>
                <p className="text-sm text-textSecondary">Market Categories</p>
              </div>
              
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 text-secondary mr-2" />
                  <span className="text-2xl font-bold text-text">{stats.totalReviews}</span>
                </div>
                <p className="text-sm text-textSecondary">User Reviews</p>
              </div>
            </div>

            {/* Value Propositions */}
            <div className="grid md:grid-cols-3 gap-4 mb-8 text-left">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-textSecondary">Member-exclusive bonus offers</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-textSecondary">Detailed platform reviews</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-textSecondary">Regulated broker partnerships</span>
              </div>
            </div>

            {/* Dynamic Platform Categories Preview */}
            {categoriesQuery.data && categoriesQuery.data.length > 0 && (
              <div className="mb-8">
                <div className="flex flex-wrap justify-center gap-3">
                  {categoriesQuery.data
                    .filter(cat => cat.value !== 'all') // Exclude 'all' if it exists
                    .map((category) => {
                      // Map category values to display info
                      const categoryDisplay = {
                        'crypto_exchange': { emoji: '🪙', label: 'Crypto Exchanges', color: 'bg-blue-100 text-blue-800' },
                        'prop_firm': { emoji: '💼', label: 'Prop Trading Firms', color: 'bg-purple-100 text-purple-800' },
                        'multi_asset': { emoji: '🏦', label: 'Multi-Asset Brokers', color: 'bg-green-100 text-green-800' },
                        'trading_tool': { emoji: '🔧', label: 'Trading Tools', color: 'bg-orange-100 text-orange-800' },
                        'stock_broker': { emoji: '📈', label: 'Stock Brokers', color: 'bg-red-100 text-red-800' },
                        'forex_broker': { emoji: '💱', label: 'Forex Brokers', color: 'bg-yellow-100 text-yellow-800' }
                      }
                      
                      const display = categoryDisplay[category.value as keyof typeof categoryDisplay] || {
                        emoji: '🏢',
                        label: category.label || category.value.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                        color: 'bg-gray-100 text-gray-800'
                      }
                      
                      return (
                        <span 
                          key={category.value}
                          className={`${display.color} px-3 py-1 rounded-full text-sm font-medium`}
                        >
                          {display.emoji} {display.label}
                        </span>
                      )
                    })}
                </div>
              </div>
            )}

            {/* Last Updated Info */}
            {featuredDealsQuery.data?.featuredDeals && featuredDealsQuery.data.featuredDeals.length > 0 && (
              <div className="flex items-center justify-center space-x-2 mb-6 text-sm text-textSecondary">
                <Clock className="w-4 h-4" />
                <span>
                  Deals updated: {new Date(Math.max(...featuredDealsQuery.data.featuredDeals.map(deal => new Date(deal.updated_at).getTime()))).toLocaleDateString()}
                </span>
              </div>
            )}

            {/* CTA Button */}
            <a 
              href="/deals"
              className="inline-flex items-center bg-gradient-to-r from-primary to-secondary px-8 py-4 rounded-full text-white font-semibold text-lg hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 no-underline group"
            >
              Browse All {stats.deals} Deals
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Trust Indicators */}
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-sm text-textSecondary">
                {stats.companies} verified platforms • {stats.deals} active offers • Updated daily
                {stats.avgRating > 0 && (
                  <span className="inline-flex items-center ml-2">
                    • <Star className="w-3 h-3 text-warning fill-current mx-1" />
                    {stats.avgRating.toFixed(1)} platform rating
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Empty state for no deals */}
        {featuredDealsQuery.data?.featuredDeals && featuredDealsQuery.data.featuredDeals.length === 0 && (
          <div className="text-center py-12">
            <Gift className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-text mb-2">No Featured Deals Available</h3>
            <p className="text-textSecondary mb-6">
              Featured deals will appear here once they're added to the database.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Features