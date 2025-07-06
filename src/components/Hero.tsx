import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Shield, Zap, ArrowRight, Star } from 'lucide-react'

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const features = [
    { icon: Shield, text: 'Bank-Level Security' },
    { icon: TrendingUp, text: 'Real-Time Analytics' },
    { icon: Zap, text: 'Lightning Fast Trades' }
  ]

  const stats = [
    { value: '500K+', label: 'Active Traders' },
    { value: '$2.5B+', label: 'Trading Volume' },
    { value: '99.9%', label: 'Uptime' }
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-surface/20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl animate-float"
          style={{
            left: `${mousePosition.x * 0.02}px`,
            top: `${mousePosition.y * 0.02}px`,
          }}
        />
        <div 
          className="absolute w-64 h-64 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-3xl animate-float"
          style={{
            right: `${mousePosition.x * 0.01}px`,
            bottom: `${mousePosition.y * 0.01}px`,
            animationDelay: '2s'
          }}
        />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-primary/30 rounded-full animate-bounce-subtle" />
        <div className="absolute top-40 right-20 w-6 h-6 bg-secondary/30 rounded-full animate-bounce-subtle" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-accent/30 rounded-full animate-bounce-subtle" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-20 right-10 w-5 h-5 bg-primary/30 rounded-full animate-bounce-subtle" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Content */}
        <div className="animate-slide-up">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-surface/50 border border-border rounded-full text-sm text-textSecondary mb-8 animate-glow">
            <Star className="w-4 h-4 mr-2 text-warning" />
            Trusted by 500,000+ traders worldwide
          </div>

          {/* Headline */}
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="block animate-slide-up">The Future of</span>
            <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient-x" style={{ animationDelay: '0.2s' }}>
              Crypto Trading
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl lg:text-2xl text-textSecondary max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Access exclusive trading bonuses, professional tools, and expert insights. 
            Start your journey to financial freedom today.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <Link
              to="/deals"
              className="group bg-gradient-to-r from-primary to-secondary px-8 py-4 rounded-full text-white font-semibold text-lg hover:shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 flex items-center"
            >
              Explore Deals
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 border border-border rounded-full text-text font-semibold text-lg hover:bg-surface/50 transition-all duration-300 transform hover:scale-105"
            >
              Learn More
            </Link>
          </div>

          {/* Features */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-16 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            {features.map((feature, index) => (
              <div key={index} className="flex items-center text-textSecondary hover:text-primary transition-colors duration-300">
                <div className="w-8 h-8 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center mr-3">
                  <feature.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '1s' }}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-text mb-2 animate-counter" style={{ animationDelay: `${1.2 + index * 0.2}s` }}>
                  {stat.value}
                </div>
                <div className="text-textSecondary text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-textSecondary/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-textSecondary/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
