import React from 'react'
import { ArrowRight, Star, Gift, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const CTA = () => {
  const navigate = useNavigate()
  const [binanceData, setBinanceData] = React.useState(null)
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
    <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl"></div>
          
          <div className="relative bg-surface/50 backdrop-blur-lg rounded-3xl border border-border p-8 lg:p-12">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-6">
                <Gift className="w-4 h-4 text-primary mr-2" />
                <span className="text-sm text-primary font-medium">
                  {isLoading ? 'Loading...' : 'Exclusive Binance Deal'}
                </span>
              </div>
              
              <h2 className="text-4xl lg:text-6xl font-bold text-text mb-6">
                Save on Trading Fees
                <br />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  20% Discount
                </span>
              </h2>
              
              <p className="text-xl text-textSecondary mb-8 max-w-3xl mx-auto">
                {isLoading ? (
                  'Loading Binance deal details...'
                ) : (
                  `Join ${binanceDeal.reviews.toLocaleString()} traders who rated Binance ${binanceDeal.rating}/5 stars. Get exclusive 20% off trading fees for new users.`
                )}
              </p>

              {/* Binance Deal Card */}
              <div className="bg-white rounded-2xl p-6 mb-8 max-w-2xl mx-auto border border-border hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full capitalize">
                      {binanceDeal.deal_type}
                    </span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-textSecondary ml-1">
                        {binanceDeal.rating} ({binanceDeal.reviews.toLocaleString()} reviews)
                      </span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-secondary">
                    {binanceDeal.value}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-text mb-2">
                  {binanceDeal.title}
                </h3>
                
                <p className="text-textSecondary mb-4">
                  {binanceDeal.description}
                </p>
                
                <div className="text-center">
                  <span className="text-sm text-textSecondary">
                    Trusted by {binanceDeal.reviews.toLocaleString()}+ users worldwide
                  </span>
                </div>
              </div>

              {/* Single Main Button */}
              <div className="mb-8">
                <button 
                  onClick={handleMainAction}
                  className="group bg-gradient-to-r from-primary to-secondary px-12 py-5 rounded-full text-white font-bold text-xl hover:shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto"
                >
                  <ExternalLink className="mr-3 w-6 h-6" />
                  Get Binance Deal Now
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-textSecondary mb-2">
                  * 20% fee discount valid for 30 days. New verified users only.
                </p>
                <button 
                  onClick={() => navigate('/deals')}
                  className="text-primary hover:text-primary/80 text-sm font-medium underline"
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