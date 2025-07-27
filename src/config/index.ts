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
  environment: string
}

interface EnvironmentConfig {
  baseUrl: string
  redirectPath: string
}

const requiredEnvVars = {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
}

const optionalEnvVars = {
  VITE_BASE_URL: import.meta.env.VITE_BASE_URL,
  VITE_ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT,
}

// Validate required environment variables
for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
}

// Environment configurations
const environments: Record<string, EnvironmentConfig> = {
  development: {
    baseUrl: 'http://localhost:3000',
    redirectPath: '/deals',
  },
  staging: {
    baseUrl: 'https://staging-oentex.vercel.app',
    redirectPath: '/deals',
  },
  production: {
    baseUrl: 'https://oentex.com',
    redirectPath: '/deals',
  }
}

// Determine current environment
const getCurrentEnvironment = (): string => {
  // Check explicit environment variable first
  if (optionalEnvVars.VITE_ENVIRONMENT) {
    return optionalEnvVars.VITE_ENVIRONMENT
  }
  
  // Detect from import.meta.env.MODE
  const mode = import.meta.env.MODE
  if (mode === 'production') return 'production'
  if (mode === 'development') return 'development'
  
  // Fallback detection from URL
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    if (hostname.includes('staging')) return 'staging'
    if (hostname === 'localhost' || hostname === '127.0.0.1') return 'development'
    return 'production'
  }
  
  return 'development'
}

// Get configuration for current environment
const getEnvironmentConfig = (): EnvironmentConfig => {
  const currentEnv = getCurrentEnvironment()
  const envConfig = environments[currentEnv]
  
  if (!envConfig) {
    throw new Error(`Unknown environment: ${currentEnv}`)
  }
  
  return envConfig
}

// Determine base URL
const getBaseUrl = (): string => {
  // Use explicit VITE_BASE_URL if provided
  if (optionalEnvVars.VITE_BASE_URL) {
    return optionalEnvVars.VITE_BASE_URL
  }
  
  // For production, use actual origin if on Vercel/custom domain
  const currentEnv = getCurrentEnvironment()
  if (currentEnv === 'production' && typeof window !== 'undefined') {
    const hostname = window.location.hostname
    // If on Vercel domain, use actual origin instead of hardcoded production URL
    if (hostname.includes('.vercel.app') || hostname.includes('.netlify.app')) {
      return window.location.origin
    }
  }
  
  // Use environment-specific configuration
  const envConfig = getEnvironmentConfig()
  return envConfig.baseUrl
}

const currentEnvironment = getCurrentEnvironment()
const environmentConfig = getEnvironmentConfig()

export const config: Config = {
  baseUrl: getBaseUrl(),
  supabase: {
    url: requiredEnvVars.VITE_SUPABASE_URL,
    anonKey: requiredEnvVars.VITE_SUPABASE_ANON_KEY,
  },
  auth: {
    redirectPath: environmentConfig.redirectPath,
    maxRetries: 3,
    retryDelay: 1000,
  },
  environment: currentEnvironment,
}

// Debug info (only in development)
if (import.meta.env.DEV) {
  console.log('🔧 Config loaded:', {
    environment: config.environment,
    baseUrl: config.baseUrl,
    redirectPath: config.auth.redirectPath,
    hasBaseUrlEnv: !!optionalEnvVars.VITE_BASE_URL,
    hasEnvironmentEnv: !!optionalEnvVars.VITE_ENVIRONMENT,
  })
}