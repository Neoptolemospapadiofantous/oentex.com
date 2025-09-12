// src/components/Header.tsx - Updated with structured CSS and Icons
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icons } from './icons'
import { AuthButton } from './auth/AuthButton'
import logo from '../assets/logo.png'

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'About', to: '/about' },
    { name: 'Deals', to: '/deals' },
    { name: 'FAQ', to: '/faq' },
    { name: 'Contact', to: '/contact' },
  ]

  return (
    <header id="site-header" className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container-page">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img 
              src={logo} 
              alt="Oentex Logo" 
              className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300"
            />
            <span className="font-bold text-xl text-text group-hover:text-primary transition-colors">Oentex</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className="text-textSecondary hover:text-text transition-colors font-medium hover:scale-105 transform duration-200 px-sm py-xs"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Button */}
          <div className="hidden md:flex items-center">
            <AuthButton />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-sm rounded-lg text-textSecondary hover:text-text hover:bg-surface transition-colors"
          >
            {isMobileMenuOpen ? <Icons.close className="w-6 h-6" /> : <Icons.menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="container-px-xs container-py-sm space-y-2 border-t border-border bg-background">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  className="block container-px-md container-py-md text-textSecondary hover:text-text hover:bg-surface rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="container-px-sm container-py-sm border-t border-border mt-2 pt-4">
                <AuthButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header