import React, { useState, useCallback, useMemo } from 'react'
import { 
  Search, 
  Gift, 
  TrendingUp, 
  Shield, 
  Users, 
  BarChart3, 
  Star, 
  Zap, 
  Globe, 
  ExternalLink, 
  RefreshCw, 
  AlertCircle,
  Database,
  ArrowRight
} from 'lucide-react'
import { useAuth } from '../lib/authContext'
import { useFeaturedDealsQuery, useTopCompaniesQuery } from '../hooks/queries/useFeaturedDealsQuery'
import { useCategoriesQuery } from '../hooks/queries/useCategoriesQuery'
import { useUpdateDealClickMutation } from '../hooks/queries/useDealsQuery'

// ✅ STRATEGIC: Category icon mapping for dynamic rendering
const CATEGORY_ICONS = {
  'crypto_exchange': '🪙',
  'stock_broker': '📈',
  'forex_broker': '💱',
  'multi_asset': '🏦',
  'prop_firm': '💼',
  'trading_tool': '🔧'
} as const

// ✅ STRATEGIC: Deal type styling
const DEAL_TYPE_STYLES = {
  bonus: 'from-green-400/20 to-green-600/20 border-green-400/30 text-green-600',
  discount: 'from-blue-400/20 to-blue-600/20 border-blue-400/30 text-blue-600',
  free_trial: 'from-purple-400/20 to-purple-600/20 border-purple-400/30 text-purple-600',
  cashback: 'from-amber-400/20 to-amber-600/20 border-amber-400/30 text-amber-600',
  promotion: 'from-pink-400/20 to-pink-600/20 border-pink-400/30 text-pink-600'
}

