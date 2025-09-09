// src/components/deals/DealsList.tsx
import React from 'react'
import { Icons } from '../icons'
import { DealCard } from './DealCard'
import { DealWithRating } from '../../types/deals'

interface DealsListProps {
  deals: DealWithRating[]
  onRateClick: (deal: DealWithRating) => void
  onTrackClick: (deal: DealWithRating) => void
  searchTerm: string
  selectedCategory: string
}

export const DealsList: React.FC<DealsListProps> = React.memo(({
  deals,
  onRateClick,
  onTrackClick,
  searchTerm,
  selectedCategory
}) => {
  if (deals.length === 0) {
    return (
      <div className="text-center py-12">
        <Icons.gift className="w-16 h-16 text-textSecondary mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-text mb-2">No deals found</h3>
        <p className="text-textSecondary">
          {searchTerm || selectedCategory !== 'all' 
            ? 'Try adjusting your search or filters'
            : 'No deals are currently available. Check back soon!'
          }
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {deals.map((deal) => (
        <DealCard
          key={deal.id}
          deal={deal}
          onRateClick={onRateClick}
          onTrackClick={onTrackClick}
        />
      ))}
    </div>
  )
})

DealsList.displayName = 'DealsList'