import React, { useState, useEffect } from 'react'
import { ExternalLink, Star, Clock, Gift, Search, Filter } from 'lucide-react'
import { supabase, Deal } from '../lib/supabase'
import toast from 'react-hot-toast'

const Deals = () => {
  const [deals, setDeals] = useState<Deal[]>([])
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('rating')

  useEffect(() => {
    fetchDeals()
  }, [])

  useEffect(() => {
    filterAndSortDeals()
  }, [deals, searchTerm, selectedCategory, sortBy])

  const fetchDeals = async () => {
    try {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) throw error
      setDeals(data || [])
    } catch (error) {
      console.error('Error fetching deals:', error)
      toast.error('Failed to load deals')
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortDeals = () => {
    let filtered = deals

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(deal =>
        deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.merchant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(deal => deal.category === selectedCategory)
    }

    // Sort deals
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'merchant':
          return a.merchant_name.localeCompare(b.merchant_name)
        default:
          return 0
      }
    })

    setFilteredDeals(filtered)
  }

  const categories = [
    { value: 'all', label: 'All Deals' },
    { value: 'crypto', label: 'Cryptocurrency' },
    { value: 'stocks', label: 'Stocks' },
    { value: 'forex', label: 'Forex' }
  ]

  const sortOptions = [
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' },
    { value: 'merchant', label: 'Merchant A-Z' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-textSecondary">Loading exclusive deals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Exclusive Trading Deals
            </span>
          </h1>
          <p className="text-xl text-textSecondary max-w-3xl mx-auto">
            Get the best trading bonuses and exclusive offers from top cryptocurrency and stock trading platforms.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-surface/50 rounded-2xl p-6 border border-border mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textSecondary" />
              <input
                type="text"
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-text placeholder-textSecondary focus:outline-none focus:border-primary"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textSecondary" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-text focus:outline-none focus:border-primary appearance-none"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text focus:outline-none focus:border-primary appearance-none"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-textSecondary">
            Showing {filteredDeals.length} of {deals.length} deals
          </p>
        </div>

        {/* Deals Grid */}
        {filteredDeals.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-surface/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-12 h-12 text-textSecondary" />
            </div>
            <h3 className="text-xl font-semibold text-text mb-2">No deals found</h3>
            <p className="text-textSecondary">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredDeals.map((deal) => (
              <div key={deal.id} className="relative bg-surface/50 rounded-3xl p-8 border border-border hover:bg-surface/70 transition-all duration-300 group">
                {deal.end_date && new Date(deal.end_date) > new Date() && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-accent to-primary px-4 py-2 rounded-full text-white text-sm font-medium flex items-center animate-pulse">
                    <Clock className="w-4 h-4 mr-1" />
                    Limited Time
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-text mb-2">{deal.merchant_name}</h3>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center mr-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(deal.rating) ? 'text-warning fill-current' : 'text-textSecondary'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-textSecondary text-sm">{deal.rating}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-gradient-to-r from-primary to-secondary px-4 py-2 rounded-full text-white font-semibold text-sm">
                      {deal.bonus_amount}
                    </div>
                    <div className="text-xs text-textSecondary mt-1 capitalize">{deal.category}</div>
                  </div>
                </div>

                <h4 className="text-xl font-semibold text-text mb-3">{deal.title}</h4>
                <p className="text-textSecondary mb-6 leading-relaxed">{deal.description}</p>

                {deal.features && deal.features.length > 0 && (
                  <div className="mb-6">
                    <h5 className="text-text font-medium mb-3 flex items-center">
                      <Gift className="w-4 h-4 mr-2" />
                      Key Features
                    </h5>
                    <ul className="space-y-2">
                      {deal.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-textSecondary text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {deal.terms && (
                  <div className="mb-6 p-4 bg-background/50 rounded-xl">
                    <h5 className="text-text font-medium mb-2">Terms & Conditions</h5>
                    <p className="text-textSecondary text-sm">{deal.terms}</p>
                  </div>
                )}

                <a
                  href={deal.tracking_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-primary to-secondary px-6 py-4 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center"
                >
                  Claim Deal
                  <ExternalLink className="w-5 h-5 ml-2" />
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-16 p-6 bg-surface/30 rounded-2xl border border-border">
          <h3 className="text-lg font-semibold text-text mb-3">Important Disclaimer</h3>
          <p className="text-textSecondary text-sm leading-relaxed">
            Trading cryptocurrencies and stocks involves substantial risk and may not be suitable for all investors. 
            Past performance does not guarantee future results. Please consider your investment objectives and risk tolerance 
            before trading. The bonuses and offers mentioned are subject to the terms and conditions of each platform. 
            CryptoVault may receive compensation for referrals.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Deals