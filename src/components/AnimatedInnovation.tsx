import React, { useEffect, useRef, useState } from 'react'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

interface AnimatedInnovationProps {
  className?: string
}

const AnimatedInnovation: React.FC<AnimatedInnovationProps> = ({ className = '' }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for scroll-triggered animations
  useIntersectionObserver(
    sectionRef,
    (isIntersecting) => {
      if (isIntersecting && !isVisible) {
        setIsVisible(true)
      }
    },
    { threshold: 0.3, rootMargin: '-50px' }
  )

  // Progressive enhancement - load animations after component mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div 
      ref={sectionRef}
      className={`innovation-section ${className} ${isVisible ? 'visible' : ''} ${isLoaded ? 'loaded' : ''}`}
    >
      <div className="innovation-container">
        {/* Animated Background Elements */}
        <div className="innovation-bg-elements">
          <div className="bg-circle bg-circle-1"></div>
          <div className="bg-circle bg-circle-2"></div>
          <div className="bg-circle bg-circle-3"></div>
          <div className="innovation-particles">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`particle particle-${i + 1}`}></div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="innovation-content">
          {/* Rocket Emoji with Animation */}
          <div className="rocket-container">
            <div className="rocket-wrapper">
              <span className="rocket-emoji" role="img" aria-label="Rocket">
                🚀
              </span>
              <div className="rocket-trail"></div>
              <div className="rocket-glow"></div>
            </div>
          </div>

          {/* Text Content */}
          <div className="text-content">
            <h2 className="innovation-title">
              <span className="title-line title-line-1">Innovation</span>
              <span className="title-line title-line-2">Driven</span>
            </h2>
            <div className="since-container">
              <span className="since-text">Since</span>
              <span className="year-text">2017</span>
            </div>
          </div>

          {/* Interactive Elements */}
          <div className="innovation-stats">
            <div className="stat-item stat-item-1">
              <span className="stat-number">7+</span>
              <span className="stat-label">Years</span>
            </div>
            <div className="stat-item stat-item-2">
              <span className="stat-number">50+</span>
              <span className="stat-label">Innovations</span>
            </div>
            <div className="stat-item stat-item-3">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Partners</span>
            </div>
          </div>
        </div>

        {/* Hover Interaction Overlay */}
        <div className="hover-overlay" aria-hidden="true"></div>
      </div>
    </div>
  )
}

export default AnimatedInnovation
