// src/components/debug/DebugButton.tsx - Quick Debug Access
import React, { useState } from 'react'
import { Bug, X, Shield, Database, Users, FileText, Zap } from 'lucide-react'
import { useAuth } from '../../lib/authContext'
import { useDealsQuery } from '../../hooks/queries/useDealsQuery'
import { supabase } from '../../lib/supabase'

const DebugButton: React.FC = () => {
  const [showDebug, setShowDebug] = useState(false)
  const [testResults, setTestResults] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)
  
  const authContext = useAuth()
  const dealsQuery = useDealsQuery()

  // Quick diagnostic test
  const runQuickTest = async () => {
    setIsRunning(true)
    setTestResults([])
    
    const results: string[] = []
    
    try {
      // Test 1: Supabase Config
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      if (supabaseUrl && supabaseKey) {
        results.push('✅ Supabase config OK')
      } else {
        results.push('❌ Supabase config missing')
      }
      
      // Test 2: Auth Context
      if (authContext) {
        results.push(`✅ Auth context OK (${authContext.initialized ? 'initialized' : 'not initialized'})`)
        results.push(`📊 Auth state: ${authContext.loading ? 'loading' : 'ready'} | User: ${authContext.user ? '✅' : '❌'} | Session: ${authContext.session ? '✅' : '❌'}`)
        results.push(`🔐 isFullyReady: ${authContext.isFullyReady ? '✅' : '❌'}`)
      } else {
        results.push('❌ Auth context missing')
      }
      
      // Test 3: Database Connection
      try {
        const { data, error } = await supabase.from('user_profiles').select('count').limit(1)
        if (error) {
          results.push(`❌ Database connection failed: ${error.message}`)
        } else {
          results.push('✅ Database connection OK')
        }
      } catch (err) {
        results.push(`❌ Database test failed: ${err}`)
      }
      
      // Test 4: Deals Query
      if (dealsQuery.data) {
        results.push(`✅ Deals query OK (${dealsQuery.data.deals.length} deals, ${dealsQuery.data.companies.length} companies)`)
      } else if (dealsQuery.error) {
        results.push(`❌ Deals query failed: ${dealsQuery.error.message}`)
      } else if (dealsQuery.isLoading) {
        results.push('⏳ Deals query loading...')
      } else {
        results.push('❓ Deals query status unknown')
      }
      
      // Test 5: Required Tables
      const tables = ['user_profiles', 'trading_companies', 'company_deals', 'ratings']
      for (const table of tables) {
        try {
          const { error } = await supabase.from(table).select('*').limit(1)
          if (error) {
            results.push(`❌ Table ${table}: ${error.message}`)
          } else {
            results.push(`✅ Table ${table} accessible`)
          }
        } catch (err) {
          results.push(`❌ Table ${table} test failed`)
        }
      }
      
      // Test 6: Environment
      results.push(`🌍 Environment: ${import.meta.env.MODE}`)
      results.push(`🔗 URL: ${window.location.origin}`)
      
    } catch (error) {
      results.push(`❌ Test suite error: ${error}`)
    }
    
    setTestResults(results)
    setIsRunning(false)
  }

  // Only show in development
  if (import.meta.env.MODE === 'production') {
    return null
  }

  return (
    <>
      {/* Debug Button */}
      <button
        onClick={() => setShowDebug(true)}
        className="fixed bottom-4 right-4 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors z-50"
        title="Open Debug Panel"
      >
        <Bug className="w-5 h-5" />
      </button>

      {/* Debug Panel */}
      {showDebug && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Bug className="w-6 h-6" />
                Debug Panel
              </h2>
              <button
                onClick={() => setShowDebug(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">Auth Status</h3>
                  </div>
                  <div className="text-sm space-y-1">
                    <div>Loading: {authContext.loading ? '✅' : '❌'}</div>
                    <div>Initialized: {authContext.initialized ? '✅' : '❌'}</div>
                    <div>Ready: {authContext.isFullyReady ? '✅' : '❌'}</div>
                    <div>User: {authContext.user ? '✅' : '❌'}</div>
                    <div>Session: {authContext.session ? '✅' : '❌'}</div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-900">Data Status</h3>
                  </div>
                  <div className="text-sm space-y-1">
                    <div>Deals: {dealsQuery.data ? '✅' : dealsQuery.error ? '❌' : '⏳'}</div>
                    <div>Loading: {dealsQuery.isLoading ? '✅' : '❌'}</div>
                    <div>Error: {dealsQuery.error ? '❌' : '✅'}</div>
                    <div>Count: {dealsQuery.data?.deals.length || 0}</div>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-900">Environment</h3>
                  </div>
                  <div className="text-sm space-y-1">
                    <div>Mode: {import.meta.env.MODE}</div>
                    <div>URL: {window.location.origin}</div>
                    <div>Path: {window.location.pathname}</div>
                  </div>
                </div>
              </div>

              {/* Current Auth State */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Current Auth Context</h3>
                <pre className="text-xs overflow-x-auto bg-white p-2 rounded border">
                  {JSON.stringify({
                    user: authContext.user ? {
                      id: authContext.user.id,
                      email: authContext.user.email,
                      created_at: authContext.user.created_at
                    } : null,
                    session: authContext.session ? {
                      expires_at: authContext.session.expires_at,
                      token_type: authContext.session.token_type
                    } : null,
                    loading: authContext.loading,
                    initialized: authContext.initialized,
                    isFullyReady: authContext.isFullyReady,
                    error: authContext.error
                  }, null, 2)}
                </pre>
              </div>

              {/* Quick Test */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={runQuickTest}
                    disabled={isRunning}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                      isRunning 
                        ? 'bg-gray-400 text-white cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isRunning ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Bug className="w-4 h-4" />
                        Run Quick Test
                      </>
                    )}
                  </button>
                  
                  <a
                    href="/auth-test"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Open Full Test Suite
                  </a>
                </div>
                
                {testResults.length > 0 && (
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                    {testResults.map((result, index) => (
                      <div key={index}>{result}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Debug Actions</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => authContext.retryAuth()}
                    className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                  >
                    Retry Auth
                  </button>
                  <button
                    onClick={() => authContext.clearError()}
                    className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
                  >
                    Clear Error
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                  >
                    Reload Page
                  </button>
                  <button
                    onClick={() => localStorage.clear()}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    Clear Storage
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DebugButton