const Features = () => {
  const { user } = useAuth()
  
  // ✅ DYNAMIC: All data from React Query (same pattern as Deals page)
  const featuredDealsQuery = useFeaturedDealsQuery(6)
  const topCompaniesQuery = useTopCompaniesQuery(12)
  const categoriesQuery = useCategoriesQuery()
  
  // ✅ ROBUST: Mutations for tracking
  const updateDealClickMutation = useUpdateDealClickMutation()
  
  // ✅ UI State
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // ✅ COMPUTED: Filter deals by category
  const filteredDeals = useMemo(() => {
    if (!featuredDealsQuery.data?.deals) return []
    
    if (selectedCategory === 'all') {
      return featuredDealsQuery.data.deals
    }
    
    return featuredDealsQuery.data.deals.filter(
      deal => deal.company.category === selectedCategory
    )
  }, [featuredDealsQuery.data?.deals, selectedCategory])

  // ✅ STATIC: Platform features (about the platform itself - unchanged)
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
      description: 'Track your savings and compare platform performance over time.',
      image: 'https://images.pexels.com/photos/355948/pexels-photo-355948.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ]

  // ✅ EVENT HANDLERS: Integrated tracking (same as Deals page)
  const handleAffiliateClick = useCallback(async (dealId: string, companyName: string, affiliateUrl: string) => {
    console.log(`🔗 Affiliate click: ${companyName}`)
    
    try {
      // Track the click in database
      await updateDealClickMutation.mutateAsync(dealId)
      
      // Open affiliate link
      window.open(affiliateUrl, '_blank', 'noopener,noreferrer')
    } catch (error) {
      console.error('❌ Error tracking affiliate click:', error)
      // Still open the link even if tracking fails
      window.open(affiliateUrl, '_blank', 'noopener,noreferrer')
    }
  }, [updateDealClickMutation])

  const handleRetry = useCallback(() => {
    featuredDealsQuery.refetch()
    topCompaniesQuery.refetch()
    categoriesQuery.refetch()
  }, [featuredDealsQuery, topCompaniesQuery, categoriesQuery])

  // ✅ ROBUST: Error handling (same pattern as Deals page)
  if (categoriesQuery.error) {
    return (
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <Database className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-text mb-2">Categories Not Available</h2>
              <p className="text-textSecondary mb-6">
                Unable to load trading categories. Please try again.
              </p>
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
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
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // ✅ LOADING STATE
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

  // ✅ MAIN CONTENT
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

        {/* ✅ DYNAMIC: Featured Platforms Section */}
        {featuredDealsQuery.data?.deals && featuredDealsQuery.data.deals.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-text">
                Featured Trading Platforms
              </h3>
              <button
                onClick={() => window.location.href = '/deals'}
                className="inline-flex items-center text-primary hover:text-primaryHover transition-colors"
              >
                View All Deals
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            {/* ✅ DYNAMIC: Category filters */}
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
                  .slice(0, 5) // Show top 5 categories
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

            {/* ✅ DYNAMIC: Deal cards */}
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
                          />
                        ) : (
                          <span>{CATEGORY_ICONS[deal.company.category as keyof typeof CATEGORY_ICONS] || '🏢'}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-text">{deal.company.name}</h4>
                        <span className="text-xs text-textSecondary bg-primary/10 px-2 py-1 rounded-full">
                          {categoriesQuery.data?.find(cat => cat.value === deal.company.category)?.label || deal.company.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-primary">{deal.company.total_reviews} reviews</div>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-warning fill-current mr-1" />
                        <span className="text-xs text-textSecondary">{deal.company.overall_rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-textSecondary text-sm mb-4 line-clamp-2">{deal.description}</p>

                  {/* ✅ DYNAMIC: Deal badge */}
                  <div className="mb-4">
                    <span className={`inline-flex items-center px-3 py-1 bg-gradient-to-r border rounded-full text-xs font-medium ${
                      DEAL_TYPE_STYLES[deal.deal_type] || DEAL_TYPE_STYLES.bonus
                    }`}>
                      <Gift className="w-3 h-3 mr-1" />
                      {deal.value || deal.title}
                    </span>
                  </div>

                  {/* ✅ DYNAMIC: CTA Button with tracking */}
                  <button 
                    onClick={() => handleAffiliateClick(deal.id, deal.company.name, deal.affiliate_link)}
                    disabled={updateDealClickMutation.isPending}
                    className="group w-full bg-gradient-to-r from-primary to-secondary px-4 py-3 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                  >
                    {updateDealClickMutation.isPending ? (
                      <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <>
                        Get Deal Now
                        <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* ✅ EMPTY STATE: No deals in selected category */}
            {filteredDeals.length === 0 && featuredDealsQuery.data?.deals && featuredDealsQuery.data.deals.length > 0 && (
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

        {/* ✅ STATIC: Platform Features Section (unchanged from original) */}
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

        {/* ✅ DYNAMIC: CTA Section with stats */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20">
            <h3 className="text-2xl font-bold text-text mb-4">
              Ready to Start Trading with Bonuses?
            </h3>
            <p className="text-textSecondary mb-6 max-w-2xl mx-auto">
              Join thousands of traders who are saving money through our exclusive deals and bonuses.
              {featuredDealsQuery.data?.companies && (
                <span className="block mt-2 text-sm">
                  {featuredDealsQuery.data.companies.length} verified platforms • 
                  {featuredDealsQuery.data.deals.length} active deals • Updated daily
                </span>
              )}
            </p>
            <button 
              onClick={() => window.location.href = '/deals'}
              className="bg-gradient-to-r from-primary to-secondary px-8 py-3 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
            >
              View All Deals
            </button>
          </div>
        </div>

        {/* ✅ EMPTY STATE: No deals at all */}
        {featuredDealsQuery.data?.deals && featuredDealsQuery.data.deals.length === 0 && (
          <div className="text-center py-12">
            <Gift className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-text mb-2">No Featured Deals Available</h3>
            <p className="text-textSecondary mb-6">
              Featured deals will appear here once they're added to the database.
            </p>
            <button
              onClick={handleRetry}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primaryHover transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2 inline" />
              Check Again
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default Features