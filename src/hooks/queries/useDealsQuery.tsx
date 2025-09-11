// src/hooks/queries/useCategoriesQuery.ts - FIXED VERSION WITH NO ICONS
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

// Simple icon component that returns emoji
const IconComponent = ({ emoji }: { emoji: string }) => <span className="text-lg">{emoji}</span>

// Create icon components using emojis
const GiftIcon = () => <IconComponent emoji="🎁" />
const BoltIcon = () => <IconComponent emoji="⚡" />
const BuildingIcon = () => <IconComponent emoji="🏢" />
const StarIcon = () => <IconComponent emoji="⭐" />
const ChartIcon = () => <IconComponent emoji="📊" />
const ShieldIcon = () => <IconComponent emoji="🛡️" />
const SmartphoneIcon = () => <IconComponent emoji="📱" />

const ICON_MAP = {
  gift: GiftIcon,
  zap: BoltIcon,
  building: BuildingIcon,
  star: StarIcon,
  trending_up: ChartIcon,
  bar_chart: ChartIcon,
  shield: ShieldIcon,
  smartphone: SmartphoneIcon,
} as const

interface DatabaseCategory {
  id: string
  value: string
  label: string
  icon_name: string
  description?: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

interface ProcessedCategory {
  value: string
  label: string
  icon: React.ComponentType<any>
  description?: string
}

// Fallback categories with emoji icons
const DEFAULT_CATEGORIES: ProcessedCategory[] = [
  {
    value: 'crypto_exchange',
    label: 'Crypto Exchanges',
    icon: BuildingIcon,
    description: 'Cryptocurrency trading platforms'
  },
  {
    value: 'prop_firm',
    label: 'Prop Trading Firms',
    icon: ChartIcon,
    description: 'Proprietary trading companies'
  },
  {
    value: 'multi_asset',
    label: 'Multi-Asset Brokers',
    icon: ChartIcon,
    description: 'Multi-asset trading platforms'
  },
  {
    value: 'trading_tool',
    label: 'Trading Tools',
    icon: BoltIcon,
    description: 'Trading software and tools'
  },
  {
    value: 'stock_broker',
    label: 'Stock Brokers',
    icon: ShieldIcon,
    description: 'Stock trading platforms'
  },
  {
    value: 'forex_broker',
    label: 'Forex Brokers',
    icon: SmartphoneIcon,
    description: 'Foreign exchange trading platforms'
  }
]

// Fetch categories with fallback support
const fetchCategories = async (): Promise<DatabaseCategory[]> => {
  console.log('📄 Fetching categories from categories table...')
  
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
    
    if (error) {
      console.error('❌ Categories Error:', error)
      // Don't throw - we'll use fallback
      return []
    }
    
    if (!data || data.length === 0) {
      console.warn('⚠️ No categories found in categories table, using defaults')
      return []
    }
    
    console.log('✅ Categories loaded from database:', data.length, 'categories')
    console.log('✅ Categories data:', data)
    return data
    
  } catch (error) {
    console.error('❌ Failed to fetch categories:', error)
    // Return empty array to trigger fallback
    return []
  }
}

export const useCategoriesQuery = () => {
  const query = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      console.log(`🔄 Categories query retry attempt ${failureCount + 1}`, error?.message)
      
      // Don't retry if categories table doesn't exist - use fallback
      if (error?.message?.includes('relation "categories" does not exist')) {
        console.log('❌ Categories table not found - using fallback!')
        return false
      }
      
      // Don't retry if it's a permissions error - use fallback
      if (error?.message?.includes('permission') || error?.message?.includes('policy')) {
        console.log('❌ Categories permission error - using fallback!')
        return false
      }
      
      // Retry network errors up to 2 times
      return failureCount < 2
    },
    select: (data: DatabaseCategory[]): ProcessedCategory[] => {
      console.log('🔄 Processing categories...')
      console.log('🔍 Raw categories data:', data)
      
      // Always include "All Categories" first
      const allCategory: ProcessedCategory = {
        value: 'all',
        label: 'All Categories',
        icon: GiftIcon,
        description: 'View all available deals and platforms'
      }

      let processedCategories: ProcessedCategory[] = []

      if (data && data.length > 0) {
        // Use database categories
        processedCategories = data.map((category): ProcessedCategory => ({
          value: category.value,
          label: category.label,
          icon: ICON_MAP[category.icon_name as keyof typeof ICON_MAP] || StarIcon,
          description: category.description
        }))
        console.log('✅ Using database categories:', processedCategories.length)
      } else {
        // Use fallback categories
        processedCategories = DEFAULT_CATEGORIES
        console.log('✅ Using fallback categories:', processedCategories.length)
      }

      const finalCategories = [allCategory, ...processedCategories]
      console.log('✅ Final categories:', finalCategories.length, 'total')
      return finalCategories
    },
  })

  // Always return categories: Either from database or fallback
  return {
    ...query,
    data: query.data || [
      {
        value: 'all',
        label: 'All Categories',
        icon: GiftIcon,
        description: 'View all available deals and platforms'
      },
      ...DEFAULT_CATEGORIES
    ], // Always return categories (fallback if needed)
    error: query.error,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetching: query.isFetching
  }
}

// Hook to get category statistics
export const useCategoryStatsQuery = (deals: any[]) => {
  return useQuery({
    queryKey: ['category-stats', deals.length],
    queryFn: () => {
      const stats = new Map()
      
      // Count all deals
      stats.set('all', deals.length)
      
      // Count by category - handle both company.category and direct category
      deals.forEach(deal => {
        const category = deal.company?.category || deal.category
        if (category) {
          stats.set(category, (stats.get(category) || 0) + 1)
        }
      })
      
      console.log('📊 Category stats calculated:', Object.fromEntries(stats))
      return stats
    },
    enabled: deals.length > 0
  })
}

// Hook to get category info with companies
export const useCategoryInfoQuery = (companies: any[]) => {
  return useQuery({
    queryKey: ['category-info', companies.length],
    queryFn: () => {
      const categoryInfo = new Map()
      
      // Group companies by category
      const categoryGroups = companies.reduce((acc, company) => {
        const category = company.category
        if (category) {
          if (!acc[category]) {
            acc[category] = []
          }
          acc[category].push(company.name)
        }
        return acc
      }, {} as Record<string, string[]>)
      
      // Create category info
      Object.entries(categoryGroups).forEach(([category, companyNames]) => {
        categoryInfo.set(category, {
          companies: companyNames,
          count: companyNames.length
        })
      })
      
      console.log('📊 Category info calculated:', Object.fromEntries(categoryInfo))
      return categoryInfo
    },
    enabled: companies.length > 0
  })
}