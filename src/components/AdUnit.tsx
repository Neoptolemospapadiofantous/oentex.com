// src/components/AdUnit.tsx - Specific AdSense Ad Unit Component
import React, { useEffect, useRef } from 'react'
import { adSenseManager } from '../lib/adsense'

interface AdUnitProps {
  className?: string
}

const AdUnit: React.FC<AdUnitProps> = ({ className = '' }) => {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (adRef.current && adSenseManager.canShowAds()) {
      // Use the exact ad unit code you provided
      adRef.current.innerHTML = `
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-9090270214622092"
             data-ad-slot="3413714242"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      `
      
      // Push the ad to AdSense
      adSenseManager.pushAd(adRef.current)
    } else if (adRef.current) {
      // Show placeholder if ads are disabled
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
      style={{ minHeight: '90px', margin: '20px 0' }}
    />
  )
}

export default AdUnit
