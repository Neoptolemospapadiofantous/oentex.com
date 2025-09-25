import React from 'react'
import { Helmet } from 'react-helmet-async'

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

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robotsContent.join(', ')} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="Oentex" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Additional SEO Meta Tags */}
      <meta name="author" content="Oentex" />
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  )
}

export default SEO
