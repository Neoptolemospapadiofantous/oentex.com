// src/layouts/GuestLayout.tsx - Enhanced with theme integration
import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ToastContainer from '../components/ui/ToastContainer'

interface GuestLayoutProps {
  children: React.ReactNode
  className?: string
}

const GuestLayout: React.FC<GuestLayoutProps> = ({ children, className = "" }) => {
  return (
    <div className={`min-h-screen bg-background text-foreground background-enhanced ${className}`}>
      {/* ✅ ENHANCED BACKGROUND EFFECTS */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/2 via-transparent to-secondary/2 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-secondary/5 to-transparent rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '-3s' }}></div>

      {/* ✅ FIXED HEADER */}
      <Header />

      {/* ✅ MAIN CONTENT WITH PROPER SPACING */}
      <main className="relative z-10 flex-1 pt-16 layout-transition">
        <div className="component-transition">
          {children}
        </div>
      </main>

      {/* ✅ ENHANCED FOOTER */}
      <Footer />
      
      {/* ✅ TOAST CONTAINER WITH PROPER POSITIONING */}
      <ToastContainer 
        position="top-right" 
        topAnchorSelector="#site-header" 
        topMargin={8} 
      />
    </div>
  )
}

export default GuestLayout