// src/components/debug/AuthTestSuite.tsx - Comprehensive Authentication Test
import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/authContext'
import { authService } from '../../lib/services/authService'
import { useDealsQuery, useCompanyRatingsQuery, useUserRatingsQuery } from '../../hooks/queries/useDealsQuery'
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Database, Shield, Users, FileText, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

interface TestResult {
  name: string
  status: 'pending' | 'success' | 'error' | 'warning'
  message: string
  details?: any
  timestamp: number
}

interface TestCategory {
  name: string
  icon: React.ReactNode
  tests: TestResult[]
}

export const AuthTestSuite: React.FC = () => {
  const [testCategories, setTestCategories] = useState<TestCategory[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [currentTest, setCurrentTest] = useState<string>('')
  const [showDetails, setShowDetails] = useState<string | null>(null)
  
  const authContext = useAuth()
  const dealsQuery = useDealsQuery()
  const companyRatingsQuery = useCompanyRatingsQuery([])
  const userRatingsQuery = useUserRatingsQuery(authContext.user?.id, [])

  // Initialize test categories
  useEffect(() => {
    setTestCategories([
      {
        name: 'Database Connection',
        icon: <Database className="w-5 h-5" />,
        tests: []
      },
      {
        name: 'Authentication Service',
        icon: <Shield className="w-5 h-5" />,
        tests: []
      },
      {
        name: 'Auth Context',
        icon: <Users className="w-5 h-5" />,
        tests: []
      },
      {
        name: 'Data Queries',
        icon: <FileText className="w-5 h-5" />,
        tests: []
      },
      {
        name: 'Component Integration',
        icon: <Zap className="w-5 h-5" />,
        tests: []
      }
    ])
  }, [])

  // Helper function to add test result
  const addTestResult = useCallback((categoryName: string, result: Omit<TestResult, 'timestamp'>) => {
    setTestCategories(prev => prev.map(category => 
      category.name === categoryName 
        ? {
            ...category,
            tests: [...category.tests, { ...result, timestamp: Date.now() }]
          }
        : category
    ))
  }, [])

  // Helper function to update current test
  const updateCurrentTest = useCallback((testName: string) => {
    setCurrentTest(testName)
  }, [])

  // Database Tests
  const runDatabaseTests = useCallback(async () => {
    const categoryName = 'Database Connection'
    
    // Test 1: Supabase URL and Key
    updateCurrentTest('Checking Supabase Configuration')
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      addTestResult(categoryName, {
        name: 'Supabase Configuration',
        status: 'error',
        message: 'Missing Supabase URL or Anon Key',
        details: { supabaseUrl: !!supabaseUrl, supabaseKey: !!supabaseKey }
      })
      return
    }
    
    addTestResult(categoryName, {
      name: 'Supabase Configuration',
      status: 'success',
      message: 'Environment variables configured',
      details: { 
        url: supabaseUrl.substring(0, 30) + '...', 
        key: supabaseKey.substring(0, 20) + '...' 
      }
    })

    // Test 2: Database Connection
    updateCurrentTest('Testing Database Connection')
    try {
      const { data, error } = await supabase.from('user_profiles').select('count').limit(1)
      
      if (error) {
        addTestResult(categoryName, {
          name: 'Database Connection',
          status: 'error',
          message: 'Failed to connect to database',
          details: error
        })
      } else {
        addTestResult(categoryName, {
          name: 'Database Connection',
          status: 'success',
          message: 'Successfully connected to database',
          details: data
        })
      }
    } catch (error) {
      addTestResult(categoryName, {
        name: 'Database Connection',
        status: 'error',
        message: 'Database connection failed',
        details: error
      })
    }

    // Test 3: Required Tables
    updateCurrentTest('Checking Required Tables')
    const requiredTables = ['user_profiles', 'trading_companies', 'company_deals', 'ratings']
    
    for (const table of requiredTables) {
      try {
        const { data, error } = await supabase.from(table).select('*').limit(1)
        
        if (error) {
          addTestResult(categoryName, {
            name: `Table: ${table}`,
            status: 'error',
            message: `Table ${table} not accessible`,
            details: error
          })
        } else {
          addTestResult(categoryName, {
            name: `Table: ${table}`,
            status: 'success',
            message: `Table ${table} accessible`,
            details: { rowCount: data?.length || 0 }
          })
        }
      } catch (error) {
        addTestResult(categoryName, {
          name: `Table: ${table}`,
          status: 'error',
          message: `Failed to access table ${table}`,
          details: error
        })
      }
    }

    // Test 4: Auth Session
    updateCurrentTest('Testing Auth Session')
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        addTestResult(categoryName, {
          name: 'Auth Session',
          status: 'warning',
          message: 'Error getting session',
          details: error
        })
      } else {
        addTestResult(categoryName, {
          name: 'Auth Session',
          status: session ? 'success' : 'warning',
          message: session ? 'User session active' : 'No active session',
          details: session ? {
            userId: session.user.id,
            email: session.user.email,
            expiresAt: new Date(session.expires_at! * 1000).toISOString()
          } : null
        })
      }
    } catch (error) {
      addTestResult(categoryName, {
        name: 'Auth Session',
        status: 'error',
        message: 'Failed to get session',
        details: error
      })
    }
  }, [addTestResult, updateCurrentTest])

  // Authentication Service Tests
  const runAuthServiceTests = useCallback(async () => {
    const categoryName = 'Authentication Service'
    
    // Test 1: Auth Service Instance
    updateCurrentTest('Testing Auth Service')
    try {
      const isServiceAvailable = typeof authService === 'object' && authService !== null
      
      if (isServiceAvailable) {
        addTestResult(categoryName, {
          name: 'Auth Service Instance',
          status: 'success',
          message: 'Auth service initialized',
          details: Object.keys(authService)
        })
      } else {
        addTestResult(categoryName, {
          name: 'Auth Service Instance',
          status: 'error',
          message: 'Auth service not available',
          details: authService
        })
      }
    } catch (error) {
      addTestResult(categoryName, {
        name: 'Auth Service Instance',
        status: 'error',
        message: 'Auth service test failed',
        details: error
      })
    }

    // Test 2: Auth Service Methods
    updateCurrentTest('Testing Auth Service Methods')
    const requiredMethods = ['signUp', 'signIn', 'signOut', 'resetPassword', 'signInWithGoogle']
    
    for (const method of requiredMethods) {
      try {
        const methodExists = typeof authService[method] === 'function'
        
        addTestResult(categoryName, {
          name: `Method: ${method}`,
          status: methodExists ? 'success' : 'error',
          message: methodExists ? `${method} method available` : `${method} method missing`,
          details: methodExists ? 'function' : typeof authService[method]
        })
      } catch (error) {
        addTestResult(categoryName, {
          name: `Method: ${method}`,
          status: 'error',
          message: `Error checking ${method} method`,
          details: error
        })
      }
    }

    // Test 3: User Profile Creation (if user exists)
    if (authContext.user) {
      updateCurrentTest('Testing User Profile Creation')
      try {
        await authService.createUserProfile(authContext.user)
        addTestResult(categoryName, {
          name: 'User Profile Creation',
          status: 'success',
          message: 'User profile creation successful',
          details: { userId: authContext.user.id }
        })
      } catch (error) {
        addTestResult(categoryName, {
          name: 'User Profile Creation',
          status: 'warning',
          message: 'User profile creation failed (may already exist)',
          details: error
        })
      }
    }
  }, [addTestResult, updateCurrentTest, authContext.user])

  // Auth Context Tests
  const runAuthContextTests = useCallback(async () => {
    const categoryName = 'Auth Context'
    
    // Test 1: Auth Context Availability
    updateCurrentTest('Testing Auth Context')
    try {
      const contextAvailable = authContext !== null && authContext !== undefined
      
      addTestResult(categoryName, {
        name: 'Auth Context Available',
        status: contextAvailable ? 'success' : 'error',
        message: contextAvailable ? 'Auth context accessible' : 'Auth context not available',
        details: contextAvailable ? Object.keys(authContext) : 'null/undefined'
      })
    } catch (error) {
      addTestResult(categoryName, {
        name: 'Auth Context Available',
        status: 'error',
        message: 'Error accessing auth context',
        details: error
      })
    }

    // Test 2: Auth State Properties
    updateCurrentTest('Testing Auth State Properties')
    const requiredProperties = ['user', 'session', 'loading', 'error', 'initialized', 'isFullyReady']
    
    for (const prop of requiredProperties) {
      try {
        const propExists = prop in authContext
        const propValue = authContext[prop]
        
        addTestResult(categoryName, {
          name: `Property: ${prop}`,
          status: propExists ? 'success' : 'error',
          message: propExists ? `${prop} property available` : `${prop} property missing`,
          details: propExists ? { type: typeof propValue, value: propValue } : 'missing'
        })
      } catch (error) {
        addTestResult(categoryName, {
          name: `Property: ${prop}`,
          status: 'error',
          message: `Error checking ${prop} property`,
          details: error
        })
      }
    }

    // Test 3: Auth Methods
    updateCurrentTest('Testing Auth Methods')
    const requiredMethods = ['signUp', 'signIn', 'signOut', 'resetPassword', 'clearError', 'retryAuth']
    
    for (const method of requiredMethods) {
      try {
        const methodExists = typeof authContext[method] === 'function'
        
        addTestResult(categoryName, {
          name: `Method: ${method}`,
          status: methodExists ? 'success' : 'error',
          message: methodExists ? `${method} method available` : `${method} method missing`,
          details: methodExists ? 'function' : typeof authContext[method]
        })
      } catch (error) {
        addTestResult(categoryName, {
          name: `Method: ${method}`,
          status: 'error',
          message: `Error checking ${method} method`,
          details: error
        })
      }
    }

    // Test 4: Auth State Consistency
    updateCurrentTest('Testing Auth State Consistency')
    try {
      const { user, session, loading, initialized, isFullyReady } = authContext
      
      // Check state consistency
      const hasUser = user !== null
      const hasSession = session !== null
      const shouldHaveUser = hasSession
      const shouldBeReady = initialized && !loading
      
      let status: 'success' | 'warning' | 'error' = 'success'
      let message = 'Auth state consistent'
      
      if (hasSession && !hasUser) {
        status = 'warning'
        message = 'Session exists but no user'
      } else if (!hasSession && hasUser) {
        status = 'warning'
        message = 'User exists but no session'
      } else if (shouldBeReady && !isFullyReady) {
        status = 'warning'
        message = 'Should be ready but isFullyReady is false'
      }
      
      addTestResult(categoryName, {
        name: 'Auth State Consistency',
        status,
        message,
        details: {
          user: hasUser,
          session: hasSession,
          loading,
          initialized,
          isFullyReady
        }
      })
    } catch (error) {
      addTestResult(categoryName, {
        name: 'Auth State Consistency',
        status: 'error',
        message: 'Error checking auth state consistency',
        details: error
      })
    }
  }, [addTestResult, updateCurrentTest, authContext])

  // Data Query Tests
  const runDataQueryTests = useCallback(async () => {
    const categoryName = 'Data Queries'
    
    // Test 1: Deals Query
    updateCurrentTest('Testing Deals Query')
    try {
      const { data, isLoading, error } = dealsQuery
      
      addTestResult(categoryName, {
        name: 'Deals Query',
        status: error ? 'error' : 'success',
        message: error ? 'Deals query failed' : `Deals query successful`,
        details: {
          loading: isLoading,
          dealsCount: data?.deals?.length || 0,
          companiesCount: data?.companies?.length || 0,
          error: error?.message
        }
      })
    } catch (error) {
      addTestResult(categoryName, {
        name: 'Deals Query',
        status: 'error',
        message: 'Deals query test failed',
        details: error
      })
    }

    // Test 2: Company Ratings Query
    updateCurrentTest('Testing Company Ratings Query')
    try {
      const { data, isLoading, error } = companyRatingsQuery
      
      addTestResult(categoryName, {
        name: 'Company Ratings Query',
        status: error ? 'error' : 'success',
        message: error ? 'Company ratings query failed' : 'Company ratings query successful',
        details: {
          loading: isLoading,
          ratingsCount: data ? Object.keys(data).length : 0,
          error: error?.message
        }
      })
    } catch (error) {
      addTestResult(categoryName, {
        name: 'Company Ratings Query',
        status: 'error',
        message: 'Company ratings query test failed',
        details: error
      })
    }

    // Test 3: User Ratings Query
    updateCurrentTest('Testing User Ratings Query')
    try {
      const { data, isLoading, error } = userRatingsQuery
      
      addTestResult(categoryName, {
        name: 'User Ratings Query',
        status: error ? 'error' : 'success',
        message: error ? 'User ratings query failed' : 'User ratings query successful',
        details: {
          loading: isLoading,
          userRatingsCount: data ? data.size : 0,
          requiresAuth: !authContext.user,
          error: error?.message
        }
      })
    } catch (error) {
      addTestResult(categoryName, {
        name: 'User Ratings Query',
        status: 'error',
        message: 'User ratings query test failed',
        details: error
      })
    }

    // Test 4: Query Dependencies
    updateCurrentTest('Testing Query Dependencies')
    try {
      const { isFullyReady, user, session } = authContext
      
      addTestResult(categoryName, {
        name: 'Query Dependencies',
        status: 'success',
        message: 'Query dependencies checked',
        details: {
          isFullyReady,
          hasUser: !!user,
          hasSession: !!session,
          shouldRunUserQueries: isFullyReady && !!user && !!session
        }
      })
    } catch (error) {
      addTestResult(categoryName, {
        name: 'Query Dependencies',
        status: 'error',
        message: 'Query dependencies test failed',
        details: error
      })
    }
  }, [addTestResult, updateCurrentTest, dealsQuery, companyRatingsQuery, userRatingsQuery, authContext])

  // Component Integration Tests
  const runComponentIntegrationTests = useCallback(async () => {
    const categoryName = 'Component Integration'
    
    // Test 1: Auth Context Provider
    updateCurrentTest('Testing Auth Context Provider')
    try {
      const contextWorking = authContext !== null && typeof authContext === 'object'
      
      addTestResult(categoryName, {
        name: 'Auth Context Provider',
        status: contextWorking ? 'success' : 'error',
        message: contextWorking ? 'Auth context provider working' : 'Auth context provider not working',
        details: contextWorking ? 'Provider accessible' : 'Provider not accessible'
      })
    } catch (error) {
      addTestResult(categoryName, {
        name: 'Auth Context Provider',
        status: 'error',
        message: 'Auth context provider test failed',
        details: error
      })
    }

    // Test 2: Component Render State
    updateCurrentTest('Testing Component Render State')
    try {
      const { loading, initialized, isFullyReady } = authContext
      
      let renderState = 'unknown'
      if (loading || !initialized) {
        renderState = 'loading'
      } else if (!isFullyReady) {
        renderState = 'auth-validating'
      } else {
        renderState = 'ready'
      }
      
      addTestResult(categoryName, {
        name: 'Component Render State',
        status: renderState === 'ready' ? 'success' : 'warning',
        message: `Component render state: ${renderState}`,
        details: {
          loading,
          initialized,
          isFullyReady,
          renderState
        }
      })
    } catch (error) {
      addTestResult(categoryName, {
        name: 'Component Render State',
        status: 'error',
        message: 'Component render state test failed',
        details: error
      })
    }

    // Test 3: Error Handling
    updateCurrentTest('Testing Error Handling')
    try {
      const { error } = authContext
      
      addTestResult(categoryName, {
        name: 'Error Handling',
        status: error ? 'warning' : 'success',
        message: error ? 'Auth error present' : 'No auth errors',
        details: error ? {
          type: error.type,
          message: error.message,
          details: error.details
        } : null
      })
    } catch (error) {
      addTestResult(categoryName, {
        name: 'Error Handling',
        status: 'error',
        message: 'Error handling test failed',
        details: error
      })
    }
  }, [addTestResult, updateCurrentTest, authContext])

  // Run all tests
  const runAllTests = useCallback(async () => {
    if (isRunning) return
    
    setIsRunning(true)
    setTestCategories(prev => prev.map(cat => ({ ...cat, tests: [] })))
    
    try {
      toast.success('Starting comprehensive authentication test...')
      
      await runDatabaseTests()
      await runAuthServiceTests()
      await runAuthContextTests()
      await runDataQueryTests()
      await runComponentIntegrationTests()
      
      toast.success('All tests completed!')
    } catch (error) {
      toast.error('Test suite failed to complete')
      console.error('Test suite error:', error)
    } finally {
      setIsRunning(false)
      setCurrentTest('')
    }
  }, [isRunning, runDatabaseTests, runAuthServiceTests, runAuthContextTests, runDataQueryTests, runComponentIntegrationTests])

  // Get status icon
  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      default:
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
    }
  }

  // Get status color
  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  // Calculate stats
  const totalTests = testCategories.reduce((sum, cat) => sum + cat.tests.length, 0)
  const passedTests = testCategories.reduce((sum, cat) => 
    sum + cat.tests.filter(test => test.status === 'success').length, 0
  )
  const failedTests = testCategories.reduce((sum, cat) => 
    sum + cat.tests.filter(test => test.status === 'error').length, 0
  )
  const warningTests = testCategories.reduce((sum, cat) => 
    sum + cat.tests.filter(test => test.status === 'warning').length, 0
  )

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Authentication System Test Suite
        </h1>
        <p className="text-gray-600">
          Comprehensive testing of authentication flow from database to components
        </p>
      </div>

      {/* Test Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{totalTests}</div>
          <div className="text-sm text-blue-800">Total Tests</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{passedTests}</div>
          <div className="text-sm text-green-800">Passed</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-600">{failedTests}</div>
          <div className="text-sm text-red-800">Failed</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">{warningTests}</div>
          <div className="text-sm text-yellow-800">Warnings</div>
        </div>
      </div>

      {/* Run Test Button */}
      <div className="mb-6">
        <button
          onClick={runAllTests}
          disabled={isRunning}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            isRunning
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <Shield className="w-5 h-5" />
              Run All Tests
            </>
          )}
        </button>
        
        {currentTest && (
          <div className="mt-2 text-sm text-gray-600 animate-pulse">
            Running: {currentTest}
          </div>
        )}
      </div>

      {/* Test Categories */}
      <div className="space-y-6">
        {testCategories.map((category) => (
          <div key={category.name} className="border border-gray-200 rounded-lg">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                {category.icon}
                <h2 className="text-lg font-semibold text-gray-900">
                  {category.name}
                </h2>
                <span className="text-sm text-gray-500">
                  ({category.tests.length} tests)
                </span>
              </div>
            </div>
            
            <div className="p-4">
              {category.tests.length === 0 ? (
                <div className="text-gray-500 text-center py-4">
                  No tests run yet
                </div>
              ) : (
                <div className="space-y-3">
                  {category.tests.map((test, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${getStatusColor(test.status)}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(test.status)}
                          <span className="font-medium">{test.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs">
                            {new Date(test.timestamp).toLocaleTimeString()}
                          </span>
                          {test.details && (
                            <button
                              onClick={() => setShowDetails(
                                showDetails === `${category.name}-${index}` 
                                  ? null 
                                  : `${category.name}-${index}`
                              )}
                              className="text-xs underline hover:no-underline"
                            >
                              {showDetails === `${category.name}-${index}` ? 'Hide' : 'Show'} Details
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-1 text-sm">
                        {test.message}
                      </div>
                      
                      {showDetails === `${category.name}-${index}` && test.details && (
                        <div className="mt-2 p-2 bg-white rounded border">
                          <pre className="text-xs overflow-x-auto">
                            {JSON.stringify(test.details, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AuthTestSuite