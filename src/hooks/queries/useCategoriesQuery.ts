// src/hooks/queries/useCategoriesQuery.ts - Fixed with Centralized Icon System
import { useQuery } from '@tanstack/react-query'
import { Icons } from '@components/icons'
import { supabase } from '../../lib/supabase'

const ICON_MAP = {
  gift: Icons.gift,
  zap: Icons.bolt,
  building: Icons.building,
  star: Icons.star,
  trending_up: Icons.trendingUp,
  bar_chart: Icons.chart,
  shield: Icons.shield,
  smartphone: Icons.mobile,
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

// Fallback categories with proper icon components
const DEFAULT_CATEGORIES: ProcessedCategory[] = [
  {
    value: 'crypto_exchange',
    label: 'Crypto Exchanges',
    icon: Icons.building,
    description: 'Cryptocurrency trading platforms'
  },
  {
    value: 'prop_firm',
    label: 'Prop Trading Firms',
    icon: Icons.trendingUp,
    description: 'Proprietary trading companies'
  },
  {
    value: 'multi_asset',
    label: 'Multi-Asset Brokers',
    icon: Icons.chart,
    description: 'Multi-asset trading platforms'
  },
  {
    value: 'trading_tool',
    label: 'Trading Tools',
    icon: Icons.bolt,
    description: 'Trading software and tools'
  },
  {
    value: 'stock_broker',
    label: 'Stock Brokers',
    icon: Icons.shield,
    description: 'Stock trading platforms'
  },
  {
    value: 'forex_broker',
    label: 'Forex Brokers',
    icon: Icons.mobile,
    description: 'Foreign exchange trading platforms'
  }
]

// Fetch categories with fallback support
const fetchCategories = async (): Promise<DatabaseCategory[]> => {
  console.log('Fetching categories from categories table...')
  
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
    
    if (error) {
      console.error('Categories Error:', error)
      return []
    }
    
    if (!data || data.length === 0) {
      console.warn('No categories found in categories table, using defaults')
      return []
    }
    
    console.log('Categories loaded from database:', data.length, 'categories')
    return data
    
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return []
  }
}

export const useCategoriesQuery = () => {
  const query = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      console.log(`Categories query retry attempt ${failureCount + 1}`, error?.message)
      
      if (error?.message?.includes('relation "categories" does not exist')) {
        console.log('Categories table not found - using fallback!')
        return false
      }
      
      if (error?.message?.includes('permission') || error?.message?.includes('policy')) {
        console.log('Categories permission error - using fallback!')
        return false
      }
      
      return failureCount < 2
    },
    select: (data: DatabaseCategory[]): ProcessedCategory[] => {
      console.log('Processing categories...')
      
      const allCategory: ProcessedCategory = {
        value: 'all',
        label: 'All Categories',
        icon: Icons.gift,
        description: 'View all available deals and platforms'
      }

      let processedCategories: ProcessedCategory[] = []

      if (data && data.length > 0) {
        processedCategories = data.map((category): ProcessedCategory => ({
          value: category.value,
          label: category.label,
          icon: ICON_MAP[category.icon_name as keyof typeof ICON_MAP] || Icons.star,
          description: category.description
        }))
        console.log('Using database categories:', processedCategories.length)
      } else {
        processedCategories = DEFAULT_CATEGORIES
        console.log('Using fallback categories:', processedCategories.length)
      }

      const finalCategories = [allCategory, ...processedCategories]
      console.log('Final categories:', finalCategories.length, 'total')
      return finalCategories
    },
  })

  return {
    ...query,
    data: query.data || [
      {
        value: 'all',
        label: 'All Categories',
        icon: Icons.gift,
        description: 'View all available deals and platforms'
      },
      ...DEFAULT_CATEGORIES
    ],
    error: query.error,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetching: query.isFetching
  }
}

export const useCategoryStatsQuery = (deals: any[]) => {
  return useQuery({
    queryKey: ['category-stats', deals?.length || 0],
    queryFn: () => {
      const stats = new Map()
      const dealsArray = deals || []
      stats.set('all', dealsArray.length)
      
      dealsArray.forEach(deal => {
        const category = deal.company?.category || deal.category
        if (category) {
          stats.set(category, (stats.get(category) || 0) + 1)
        }
      })
      
      console.log('Category stats calculated:', Object.fromEntries(stats))
      return stats
    },
    enabled: deals && deals.length > 0
  })
}

export const useCategoryInfoQuery = (companies: any[]) => {
  return useQuery({
    queryKey: ['category-info', companies?.length || 0],
    queryFn: () => {
      const categoryInfo = new Map()
      const companiesArray = companies || []
      
      const categoryGroups = companiesArray.reduce((acc, company) => {
        const category = company.category
        if (category) {
          if (!acc[category]) {
            acc[category] = []
          }
          acc[category].push(company.name)
        }
        return acc
      }, {} as Record<string, string[]>)
      
      Object.entries(categoryGroups).forEach(([category, companyNames]) => {
        categoryInfo.set(category, {
          companies: companyNames,
          count: companyNames.length
        })
      })
      
      console.log('Category info calculated:', Object.fromEntries(categoryInfo))
      return categoryInfo
    },
    enabled: companies && companies.length > 0
  })
}