import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Zap } from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Deals', path: '/deals' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' }
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Oentex
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-300 hover:text-primary relative ${
                  location.pathname === link.path ? 'text-primary' : 'text-textSecondary'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/deals"
              className="bg-gradient-to-r from-primary to-primaryHover px-6 py-2 rounded-full text-white font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-textSecondary hover:text-primary transition-colors duration-300 rounded-lg hover:bg-surface"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-4 border-t border-border bg-background/95 backdrop-blur-md rounded-b-lg">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block text-sm font-medium transition-colors duration-300 hover:text-primary px-2 py-1 rounded ${
                  location.pathname === link.path ? 'text-primary bg-primaryMuted' : 'text-textSecondary'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/deals"
              className="inline-block bg-gradient-to-r from-primary to-primaryHover px-6 py-2 rounded-full text-white font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 mt-2"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
