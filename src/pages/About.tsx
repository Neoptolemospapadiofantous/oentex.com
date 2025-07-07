import React from 'react'
import { Shield, Users, TrendingUp, Award, Target, Eye, Heart, Zap, Globe, Link, Cpu, BarChart3, ExternalLink, AlertCircle } from 'lucide-react'
import ParallaxMission from '../components/ParallaxMission'
import ParallaxServices from '../components/ParallaxServices'
import ParallaxValues from '../components/ParallaxValues'
import AnimatedInnovation from '../components/AnimatedInnovation'
import '../styles/AnimatedInnovation.css'

const About = () => {
  const stats = [
    { icon: Users, value: '10K+', label: 'Active Partners' },
    { icon: TrendingUp, value: '$50M+', label: 'Partner Revenue Generated' },
    { icon: Shield, value: '99.9%', label: 'Platform Uptime' },
    { icon: Award, value: '7+', label: 'Years Experience' }
  ]

  const affiliateServices = [
    {
      icon: Globe,
      title: 'Affiliate Network Management',
      description: 'We connect users with top-tier affiliate partners across multiple industries through our comprehensive network management platform.',
      features: ['Partner Vetting Process', 'Performance Analytics', 'Commission Tracking', 'Quality Assurance'],
      disclaimer: 'We earn commissions from qualified referrals to our affiliate partners.'
    },
    {
      icon: Link,
      title: 'Third-Party Service Connections',
      description: 'Our platform facilitates connections between users and vetted third-party service providers in cryptocurrency, digital tools, and financial sectors.',
      features: ['Service Provider Directory', 'User Matching System', 'Review & Rating System', 'Support Coordination'],
      disclaimer: 'All services are provided by independent third-party companies. We receive affiliate commissions for successful referrals.'
    },
    {
      icon: Zap,
      title: 'Cryptocurrency Partner Network',
      description: 'We maintain partnerships with leading cryptocurrency platforms and service providers, connecting users with trusted solutions.',
      features: ['Exchange Partnerships', 'Wallet Provider Network', 'DeFi Platform Connections', 'Educational Resources'],
      disclaimer: 'Cryptocurrency investments carry significant risk. We are compensated through affiliate partnerships.'
    },
    {
      icon: Cpu,
      title: 'Digital Tools Marketplace',
      description: 'Our affiliate marketplace connects users with cutting-edge digital tools and software solutions from our partner network.',
      features: ['Software Partnerships', 'Tool Comparisons', 'Integration Support', 'User Onboarding'],
      disclaimer: 'We earn affiliate commissions from software purchases made through our platform.'
    }
  ]

  const values = [
    {
      icon: Shield,
      title: 'Trust & Transparency',
      description: 'We maintain complete transparency about our affiliate relationships and ensure all partner services meet our quality standards.'
    },
    {
      icon: TrendingUp,
      title: 'Performance-Driven Partnerships',
      description: 'We carefully select affiliate partners based on performance metrics, user satisfaction, and service quality to ensure optimal outcomes.'
    },
    {
      icon: Users,
      title: 'User-First Approach',
      description: 'Our primary focus is connecting users with the best possible service providers, even when it means lower commission rates for us.'
    },
    {
      icon: Target,
      title: 'Quality Partner Network',
      description: 'We maintain rigorous vetting processes for all affiliate partners to ensure users access only reputable, high-quality services.'
    },
    {
      icon: Eye,
      title: 'Full Disclosure',
      description: 'We clearly disclose all affiliate relationships and commission structures, ensuring users make informed decisions.'
    },
    {
      icon: Heart,
      title: 'User Success Focus',
      description: 'We measure our success by user satisfaction and positive outcomes with our affiliate partners, not just commission revenue.'
    }
  ]

  const certifications = [
    'FTC Compliant',
    'GDPR Compliant',
    'CCPA Compliant',
    'SOC 2 Type II',
    'ISO 27001',
    'Better Business Bureau A+'
  ]

  const achievements = [
    {
      icon: BarChart3,
      title: 'Industry Recognition',
      description: 'Recognized as a leading affiliate marketing platform by industry publications and awarded "Best Affiliate Network" at the Digital Marketing Summit 2024.'
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Maintained zero security breaches in 7+ years of operation with industry-leading data protection and user privacy standards.'
    },
    {
      icon: Globe,
      title: 'Global Partner Network',
      description: 'Operating partnerships in 45+ countries with localized support and compliance frameworks tailored to regional requirements.'
    }
  ]

  return (
    <div className="min-h-screen pt-20 pb-12">
      {/* Simplified Hero Section - Matching Contact Page Design */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-text mb-6">
            About Oentex
          </h1>
          <p className="text-xl text-textSecondary max-w-3xl mx-auto">
            Your trusted affiliate marketing platform connecting you with premium cryptocurrency, 
            digital tools, and financial technology services through transparent partnerships.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Animated Innovation Section */}
        <AnimatedInnovation />

        {/* Affiliate Disclosure Banner */}
        <div className="bg-gradient-to-r from-warning/10 to-accent/10 border border-warning/30 rounded-2xl p-6 mb-16">
          <div className="flex items-start space-x-4">
            <AlertCircle className="w-6 h-6 text-warning flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-text mb-2">Important Disclosure</h3>
              <p className="text-textSecondary leading-relaxed mb-3">
                <strong>Oentex operates as an affiliate marketing platform.</strong> We connect users with third-party service providers 
                and earn commissions from successful referrals. We do not provide direct financial, investment, or cryptocurrency services. 
                All services are provided by independent partner companies.
              </p>
              <p className="text-textSecondary text-sm">
                This disclosure is made in compliance with FTC guidelines for affiliate marketing. We maintain editorial independence 
                and only partner with services we believe provide value to our users.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid with Parallax */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-surface/50 rounded-2xl border border-border hover:bg-surface/70 transition-all duration-300 parallax-card" data-speed={0.5 + index * 0.1}>
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-text mb-2">{stat.value}</div>
              <div className="text-sm text-textSecondary">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission Section with Enhanced Parallax */}
        <div className="bg-surface/30 rounded-3xl p-8 lg:p-12 mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-text mb-6">Our Mission</h2>
              <p className="text-textSecondary mb-6 leading-relaxed">
                At Oentex, we're committed to democratizing access to high-quality digital services through our comprehensive 
                affiliate marketing platform. Our mission is to create transparent connections between users and vetted service 
                providers across cryptocurrency, digital tools, and financial technology sectors.
              </p>
              <p className="text-textSecondary mb-6 leading-relaxed">
                We believe in the power of informed choice and transparent partnerships. Our platform serves as a trusted bridge, 
                connecting users with the services they need while maintaining complete transparency about our affiliate relationships 
                and commission structures.
              </p>
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 border border-primary/20">
                <p className="text-text font-medium italic">
                  "Building trust through transparency - connecting users with quality services while maintaining complete honesty about our affiliate partnerships."
                </p>
                <p className="text-textSecondary text-sm mt-2">— Alexander Chen, CEO & Founder</p>
              </div>
            </div>
            <div className="relative">
              <ParallaxMission />
            </div>
          </div>
        </div>

        {/* Affiliate Services with Enhanced Parallax */}
        <ParallaxServices services={affiliateServices} />

        {/* Achievements with Parallax */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text mb-4">Platform Recognition</h2>
            <p className="text-textSecondary max-w-2xl mx-auto">
              Our commitment to transparency and quality partnerships has earned recognition from industry leaders and regulatory bodies worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center p-6 bg-surface/50 rounded-2xl border border-border hover:bg-surface/70 transition-all duration-300 parallax-card" data-speed={0.3 + index * 0.1}>
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <achievement.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-text mb-3">{achievement.title}</h3>
                <p className="text-textSecondary text-sm leading-relaxed">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section with Enhanced Parallax */}
        <ParallaxValues values={values} />

        {/* Compliance & Certifications */}
        <div className="bg-surface/30 rounded-3xl p-8 lg:p-12 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-text mb-4">Compliance & Certifications</h2>
            <p className="text-textSecondary max-w-2xl mx-auto">
              We maintain the highest standards of regulatory compliance and security certifications 
              to ensure the safety and protection of our users and their data.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-background/50 rounded-xl p-4 text-center parallax-card" data-speed={0.2 + index * 0.05}>
                <div className="w-8 h-8 bg-gradient-to-r from-success to-primary rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <p className="text-textSecondary text-sm font-medium">{cert}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-textSecondary text-sm mb-4">
              <strong>Important:</strong> All financial and cryptocurrency services are provided by third-party partners. 
              Investments involve risk and may result in loss. Past performance does not guarantee future results. 
              Cryptocurrency investments are particularly volatile and may not be suitable for all investors.
            </p>
            <p className="text-textSecondary text-xs">
              Oentex is committed to maintaining full transparency about affiliate relationships and adhering to all applicable 
              regulations including FTC guidelines for affiliate marketing disclosure.
            </p>
          </div>
        </div>

        {/* Partner Network CTA */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-8 lg:p-12 border border-primary/20">
          <h2 className="text-3xl font-bold text-text mb-4">Explore Our Partner Network</h2>
          <p className="text-textSecondary mb-8 max-w-2xl mx-auto">
            Discover vetted service providers across cryptocurrency, digital tools, and financial technology. 
            All partnerships are clearly disclosed, and we earn commissions from successful referrals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-primary to-primaryHover px-8 py-3 rounded-full text-white font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
              Browse Partners
              <ExternalLink className="w-4 h-4 ml-2" />
            </button>
            <button className="border border-primary text-primary px-8 py-3 rounded-full font-medium hover:bg-primary hover:text-white transition-all duration-300">
              Learn About Partnerships
            </button>
          </div>
          <p className="text-textSecondary text-xs mt-4">
            By using our platform, you acknowledge that we may earn commissions from partner referrals.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About
