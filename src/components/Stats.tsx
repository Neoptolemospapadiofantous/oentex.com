import React from 'react'
import { 
  Card,
  CardBody,
  Avatar,
  Spinner
} from '@heroui/react'
import { TrendingUp, Users, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

const Stats = () => {
  const [stats, setStats] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    const fetchStatsData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const { data: companies, error: companiesError } = await supabase
          .from('trading_companies')
          .select('id, name, overall_rating, total_reviews, category, status')
          .eq('status', 'active')

        if (companiesError) throw companiesError

        const { data: ratings, error: ratingsError } = await supabase
          .from('ratings')
          .select('id, overall_rating, platform_usability, customer_support, fees_commissions, security_trust, educational_resources, mobile_app')

        if (ratingsError) throw ratingsError

        if (!companies || !ratings) {
          throw new Error('No data received from database')
        }

        const totalCompanies = companies.length
        const totalReviews = companies.reduce((sum, company) => {
          const reviews = company.total_reviews
          return sum + (typeof reviews === 'number' && reviews > 0 ? reviews : 0)
        }, 0)

        let avgRating = 0
        let totalWeightedRating = 0
        let totalRatingWeight = 0
        
        companies.forEach(company => {
          const rating = company.overall_rating
          const reviewCount = company.total_reviews || 0
          
          if (typeof rating === 'number' && rating > 0 && rating <= 5 && reviewCount > 0) {
            totalWeightedRating += rating * reviewCount
            totalRatingWeight += reviewCount
          }
        })
        
        if (totalRatingWeight > 0) {
          avgRating = totalWeightedRating / totalRatingWeight
        }

        const categoryRatings = [
          'platform_usability', 'customer_support', 'fees_commissions', 
          'security_trust', 'educational_resources', 'mobile_app'
        ]
        
        const categoryAverages = categoryRatings.map(category => {
          const values = ratings
            .map(r => r[category])
            .filter(value => typeof value === 'number' && value > 0 && value <= 5)
          
          return values.length > 0 
            ? values.reduce((a, b) => a + b, 0) / values.length 
            : 0
        }).filter(avg => avg > 0)
        
        let overallSatisfaction = 0
        
        if (categoryAverages.length > 0) {
          const avgCategoryRating = categoryAverages.reduce((a, b) => a + b, 0) / categoryAverages.length
          overallSatisfaction = (avgCategoryRating / 5) * 100
        } else if (avgRating > 0) {
          overallSatisfaction = (avgRating / 5) * 100
        } else {
          overallSatisfaction = 0
        }

        const dynamicStats = [
          {
            icon: TrendingUp,
            value: totalCompanies > 0 ? `${totalCompanies}` : '0',
            label: 'Products Reviewed',
            description: `Across ${new Set(companies.map(c => c.category)).size} categories`,
            color: 'primary'
          },
          {
            icon: Users,
            value: totalReviews > 0 ? `${totalReviews.toLocaleString()}` : '0',
            label: 'Verified Reviews',
            description: avgRating > 0 ? `${avgRating.toFixed(1)}/5 average rating` : 'No ratings yet',
            color: 'success'
          },
          {
            icon: Shield,
            value: overallSatisfaction > 0 ? `${Math.round(overallSatisfaction)}%` : '0%',
            label: 'User Satisfaction',
            description: overallSatisfaction > 0 ? 'Users trust our recommendations' : 'Building trust with users',
            color: 'warning'
          }
        ]

        setStats(dynamicStats)
      } catch (err) {
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStatsData()
  }, [])

  if (isLoading) {
    return (
      <section className="py-20 bg-content1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((index) => (
              <Card key={index}>
                <CardBody className="text-center p-6">
                  <div className="space-y-3">
                    <div className="skeleton w-16 h-16 rounded-full mx-auto" />
                    <div className="skeleton h-8 w-24 mx-auto" />
                    <div className="skeleton h-4 w-32 mx-auto" />
                    <div className="skeleton h-3 w-40 mx-auto" />
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-content1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardBody className="text-center p-6">
              <Avatar
                icon={<Shield className="w-8 h-8" />}
                className="bg-danger text-danger-foreground mx-auto mb-4"
                size="lg"
              />
              <h3 className="text-lg font-semibold mb-2">Unable to Load Statistics</h3>
              <p className="text-default-600 mb-4">We're having trouble connecting to our database.</p>
            </CardBody>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-content1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                    icon={<stat.icon className="w-8 h-8" />}
                    className={`bg-${stat.color} text-${stat.color}-foreground mx-auto mb-4`}
                    size="lg"
                  />
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-lg font-semibold mb-1">{stat.label}</div>
                  <div className="text-small text-default-600">{stat.description}</div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stats