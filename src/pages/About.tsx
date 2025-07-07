import React from 'react'
import { Shield, Users, TrendingUp, Award, Target, Eye, Heart, Zap, Globe, DollarSign, Cpu, BarChart3 } from 'lucide-react'

const About = () => {
  const stats = [
    { icon: Users, value: '10K+', label: 'Active Partners' },
    { icon: TrendingUp, value: '$50M+', label: 'Revenue Generated' },
    { icon: Shield, value: '99.9%', label: 'Platform Uptime' },
    { icon: Award, value: '7+', label: 'Years Experience' }
  ]

  const services = [
    {
      icon: Globe,
      title: 'Affiliate Marketing',
      description: 'Comprehensive affiliate network connecting brands with high-performing partners through advanced tracking, analytics, and optimization tools.',
      features: ['Performance Tracking', 'Real-time Analytics', 'Commission Management', 'Partner Onboarding']
    },
    {
      icon: DollarSign,
      title: 'Investment Services',
      description: 'Strategic investment solutions and portfolio management services designed to maximize returns while managing risk across diverse asset classes.',
      features: ['Portfolio Management', 'Risk Assessment', 'Market Analysis', 'Investment Advisory']
    },
    {
      icon: Zap,
      title: 'Cryptocurrency Solutions',
      description: 'End-to-end cryptocurrency services including trading platforms, wallet solutions, and blockchain integration for businesses and individuals.',
      features: ['Trading Platform', 'Secure Wallets', 'Blockchain Integration', 'DeFi Solutions']
    },
    {
      icon: Cpu,
      title: 'Digital Tools',
      description: 'Cutting-edge digital solutions and automation tools that streamline business operations and enhance productivity across industries.',
      features: ['Business Automation', 'API Integration', 'Custom Development', 'Cloud Solutions']
    }
  ]

  const team = [
    {
      name: 'Alexander Chen',
      role: 'CEO & Founder',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Former Goldman Sachs executive with 15+ years in fintech and digital marketing. Led multiple successful exits in the affiliate marketing space.'
    },
    {
      name: 'Sarah Martinez',
      role: 'CTO & Co-Founder',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Ex-Google senior engineer specializing in blockchain technology and high-frequency trading systems. PhD in Computer Science from MIT.'
    },
    {
      name: 'Michael Thompson',
      role: 'Head of Investment Strategy',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Former JP Morgan portfolio manager with expertise in alternative investments and cryptocurrency markets. CFA charterholder.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'VP of Business Development',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Strategic partnerships expert with a proven track record of scaling affiliate networks and building enterprise relationships.'
    }
  ]

  const values = [
    {
      icon: Shield,
      title: 'Security & Compliance',
      description: 'Industry-leading security protocols and full regulatory compliance across all jurisdictions where we operate.'
    },
    {
      icon: TrendingUp,
      title: 'Performance-Driven',
      description: 'Data-driven approach to maximize ROI for our partners and clients through continuous optimization and innovation.'
    },
    {
      icon: Users,
      title: 'Partnership Focus',
      description: 'Building long-term relationships based on mutual success, transparency, and shared growth objectives.'
    },
    {
      icon: Target,
      title: 'Innovation Leadership',
      description: 'Pioneering new technologies and methodologies to stay ahead of market trends and deliver competitive advantages.'
    },
    {
      icon: Eye,
      title: 'Transparency',
      description: 'Complete visibility into performance metrics, fees, and operations with real-time reporting and analytics.'
    },
    {
      icon: Heart,
      title: 'Client Success',
      description: 'Dedicated support and strategic guidance to ensure every client achieves their business objectives.'
    }
  ]

  const certifications = [
    'SEC Registered',
    'FINRA Member',
    'CFTC Compliant',
    'SOC 2 Type II',
    'ISO 27001',
    'PCI DSS Level 1'
  ]

  const achievements = [
    {
      icon: BarChart3,
      title: 'Market Leadership',
      description: 'Recognized as a top-tier affiliate network by industry publications and awarded "Best Innovation" at the Affiliate Summit 2024.'
    },
    {
      icon: Shield,
      title: 'Security Excellence',
      description: 'Zero security breaches in 7+ years of operation with bank-grade encryption and multi-layer security protocols.'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Operating in 45+ countries with localized support and compliance frameworks tailored to regional requirements.'
    }
  ]

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              About Oentex
            </span>
          </h1>
          <p className="text-xl text-textSecondary max-w-4xl mx-auto leading-relaxed">
            Oentex is a pioneering multi-vertical platform that bridges the gap between traditional finance and digital innovation. 
            We empower businesses and individuals through comprehensive affiliate marketing networks, strategic investment services, 
            cutting-edge cryptocurrency solutions, and advanced digital tools.
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
                At Oentex, we're committed to democratizing access to advanced financial technologies and digital marketing solutions. 
                Our mission is to create an ecosystem where businesses can thrive through innovative affiliate partnerships, 
                strategic investments, and cutting-edge digital tools.
              </p>
              <p className="text-textSecondary mb-6 leading-relaxed">
                We believe in the power of technology to transform traditional business models, and we're dedicated to providing 
                our partners with the tools, insights, and support they need to succeed in an increasingly digital world.
              </p>
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 border border-primary/20">
                <p className="text-text font-medium italic">
                  "Empowering the next generation of digital entrepreneurs through innovation, partnership, and unwavering commitment to excellence."
                </p>
                <p className="text-textSecondary text-sm mt-2">— Alexander Chen, CEO & Founder</p>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-80 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                <div className="relative z-10 text-center">
                  <div className="text-6xl mb-4">🚀</div>
                  <p className="text-text font-semibold">Innovation Driven</p>
                  <p className="text-textSecondary text-sm">Since 2017</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Services */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text mb-4">Core Services</h2>
            <p className="text-textSecondary max-w-3xl mx-auto">
              Our comprehensive suite of services spans multiple verticals, providing integrated solutions 
              that drive growth and maximize value for our partners and clients.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-surface/50 rounded-2xl p-8 border border-border hover:bg-surface/70 transition-all duration-300">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-text mb-2">{service.title}</h3>
                    <p className="text-textSecondary leading-relaxed">{service.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-sm text-textSecondary">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text mb-4">Industry Recognition</h2>
            <p className="text-textSecondary max-w-2xl mx-auto">
              Our commitment to excellence has earned recognition from industry leaders and regulatory bodies worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center p-6 bg-surface/50 rounded-2xl border border-border hover:bg-surface/70 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <achievement.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-text mb-3">{achievement.title}</h3>
                <p className="text-textSecondary text-sm leading-relaxed">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text mb-4">Leadership Team</h2>
            <p className="text-textSecondary max-w-2xl mx-auto">
              Our experienced leadership team combines deep industry expertise with a proven track record 
              of building and scaling successful technology companies.
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
                <p className="text-textSecondary text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text mb-4">Our Core Values</h2>
            <p className="text-textSecondary max-w-2xl mx-auto">
              These fundamental principles guide our decision-making and shape our relationships with partners, clients, and team members.
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
        <div className="bg-surface/30 rounded-3xl p-8 lg:p-12 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-text mb-4">Regulatory Excellence</h2>
            <p className="text-textSecondary max-w-2xl mx-auto">
              We maintain the highest standards of regulatory compliance and security certifications 
              to ensure the safety and protection of our partners and their data.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-background/50 rounded-xl p-4 text-center">
                <div className="w-8 h-8 bg-gradient-to-r from-success to-primary rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <p className="text-textSecondary text-sm font-medium">{cert}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-textSecondary text-sm mb-4">
              All investments involve risk and may result in loss. Past performance does not guarantee future results. 
              Cryptocurrency investments are particularly volatile and may not be suitable for all investors.
            </p>
            <p className="text-textSecondary text-xs">
              Oentex is committed to maintaining the highest standards of regulatory compliance across all jurisdictions where we operate.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-8 lg:p-12 border border-primary/20">
          <h2 className="text-3xl font-bold text-text mb-4">Ready to Partner with Oentex?</h2>
          <p className="text-textSecondary mb-8 max-w-2xl mx-auto">
            Join thousands of successful partners who trust Oentex for their affiliate marketing, investment, 
            and digital transformation needs. Let's build something extraordinary together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-primary to-primaryHover px-8 py-3 rounded-full text-white font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105">
              Become a Partner
            </button>
            <button className="border border-primary text-primary px-8 py-3 rounded-full font-medium hover:bg-primary hover:text-white transition-all duration-300">
              Schedule Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
