// src/components/CTA.tsx - Updated with Heroicons
import React from 'react'
// Using regular HTML elements with Tailwind classes instead of HeroUI components
import { Icons } from './icons'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const CTA = () => {
  const navigate = useNavigate()
  const [binanceData, setBinanceData] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchBinanceData = async () => {
      try {
        // Query specifically for Binance
        const { data: binanceCompany, error } = await supabase
          .from('trading_companies')
          .select('name, overall_rating, total_reviews, status')
          .ilike('name', '%binance%')
          .eq('status', 'active')
          .single()

        if (error) {
          console.log('No Binance data found, using default')
        }

        setBinanceData(binanceCompany)
      } catch (err) {
        console.log('Error fetching Binance data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBinanceData()
  }, [])

  // Binance deal data
  const binanceDeal = {
    title: "Welcome Bonus: 20% Trading Fee Discount",
    description: "Get 20% off all trading fees for your first 30 days. Valid for new users only. Must complete verification within 7 days.",
    deal_type: "discount",
    value: "20% Fee Discount",
    company_name: "Binance",
    rating: binanceData?.overall_rating || 4.6,
    reviews: binanceData?.total_reviews || 1250,
    affiliate_link: "https://www.binance.com/en/register?ref=welcome20"
  }

  const handleMainAction = () => {
    // Option 1: Go directly to Binance deal
    window.open(binanceDeal.affiliate_link, '_blank')
    
    // Option 2: Go to deals page instead
    // navigate('/deals')
  }

  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/5 to-warning/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-background/50 backdrop-blur-lg shadow-2xl rounded-2xl">
          <div className="p-8 lg:p-12">
            <div className="text-center">
              {/* Header Chip */}
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Icons.gift className="w-4 h-4" />
                {isLoading ? (
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                ) : (
                  'Exclusive Binance Deal'
                )}
              </div>
              
              {/* Main Heading */}
              <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
                Save on Trading Fees
                <br />
                <span className="text-gradient">
                  20% Discount
                </span>
              </h2>
              
              {/* Description */}
              <div className="text-xl text-foreground/70 mb-8 max-w-3xl mx-auto">
                {isLoading ? (
                  <div className="space-y-2">
                    <div className="h-6 w-full bg-gray-200 rounded animate-pulse" />
                    <div className="h-6 w-3/4 mx-auto bg-gray-200 rounded animate-pulse" />
                  </div>
                ) : (
                  <p>
                    Join {binanceDeal.reviews.toLocaleString()} traders who rated Binance {binanceDeal.rating}/5 stars. Get exclusive 20% off trading fees for new users.
                  </p>
                )}
              </div>

              {/* Binance Deal Card */}
              <div className="mb-8 max-w-2xl mx-auto hover:shadow-lg transition-shadow bg-white rounded-xl border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium capitalize">
                        {binanceDeal.deal_type}
                      </span>
                      <div className="flex items-center">
                        <Icons.star className="w-4 h-4 text-warning fill-current" />
                        <span className="text-sm text-foreground/70 ml-1">
                          {binanceDeal.rating} ({binanceDeal.reviews.toLocaleString()} reviews)
                        </span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-secondary">
                      {binanceDeal.value}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {binanceDeal.title}
                  </h3>
                  
                  <p className="text-foreground/70 mb-4">
                    {binanceDeal.description}
                  </p>
                  
                  <div className="text-center">
                    <span className="text-sm text-foreground/70">
                      Trusted by {binanceDeal.reviews.toLocaleString()}+ users worldwide
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Action Button */}
              <div className="mb-8">
                <button 
                  onClick={handleMainAction}
                  className="px-12 py-6 text-xl font-bold bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto"
                >
                  <Icons.externalLink className="w-6 h-6" />
                  Get Binance Deal Now
                  <Icons.arrowRight className="w-6 h-6" />
                </button>
              </div>

              {/* Footer */}
              <div className="text-center space-y-2">
                <p className="text-sm text-foreground/70">
                  * 20% fee discount valid for 30 days. New verified users only.
                </p>
                <button
                  onClick={() => navigate('/deals')}
                  className="text-primary hover:text-primary/80 underline text-sm font-medium transition-colors"
                >
                  Browse all deals instead
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA