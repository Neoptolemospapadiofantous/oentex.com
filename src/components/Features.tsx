import React from 'react'
import { Smartphone, TrendingUp, Shield, Zap, Globe, BarChart3 } from 'lucide-react'

const Features = () => {
  const features = [
    {
      icon: Smartphone,
      title: 'Mobile-First Design',
      description: 'Trade on the go with our intuitive mobile app. Available on iOS and Android with full feature parity.',
      image: 'https://images.pexels.com/photos/887751/pexels-photo-887751.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Professional-grade charts and analysis tools to make informed trading decisions.',
      image: 'https://images.pexels.com/photos/590041/pexels-photo-590041.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Shield,
      title: 'Bank-Grade Security',
      description: 'Multi-layer security with cold storage, 2FA, and insurance coverage for your peace of mind.',
      image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Zap,
      title: 'Instant Execution',
      description: 'Lightning-fast order execution with minimal slippage and competitive fees.',
      image: 'https://images.pexels.com/photos/355948/pexels-photo-355948.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Globe,
      title: 'Global Markets',
      description: 'Access to 200+ cryptocurrencies and traditional stocks from major exchanges worldwide.',
      image: 'https://images.pexels.com/photos/355952/pexels-photo-355952.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: BarChart3,
      title: 'Portfolio Management',
      description: 'Comprehensive portfolio tracking with performance analytics and risk assessment.',
      image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ]

  return (
    <section id="features" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-text mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Fully Featured
            </span>
            <br />
            Trading Platform
          </h2>
          <p className="text-xl text-textSecondary max-w-3xl mx-auto">
            Everything you need to buy, trade, and invest in cryptocurrencies and stocks. 
            Built for beginners and professionals alike.
          </p>
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
      </div>
    </section>
  )
}

export default Features
