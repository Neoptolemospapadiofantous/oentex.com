import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Button,
  Card,
  CardBody,
  Chip,
  Image
} from '@heroui/react'
import { TrendingUp, Shield, Zap, ArrowRight, Star, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const features = [
    { icon: Shield, text: 'Regulated Partners', color: 'success' },
    { icon: TrendingUp, text: 'Market Analysis', color: 'primary' },
    { icon: Zap, text: 'Exclusive Bonuses', color: 'warning' }
  ]

  const cryptoSymbols = [
    { symbol: 'BTC', color: 'warning' },
    { symbol: 'ETH', color: 'primary' },
    { symbol: 'STOCKS', color: 'success' },
    { symbol: 'FOREX', color: 'secondary' },
    { symbol: 'GOLD', color: 'warning' },
    { symbol: 'USD', color: 'default' }
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16 bg-gradient-to-br from-primary-50 via-background to-secondary-50">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23006FEE' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Floating Crypto Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {cryptoSymbols.map((crypto, index) => (
          <motion.div
            key={crypto.symbol}
            className="absolute"
            style={{
              left: `${10 + (index * 15)}%`,
              top: `${20 + (index % 3) * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4 + index,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.5
            }}
          >
            <Chip
              color={crypto.color as any}
              variant="flat"
              className="backdrop-blur-sm"
            >
              {crypto.symbol}
            </Chip>
          </motion.div>
        ))}
      </div>

      {/* Gradient Orbs */}
      <motion.div 
        className="absolute w-96 h-96 bg-gradient-to-r from-primary-200/20 to-secondary-200/20 rounded-full blur-3xl"
        style={{
          left: `${-100 + mousePosition.x * 0.01}px`,
          top: `${-100 + mousePosition.y * 0.01}px`,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Chip
              startContent={<Star className="w-4 h-4" />}
              variant="flat"
              color="primary"
              className="backdrop-blur-sm"
            >
              Trusted by investors worldwide
            </Chip>
          </motion.div>

          {/* Headline */}
          <div className="space-y-4">
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="block text-foreground">Your Gateway to</span>
              <span className="block gradient-text">
                Financial Freedom
              </span>
            </motion.h1>

            <motion.p 
              className="text-lg md:text-xl lg:text-2xl text-default-600 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Discover exclusive bonuses and deals from top crypto exchanges, stock brokers, banks, and investment platforms. 
              Compare offers and maximize your financial potential.
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <Button
              as={Link}
              to="/deals"
              color="primary"
              size="lg"
              endContent={<ArrowRight className="w-5 h-5" />}
              className="w-full sm:w-auto font-semibold"
            >
              Explore Deals
            </Button>
            <Button
              as={Link}
              to="/about"
              variant="bordered"
              size="lg"
              className="w-full sm:w-auto font-semibold"
            >
              Learn More
            </Button>
          </motion.div>

          {/* Features */}
          <motion.div 
            className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-6 lg:gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="p-2">
                  <CardBody className="p-2">
                    <feature.icon className={`w-5 h-5 text-${feature.color}`} />
                  </CardBody>
                </Card>
                <span className="text-default-600 font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero