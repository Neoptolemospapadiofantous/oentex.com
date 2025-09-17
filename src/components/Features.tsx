// src/components/Features.tsx - Refactored with Page Structure
import { useState, useMemo } from 'react'
import { Icons } from './icons'
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

  // Calculate dynamic statistics from actual data
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
      icon: Icons.search,
      title: 'Compare Platforms',
      description: 'Find the perfect trading platform for your needs with our comprehensive comparison tools.',
      image: 'https://images.pexels.com/photos/590041/pexels-photo-590041.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Icons.gift,
      title: 'Exclusive Bonuses',
      description: 'Access member-only deals and bonuses not available anywhere else.',
      image: 'https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Icons.arrowTrendingUp,
      title: 'Market Analysis',
      description: 'Expert reviews and analysis to help you make informed trading decisions.',
      image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Icons.shield,
      title: 'Verified Partners',
      description: 'All platforms are regulated and verified for security and reliability.',
      image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Icons.users,
      title: 'Community Reviews',
      description: 'Real user reviews and ratings help you choose the right platform.',
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Icons.chart,
      title: 'Performance Tracking',
      description: 'Track the average rating for each company & deal.',
      image: 'https://images.pexels.com/photos/355948/pexels-photo-355948.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ]

  // Error states
  if (categoriesQuery.error) {
    return (
      <section className="page-section">
        <div className="container-page">
          <div className="flex-col-center min-h-96">
            <Icons.database className="w-12 h-12 text-red-600 mb-4" />
            <h2 className="text-xl font-semibold text-text mb-2">Categories Not Available</h2>
            <p className="text-textSecondary">
              Unable to load trading categories. Please try again later.
            </p>
          </div>
        </div>
      </section>
    )
  }

  if (featuredDealsQuery.error) {
    return (
      <section className="page-section">
        <div className="container-page">
          <div className="flex-col-center min-h-96">
            <Icons.warning className="w-12 h-12 text-red-600 mb-4" />
            <h2 className="text-xl font-semibold text-text mb-2">Unable to Load Featured Deals</h2>
            <p className="text-textSecondary mb-6">
              {featuredDealsQuery.error instanceof Error 
                ? featuredDealsQuery.error.message 
                : 'Failed to load featured deals'
              }
            </p>
          </div>
        </div>
      </section>
    )
  }

  // Loading state
  const isLoading = featuredDealsQuery.isLoading || categoriesQuery.isLoading

  if (isLoading) {
    return (
      <section className="page-section">
        <div className="container-page">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-text mb-6">
              <span className="gradient-text">Loading Featured</span>
              <br />
              Trading Deals
            </h2>
          </div>
          
          <div className="flex-col-center min-h-96">
            <Icons.refresh className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-textSecondary">Loading exclusive deals and top platforms...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="features" className="page-section relative section-transition component-fade-in">
      
      {/* Subtle connection effect from Hero section */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <svg className="absolute inset-0 w-full h-full opacity-10" role="presentation">
          <defs>
            <linearGradient id="featuresConnectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--heroui-primary))" stopOpacity="0.3" />
              <stop offset="50%" stopColor="hsl(var(--heroui-secondary))" stopOpacity="0.2" />
              <stop offset="100%" stopColor="hsl(var(--heroui-primary))" stopOpacity="0.3" />
            </linearGradient>
            <filter id="featuresGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {/* Very subtle receiving connection lines from Hero */}
          <line x1="5%" y1="0%" x2="95%" y2="8%" stroke="url(#featuresConnectionGradient)" strokeWidth="1" opacity="0.4" filter="url(#featuresGlow)" />
          <line x1="10%" y1="0%" x2="90%" y2="12%" stroke="url(#featuresConnectionGradient)" strokeWidth="0.8" opacity="0.3" />
          <line x1="15%" y1="0%" x2="85%" y2="16%" stroke="url(#featuresConnectionGradient)" strokeWidth="0.6" opacity="0.2" />
        </svg>
        
        {/* Very subtle animated connection dots */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
          <div className="w-2 h-2 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full animate-pulse opacity-30"></div>
        </div>
        <div className="absolute top-2 left-1/4 transform -translate-y-0.5">
          <div className="w-1 h-1 bg-primary/20 rounded-full animate-pulse opacity-20" style={{ animationDelay: '0.5s' }}></div>
        </div>
        <div className="absolute top-2 right-1/4 transform -translate-y-0.5">
          <div className="w-1 h-1 bg-secondary/20 rounded-full animate-pulse opacity-20" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>

      <div className="container-page relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in-up section-px-lg section-py-xl">
          <h2 className="text-4xl lg:text-5xl font-bold text-text mb-8">
            <span className="gradient-text">Your Gateway to</span>
            <br />
            Financial Success
          </h2>
          <div className="content-wide">
            <p className="text-xl text-textSecondary leading-relaxed">
              Discover exclusive deals, compare platforms, and maximize your trading potential with our 
              comprehensive affiliate network and expert insights.
            </p>
          </div>
        </div>

        {/* Featured Deals Section */}
        {featuredDealsQuery.data?.featuredDeals && featuredDealsQuery.data.featuredDeals.length > 0 && (
          <div className="mb-12 animate-scale-in section-px-lg section-py-lg">
            {/* Section Header */}
            <div className="flex-between mb-10">
              <div>
                <h3 className="text-3xl font-bold text-text mb-2">
                  Featured Trading Platforms
                </h3>
                <p className="text-textSecondary">
                  Handpicked platforms with exclusive deals and bonuses
                </p>
              </div>
              <a
                href="/deals"
                className="flex-center text-primary hover:text-primaryHover transition-colors group"
              >
                View All Deals
                <Icons.arrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Enhanced Category Filters */}
            {categoriesQuery.data && categoriesQuery.data.length > 1 && (
              <div className="mb-8 container-px-sm container-py-md">
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-text">Filter by Category</h4>
                </div>
                <div className="flex flex-wrap gap-lg">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`container-px-xl container-py-md rounded-xl text-base font-medium transition-all duration-200 ${
                      selectedCategory === 'all'
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25'
                        : 'glass text-textSecondary hover:text-text hover:bg-content1/50 border border-divider/50'
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
                        className={`container-px-xl container-py-md rounded-xl text-base font-medium transition-all duration-200 ${
                          selectedCategory === category.value
                            ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25'
                            : 'glass text-textSecondary hover:text-text hover:bg-content1/50 border border-divider/50'
                        }`}
                      >
                        {category.label}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Enhanced Deal Cards Grid */}
            <div className="w-full max-w-7xl mx-auto container-px-md container-py-lg">
              <div className="grid-deals">
                {filteredDeals.slice(0, 6).map((deal) => (
                <div key={deal.id} className="card-deal group">
                  {/* Card Header */}
                  <div className="flex-between my-lg">
                    <div className="flex-start gap-md">
                      <div className="relative">
                        {deal.company.logo_url ? (
                          <img 
                            src={deal.company.logo_url} 
                            alt={deal.company.name}
                            className="w-12 h-12 rounded-xl object-cover border border-divider/50"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.setAttribute('style', 'display: flex');
                            }}
                          />
                        ) : null}
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl ${deal.company.logo_url ? 'hidden' : ''}`}>
                          {CATEGORY_ICONS[deal.company.category as keyof typeof CATEGORY_ICONS] || '🏢'}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-text my-xs">{deal.company.name}</h4>
                        <span className="inline-flex items-center container-px-sm container-py-xs bg-primary/10 text-primary text-xs font-medium rounded-full">
                          {categoriesQuery.data?.find(cat => cat.value === deal.company.category)?.label || deal.company.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end my-xs">
                        <Icons.star className="w-4 h-4 text-warning fill-current mr-xs" />
                        <span className="text-sm font-semibold text-text">
                          {(deal.company.overall_rating || 0).toFixed(1)}
                        </span>
                      </div>
                      <div className="text-xs text-textSecondary">
                        {deal.company.total_reviews || 0} reviews
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="my-lg">
                    <p className="text-textSecondary text-sm leading-relaxed line-clamp-3 my-md">
                      {deal.description}
                    </p>
                    
                    {/* Deal Badge */}
                    <div className={`inline-flex items-center container-px-md container-py-sm bg-gradient-to-r border rounded-xl text-sm font-semibold ${
                      DEAL_TYPE_STYLES[deal.deal_type] || DEAL_TYPE_STYLES.bonus
                    }`}>
                      <Icons.gift className="w-4 h-4 mr-xs" />
                      {deal.value || deal.title}
                    </div>
                  </div>

                  {/* Card Action */}
                  <a 
                    href={deal.affiliate_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full group"
                  >
                    Get Deal Now
                    <Icons.externalLink className="ml-sm w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
                ))}
              </div>
            </div>

            {/* Empty State */}
            {filteredDeals.length === 0 && featuredDealsQuery.data?.featuredDeals && featuredDealsQuery.data.featuredDeals.length > 0 && (
              <div className="flex-col-center py-8">
                <Icons.gift className="w-12 h-12 mb-4 text-textSecondary" />
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

        {/* Enhanced Platform Features Section */}
        <div className="text-center mb-8 section-px-lg section-py-xl">
          <h3 className="text-3xl font-bold text-text mb-4">
            Why Choose Our Platform
          </h3>
          <p className="text-textSecondary text-lg max-w-2xl mx-auto">
            Discover the features that make us the trusted choice for traders worldwide
          </p>
        </div>

        <div className="grid-cards section-px-lg section-py-lg">
          {features.map((feature, index) => (
            <div key={index} className="card-feature group animate-slide-in-left">
              <div className="relative overflow-hidden rounded-xl mb-8">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent"></div>
              </div>
              
              <div className="px-2">
                <h3 className="text-xl font-bold text-text mb-4">{feature.title}</h3>
                <p className="text-textSecondary leading-relaxed text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center my-3xl section-px-lg section-py-xl">
          <div className="glass rounded-2xl p-2xl border-primary/20">
            <div className="my-xl">
              <h3 className="text-3xl lg:text-4xl font-bold text-text my-lg">
                Start Trading with Exclusive Bonuses Today
              </h3>
              <div className="content-wide">
                <p className="text-lg text-textSecondary my-xl leading-relaxed">
                  Access handpicked trading platforms with member-exclusive deals across crypto, prop trading, and multi-asset markets.
                </p>
              </div>
            </div>

            {/* Enhanced Statistics Grid */}
            <div className="grid-stats-4 my-2xl">
              <div className="glass rounded-xl p-lg hover:bg-content1/50 transition-colors">
                <div className="text-center">
                  <div className="flex-center my-sm mb-2">
                    <Icons.shield className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-3xl font-bold text-text block">{stats.companies}</span>
                </div>
                <p className="text-sm text-textSecondary font-medium text-center">Trading Platforms</p>
              </div>
              
              <div className="glass rounded-xl p-lg hover:bg-content1/50 transition-colors">
                <div className="text-center">
                  <div className="flex-center my-sm mb-2">
                    <Icons.gift className="w-6 h-6 text-secondary" />
                  </div>
                  <span className="text-3xl font-bold text-text block">{stats.deals}</span>
                </div>
                <p className="text-sm text-textSecondary font-medium text-center">Exclusive Deals</p>
              </div>
              
              <div className="glass rounded-xl p-lg hover:bg-content1/50 transition-colors">
                <div className="text-center">
                  <div className="flex-center my-sm mb-2">
                    <Icons.chart className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-3xl font-bold text-text block">{stats.categories}</span>
                </div>
                <p className="text-sm text-textSecondary font-medium text-center">Market Categories</p>
              </div>
              
              <div className="glass rounded-xl p-lg hover:bg-content1/50 transition-colors">
                <div className="text-center">
                  <div className="flex-center my-sm mb-2">
                    <Icons.users className="w-6 h-6 text-secondary" />
                  </div>
                  <span className="text-3xl font-bold text-text block">{stats.totalReviews}</span>
                </div>
                <p className="text-sm text-textSecondary font-medium text-center">User Reviews</p>
              </div>
            </div>

            {/* Enhanced CTA Button */}
            <div className="my-xl">
              <a href="/deals" className="btn-primary group text-lg container-px-xl container-py-md">
                Browse All {stats.deals} Deals
                <Icons.arrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Enhanced Trust Indicators */}
            <div className="py-xl border-t border-divider/30">
              <div className="flex flex-wrap items-center justify-center gap-md text-sm text-foreground/70">
                <div className="flex items-center container-px-sm container-py-xs">
                  <Icons.shield className="w-4 h-4 text-primary mr-sm" />
                  <span className="font-medium">{stats.companies} verified platforms</span>
                </div>
                <div className="flex items-center container-px-sm container-py-xs">
                  <Icons.gift className="w-4 h-4 text-secondary mr-sm" />
                  <span className="font-medium">{stats.deals} active offers</span>
                </div>
                <div className="flex items-center container-px-sm container-py-xs">
                  <Icons.refresh className="w-4 h-4 text-primary mr-sm" />
                  <span className="font-medium">Updated daily</span>
                </div>
                {stats.avgRating > 0 && (
                  <div className="flex items-center container-px-sm container-py-xs">
                    <Icons.star className="w-4 h-4 text-warning fill-current mr-sm" />
                    <span className="font-medium">{stats.avgRating.toFixed(1)} platform rating</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features