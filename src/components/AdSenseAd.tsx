// src/components/AdSenseAd.tsx - Google AdSense Ad Component
import React, { useEffect, useRef } from 'react'
import { adSenseManager } from '../lib/adsense'

interface AdSenseAdProps {
  adSlot: string
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal'
  adStyle?: React.CSSProperties
  className?: string
  responsive?: boolean
}

const AdSenseAd: React.FC<AdSenseAdProps> = ({
  adSlot,
  adFormat = 'auto',
  adStyle = { display: 'block' },
  className = '',
  responsive = true
}) => {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (adRef.current && adSenseManager.canShowAds()) {
      // Add the ad unit to the page
      adRef.current.innerHTML = `
        <ins class="adsbygoogle"
             style="${Object.entries(adStyle).map(([key, value]) => `${key}: ${value}`).join('; ')}"
             data-ad-client="ca-pub-9090270214622092"
             data-ad-slot="${adSlot}"
             data-ad-format="${adFormat}"
             ${responsive ? 'data-full-width-responsive="true"' : ''}></ins>
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
        ">
          Advertisement
        </div>
      `
    }
  }, [adSlot, adFormat, adStyle, responsive])

  return (
    <div 
      ref={adRef}
      className={`adsense-ad ${className}`}
      style={{ minHeight: '90px' }}
    />
  )
}

export default AdSenseAd
