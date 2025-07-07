import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import PageTransition from './components/PageTransition'

// Pages
import Home from './pages/Home'
import About from './pages/About'
import Deals from './pages/Deals'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-text overflow-x-hidden">
        <ScrollToTop />
        <Header />
        <PageTransition>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/test" element={<Test />} />
          </Routes>
        </PageTransition>
        <Footer />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#262626',
              color: '#FFFFFF',
              border: '1px solid #2F2F2F',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#FFFFFF',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#FFFFFF',
              },
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App
