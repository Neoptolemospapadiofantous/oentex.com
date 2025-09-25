import React, { useEffect } from 'react'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
  structuredData?: object
  canonical?: string
  noindex?: boolean
  nofollow?: boolean
}

const SEO: React.FC<SEOProps> = ({
  title = 'Oentex - Your Gateway to Financial Freedom',
  description = 'Discover exclusive bonuses and deals from top crypto exchanges, stock brokers, banks, and investment platforms. Compare offers and maximize your financial potential with Oentex.',
  keywords = 'cryptocurrency, trading, investment, stocks, forex, banking, financial deals, trading bonuses, crypto exchanges, stock brokers',
  image = 'https://oentex.com/og-image.jpg',
  url = 'https://oentex.com',
  type = 'website',
  structuredData,
  canonical,
  noindex = false,
  nofollow = false
}) => {
  const fullTitle = title.includes('Oentex') ? title : `${title} | Oentex`
  const fullUrl = url.startsWith('http') ? url : `https://oentex.com${url}`
  const fullImage = image.startsWith('http') ? image : `https://oentex.com${image}`

  const robotsContent = []
  if (noindex) robotsContent.push('noindex')
  if (nofollow) robotsContent.push('nofollow')
  if (!noindex && !nofollow) robotsContent.push('index', 'follow')

  useEffect(() => {
    // Update document title
    document.title = fullTitle

    // Helper function to update or create meta tags
    const updateMetaTag = (property: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`
      let meta = document.querySelector(selector) as HTMLMetaElement
      
      if (!meta) {
        meta = document.createElement('meta')
        if (isProperty) {
          meta.setAttribute('property', property)
        } else {
          meta.setAttribute('name', property)
        }
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    // Update basic meta tags
    updateMetaTag('description', description)
    updateMetaTag('keywords', keywords)
    updateMetaTag('robots', robotsContent.join(', '))
    updateMetaTag('author', 'Oentex')
    updateMetaTag('theme-color', '#000000')
    updateMetaTag('msapplication-TileColor', '#000000')

    // Update Open Graph tags
    updateMetaTag('og:type', type, true)
    updateMetaTag('og:url', fullUrl, true)
    updateMetaTag('og:title', fullTitle, true)
    updateMetaTag('og:description', description, true)
    updateMetaTag('og:image', fullImage, true)
    updateMetaTag('og:site_name', 'Oentex', true)
    updateMetaTag('og:locale', 'en_US', true)

    // Update Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image')
    updateMetaTag('twitter:url', fullUrl)
    updateMetaTag('twitter:title', fullTitle)
    updateMetaTag('twitter:description', description)
    updateMetaTag('twitter:image', fullImage)

    // Update canonical URL
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
      if (!canonicalLink) {
        canonicalLink = document.createElement('link')
        canonicalLink.setAttribute('rel', 'canonical')
        document.head.appendChild(canonicalLink)
      }
      canonicalLink.setAttribute('href', canonical)
    }

    // Add structured data
    if (structuredData) {
      // Remove existing structured data script
      const existingScript = document.querySelector('script[type="application/ld+json"]')
      if (existingScript) {
        existingScript.remove()
      }

      // Add new structured data script
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(structuredData)
      document.head.appendChild(script)
    }
  }, [fullTitle, description, keywords, fullUrl, fullImage, type, canonical, structuredData, robotsContent])

  // This component doesn't render anything visible
  return null
}

export default SEO