import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface CryptoPrice {
  symbol: string
  name: string
  price: number
  change24h: number
  volume: string
}

const LivePrices = () => {
  const [prices, setPrices] = useState<CryptoPrice[]>([
    { symbol: 'BTC', name: 'Bitcoin', price: 45234.56, change24h: 2.34, volume: '$28.5B' },
    { symbol: 'ETH', name: 'Ethereum', price: 3456.78, change24h: -1.23, volume: '$15.2B' },
    { symbol: 'ADA', name: 'Cardano', price: 1.23, change24h: 5.67, volume: '$2.1B' },
    { symbol: 'DOT', name: 'Polkadot', price: 23.45, change24h: -0.89, volume: '$1.8B' },
    { symbol: 'SOL', name: 'Solana', price: 156.78, change24h: 3.45, volume: '$3.2B' },
    { symbol: 'AVAX', name: 'Avalanche', price: 89.12, change24h: 1.78, volume: '$1.5B' }
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prevPrices => 
        prevPrices.map(price => ({
          ...price,
          price: price.price * (1 + (Math.random() - 0.5) * 0.02),
          change24h: price.change24h + (Math.random() - 0.5) * 0.5
        }))
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20 bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-text mb-4">
            Live Crypto Prices
          </h2>
          <p className="text-textSecondary">
            Real-time cryptocurrency prices and market data
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prices.map((crypto, index) => (
            <div 
              key={crypto.symbol}
              className="bg-surface/50 backdrop-blur-lg rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">{crypto.symbol}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-text">{crypto.name}</h3>
                    <p className="text-textSecondary text-sm">{crypto.symbol}</p>
                  </div>
                </div>
                <div className={`flex items-center ${crypto.change24h >= 0 ? 'text-success' : 'text-error'}`}>
                  {crypto.change24h >= 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  <span className="text-sm font-medium">
                    {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-textSecondary text-sm">Price</span>
                  <span className="text-text font-semibold">
                    ${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-textSecondary text-sm">24h Volume</span>
                  <span className="text-text font-medium">{crypto.volume}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <button className="w-full bg-gradient-to-r from-primary/20 to-secondary/20 hover:from-primary/30 hover:to-secondary/30 px-4 py-2 rounded-lg text-primary font-medium transition-all duration-300 group-hover:scale-105">
                  Trade {crypto.symbol}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/deals"
            className="inline-flex items-center bg-gradient-to-r from-primary to-secondary px-8 py-3 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105"
          >
            Start Trading Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default LivePrices