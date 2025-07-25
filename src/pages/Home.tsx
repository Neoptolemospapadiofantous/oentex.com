import Hero from '../components/Hero'
import Features from '../components/Features'
import Stats from '../components/Stats'
import Newsletter from '../components/Newsletter'
import CTA from '../components/CTA'

const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Stats />
      <Newsletter />
      <CTA />
    </div>
  )
}

export default Home
