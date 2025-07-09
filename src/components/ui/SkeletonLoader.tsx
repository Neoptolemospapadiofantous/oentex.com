// src/components/ui/SkeletonLoader.tsx
import React from 'react'

interface SkeletonProps {
  className?: string
  width?: string
  height?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', width, height }) => {
  return (
    <div 
      className={`animate-pulse bg-gray-300 rounded ${className}`}
      style={{ width, height }}
    />
  )
}

export const DealCardSkeleton: React.FC = () => (
  <div className="bg-surface border border-border rounded-xl p-6 animate-pulse">
    <div className="flex items-center space-x-3 mb-4">
      <Skeleton className="w-10 h-10 rounded-lg" />
      <div className="flex-1">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    
    <Skeleton className="h-6 w-full mb-2" />
    <Skeleton className="h-4 w-full mb-1" />
    <Skeleton className="h-4 w-2/3 mb-4" />
    
    <div className="bg-gray-100 rounded-lg p-3 mb-4">
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-3 w-3/4" />
    </div>
    
    <div className="flex space-x-3">
      <Skeleton className="flex-1 h-12 rounded-lg" />
      <Skeleton className="w-12 h-12 rounded-lg" />
    </div>
  </div>
)

export const DealsSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[...Array(6)].map((_, i) => (
      <DealCardSkeleton key={i} />
    ))}
  </div>
)