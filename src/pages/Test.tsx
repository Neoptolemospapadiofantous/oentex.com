import React, { useState, useEffect, useRef } from 'react';

interface ConnectionStatus {
  status: 'not-started' | 'connecting' | 'connected' | 'disconnected' | 'error';
  messages: string[];
  messageCount: number;
  priceData?: {
    price: string;
    change: string;
  };
}

interface ExchangeConfig {
  name: string;
  emoji: string;
  endpoint: string;
  description: string;
}

const WebSocketTest: React.FC = () => {
  const [connections, setConnections] = useState<Record<string, ConnectionStatus>>({
    binance: { status: 'not-started', messages: [], messageCount: 0 },
    coinbase: { status: 'not-started', messages: [], messageCount: 0 },
    kraken: { status: 'not-started', messages: [], messageCount: 0 },
    okx: { status: 'not-started', messages: [], messageCount: 0 },
    bybit: { status: 'not-started', messages: [], messageCount: 0 },
  });

  const websockets = useRef<Record<string, WebSocket>>({});

  const exchanges: Record<string, ExchangeConfig> = {
    binance: {
      name: 'Binance',
      emoji: '🟡',
      endpoint: 'wss://data-stream.binance.vision/ws/btcusdt@ticker',
      description: 'Browser-Friendly Endpoint'
    },
    coinbase: {
      name: 'Coinbase Advanced Trade',
      emoji: '🔵',
      endpoint: 'wss://advanced-trade-ws.coinbase.com',
      description: 'Advanced Trade API'
    },
    kraken: {
      name: 'Kraken',
      emoji: '🐙',
      endpoint: 'wss://ws.kraken.com',
      description: 'Market Data API'
    },
    okx: {
      name: 'OKX',
      emoji: '⚫',
      endpoint: 'wss://ws.okx.com:8443/ws/v5/public',
      description: 'Public Market Data'
    },
    bybit: {
      name: 'Bybit',
      emoji: '🟨',
      endpoint: 'wss://stream.bybit.com/v5/public/spot',
      description: 'Known CORS Issues'
    }
  };

  const log = (exchange: string, message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    
    setConnections(prev => ({
      ...prev,
      [exchange]: {
        ...prev[exchange],
        messages: [...prev[exchange].messages, logMessage],
        messageCount: prev[exchange].messageCount + 1
      }
    }));
  };

  const setStatus = (exchange: string, status: ConnectionStatus['status']) => {
    setConnections(prev => ({
      ...prev,
      [exchange]: {
        ...prev[exchange],
        status
      }
    }));
  };

  const updatePrice = (exchange: string, priceData: { price: string; change: string }) => {
    setConnections(prev => ({
      ...prev,
      [exchange]: {
        ...prev[exchange],
        priceData
      }
    }));
  };

  const clearMessages = (exchange: string) => {
    setConnections(prev => ({
      ...prev,
      [exchange]: {
        ...prev[exchange],
        messages: [],
        messageCount: 0
      }
    }));
  };

  const testBinance = () => {
    log('binance', '🔄 Testing Binance connection...');
    setStatus('binance', 'connecting');
    
    const ws = new WebSocket('wss://data-stream.binance.vision/ws/btcusdt@ticker');
    websockets.current.binance = ws;
    
    ws.onopen = () => {
      log('binance', '✅ Connected successfully!');
      setStatus('binance', 'connected');
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        log('binance', `📊 Price update: ${data.c} (${data.P}%)`);
        updatePrice('binance', { 
          price: parseFloat(data.c).toFixed(2), 
          change: parseFloat(data.P).toFixed(2) 
        });
      } catch (e) {
        log('binance', `❌ Parse error: ${(e as Error).message}`);
      }
    };
    
    ws.onclose = (event) => {
      log('binance', `🔌 Connection closed: ${event.code} - ${event.reason}`);
      setStatus('binance', 'disconnected');
    };
    
    ws.onerror = () => {
      log('binance', '❌ Error: Connection failed');
      setStatus('binance', 'error');
    };
  };

  const testCoinbase = () => {
    log('coinbase', '🔄 Testing Coinbase connection...');
    setStatus('coinbase', 'connecting');
    
    const ws = new WebSocket('wss://advanced-trade-ws.coinbase.com');
    websockets.current.coinbase = ws;
    
    ws.onopen = () => {
      log('coinbase', '✅ Connected successfully!');
      setStatus('coinbase', 'connected');
      
      ws.send(JSON.stringify({
        "type": "subscribe",
        "product_ids": ["BTC-USD"],
        "channels": ["ticker"]
      }));
      log('coinbase', '📡 Subscribed to BTC-USD ticker');
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'ticker' && data.product_id === 'BTC-USD') {
          const price = parseFloat(data.price);
          const open24h = parseFloat(data.open_24h) || price;
          const change24h = open24h > 0 ? ((price - open24h) / open24h) * 100 : 0;
          log('coinbase', `📊 Price update: ${price.toFixed(2)} (${change24h.toFixed(2)}%)`);
          updatePrice('coinbase', { 
            price: price.toFixed(2), 
            change: change24h.toFixed(2) 
          });
        } else {
          log('coinbase', `📨 Message: ${data.type || 'Unknown'}`);
        }
      } catch (e) {
        log('coinbase', `❌ Parse error: ${(e as Error).message}`);
      }
    };
    
    ws.onclose = (event) => {
      log('coinbase', `🔌 Connection closed: ${event.code} - ${event.reason}`);
      setStatus('coinbase', 'disconnected');
    };
    
    ws.onerror = () => {
      log('coinbase', '❌ Error: Connection failed - likely CORS');
      setStatus('coinbase', 'error');
    };
  };

  const testKraken = () => {
    log('kraken', '🔄 Testing Kraken connection...');
    setStatus('kraken', 'connecting');
    
    const ws = new WebSocket('wss://ws.kraken.com');
    websockets.current.kraken = ws;
    
    ws.onopen = () => {
      log('kraken', '✅ Connected successfully!');
      setStatus('kraken', 'connected');
      
      ws.send(JSON.stringify({
        "event": "subscribe",
        "pair": ["XBT/USD"],
        "subscription": {"name": "ticker"}
      }));
      log('kraken', '📡 Subscribed to XBT/USD ticker');
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'subscriptionStatus') {
          log('kraken', `📨 Subscription: ${data.status}`);
        } else if (Array.isArray(data) && data[2] === 'ticker') {
          const tickerData = data[1];
          if (tickerData.c && tickerData.c[0]) {
            const price = parseFloat(tickerData.c[0]);
            const change24h = parseFloat(tickerData.P && tickerData.P[1] ? tickerData.P[1] : '0');
            log('kraken', `📊 Price update: ${price.toFixed(2)} (${change24h.toFixed(2)}%)`);
            updatePrice('kraken', { 
              price: price.toFixed(2), 
              change: change24h.toFixed(2) 
            });
          }
        } else {
          log('kraken', `📨 Message: ${JSON.stringify(data).substring(0, 100)}...`);
        }
      } catch (e) {
        log('kraken', `❌ Parse error: ${(e as Error).message}`);
      }
    };
    
    ws.onclose = (event) => {
      log('kraken', `🔌 Connection closed: ${event.code} - ${event.reason}`);
      setStatus('kraken', 'disconnected');
    };
    
    ws.onerror = () => {
      log('kraken', '❌ Error: Connection failed - likely CORS');
      setStatus('kraken', 'error');
    };
  };

  const testOKX = () => {
    log('okx', '🔄 Testing OKX connection...');
    setStatus('okx', 'connecting');
    
    const ws = new WebSocket('wss://ws.okx.com:8443/ws/v5/public');
    websockets.current.okx = ws;
    
    ws.onopen = () => {
      log('okx', '✅ Connected successfully!');
      setStatus('okx', 'connected');
      
      ws.send(JSON.stringify({
        "op": "subscribe",
        "args": [{"channel": "tickers", "instId": "BTC-USDT"}]
      }));
      log('okx', '📡 Subscribed to BTC-USDT ticker');
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'subscribe') {
          log('okx', '📨 Subscription successful');
        } else if (data.arg && data.arg.channel === 'tickers' && data.data && data.data[0]) {
          const tickerData = data.data[0];
          if (tickerData.last) {
            const price = parseFloat(tickerData.last);
            const change24h = parseFloat(tickerData.changeUtc8 || tickerData.change24h || '0');
            log('okx', `📊 Price update: ${price.toFixed(2)} (${change24h.toFixed(2)}%)`);
            updatePrice('okx', { 
              price: price.toFixed(2), 
              change: change24h.toFixed(2) 
            });
          }
        } else {
          log('okx', `📨 Message: ${JSON.stringify(data).substring(0, 100)}...`);
        }
      } catch (e) {
        log('okx', `❌ Parse error: ${(e as Error).message}`);
      }
    };
    
    ws.onclose = (event) => {
      log('okx', `🔌 Connection closed: ${event.code} - ${event.reason}`);
      setStatus('okx', 'disconnected');
    };
    
    ws.onerror = () => {
      log('okx', '❌ Error: Connection failed - likely CORS');
      setStatus('okx', 'error');
    };
  };

  const testBybit = () => {
    log('bybit', '🔄 Testing Bybit connection...');
    setStatus('bybit', 'connecting');
    
    const ws = new WebSocket('wss://stream.bybit.com/v5/public/spot');
    websockets.current.bybit = ws;
    
    ws.onopen = () => {
      log('bybit', '✅ Connected successfully!');
      setStatus('bybit', 'connected');
      
      ws.send(JSON.stringify({
        "op": "subscribe",
        "args": ["tickers.BTCUSDT"]
      }));
      log('bybit', '📡 Subscribed to BTCUSDT ticker');
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.op === 'pong') {
          log('bybit', '🏓 Pong received');
        } else if (data.success) {
          log('bybit', '📨 Subscription successful');
        } else if (data.topic && data.topic.startsWith('tickers.') && data.data) {
          const tickerData = data.data;
          if (tickerData.lastPrice) {
            const price = parseFloat(tickerData.lastPrice);
            const change24h = parseFloat(tickerData.price24hPcnt) * 100 || 0;
            log('bybit', `📊 Price update: ${price.toFixed(2)} (${change24h.toFixed(2)}%)`);
            updatePrice('bybit', { 
              price: price.toFixed(2), 
              change: change24h.toFixed(2) 
            });
          }
        } else {
          log('bybit', `📨 Message: ${JSON.stringify(data).substring(0, 100)}...`);
        }
      } catch (e) {
        log('bybit', `❌ Parse error: ${(e as Error).message}`);
      }
    };
    
    ws.onclose = (event) => {
      log('bybit', `🔌 Connection closed: ${event.code} - ${event.reason}`);
      setStatus('bybit', 'disconnected');
    };
    
    ws.onerror = () => {
      log('bybit', '❌ Error: Connection failed - CORS issues expected');
      setStatus('bybit', 'error');
    };
  };

  const testAllConnections = () => {
    log('binance', '🚀 Starting all connection tests...');
    
    // Test with delays to avoid overwhelming
    testBinance();
    setTimeout(testCoinbase, 1000);
    setTimeout(testKraken, 2000);
    setTimeout(testOKX, 3000);
    setTimeout(testBybit, 4000);
  };

  const stopAllConnections = () => {
    Object.values(websockets.current).forEach(ws => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    });
    websockets.current = {};
    
    Object.keys(exchanges).forEach(exchange => {
      setStatus(exchange, 'disconnected');
      log(exchange, '⏹️ Connection stopped by user');
    });
  };

  const getStatusColor = (status: ConnectionStatus['status']) => {
    switch (status) {
      case 'connecting': return 'bg-yellow-100 text-yellow-800';
      case 'connected': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'disconnected': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status: ConnectionStatus['status']) => {
    switch (status) {
      case 'not-started': return 'Not Started';
      case 'connecting': return 'Connecting';
      case 'connected': return 'Connected';
      case 'error': return 'Error';
      case 'disconnected': return 'Disconnected';
      default: return 'Unknown';
    }
  };

  // Calculate summary stats
  const connectedCount = Object.values(connections).filter(c => c.status === 'connected').length;
  const totalMessages = Object.values(connections).reduce((sum, c) => sum + c.messageCount, 0);
  const totalExchanges = Object.keys(exchanges).length;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(websockets.current).forEach(ws => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          🔗 Crypto WebSocket Connection Test
        </h1>
        
        {/* Summary */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Test Summary</h3>
          <div className="text-blue-800">
            <strong>Connections:</strong> {connectedCount}/{totalExchanges} active | 
            <strong> Total Messages:</strong> {totalMessages} | 
            <strong> Status:</strong> {connectedCount > 0 ? '✅ Some working' : '❌ None connected'}
          </div>
        </div>

        {/* Control buttons */}
        <div className="text-center mb-6">
          <button
            onClick={testAllConnections}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg mr-4 hover:bg-blue-700 transition-colors"
          >
            🚀 Test All Connections
          </button>
          <button
            onClick={stopAllConnections}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            ⏹️ Stop All Tests
          </button>
        </div>

        {/* Exchange tests */}
        <div className="space-y-6">
          {Object.entries(exchanges).map(([key, exchange]) => {
            const connection = connections[key];
            return (
              <div key={key} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {exchange.emoji} {exchange.name}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(connection.status)}`}>
                    {getStatusText(connection.status)}
                  </span>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Endpoint:</strong> {exchange.endpoint}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Description:</strong> {exchange.description}
                  </div>
                  {connection.priceData && (
                    <div className="bg-gray-100 p-3 rounded-md">
                      <strong>BTC Price:</strong> ${connection.priceData.price} | 
                      <strong> Change:</strong> {connection.priceData.change}%
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Messages ({connection.messageCount})
                    </span>
                    <button
                      onClick={() => clearMessages(key)}
                      className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Clear Messages
                    </button>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-3 h-48 overflow-y-auto">
                    <div className="font-mono text-xs space-y-1">
                      {connection.messages.length === 0 ? (
                        <div className="text-gray-500">No messages yet</div>
                      ) : (
                        connection.messages.map((message, index) => (
                          <div key={index} className="text-gray-700">
                            {message}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WebSocketTest;
