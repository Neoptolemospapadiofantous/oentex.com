// src/components/CTA.tsx - Refactored with Page Structure
import React from 'react'
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
    <section className="page-section relative overflow-hidden section-py-2xl section-transition component-fade-in">
      
      <div className="container-page relative z-10">
        {/* Main CTA Container */}
        <div className="content-full">
          <div className="glass rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-700 hover:scale-[1.02] hover:shadow-3xl border-border animate-scale-in">
            
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-3xl"></div>
            
            <div className="relative z-10 p-8 lg:p-12">
              <div className="flex-col-center text-center">
                
                {/* Header Badge */}
                <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/20 text-primary container-px-lg container-py-sm rounded-full text-sm font-semibold mb-8 glass transform transition-all duration-500 hover:scale-105 hover:bg-primary/15 hover:border-primary/30 animate-fade-in-up">
                  <Icons.gift className="w-5 h-5 animate-bounce" style={{ animationDuration: '2s' }} />
                  {isLoading ? (
                    <div className="h-5 w-32 bg-primary/20 rounded animate-pulse" />
                  ) : (
                    'Exclusive Binance Deal'
                  )}
                </div>
                
                {/* Main Heading */}
                <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-text mb-8 leading-tight">
                  <span className="block transform transition-all duration-700 hover:scale-105">
                    Save on Trading Fees
                  </span>
                  <br />
                  <span className="gradient-text animate-gradient-x transform transition-all duration-700 hover:scale-110 inline-block">
                    20% Discount
                  </span>
                </h2>
                
                {/* Description */}
                <div className="content-wide">
                  <div className="text-xl text-textSecondary mb-12 leading-relaxed">
                    {isLoading ? (
                      <div className="space-y-3">
                        <div className="h-6 w-full bg-default-200 rounded animate-pulse" />
                        <div className="h-6 w-3/4 mx-auto bg-default-200 rounded animate-pulse" />
                      </div>
                    ) : (
                      <p>
                        Join {binanceDeal.reviews.toLocaleString()} traders who rated Binance {binanceDeal.rating}/5 stars. Get exclusive 20% off trading fees for new users.
                      </p>
                    )}
                  </div>
                </div>

                {/* Deal Card */}
                <div className="mb-12 content-wide">
                  <div className="card-feature hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:scale-[1.02] transform group relative overflow-hidden">
                    
                    <div className="flex-between mb-6 gap-4 flex-col sm:flex-row">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="bg-primary/10 border border-primary/20 text-primary container-px-md container-py-sm rounded-full text-sm font-semibold capitalize">
                          {binanceDeal.deal_type}
                        </span>
                        <div className="flex-center gap-2">
                          <Icons.star className="w-5 h-5 text-warning fill-current" />
                          <span className="text-sm text-textSecondary font-medium">
                            {binanceDeal.rating} ({binanceDeal.reviews.toLocaleString()} reviews)
                          </span>
                        </div>
                      </div>
                      <div className="text-3xl font-bold gradient-text">
                        {binanceDeal.value}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-text mb-4">
                      {binanceDeal.title}
                    </h3>
                    
                    <p className="text-textSecondary mb-6 leading-relaxed">
                      {binanceDeal.description}
                    </p>
                    
                    <div className="flex-center gap-2 text-sm text-textSecondary">
                      <Icons.users className="w-4 h-4" />
                      <span>Trusted by {binanceDeal.reviews.toLocaleString()}+ users worldwide</span>
                    </div>
                    
                    {/* Animated Background Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  </div>
                </div>

                {/* Main Action Button */}
                <div className="my-2xl">
                  <button 
                    onClick={handleMainAction}
                    className="btn-primary text-xl container-px-2xl container-py-lg group relative overflow-hidden transform hover:scale-110 hover:rotate-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <div className="flex-center gap-4 relative z-10">
                      <Icons.externalLink className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                      <span>Get Binance Deal Now</span>
                      <Icons.arrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                    
                    {/* Pulsing Ring Effect */}
                    <div className="absolute inset-0 border-2 border-white/30 rounded-2xl opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 animate-pulse-glow"></div>
                  </button>
                </div>

                {/* Footer */}
                <div className="flex-col-center space-y-4 mt-xl">
                  <p className="text-sm text-textSecondary glass border border-border rounded-full container-px-lg container-py-sm">
                    * 20% fee discount valid for 30 days. New verified users only.
                  </p>
                  <button
                    onClick={() => navigate('/deals')}
                    className="text-primary hover:text-primary/80 underline text-sm font-medium transition-colors hover:bg-primary/5 container-px-md container-py-sm rounded-lg"
                  >
                    Browse all deals instead
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA