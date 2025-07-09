// src/components/ui/OptimizedImage.tsx
import React, { useState, useRef, useEffect } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  fallbackSrc?: string
  placeholder?: string
  lazy?: boolean
  onLoad?: () => void
  onError?: () => void
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNS41IDUwSDY0LjVWNjBIMzUuNVY1MFoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+',
  lazy = true,
  onLoad,
  onError
}) => {
  const [imageSrc, setImageSrc] = useState(lazy ? placeholder : src)
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (!lazy) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src)
            observerRef.current?.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )

    if (imageRef) {
      observerRef.current.observe(imageRef)
    }

    return () => {
      observerRef.current?.disconnect()
    }
  }, [imageRef, src, lazy])

  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc)
    }
    onError?.()
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        ref={setImageRef}
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
      />
      
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}
      
      {hasError && !fallbackSrc && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <div className="text-2xl mb-2">🖼️</div>
            <div className="text-sm">Image not found</div>
          </div>
        </div>
      )}
    </div>
  )
}