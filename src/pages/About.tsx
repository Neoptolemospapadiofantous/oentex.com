import React from 'react'
import { 
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Avatar,
  Divider
} from '@heroui/react'
import { Shield, Users, TrendingUp, Award, Target, Eye, Heart, Star, Search, CheckCircle, ExternalLink, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import AnimatedInnovation from '../components/AnimatedInnovation'
import '../styles/AnimatedInnovation.css'

const About = () => {
  const stats = [
    { icon: Users, value: 'Growing', label: 'User Community', color: 'primary' },
    { icon: Star, value: 'Curated', label: 'Quality Reviews', color: 'warning' },
    { icon: TrendingUp, value: 'High', label: 'User Satisfaction', color: 'success' },
    { icon: Award, value: 'Trusted', label: 'Recommendations', color: 'secondary' }
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
      description: 'We maintain complete transparency about our affiliate relationships and provide honest, unbiased reviews.',
      color: 'primary'
    },
    {
      icon: Eye,
      title: 'User-First Approach',
      description: 'Your success is our priority. We recommend products and services based on quality and value, not just commission rates.',
      color: 'success'
    },
    {
      icon: Target,
      title: 'Quality Standards',
      description: 'We maintain rigorous standards for all products and services we review to ensure you get only the best recommendations.',
      color: 'warning'
    },
    {
      icon: Heart,
      title: 'Community Driven',
      description: 'Our community of users helps us maintain accurate, up-to-date reviews and ratings through their valuable feedback.',
      color: 'secondary'
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
    <motion.div 
      className="min-h-screen pt-20 pb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 via-background to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              About Oentex
            </h1>
            <p className="text-xl text-default-600 max-w-3xl mx-auto">
              Your trusted source for honest reviews, ratings, and the best deals across tech gadgets, 
              software tools, online courses, financial services, and wellness products.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="text-center card-hover">
                <CardBody className="p-6">
                  <Avatar
                    icon={<stat.icon className="w-6 h-6" />}
                    className={`bg-${stat.color} text-${stat.color}-foreground mx-auto mb-4`}
                  />
                  <div className="text-2xl font-bold mb-2">{stat.value}</div>
                  <div className="text-small text-default-600">{stat.label}</div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Mission Section */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-r from-content1 to-content2">
            <CardBody className="p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                  <p className="text-default-600 mb-6 leading-relaxed">
                    At Oentex, we're dedicated to helping you make informed decisions by providing honest, comprehensive 
                    reviews and uncovering the best deals across a wide range of products and services.
                  </p>
                  <p className="text-default-600 mb-6 leading-relaxed">
                    We believe that everyone deserves access to reliable information and great deals. Our team researches, 
                    tests, and reviews products to save you time and money while ensuring you get the best value for your investment.
                  </p>
                  <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
                    <CardBody className="p-6">
                      <p className="font-medium italic mb-2">
                        "Empowering smart decisions through honest reviews and unbeatable deals."
                      </p>
                      <p className="text-default-600 text-small">— Our Core Philosophy</p>
                    </CardBody>
                  </Card>
                </div>
                <div className="relative">
                  <AnimatedInnovation />
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Services */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What We Do</h2>
            <p className="text-default-600 max-w-2xl mx-auto">
              We help you navigate the complex world of products and services by providing clear, honest information and the best deals available.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full card-hover">
                  <CardBody className="p-6">
                    <Avatar
                      icon={<service.icon className="w-6 h-6" />}
                      className="bg-gradient-to-r from-primary to-secondary text-white mb-4"
                    />
                    <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                    <p className="text-default-600 mb-4">{service.description}</p>
                    <div className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-small text-default-600">
                          <CheckCircle className="w-4 h-4 text-success mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
            <p className="text-default-600 max-w-2xl mx-auto">
              We're building a community focused on providing valuable insights and helping users make better decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="text-center card-hover">
                  <CardBody className="p-6">
                    <Avatar
                      icon={<achievement.icon className="w-8 h-8" />}
                      className="bg-gradient-to-r from-primary to-secondary text-white mx-auto mb-4"
                      size="lg"
                    />
                    <h3 className="text-lg font-semibold mb-3">{achievement.title}</h3>
                    <p className="text-default-600 text-small leading-relaxed">{achievement.description}</p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Values */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-default-600 max-w-2xl mx-auto">
              These core values guide everything we do and ensure we always put our users first.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="text-center card-hover h-full">
                  <CardBody className="p-6">
                    <Avatar
                      icon={<value.icon className="w-6 h-6" />}
                      className={`bg-${value.color} text-${value.color}-foreground mx-auto mb-4`}
                    />
                    <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                    <p className="text-default-600 text-small">{value.description}</p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Affiliate Disclosure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="mb-16 bg-warning-50 border-warning-200">
            <CardBody className="p-6">
              <div className="flex items-start space-x-4">
                <AlertCircle className="w-6 h-6 text-warning flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Transparency Disclosure</h3>
                  <p className="text-default-600 leading-relaxed mb-3">
                    <strong>We believe in complete transparency.</strong> Some of the links on our website are affiliate links, 
                    which means we may earn a commission if you make a purchase through them. This comes at no additional cost to you 
                    and helps us maintain our free service.
                  </p>
                  <p className="text-default-600 text-small">
                    Our reviews and recommendations are always honest and based on thorough research, regardless of affiliate partnerships. 
                    We only recommend products and services we believe provide genuine value to our users.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
            <CardBody className="text-center p-8 lg:p-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Discover Great Deals?</h2>
              <p className="text-default-600 mb-8 max-w-2xl mx-auto">
                Join smart shoppers who trust our reviews and discover amazing deals across all categories.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  as="a"
                  href="/deals"
                  color="primary"
                  size="lg"
                  endContent={<ExternalLink className="w-4 h-4" />}
                >
                  Browse Deals
                </Button>
                <Button 
                  as="a"
                  href="/contact"
                  variant="bordered"
                  size="lg"
                >
                  Contact Us
                </Button>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default About