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
      const backgroundY = scrollProgress * 40
      background.style.transform = `translateY(${backgroundY}px)`
    }

    // Animate individual cards with staggered parallax
    cardsRef.current.forEach((card, index) => {
      if (card) {
        const cardSpeed = 0.3 + (index * 0.1)
        const cardY = scrollProgress * (15 * cardSpeed)
        const cardRotation = scrollProgress * (1 - index * 0.2)
        card.style.transform = `translateY(${cardY}px) rotate(${cardRotation}deg)`
      }
    })
  })

  return (
    <div ref={containerRef} className="my-3xl relative">
      {/* Background Layer */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 -z-10 opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(var(--heroui-primary), 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(var(--heroui-secondary), 0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(var(--heroui-accent), 0.05) 0%, transparent 50%)
          `
        }}
      />

      <div className="text-center my-xl">
        <h2 
          className={`text-3xl font-bold text-text my-md transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Our Core Values
        </h2>
        <p 
          className={`text-textSecondary max-w-3xl mx-auto transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '0.2s' }}
        >
          These principles guide everything we do, from platform selection to user experience design.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-xl">
        {values.map((value, index) => (
          <div 
            key={index}
            ref={(el) => {
              if (el) cardsRef.current[index] = el
            }}
            className={`card-feature group transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: `${0.3 + index * 0.1}s` }}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto my-lg group-hover:scale-110 transition-transform duration-300">
                <value.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-text my-md">{value.title}</h3>
              <p className="text-textSecondary leading-relaxed">{value.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ParallaxValues
