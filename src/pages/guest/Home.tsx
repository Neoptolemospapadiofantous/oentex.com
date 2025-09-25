import Hero from '@components/Hero'
import Features from '@components/Features'
import Stats from '@components/Stats'
import Newsletter from '@components/Newsletter'
import CTA from '@components/CTA'
import AdUnit from '@components/AdUnit'
import SEO from '@components/SEO'

const Home = () => {
  return (
    <>
      <SEO 
        title="Best Crypto Investment Platform Reviews & Exchange Ratings 2025 | Oentex"
        description="Discover the best cryptocurrency exchanges, crypto investment platforms, and trading apps. Get expert reviews, ratings, and exclusive bonuses from top crypto exchanges like Binance, Coinbase, and more. Compare fees, features, and find the best crypto investment platform for your needs."
        keywords="best crypto investment platform, top cryptocurrency exchanges, crypto investment app review, cryptocurrency trading platform, bitcoin investment platform, crypto portfolio tracker, cryptocurrency investment guide, crypto trading bot review, coinbase vs binance, crypto exchange comparison, best crypto wallet 2025, cryptocurrency platform reviews, crypto trading fees comparison, bitcoin vs ethereum investment, cryptocurrency investment platform with lowest fees, best crypto exchange for beginners, automated crypto investment platform, DeFi investment platforms, crypto staking rewards, NFT investment opportunities"
        url="https://oentex.com"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Oentex",
          "url": "https://oentex.com",
          "description": "Your Gateway to Financial Freedom",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://oentex.com/deals?search={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }}
      />
      <div className="min-h-screen">
        <Hero />
        <div className="section-py-xl">
          <Features />
        </div>
        
        {/* Ad Unit */}
        <div className="w-full flex justify-center items-center py-8">
          <div className="w-full max-w-4xl px-4">
            <AdUnit />
          </div>
        </div>
        
        <div className="section-py-xl">
          <Stats />
        </div>
        <div className="section-py-xl">
          <Newsletter />
        </div>
        <div className="section-py-xl">
          <CTA />
        </div>
      </div>
    </>
  )
}

export default Home