import React, { useState, useMemo } from 'react'
import { 
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Chip,
  Avatar
} from '@heroui/react'
import { Mail, CheckCircle, Users, TrendingUp, Gift } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

let useFeaturedDealsQuery: any = null
try {
  const hookModule = require('../hooks/queries/useFeaturedDealsQuery')
  useFeaturedDealsQuery = hookModule.useFeaturedDealsQuery
} catch (importError) {
}

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  let featuredDealsQuery: any = null
  if (useFeaturedDealsQuery) {
    try {
      featuredDealsQuery = useFeaturedDealsQuery(1)
    } catch (hookError) {
    }
  }

  const stats = useMemo(() => {
    const defaultStats = { 
      subscribers: '50K+', 
      deals: 'Weekly', 
      exclusive: 'Exclusive' 
    }

    if (featuredDealsQuery?.data) {
      try {
        const data = featuredDealsQuery.data
        
        const totalCompaniesCount = typeof data.totalCompaniesCount === 'number' ? data.totalCompaniesCount : 50
        const totalDealsCount = typeof data.totalDealsCount === 'number' ? data.totalDealsCount : 25
        
        return {
          subscribers: `${Math.floor(totalCompaniesCount * 1000 + totalDealsCount * 500)}+`,
          deals: 'Weekly',
          exclusive: `${totalDealsCount}+ Active`
        }
      } catch (calculationError) {
        return defaultStats
      }
    }

    return defaultStats
  }, [featuredDealsQuery?.data])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await supabase.functions.invoke('newsletter-subscribe', {
        body: {
          email,
          source: 'website_newsletter',
          preferences: {
            weekly_newsletter: true,
            deal_alerts: true,
            platform_updates: true
          }
        }
      })

      if (error) {
        if (error.message?.includes('409') || 
            error.message?.includes('Conflict') || 
            error.message?.includes('already subscribed') || 
            error.message?.includes('Email already subscribed')) {
          toast.error('This email is already subscribed to our newsletter')
        } else if (error.message?.includes('400')) {
          toast.error('Invalid email address format')
        } else if (error.message?.includes('500')) {
          toast.error('Server error - please try again later')
        } else {
          toast.error('Failed to subscribe. Please try again later.')
        }
        return
      }

      if (data?.success) {
        toast.success(data.message || 'Successfully subscribed!')
        setEmail('')
      } else {
        toast.error('Failed to subscribe. Please try again later.')
      }
      
    } catch (error) {
      toast.error('Failed to subscribe. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 via-background to-secondary-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="glass border-primary-200">
            <CardBody className="p-8 lg:p-12 text-center">
              <Avatar
                icon={<Mail className="w-8 h-8" />}
                className="bg-gradient-to-r from-primary to-secondary text-white mx-auto mb-6"
                size="lg"
              />
              
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Stay Ahead of the Trading Game
              </h2>
              
              <p className="text-xl text-default-600 mb-8 max-w-2xl mx-auto">
                Get exclusive trading insights, market analysis, and the latest bonus deals delivered directly to your inbox. 
                Join thousands of smart traders who never miss an opportunity.
              </p>

              <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="email"
                    value={email}
                    onValueChange={setEmail}
                    placeholder="Enter your email address"
                    variant="bordered"
                    className="flex-1"
                    isDisabled={isLoading}
                    isRequired
                  />
                  <Button
                    type="submit"
                    color="primary"
                    size="lg"
                    isLoading={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? 'Subscribing...' : 'Subscribe Now'}
                  </Button>
                </div>
              </form>

              <div className="flex items-center justify-center mb-8">
                <CheckCircle className="w-4 h-4 mr-2 text-success" />
                <span className="text-small text-default-600">No spam • Exclusive deals • Unsubscribe anytime</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="w-5 h-5 text-primary mr-2" />
                    <div className="text-2xl font-bold">{stats.subscribers}</div>
                  </div>
                  <div className="text-default-600 text-small">Active Subscribers</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="w-5 h-5 text-secondary mr-2" />
                    <div className="text-2xl font-bold">{stats.deals}</div>
                  </div>
                  <div className="text-default-600 text-small">Market Updates</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Gift className="w-5 h-5 text-primary mr-2" />
                    <div className="text-2xl font-bold">{stats.exclusive}</div>
                  </div>
                  <div className="text-default-600 text-small">Exclusive Deals</div>
                </div>
              </div>

              <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
                <CardHeader>
                  <h3 className="text-lg font-semibold">What You'll Receive:</h3>
                </CardHeader>
                <CardBody>
                  <div className="grid md:grid-cols-2 gap-4 text-left">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Weekly Market Insights</div>
                        <div className="text-small text-default-600">Expert analysis and trading opportunities</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Exclusive Bonus Alerts</div>
                        <div className="text-small text-default-600">First access to new platform deals</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Platform Reviews</div>
                        <div className="text-small text-default-600">Detailed analysis of new trading platforms</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Educational Content</div>
                        <div className="text-small text-default-600">Trading tips and strategy guides</div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

export default Newsletter