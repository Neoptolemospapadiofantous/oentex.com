import React from 'react'
import { 
  Card,
  CardBody,
  Button,
  Chip,
  Avatar
} from '@heroui/react'
import { ArrowRight, Star, Gift, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const CTA = () => {
  const navigate = useNavigate()
  const [binanceData, setBinanceData] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchBinanceData = async () => {
      try {
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
    window.open(binanceDeal.affiliate_link, '_blank')
  }

  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 via-background to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="glass border-primary-200">
            <CardBody className="p-8 lg:p-12">
              <div className="text-center">
                <Chip
                  startContent={<Gift className="w-4 h-4" />}
                  color="primary"
                  variant="flat"
                  className="mb-6"
                >
                  {isLoading ? 'Loading...' : 'Exclusive Binance Deal'}
                </Chip>
                
                <h2 className="text-4xl lg:text-6xl font-bold mb-6">
                  Save on Trading Fees
                  <br />
                  <span className="gradient-text">
                    20% Discount
                  </span>
                </h2>
                
                <p className="text-xl text-default-600 mb-8 max-w-3xl mx-auto">
                  {isLoading ? (
                    'Loading Binance deal details...'
                  ) : (
                    `Join ${binanceDeal.reviews.toLocaleString()} traders who rated Binance ${binanceDeal.rating}/5 stars. Get exclusive 20% off trading fees for new users.`
                  )}
                </p>

                {/* Binance Deal Card */}
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="max-w-2xl mx-auto mb-8 card-hover">
                    <CardBody className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Chip
                            color="primary"
                            variant="flat"
                            size="sm"
                            className="capitalize"
                          >
                            {binanceDeal.deal_type}
                          </Chip>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-warning fill-current" />
                            <span className="text-small text-default-600 ml-1">
                              {binanceDeal.rating} ({binanceDeal.reviews.toLocaleString()} reviews)
                            </span>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-success">
                          {binanceDeal.value}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2">
                        {binanceDeal.title}
                      </h3>
                      
                      <p className="text-default-600 mb-4">
                        {binanceDeal.description}
                      </p>
                      
                      <div className="text-center">
                        <span className="text-small text-default-600">
                          Trusted by {binanceDeal.reviews.toLocaleString()}+ users worldwide
                        </span>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>

                {/* Main CTA Button */}
                <div className="mb-8">
                  <Button 
                    color="primary"
                    size="lg"
                    className="font-bold text-xl px-12 py-6"
                    startContent={<ExternalLink className="w-6 h-6" />}
                    endContent={<ArrowRight className="w-6 h-6" />}
                    onPress={handleMainAction}
                  >
                    Get Binance Deal Now
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-small text-default-500 mb-2">
                    * 20% fee discount valid for 30 days. New verified users only.
                  </p>
                  <Button
                    variant="light"
                    color="primary"
                    size="sm"
                    onPress={() => navigate('/deals')}
                  >
                    Browse all deals instead
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

export default CTA