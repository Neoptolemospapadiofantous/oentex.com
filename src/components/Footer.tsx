// src/components/Footer.tsx - Enhanced with 6 Navigation Columns
import React from 'react'
import { Link } from 'react-router-dom'
import { Icons } from './icons'
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

  const footerSections = {
    product: {
      title: 'Product',
      links: [
        { name: 'Deals', to: '/deals' },
        { name: 'FAQ', to: '/faq' },
      ],
    },
    company: {
      title: 'Company',
      links: [
        { name: 'About', to: '/about' },
        { name: 'Contact', to: '/contact' },
      ],
    },
  }

  const socialLinks = [
    { name: 'X (Twitter)', icon: XIcon, to: 'https://x.com/oentex_official' },
    { name: 'Email', icon: Icons.mail, to: 'mailto:support@oentex.com' },
  ]

  // Define column spans for each section on large screens
  const getColumnSpan = (key: string) => {
    const spans: Record<string, string> = {
      product: 'lg:col-span-3',
      company: 'lg:col-span-3',
    }
    return spans[key] || 'lg:col-span-3'
  }

  return (
    <footer className="bg-content2 border-t border-divider mt-auto">
      <div className="container-page">
        
        {/* Main Footer Content */}
        <div className="section-py-xl">
          <div className="grid grid-cols-12 gap-2xl">
            
            {/* Brand Section - Takes 6 columns on large screens, 6 on medium, full width on small */}
            <div className="col-span-12 md:col-span-6 lg:col-span-6 flex flex-col pr-lg py-md">
              {/* Logo and Brand */}
              <div className="mb-lg pr-sm py-sm">
                <Link to="/" className="flex items-center space-x-3 group">
                  <img 
                    src={logo} 
                    alt="Oentex Logo" 
                    className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                  <div>
                    <span className="font-bold text-2xl text-foreground group-hover:text-primary transition-colors duration-300">
                      Oentex
                    </span>
                    <p className="text-foreground/60 text-sm font-medium">Trading Platform Reviews</p>
                  </div>
                </Link>
              </div>
              
              {/* Description */}
              <p className="text-foreground/80 text-sm mb-2xl leading-relaxed max-w-lg pr-sm py-sm">
                Discover and rate the best trading platforms, exchanges, and financial services. 
                Make informed decisions with real user reviews and comprehensive ratings.
              </p>
              
              
              {/* Social Links - Pinned to bottom */}
              <div className="mt-auto pt-2xl pr-sm py-sm">
                <h5 className="text-sm font-semibold text-foreground mb-md">Follow Us</h5>
                <div className="flex items-center space-x-3">
                  {socialLinks.map((item) => (
                    <Link
                      key={item.name}
                      to={item.to}
                      className="text-foreground/70 hover:text-primary transition-all duration-200 p-sm rounded-lg hover:bg-primary/10 group relative"
                      target={item.to.startsWith('http') ? '_blank' : undefined}
                      rel={item.to.startsWith('http') ? 'noopener noreferrer' : undefined}
                      aria-label={item.name}
                    >
                      <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

             {/* Navigation Sections - 2 sections with responsive sizing */}
             {Object.entries(footerSections).map(([key, section]) => (
               <div 
                 key={key} 
                 className={`col-span-12 md:col-span-6 ${getColumnSpan(key)} space-y-4 px-lg py-md`}
               >
                <h3 className="font-semibold text-foreground text-base mb-md px-sm py-sm">
                  {section.title}
                </h3>
                <nav className="space-y-4 px-sm py-sm">
                  {section.links.map((link) => (
                    <Link
                      key={link.name}
                      to={link.to}
                      className="block text-foreground/70 hover:text-primary transition-all duration-200 text-sm hover:translate-x-1 transform group px-sm py-sm"
                    >
                      <span className="group-hover:underline decoration-primary/50 underline-offset-4">
                        {link.name}
                      </span>
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-divider/50 section-py-lg">
          <div className="grid grid-cols-12 gap-md items-center">
            {/* Copyright - Takes 6 columns on large, 12 on small */}
            <div className="col-span-12 lg:col-span-6">
              <p className="text-foreground/70 text-sm text-center lg:text-left">
                © {currentYear} Oentex. All rights reserved.
              </p>
            </div>
            
            {/* Legal Links - Takes 6 columns on large, 12 on small */}
            <div className="col-span-12 lg:col-span-6">
              <div className="flex items-center justify-center lg:justify-end space-x-8 px-lg py-sm">
                <Link 
                  to="/privacy" 
                  className="text-foreground/70 hover:text-primary transition-colors text-sm hover:underline underline-offset-4 decoration-primary/50 px-md py-sm"
                >
                  Privacy
                </Link>
                <Link 
                  to="/terms" 
                  className="text-foreground/70 hover:text-primary transition-colors text-sm hover:underline underline-offset-4 decoration-primary/50 px-md py-sm"
                >
                  Terms
                </Link>
                <Link 
                  to="/cookies" 
                  className="text-foreground/70 hover:text-primary transition-colors text-sm hover:underline underline-offset-4 decoration-primary/50 px-md py-sm"
                >
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer