// src/layouts/GuestLayout.tsx - Fixed with proper imports
import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ToastContainer from '../components/ui/ToastContainer'

interface GuestLayoutProps {
  children: React.ReactNode
}

const GuestLayout: React.FC<GuestLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 pt-16">
        {children}
      </main>

      {/* Footer */}
      <Footer />
      
      {/* Toast Container */}
      <ToastContainer position="top-right" topAnchorSelector="#site-header" topMargin={8} />
    </div>
  )
}

export default GuestLayout