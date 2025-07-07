import React from 'react'
import { Search, Gift, TrendingUp, Shield, Users, BarChart3, Star, Zap, Globe, ExternalLink } from 'lucide-react'

const Features = () => {
  // Easy to add/modify affiliate platforms
  const affiliatePlatforms = [
    {
      name: 'TradingView',
      category: 'Charts & Analysis',
      bonus: 'Free Pro Trial',
      description: 'Professional charting platform with social trading features',
      affiliateUrl: 'https://tradingview.com?ref=YOUR_REF_ID',
      logo: '📊',
      users: '50M+',
      rating: 4.8
    },
    {
      name: 'Binance',
      category: 'Cryptocurrency',
      bonus: '20% Fee Discount',
      description: 'World\'s largest crypto exchange with advanced trading tools',
      affiliateUrl: 'https://binance.com/en/register?ref=YOUR_REF_ID',
      logo: '🟡',
      users: '120M+',
      rating: 4.6
    },
    {
      name: 'Interactive Brokers',
      category: 'Stocks & Options',
      bonus: 'Up to $1000',
      description: 'Professional trading platform with global market access',
      affiliateUrl: 'https://ibkr.com/referral/YOUR_REF_ID',
      logo: '💼',
      users: '1.5M+',
      rating: 4.7
    },
    {
      name: 'eToro',
      category: 'Social Trading',
      bonus: '$200 Welcome',
      description: 'Copy successful traders and build your portfolio automatically',
      affiliateUrl: 'https://etoro.com/en/cps/click?pid=YOUR_PID',
      logo: '👥',
      users: '30M+',
      rating: 4.5
    },
    {
      name: 'Coinbase',
      category: 'Cryptocurrency',
      bonus: '$10 Free Bitcoin',
      description: 'Most trusted crypto platform for beginners and professionals',
      affiliateUrl: 'https://coinbase.com/join/YOUR_REF_ID',
      logo: '🔵',
      users: '35M+',
      rating: 4.4
    },
    {
      name: 'Plus500',
      category: 'CFDs',
      bonus: '$25 No Deposit',
      description: 'Trade CFDs on stocks, forex, commodities and cryptocurrencies',
      affiliateUrl: 'https://plus500.com?id=YOUR_AFFILIATE_ID',
      logo: '➕',
      users: '800K+',
      rating: 4.3
    }
  ]

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

  // Function to handle affiliate link clicks (for tracking)
  const handleAffiliateClick = (platform: string, url: string) => {
    // Add your tracking logic here
    console.log(`Affiliate click: ${platform}`)
    // You can add Google Analytics, Facebook Pixel, or other tracking
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="features" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* Featured Platforms Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-text text-center mb-8">
            Featured Trading Platforms
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {affiliatePlatforms.map((platform, index) => (
              <div 
                key={index}
                className="group bg-surface/50 backdrop-blur-lg rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{platform.logo}</div>
                    <div>
                      <h4 className="text-lg font-semibold text-text">{platform.name}</h4>
                      <span className="text-xs text-textSecondary bg-primary/10 px-2 py-1 rounded-full">
                        {platform.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-primary">{platform.users}</div>
                    <div className="flex items-center">
                      <Star className="w-3 h-3 text-warning fill-current mr-1" />
                      <span className="text-xs text-textSecondary">{platform.rating}</span>
                    </div>
                  </div>
                </div>

                <p className="text-textSecondary text-sm mb-4">{platform.description}</p>

                {/* Bonus Badge */}
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-green-400/20 to-green-600/20 border border-green-400/30 rounded-full text-green-600 text-xs font-medium">
                    <Gift className="w-3 h-3 mr-1" />
                    {platform.bonus}
                  </span>
                </div>

                {/* Affiliate CTA Button */}
                <button 
                  onClick={() => handleAffiliateClick(platform.name, platform.affiliateUrl)}
                  className="group w-full bg-gradient-to-r from-primary to-secondary px-4 py-3 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center"
                >
                  Get Bonus Now
                  <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
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

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20">
            <h3 className="text-2xl font-bold text-text mb-4">
              Ready to Start Trading with Bonuses?
            </h3>
            <p className="text-textSecondary mb-6 max-w-2xl mx-auto">
              Join thousands of traders who are saving money through our exclusive deals and bonuses.
            </p>
            <button className="bg-gradient-to-r from-primary to-secondary px-8 py-3 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300">
              View All Deals
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features