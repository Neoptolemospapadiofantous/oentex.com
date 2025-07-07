import { useEffect, RefObject } from 'react'

interface ParallaxLayer {
  element: RefObject<HTMLElement>
  speed: number
  direction?: 'up' | 'down'
  rotation?: boolean
  scale?: boolean
}

export const useMultiLayerParallax = (
  containerRef: RefObject<Element>,
  layers: ParallaxLayer[]
) => {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = container.getBoundingClientRect()
          const windowHeight = window.innerHeight
          
          // Calculate scroll progress (0 to 1)
          const elementTop = rect.top
          const elementHeight = rect.height
          const scrollStart = windowHeight
          const scrollEnd = -elementHeight
          const scrollDistance = scrollStart - scrollEnd
          const scrollProgress = Math.max(0, Math.min(1, (scrollStart - elementTop) / scrollDistance))
          
          // Apply transformations to each layer
          layers.forEach((layer) => {
            const element = layer.element.current
            if (!element) return

            const direction = layer.direction === 'up' ? -1 : 1
            const translateY = scrollProgress * layer.speed * direction
            
            let transform = `translateY(${translateY}px)`
            
            if (layer.rotation) {
              const rotation = scrollProgress * (layer.speed * 0.1)
              transform += ` rotate(${rotation}deg)`
            }
            
            if (layer.scale) {
              const scale = 1 + (scrollProgress * 0.05)
              transform += ` scale(${scale})`
            }
            
            element.style.transform = transform
          })
          
          ticking = false
        })
        ticking = true
      }
    }

    // Throttled scroll listener
    let scrollTimeout: NodeJS.Timeout
    const throttledScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(handleScroll, 16) // ~60fps
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })
    
    // Initial call
    handleScroll()

    return () => {
      window.removeEventListener('scroll', throttledScroll)
      clearTimeout(scrollTimeout)
    }
  }, [containerRef, layers])
}
