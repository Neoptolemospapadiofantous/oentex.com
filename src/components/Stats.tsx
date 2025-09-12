// src/components/Stats.tsx - More comprehensive with strict typing, validation & concurrency
import React from 'react'
import { Icons } from './icons'
import { supabase } from '../lib/supabase'

/** ──────────────────────────────────────────────────────────────────────────
 * Types
 * ─────────────────────────────────────────────────────────────────────────── */
type CompanyRow = {
  id: string | number
  name?: string | null
  overall_rating?: number | null
  total_reviews?: number | null
  category?: string | null
  status?: string | null
}

const CATEGORY_KEYS = [
  'platform_usability',
  'customer_support',
  'fees_commissions',
  'security_trust',
  'educational_resources',
  'mobile_app',
] as const

type CategoryKey = (typeof CATEGORY_KEYS)[number]

type RatingRow = {
  id: string | number
  overall_rating?: number | null
} & Partial<Record<CategoryKey, number | null>>

type StatItem = {
  // Icon components from your Icons collection
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  value: string
  label: string
  description: string
}

/** ──────────────────────────────────────────────────────────────────────────
 * Helpers
 * ─────────────────────────────────────────────────────────────────────────── */
const isValidScore = (v: unknown): v is number =>
  typeof v === 'number' && Number.isFinite(v) && v > 0 && v <= 5

const toNonNegativeInt = (v: unknown): number => {
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0
}

const average = (arr: number[]): number =>
  arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n))

const nf = new Intl.NumberFormat('en-US')

/** ──────────────────────────────────────────────────────────────────────────
 * Component
 * ─────────────────────────────────────────────────────────────────────────── */
const Stats: React.FC = () => {
  const [stats, setStats] = React.useState<StatItem[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let isMounted = true

    const fetchStatsData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch in parallel for speed
        const [companiesRes, ratingsRes] = await Promise.all([
          supabase
            .from('trading_companies')
            .select('id, name, overall_rating, total_reviews, category, status')
            .eq('status', 'active'),
          supabase
            .from('ratings')
            .select(
              'id, overall_rating, platform_usability, customer_support, fees_commissions, security_trust, educational_resources, mobile_app'
            ),
        ])

        if (companiesRes.error) throw companiesRes.error
        if (ratingsRes.error) throw ratingsRes.error

        const companies: CompanyRow[] = Array.isArray(companiesRes.data)
          ? companiesRes.data
          : []
        const ratings: RatingRow[] = Array.isArray(ratingsRes.data)
          ? ratingsRes.data
          : []

        // Defensive: handle empty datasets
        const totalCompanies = companies.length

        // Sum verified reviews (ignore bad values)
        const totalReviews = companies.reduce((sum, c) => {
          return sum + toNonNegativeInt(c.total_reviews)
        }, 0)

        // Weighted average rating by review count
        let totalWeighted = 0
        let totalWeight = 0
        for (const c of companies) {
          const r = c.overall_rating
          const w = toNonNegativeInt(c.total_reviews)
          if (isValidScore(r) && w > 0) {
            totalWeighted += r * w
            totalWeight += w
          }
        }
        const avgRating = totalWeight > 0 ? totalWeighted / totalWeight : 0

        // Category averages from the ratings table
        const categoryAverages = CATEGORY_KEYS.map((key) => {
          const vals = ratings
            .map((r) => r[key])
            .filter(isValidScore) as number[]
          return average(vals)
        }).filter((n) => n > 0)

        // Overall satisfaction derived from category averages (preferred)
        // falling back to avg company rating if categories are unavailable
        const base = categoryAverages.length
          ? average(categoryAverages)
          : avgRating
        const overallSatisfaction = clamp((base / 5) * 100, 0, 100)

        // Category count for description (unique, non-empty)
        const categoryCount = new Set(
          companies.map((c) => (c.category ?? '').trim()).filter(Boolean)
        ).size

        const dynamicStats: StatItem[] = [
          {
            icon: Icons.arrowTrendingUp,
            value: totalCompanies > 0 ? String(totalCompanies) : '0',
            label: 'Products Reviewed',
            description: `Across ${categoryCount} ${
              categoryCount === 1 ? 'category' : 'categories'
            }`,
          },
          {
            icon: Icons.users,
            value: totalReviews > 0 ? nf.format(totalReviews) : '0',
            label: 'Verified Reviews',
            description:
              avgRating > 0
                ? `${avgRating.toFixed(1)}/5 average rating`
                : 'No ratings yet',
          },
          {
            icon: Icons.shield,
            value:
              overallSatisfaction > 0
                ? `${Math.round(overallSatisfaction)}%`
                : '0%',
            label: 'User Satisfaction',
            description:
              overallSatisfaction > 0
                ? 'Users trust our recommendations'
                : 'Building trust with users',
          },
        ]

        if (!isMounted) return
        setStats(dynamicStats)
      } catch (err: unknown) {
        console.error('Failed to load statistics:', err)
        if (!isMounted) return
        setError(
          err && typeof err === 'object' && 'message' in err
            ? String((err as any).message)
            : 'Unknown error'
        )
      } finally {
        if (!isMounted) return
        setIsLoading(false)
      }
    }

    fetchStatsData()
    return () => {
      isMounted = false
    }
  }, [])

  // ──────────────────────────────────────────────────────────────────────────
  // Render (structure & theme CSS unchanged)
  // ──────────────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <section className="page-section">
        <div className="container-page">
          <div className="grid-stats">
            {[1, 2, 3].map((index) => (
              <div key={index} className="text-center animate-pulse">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-default-200 rounded-2xl mb-4"></div>
                <div className="h-10 bg-default-200 rounded mb-2 w-24 mx-auto"></div>
                <div className="h-6 bg-default-200 rounded mb-1 w-32 mx-auto"></div>
                <div className="h-4 bg-default-200 rounded w-40 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="page-section">
        <div className="container-page">
          <div className="flex-col-center">
            <div className="w-16 h-16 bg-danger-100 rounded-2xl flex-center mb-4">
              <Icons.shield className="w-8 h-8 text-danger-600" />
            </div>
            <h3 className="text-lg font-semibold text-text mb-2">
              Unable to Load Statistics
            </h3>
            <p className="text-textSecondary">
              We're having trouble connecting to our database.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="page-section relative section-transition component-fade-in">
      
      <div className="container-page relative z-10">
        <div className="grid-stats max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center group hover:transform hover:scale-105 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl my-lg group-hover:shadow-lg group-hover:shadow-primary/25 transition-all duration-300">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-text my-sm animate-scale-in">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-text my-xs">
                {stat.label}
              </div>
              <div className="text-sm text-textSecondary">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stats
