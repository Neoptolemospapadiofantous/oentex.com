import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Deal {
  id: string
  merchant_name: string
  title: string
  description: string
  terms?: string
  commission_rate?: number
  tracking_link: string
  start_date: string
  end_date?: string
  category: string
  status: string
  bonus_amount?: string
  rating: number
  features: string[]
  image_url?: string
  created_at: string
  updated_at: string
}

export interface EmailSubscriber {
  id: string
  email: string
  subscribed_at: string
  status: string
}

export interface ContactMessage {
  id: string
  first_name: string
  last_name: string
  email: string
  subject: string
  message: string
  status: string
  created_at: string
}