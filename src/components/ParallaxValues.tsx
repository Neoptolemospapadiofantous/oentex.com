import React, { useEffect, useRef, useState } from 'react'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import { useParallax } from '../hooks/useParallax'

interface Value {
  icon: React.ComponentType<any>
  title: string
  description: string
}

interface ParallaxValuesProps {
  values: Value[]
}

const ParallaxValues: React.FC<ParallaxValuesProps> = ({ values }) => {
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
      const backgroundY = scrollProgress * -25
      const backgroundRotation = scrollProgress * 1
      background.style.transform = `translateY(${backgroundY}px) rotate(${backgroundRotation}deg)`
    }

    // Create wave-like motion for cards
    cardsRef.current.forEach((card, index) => {
      if (card) {
        const waveOffset = Math.sin((scrollProgress * Math.PI * 2) + (index * 0.5)) * 10
        const cardY = scrollProgress * 15 + waveOffset
        card.style.transform = `translateY(${cardY}px)`
      }
    })
  })

  return (
    <div ref={containerRef} className="mb-16 relative">
      {/* Animated Background Pattern */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 -z-10 opacity-20"
        style={{
          backgroundImage: `
            conic-gradient(from 0deg at 50% 50%, rgba(30, 64, 175, 0.1) 0deg, transparent 60deg, rgba(5, 150, 105, 0.1) 120deg, transparent 180deg, rgba(220, 38, 38, 0.1) 240deg, transparent 300deg, rgba(30, 64, 175, 0.1) 360deg)
          `,
          backgroundSize: '200px 200px'
        }}
      />

      <div className="text-center mb-12">
        <h2 
          className={`text-3xl font-bold text-text mb-4 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Our Core Values
        </h2>
        <p 
          className={`text-textSecondary max-w-2xl mx-auto transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '0.2s' }}
        >
          These fundamental principles guide our affiliate partnerships and shape our relationships 
          with users, partners, and service providers.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {values.map((value, index) => (
          <div 
            key={index}
            ref={(el) => {
              if (el) cardsRef.current[index] = el
            }}
            className={`p-6 bg-surface/50 rounded-2xl border border-border hover:bg-surface/70 transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: `${0.3 + index * 0.1}s` }}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
              <value.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-text mb-3">{value.title}</h3>
            <p className="text-textSecondary leading-relaxed">{value.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ParallaxValues
