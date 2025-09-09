// src/components/deals/DealsFilters.tsx
import React from 'react'
import { Icons } from '../icons'

interface DealsFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
}

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'crypto_exchange', label: 'Crypto Exchange' },
  { value: 'stock_broker', label: 'Stock Broker' },
  { value: 'forex_broker', label: 'Forex Broker' },
  { value: 'multi_asset', label: 'Multi Asset' },
  { value: 'bonus', label: 'Bonus Offers' },
  { value: 'discount', label: 'Discounts' },
  { value: 'free_trial', label: 'Free Trials' },
  { value: 'cashback', label: 'Cashback' },
  { value: 'promotion', label: 'Promotions' },
]

const sortOptions = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
  { value: 'name', label: 'Name A-Z' },
]

export const DealsFilters: React.FC<DealsFiltersProps> = React.memo(({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy
}) => {
  return (
    <div className="bg-surface border border-border rounded-xl p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary w-5 h-5" />
          <input
            type="text"
            placeholder="Search deals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-text"
          />
        </div>

        <div className="relative">
          <Icons.filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary w-5 h-5" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-text appearance-none"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-text appearance-none"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
})

DealsFilters.displayName = 'DealsFilters'