// SEO data for different pages
export const seoData = {
  home: {
    title: 'Oentex - Your Gateway to Financial Freedom',
    description: 'Discover exclusive bonuses and deals from top crypto exchanges, stock brokers, banks, and investment platforms. Compare offers and maximize your financial potential with Oentex.',
    keywords: 'cryptocurrency, trading, investment, stocks, forex, banking, financial deals, trading bonuses, crypto exchanges, stock brokers',
    url: 'https://oentex.com',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Oentex',
      url: 'https://oentex.com',
      description: 'Your Gateway to Financial Freedom',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://oentex.com/deals?search={search_term_string}',
        'query-input': 'required name=search_term_string'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Oentex',
        logo: {
          '@type': 'ImageObject',
          url: 'https://oentex.com/logo.png'
        }
      }
    }
  },

  about: {
    title: 'About Oentex - Trusted Reviews & Exclusive Deals',
    description: 'Learn about Oentex\'s mission to provide honest reviews, ratings, and the best deals across tech gadgets, software tools, online courses, and financial services.',
    keywords: 'about oentex, company mission, reviews platform, deal discovery, trusted recommendations',
    url: 'https://oentex.com/about',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About Oentex',
      description: 'Learn about Oentex\'s mission to provide honest reviews and exclusive deals',
      url: 'https://oentex.com/about',
      mainEntity: {
        '@type': 'Organization',
        name: 'Oentex',
        description: 'A trusted platform providing honest reviews, ratings, and exclusive deals across multiple categories',
        url: 'https://oentex.com',
        logo: 'https://oentex.com/logo.png',
        sameAs: []
      }
    }
  },

  deals: {
    title: 'Trading Deals & Exclusive Bonuses - Oentex',
    description: 'Browse curated trading deals, exclusive bonuses, and special offers from top crypto exchanges, stock brokers, and investment platforms. Real ratings and reviews.',
    keywords: 'trading deals, crypto bonuses, stock broker offers, investment platforms, exclusive deals, trading bonuses',
    url: 'https://oentex.com/deals',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Trading Deals & Exclusive Bonuses',
      description: 'Curated collection of trading deals and exclusive bonuses from verified platforms',
      url: 'https://oentex.com/deals',
      numberOfItems: 50,
      itemListElement: []
    }
  },

  faq: {
    title: 'Frequently Asked Questions - Oentex',
    description: 'Find answers to common questions about Oentex, our review process, how to claim deals, and more. Get help with your trading and investment journey.',
    keywords: 'FAQ, help, support, questions, answers, oentex help, trading help',
    url: 'https://oentex.com/faq'
  },

  contact: {
    title: 'Contact Oentex - Get in Touch',
    description: 'Contact Oentex for support, partnerships, or feedback. We\'re here to help with your trading and investment needs.',
    keywords: 'contact oentex, support, help, feedback, partnerships, customer service',
    url: 'https://oentex.com/contact',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact Oentex',
      description: 'Get in touch with Oentex for support and partnerships',
      url: 'https://oentex.com/contact'
    }
  },

  terms: {
    title: 'Terms and Conditions - Oentex',
    description: 'Read Oentex\'s terms and conditions, user agreement, and legal information.',
    keywords: 'terms and conditions, user agreement, legal, oentex terms',
    url: 'https://oentex.com/terms',
    noindex: true
  },

  privacy: {
    title: 'Privacy Policy - Oentex',
    description: 'Learn how Oentex protects your privacy and handles your personal information.',
    keywords: 'privacy policy, data protection, personal information, oentex privacy',
    url: 'https://oentex.com/privacy',
    noindex: true
  },

  authentication: {
    title: 'Sign In / Register - Oentex',
    description: 'Sign in to your Oentex account or create a new one to access exclusive deals and personalized recommendations.',
    keywords: 'sign in, register, login, account, oentex account',
    url: 'https://oentex.com/authentication',
    noindex: true
  },

  dashboard: {
    title: 'Dashboard - Oentex',
    description: 'Access your personalized Oentex dashboard with saved deals, ratings, and recommendations.',
    url: 'https://oentex.com/dashboard',
    noindex: true,
    nofollow: true
  },

  profile: {
    title: 'Profile - Oentex',
    description: 'Manage your Oentex profile settings and preferences.',
    url: 'https://oentex.com/profile',
    noindex: true,
    nofollow: true
  }
}

// Helper function to get SEO data for a specific route
export const getSEOData = (route: string, customData?: Partial<typeof seoData.home>) => {
  const baseData = seoData[route as keyof typeof seoData] || seoData.home
  return { ...baseData, ...customData }
}

// Generate structured data for deals page with actual deals
export const generateDealsStructuredData = (deals: any[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Trading Deals & Exclusive Bonuses',
    description: 'Curated collection of trading deals and exclusive bonuses from verified platforms',
    url: 'https://oentex.com/deals',
    numberOfItems: deals.length,
    itemListElement: deals.slice(0, 10).map((deal, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Offer',
        name: deal.title || `${deal.company?.name} Deal`,
        description: deal.description,
        url: deal.affiliate_link,
        price: deal.bonus_amount || deal.discount_percentage,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: deal.company?.name,
          url: deal.company?.website
        },
        aggregateRating: deal.company?.overall_rating ? {
          '@type': 'AggregateRating',
          ratingValue: deal.company.overall_rating,
          reviewCount: deal.company.total_reviews
        } : undefined
      }
    }))
  }
}
