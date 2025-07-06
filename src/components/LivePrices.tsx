import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, ArrowRight, Wifi, WifiOff } from 'lucide-react'
import { Link } from 'react-router-dom'

interface CryptoPrice {
  symbol: string
  name: string
  price: number
  change24h: number
  volume: string
}

const LivePrices = () => {
  const [prices, setPrices] = useState<Record<string, CryptoPrice>>({})
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  // Crypto symbols mapping
  const cryptoConfig = {
    'BTCUSDT': { symbol: 'BTC', name: 'Bitcoin' },
    'ETHUSDT': { symbol: 'ETH', name: 'Ethereum' },
    'ADAUSDT': { symbol: 'ADA', name: 'Cardano' },
    'DOTUSDT': { symbol: 'DOT', name: 'Polkadot' },
    'SOLUSDT': { symbol: 'SOL', name: 'Solana' }
  }

  const formatVolume = (volume: number): string => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(1)}B`
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(1)}M`
    return `$${volume.toFixed(0)}`
  }

  const formatPrice = (price: number): string => {
    if (price >= 1) return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    return price.toFixed(6)
  }

  useEffect(() => {
    // Create WebSocket connection for multiple symbols
    const symbols = Object.keys(cryptoConfig).map(s => `${s.toLowerCase()}@ticker`).join('/')
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbols}`)

    ws.onopen = () => {
      console.log('Connected to Binance WebSocket')
      setIsConnected(true)
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        const symbol = data.s // e.g., "BTCUSDT"
        const config = cryptoConfig[symbol as keyof typeof cryptoConfig]
        
        if (config) {
          const volume = parseFloat(data.v) * parseFloat(data.c) // volume * current price
          
          setPrices(prev => ({
            ...prev,
            [symbol]: {
              symbol: config.symbol,
              name: config.name,
              price: parseFloat(data.c), // current price
              change24h: parseFloat(data.P), // 24h price change percent
              volume: formatVolume(volume)
            }
          }))
          
          setLastUpdate(new Date())
        }
      } catch (error) {
        console.error('Error parsing WebSocket data:', error)
      }
    }

    ws.onclose = () => {
      console.log('Disconnected from Binance WebSocket')
      setIsConnected(false)
      
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        window.location.reload()
      }, 3000)
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      setIsConnected(false)
    }

    // Cleanup on unmount
    return () => {
      ws.close()
    }
  }, [])

  const priceArray = Object.values(prices)

  return (
    <section className="py-20 bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-text">
              Live Market Prices
            </h2>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              isConnected ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
            }`}>
              {isConnected ? (
                <>
                  <Wifi className="w-4 h-4" />
                  Live
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4" />
                  Reconnecting...
                </>
              )}
            </div>
          </div>
          <p className="text-textSecondary">
            Real-time cryptocurrency prices via Binance WebSocket
            {lastUpdate && isConnected && (
              <span className="block text-sm mt-1">
                Last update: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>

        {priceArray.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-textSecondary">Connecting to live data feed...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {priceArray.map((crypto) => (
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
                      ${formatPrice(crypto.price)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-textSecondary text-sm">24h Volume</span>
                    <span className="text-text font-medium">{crypto.volume}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <Link
                    to={`/deals?asset=${crypto.symbol.toLowerCase()}`}
                    className="block w-full bg-gradient-to-r from-primary/20 to-secondary/20 hover:from-primary/30 hover:to-secondary/30 px-4 py-2 rounded-lg text-primary font-medium transition-all duration-300 group-hover:scale-105 text-center"
                  >
                    View {crypto.symbol} Deals
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/deals"
            className="inline-flex items-center bg-gradient-to-r from-primary to-secondary px-8 py-3 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105"
          >
            Explore All Deals
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default LivePrices