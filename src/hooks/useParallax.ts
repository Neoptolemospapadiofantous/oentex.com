import { useEffect, RefObject } from 'react'

export const useParallax = (
  elementRef: RefObject<Element>,
  callback: (scrollProgress: number) => void
) => {
  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = element.getBoundingClientRect()
          const windowHeight = window.innerHeight
          
          // Calculate scroll progress (0 to 1) based on element position
          const elementTop = rect.top
          const elementHeight = rect.height
          
          // Element is fully visible when top is at windowHeight and exits when top is at -elementHeight
          const scrollStart = windowHeight
          const scrollEnd = -elementHeight
          const scrollDistance = scrollStart - scrollEnd
          
          const scrollProgress = Math.max(0, Math.min(1, (scrollStart - elementTop) / scrollDistance))
          
          callback(scrollProgress)
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
  }, [elementRef, callback])
}
