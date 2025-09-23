// src/lib/adsense.ts - Google AdSense Integration with Consent Management
import { ConsentPreferences } from '../components/ConsentManager'

declare global {
  interface Window {
    adsbygoogle: any[]
    gtag: (...args: any[]) => void
  }
}

class AdSenseManager {
  private isInitialized = false
  private consentPreferences: ConsentPreferences | null = null

  constructor() {
    this.loadConsentFromStorage()
    this.initializeAdSense()
  }

  private loadConsentFromStorage() {
    try {
      const savedConsent = localStorage.getItem('oentex-consent')
      if (savedConsent) {
        const consentData = JSON.parse(savedConsent)
        this.consentPreferences = consentData.preferences
      }
    } catch (error) {
      console.warn('Failed to load consent preferences:', error)
    }
  }

  private initializeAdSense() {
    if (typeof window === 'undefined') return

    // Load Google AdSense script
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
    script.setAttribute('data-ad-client', 'ca-pub-9090270214622092')
    
    // Only load if user has consented to marketing cookies
    if (this.consentPreferences?.marketing) {
      document.head.appendChild(script)
      this.isInitialized = true
    }

    // Initialize adsbygoogle array
    if (!window.adsbygoogle) {
      window.adsbygoogle = []
    }
  }

  public updateConsent(preferences: ConsentPreferences) {
    this.consentPreferences = preferences
    
    if (preferences.marketing && !this.isInitialized) {
      // User just consented to marketing - initialize AdSense
      this.initializeAdSense()
    } else if (!preferences.marketing && this.isInitialized) {
      // User revoked marketing consent - disable AdSense
      this.disableAdSense()
    }
  }

  private disableAdSense() {
    // Remove AdSense scripts and clear ads
    const scripts = document.querySelectorAll('script[src*="googlesyndication.com"]')
    scripts.forEach(script => script.remove())
    
    // Clear existing ads
    const ads = document.querySelectorAll('.adsbygoogle')
    ads.forEach(ad => {
      ad.innerHTML = ''
      ad.style.display = 'none'
    })
    
    this.isInitialized = false
  }

  public pushAd(adElement: HTMLElement) {
    if (this.consentPreferences?.marketing && window.adsbygoogle) {
      try {
        window.adsbygoogle.push({})
      } catch (error) {
        console.warn('AdSense error:', error)
      }
    }
  }

  public canShowAds(): boolean {
    return this.consentPreferences?.marketing === true
  }
}

// Export singleton instance
export const adSenseManager = new AdSenseManager()

// Export function to update consent
export const updateAdSenseConsent = (preferences: ConsentPreferences) => {
  adSenseManager.updateConsent(preferences)
}
