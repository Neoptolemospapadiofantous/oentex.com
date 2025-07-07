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
    { icon: Shield, text: 'Regulated Partners' },
    { icon: TrendingUp, text: 'Market Analysis' },
    { icon: Zap, text: 'Exclusive Bonuses' }
  ]

  const stats = [
    { value: '50+', label: 'Trusted Partners' },
    { value: '$500M+', label: 'Member Savings' },
    { value: '200K+', label: 'Active Members' }
  ]

  const cryptoSymbols = [
    { symbol: 'BTC', color: 'from-orange-400/20 to-orange-600/20', border: 'border-orange-400/30', text: 'text-orange-500' },
    { symbol: 'ETH', color: 'from-blue-400/20 to-blue-600/20', border: 'border-blue-400/30', text: 'text-blue-500' },
    { symbol: 'STOCKS', color: 'from-green-400/20 to-green-600/20', border: 'border-green-400/30', text: 'text-green-500' },
    { symbol: 'BONDS', color: 'from-purple-400/20 to-purple-600/20', border: 'border-purple-400/30', text: 'text-purple-500' },
    { symbol: 'FOREX', color: 'from-cyan-400/20 to-cyan-600/20', border: 'border-cyan-400/30', text: 'text-cyan-500' },
    { symbol: 'BANK', color: 'from-indigo-400/20 to-indigo-600/20', border: 'border-indigo-400/30', text: 'text-indigo-500' },
    { symbol: 'GOLD', color: 'from-yellow-400/20 to-yellow-600/20', border: 'border-yellow-400/30', text: 'text-yellow-600' },
    { symbol: 'USD', color: 'from-gray-400/20 to-gray-600/20', border: 'border-gray-400/30', text: 'text-gray-500' },
    { symbol: 'DEFI', color: 'from-violet-400/20 to-violet-600/20', border: 'border-violet-400/30', text: 'text-violet-500' },
    { symbol: 'REIT', color: 'from-teal-400/20 to-teal-600/20', border: 'border-teal-400/30', text: 'text-teal-500' },
    { symbol: 'NFT', color: 'from-rose-400/20 to-rose-600/20', border: 'border-rose-400/30', text: 'text-rose-500' },
    { symbol: 'FUND', color: 'from-emerald-400/20 to-emerald-600/20', border: 'border-emerald-400/30', text: 'text-emerald-500' }
  ]

  const bubblePositions = [
    { left: '5%', top: '15%', size: 'w-14 h-14', delay: '0s', duration: '4s' },
    { right: '8%', top: '12%', size: 'w-14 h-14', delay: '0.5s', duration: '5s' },
    { left: '3%', top: '35%', size: 'w-16 h-16', delay: '1s', duration: '6s' },
    { right: '5%', top: '45%', size: 'w-14 h-14', delay: '1.5s', duration: '4.5s' },
    { left: '12%', top: '65%', size: 'w-16 h-16', delay: '2s', duration: '5.5s' },
    { right: '15%', bottom: '25%', size: 'w-14 h-14', delay: '2.5s', duration: '4s' },
    { left: '8%', bottom: '15%', size: 'w-16 h-16', delay: '3s', duration: '6s' },
    { right: '3%', bottom: '40%', size: 'w-14 h-14', delay: '3.5s', duration: '5s' },
    { left: '15%', top: '25%', size: 'w-12 h-12', delay: '4s', duration: '4.5s' },
    { right: '12%', top: '65%', size: 'w-14 h-14', delay: '4.5s', duration: '5.5s' },
    { left: '6%', top: '50%', size: 'w-14 h-14', delay: '5s', duration: '4s' },
    { right: '6%', bottom: '15%', size: 'w-16 h-16', delay: '5.5s', duration: '6s' }
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 lg:pt-20 pb-12 lg:pb-16 bg-gradient-to-br from-primaryMuted via-background to-secondaryMuted">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231e40af' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Animated Crypto Elements - Consistent Positioning */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Crypto Coins - Consistent design */}
        {cryptoSymbols.map((crypto, index) => {
          const position = bubblePositions[index]
          if (!position) return null
          
          return (
            <div
              key={crypto.symbol + index}
              className="absolute animate-float"
              style={{
                left: position.left,
                right: position.right,
                top: position.top,
                bottom: position.bottom,
                animationDelay: position.delay,
                animationDuration: position.duration
              }}
            >
              <div className={`${position.size} bg-gradient-to-r ${crypto.color} rounded-full border ${crypto.border} flex items-center justify-center backdrop-blur-sm animate-glow shadow-lg hover:scale-110 transition-transform duration-300`}>
                <span className={`${crypto.text} font-bold text-xs`}>{crypto.symbol}</span>
              </div>
            </div>
          )
        })}

        {/* Enhanced Floating Particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${8 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        {/* Network Connection Lines */}
        <div className="absolute inset-0">
          <svg className="w-full h-full opacity-20">
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="rgb(16, 185, 129)" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <line x1="10%" y1="20%" x2="90%" y2="30%" stroke="url(#connectionGradient)" strokeWidth="1" className="animate-pulse-slow" />
            <line x1="15%" y1="70%" x2="85%" y2="60%" stroke="url(#connectionGradient)" strokeWidth="1" className="animate-pulse-slow" style={{ animationDelay: '2s' }} />
            <line x1="20%" y1="40%" x2="80%" y2="80%" stroke="url(#connectionGradient)" strokeWidth="1" className="animate-pulse-slow" style={{ animationDelay: '4s' }} />
          </svg>
        </div>

        {/* Gradient Orbs - Positioned in corners */}
        <div 
          className="absolute w-80 h-80 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl animate-float"
          style={{
            left: `${-100 + mousePosition.x * 0.01}px`,
            top: `${-100 + mousePosition.y * 0.01}px`,
          }}
        />
        <div 
          className="absolute w-60 h-60 bg-gradient-to-r from-accent/5 to-primary/5 rounded-full blur-3xl animate-float"
          style={{
            right: `${-100 + mousePosition.x * 0.008}px`,
            bottom: `${-100 + mousePosition.y * 0.008}px`,
            animationDelay: '2s'
          }}
        />
        
        {/* Floating Geometric Shapes - Enhanced */}
        <div className="absolute top-28 left-24 w-2 h-2 bg-primary/30 rounded-full animate-bounce-subtle" />
        <div className="absolute top-52 right-32 w-3 h-3 bg-secondary/30 rounded-full animate-bounce-subtle" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-52 left-36 w-1.5 h-1.5 bg-accent/30 rounded-full animate-bounce-subtle" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-36 right-24 w-2.5 h-2.5 bg-primary/30 rounded-full animate-bounce-subtle" style={{ animationDelay: '2s' }} />
        <div className="absolute top-36 left-1/4 w-2 h-2 bg-green-400/30 rounded-full animate-bounce-subtle" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-purple-400/30 rounded-full animate-bounce-subtle" style={{ animationDelay: '5s' }} />

        {/* Enhanced Animated Lines */}
        <div className="absolute top-1/4 left-20 w-28 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-pulse-slow" />
        <div className="absolute bottom-1/3 right-20 w-24 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-16 w-20 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent animate-pulse-slow" style={{ animationDelay: '2s' }} />
        
        {/* Enhanced Trading Chart Lines */}
        <div className="absolute top-1/3 right-24">
          <svg width="90" height="55" className="animate-pulse-slow">
            <polyline
              fill="none"
              stroke="rgba(59, 130, 246, 0.3)"
              strokeWidth="2"
              points="0,45 18,28 36,38 54,18 72,23 90,8"
            />
            <circle cx="18" cy="28" r="2" fill="rgba(59, 130, 246, 0.4)" className="animate-ping" style={{ animationDelay: '1s' }} />
            <circle cx="54" cy="18" r="2" fill="rgba(59, 130, 246, 0.4)" className="animate-ping" style={{ animationDelay: '3s' }} />
          </svg>
        </div>
        
        <div className="absolute bottom-1/4 left-24">
          <svg width="80" height="50" className="animate-pulse-slow" style={{ animationDelay: '2s' }}>
            <polyline
              fill="none"
              stroke="rgba(16, 185, 129, 0.3)"
              strokeWidth="2"
              points="0,40 16,23 32,33 48,15 64,20 80,6"
            />
            <circle cx="32" cy="33" r="2" fill="rgba(16, 185, 129, 0.4)" className="animate-ping" style={{ animationDelay: '2s' }} />
            <circle cx="64" cy="20" r="2" fill="rgba(16, 185, 129, 0.4)" className="animate-ping" style={{ animationDelay: '4s' }} />
          </svg>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Content */}
        <div className="animate-slide-up pt-4 sm:pt-6 pb-4 sm:pb-6">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-surface border border-border rounded-full text-sm text-textSecondary mb-8 animate-glow backdrop-blur-sm shadow-sm">
            <Star className="w-4 h-4 mr-2 text-warning" />
            Trusted by 200,000+ investors worldwide
          </div>

          {/* Headline */}
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="block animate-slide-up text-text">Your Gateway to</span>
            <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient-x" style={{ animationDelay: '0.2s' }}>
              Financial Freedom
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl lg:text-2xl text-textSecondary max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Discover exclusive bonuses and deals from top crypto exchanges, stock brokers, banks, and investment platforms. 
            Compare offers and maximize your financial potential.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <Link
              to="/deals"
              className="group bg-gradient-to-r from-primary to-primaryHover px-8 py-4 rounded-full text-white font-semibold text-lg hover:shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 flex items-center"
            >
              Explore Deals
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 border-2 border-border rounded-full text-text font-semibold text-lg hover:bg-surface hover:border-primary transition-all duration-300 transform hover:scale-105"
            >
              Learn More
            </Link>
          </div>

          {/* Features */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-16 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            {features.map((feature, index) => (
              <div key={index} className="flex items-center text-textSecondary hover:text-primary transition-colors duration-300">
                <div className="w-8 h-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center mr-3 border border-primary/20">
                  <feature.icon className="w-4 h-4 text-primary" />
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
