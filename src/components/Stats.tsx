import React from 'react'
import { Icons } from './icons'
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

        // Calculate average rating from companies (weighted by reviews)
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
            icon: Icons.arrowTrendingUp,
            value: totalCompanies > 0 ? `${totalCompanies}` : '0',
            label: 'Products Reviewed',
            description: `Across ${new Set(companies.map(c => c.category)).size} categories`
          },
          {
            icon: Icons.users,
            value: totalReviews > 0 ? `${totalReviews.toLocaleString()}` : '0',
            label: 'Verified Reviews',
            description: avgRating > 0 ? `${avgRating.toFixed(1)}/5 average rating` : 'No ratings yet'
          },
          {
            icon: Icons.shield,
            value: overallSatisfaction > 0 ? `${Math.round(overallSatisfaction)}%` : '0%',
            label: 'User Satisfaction',
            description: overallSatisfaction > 0 ? 'Users trust our recommendations' : 'Building trust with users'
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
      <section className="py-20 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((index) => (
              <div key={index} className="text-center animate-pulse">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-2xl mb-4"></div>
                <div className="h-10 bg-gray-200 rounded mb-2 w-24 mx-auto"></div>
                <div className="h-6 bg-gray-200 rounded mb-1 w-32 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-40 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4">
              <Icons.shield className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Statistics</h3>
            <p className="text-gray-600 mb-4">We're having trouble connecting to our database.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center group hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl mb-4 group-hover:shadow-lg group-hover:shadow-primary/25">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-text mb-2">{stat.value}</div>
              <div className="text-lg font-semibold text-text mb-1">{stat.label}</div>
              <div className="text-sm text-textSecondary">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stats