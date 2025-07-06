import React from 'react'
import { ArrowRight, Zap, Gift, TrendingUp } from 'lucide-react'

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl"></div>
          
          <div className="relative bg-surface/50 backdrop-blur-lg rounded-3xl border border-border p-8 lg:p-12">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-6">
                <Gift className="w-4 h-4 text-primary mr-2" />
                <span className="text-sm text-primary font-medium">Limited Time Offer</span>
              </div>
              
              <h2 className="text-4xl lg:text-6xl font-bold text-text mb-6">
                Start Trading Today
                <br />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Get $50 Bonus
                </span>
              </h2>
              
              <p className="text-xl text-textSecondary mb-8 max-w-3xl mx-auto">
                Join over 500,000 traders who trust CryptoVault. Sign up now and receive a $50 trading bonus 
                to kickstart your crypto journey. No hidden fees, no commitments.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <button className="group bg-gradient-to-r from-primary to-secondary px-8 py-4 rounded-full text-white font-semibold text-lg hover:shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                  <Zap className="mr-2 w-5 h-5" />
                  Start Trading Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button className="group flex items-center justify-center px-8 py-4 border border-border rounded-full text-text hover:bg-surface transition-all duration-300">
                  <TrendingUp className="mr-2 w-5 h-5" />
                  View Live Prices
                </button>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">$0</span>
                  </div>
                  <h3 className="font-semibold text-text mb-1">Zero Fees</h3>
                  <p className="text-sm text-textSecondary">No account opening or maintenance fees</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-secondary to-accent rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">5min</span>
                  </div>
                  <h3 className="font-semibold text-text mb-1">Quick Setup</h3>
                  <p className="text-sm text-textSecondary">Get verified and start trading in minutes</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent to-primary rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">24/7</span>
                  </div>
                  <h3 className="font-semibold text-text mb-1">Always Open</h3>
                  <p className="text-sm text-textSecondary">Trade cryptocurrencies around the clock</p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-textSecondary">
                  * $50 bonus credited after first deposit of $100 or more. Terms and conditions apply.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA
