import React from 'react'
import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Stats from '../components/Stats'
import Newsletter from '../components/Newsletter'
import CTA from '../components/CTA'

const Home = () => {
  return (
    <motion.div 
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />
      <Features />
      <Stats />
      <Newsletter />
      <CTA />
    </motion.div>
  )
}

export default Home