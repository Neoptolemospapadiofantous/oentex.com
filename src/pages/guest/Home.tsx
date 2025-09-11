import Hero from '@components/Hero'
import Features from '@components/Features'
import Stats from '@components/Stats'
import Newsletter from '@components/Newsletter'
import CTA from '@components/CTA'
import GuestLayout from '../../layouts/GuestLayout'

const Home = () => {
  return (
    <GuestLayout>
      <div className="min-h-screen">
        <Hero />
        <div className="section-py-xl">
          <Features />
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
    </GuestLayout>
  )
}

export default Home