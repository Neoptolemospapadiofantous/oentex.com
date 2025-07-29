// src/components/Footer.tsx
import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Twitter, Linkedin, Github } from 'lucide-react'
import logo from '../assets/logo.png' // Adjust the file extension as needed (logo.svg, logo.jpg, etc.)

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const links = {
    product: [
      { name: 'Features', href: '/about' },
      { name: 'Deals', href: '/deals' },
      { name: 'Security', href: '/about#security' },
      { name: 'FAQ', href: '/faq' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Privacy', href: '/privacy' },
      { name: 'Terms', href: '/terms' },
    ],
    resources: [
      { name: 'Help Center', href: '/faq' },
      { name: 'Blog', href: '#' },
      { name: 'Guides', href: '#' },
      { name: 'API', href: '#' },
    ],
  }

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'GitHub', icon: Github, href: '#' },
    { name: 'Email', icon: Mail, href: 'mailto:contact@oentex.com' },
  ]

  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
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
                  <item.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
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

          <div>
            <h3 className="font-semibold text-text mb-4">Resources</h3>
            <ul className="space-y-3">
              {links.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-textSecondary hover:text-text transition-colors text-sm"
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {link.name}
                  </a>
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