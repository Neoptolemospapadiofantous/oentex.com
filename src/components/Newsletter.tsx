import React, { useState } from 'react'
import { Mail, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('email_subscribers')
        .insert([{ email }])

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error('This email is already subscribed')
        } else {
          throw error
        }
      } else {
        toast.success('Successfully subscribed to newsletter!')
        setEmail('')
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      toast.error('Failed to subscribe. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-surface/50 backdrop-blur-lg rounded-3xl p-8 lg:p-12 border border-border">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-text mb-4">
            Stay Ahead of the Market
          </h2>
          
          <p className="text-xl text-textSecondary mb-8 max-w-2xl mx-auto">
            Get exclusive trading insights, market analysis, and the latest deals delivered to your inbox. 
            Join 50,000+ traders who trust our newsletter.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 bg-background border border-border rounded-full text-text placeholder-textSecondary focus:outline-none focus:border-primary transition-colors duration-300"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
          </form>

          <div className="flex items-center justify-center mt-6 text-sm text-textSecondary">
            <CheckCircle className="w-4 h-4 mr-2 text-success" />
            <span>No spam, unsubscribe anytime</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <div className="text-2xl font-bold text-text mb-2">50K+</div>
              <div className="text-textSecondary text-sm">Subscribers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-text mb-2">Weekly</div>
              <div className="text-textSecondary text-sm">Market Updates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-text mb-2">Exclusive</div>
              <div className="text-textSecondary text-sm">Trading Deals</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Newsletter