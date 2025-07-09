// src/hooks/usePerformanceMonitor.ts (Fixed)
import { useEffect, useRef } from 'react'

interface PerformanceMetrics {
  renderCount: number
  averageRenderTime: number
  totalRenderTime: number
}

export const usePerformanceMonitor = (componentName: string): PerformanceMetrics => {
  const renderStart = useRef<number>()
  const renderCount = useRef(0)
  const totalRenderTime = useRef(0)

  // Start timing before render
  useEffect(() => {
    renderStart.current = performance.now()
    renderCount.current += 1
  })

  // Calculate render time after render
  useEffect(() => {
    if (renderStart.current) {
      const renderTime = performance.now() - renderStart.current
      totalRenderTime.current += renderTime

      // Log performance metrics in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`🚀 ${componentName} Performance:`, {
          renderTime: `${renderTime.toFixed(2)}ms`,
          averageRenderTime: `${(totalRenderTime.current / renderCount.current).toFixed(2)}ms`,
          renderCount: renderCount.current
        })
      }

      // Log slow renders
      if (renderTime > 16) { // 16ms = 60fps threshold
        console.warn(`🐌 Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`)
      }
    }
  })

  return {
    renderCount: renderCount.current,
    averageRenderTime: renderCount.current > 0 ? totalRenderTime.current / renderCount.current : 0,
    totalRenderTime: totalRenderTime.current
  }
}