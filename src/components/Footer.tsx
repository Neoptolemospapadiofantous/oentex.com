import React from 'react'
import { Link } from 'react-router-dom'
import { Zap, Twitter, Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/oentex', label: 'Twitter' },
    { icon: Facebook, href: 'https://facebook.com/oentex', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com/oentex', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com/company/oentex', label: 'LinkedIn' }
  ]

  return (
    <footer id="contact" className="bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-6 group">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Oentex
                </span>
              </Link>
              
              <p className="text-textSecondary mb-6 leading-relaxed max-w-2xl">
                The future of cryptocurrency and stock trading. Secure, fast, and designed for everyone. 
                Join thousands of traders who trust our platform for their investment journey.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center text-textSecondary">
                    <Mail className="w-4 h-4 mr-3 text-primary" />
                    <span className="text-sm">contact@oentex.com</span>
                  </div>
                  <div className="flex items-center text-textSecondary">
                    <Phone className="w-4 h-4 mr-3 text-primary" />
                    <span className="text-sm">+1 (555) 123-4567</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-textSecondary">
                    <MapPin className="w-4 h-4 mr-3 text-primary" />
                    <span className="text-sm">San Francisco, CA</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 bg-background border border-border rounded-lg flex items-center justify-center text-textSecondary hover:text-primary hover:bg-primaryMuted hover:border-primary transition-all duration-300 transform hover:scale-110"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Section */}
            <div>
              <h3 className="font-semibold text-text mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/terms"
                    className="text-textSecondary hover:text-primary transition-colors duration-300 text-sm"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-textSecondary hover:text-primary transition-colors duration-300 text-sm"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-textSecondary hover:text-primary transition-colors duration-300 text-sm"
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-text mb-2">Stay Updated</h3>
              <p className="text-textSecondary text-sm">Get the latest market insights and platform updates.</p>
            </div>
            
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-3 bg-background border border-border rounded-l-lg text-text placeholder-textSecondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-primary to-primaryHover text-white font-medium rounded-r-lg hover:shadow-lg hover:shadow-primary/25 transition-all duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-textSecondary">
            <div className="mb-4 md:mb-0">
              <p>&copy; 2025 Oentex. All rights reserved.</p>
            </div>
            
            <div className="flex items-center space-x-6">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                Regulated by SEC & CFTC
              </span>
              <span>•</span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                SIPC Protected
              </span>
              <span>•</span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                FDIC Insured
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
