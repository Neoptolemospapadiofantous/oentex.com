// src/config/index.ts
interface Config {
  baseUrl: string
  supabase: {
    url: string
    anonKey: string
  }
  auth: {
    redirectPath: string
    maxRetries: number
    retryDelay: number
  }
}

const requiredEnvVars = {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
}

// Validate environment variables
for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
}

export const config: Config = {
  baseUrl: window.location.origin,
  supabase: {
    url: requiredEnvVars.VITE_SUPABASE_URL,
    anonKey: requiredEnvVars.VITE_SUPABASE_ANON_KEY,
  },
  auth: {
    redirectPath: '/deals',
    maxRetries: 3,
    retryDelay: 1000,
  },
}