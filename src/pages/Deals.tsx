import React from 'react'
import { ExternalLink, Star, Clock, Gift } from 'lucide-react'

const Deals = () => {
  const deals = [
    {
      platform: 'Binance',
      title: 'Get $100 Trading Bonus',
      description: 'Sign up and get a $100 trading bonus when you deposit $500 or more',
      bonus: '$100 Bonus',
      rating: 4.8,
      features: ['Zero Trading Fees', 'Advanced Charts', '24/7 Support'],
      cta: 'Claim Bonus',
      urgent: true
    },
    {
      platform: 'Coinbase',
      title: 'Earn $10 in Bitcoin',
      description: 'Complete your first trade and earn $10 in Bitcoin instantly',
      bonus: '$10 Bitcoin',
      rating: 4.7,
      features: ['Beginner Friendly', 'Secure Wallet', 'Mobile App'],
      cta: 'Get Started',
      urgent: false
    },
    {
      platform: 'Kraken',
      title: 'Pro Trading Features',
      description: 'Access professional trading tools with reduced fees for new users',
      bonus: '50% Fee Discount',
      rating: 4.6,
      features: ['Advanced Trading', 'Low Fees', 'High Liquidity'],
      cta: 'Start Trading',
      urgent: true
    },
    {
      platform: 'eToro',
      title: 'Social Trading Platform',
      description: 'Copy successful traders and get a welcome bonus on your first deposit',
      bonus: '$50 Welcome',
      rating: 4.5,
      features: ['Copy Trading', 'Social Features', 'Multi-Asset'],
      cta: 'Join Now',
      urgent: false
    }
  ]

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Exclusive Deals
            </span>
          </h1>
          <p className="text-xl text-textSecondary max-w-3xl mx-auto">
            Get the best trading bonuses and exclusive offers from top cryptocurrency and stock trading platforms.
          </p>
        </div>

        {/* Deals Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {deals.map((deal, index) => (
            <div key={index} className="relative bg-surface/50 rounded-3xl p-8 border border-border hover:bg-surface/70 transition-all duration-300 group">
              {deal.urgent && (
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-accent to-primary px-4 py-2 rounded-full text-white text-sm font-medium flex items-center animate-pulse">
                  <Clock className="w-4 h-4 mr-1" />
                  Limited Time
                </div>
              )}
              
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-text mb-2">{deal.platform}</h3>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center mr-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(deal.rating) ? 'text-warning fill-current' : 'text-textSecondary'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-textSecondary text-sm">{deal.rating}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-gradient-to-r from-primary to-secondary px-4 py-2 rounded-full text-white font-semibold text-sm">
                    {deal.bonus}
                  </div>
                </div>
              </div>

              <h4 className="text-xl font-semibold text-text mb-3">{deal.title}</h4>
              <p className="text-textSecondary mb-6 leading-relaxed">{deal.description}</p>

              <div className="mb-6">
                <h5 className="text-text font-medium mb-3 flex items-center">
                  <Gift className="w-4 h-4 mr-2" />
                  Key Features
                </h5>
                <ul className="space-y-2">
                  {deal.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-textSecondary text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button className="w-full bg-gradient-to-r from-primary to-secondary px-6 py-4 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center">
                {deal.cta}
                <ExternalLink className="w-5 h-5 ml-2" />
              </button>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-16 p-6 bg-surface/30 rounded-2xl border border-border">
          <h3 className="text-lg font-semibold text-text mb-3">Important Disclaimer</h3>
          <p className="text-textSecondary text-sm leading-relaxed">
            Trading cryptocurrencies and stocks involves substantial risk and may not be suitable for all investors. 
            Past performance does not guarantee future results. Please consider your investment objectives and risk tolerance 
            before trading. The bonuses and offers mentioned are subject to the terms and conditions of each platform. 
            CryptoVault may receive compensation for referrals.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Deals
