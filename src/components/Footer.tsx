// src/components/Footer.tsx - Final version
import React from 'react'
import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import logo from '../assets/logo.png'

// Custom X (Twitter) icon since Lucide doesn't have the new X logo
const XIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    className="w-5 h-5" 
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const links = {
    product: [
      { name: 'Deals', href: '/deals' },
      { name: 'FAQ', href: '/faq' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
    ],
  }

  const socialLinks = [
    { name: 'X', icon: XIcon, href: 'https://x.com/oentex' },
    { name: 'Email', icon: Mail, href: 'mailto:contact@oentex.com' },
  ]

  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img 
                src={logo} 
                alt="Oentex Logo" 
                className="w-12 h-12 object-contain"
              />
              <span className="font-bold text-xl text-text">Oentex</span>
            </Link>
            <p className="text-textSecondary text-sm mb-6 max-w-md">
              Discover and rate the best trading platforms, exchanges, and financial services. 
              Make informed decisions with real user reviews and comprehensive ratings.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-textSecondary hover:text-primary transition-colors"
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={item.name}
                >
                  <item.icon />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-text mb-4">Product</h3>
            <ul className="space-y-3">
              {links.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-textSecondary hover:text-text transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-text mb-4">Company</h3>
            <ul className="space-y-3">
              {links.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-textSecondary hover:text-text transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-textSecondary text-sm">
            © {currentYear} Oentex. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-textSecondary hover:text-text transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-textSecondary hover:text-text transition-colors text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer