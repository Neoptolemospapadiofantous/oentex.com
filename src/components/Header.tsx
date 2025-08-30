import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  NavbarMenuToggle, 
  NavbarMenu, 
  NavbarMenuItem,
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from '@heroui/react'
import { AuthButton } from './auth/AuthButton'
import { useAuth } from '../lib/authContext'
import logo from '../assets/logo.png'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { user } = useAuth()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Deals', href: '/deals' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ]

  const isActive = (href: string) => location.pathname === href

  return (
    <Navbar 
      onMenuOpenChange={setIsMenuOpen}
      className="bg-background/70 backdrop-blur-md border-b border-divider"
      maxWidth="7xl"
      position="sticky"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src={logo} 
              alt="Oentex Logo" 
              className="w-10 h-10 object-contain"
            />
            <span className="font-bold text-xl gradient-text">Oentex</span>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {navigation.map((item) => (
          <NavbarItem key={item.name} isActive={isActive(item.href)}>
            <Link
              to={item.href}
              className={`text-foreground hover:text-primary transition-colors ${
                isActive(item.href) ? 'text-primary font-semibold' : ''
              }`}
            >
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <AuthButton />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {navigation.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              to={item.href}
              className={`w-full text-foreground hover:text-primary transition-colors ${
                isActive(item.href) ? 'text-primary font-semibold' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  )
}

export default Header