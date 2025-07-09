// src/components/debug/SupabaseDebug.tsx - Debug component for Supabase connection
import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/authContext'
import { AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react'

interface DebugInfo {
  supabaseUrl: string
  supabaseKey: string
  connection: 'checking' | 'connected' | 'failed'
  authState: 'loading' | 'authenticated' | 'unauthenticated'
  userProfile: 'loading' | 'exists' | 'missing' | 'error'
  tablesAccess: {
    name: string
    status: 'checking' | 'accessible' | 'failed'
  }[]
}

export const SupabaseDebug: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    supabaseUrl: '',
    supabaseKey: '',
    connection: 'checking',
    authState: 'loading',
    userProfile: 'loading',
    tablesAccess: [
      { name: 'user_profiles', status: 'checking' },
      { name: 'trading_companies', status: 'checking' },
      { name: 'company_deals', status: 'checking' },
      { name: 'ratings', status: 'checking' },
      { name: 'reviews', status: 'checking' }
    ]
  })
  const [showDebug, setShowDebug] = useState(false)
  const { user, loading } = useAuth()

  const runDiagnostics = async () => {
    // Check environment variables
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY

    setDebugInfo(prev => ({
      ...prev,
      supabaseUrl: url || 'MISSING',
      supabaseKey: key ? `${key.substring(0, 20)}...` : 'MISSING',
      connection: 'checking',
      authState: loading ? 'loading' : user ? 'authenticated' : 'unauthenticated',
      userProfile: 'loading'
    }))

    // Test Supabase connection
    try {
      const { data, error } = await supabase.from('user_profiles').select('count').limit(1)
      
      setDebugInfo(prev => ({
        ...prev,
        connection: error ? 'failed' : 'connected'
      }))
    } catch (error) {
      setDebugInfo(prev => ({
        ...prev,
        connection: 'failed'
      }))
    }

    // Check user profile if authenticated
    if (user) {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        setDebugInfo(prev => ({
          ...prev,
          userProfile: error ? 'missing' : 'exists'
        }))
      } catch (error) {
        setDebugInfo(prev => ({
          ...prev,
          userProfile: 'error'
        }))
      }
    } else {
      setDebugInfo(prev => ({
        ...prev,
        userProfile: 'loading'
      }))
    }

    // Test table access
    const tables = ['user_profiles', 'trading_companies', 'company_deals', 'ratings', 'reviews']
    
    for (const tableName of tables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('count')
          .limit(1)

        setDebugInfo(prev => ({
          ...prev,
          tablesAccess: prev.tablesAccess.map(table => 
            table.name === tableName 
              ? { ...table, status: error ? 'failed' : 'accessible' }
              : table
          )
        }))
      } catch (error) {
        setDebugInfo(prev => ({
          ...prev,
          tablesAccess: prev.tablesAccess.map(table => 
            table.name === tableName 
              ? { ...table, status: 'failed' }
              : table
          )
        }))
      }
    }
  }

  useEffect(() => {
    runDiagnostics()
  }, [user, loading])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'checking':
      case 'loading':
        return <RefreshCw className="w-4 h-4 animate-spin text-yellow-500" />
      case 'connected':
      case 'accessible':
      case 'exists':
      case 'authenticated':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed':
      case 'missing':
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'unauthenticated':
        return <AlertCircle className="w-4 h-4 text-orange-500" />
      default:
        return <RefreshCw className="w-4 h-4 animate-spin text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'accessible':
      case 'exists':
      case 'authenticated':
        return 'text-green-500'
      case 'failed':
      case 'missing':
      case 'error':
        return 'text-red-500'
      case 'unauthenticated':
        return 'text-orange-500'
      default:
        return 'text-yellow-500'
    }
  }

  // Only show in development
  if (import.meta.env.PROD) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
      >
        Debug Auth
      </button>

      {showDebug && (
        <div className="absolute bottom-12 right-0 bg-gray-900 text-white p-4 rounded-lg border border-gray-700 w-80 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Supabase Debug Info</h3>
            <button
              onClick={runDiagnostics}
              className="text-gray-400 hover:text-white"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 text-sm">
            {/* Environment Variables */}
            <div>
              <h4 className="font-medium text-gray-300 mb-2">Environment</h4>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(debugInfo.supabaseUrl === 'MISSING' ? 'failed' : 'connected')}
                  <span className="text-xs">URL: {debugInfo.supabaseUrl}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(debugInfo.supabaseKey === 'MISSING' ? 'failed' : 'connected')}
                  <span className="text-xs">Key: {debugInfo.supabaseKey}</span>
                </div>
              </div>
            </div>

            {/* Connection Status */}
            <div>
              <h4 className="font-medium text-gray-300 mb-2">Connection</h4>
              <div className="flex items-center space-x-2">
                {getStatusIcon(debugInfo.connection)}
                <span className={`text-xs ${getStatusColor(debugInfo.connection)}`}>
                  {debugInfo.connection.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Auth State */}
            <div>
              <h4 className="font-medium text-gray-300 mb-2">Authentication</h4>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(debugInfo.authState)}
                  <span className={`text-xs ${getStatusColor(debugInfo.authState)}`}>
                    {debugInfo.authState.toUpperCase()}
                  </span>
                </div>
                {user && (
                  <div className="ml-6 text-xs text-gray-400">
                    User: {user.email}
                  </div>
                )}
              </div>
            </div>

            {/* User Profile */}
            <div>
              <h4 className="font-medium text-gray-300 mb-2">User Profile</h4>
              <div className="flex items-center space-x-2">
                {getStatusIcon(debugInfo.userProfile)}
                <span className={`text-xs ${getStatusColor(debugInfo.userProfile)}`}>
                  {debugInfo.userProfile.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Table Access */}
            <div>
              <h4 className="font-medium text-gray-300 mb-2">Table Access</h4>
              <div className="space-y-1">
                {debugInfo.tablesAccess.map((table) => (
                  <div key={table.name} className="flex items-center space-x-2">
                    {getStatusIcon(table.status)}
                    <span className={`text-xs ${getStatusColor(table.status)}`}>
                      {table.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-4 pt-3 border-t border-gray-700">
            <h4 className="font-medium text-gray-300 mb-2">Quick Actions</h4>
            <div className="space-y-1">
              <button
                onClick={() => {
                  console.log('Current user:', user)
                  console.log('Supabase client:', supabase)
                }}
                className="text-xs text-blue-400 hover:text-blue-300 block"
              >
                Log user to console
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2))
                }}
                className="text-xs text-blue-400 hover:text-blue-300 block"
              >
                Copy debug info
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}