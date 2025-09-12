import React, { useEffect, useRef, useState } from 'react'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import { useParallax } from '../hooks/useParallax'

const ParallaxHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const midgroundRef = useRef<HTMLDivElement>(null)
  const foregroundRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  
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
  }, { threshold: 0.1 })

  useParallax(containerRef, (scrollProgress) => {
    if (prefersReducedMotion) return

    const background = backgroundRef.current
    const midground = midgroundRef.current
    const foreground = foregroundRef.current
    const content = contentRef.current

    if (background && midground && foreground && content) {
      // Background moves slowest (0.3x speed)
      const backgroundY = scrollProgress * 80
      background.style.transform = `translateY(${backgroundY}px)`

      // Midground moves at medium speed (0.6x speed)
      const midgroundY = scrollProgress * -40
      midground.style.transform = `translateY(${midgroundY}px)`

      // Foreground moves fastest (1.2x speed)
      const foregroundY = scrollProgress * -60
      const foregroundRotation = scrollProgress * 2
      foreground.style.transform = `translateY(${foregroundY}px) rotate(${foregroundRotation}deg)`

      // Content scales and fades
      const contentScale = 1 + (scrollProgress * 0.1)
      const contentOpacity = Math.max(0.3, 1 - scrollProgress * 0.8)
      content.style.transform = `scale(${contentScale})`
      content.style.opacity = contentOpacity.toString()
    }
  })

  const floatingElements = [
    { size: 'w-20 h-20', position: 'top-20 left-10', delay: '0s', speed: 0.8 },
    { size: 'w-16 h-16', position: 'top-32 right-20', delay: '1s', speed: 1.2 },
    { size: 'w-12 h-12', position: 'bottom-32 left-20', delay: '2s', speed: 0.6 },
    { size: 'w-24 h-24', position: 'bottom-20 right-16', delay: '1.5s', speed: 1.0 },
  ]

  return (
    <div 
      ref={containerRef}
      className="relative h-[80vh] bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 overflow-hidden"
    >
      {/* Background Layer - Slowest */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(var(--heroui-primary), 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(var(--heroui-secondary), 0.15) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(var(--heroui-accent), 0.1) 0%, transparent 50%)
          `
        }}
      />

      {/* Midground Layer - Medium Speed */}
      <div ref={midgroundRef} className="absolute inset-0">
        <div 
          className="w-full h-full opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(45deg, rgba(var(--heroui-primary), 0.1) 1px, transparent 1px),
              linear-gradient(-45deg, rgba(var(--heroui-secondary), 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Foreground Layer - Fastest */}
      <div ref={foregroundRef} className="absolute inset-0">
        {!prefersReducedMotion && floatingElements.map((element, index) => (
          <div
            key={index}
            className={`absolute ${element.size} ${element.position} bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full opacity-40 animate-float`}
            style={{
              animationDelay: element.delay,
              animationDuration: `${6 + index}s`
            }}
          />
        ))}
      </div>

      {/* Content Layer */}
      <div 
        ref={contentRef}
        className={`relative z-10 flex flex-col items-center justify-center h-full text-center px-4 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <h1 
            className={`text-5xl lg:text-7xl font-bold mb-6 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '0.2s' }}
          >
            <span className="gradient-text">
              About Oentex
            </span>
          </h1>
          
          <p 
            className={`text-xl lg:text-2xl text-textSecondary my-xl leading-relaxed transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '0.4s' }}
          >
            Your trusted affiliate marketing platform connecting you with premium 
            cryptocurrency, digital tools, and financial technology services.
          </p>

          <div 
            className={`bg-gradient-to-r from-warning/10 to-accent/10 border border-warning/30 rounded-2xl p-md my-xl transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '0.6s' }}
          >
            <p className="text-textSecondary text-sm">
              <strong>Affiliate Platform:</strong> We connect users with third-party services and earn commissions from referrals.
            </p>
          </div>

          {!prefersReducedMotion && (
            <div className="animate-bounce-subtle">
              <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
                <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      {!prefersReducedMotion && (
        <div className="absolute bottom-xl left-1/2 transform -translate-x-1/2">
          <div className="text-textSecondary text-sm my-sm">Scroll to explore</div>
        </div>
      )}
    </div>
  )
}

export default ParallaxHero
