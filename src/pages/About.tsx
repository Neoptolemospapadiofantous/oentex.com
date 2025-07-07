import React from 'react'
import { Shield, Users, TrendingUp, Award, Target, Eye, Heart } from 'lucide-react'

const About = () => {
  const stats = [
    { icon: Users, value: '500K+', label: 'Active Users' },
    { icon: TrendingUp, value: '$2.5B+', label: 'Trading Volume' },
    { icon: Shield, value: '99.9%', label: 'Uptime' },
    { icon: Award, value: '5+', label: 'Years Experience' }
  ]

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Co-Founder',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Former Goldman Sachs executive with 15+ years in financial technology.'
    },
    {
      name: 'Michael Chen',
      role: 'CTO & Co-Founder',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Ex-Google engineer specializing in high-frequency trading systems.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Security',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Cybersecurity expert with experience at major financial institutions.'
    },
    {
      name: 'David Kim',
      role: 'Head of Product',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Product strategist focused on user experience and market innovation.'
    }
  ]

  const values = [
    {
      icon: Shield,
      title: 'Security First',
      description: 'Your assets and data are protected by industry-leading security measures and encryption.'
    },
    {
      icon: Users,
      title: 'User-Centric',
      description: 'Every feature is designed with our users in mind, ensuring the best possible experience.'
    },
    {
      icon: TrendingUp,
      title: 'Innovation',
      description: 'We continuously innovate to bring you the latest tools and features in trading technology.'
    },
    {
      icon: Target,
      title: 'Transparency',
      description: 'We believe in complete transparency in our operations, fees, and business practices.'
    },
    {
      icon: Eye,
      title: 'Accessibility',
      description: 'Making advanced trading tools accessible to everyone, regardless of experience level.'
    },
    {
      icon: Heart,
      title: 'Community',
      description: 'Building a supportive community of traders who learn and grow together.'
    }
  ]

  const certifications = [
    'SEC Registered',
    'FINRA Member',
    'SIPC Protected',
    'SOC 2 Certified',
    'ISO 27001 Compliant',
    'PCI DSS Level 1'
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

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text mb-4">Meet Our Team</h2>
            <p className="text-textSecondary max-w-2xl mx-auto">
              Our experienced team combines expertise from top financial institutions and technology companies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-surface/50 rounded-2xl p-6 border border-border hover:bg-surface/70 transition-all duration-300 text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-text mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-textSecondary text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text mb-4">Our Values</h2>
            <p className="text-textSecondary max-w-2xl mx-auto">
              These core values guide everything we do and shape our commitment to our users.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="p-6 bg-surface/50 rounded-2xl border border-border hover:bg-surface/70 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-text mb-3">{value.title}</h3>
                <p className="text-textSecondary leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Regulatory Compliance */}
        <div className="bg-surface/30 rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-text mb-4">Regulatory Compliance</h2>
            <p className="text-textSecondary max-w-2xl mx-auto">
              We maintain the highest standards of regulatory compliance and security certifications.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-background/50 rounded-xl p-4 text-center">
                <div className="w-8 h-8 bg-gradient-to-r from-success to-primary rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <p className="text-textSecondary text-sm font-medium">{cert}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-textSecondary text-sm">
              All investments involve risk and may result in loss. Past performance does not guarantee future results.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
