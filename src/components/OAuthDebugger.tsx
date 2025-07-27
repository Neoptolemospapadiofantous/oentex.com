import React, { useState, useEffect } from 'react'
import { authService } from '../lib/services/authService'

const OAuthDebugger: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const runDiagnosis = async () => {
      const diagnosis = await authService.diagnoseOAuthConfig()
      setDebugInfo(diagnosis)
    }
    
    runDiagnosis()
  }, [])

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

      {/* Debug Panel */}
      {isVisible && (
        <div className="absolute bottom-12 right-0 w-96 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-h-80 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">OAuth Configuration</h3>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Status */}
          <div className={`mb-3 p-2 rounded ${
            debugInfo.isValid ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            <div className="font-medium">
              {debugInfo.isValid ? '✅ Configuration OK' : '❌ Configuration Issues'}
            </div>
          </div>

          {/* Issues */}
          {debugInfo.issues.length > 0 && (
            <div className="mb-3">
              <h4 className="font-medium text-red-600 mb-1">Issues:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                {debugInfo.issues.map((issue: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-1">•</span>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          <div className="mb-3">
            <h4 className="font-medium text-blue-600 mb-1">Recommendations:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              {debugInfo.recommendations.map((rec: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-1">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="border-t pt-3">
            <h4 className="font-medium text-gray-700 mb-2">Quick Actions:</h4>
            <div className="space-y-2">
              <button
                onClick={() => {
                  const redirectUrl = `${window.location.origin}/auth/callback`
                  navigator.clipboard.writeText(redirectUrl)
                  alert(`Copied to clipboard: ${redirectUrl}`)
                }}
                className="w-full text-left px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
              >
                📋 Copy Redirect URL
              </button>
              <button
                onClick={() => window.open('https://supabase.com/dashboard/project/_/auth/url-configuration', '_blank')}
                className="w-full text-left px-2 py-1 text-sm bg-blue-100 hover:bg-blue-200 rounded"
              >
                🔗 Open Supabase Auth Settings
              </button>
              <button
                onClick={() => {
                  console.log('🔧 Current OAuth Configuration:', {
                    currentOrigin: window.location.origin,
                    expectedRedirect: `${window.location.origin}/auth/callback`,
                    environment: process.env.NODE_ENV,
                    timestamp: new Date().toISOString()
                  })
                  alert('Configuration logged to console')
                }}
                className="w-full text-left px-2 py-1 text-sm bg-yellow-100 hover:bg-yellow-200 rounded"
              >
                🔍 Log Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OAuthDebugger