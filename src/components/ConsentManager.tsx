// src/components/ConsentManager.tsx
import React, { useState, useEffect } from 'react'
import { Icons } from './icons'
import { updateAdSenseConsent } from '../lib/adsense'

interface ConsentPreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  personalization: boolean
}

interface ConsentManagerProps {
  onConsentChange?: (preferences: ConsentPreferences) => void
}

const ConsentManager: React.FC<ConsentManagerProps> = ({ onConsentChange }) => {
  const [showBanner, setShowBanner] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true, // Always true - required for site functionality
    analytics: false,
    marketing: false,
    personalization: false
  })

  useEffect(() => {
    // Check if user has already given consent
    const savedConsent = localStorage.getItem('oentex-consent')
    if (!savedConsent) {
      setShowBanner(true)
    } else {
      const consentData = JSON.parse(savedConsent)
      setPreferences(consentData.preferences)
    }
  }, [])

  const handleAcceptAll = () => {
    const newPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true
    }
    saveConsent(newPreferences)
    setShowBanner(false)
  }

  const handleRejectAll = () => {
    const newPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false
    }
    saveConsent(newPreferences)
    setShowBanner(false)
  }

  const handleManageOptions = () => {
    setShowModal(true)
  }

  const saveConsent = (newPreferences: ConsentPreferences) => {
    const consentData = {
      preferences: newPreferences,
      timestamp: new Date().toISOString(),
      version: '1.0'
    }
    localStorage.setItem('oentex-consent', JSON.stringify(consentData))
    setPreferences(newPreferences)
    onConsentChange?.(newPreferences)
    
    // Update AdSense with consent preferences
    updateAdSenseConsent(newPreferences)
  }

  const handleSavePreferences = () => {
    saveConsent(preferences)
    setShowModal(false)
    setShowBanner(false)
  }

  const handlePreferenceChange = (key: keyof ConsentPreferences, value: boolean) => {
    if (key === 'necessary') return // Cannot change necessary cookies
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  if (!showBanner && !showModal) return null

  return (
    <>
      {/* Consent Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-content1 border-t border-divider/30 shadow-enhanced-lg backdrop-blur-strong">
          <div className="container-p-lg">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-lg">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-sm">
                  We value your privacy
                </h3>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  We use cookies and similar technologies to enhance your experience, analyze site traffic, and personalize content. 
                  By continuing to use our site, you consent to our use of cookies. You can manage your preferences at any time.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-sm">
                <button
                  onClick={handleRejectAll}
                  className="btn-secondary px-lg py-sm text-sm font-medium"
                >
                  Reject All
                </button>
                <button
                  onClick={handleManageOptions}
                  className="btn-outline px-lg py-sm text-sm font-medium"
                >
                  Manage Options
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="btn-primary px-lg py-sm text-sm font-medium"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Consent Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-lg">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-content1 rounded-2xl border border-divider/30 shadow-enhanced-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="container-p-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-xl">
                <h2 className="text-2xl font-bold text-foreground">Cookie Preferences</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-foreground/60 hover:text-foreground transition-colors"
                >
                  <Icons.close className="w-6 h-6" />
                </button>
              </div>

              {/* Description */}
              <p className="text-foreground/70 mb-2xl leading-relaxed">
                We use cookies to provide and improve our services. You can choose which types of cookies to allow. 
                Some cookies are necessary for the site to function and cannot be disabled.
              </p>

              {/* Cookie Categories */}
              <div className="space-y-xl">
                {/* Necessary Cookies */}
                <div className="border border-divider/30 rounded-xl container-p-lg">
                  <div className="flex items-center justify-between mb-md">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Necessary Cookies</h3>
                      <p className="text-sm text-foreground/70">Required for basic site functionality</p>
                    </div>
                    <div className="bg-success/20 text-success px-sm py-xs rounded-full text-xs font-medium">
                      Always Active
                    </div>
                  </div>
                  <p className="text-sm text-foreground/60">
                    These cookies are essential for the website to function properly. They enable basic functions like page navigation, 
                    access to secure areas, and remember your login status.
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="border border-divider/30 rounded-xl container-p-lg">
                  <div className="flex items-center justify-between mb-md">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Analytics Cookies</h3>
                      <p className="text-sm text-foreground/70">Help us understand how visitors interact with our site</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => handlePreferenceChange('analytics', e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-11 h-6 rounded-full transition-colors ${
                        preferences.analytics ? 'bg-primary' : 'bg-content2'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${
                          preferences.analytics ? 'translate-x-5' : 'translate-x-0.5'
                        } mt-0.5`} />
                      </div>
                    </label>
                  </div>
                  <p className="text-sm text-foreground/60">
                    These cookies collect information about how you use our website, such as which pages you visit most often. 
                    This helps us improve our website's performance and user experience.
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className="border border-divider/30 rounded-xl container-p-lg">
                  <div className="flex items-center justify-between mb-md">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Marketing Cookies</h3>
                      <p className="text-sm text-foreground/70">Used to deliver relevant advertisements</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) => handlePreferenceChange('marketing', e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-11 h-6 rounded-full transition-colors ${
                        preferences.marketing ? 'bg-primary' : 'bg-content2'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${
                          preferences.marketing ? 'translate-x-5' : 'translate-x-0.5'
                        } mt-0.5`} />
                      </div>
                    </label>
                  </div>
                  <p className="text-sm text-foreground/60">
                    These cookies are used to deliver advertisements more relevant to you and your interests. 
                    They may also be used to limit the number of times you see an advertisement.
                  </p>
                </div>

                {/* Personalization Cookies */}
                <div className="border border-divider/30 rounded-xl container-p-lg">
                  <div className="flex items-center justify-between mb-md">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Personalization Cookies</h3>
                      <p className="text-sm text-foreground/70">Remember your preferences and settings</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.personalization}
                        onChange={(e) => handlePreferenceChange('personalization', e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-11 h-6 rounded-full transition-colors ${
                        preferences.personalization ? 'bg-primary' : 'bg-content2'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${
                          preferences.personalization ? 'translate-x-5' : 'translate-x-0.5'
                        } mt-0.5`} />
                      </div>
                    </label>
                  </div>
                  <p className="text-sm text-foreground/60">
                    These cookies remember your preferences and settings to provide a more personalized experience, 
                    such as your preferred language or region.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-sm mt-2xl pt-xl border-t border-divider/30">
                <button
                  onClick={handleRejectAll}
                  className="btn-secondary px-xl py-md font-medium"
                >
                  Reject All
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="btn-primary px-xl py-md font-medium"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ConsentManager
