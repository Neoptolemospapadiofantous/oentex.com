// src/pages/AuthTestPage.tsx - Test Route Page
import React from 'react'
import AuthTestSuite from '../components/debug/AuthTestSuite'

const AuthTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AuthTestSuite />
      </div>
    </div>
  )
}

export default AuthTestPage