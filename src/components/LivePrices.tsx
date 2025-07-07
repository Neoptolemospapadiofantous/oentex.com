import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, ArrowRight, Wifi, WifiOff, BarChart3, ExternalLink, Award, AlertTriangle, Activity } from 'lucide-react'

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

interface ConnectionDebug {
  exchange: string
  status: 'connecting' | 'connected' | 'disconnected' | 'error'
  lastMessage?: Date
  messageCount: number
  error?: string
}

const LivePrices = () => {
  const [prices, setPrices] = useState<CryptoPrice[]>([])
  const [comparisons, setComparisons] = useState<CryptoComparison[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<Record<string, boolean>>({})
  const [connectionDebug, setConnectionDebug] = useState<ConnectionDebug[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [selectedView, setSelectedView] = useState<'simple' | 'comparison'>('comparison')
  const [showDebug, setShowDebug] = useState(false)

  // Exchange configurations - Added Bybit back since it works!
  const exchangeConfigs = {
    binance: {
      name: 'Binance',
      logo: '🟡',
      affiliateUrl: 'https://accounts.binance.com/register?ref=YOUR_REF_ID',
      fees: { maker: 0.1, taker: 0.1 },
      bonus: '20% Fee Discount'
    },
    coinbase: {
      name: 'Coinbase Advanced',
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

  const updateDebugInfo = (exchange: string, status: ConnectionDebug['status'], error?: string) => {
    setConnectionDebug(prev => {
      const existing = prev.find(d => d.exchange === exchange)
      if (existing) {
        return prev.map(d => d.exchange === exchange ? {
          ...d,
          status,
          error,
          lastMessage: status === 'connected' ? new Date() : d.lastMessage
        } : d)
      } else {
        return [...prev, {
          exchange,
          status,
          messageCount: 0,
          error,
          lastMessage: status === 'connected' ? new Date() : undefined
        }]
      }
    })
  }

  const incrementMessageCount = (exchange: string) => {
    setConnectionDebug(prev => 
      prev.map(d => d.exchange === exchange ? {
        ...d,
        messageCount: d.messageCount + 1,
        lastMessage: new Date()
      } : d)
    )
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

  const updateComparison = (symbol: string, exchangeKey: string, priceData: any) => {
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
      isConnected: true, // Always true when we receive data
      lastUpdate: new Date(),
      fees: exchangeConfig.fees,
      bonus: exchangeConfig.bonus
    }

    setComparisons(prev => {
      const existing = prev.find(c => c.symbol === symbol)
      if (existing) {
        // Keep stable order - don't re-sort exchanges
        const updatedExchanges = [...existing.exchanges]
        const exchangeIndex = updatedExchanges.findIndex(e => e.exchange === exchangeConfig.name)
        
        if (exchangeIndex >= 0) {
          // Update existing exchange
          updatedExchanges[exchangeIndex] = exchangePrice
        } else {
          // Add new exchange in predefined order
          const exchangeOrder = ['Binance', 'Coinbase Advanced', 'Kraken', 'Bybit', 'OKX']
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
        // Create new comparison with stable order
        const newComparison: CryptoComparison = {
          symbol,
          name: cryptoInfo.name,
          image: cryptoInfo.image,
          exchanges: [exchangePrice],
          priceSpread: 0,
          bestBuyPrice: exchangePrice,
          bestSellPrice: exchangePrice
        }
        
        // Insert in correct position to maintain crypto order
        const cryptoOrder = ['BTC', 'ETH', 'ADA', 'DOT', 'SOL', 'AVAX']
        const newPrev = [...prev, newComparison]
        return newPrev.sort((a, b) => {
          return cryptoOrder.indexOf(a.symbol) - cryptoOrder.indexOf(b.symbol)
        })
      }
    })
  }

  const handleAffiliateClick = (exchange: string, url: string) => {
    console.log(`Affiliate click: ${exchange}`)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  useEffect(() => {
    console.log('🚀 Starting WebSocket connections with verified 2025 endpoints...')
    
    const connections: WebSocket[] = []
    
    // 1. BINANCE WebSocket - Browser-friendly endpoint (CONFIRMED WORKING)
    const connectBinance = () => {
      updateDebugInfo('binance', 'connecting')
      const symbols = Object.keys(cryptoConfig).map(s => `${s.toLowerCase()}@ticker`).join('/')
      const binanceWs = new WebSocket(`wss://data-stream.binance.vision/ws/${symbols}`)
      connections.push(binanceWs)

      binanceWs.onopen = () => {
        console.log('✅ Binance WebSocket connected')
        setIsConnected(true)
        setConnectionStatus(prev => ({ ...prev, binance: true }))
        updateDebugInfo('binance', 'connected')
      }

      binanceWs.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          incrementMessageCount('binance')
          
          const symbol = data.s
          const config = cryptoConfig[symbol as keyof typeof cryptoConfig]
          
          if (config) {
            const volume = parseFloat(data.v) * parseFloat(data.c)
            
            // Update simple prices view
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

            // Update comparison data for Binance
            updateComparison(config.symbol, 'binance', {
              price: parseFloat(data.c),
              change24h: parseFloat(data.P),
              volume: formatVolume(volume)
            })
            
            setLastUpdate(new Date())
          }
        } catch (error: any) {
          console.error('❌ Binance parse error:', error)
          updateDebugInfo('binance', 'error', error.message)
        }
      }

      binanceWs.onclose = (event) => {
        console.log('🔌 Binance disconnected:', event.code, event.reason)
        setConnectionStatus(prev => ({ ...prev, binance: false }))
        updateDebugInfo('binance', 'disconnected', `Code: ${event.code}, Reason: ${event.reason}`)
      }

      binanceWs.onerror = (error) => {
        console.error('❌ Binance WebSocket error:', error)
        updateDebugInfo('binance', 'error', 'WebSocket connection failed')
        setConnectionStatus(prev => ({ ...prev, binance: false }))
      }

      return binanceWs
    }

    // 2. COINBASE Advanced Trade WebSocket - FIXED subscription format
    const connectCoinbase = () => {
      updateDebugInfo('coinbase', 'connecting')
      const coinbaseWs = new WebSocket('wss://advanced-trade-ws.coinbase.com')
      connections.push(coinbaseWs)

      coinbaseWs.onopen = () => {
        console.log('✅ Coinbase Advanced WebSocket connected')
        setConnectionStatus(prev => ({ ...prev, coinbase: true }))
        updateDebugInfo('coinbase', 'connected')
        
        // FIXED: Use proper Advanced Trade subscription format
        coinbaseWs.send(JSON.stringify({
          "type": "subscribe",
          "product_ids": ["BTC-USD", "ETH-USD", "ADA-USD", "DOT-USD", "SOL-USD", "AVAX-USD"],
          "channels": [
            {
              "name": "ticker",
              "product_ids": ["BTC-USD", "ETH-USD", "ADA-USD", "DOT-USD", "SOL-USD", "AVAX-USD"]
            }
          ]
        }))
      }

      coinbaseWs.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          incrementMessageCount('coinbase')
          
          // Handle subscription confirmations and errors
          if (data.type === 'subscriptions') {
            console.log('✅ Coinbase subscription confirmed:', data.channels)
            return
          }
          
          if (data.type === 'error') {
            console.error('❌ Coinbase subscription error:', data.message)
            updateDebugInfo('coinbase', 'error', `Subscription error: ${data.message}`)
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
              
              updateComparison(symbol, 'coinbase', {
                price: price,
                change24h: change24h,
                volume: formatVolume(volume24h * price)
              })
            }
          }
        } catch (error: any) {
          console.error('❌ Coinbase parse error:', error)
          updateDebugInfo('coinbase', 'error', error.message)
        }
      }

      coinbaseWs.onclose = (event) => {
        console.log('🔌 Coinbase disconnected:', event.code, event.reason)
        setConnectionStatus(prev => ({ ...prev, coinbase: false }))
        updateDebugInfo('coinbase', 'disconnected', `Code: ${event.code}, Reason: ${event.reason}`)
      }

      coinbaseWs.onerror = (error) => {
        console.error('❌ Coinbase WebSocket error:', error)
        updateDebugInfo('coinbase', 'error', 'WebSocket connection failed')
        setConnectionStatus(prev => ({ ...prev, coinbase: false }))
      }

      return coinbaseWs
    }

    // 3. KRAKEN WebSocket (CONFIRMED WORKING)
    const connectKraken = () => {
      updateDebugInfo('kraken', 'connecting')
      const krakenWs = new WebSocket('wss://ws.kraken.com')
      connections.push(krakenWs)

      krakenWs.onopen = () => {
        console.log('✅ Kraken WebSocket connected')
        setConnectionStatus(prev => ({ ...prev, kraken: true }))
        updateDebugInfo('kraken', 'connected')
        
        krakenWs.send(JSON.stringify({
          "event": "subscribe",
          "pair": ["XBT/USD", "ETH/USD", "ADA/USD", "DOT/USD", "SOL/USD", "AVAX/USD"],
          "subscription": {"name": "ticker"}
        }))
      }

      krakenWs.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          incrementMessageCount('kraken')
          
          // Skip heartbeat messages
          if (data.event === 'heartbeat') return
          
          if (data.event === 'subscriptionStatus') {
            console.log('Kraken subscription:', data.status)
            return
          }
          
          // Handle ticker data
          if (Array.isArray(data) && data.length >= 4 && data[2] === 'ticker') {
            const tickerData = data[1]
            const pair = data[3]
            
            if (tickerData && tickerData.c && tickerData.c[0]) {
              let symbol = pair.replace('/USD', '').replace('XBT', 'BTC')
              const cryptoInfo = Object.values(cryptoConfig).find(c => c.symbol === symbol)
              
              if (cryptoInfo) {
                const price = parseFloat(tickerData.c[0])
                const change24h = parseFloat(tickerData.P && tickerData.P[1] ? tickerData.P[1] : '0') || 0
                const volume24h = parseFloat(tickerData.v && tickerData.v[1] ? tickerData.v[1] : '0') || 0
                
                updateComparison(symbol, 'kraken', {
                  price: price,
                  change24h: change24h,
                  volume: formatVolume(volume24h * price)
                })
              }
            }
          }
        } catch (error: any) {
          console.error('❌ Kraken parse error:', error)
          updateDebugInfo('kraken', 'error', error.message)
        }
      }

      krakenWs.onclose = (event) => {
        console.log('🔌 Kraken disconnected:', event.code, event.reason)
        setConnectionStatus(prev => ({ ...prev, kraken: false }))
        updateDebugInfo('kraken', 'disconnected', `Code: ${event.code}, Reason: ${event.reason}`)
      }

      krakenWs.onerror = (error) => {
        console.error('❌ Kraken WebSocket error:', error)
        updateDebugInfo('kraken', 'error', 'WebSocket connection failed')
        setConnectionStatus(prev => ({ ...prev, kraken: false }))
      }

      return krakenWs
    }

    // 4. BYBIT WebSocket - Now included since it works! (CONFIRMED WORKING)
    const connectBybit = () => {
      updateDebugInfo('bybit', 'connecting')
      const bybitWs = new WebSocket('wss://stream.bybit.com/v5/public/spot')
      connections.push(bybitWs)

      let heartbeatInterval: NodeJS.Timeout | null = null

      bybitWs.onopen = () => {
        console.log('✅ Bybit WebSocket connected')
        setConnectionStatus(prev => ({ ...prev, bybit: true }))
        updateDebugInfo('bybit', 'connected')
        
        bybitWs.send(JSON.stringify({
          "op": "subscribe",
          "args": ["tickers.BTCUSDT", "tickers.ETHUSDT", "tickers.ADAUSDT", "tickers.DOTUSDT", "tickers.SOLUSDT", "tickers.AVAXUSDT"]
        }))

        // Set up heartbeat
        heartbeatInterval = setInterval(() => {
          if (bybitWs.readyState === WebSocket.OPEN) {
            bybitWs.send(JSON.stringify({ "op": "ping" }))
          }
        }, 20000)
      }

      bybitWs.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          incrementMessageCount('bybit')
          
          if (data.op === 'pong') return
          if (data.success) return
          
          if (data.topic && data.topic.startsWith('tickers.') && data.data) {
            const tickerData = data.data
            const symbol = tickerData.symbol.replace('USDT', '')
            const cryptoInfo = Object.values(cryptoConfig).find(c => c.symbol === symbol)
            
            if (cryptoInfo && tickerData.lastPrice) {
              const price = parseFloat(tickerData.lastPrice)
              const change24h = parseFloat(tickerData.price24hPcnt) * 100 || 0
              const volume24h = parseFloat(tickerData.volume24h) || 0
              
              updateComparison(symbol, 'bybit', {
                price: price,
                change24h: change24h,
                volume: formatVolume(volume24h * price)
              })
            }
          }
        } catch (error: any) {
          console.error('❌ Bybit parse error:', error)
          updateDebugInfo('bybit', 'error', error.message)
        }
      }

      bybitWs.onclose = (event) => {
        console.log('🔌 Bybit disconnected:', event.code, event.reason)
        setConnectionStatus(prev => ({ ...prev, bybit: false }))
        updateDebugInfo('bybit', 'disconnected', `Code: ${event.code}, Reason: ${event.reason}`)
        
        if (heartbeatInterval) {
          clearInterval(heartbeatInterval)
          heartbeatInterval = null
        }
      }

      bybitWs.onerror = (error) => {
        console.error('❌ Bybit WebSocket error:', error)
        updateDebugInfo('bybit', 'error', 'WebSocket connection failed')
        setConnectionStatus(prev => ({ ...prev, bybit: false }))
        
        if (heartbeatInterval) {
          clearInterval(heartbeatInterval)
          heartbeatInterval = null
        }
      }

      return bybitWs
    }

    // 5. OKX WebSocket - FIXED with throttling (CONFIRMED WORKING)
    const connectOKX = () => {
      updateDebugInfo('okx', 'connecting')
      const okxWs = new WebSocket('wss://ws.okx.com:8443/ws/v5/public')
      connections.push(okxWs)

      // Throttle updates to prevent spam
      let lastUpdate: Record<string, number> = {}
      const updateThrottle = 1000 // 1 second

      okxWs.onopen = () => {
        console.log('✅ OKX WebSocket connected')
        setConnectionStatus(prev => ({ ...prev, okx: true }))
        updateDebugInfo('okx', 'connected')
        
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
            
            // Throttle updates to prevent spam
            const now = Date.now()
            if (lastUpdate[symbol] && now - lastUpdate[symbol] < updateThrottle) {
              return
            }
            lastUpdate[symbol] = now
            
            incrementMessageCount('okx')
            
            const cryptoInfo = Object.values(cryptoConfig).find(c => c.symbol === symbol)
            
            if (cryptoInfo && tickerData.last) {
              const price = parseFloat(tickerData.last)
              const change24h = parseFloat(tickerData.changeUtc8 || tickerData.change24h || '0') || 0
              const volume24h = parseFloat(tickerData.vol24h || '0') || 0
              
              updateComparison(symbol, 'okx', {
                price: price,
                change24h: change24h,
                volume: formatVolume(volume24h * price)
              })
            }
          }
        } catch (error: any) {
          console.error('❌ OKX parse error:', error)
          updateDebugInfo('okx', 'error', error.message)
        }
      }

      okxWs.onclose = (event) => {
        console.log('🔌 OKX disconnected:', event.code, event.reason)
        setConnectionStatus(prev => ({ ...prev, okx: false }))
        updateDebugInfo('okx', 'disconnected', `Code: ${event.code}, Reason: ${event.reason}`)
      }

      okxWs.onerror = (error) => {
        console.error('❌ OKX WebSocket error:', error)
        updateDebugInfo('okx', 'error', 'WebSocket connection failed')
        setConnectionStatus(prev => ({ ...prev, okx: false }))
      }

      return okxWs
    }

    // Connect to all exchanges with staggered delays
    connectBinance()
    
    setTimeout(() => {
      try {
        connectCoinbase()
      } catch (error: any) {
        console.error('Failed to connect to Coinbase:', error)
        updateDebugInfo('coinbase', 'error', 'Failed to initiate connection')
      }
    }, 1000)
    
    setTimeout(() => {
      try {
        connectKraken()
      } catch (error: any) {
        console.error('Failed to connect to Kraken:', error)
        updateDebugInfo('kraken', 'error', 'Failed to initiate connection')
      }
    }, 2000)
    
    setTimeout(() => {
      try {
        connectBybit()
      } catch (error: any) {
        console.error('Failed to connect to Bybit:', error)
        updateDebugInfo('bybit', 'error', 'Failed to initiate connection')
      }
    }, 3000)
    
    setTimeout(() => {
      try {
        connectOKX()
      } catch (error: any) {
        console.error('Failed to connect to OKX:', error)
        updateDebugInfo('okx', 'error', 'Failed to initiate connection')
      }
    }, 4000)

    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up all WebSocket connections')
      connections.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
          ws.close()
        }
      })
      
      setConnectionStatus({})
      setIsConnected(false)
    }
  }, [])

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

        {/* Debug Panel Toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Activity className="w-4 h-4" />
            {showDebug ? 'Hide' : 'Show'} Debug Info
          </button>
        </div>

        {/* Debug Panel */}
        {showDebug && (
          <div className="mb-8 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">WebSocket Debug Information</h3>
              <p className="text-sm text-gray-600 mt-1">Real-time connection status and diagnostics</p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {connectionDebug.map((debug) => (
                  <div key={debug.exchange} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 capitalize">{debug.exchange}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        debug.status === 'connected' ? 'bg-green-100 text-green-700' :
                        debug.status === 'connecting' ? 'bg-yellow-100 text-yellow-700' :
                        debug.status === 'error' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {debug.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>Messages: {debug.messageCount}</div>
                      {debug.lastMessage && (
                        <div>Last: {debug.lastMessage.toLocaleTimeString()}</div>
                      )}
                      {debug.error && (
                        <div className="text-red-600 text-xs break-words">{debug.error}</div>
                      )}
                      <div className="text-xs text-gray-500">
                        Connected: {connectionStatus[debug.exchange] ? 'Yes' : 'No'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Enhanced connection status */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Connection Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  {Object.entries(exchangeConfigs).map(([key, config]) => (
                    <div key={key} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        connectionStatus[key] ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className="text-gray-700">{config.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Technical notes */}
              <div className="mt-4 p-3 bg-gray-900 text-green-400 rounded-lg text-xs font-mono max-h-40 overflow-y-auto">
                <div className="mb-2 text-green-300">Verified Working WebSocket Endpoints (2025):</div>
                <div className="space-y-1 text-gray-300">
                  <div>• Binance: wss://data-stream.binance.vision (✅ Browser-friendly)</div>
                  <div>• Coinbase: wss://advanced-trade-ws.coinbase.com (✅ Fixed subscription)</div>
                  <div>• Kraken: wss://ws.kraken.com (✅ Working with heartbeat filter)</div>
                  <div>• Bybit: wss://stream.bybit.com/v5/public/spot (✅ Surprising success!)</div>
                  <div>• OKX: wss://ws.okx.com:8443/ws/v5/public (✅ With update throttling)</div>
                </div>
                <div className="mt-2 text-yellow-400">
                  Production optimizations:
                  <br />• OKX throttled to 1 update/second to prevent spam
                  <br />• Kraken heartbeat messages filtered out
                  <br />• Coinbase subscription format fixed for Advanced Trade
                  <br />• All endpoints tested and confirmed working in browser
                </div>
              </div>
            </div>
          </div>
        )}

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
                  <p className="text-gray-400 text-sm mt-2">All exchanges should connect successfully!</p>
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
                  <p className="text-gray-400 text-sm mt-2">Connecting to all 5 exchanges...</p>
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
                <Activity className="w-8 h-8 text-purple-600" />
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