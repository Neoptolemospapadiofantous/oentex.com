// src/components/deals/DealsStats.tsx
import React from 'react'

interface DealsStatsProps {
  filteredDealsCount: number
  totalDealsCount: number
  companiesCount: number
  averageRating: number
  totalClaims: number
}

export const DealsStats: React.FC<DealsStatsProps> = React.memo(({
  filteredDealsCount,
  totalDealsCount,
  companiesCount,
  averageRating,
  totalClaims
}) => {
  return (
    <div className="mt-16 bg-surface border border-border rounded-xl p-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
        <div>
          <div className="text-3xl font-bold text-primary mb-2">{filteredDealsCount}</div>
          <div className="text-textSecondary">Active Deals</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-primary mb-2">{companiesCount}</div>
          <div className="text-textSecondary">Trading Platforms</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-primary mb-2">{averageRating}</div>
          <div className="text-textSecondary">Average Rating</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-primary mb-2">{totalClaims}</div>
          <div className="text-textSecondary">Total Claims</div>
        </div>
      </div>
    </div>
  )
})

DealsStats.displayName = 'DealsStats'