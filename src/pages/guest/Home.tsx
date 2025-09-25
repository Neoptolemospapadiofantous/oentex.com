import Hero from '@components/Hero'
import Features from '@components/Features'
import Stats from '@components/Stats'
import Newsletter from '@components/Newsletter'
import CTA from '@components/CTA'
import AdUnit from '@components/AdUnit'

const Home = () => {
  return (
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
  )
}

export default Home