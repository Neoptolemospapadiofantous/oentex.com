// src/config/index.ts - FIXED VERSION
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
    baseUrl: 'http://localhost:5173', // ✅ FIXED: Use correct dev port
    redirectPath: '/dashboard',
  },
  staging: {
    baseUrl: 'https://staging-oentex.vercel.app',
    redirectPath: '/dashboard',
  },
  production: {
    baseUrl: 'https://oentex.com', // ✅ Canonical URL without www
    redirectPath: '/dashboard',
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
    console.warn(`Unknown environment: ${currentEnv}, falling back to development`)
    return environments.development
  }
  
  return envConfig
}

// Determine base URL with better logic
const getBaseUrl = (): string => {
  // Use explicit VITE_BASE_URL if provided
  if (optionalEnvVars.VITE_BASE_URL) {
    return optionalEnvVars.VITE_BASE_URL
  }
  
  const currentEnv = getCurrentEnvironment()
  
  // ✅ CRITICAL: For production, handle various deployment scenarios
  if (currentEnv === 'production' && typeof window !== 'undefined') {
    const hostname = window.location.hostname
    const origin = window.location.origin
    
    // ✅ Handle www subdomain - redirect to canonical URL
    if (hostname === 'www.oentex.com') {
      console.log('🔧 WWW subdomain detected, using canonical URL')
      return 'https://oentex.com' // Canonical URL without www
    }
    
    // If deployed on Vercel preview or other domains, use actual origin
    if (hostname.includes('.vercel.app') || 
        hostname.includes('.netlify.app') || 
        hostname.includes('.herokuapp.com')) {
      console.log('🔧 Using dynamic origin for deployment:', origin)
      return origin
    }
    
    // If on the main domain, use the configured production URL
    if (hostname === 'oentex.com') {
      return 'https://oentex.com'
    }
    
    // Fallback to origin for unknown production domains
    console.warn('🔧 Unknown production domain, using origin:', origin)
    return origin
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

// ✅ CRITICAL: Debug info to help troubleshoot
console.log('🔧 OAuth Config Debug:', {
  environment: config.environment,
  baseUrl: config.baseUrl,
  redirectUrl: `${config.baseUrl}/auth/callback`,
  redirectPath: config.auth.redirectPath,
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
  origin: typeof window !== 'undefined' ? window.location.origin : 'server',
  hasBaseUrlEnv: !!optionalEnvVars.VITE_BASE_URL,
  hasEnvironmentEnv: !!optionalEnvVars.VITE_ENVIRONMENT,
})

// ✅ VALIDATION: Check if the redirect URL is properly configured
if (typeof window !== 'undefined') {
  const redirectUrl = `${config.baseUrl}/auth/callback`
  console.log('🔧 Expected OAuth redirect URL:', redirectUrl)
  console.log('🔧 Make sure BOTH of these URLs are in Supabase Additional Redirect URLs:')
  console.log('   - https://oentex.com/auth/callback')
  console.log('   - https://www.oentex.com/auth/callback')
  
  // ✅ Warn about www subdomain
  if (window.location.hostname === 'www.oentex.com') {
    console.warn('🔧 ⚠️  You are on www.oentex.com - make sure this URL is in Supabase!')
  }
}