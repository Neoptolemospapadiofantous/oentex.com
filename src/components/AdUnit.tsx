// src/components/AdUnit.tsx - Specific AdSense Ad Unit Component
import React, { useEffect, useRef } from 'react'
import { adSenseManager } from '../lib/adsense'

interface AdUnitProps {
  className?: string
}

const AdUnit: React.FC<AdUnitProps> = ({ className = '' }) => {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Debug logging
    console.log('AdSense: AdUnit useEffect triggered')
    console.log('AdSense: canShowAds:', adSenseManager.canShowAds())
    console.log('AdSense: window.adsbygoogle exists:', !!window.adsbygoogle)
    console.log('AdSense: adRef.current exists:', !!adRef.current)
    
    if (adRef.current && adSenseManager.canShowAds()) {
      // Clear any existing content first
      adRef.current.innerHTML = ''
      
      // Use the exact ad unit code you provided
      adRef.current.innerHTML = `
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-9090270214622092"
             data-ad-slot="3413714242"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      `
      
      // Debug logging
      console.log('AdSense: Ad unit HTML inserted')
      
      // Wait a bit for the DOM to update, then push
      setTimeout(() => {
        if (window.adsbygoogle && adRef.current) {
          try {
            // Find the ins element and push only if it doesn't have ads yet
            const insElement = adRef.current.querySelector('.adsbygoogle')
            if (insElement && !insElement.hasAttribute('data-adsbygoogle-status')) {
              window.adsbygoogle.push({})
              console.log('AdSense: Push successful')
            } else {
              console.log('AdSense: Ad already loaded or element not found')
            }
          } catch (error) {
            console.error('AdSense: Push failed:', error)
          }
        }
      }, 100)
    } else if (adRef.current) {
      // Show placeholder if ads are disabled
      console.log('AdSense: Showing placeholder - ads disabled')
      adRef.current.innerHTML = `
        <div style="
          background: #f5f5f5; 
          border: 1px dashed #ccc; 
          padding: 20px; 
          text-align: center; 
          color: #666;
          font-size: 14px;
          min-height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          Advertisement
        </div>
      `
    }
  }, [])

  return (
    <div 
      ref={adRef}
      className={`ad-unit ${className}`}
      style={{ 
        minHeight: '90px', 
        margin: '20px auto',
        maxWidth: '728px',
        width: '100%',
        display: 'block',
        textAlign: 'center'
      }}
    />
  )
}

export default AdUnit
