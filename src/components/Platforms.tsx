import { Icons } from './icons'

const Platforms = () => {
  const platforms = [
    {
      name: 'Binance',
      logo: '🟡',
      description: 'World\'s largest cryptocurrency exchange',
      rating: 4.6,
      users: '120M+',
      features: ['Spot Trading', 'Futures', 'Staking', 'NFT Marketplace']
    },
    {
      name: 'Coinbase',
      logo: '🔵',
      description: 'Leading US-based crypto exchange',
      rating: 4.4,
      users: '100M+',
      features: ['Buy & Sell', 'Coinbase Pro', 'Earn Rewards', 'Wallet']
    },
    {
      name: 'Kraken',
      logo: '🐙',
      description: 'Secure and reliable crypto trading',
      rating: 4.2,
      users: '9M+',
      features: ['Spot Trading', 'Futures', 'Margin', 'Staking']
    },
    {
      name: 'Bybit',
      logo: '🟨',
      description: 'Professional crypto derivatives exchange',
      rating: 4.3,
      users: '10M+',
      features: ['Derivatives', 'Spot Trading', 'Copy Trading', 'NFTs']
    },
    {
      name: 'OKX',
      logo: '⚫',
      description: 'Global crypto exchange and Web3 ecosystem',
      rating: 4.1,
      users: '20M+',
      features: ['Trading', 'DeFi', 'NFTs', 'Web3 Wallet']
    },
    {
      name: 'KuCoin',
      logo: '🔴',
      description: 'The People\'s Exchange',
      rating: 4.0,
      users: '20M+',
      features: ['Spot Trading', 'Futures', 'Margin', 'Earn']
    }
  ]

  return (
    <section className="page-section">
      <div className="container-page">
        {/* Header */}
        <div className="text-center my-3xl">
          <h2 className="text-4xl lg:text-5xl font-bold text-text my-lg">
            <span className="gradient-text">Trusted Trading</span>
            <br />
            Platforms
          </h2>
          <div className="content-wide">
            <p className="text-xl text-textSecondary">
              Discover the best cryptocurrency exchanges and trading platforms. 
              Compare features, fees, and security to find your perfect match.
            </p>
          </div>
        </div>

        {/* Platforms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl">
          {platforms.map((platform, index) => (
            <div 
              key={platform.name}
              className="card-feature group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Platform Header */}
              <div className="flex items-center justify-between my-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                    {platform.logo}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text">{platform.name}</h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Icons.star className="w-4 h-4 text-warning fill-current" />
                        <span className="text-sm text-textSecondary ml-1">{platform.rating}</span>
                      </div>
                      <span className="text-sm text-textSecondary">•</span>
                      <span className="text-sm text-textSecondary">{platform.users} users</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-textSecondary my-lg leading-relaxed">
                {platform.description}
              </p>

              {/* Features */}
              <div className="my-lg">
                <h4 className="text-sm font-semibold text-text my-sm">Key Features</h4>
                <div className="grid grid-cols-2 gap-2">
                  {platform.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-sm text-textSecondary">
                      <Icons.check className="w-3 h-3 text-success mr-2 flex-shrink-0" />
                      <span className="truncate">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button className="btn-primary w-full group">
                <span>Explore {platform.name}</span>
                <Icons.arrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center my-3xl">
          <div className="glass rounded-2xl p-xl border-primary/20">
            <h3 className="text-2xl font-bold text-text my-md">
              Ready to Start Trading?
            </h3>
            <p className="text-textSecondary my-lg content-wide">
              Choose from our carefully curated list of trusted platforms and start your trading journey today.
            </p>
            <button className="btn-primary group">
              <span>View All Platforms</span>
              <Icons.arrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Platforms
