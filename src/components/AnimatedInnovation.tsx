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
    <section 
      ref={sectionRef}
      className={`relative section-py-2xl container-px-sm sm:container-px-md lg:container-px-lg rounded-3xl mx-4 my-12 overflow-hidden min-h-[400px] flex items-center justify-center transition-all duration-700 transform ${isVisible ? 'visible translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${isLoaded ? 'loaded' : ''} ${className}`}
    >

      {/* Main Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Innovation Icon - Enhanced 3D Rocket with Effects */}
        <div className="my-xl">
          <div className="relative inline-block group">
            <div className="relative transform transition-all duration-700 hover:scale-110 hover:rotate-12">
              <div className={`w-80 h-80 flex items-center justify-center transition-all duration-700 ${isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
                {/* 3D Shadow Layer */}
                <div 
                  className="absolute inset-0 transform translate-x-6 translate-y-6 opacity-15"
                  style={{
                    filter: 'blur(8px)',
                    zIndex: 1
                  }}
                >
                  <svg 
                    className="w-40 h-40" 
                    viewBox="0 0 200 200" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="shadowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1a1a1a" />
                        <stop offset="100%" stopColor="#333333" />
                      </linearGradient>
                    </defs>
                    {/* Shadow Rocket */}
                    <g transform="translate(40, 30)">
                      <ellipse cx="40" cy="100" rx="35" ry="12" fill="url(#shadowGradient)" opacity="0.6"/>
                      <path d="M20 25 L60 25 L70 80 L10 80 Z" fill="url(#shadowGradient)" opacity="0.4"/>
                      <path d="M40 15 L50 25 L40 25 Z" fill="url(#shadowGradient)" opacity="0.3"/>
                    </g>
                  </svg>
                </div>
                
                {/* Main 3D Rocket Icon with Enhanced Effects */}
                <svg 
                  className="w-40 h-40 animate-bounce relative z-10" 
                  style={{ 
                    animationDuration: '2s',
                    filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4)) drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
                    transform: 'perspective(1000px) rotateX(15deg) rotateY(-8deg) rotateZ(3deg)'
                  }}
                  viewBox="0 0 200 200" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="rocketBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="30%" stopColor="#2563EB" />
                      <stop offset="70%" stopColor="#1D4ED8" />
                      <stop offset="100%" stopColor="#1E40AF" />
                    </linearGradient>
                    <linearGradient id="rocketSideGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1E3A8A" />
                      <stop offset="100%" stopColor="#1E40AF" />
                    </linearGradient>
                    <linearGradient id="rocketTopGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#60A5FA" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                    <linearGradient id="flameGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FEF3C7" />
                      <stop offset="30%" stopColor="#F59E0B" />
                      <stop offset="60%" stopColor="#EF4444" />
                      <stop offset="100%" stopColor="#DC2626" />
                    </linearGradient>
                    <linearGradient id="windowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#E0F2FE" />
                      <stop offset="100%" stopColor="#BAE6FD" />
                    </linearGradient>
                    <linearGradient id="finGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1E40AF" />
                      <stop offset="100%" stopColor="#1E3A8A" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                    <filter id="flameGlow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                    <filter id="trailGlow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* 3D Rocket Body - Front Face */}
                  <g transform="translate(40, 30)">
                    <path d="M20 25 L60 25 L70 80 L10 80 Z" fill="url(#rocketBodyGradient)" filter="url(#glow)"/>
                    
                    {/* 3D Rocket Body - Right Side */}
                    <path d="M60 25 L75 35 L75 90 L70 80 Z" fill="url(#rocketSideGradient)"/>
                    
                    {/* 3D Rocket Body - Top Face */}
                    <path d="M20 25 L30 15 L75 35 L60 25 Z" fill="url(#rocketTopGradient)"/>
                    
                    {/* Rocket Nose Cone */}
                    <path d="M40 15 L50 25 L40 25 Z" fill="url(#rocketTopGradient)" filter="url(#glow)"/>
                    <path d="M40 15 L50 25 L55 20 Z" fill="url(#rocketSideGradient)"/>
                    
                    {/* Rocket Window */}
                    <ellipse cx="40" cy="45" rx="12" ry="8" fill="url(#windowGradient)" opacity="0.9"/>
                    <ellipse cx="40" cy="45" rx="8" ry="5" fill="#0EA5E9" opacity="0.7"/>
                    <ellipse cx="40" cy="45" rx="4" ry="2" fill="#FFFFFF" opacity="0.8"/>
                    
                    {/* Rocket Fins */}
                    <path d="M10 80 L5 95 L10 95 Z" fill="url(#finGradient)"/>
                    <path d="M70 80 L75 95 L70 95 Z" fill="url(#finGradient)"/>
                    
                    {/* Body Details */}
                    <path d="M20 25 L60 25 L70 80 L10 80 Z" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                    <path d="M60 25 L75 35 L75 90 L70 80 Z" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
                    <path d="M20 25 L30 15 L75 35 L60 25 Z" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
                    
                    {/* Rocket Stripes */}
                    <path d="M25 35 L55 35 L55 40 L25 40 Z" fill="rgba(255,255,255,0.2)"/>
                    <path d="M25 55 L55 55 L55 60 L25 60 Z" fill="rgba(255,255,255,0.2)"/>
                  </g>
                  
                  {/* Enhanced Rocket Flame */}
                  <g transform="translate(40, 110)">
                    <path d="M30 0 L40 20 L50 0 Z" fill="url(#flameGradient)" filter="url(#flameGlow)"/>
                    <path d="M32 0 L40 15 L48 0 Z" fill="#FEF3C7" opacity="0.8"/>
                    <path d="M34 0 L40 10 L46 0 Z" fill="#FDE68A" opacity="0.6"/>
                    <path d="M36 0 L40 5 L44 0 Z" fill="#FCD34D" opacity="0.4"/>
                  </g>
                  
                  {/* Exhaust Trail Effects */}
                  <g transform="translate(40, 130)">
                    <path d="M25 0 L30 15 L35 0 Z" fill="#06B6D4" opacity="0.6" filter="url(#trailGlow)">
                      <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.5s" repeatCount="indefinite"/>
                    </path>
                    <path d="M45 0 L50 15 L55 0 Z" fill="#06B6D4" opacity="0.6" filter="url(#trailGlow)">
                      <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.5s" repeatCount="indefinite"/>
                    </path>
                    <path d="M35 0 L40 10 L45 0 Z" fill="#0891B2" opacity="0.4" filter="url(#trailGlow)">
                      <animate attributeName="opacity" values="0.2;0.6;0.2" dur="1.2s" repeatCount="indefinite"/>
                    </path>
                  </g>
                  
                  {/* Motion Blur Lines */}
                  <g stroke="#60A5FA" strokeWidth="2" fill="none" opacity="0.6">
                    <path d="M10 50 L25 50">
                      <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2s" repeatCount="indefinite"/>
                    </path>
                    <path d="M10 60 L20 60">
                      <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.2s" repeatCount="indefinite"/>
                    </path>
                    <path d="M10 70 L25 70">
                      <animate attributeName="opacity" values="0.2;0.8;0.2" dur="1.8s" repeatCount="indefinite"/>
                    </path>
                    <path d="M165 50 L150 50">
                      <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.1s" repeatCount="indefinite"/>
                    </path>
                    <path d="M170 60 L155 60">
                      <animate attributeName="opacity" values="0.2;0.8;0.2" dur="1.9s" repeatCount="indefinite"/>
                    </path>
                    <path d="M165 70 L150 70">
                      <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.3s" repeatCount="indefinite"/>
                    </path>
                  </g>
                  
                  {/* Stars and Space Particles */}
                  <g fill="#FCD34D" filter="url(#glow)">
                    <path d="M25 25 L27 25 L26 27 Z" opacity="0.8">
                      <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite"/>
                    </path>
                    <path d="M170 30 L172 30 L171 32 Z" opacity="0.6">
                      <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.5s" repeatCount="indefinite"/>
                    </path>
                    <path d="M180 20 L182 20 L181 22 Z" opacity="0.7">
                      <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2.8s" repeatCount="indefinite"/>
                    </path>
                    <path d="M30 170 L32 170 L31 172 Z" opacity="0.5">
                      <animate attributeName="opacity" values="0.5;0.9;0.5" dur="3.2s" repeatCount="indefinite"/>
                    </path>
                    <path d="M160 160 L162 160 L161 162 Z" opacity="0.9">
                      <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2.7s" repeatCount="indefinite"/>
                    </path>
                    <path d="M15 100 L17 100 L16 102 Z" opacity="0.6">
                      <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.9s" repeatCount="indefinite"/>
                    </path>
                    <path d="M175 100 L177 100 L176 102 Z" opacity="0.8">
                      <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2.4s" repeatCount="indefinite"/>
                    </path>
                  </g>
                  
                  {/* Energy Rings */}
                  <g stroke="#8B5CF6" strokeWidth="1" fill="none" opacity="0.4" filter="url(#glow)">
                    <circle cx="40" cy="40" r="25" opacity="0.3">
                      <animate attributeName="r" values="20;30;20" dur="4s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.1;0.4;0.1" dur="4s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="40" cy="40" r="35" opacity="0.2">
                      <animate attributeName="r" values="30;40;30" dur="5s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.05;0.3;0.05" dur="5s" repeatCount="indefinite"/>
                    </circle>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Text Content with Enhanced HeroUI Theme Animations */}
        <div className="my-xl">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold my-lg">
            <span className={`block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient-x transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
              Innovation
            </span>
            <span className={`block bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent animate-gradient-x transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '0.5s', transitionDelay: '600ms' }}>
              Driven
            </span>
          </h2>
          
          <p className={`text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '800ms' }}>
            Experience the future of trading with cutting-edge technology and innovative solutions.
          </p>
        </div>

        {/* Stats with Enhanced HeroUI Theme Animations */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-lg max-w-2xl mx-auto">
          <div className={`bg-background/50 backdrop-blur-sm border border-border rounded-2xl p-lg hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-lg group ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '1000ms' }}>
            <div className="text-3xl font-bold text-primary my-sm group-hover:scale-110 transition-transform duration-300">500+</div>
            <div className="text-sm text-foreground/70">Active Traders</div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className={`bg-background/50 backdrop-blur-sm border border-border rounded-2xl p-lg hover:border-secondary/30 transition-all duration-500 hover:scale-105 hover:shadow-lg group ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '1200ms' }}>
            <div className="text-3xl font-bold text-secondary my-sm group-hover:scale-110 transition-transform duration-300">99.9%</div>
            <div className="text-sm text-foreground/70">Uptime</div>
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className={`bg-background/50 backdrop-blur-sm border border-border rounded-2xl p-lg hover:border-accent/30 transition-all duration-500 hover:scale-105 hover:shadow-lg group ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '1400ms' }}>
            <div className="text-3xl font-bold text-accent my-sm group-hover:scale-110 transition-transform duration-300">24/7</div>
            <div className="text-sm text-foreground/70">Support</div>
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
      </div>

    </section>
  )
}

export default AnimatedInnovation