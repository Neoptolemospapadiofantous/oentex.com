import React from 'react'
import { Shield, Users, TrendingUp, Award } from 'lucide-react'

const About = () => {
  const stats = [
    { icon: Users, value: '500K+', label: 'Active Users' },
    { icon: TrendingUp, value: '$2.5B+', label: 'Trading Volume' },
    { icon: Shield, value: '99.9%', label: 'Uptime' },
    { icon: Award, value: '5+', label: 'Years Experience' }
  ]

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              About CryptoVault
            </span>
          </h1>
          <p className="text-xl text-textSecondary max-w-3xl mx-auto">
            We're revolutionizing the way people trade cryptocurrencies and stocks with cutting-edge technology, 
            unmatched security, and user-friendly interfaces.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-surface/50 rounded-2xl border border-border hover:bg-surface/70 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-text mb-2">{stat.value}</div>
              <div className="text-sm text-textSecondary">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission Section */}
        <div className="bg-surface/30 rounded-3xl p-8 lg:p-12 mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-text mb-6">Our Mission</h2>
              <p className="text-textSecondary mb-6 leading-relaxed">
                At CryptoVault, we believe that everyone should have access to powerful trading tools and 
                investment opportunities. Our mission is to democratize finance by providing a secure, 
                intuitive platform that empowers both beginners and professionals.
              </p>
              <p className="text-textSecondary leading-relaxed">
                We're committed to transparency, security, and innovation in everything we do. 
                Our team works tirelessly to ensure that your trading experience is seamless, 
                secure, and profitable.
              </p>
            </div>
            <div className="relative">
              <div className="w-full h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                <div className="text-6xl">🚀</div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-text mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-4">Security First</h3>
              <p className="text-textSecondary">
                Your assets and data are protected by industry-leading security measures and encryption.
              </p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-4">User-Centric</h3>
              <p className="text-textSecondary">
                Every feature is designed with our users in mind, ensuring the best possible experience.
              </p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-4">Innovation</h3>
              <p className="text-textSecondary">
                We continuously innovate to bring you the latest tools and features in trading technology.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
