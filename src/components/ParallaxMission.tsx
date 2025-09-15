import React, { useEffect, useRef, useState } from 'react'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import { useParallax } from '../hooks/useParallax'

interface ParallaxMissionProps {
  className?: string
}

const ParallaxMission: React.FC<ParallaxMissionProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const floatingElementsRef = useRef<HTMLDivElement>(null)
  
  const [isVisible, setIsVisible] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Intersection observer for triggering animations
  useIntersectionObserver(containerRef, (isIntersecting) => {
    setIsVisible(isIntersecting)
  }, { threshold: 0.3 })

  // Parallax scroll effect
  useParallax(containerRef, (scrollProgress) => {
    if (prefersReducedMotion) return

    const background = backgroundRef.current
    const content = contentRef.current
    const floatingElements = floatingElementsRef.current

    if (background && content && floatingElements) {
      // Background moves slower (classic parallax)
      const backgroundY = scrollProgress * 50
      background.style.transform = `translateY(${backgroundY}px)`

      // Content moves at normal speed with subtle scale
      const contentScale = 1 + (scrollProgress * 0.02)
      content.style.transform = `scale(${contentScale})`

      // Floating elements move faster for depth
      const floatingY = scrollProgress * -30
      const floatingRotation = scrollProgress * 5
      floatingElements.style.transform = `translateY(${floatingY}px) rotate(${floatingRotation}deg)`
    }
  })

  const floatingShapes = [
    { size: 'w-16 h-16', position: 'top-10 left-10', delay: '0s', color: 'from-primary/20 to-secondary/20' },
    { size: 'w-12 h-12', position: 'top-20 right-16', delay: '0.5s', color: 'from-secondary/20 to-accent/20' },
    { size: 'w-20 h-20', position: 'bottom-16 left-20', delay: '1s', color: 'from-accent/20 to-primary/20' },
    { size: 'w-8 h-8', position: 'bottom-10 right-10', delay: '1.5s', color: 'from-primary/30 to-secondary/30' },
  ]

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl overflow-hidden ${className}`}
    >
      {/* Animated Background Layer */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(var(--heroui-primary), 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(var(--heroui-secondary), 0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(var(--heroui-accent), 0.05) 0%, transparent 50%)
          `
        }}
      />

      {/* Floating Geometric Elements */}
      <div ref={floatingElementsRef} className="absolute inset-0">
        {!prefersReducedMotion && floatingShapes.map((shape, index) => (
          <div
            key={index}
            className={`absolute ${shape.size} ${shape.position} bg-gradient-to-br ${shape.color} rounded-full opacity-60 animate-float`}
            style={{
              animationDelay: shape.delay,
              animationDuration: `${6 + index}s`
            }}
          />
        ))}
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(var(--heroui-primary), 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(var(--heroui-primary), 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Main Content */}
      <div 
        ref={contentRef}
        className={`relative z-10 flex flex-col items-center justify-center h-full text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Rocket Icon with Pulse Animation */}
        <div className={`text-6xl my-md ${!prefersReducedMotion ? 'animate-bounce-subtle' : ''}`}>
          🚀
        </div>

        {/* Innovation Driven Text */}
        <div className="relative my-sm">
          <h3 
            className={`text-text font-semibold text-xl transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}
            style={{ transitionDelay: '0.3s' }}
          >
            Innovation Driven
          </h3>
          {!prefersReducedMotion && (
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg -z-10 animate-pulse-slow" />
          )}
        </div>

        {/* Since 2017 Text */}
        <p 
          className={`text-textSecondary text-sm transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
          }`}
          style={{ transitionDelay: '0.5s' }}
        >
          Since 2017
        </p>

        {/* Subtle Progress Indicator */}
        {!prefersReducedMotion && (
          <div className="absolute bottom-md left-1/2 transform -translate-x-1/2">
            <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className={`h-full gradient-text rounded-full transition-all duration-1000 ${
                  isVisible ? 'w-full' : 'w-0'
                }`}
                style={{ transitionDelay: '0.8s' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Accessibility: Screen reader content */}
      <div className="sr-only">
        Innovation-driven technology solutions since 2017. Oentex has been pioneering digital transformation across multiple industries.
      </div>
    </div>
  )
}

export default ParallaxMission
