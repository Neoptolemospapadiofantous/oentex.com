import React from 'react'
import Hero from '../components/Hero'
import LivePrices from '../components/LivePrices'
import Features from '../components/Features'
import Stats from '../components/Stats'
import Newsletter from '../components/Newsletter'
import CTA from '../components/CTA'

const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <LivePrices />
      <Features />
      <Stats />
      <Newsletter />
      <CTA />
    </div>
  )
}

export default Home
