import React from 'react'
import { Shield, Users, TrendingUp, Award, Target, Eye, Heart, Star, Search, CheckCircle, ExternalLink, AlertCircle } from 'lucide-react'
import AnimatedInnovation from '../components/AnimatedInnovation'
import '../styles/AnimatedInnovation.css'

const About = () => {
  const stats = [
    { icon: Users, value: 'Growing', label: 'User Community' },
    { icon: Star, value: 'Curated', label: 'Quality Reviews' },
    { icon: TrendingUp, value: 'High', label: 'User Satisfaction' },
    { icon: Award, value: 'Trusted', label: 'Recommendations' }
  ]

  const services = [
    {
      icon: Star,
      title: 'Product Reviews & Ratings',
      description: 'We provide comprehensive reviews and ratings for trading platforms, software tools, courses, and services to help you make informed decisions.',
      features: ['Detailed Reviews', 'User Ratings', 'Pros & Cons Analysis', 'Expert Insights']
    },
    {
      icon: Search,
      title: 'Deal Discovery',
      description: 'Find the best deals, discounts, and exclusive offers across multiple categories including tech, finance, education, and wellness.',
      features: ['Curated Deals', 'Price Comparisons', 'Exclusive Discounts', 'Deal Alerts']
    },
    {
      icon: TrendingUp,
      title: 'Platform Comparisons',
      description: 'Compare features, pricing, and user experiences across different platforms to find the perfect solution for your needs.',
      features: ['Side-by-Side Comparisons', 'Feature Analysis', 'Pricing Breakdown', 'User Feedback']
    },
    {
      icon: CheckCircle,
      title: 'Verified Information',
      description: 'All our reviews and recommendations are based on thorough research, user feedback, and real-world testing.',
      features: ['Fact-Checked Content', 'Regular Updates', 'User Verification', 'Quality Assurance']
    }
  ]

  const values = [
    {
      icon: Shield,
      title: 'Trust & Transparency',
      description: 'We maintain complete transparency about our affiliate relationships and provide honest, unbiased reviews.'
    },
    {
      icon: Eye,
      title: 'User-First Approach',
      description: 'Your success is our priority. We recommend products and services based on quality and value, not just commission rates.'
    },
    {
      icon: Target,
      title: 'Quality Standards',
      description: 'We maintain rigorous standards for all products and services we review to ensure you get only the best recommendations.'
    },
    {
      icon: Heart,
      title: 'Community Driven',
      description: 'Our community of users helps us maintain accurate, up-to-date reviews and ratings through their valuable feedback.'
    }
  ]

  const achievements = [
    {
      icon: Star,
      title: 'Quality Reviews',
      description: 'Comprehensive reviews across tech gadgets, software tools, online courses, and financial services with detailed analysis.'
    },
    {
      icon: Users,
      title: 'Growing Community',
      description: 'Building a community of users who trust our recommendations and share their experiences to help others.'
    },
    {
      icon: TrendingUp,
      title: 'User-Focused',
      description: 'Consistently prioritizing user needs and feedback to improve our recommendations and user experience.'
    }
  ]

  return (
    <div className="min-h-screen pt-20 pb-12">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-text mb-6">
            About Oentex
          </h1>
          <p className="text-xl text-textSecondary max-w-3xl mx-auto">
            Your trusted source for honest reviews, ratings, and the best deals across tech gadgets, 
            software tools, online courses, financial services, and wellness products.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
                At Oentex, we're dedicated to helping you make informed decisions by providing honest, comprehensive 
                reviews and uncovering the best deals across a wide range of products and services.
              </p>
              <p className="text-textSecondary mb-6 leading-relaxed">
                We believe that everyone deserves access to reliable information and great deals. Our team researches, 
                tests, and reviews products to save you time and money while ensuring you get the best value for your investment.
              </p>
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 border border-primary/20">
                <p className="text-text font-medium italic">
                  "Empowering smart decisions through honest reviews and unbeatable deals."
                </p>
                <p className="text-textSecondary text-sm mt-2">— Our Core Philosophy</p>
              </div>
            </div>
            <div className="relative">
              <AnimatedInnovation />
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text mb-4">What We Do</h2>
            <p className="text-textSecondary max-w-2xl mx-auto">
              We help you navigate the complex world of products and services by providing clear, honest information and the best deals available.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-surface/50 rounded-2xl p-6 border border-border hover:bg-surface/70 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-text mb-3">{service.title}</h3>
                <p className="text-textSecondary mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-textSecondary">
                      <CheckCircle className="w-4 h-4 text-secondary mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text mb-4">Our Impact</h2>
            <p className="text-textSecondary max-w-2xl mx-auto">
              We're building a community focused on providing valuable insights and helping users make better decisions.
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

        {/* Values */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text mb-4">Our Values</h2>
            <p className="text-textSecondary max-w-2xl mx-auto">
              These core values guide everything we do and ensure we always put our users first.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 bg-surface/50 rounded-2xl border border-border hover:bg-surface/70 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-text mb-2">{value.title}</h3>
                <p className="text-textSecondary text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Affiliate Disclosure */}
        <div className="bg-gradient-to-r from-warning/10 to-accent/10 border border-warning/30 rounded-2xl p-6 mb-16">
          <div className="flex items-start space-x-4">
            <AlertCircle className="w-6 h-6 text-warning flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-text mb-2">Transparency Disclosure</h3>
              <p className="text-textSecondary leading-relaxed mb-3">
                <strong>We believe in complete transparency.</strong> Some of the links on our website are affiliate links, 
                which means we may earn a commission if you make a purchase through them. This comes at no additional cost to you 
                and helps us maintain our free service.
              </p>
              <p className="text-textSecondary text-sm">
                Our reviews and recommendations are always honest and based on thorough research, regardless of affiliate partnerships. 
                We only recommend products and services we believe provide genuine value to our users.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-8 lg:p-12 border border-primary/20">
          <h2 className="text-3xl font-bold text-text mb-4">Ready to Discover Great Deals?</h2>
          <p className="text-textSecondary mb-8 max-w-2xl mx-auto">
            Join smart shoppers who trust our reviews and discover amazing deals across all categories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/deals'}
              className="bg-gradient-to-r from-primary to-primaryHover px-8 py-3 rounded-full text-white font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              Browse Deals
              <ExternalLink className="w-4 h-4 ml-2" />
            </button>
            <button 
              onClick={() => window.location.href = '/contact'}
              className="border border-primary text-primary px-8 py-3 rounded-full font-medium hover:bg-primary hover:text-white transition-all duration-300"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About