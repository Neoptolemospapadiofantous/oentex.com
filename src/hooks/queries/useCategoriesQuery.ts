// src/hooks/queries/useCategoriesQuery.ts - FIXED VERSION WITH CATEGORIES TABLE
// 
// ✅ USES DEDICATED 'categories' TABLE - Clean and reliable!
// ✅ NO FALLBACKS - Everything from Supabase database
// ✅ FIXED TYPE ISSUES - Proper interface matching
//
import { useQuery } from '@tanstack/react-query'
import { Gift, Zap, Building, Star, TrendingUp, BarChart3, Shield, Smartphone } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const ICON_MAP = {
  gift: Gift,
  zap: Zap,
  building: Building,
  star: Star,
  trending_up: TrendingUp,
  bar_chart: BarChart3,
  shield: Shield,
  smartphone: Smartphone,
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

// ✅ SIMPLE: Fetch categories from dedicated categories table
const fetchCategories = async (): Promise<DatabaseCategory[]> => {
  console.log('🔄 Fetching categories from categories table...')
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  
  if (error) {
    console.error('❌ Categories Error:', error)
    throw new Error(`Failed to fetch categories: ${error.message}`)
  }
  
  if (!data || data.length === 0) {
    console.warn('⚠️ No categories found in categories table')
    throw new Error('No categories found in database. Please run the categories SQL first.')
  }
  
  console.log('✅ Categories loaded:', data.length, 'categories')
  console.log('✅ Categories data:', data)
  return data
}

export const useCategoriesQuery = () => {
  const query = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      console.log(`🔄 Categories query retry attempt ${failureCount + 1}`, error?.message)
      
      // Don't retry if categories table doesn't exist
      if (error?.message?.includes('relation "categories" does not exist')) {
        console.log('❌ Categories table not found - run SQL first!')
        return false
      }
      
      // Don't retry if it's a permissions error
      if (error?.message?.includes('permission') || error?.message?.includes('policy')) {
        console.log('❌ Categories permission error')
        return false
      }
      
      // Don't retry if no categories found (empty table)
      if (error?.message?.includes('No categories found')) {
        console.log('❌ No categories in table')
        return false
      }
      
      // Retry network errors up to 2 times
      return failureCount < 2
    },
    select: (data: DatabaseCategory[]): ProcessedCategory[] => {
      console.log('🔄 Processing categories from database...')
      console.log('🔍 Raw categories data:', data)
      
      // Always include "All Categories" first
      const allCategory: ProcessedCategory = {
        value: 'all',
        label: 'All Categories',
        icon: Gift,
        description: 'View all available deals and platforms'
      }

      // Process database categories
      const processedCategories = data.map((category): ProcessedCategory => ({
        value: category.value,
        label: category.label,
        icon: ICON_MAP[category.icon_name as keyof typeof ICON_MAP] || Star,
        description: category.description
      }))

      console.log('✅ Categories processed:', processedCategories.length, 'categories')
      console.log('✅ Final categories:', [allCategory, ...processedCategories])
      return [allCategory, ...processedCategories]
    },
  })

  // ✅ CLEAN: Return actual query state - let errors bubble up
  return {
    ...query,
    data: query.data || [], // Empty array if no data (during loading)
    error: query.error, // Always return the actual error
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