import React, { useState, useEffect, useRef, useCallback } from 'react'
import { TrendingUp, TrendingDown, ArrowRight, Wifi, WifiOff, BarChart3, ExternalLink, Award, AlertTriangle } from 'lucide-react'

interface CryptoPrice {
  symbol: string
  name: string
  price: number
  change24h: number
  volume: string
  image?: string
}

interface ExchangePrice {
  exchange: string
  price: number
  change24h: number
  volume: string
  logo: string
  affiliateUrl: string
  isConnected: boolean
  lastUpdate?: Date
  fees: {
    maker: number
    taker: number
  }
  bonus?: string
}

interface CryptoComparison {
  symbol: string
  name: string
  image?: string
  exchanges: ExchangePrice[]
  bestBuyPrice?: ExchangePrice
  bestSellPrice?: ExchangePrice
  priceSpread?: number
}

const LivePrices = () => {
  const [prices, setPrices] = useState<CryptoPrice[]>([])
  const [comparisons, setComparisons] = useState<CryptoComparison[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<Record<string, boolean>>({})
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [selectedView, setSelectedView] = useState<'simple' | 'comparison'>('comparison')

  // UNIFIED REFRESH SYSTEM - 1 second intervals
  const UNIFIED_UPDATE_INTERVAL = 1000
  const exchangeBuffers = useRef<Record<string, Record<string, any>>>({})
  const lastUnifiedUpdate = useRef<Record<string, number>>({})

  // Exchange configurations
  const exchangeConfigs = {
    binance: {
      name: 'Binance',
      logo: '🟡',
      affiliateUrl: 'https://accounts.binance.com/register?ref=YOUR_REF_ID',
      fees: { maker: 0.1, taker: 0.1 },
      bonus: '20% Fee Discount'
    },
    coinbase: {
      name: 'Coinbase',
      logo: '🔵',
      affiliateUrl: 'https://coinbase.com/join/YOUR_REF_ID',
      fees: { maker: 0.5, taker: 0.5 },
      bonus: '$10 Free Bitcoin'
    },
    kraken: {
      name: 'Kraken',
      logo: '🐙',
      affiliateUrl: 'https://kraken.com/sign-up?ref=YOUR_REF_ID',
      fees: { maker: 0.16, taker: 0.26 },
      bonus: 'No Deposit Fees'
    },
    bybit: {
      name: 'Bybit',
      logo: '🟨',
      affiliateUrl: 'https://partner.bybit.com/b/YOUR_REF_ID',
      fees: { maker: 0.1, taker: 0.1 },
      bonus: '$30 Welcome Bonus'
    },
    okx: {
      name: 'OKX',
      logo: '⚫',
      affiliateUrl: 'https://okx.com/join/YOUR_REF_ID',
      fees: { maker: 0.08, taker: 0.1 },
      bonus: '$50 Trading Bonus'
    }
  }

  // Crypto symbols with alternative image sources
  const cryptoConfig = {
    'BTCUSDT': { 
      symbol: 'BTC', 
      name: 'Bitcoin',
      image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png'
    },
    'ETHUSDT': { 
      symbol: 'ETH', 
      name: 'Ethereum',
      image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png'
    },
    'ADAUSDT': { 
      symbol: 'ADA', 
      name: 'Cardano',
      image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png'
    },
    'DOTUSDT': { 
      symbol: 'DOT', 
      name: 'Polkadot',
      image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6636.png'
    },
    'SOLUSDT': { 
      symbol: 'SOL', 
      name: 'Solana',
      image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png'
    },
    'AVAXUSDT': { 
      symbol: 'AVAX', 
      name: 'Avalanche',
      image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png'
    }
  }

  // Unified update function with 1-second intervals
  const processUnifiedUpdate = useCallback((exchangeKey: string, symbol: string, rawData: any) => {
    const now = Date.now()
    const lastUpdate = lastUnifiedUpdate.current[`${exchangeKey}-${symbol}`] || 0
    
    // Always buffer the latest data
    if (!exchangeBuffers.current[exchangeKey]) {
      exchangeBuffers.current[exchangeKey] = {}
    }
    exchangeBuffers.current[exchangeKey][symbol] = {
      ...rawData,
      receivedAt: now
    }
    
    // Process updates every 1 second
    if (now - lastUpdate >= UNIFIED_UPDATE_INTERVAL) {
      lastUnifiedUpdate.current[`${exchangeKey}-${symbol}`] = now
      
      const bufferedData = exchangeBuffers.current[exchangeKey][symbol]
      if (bufferedData) {
        const { receivedAt, ...cleanData } = bufferedData
        updateComparison(symbol, exchangeKey, cleanData)
        setLastUpdate(new Date())
      }
    }
  }, [])

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

  const calculateSpread = (exchanges: ExchangePrice[]) => {
    const validPrices = exchanges.filter(e => e.isConnected && e.price > 0).map(e => e.price)
    if (validPrices.length < 2) return 0
    const highest = Math.max(...validPrices)
    const lowest = Math.min(...validPrices)
    return ((highest - lowest) / lowest) * 100
  }

  const getBestPrice = (exchanges: ExchangePrice[], type: 'buy' | 'sell') => {
    const validExchanges = exchanges.filter(e => e.isConnected && e.price > 0)
    if (validExchanges.length === 0) return null
    
    if (type === 'buy') {
      return validExchanges.reduce((min, current) => 
        current.price < min.price ? current : min
      )
    } else {
      return validExchanges.reduce((max, current) => 
        current.price > max.price ? current : max
      )
    }
  }

  const updateComparison = (symbol: string, exchangeKey: string, priceData: any, synchronizedTimestamp?: Date) => {
    const exchangeConfig = exchangeConfigs[exchangeKey as keyof typeof exchangeConfigs]
    const cryptoInfo = Object.values(cryptoConfig).find(c => c.symbol === symbol)
    
    if (!exchangeConfig || !cryptoInfo) return

    const exchangePrice: ExchangePrice = {
      exchange: exchangeConfig.name,
      price: priceData.price,
      change24h: priceData.change24h,
      volume: priceData.volume,
      logo: exchangeConfig.logo,
      affiliateUrl: exchangeConfig.affiliateUrl,
      isConnected: true,
      lastUpdate: synchronizedTimestamp || new Date(),
      fees: exchangeConfig.fees,
      bonus: exchangeConfig.bonus
    }

    setComparisons(prev => {
      const existing = prev.find(c => c.symbol === symbol)
      if (existing) {
        const updatedExchanges = [...existing.exchanges]
        const exchangeIndex = updatedExchanges.findIndex(e => e.exchange === exchangeConfig.name)
        
        if (exchangeIndex >= 0) {
          updatedExchanges[exchangeIndex] = exchangePrice
        } else {
          const exchangeOrder = ['Binance', 'Coinbase', 'Kraken', 'Bybit', 'OKX']
          const insertIndex = exchangeOrder.indexOf(exchangeConfig.name)
          if (insertIndex >= 0) {
            updatedExchanges.splice(insertIndex, 0, exchangePrice)
          } else {
            updatedExchanges.push(exchangePrice)
          }
        }
        
        const updated = {
          ...existing,
          exchanges: updatedExchanges,
          priceSpread: calculateSpread(updatedExchanges),
          bestBuyPrice: getBestPrice(updatedExchanges, 'buy'),
          bestSellPrice: getBestPrice(updatedExchanges, 'sell')
        }
        
        return prev.map(c => c.symbol === symbol ? updated : c)
      } else {
        const newComparison: CryptoComparison = {
          symbol,
          name: cryptoInfo.name,
          image: cryptoInfo.image,
          exchanges: [exchangePrice],
          priceSpread: 0,
          bestBuyPrice: exchangePrice,
          bestSellPrice: exchangePrice
        }
        
        const cryptoOrder = ['BTC', 'ETH', 'ADA', 'DOT', 'SOL', 'AVAX']
        const newPrev = [...prev, newComparison]
        return newPrev.sort((a, b) => {
          return cryptoOrder.indexOf(a.symbol) - cryptoOrder.indexOf(b.symbol)
        })
      }
    })
  }

  const handleAffiliateClick = (exchange: string, url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  useEffect(() => {
    const connections: WebSocket[] = []
    
    // 1. BINANCE WebSocket
    const connectBinance = () => {
      const symbols = Object.keys(cryptoConfig).map(s => `${s.toLowerCase()}@ticker`).join('/')
      const binanceWs = new WebSocket(`wss://stream.binance.com:9443/ws/${symbols}`)
      connections.push(binanceWs)

      binanceWs.onopen = () => {
        setIsConnected(true)
        setConnectionStatus(prev => ({ ...prev, binance: true }))
      }

      binanceWs.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          const symbol = data.s
          const config = cryptoConfig[symbol as keyof typeof cryptoConfig]
          
          if (config) {
            const volume = parseFloat(data.v) * parseFloat(data.c)
            
            setPrices(prev => {
              const updatedPrices = prev.filter(p => p.symbol !== config.symbol)
              return [...updatedPrices, {
                symbol: config.symbol,
                name: config.name,
                price: parseFloat(data.c),
                change24h: parseFloat(data.P),
                volume: formatVolume(volume),
                image: config.image
              }].sort((a, b) => {
                const order = ['BTC', 'ETH', 'ADA', 'DOT', 'SOL', 'AVAX']
                return order.indexOf(a.symbol) - order.indexOf(b.symbol)
              })
            })

            processUnifiedUpdate('binance', config.symbol, {
              price: parseFloat(data.c),
              change24h: parseFloat(data.P),
              volume: formatVolume(volume)
            })
          }
        } catch (error) {
          // Silently handle error
        }
      }

      binanceWs.onclose = () => {
        setConnectionStatus(prev => ({ ...prev, binance: false }))
      }

      binanceWs.onerror = () => {
        setConnectionStatus(prev => ({ ...prev, binance: false }))
      }

      return binanceWs
    }

    // 2. COINBASE Exchange WebSocket
    const connectCoinbase = () => {
      const coinbaseWs = new WebSocket('wss://ws-feed.exchange.coinbase.com')
      connections.push(coinbaseWs)

      coinbaseWs.onopen = () => {
        setConnectionStatus(prev => ({ ...prev, coinbase: true }))
        
        coinbaseWs.send(JSON.stringify({
          "type": "subscribe",
          "product_ids": ["BTC-USD", "ETH-USD", "ADA-USD", "DOT-USD", "SOL-USD", "AVAX-USD"],
          "channels": ["ticker"]
        }))
      }

      coinbaseWs.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          if (data.type === 'subscriptions' || data.type === 'error') {
            return
          }
          
          if (data.type === 'ticker' && data.product_id) {
            const symbol = data.product_id.replace('-USD', '')
            const cryptoInfo = Object.values(cryptoConfig).find(c => c.symbol === symbol)
            
            if (cryptoInfo && data.price) {
              const price = parseFloat(data.price)
              const open24h = parseFloat(data.open_24h) || price
              const change24h = open24h > 0 ? ((price - open24h) / open24h) * 100 : 0
              const volume24h = parseFloat(data.volume_24h) || 0
              
              processUnifiedUpdate('coinbase', symbol, {
                price: price,
                change24h: change24h,
                volume: formatVolume(volume24h * price)
              })
            }
          }
        } catch (error) {
          // Silently handle error
        }
      }

      coinbaseWs.onclose = () => {
        setConnectionStatus(prev => ({ ...prev, coinbase: false }))
      }

      coinbaseWs.onerror = () => {
        setConnectionStatus(prev => ({ ...prev, coinbase: false }))
      }

      return coinbaseWs
    }

    // 3. KRAKEN WebSocket
    const connectKraken = () => {
      const krakenWs = new WebSocket('wss://ws.kraken.com')
      connections.push(krakenWs)

      krakenWs.onopen = () => {
        setConnectionStatus(prev => ({ ...prev, kraken: true }))
        
        krakenWs.send(JSON.stringify({
          "event": "subscribe",
          "pair": ["XBT/USD", "ETH/USD", "ADA/USD", "DOT/USD", "SOL/USD", "AVAX/USD"],
          "subscription": {"name": "ticker"}
        }))
      }

      krakenWs.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          if (data.event === 'heartbeat' || data.event === 'subscriptionStatus') return
          
          if (Array.isArray(data) && data.length >= 4 && data[2] === 'ticker') {
            const tickerData = data[1]
            const pair = data[3]
            
            if (tickerData && tickerData.c && tickerData.c[0]) {
              let symbol = pair.replace('/USD', '').replace('XBT', 'BTC')
              const cryptoInfo = Object.values(cryptoConfig).find(c => c.symbol === symbol)
              
              if (cryptoInfo) {
                const price = parseFloat(tickerData.c[0])
                
                let change24h = 0
                if (tickerData.P && tickerData.P[1]) {
                  change24h = parseFloat(tickerData.P[1])
                } else if (tickerData.o && tickerData.o[1]) {
                  const open24h = parseFloat(tickerData.o[1])
                  change24h = open24h > 0 ? ((price - open24h) / open24h) * 100 : 0
                }
                
                const volume24h = parseFloat(tickerData.v && tickerData.v[1] ? tickerData.v[1] : '0') || 0
                
                processUnifiedUpdate('kraken', symbol, {
                  price: price,
                  change24h: change24h,
                  volume: formatVolume(volume24h * price)
                })
              }
            }
          }
        } catch (error) {
          // Silently handle error
        }
      }

      krakenWs.onclose = () => {
        setConnectionStatus(prev => ({ ...prev, kraken: false }))
      }

      krakenWs.onerror = () => {
        setConnectionStatus(prev => ({ ...prev, kraken: false }))
      }

      return krakenWs
    }

    // 4. BYBIT WebSocket
    const connectBybit = () => {
      const bybitWs = new WebSocket('wss://stream.bybit.com/v5/public/spot')
      connections.push(bybitWs)

      let heartbeatInterval: NodeJS.Timeout | null = null

      bybitWs.onopen = () => {
        setConnectionStatus(prev => ({ ...prev, bybit: true }))
        
        bybitWs.send(JSON.stringify({
          "op": "subscribe",
          "args": ["tickers.BTCUSDT", "tickers.ETHUSDT", "tickers.ADAUSDT", "tickers.DOTUSDT", "tickers.SOLUSDT", "tickers.AVAXUSDT"]
        }))

        heartbeatInterval = setInterval(() => {
          if (bybitWs.readyState === WebSocket.OPEN) {
            bybitWs.send(JSON.stringify({ "op": "ping" }))
          }
        }, 20000)
      }

      bybitWs.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          if (data.op === 'pong' || data.success) return
          
          if (data.topic && data.topic.startsWith('tickers.') && data.data) {
            const tickerData = data.data
            const symbol = tickerData.symbol.replace('USDT', '')
            const cryptoInfo = Object.values(cryptoConfig).find(c => c.symbol === symbol)
            
            if (cryptoInfo && tickerData.lastPrice) {
              const price = parseFloat(tickerData.lastPrice)
              const change24h = parseFloat(tickerData.price24hPcnt) * 100 || 0
              const volume24h = parseFloat(tickerData.volume24h) || 0
              
              processUnifiedUpdate('bybit', symbol, {
                price: price,
                change24h: change24h,
                volume: formatVolume(volume24h * price)
              })
            }
          }
        } catch (error) {
          // Silently handle error
        }
      }

      bybitWs.onclose = () => {
        setConnectionStatus(prev => ({ ...prev, bybit: false }))
        
        if (heartbeatInterval) {
          clearInterval(heartbeatInterval)
          heartbeatInterval = null
        }
      }

      bybitWs.onerror = () => {
        setConnectionStatus(prev => ({ ...prev, bybit: false }))
        
        if (heartbeatInterval) {
          clearInterval(heartbeatInterval)
          heartbeatInterval = null
        }
      }

      return bybitWs
    }

    // 5. OKX WebSocket
    const connectOKX = () => {
      const okxWs = new WebSocket('wss://ws.okx.com:8443/ws/v5/public')
      connections.push(okxWs)

      okxWs.onopen = () => {
        setConnectionStatus(prev => ({ ...prev, okx: true }))
        
        okxWs.send(JSON.stringify({
          "op": "subscribe",
          "args": [
            {"channel": "tickers", "instId": "BTC-USDT"},
            {"channel": "tickers", "instId": "ETH-USDT"},
            {"channel": "tickers", "instId": "ADA-USDT"},
            {"channel": "tickers", "instId": "DOT-USDT"},
            {"channel": "tickers", "instId": "SOL-USDT"},
            {"channel": "tickers", "instId": "AVAX-USDT"}
          ]
        }))
      }

      okxWs.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          if (data.event === 'subscribe') return
          
          if (data.arg && data.arg.channel === 'tickers' && data.data && data.data[0]) {
            const tickerData = data.data[0]
            const instId = data.arg.instId
            const symbol = instId.replace('-USDT', '')
            
            const cryptoInfo = Object.values(cryptoConfig).find(c => c.symbol === symbol)
            
            if (cryptoInfo && tickerData.last) {
              const price = parseFloat(tickerData.last)
              
              let change24h = 0
              if (tickerData.changeUtc8) {
                change24h = parseFloat(tickerData.changeUtc8) * 100
              } else if (tickerData.change24h) {
                change24h = parseFloat(tickerData.change24h) * 100
              } else if (tickerData.open24h) {
                const open24h = parseFloat(tickerData.open24h)
                change24h = open24h > 0 ? ((price - open24h) / open24h) * 100 : 0
              }
              
              const volume24h = parseFloat(tickerData.vol24h || '0') || 0
              
              processUnifiedUpdate('okx', symbol, {
                price: price,
                change24h: change24h,
                volume: formatVolume(volume24h * price)
              })
            }
          }
        } catch (error) {
          // Silently handle error
        }
      }

      okxWs.onclose = () => {
        setConnectionStatus(prev => ({ ...prev, okx: false }))
      }

      okxWs.onerror = () => {
        setConnectionStatus(prev => ({ ...prev, okx: false }))
      }

      return okxWs
    }

    // Connect to all exchanges with staggered delays
    connectBinance()
    setTimeout(() => connectCoinbase(), 1000)
    setTimeout(() => connectKraken(), 2000)
    setTimeout(() => connectBybit(), 3000)
    setTimeout(() => connectOKX(), 4000)

    // Cleanup function
    return () => {
      connections.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
          ws.close()
        }
      })
      
      setConnectionStatus({})
      setIsConnected(false)
    }
  }, [processUnifiedUpdate])

  const sortedPrices = prices.sort((a, b) => {
    const order = ['BTC', 'ETH', 'ADA', 'DOT', 'SOL', 'AVAX']
    return order.indexOf(a.symbol) - order.indexOf(b.symbol)
  })

  const connectedExchanges = Object.values(connectionStatus).filter(Boolean).length
  const totalExchanges = Object.keys(exchangeConfigs).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {selectedView === 'simple' ? 'Live Market Prices' : 'Multi-Exchange Comparison'}
            </h1>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm border ${
              selectedView === 'simple' 
                ? (isConnected ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200')
                : (connectedExchanges > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200')
            }`}>
              <Wifi className="w-4 h-4" />
              {selectedView === 'simple' 
                ? (isConnected ? 'Live' : 'Connecting...') 
                : `${connectedExchanges}/${totalExchanges} Connected`
              }
            </div>
          </div>
          
          {lastUpdate && (
            <p className="text-gray-500 text-sm">
              Last update: {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setSelectedView('simple')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedView === 'simple'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Simple View
            </button>
            <button
              onClick={() => setSelectedView('comparison')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedView === 'comparison'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Exchange Comparison
            </button>
          </div>
        </div>

        {/* Content */}
        {selectedView === 'simple' ? (
          /* Simple View */
          <>
            {sortedPrices.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Connecting to live data feeds...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedPrices.map((crypto) => (
                  <div 
                    key={crypto.symbol}
                    className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mr-3 overflow-hidden bg-gray-50 border border-gray-200">
                          {crypto.image && !imageErrors.has(crypto.symbol) ? (
                            <img 
                              src={crypto.image} 
                              alt={crypto.name}
                              className="w-8 h-8 object-contain"
                              onError={() => handleImageError(crypto.symbol)}
                            />
                          ) : (
                            <span className="text-blue-600 font-bold text-sm">{crypto.symbol}</span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{crypto.name}</h3>
                          <p className="text-gray-500 text-sm">{crypto.symbol}</p>
                        </div>
                      </div>
                      <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        crypto.change24h >= 0 
                          ? 'text-green-700 bg-green-50' 
                          : 'text-red-700 bg-red-50'
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
                        <span className="text-gray-500 text-sm">Price</span>
                        <span className="text-gray-900 font-semibold text-lg">
                          ${formatPrice(crypto.price)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">24h Volume</span>
                        <span className="text-gray-900 font-medium">{crypto.volume}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleAffiliateClick('View Deals', '#')}
                        className="block w-full bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 px-4 py-3 rounded-lg text-blue-600 font-medium transition-all duration-300 text-center border border-blue-200"
                      >
                        View {crypto.symbol} Deals
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* Comparison View */
          <>
            {comparisons.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading exchange comparisons...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {comparisons.map((crypto) => (
                  <div key={crypto.symbol} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                    {/* Crypto Header */}
                    <div className="p-6 border-b border-gray-200 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-16 h-16 rounded-full flex items-center justify-center mr-4 overflow-hidden bg-white border-2 border-gray-200">
                            {crypto.image && !imageErrors.has(crypto.symbol) ? (
                              <img 
                                src={crypto.image} 
                                alt={crypto.name}
                                className="w-10 h-10 object-contain"
                                onError={() => handleImageError(crypto.symbol)}
                              />
                            ) : (
                              <span className="text-blue-600 font-bold text-lg">{crypto.symbol}</span>
                            )}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900">{crypto.name}</h3>
                            <p className="text-gray-500">{crypto.symbol}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Price Spread</div>
                          <div className={`text-xl font-bold ${
                            (crypto.priceSpread || 0) > 1 ? 'text-amber-600' : 'text-green-600'
                          }`}>
                            {crypto.priceSpread?.toFixed(2)}%
                          </div>
                          {(crypto.priceSpread || 0) > 1 && (
                            <div className="flex items-center text-amber-600 text-xs mt-1">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              High spread
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Exchange Comparison Grid */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {crypto.exchanges.map((exchange, idx) => {
                          const isBestBuy = crypto.bestBuyPrice?.exchange === exchange.exchange
                          const isBestSell = crypto.bestSellPrice?.exchange === exchange.exchange
                          
                          return (
                            <div 
                              key={idx}
                              className={`relative p-4 rounded-xl border transition-all duration-300 hover:shadow-lg ${
                                !exchange.isConnected 
                                  ? 'border-gray-200 bg-gray-50 opacity-60'
                                  : isBestBuy || isBestSell 
                                    ? 'border-green-300 bg-green-50' 
                                    : 'border-gray-200 bg-gray-50 hover:border-blue-300'
                              }`}
                            >
                              {/* Best Price Badge */}
                              {(isBestBuy || isBestSell) && exchange.isConnected && (
                                <div className="absolute -top-2 left-4">
                                  <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full flex items-center">
                                    <Award className="w-3 h-3 mr-1" />
                                    {isBestBuy ? 'Best Buy' : 'Best Sell'}
                                  </span>
                                </div>
                              )}
                              
                              {/* Exchange Header */}
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                  <span className="text-xl mr-2">{exchange.logo}</span>
                                  <div>
                                    <span className="font-medium text-gray-900 text-sm">{exchange.exchange}</span>
                                    {!exchange.isConnected && (
                                      <div className="flex items-center text-red-600 text-xs">
                                        <WifiOff className="w-3 h-3 mr-1" />
                                        Offline
                                      </div>
                                    )}
                                    {exchange.lastUpdate && (
                                      <div className="text-xs text-gray-400">
                                        {exchange.lastUpdate.toLocaleTimeString()}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className={`text-xs px-2 py-1 rounded-full ${
                                  exchange.change24h >= 0 
                                    ? 'text-green-700 bg-green-100' 
                                    : 'text-red-700 bg-red-100'
                                }`}>
                                  {exchange.change24h >= 0 ? '+' : ''}{exchange.change24h.toFixed(2)}%
                                </div>
                              </div>

                              {/* Price and Details */}
                              <div className="space-y-2 mb-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-500 text-xs">Price</span>
                                  <span className="font-bold text-gray-900">${formatPrice(exchange.price)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-500 text-xs">Fees</span>
                                  <span className="text-xs text-gray-500">
                                    {exchange.fees.maker}%/{exchange.fees.taker}%
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-500 text-xs">Volume</span>
                                  <span className="text-xs text-gray-500">{exchange.volume}</span>
                                </div>
                              </div>

                              {/* Bonus */}
                              {exchange.bonus && (
                                <div className="mb-3">
                                  <span className="inline-block px-2 py-1 bg-gradient-to-r from-green-100 to-green-200 border border-green-300 rounded-full text-green-700 text-xs">
                                    {exchange.bonus}
                                  </span>
                                </div>
                              )}

                              {/* Trade Button */}
                              <button
                                onClick={() => handleAffiliateClick(exchange.exchange, exchange.affiliateUrl)}
                                disabled={!exchange.isConnected}
                                className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center justify-center ${
                                  !exchange.isConnected
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-600 border border-blue-200'
                                }`}
                              >
                                {exchange.isConnected ? (
                                  <>
                                    Trade Here
                                    <ExternalLink className="w-3 h-3 ml-1" />
                                  </>
                                ) : (
                                  <>
                                    <WifiOff className="w-3 h-3 mr-1" />
                                    Offline
                                  </>
                                )}
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Additional Features Section */}
        <div className="mt-16 bg-white rounded-2xl border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Use Our Price Comparison?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get the best deals across multiple exchanges with real-time price tracking and fee comparison.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Real-Time Prices</h3>
              <p className="text-gray-600 text-sm">
                Live WebSocket connections to 5 major exchanges for instant price updates.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Best Price Detection</h3>
              <p className="text-gray-600 text-sm">
                Automatically identifies the best buy and sell prices across all connected exchanges.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fee Transparency</h3>
              <p className="text-gray-600 text-sm">
                Clear fee breakdown and special bonuses to help you choose the right exchange.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => window.open('#', '_blank')}
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
          >
            {selectedView === 'simple' ? 'Explore All Deals' : 'View All Exchange Deals'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default LivePrices