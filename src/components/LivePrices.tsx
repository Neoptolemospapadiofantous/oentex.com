import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, ArrowRight, Wifi, WifiOff } from 'lucide-react'
import { Link } from 'react-router-dom'

interface CryptoPrice {
  symbol: string
  name: string
  price: number
  change24h: number
  volume: string
  image?: string
}

const LivePrices = () => {
  const [prices, setPrices] = useState<CryptoPrice[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

  // Crypto symbols with working images
  const cryptoConfig = {
    'BTCUSDT': { 
      symbol: 'BTC', 
      name: 'Bitcoin',
      image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=025'
    },
    'ETHUSDT': { 
      symbol: 'ETH', 
      name: 'Ethereum',
      image: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=025'
    },
    'ADAUSDT': { 
      symbol: 'ADA', 
      name: 'Cardano',
      image: 'https://cryptologos.cc/logos/cardano-ada-logo.svg?v=025'
    },
    'DOTUSDT': { 
      symbol: 'DOT', 
      name: 'Polkadot',
      image: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.svg?v=025'
    },
    'SOLUSDT': { 
      symbol: 'SOL', 
      name: 'Solana',
      image: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=025'
    },
    'AVAXUSDT': { 
      symbol: 'AVAX', 
      name: 'Avalanche',
      image: 'https://cryptologos.cc/logos/avalanche-avax-logo.svg?v=025'
    }
  }

  const handleImageError = (symbol: string) => {
    setImageErrors(prev => new Set([...prev, symbol]))
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
    console.log('Connecting to Binance WebSocket...')
    
    // Create WebSocket connection - Fixed URL format
    const symbols = Object.keys(cryptoConfig).map(s => `${s.toLowerCase()}@ticker`).join('/')
    const wsUrl = `wss://stream.binance.com:9443/ws/${symbols}`
    
    console.log('WebSocket URL:', wsUrl)
    
    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      console.log('✅ Connected to Binance WebSocket')
      setIsConnected(true)
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('📊 Received data for:', data.s, 'Price:', data.c)
        
        const symbol = data.s // e.g., "BTCUSDT"
        const config = cryptoConfig[symbol as keyof typeof cryptoConfig]
        
        if (config) {
          const volume = parseFloat(data.v) * parseFloat(data.c) // volume * current price
          
          setPrices(prev => {
            const updatedPrices = prev.filter(p => p.symbol !== config.symbol)
            return [...updatedPrices, {
              symbol: config.symbol,
              name: config.name,
              price: parseFloat(data.c), // current price
              change24h: parseFloat(data.P), // 24h price change percent
              volume: formatVolume(volume),
              image: config.image
            }]
          })
          
          setLastUpdate(new Date())
        }
      } catch (error) {
        console.error('Error parsing WebSocket data:', error)
      }
    }

    ws.onclose = (event) => {
      console.log('🔌 Disconnected from Binance WebSocket', event.code, event.reason)
      setIsConnected(false)
    }

    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error)
      setIsConnected(false)
    }

    // Cleanup on unmount
    return () => {
      console.log('Cleaning up WebSocket connection')
      ws.close()
    }
  }, [])

  // Sort prices by symbol for consistent order
  const sortedPrices = prices.sort((a, b) => {
    const order = ['BTC', 'ETH', 'ADA', 'DOT', 'SOL', 'AVAX']
    return order.indexOf(a.symbol) - order.indexOf(b.symbol)
  })

  return (
    <section className="py-20 bg-gradient-to-br from-surface to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-text">
              Live Market Prices
            </h2>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm border ${
              isConnected 
                ? 'bg-secondaryMuted text-success border-success/30' 
                : 'bg-accentMuted text-error border-error/30'
            }`}>
              {isConnected ? (
                <>
                  <Wifi className="w-4 h-4" />
                  Live
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4" />
                  Connecting...
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

        {sortedPrices.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-textSecondary">Connecting to live data feed...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPrices.map((crypto) => (
              <div 
                key={crypto.symbol}
                className="bg-background border border-border rounded-2xl p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mr-3 overflow-hidden bg-surface border border-border">
                      {crypto.image && !imageErrors.has(crypto.symbol) ? (
                        <img 
                          src={crypto.image} 
                          alt={crypto.name}
                          className="w-8 h-8 object-contain"
                          onError={() => handleImageError(crypto.symbol)}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{crypto.symbol}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-text">{crypto.name}</h3>
                      <p className="text-textSecondary text-sm">{crypto.symbol}</p>
                    </div>
                  </div>
                  <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    crypto.change24h >= 0 
                      ? 'text-success bg-secondaryMuted' 
                      : 'text-error bg-accentMuted'
                  }`}>
                    {crypto.change24h >= 0 ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    <span>
                      {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-textSecondary text-sm">Price</span>
                    <span className="text-text font-semibold text-lg">
                      ${formatPrice(crypto.price)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-textSecondary text-sm">24h Volume</span>
                    <span className="text-text font-medium">{crypto.volume}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                  <Link
                    to={`/deals?asset=${crypto.symbol.toLowerCase()}`}
                    className="block w-full bg-gradient-to-r from-primaryMuted to-secondaryMuted hover:from-primary/20 hover:to-secondary/20 px-4 py-3 rounded-lg text-primary font-medium transition-all duration-300 group-hover:scale-105 text-center border border-primary/20 hover:border-primary/40"
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
            className="inline-flex items-center bg-gradient-to-r from-primary to-primaryHover px-8 py-3 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105"
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
