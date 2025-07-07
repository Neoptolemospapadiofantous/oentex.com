import React, { useEffect, useRef, useState } from 'react'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import { useParallax } from '../hooks/useParallax'
import { AlertCircle } from 'lucide-react'

interface Service {
  icon: React.ComponentType<any>
  title: string
  description: string
  features: string[]
  disclaimer: string
}

interface ParallaxServicesProps {
  services: Service[]
}

const ParallaxServices: React.FC<ParallaxServicesProps> = ({ services }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])
  
  const [isVisible, setIsVisible] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useIntersectionObserver(containerRef, (isIntersecting) => {
    setIsVisible(isIntersecting)
  }, { threshold: 0.2 })

  useParallax(containerRef, (scrollProgress) => {
    if (prefersReducedMotion) return

    const background = backgroundRef.current
    
    if (background) {
      const backgroundY = scrollProgress * 30
      background.style.transform = `translateY(${backgroundY}px)`
    }

    // Animate individual cards with staggered parallax
    cardsRef.current.forEach((card, index) => {
      if (card) {
        const cardSpeed = 0.5 + (index * 0.1)
        const cardY = scrollProgress * (20 * cardSpeed)
        const cardRotation = scrollProgress * (2 - index * 0.5)
        card.style.transform = `translateY(${cardY}px) rotate(${cardRotation}deg)`
      }
    })
  })

  return (
    <div ref={containerRef} className="mb-16 relative">
      {/* Background Layer */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 30% 40%, rgba(30, 64, 175, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 60%, rgba(5, 150, 105, 0.1) 0%, transparent 50%)
          `
        }}
      />

      <div className="text-center mb-12">
        <h2 
          className={`text-3xl font-bold text-text mb-4 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Our Affiliate Network
        </h2>
        <p 
          className={`text-textSecondary max-w-3xl mx-auto transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '0.2s' }}
        >
          We connect users with carefully vetted service providers across multiple industries. 
          All partnerships are transparent, and we earn commissions from successful referrals.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {services.map((service, index) => (
          <div 
            key={index}
            ref={(el) => {
              if (el) cardsRef.current[index] = el
            }}
            className={`bg-surface/50 rounded-2xl p-8 border border-border hover:bg-surface/70 transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: `${0.3 + index * 0.1}s` }}
          >
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                <service.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text mb-2">{service.title}</h3>
                <p className="text-textSecondary leading-relaxed">{service.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {service.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-center text-sm text-textSecondary">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                  {feature}
                </div>
              ))}
            </div>

            {/* Affiliate Disclaimer */}
            <div className="bg-gradient-to-r from-warning/5 to-accent/5 border border-warning/20 rounded-lg p-3 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
              <p className="text-textSecondary text-xs leading-relaxed">
                {service.disclaimer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ParallaxServices
