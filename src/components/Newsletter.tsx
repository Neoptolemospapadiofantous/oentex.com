// src/components/Newsletter.tsx - Refactored with Page Structure
import React, { useState, useMemo } from 'react'
import { Icons } from './icons'
import { supabase } from '../lib/supabase'
import { showErrorToast, showSuccessToast } from './ui/AppToast'

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
      showErrorToast('Please enter your email address')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      showErrorToast('Please enter a valid email address')
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
          showErrorToast('This email is already subscribed to our newsletter')
        } else if (error.message?.includes('400')) {
          showErrorToast('Invalid email address format')
        } else if (error.message?.includes('500')) {
          showErrorToast('Server error - please try again later')
        } else {
          showErrorToast('Failed to subscribe. Please try again later.')
        }
        return
      }

      if (data?.success) {
        showSuccessToast(data.message || 'Successfully subscribed!')
        setEmail('')
      } else {
        showErrorToast('Failed to subscribe. Please try again later.')
      }
      
    } catch (error) {
      showErrorToast('Failed to subscribe. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="page-section relative section-py-2xl section-transition component-fade-in">
      
      <div className="container-page relative z-10">
        <div className="content-wide">
          <div className="card-feature border-border animate-scale-in">
            
            {/* Newsletter Icon */}
            <div className="flex-center my-xl">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex-center">
                <Icons.mail className="w-8 h-8 text-white" />
              </div>
            </div>
            
            {/* Header */}
            <div className="text-center my-xl">
              <h2 className="text-3xl lg:text-4xl font-bold text-text my-lg">
                Stay Ahead of the Trading Game
              </h2>
              
              <div className="content-narrow">
                <p className="text-xl text-textSecondary">
                  Get exclusive trading insights, market analysis, and the latest bonus deals delivered directly to your inbox. 
                  Join thousands of smart traders who never miss an opportunity.
                </p>
              </div>
            </div>

            {/* Newsletter Form */}
            <form onSubmit={handleSubmit} className="content-narrow my-xl">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 container-px-lg container-py-md bg-background border border-border rounded-full text-text placeholder-textSecondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  disabled={isLoading}
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <span className="flex-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Subscribing...
                    </span>
                  ) : 'Subscribe Now'}
                </button>
              </div>
            </form>

            {/* Trust Badge */}
            <div className="flex-center my-xl text-sm text-textSecondary">
              <Icons.success className="w-4 h-4 mr-2 text-green-600" />
              <span>No spam • Exclusive deals • Unsubscribe anytime</span>
            </div>

            {/* Stats Grid */}
            <div className="grid-stats my-xl">
              <div className="text-center">
                <div className="flex-center my-sm">
                  <Icons.users className="w-5 h-5 text-primary mr-2" />
                  <div className="text-2xl font-bold text-text">{stats.subscribers}</div>
                </div>
                <div className="text-textSecondary text-sm">Active Subscribers</div>
              </div>
              
              <div className="text-center">
                <div className="flex-center my-sm">
                  <Icons.arrowTrendingUp className="w-5 h-5 text-secondary mr-2" />
                  <div className="text-2xl font-bold text-text">{stats.deals}</div>
                </div>
                <div className="text-textSecondary text-sm">Market Updates</div>
              </div>
              
              <div className="text-center">
                <div className="flex-center my-sm">
                  <Icons.gift className="w-5 h-5 text-primary mr-2" />
                  <div className="text-2xl font-bold text-text">{stats.exclusive}</div>
                </div>
                <div className="text-textSecondary text-sm">Exclusive Deals</div>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="glass rounded-2xl p-lg border-primary/20">
              <h3 className="text-lg font-semibold text-text my-md text-center">
                What You'll Receive:
              </h3>
              
              <div className="grid md:grid-cols-2 gap-md text-left">
                <div className="flex-start gap-sm">
                  <Icons.success className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-text">Weekly Market Insights</div>
                    <div className="text-sm text-textSecondary">Expert analysis and trading opportunities</div>
                  </div>
                </div>
                
                <div className="flex-start gap-sm">
                  <Icons.success className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-text">Exclusive Bonus Alerts</div>
                    <div className="text-sm text-textSecondary">First access to new platform deals</div>
                  </div>
                </div>
                
                <div className="flex-start gap-sm">
                  <Icons.success className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-text">Platform Reviews</div>
                    <div className="text-sm text-textSecondary">Detailed analysis of new trading platforms</div>
                  </div>
                </div>
                
                <div className="flex-start gap-sm">
                  <Icons.success className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-text">Educational Content</div>
                    <div className="text-sm text-textSecondary">Trading tips and strategy guides</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Newsletter