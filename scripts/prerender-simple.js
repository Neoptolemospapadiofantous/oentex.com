import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Routes to prerender
const routes = [
  '/',
  '/about',
  '/deals',
  '/faq',
  '/contact',
  '/terms',
  '/privacy',
  '/authentication'
]

// SEO data for each route
const seoData = {
  '/': {
    title: 'Best Crypto Investment Platform Reviews & Exchange Ratings 2025 | Oentex',
    description: 'Discover the best cryptocurrency exchanges, crypto investment platforms, and trading apps. Get expert reviews, ratings, and exclusive bonuses from top crypto exchanges like Binance, Coinbase, and more. Compare fees, features, and find the best crypto investment platform for your needs.',
    keywords: 'best crypto investment platform, top cryptocurrency exchanges, crypto investment app review, cryptocurrency trading platform, bitcoin investment platform, crypto portfolio tracker, cryptocurrency investment guide, crypto trading bot review, coinbase vs binance, crypto exchange comparison, best crypto wallet 2025, cryptocurrency platform reviews, crypto trading fees comparison, bitcoin vs ethereum investment, cryptocurrency investment platform with lowest fees, best crypto exchange for beginners, automated crypto investment platform, DeFi investment platforms, crypto staking rewards, NFT investment opportunities'
  },
  '/about': {
    title: 'About Oentex - Expert Crypto Exchange Reviews & Investment Platform Ratings',
    description: 'Oentex provides comprehensive reviews, ratings, and exclusive affiliate deals for the best cryptocurrency exchanges, trading platforms, and investment apps. Get expert analysis of crypto platforms, compare fees, and discover the best crypto investment opportunities with our trusted affiliate recommendations.',
    keywords: 'crypto exchange reviews, cryptocurrency platform ratings, crypto investment platform reviews, best crypto exchange comparison, cryptocurrency trading platform analysis, crypto affiliate links, exchange ratings and reviews, cryptocurrency investment guides, crypto platform recommendations, trusted crypto reviews'
  },
  '/deals': {
    title: 'Best Cryptocurrency Exchange Deals & Bonuses 2025 | Compare Top Crypto Platforms',
    description: 'Compare the best cryptocurrency exchanges with exclusive bonuses and deals. Get detailed reviews, ratings, and comparison of top crypto trading platforms including Binance, Coinbase, Kraken, and more. Find the best crypto exchange for beginners with lowest fees and highest rewards.',
    keywords: 'best cryptocurrency exchanges, crypto exchange comparison, coinbase vs binance, crypto trading fees comparison, best crypto exchange for beginners, cryptocurrency platform reviews, crypto investment platform with lowest fees, top cryptocurrency exchanges, cryptocurrency trading platform, crypto staking rewards, DeFi investment platforms, automated crypto investment platform, crypto trading bot review, bitcoin vs ethereum investment, crypto exchange deals, cryptocurrency exchange bonuses'
  },
  '/faq': {
    title: 'Cryptocurrency Investment FAQ - How to Invest in Crypto Safely | Oentex',
    description: 'Get answers to common cryptocurrency investment questions. Learn how to invest in crypto safely, choose the best crypto exchange, understand trading fees, and discover the best crypto investment strategies for beginners and advanced investors.',
    keywords: 'how to invest in cryptocurrency, crypto investment strategies, cryptocurrency for beginners, bitcoin investment guide, crypto market analysis, cryptocurrency investment tips, crypto portfolio diversification, altcoin investment opportunities, crypto investment platform with lowest fees, best crypto exchange for beginners, automated crypto investment platform, crypto staking rewards, DeFi investment platforms, NFT investment opportunities, cryptocurrency retirement accounts, crypto dollar-cost averaging, institutional crypto investment'
  },
  '/contact': {
    title: 'Contact Oentex - Get Crypto Investment Platform Support & Expert Advice',
    description: 'Contact Oentex for expert advice on cryptocurrency exchanges, crypto investment platforms, and trading strategies. Get support with platform recommendations, affiliate deals, and crypto investment guidance from our experienced team.',
    keywords: 'crypto investment support, cryptocurrency platform help, crypto exchange customer service, crypto investment advice, cryptocurrency trading support, crypto platform recommendations, crypto affiliate support, cryptocurrency investment guidance'
  },
  '/terms': {
    title: 'Terms and Conditions - Oentex',
    description: 'Read Oentex\'s terms and conditions, user agreement, and legal information.',
    keywords: 'terms and conditions, user agreement, legal, oentex terms'
  },
  '/privacy': {
    title: 'Privacy Policy - Oentex',
    description: 'Learn how Oentex protects your privacy and handles your personal information.',
    keywords: 'privacy policy, data protection, personal information, oentex privacy'
  },
  '/authentication': {
    title: 'Sign In / Register - Oentex',
    description: 'Sign in to your Oentex account or create a new one to access exclusive deals and personalized recommendations.',
    keywords: 'sign in, register, login, account, oentex account'
  }
}

