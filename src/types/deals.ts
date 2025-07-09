// src/types/deals.ts
export interface Company {
  id: string
  name: string
  slug: string
  description: string
  logo_url?: string
  website_url: string
  overall_rating: number
  total_reviews: number
  category: string
  status: string
}

export interface CompanyDeal {
  id: string
  company_id: string
  title: string
  description: string
  deal_type: string
  value?: string
  terms?: string
  start_date: string
  end_date?: string
  is_active: boolean
  click_count: number
  conversion_rate: number
  affiliate_link: string
  created_at: string
  updated_at: string
  // Compatibility fields
  merchant_name?: string
  category?: string
  rating?: number
  bonus_amount?: string
  features?: string[]
  tracking_link?: string
}

export interface UserRating {
  id: string
  overall_rating: number
  platform_usability?: number
  customer_support?: number
  fees_commissions?: number
  security_trust?: number
  educational_resources?: number
  mobile_app?: number
}

export interface CompanyRating {
  averageRating: number
  totalRatings: number
}

export interface DealWithRating extends CompanyDeal {
  company?: Company
  userRating?: UserRating
  companyRating?: CompanyRating
}

export interface DealFilters {
  searchTerm: string
  category: string
  sortBy: 'rating' | 'newest' | 'name'
}