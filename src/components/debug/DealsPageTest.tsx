// src/components/debug/DealsPageTest.tsx - Test Component for Deals Page
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../lib/authContext'
import { useDealsQuery, useCompanyRatingsQuery, useUserRatingsQuery } from '../../hooks/queries/useDealsQuery'
import { CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw } from 'lucide-react'

export const DealsPageTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)
  
  const authContext = useAuth()
  const dealsQuery = useDealsQuery()
  
  // Get company IDs from deals
  const companyIds = React.useMemo(() => {
    if (!dealsQuery.data?.deals) return []
    return [...new Set(dealsQuery.data.deals.map(deal => deal.company?.id).filter(Boolean))] as string[]
  }, [dealsQuery.data?.deals])
  
  const ratingsQuery = useCompanyRatingsQuery(companyIds)
  const userRatingsQuery = useUserRatingsQuery(authContext.user?.id, companyIds)

  const runDealsPageTest = async () => {
    setIsRunning(true)
    setTestResults([])
    const results: string[] = []
    
    try {
      results.push('🚀 Starting Deals Page Test...')
      
      // Test 1: Auth State
      results.push(`\n📋 AUTH STATE:`)
      results.push(`  • Loading: ${authContext.loading ? '⏳' : '✅'}`)
      results.push(`  • Initialized: ${authContext.initialized ? '✅' : '❌'}`)
      results.push(`  • Fully Ready: ${authContext.isFullyReady ? '✅' : '❌'}`)
      results.push(`  • User: ${authContext.user ? '✅ ' + authContext.user.email : '❌ Not signed in'}`)
      results.push(`  • Session: ${authContext.session ? '✅' : '❌'}`)
      results.push(`  • Error: ${authContext.error ? '❌ ' + authContext.error.message : '✅ None'}`)
      
      // Test 2: Deals Query
      results.push(`\n📊 DEALS QUERY:`)
      results.push(`  • Status: ${dealsQuery.isLoading ? '⏳ Loading' : dealsQuery.error ? '❌ Error' : '✅ Success'}`)
      results.push(`  • Deals Count: ${dealsQuery.data?.deals?.length || 0}`)
      results.push(`  • Companies Count: ${dealsQuery.data?.companies?.length || 0}`)
      if (dealsQuery.error) {
        results.push(`  • Error: ${dealsQuery.error.message}`)
      }
      
      // Test 3: Company IDs
      results.push(`\n🏢 COMPANY IDS:`)
      results.push(`  • Extracted IDs: ${companyIds.length}`)
      results.push(`  • IDs: ${companyIds.slice(0, 3).join(', ')}${companyIds.length > 3 ? '...' : ''}`)
      
      // Test 4: Ratings Query
      results.push(`\n⭐ RATINGS QUERY:`)
      results.push(`  • Status: ${ratingsQuery.isLoading ? '⏳ Loading' : ratingsQuery.error ? '❌ Error' : '✅ Success'}`)
      results.push(`  • Ratings Count: ${ratingsQuery.data ? Object.keys(ratingsQuery.data).length : 0}`)
      if (ratingsQuery.error) {
        results.push(`  • Error: ${ratingsQuery.error.message}`)
      }
      
      // Test 5: User Ratings Query
      results.push(`\n👤 USER RATINGS QUERY:`)
      results.push(`  • Status: ${userRatingsQuery.isLoading ? '⏳ Loading' : userRatingsQuery.error ? '❌ Error' : '✅ Success'}`)
      results.push(`  • User Ratings Count: ${userRatingsQuery.data ? userRatingsQuery.data.size : 0}`)
      results.push(`  • Requires Auth: ${authContext.user ? '✅ User signed in' : '❌ Need to sign in'}`)
      if (userRatingsQuery.error) {
        results.push(`  • Error: ${userRatingsQuery.error.message}`)
      }
      
      // Test 6: Query Dependencies
      results.push(`\n🔗 QUERY DEPENDENCIES:`)
      results.push(`  • Auth Ready: ${authContext.isFullyReady ? '✅' : '❌'}`)
      results.push(`  • Has Company IDs: ${companyIds.length > 0 ? '✅' : '❌'}`)
      results.push(`  • Should Run User Queries: ${authContext.isFullyReady && authContext.user && companyIds.length > 0 ? '✅' : '❌'}`)
      
      // Test 7: Loading States
      results.push(`\n⏱️ LOADING STATES:`)
      const shouldShowAuthLoading = authContext.loading || !authContext.initialized || !authContext.isFullyReady
      const shouldShowDataLoading = dealsQuery.isLoading || (companyIds.length > 0 && ratingsQuery.isLoading)
      
      results.push(`  • Should Show Auth Loading: ${shouldShowAuthLoading ? '✅' : '❌'}`)
      results.push(`  • Should Show Data Loading: ${shouldShowDataLoading ? '✅' : '❌'}`)
      results.push(`  • Page Should Render: ${!shouldShowAuthLoading && !shouldShowDataLoading ? '✅' : '❌'}`)
      
      // Test 8: Component State Logic
      results.push(`\n🎯 COMPONENT LOGIC:`)
      if (shouldShowAuthLoading) {
        results.push(`  • Expected: Auth Loading Screen`)
      } else if (shouldShowDataLoading) {
        results.push(`  • Expected: Data Loading Screen`)
      } else if (dealsQuery.error || ratingsQuery.error || userRatingsQuery.error) {
        results.push(`  • Expected: Error Screen`)
      } else {
        results.push(`  • Expected: Deals Page Content`)
      }
      
      // Test 9: Sample Data
      if (dealsQuery.data?.deals && dealsQuery.data.deals.length > 0) {
        const sampleDeal = dealsQuery.data.deals[0]
        results.push(`\n📝 SAMPLE DEAL:`)
        results.push(`  • Title: ${sampleDeal.title}`)
        results.push(`  • Company: ${sampleDeal.company_name}`)
        results.push(`  • Has Company Object: ${sampleDeal.company ? '✅' : '❌'}`)
        results.push(`  • Click Count: ${sampleDeal.click_count}`)
      }
      
      results.push(`\n✅ Deals Page Test Complete!`)
      
    } catch (error) {
      results.push(`\n❌ Test failed: ${error}`)
    }
    
    setTestResults(results)
    setIsRunning(false)
  }

  // Auto-run test on component mount
  useEffect(() => {
    runDealsPageTest()
  }, [])

  const getOverallStatus = () => {
    const hasErrors = dealsQuery.error || ratingsQuery.error || userRatingsQuery.error || authContext.error
    const isLoading = authContext.loading || dealsQuery.isLoading || ratingsQuery.isLoading
    
    if (hasErrors) return { icon: <XCircle className="w-5 h-5 text-red-600" />, text: 'Errors Detected', color: 'text-red-600' }
    if (isLoading) return { icon: <Clock className="w-5 h-5 text-yellow-600" />, text: 'Loading...', color: 'text-yellow-600' }
    if (authContext.isFullyReady && dealsQuery.data) return { icon: <CheckCircle className="w-5 h-5 text-green-600" />, text: 'All Good!', color: 'text-green-600' }
    return { icon: <AlertTriangle className="w-5 h-5 text-orange-600" />, text: 'Checking...', color: 'text-orange-600' }
  }

  const status = getOverallStatus()

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {status.icon}
          <h2 className="text-xl font-bold">Deals Page Diagnostics</h2>
          <span className={`font-medium ${status.color}`}>{status.text}</span>
        </div>
        
        <button
          onClick={runDealsPageTest}
          disabled={isRunning}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
            isRunning 
              ? 'bg-gray-400 text-white cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Re-run Test
            </>
          )}
        </button>
      </div>

      {/* Quick Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-3 rounded-lg border ${authContext.isFullyReady ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
          <div className="text-sm font-medium">Auth Status</div>
          <div className={`text-xs ${authContext.isFullyReady ? 'text-green-700' : 'text-yellow-700'}`}>
            {authContext.isFullyReady ? 'Ready' : 'Loading/Initializing'}
          </div>
        </div>
        
        <div className={`p-3 rounded-lg border ${dealsQuery.data ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
          <div className="text-sm font-medium">Deals Data</div>
          <div className={`text-xs ${dealsQuery.data ? 'text-green-700' : 'text-yellow-700'}`}>
            {dealsQuery.data ? `${dealsQuery.data.deals.length} deals` : 'Loading...'}
          </div>
        </div>
        
        <div className={`p-3 rounded-lg border ${ratingsQuery.data ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
          <div className="text-sm font-medium">Ratings Data</div>
          <div className={`text-xs ${ratingsQuery.data ? 'text-green-700' : 'text-yellow-700'}`}>
            {ratingsQuery.data ? `${Object.keys(ratingsQuery.data).length} ratings` : 'Loading...'}
          </div>
        </div>
        
        <div className={`p-3 rounded-lg border ${authContext.user ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
          <div className="text-sm font-medium">User Status</div>
          <div className={`text-xs ${authContext.user ? 'text-green-700' : 'text-gray-700'}`}>
            {authContext.user ? 'Signed In' : 'Not Signed In'}
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
        {testResults.map((result, index) => (
          <div key={index} className="mb-1">
            {result}
          </div>
        ))}
        {isRunning && (
          <div className="text-yellow-400 animate-pulse">
            Running diagnostics...
          </div>
        )}
      </div>
    </div>
  )
}

export default DealsPageTest