async function prerenderSimple() {
  console.log('🚀 Starting simple prerendering process...')
  
  try {
    // Read the base index.html file
    const baseHtmlPath = path.join(__dirname, '../dist/index.html')
    const baseHtml = await fs.readFile(baseHtmlPath, 'utf-8')
    
    for (const route of routes) {
      console.log(`📄 Processing ${route}...`)
      
      const seo = seoData[route]
      let enhancedHtml = baseHtml
      
      if (seo) {
        // Add or update title
        enhancedHtml = enhancedHtml.replace(
          /<title>.*?<\/title>/,
          `<title>${seo.title}</title>`
        )
        
        // Add or update meta description
        if (enhancedHtml.includes('name="description"')) {
          enhancedHtml = enhancedHtml.replace(
            /<meta name="description" content="[^"]*" \/>/,
            `<meta name="description" content="${seo.description}" />`
          )
        } else {
          enhancedHtml = enhancedHtml.replace(
            '<head>',
            `<head>\n    <meta name="description" content="${seo.description}" />`
          )
        }
        
        // Add or update meta keywords
        if (enhancedHtml.includes('name="keywords"')) {
          enhancedHtml = enhancedHtml.replace(
            /<meta name="keywords" content="[^"]*" \/>/,
            `<meta name="keywords" content="${seo.keywords}" />`
          )
        } else {
          enhancedHtml = enhancedHtml.replace(
            '<head>',
            `<head>\n    <meta name="keywords" content="${seo.keywords}" />`
          )
        }
        
        // Add Open Graph tags
        const ogTags = `
    <meta property="og:title" content="${seo.title}" />
    <meta property="og:description" content="${seo.description}" />
    <meta property="og:url" content="https://oentex.com${route}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${seo.title}" />
    <meta name="twitter:description" content="${seo.description}" />`
        
        enhancedHtml = enhancedHtml.replace('</head>', `${ogTags}\n  </head>`)
      }
      
      // Save the prerendered HTML
      const outputPath = path.join(__dirname, '../dist', route === '/' ? 'index.html' : `${route.slice(1)}/index.html`)
      
      // Create directory if it doesn't exist
      await fs.mkdir(path.dirname(outputPath), { recursive: true })
      
      await fs.writeFile(outputPath, enhancedHtml)
      console.log(`✅ Saved ${outputPath}`)
    }
    
    console.log('🎉 Simple prerendering complete!')
    
    // Generate sitemap
    console.log('🗺️ Generating sitemap...')
    try {
      const { execSync } = await import('child_process')
      execSync('node scripts/generate-sitemap.js', { stdio: 'inherit' })
    } catch (error) {
      console.warn('⚠️ Failed to generate sitemap:', error.message)
    }
    
  } catch (error) {
    console.error('❌ Simple prerendering failed:', error)
    process.exit(1)
  }
}

prerenderSimple()
