// src/components/PageTransition.tsx
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

interface PageTransitionProps {
  children: React.ReactNode
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [transitionStage, setTransitionStage] = useState<'fade-in' | 'fade-out'>('fade-in')

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('fade-out')
    }
  }, [location, displayLocation])

  useEffect(() => {
    if (transitionStage === 'fade-out') {
      const timer = setTimeout(() => {
        setDisplayLocation(location)
        setTransitionStage('fade-in')
      }, 150) // Half of the transition duration

      return () => clearTimeout(timer)
    }
  }, [transitionStage, location])

  return (
    <div
      className={`transition-opacity duration-300 ease-in-out ${
        transitionStage === 'fade-out' ? 'opacity-0' : 'opacity-100'
      }`}
      key={displayLocation.key}
    >
      {children}
    </div>
  )
}

export default PageTransition