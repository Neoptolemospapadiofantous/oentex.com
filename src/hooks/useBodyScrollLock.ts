// src/hooks/useBodyScrollLock.ts
import { useEffect } from 'react'

/**
 * A hook that locks body scroll when active and restores it when inactive.
 * Preserves the current scroll position when locking/unlocking.
 * 
 * @param isLocked - Whether the body scroll should be locked
 */
export const useBodyScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (!isLocked) return

    // Save current scroll position
    const scrollY = window.scrollY
    const scrollX = window.scrollX

    // Get current body styles to restore later
    const originalStyles = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
    }

    // Lock body scroll
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = `-${scrollX}px`
    document.body.style.width = '100%'
    document.body.style.overflow = 'hidden'

    return () => {
      // Restore original styles
      Object.assign(document.body.style, originalStyles)
      
      // Restore scroll position
      window.scrollTo(scrollX, scrollY)
    }
  }, [isLocked])
}