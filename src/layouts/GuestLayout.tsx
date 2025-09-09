// src/layouts/GuestLayout.tsx - Fixed with Heroicons
import React from 'react'
import { 
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
  Switch
} from '@heroui/react'
import { useTheme as useNextTheme } from '@heroui/use-theme'
import { Icons } from '../components/icons'
interface GuestLayoutProps {
  children: React.ReactNode
}

const GuestLayout: React.FC<GuestLayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const { theme, setTheme } = useNextTheme()

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Deals', href: '/deals' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ]

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <Navbar 
        onMenuOpenChange={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
        maxWidth="xl"
        className="bg-background/80 backdrop-blur-lg border-b border-divider"
      >
        {/* Mobile menu toggle */}
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand>
            <Link href="/" className="font-bold text-xl text-foreground">
              TradingDeals
            </Link>
          </NavbarBrand>
        </NavbarContent>

        {/* Desktop Navigation */}
        <NavbarContent className="hidden sm:flex gap-6" justify="center">
          {menuItems.map((item) => (
            <NavbarItem key={item.name}>
              <Link
                color="foreground"
                href={item.href}
                className="hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        {/* Right side actions */}
        <NavbarContent justify="end">
          {/* Theme toggle */}
          <NavbarItem>
            <Switch
              isSelected={theme === 'dark'}
              size="lg"
              color="primary"
              thumbIcon={({ isSelected, className }: { isSelected: boolean; className: string }) =>
                isSelected ? (
                  <Icons.moon className={`${className} w-4 h-4`} />
                ) : (
                  <Icons.sun className={`${className} w-4 h-4`} />
                )
              }
              onChange={toggleTheme}
              aria-label="Toggle theme"
            />
          </NavbarItem>
          
          {/* Sign In Button */}
          <NavbarItem>
            <Button
              as={Link}
              color="primary"
              href="/auth/signin"
              variant="flat"
              size="sm"
            >
              Sign In
            </Button>
          </NavbarItem>
          
          {/* Get Started Button */}
          <NavbarItem className="hidden sm:flex">
            <Button
              as={Link}
              color="primary"
              href="/auth/signup"
              variant="solid"
              size="sm"
            >
              Get Started
            </Button>
          </NavbarItem>
        </NavbarContent>

        {/* Mobile Menu */}
        <NavbarMenu className="bg-background/95 backdrop-blur-lg">
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.name}-${index}`}>
              <Link
                color="foreground"
                className="w-full text-lg hover:text-primary transition-colors"
                href={item.href}
                size="lg"
                onPress={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            </NavbarMenuItem>
          ))}
          
          {/* Mobile auth buttons */}
          <NavbarMenuItem>
            <div className="flex flex-col gap-3 mt-6">
              <Button
                as={Link}
                color="primary"
                href="/auth/signin"
                variant="flat"
                size="lg"
                className="w-full"
                onPress={() => setIsMenuOpen(false)}
              >
                Sign In
              </Button>
              <Button
                as={Link}
                color="primary"
                href="/auth/signup"
                variant="solid"
                size="lg"
                className="w-full"
                onPress={() => setIsMenuOpen(false)}
              >
                Get Started
              </Button>
            </div>
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-content1 border-t border-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-bold text-foreground mb-4">
                TradingDeals
              </h3>
              <p className="text-foreground/70 mb-4 max-w-md">
                Discover the best trading platforms, exclusive deals, and expert insights 
                to maximize your trading potential.
              </p>
              <div className="flex items-center gap-2">
                <Switch
                  isSelected={theme === 'dark'}
                  size="sm"
                  color="primary"
                  thumbIcon={({ isSelected, className }: { isSelected: boolean; className: string }) =>
                    isSelected ? (
                      <Icons.moon className={`${className} w-3 h-3`} />
                    ) : (
                      <Icons.sun className={`${className} w-3 h-3`} />
                    )
                  }
                  onChange={toggleTheme}
                />
                <span className="text-sm text-foreground/70">
                  {theme === 'dark' ? 'Dark' : 'Light'} Mode
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      color="foreground"
                      className="text-sm hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/terms"
                    color="foreground"
                    className="text-sm hover:text-primary transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    color="foreground"
                    className="text-sm hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-divider mt-8 pt-8 text-center">
            <p className="text-sm text-foreground/70">
              © 2024 TradingDeals. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default GuestLayout