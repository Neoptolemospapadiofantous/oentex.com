import React, { useState, useEffect } from 'react'
import { authService } from '../lib/services/authService'
import { config } from '../config'

interface DebugInfo {
  isValid: boolean
  issues: string[]
  recommendations: string[]
  environment: string
  currentUrl: string
  redirectUrl: string
  supabaseUrl: string
  wildcardCoverage: {
    pattern: string
    matches: boolean
    description: string
  }[]
  configChecks: {
    name: string
    status: 'pass' | 'fail' | 'warning'
    message: string
  }[]
}

const OAuthDebugger: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState<string[]>([])

  useEffect(() => {
    const runDiagnosis = async () => {
      setIsLoading(true)
      try {
        // Run the auth service validation
        const validation = await authService.validateOAuthConfig()
        
        // Gather comprehensive debug information
        const currentUrl = window.location.origin
        const redirectUrl = `${config.baseUrl}/auth/callback`
        const supabaseUrl = config.supabase.url
        
        // Check wildcard coverage
        const wildcardPatterns = [
          { pattern: 'https://oentex.com/**', description: 'Main domain with any path' },
          { pattern: 'https://www.oentex.com/**', description: 'WWW subdomain with any path' },
          { pattern: 'https://*-oentex.vercel.app/**', description: 'Vercel preview deployments' },
          { pattern: 'http://localhost:3000/**', description: 'Local development (port 3000)' },
          { pattern: 'http://localhost:5174/**', description: 'Local development (port 5174)' },
        ]
        
        const wildcardCoverage = wildcardPatterns.map(({ pattern, description }) => ({
          pattern,
          description,
          matches: matchesWildcardPattern(redirectUrl, pattern)
        }))
        
        // Run configuration checks
        const configChecks = [
          {
            name: 'Environment Detection',
            status: 'pass' as const,
            message: `Detected: ${config.environment} environment`
          },
          {
            name: 'Base URL Configuration',
            status: (config.baseUrl === currentUrl ? 'pass' : 'warning') as const,
            message: config.baseUrl === currentUrl 
              ? `Base URL matches current origin: ${config.baseUrl}`
              : `Base URL mismatch: config=${config.baseUrl}, current=${currentUrl}`
          },
          {
            name: 'Supabase Connection',
            status: (supabaseUrl && supabaseUrl.includes('supabase.co') ? 'pass' : 'fail') as const,
            message: supabaseUrl 
              ? `Connected to: ${supabaseUrl.split('.')[0]}...supabase.co`
              : 'Supabase URL not configured'
          },
          {
            name: 'Redirect URL Coverage',
            status: (wildcardCoverage.some(w => w.matches) ? 'pass' : 'fail') as const,
            message: wildcardCoverage.some(w => w.matches)
              ? 'Current redirect URL should be covered by wildcard patterns'
              : 'Current redirect URL may not be covered by any wildcard pattern'
          }
        ]
        
        // Check for common issues
        if (window.location.hostname === 'www.oentex.com') {
          configChecks.push({
            name: 'WWW Subdomain',
            status: 'warning',
            message: 'You are on www.oentex.com - ensure https://www.oentex.com/** is in Supabase'
          })
        }
        
        if (window.location.hostname.includes('.vercel.app')) {
          configChecks.push({
            name: 'Vercel Deployment',
            status: 'warning',
            message: 'Vercel deployment detected - ensure https://*-oentex.vercel.app/** is in Supabase'
          })
        }
        
        setDebugInfo({
          isValid: validation.isValid && configChecks.every(c => c.status !== 'fail'),
          issues: validation.issues,
          recommendations: validation.recommendations,
          environment: config.environment,
          currentUrl,
          redirectUrl,
          supabaseUrl,
          wildcardCoverage,
          configChecks
        })
      } catch (error) {
        console.error('OAuth diagnosis failed:', error)
        setDebugInfo({
          isValid: false,
          issues: [`Diagnosis failed: ${error}`],
          recommendations: ['Check console for detailed error information'],
          environment: config.environment,
          currentUrl: window.location.origin,
          redirectUrl: `${config.baseUrl}/auth/callback`,
          supabaseUrl: config.supabase.url,
          wildcardCoverage: [],
          configChecks: [{
            name: 'Diagnosis',
            status: 'fail',
            message: 'Failed to run configuration checks'
          }]
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    runDiagnosis()
  }, [])

  // Helper function to check wildcard pattern matching
  const matchesWildcardPattern = (url: string, pattern: string): boolean => {
    try {
      const regexPattern = pattern
        .replace(/\*\*/g, '.*') // ** matches any sequence
        .replace(/\*/g, '[^/]*') // * matches any sequence except /
        .replace(/\?/g, '[^/.]') // ? matches single character except /
      
      const regex = new RegExp(`^${regexPattern}$`)
      return regex.test(url)
    } catch {
      return false
    }
  }

  const testGoogleOAuth = async () => {
    setTestResults(['🧪 Testing Google OAuth...'])
    
    try {
      console.log('🧪 Starting Google OAuth test...')
      const result = await authService.signInWithGoogle()
      
      if (result.error) {
        setTestResults(prev => [...prev, `❌ OAuth Error: ${result.error.message}`])
        alert(`OAuth Error: ${result.error.message}`)
      } else {
        setTestResults(prev => [...prev, '✅ OAuth initiated successfully - check console for logs'])
        alert('OAuth initiated - check console for detailed flow logs')
      }
    } catch (error) {
      setTestResults(prev => [...prev, `❌ Test failed: ${error}`])
      alert(`Test failed: ${error}`)
    }
  }

  const copySupabaseConfig = () => {
    if (!debugInfo) return
    
    const config = `Supabase OAuth Configuration

Site URL:
https://oentex.com

Additional Redirect URLs:
https://oentex.com/**
https://www.oentex.com/**
https://*-oentex.vercel.app/**
http://localhost:3000/**
http://localhost:5174/**

Google Cloud Console Configuration:

Authorized JavaScript origins:
- https://oentex.com
- https://www.oentex.com
- http://localhost:5174

Authorized redirect URLs:
- ${debugInfo.supabaseUrl}/auth/v1/callback

Current Configuration:
- Environment: ${debugInfo.environment}
- Current URL: ${debugInfo.currentUrl}
- Redirect URL: ${debugInfo.redirectUrl}
- Supabase Project: ${debugInfo.supabaseUrl}`
    
    navigator.clipboard.writeText(config)
    alert('Complete Supabase configuration copied to clipboard!')
  }

  const copyCurrentRedirectUrl = () => {
    if (!debugInfo) return
    navigator.clipboard.writeText(debugInfo.redirectUrl)
    alert(`Copied to clipboard: ${debugInfo.redirectUrl}`)
  }

  const logConfiguration = () => {
    if (!debugInfo) return
    
    console.log('🔧 Complete OAuth Configuration Debug:', {
      environment: debugInfo.environment,
      currentOrigin: debugInfo.currentUrl,
      configuredBaseUrl: config.baseUrl,
      expectedRedirectUrl: debugInfo.redirectUrl,
      supabaseProjectUrl: debugInfo.supabaseUrl,
      wildcardCoverage: debugInfo.wildcardCoverage,
      configChecks: debugInfo.configChecks,
      isValid: debugInfo.isValid,
      issues: debugInfo.issues,
      recommendations: debugInfo.recommendations,
      timestamp: new Date().toISOString()
    })
    alert('Complete configuration logged to console')
  }

  if (isLoading) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button className="px-4 py-2 rounded-lg font-medium bg-blue-500 text-white animate-pulse">
          🔄 Checking OAuth...
        </button>
      </div>
    )
  }

  if (!debugInfo) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          debugInfo.isValid 
            ? 'bg-green-500 hover:bg-green-600 text-white' 
            : 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
        }`}
      >
        OAuth {debugInfo.isValid ? '✅' : '❌'}
      </button>

      {/* Enhanced Debug Panel */}
      {isVisible && (
        <div className="absolute bottom-12 right-0 w-[450px] bg-white border border-gray-200 rounded-lg shadow-xl p-4 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">OAuth Configuration Debug</h3>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600 text-lg"
            >
              ✕
            </button>
          </div>

          {/* Overall Status */}
          <div className={`mb-3 p-2 rounded ${
            debugInfo.isValid ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <div className="font-medium">
              {debugInfo.isValid ? '✅ OAuth Configuration Valid' : '❌ OAuth Configuration Issues Found'}
            </div>
            <div className="text-xs mt-1">
              Environment: {debugInfo.environment} | URL: {debugInfo.currentUrl}
            </div>
          </div>

          {/* Configuration Checks */}
          {debugInfo.configChecks.length > 0 && (
            <div className="mb-3">
              <h4 className="font-medium text-gray-700 mb-1">Configuration Status:</h4>
              <div className="space-y-1">
                {debugInfo.configChecks.map((check, index) => (
                  <div key={index} className={`text-xs p-1.5 rounded ${
                    check.status === 'pass' ? 'bg-green-50 text-green-700' :
                    check.status === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-red-50 text-red-700'
                  }`}>
                    <span className="font-medium">
                      {check.status === 'pass' ? '✅' : check.status === 'warning' ? '⚠️' : '❌'} {check.name}:
                    </span>
                    <div>{check.message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wildcard Coverage */}
          <div className="mb-3">
            <h4 className="font-medium text-purple-600 mb-1">Wildcard Pattern Coverage:</h4>
            <div className="space-y-1">
              {debugInfo.wildcardCoverage.map((coverage, index) => (
                <div key={index} className={`text-xs p-1.5 rounded ${
                  coverage.matches ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'
                }`}>
                  <div className="font-mono">
                    {coverage.matches ? '✅' : '❌'} {coverage.pattern}
                  </div>
                  <div className="text-xs">{coverage.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Issues */}
          {debugInfo.issues.length > 0 && (
            <div className="mb-3">
              <h4 className="font-medium text-red-600 mb-1">Issues Found:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                {debugInfo.issues.map((issue: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-1">•</span>
                    <span className="text-xs">{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          <div className="mb-3">
            <h4 className="font-medium text-blue-600 mb-1">Recommendations:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              {debugInfo.recommendations.slice(0, 3).map((rec: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-1">•</span>
                  <span className="text-xs">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="mb-3">
              <h4 className="font-medium text-gray-700 mb-1">Test Results:</h4>
              <div className="text-xs space-y-1 font-mono bg-gray-50 p-2 rounded max-h-20 overflow-y-auto">
                {testResults.map((result, index) => (
                  <div key={index} className={
                    result.includes('✅') ? 'text-green-600' :
                    result.includes('❌') ? 'text-red-600' :
                    'text-gray-600'
                  }>
                    {result}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="border-t pt-3">
            <h4 className="font-medium text-gray-700 mb-2">Quick Actions:</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={testGoogleOAuth}
                className="text-left px-2 py-1 text-xs bg-red-100 hover:bg-red-200 rounded text-red-800"
              >
                🧪 Test OAuth
              </button>
              <button
                onClick={copyCurrentRedirectUrl}
                className="text-left px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
              >
                📋 Copy Redirect URL
              </button>
              <button
                onClick={copySupabaseConfig}
                className="text-left px-2 py-1 text-xs bg-green-100 hover:bg-green-200 rounded text-green-800"
              >
                📋 Copy Full Config
              </button>
              <button
                onClick={logConfiguration}
                className="text-left px-2 py-1 text-xs bg-yellow-100 hover:bg-yellow-200 rounded text-yellow-800"
              >
                🔍 Log Debug Info
              </button>
            </div>
            <div className="mt-2">
              <button
                onClick={() => window.open('https://supabase.com/dashboard/project/_/auth/url-configuration', '_blank')}
                className="w-full text-left px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 rounded text-blue-800"
              >
                🔗 Open Supabase Auth Settings
              </button>
            </div>
          </div>

          {/* Current URLs Info */}
          <div className="border-t pt-3 mt-3">
            <div className="text-xs text-gray-500">
              <div className="font-medium mb-1">Current Configuration:</div>
              <div className="space-y-0.5 font-mono">
                <div>Redirect: {debugInfo.redirectUrl}</div>
                <div>Supabase: {debugInfo.supabaseUrl}/auth/v1/callback</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OAuthDebugger