<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crypto WebSocket Test</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .exchange {
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            margin: 10px 0;
            padding: 15px;
        }
        .exchange h3 {
            margin: 0 0 10px 0;
            color: #333;
        }
        .status {
            padding: 5px 10px;
            border-radius: 4px;
            font-weight: bold;
            display: inline-block;
            margin-bottom: 10px;
        }
        .connecting { background: #fff3cd; color: #856404; }
        .connected { background: #d4edda; color: #155724; }
        .error { background: #f8d7da; color: #721c24; }
        .disconnected { background: #f8f9fa; color: #6c757d; }
        .messages {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            padding: 10px;
            max-height: 200px;
            overflow-y: auto;
            font-family: monospace;
            font-size: 12px;
        }
        .clear-btn {
            background: #dc3545;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 5px;
        }
        .test-btn {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            margin: 10px 5px;
        }
        .price-data {
            background: #e9ecef;
            padding: 8px;
            border-radius: 4px;
            margin: 5px 0;
        }
        .summary {
            background: #e3f2fd;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔗 Crypto WebSocket Connection Test</h1>
        
        <div class="summary">
            <h3>Test Summary</h3>
            <div id="summary">Ready to test...</div>
        </div>

        <div style="text-align: center; margin: 20px 0;">
            <button class="test-btn" onclick="testAllConnections()">🚀 Test All Connections</button>
            <button class="test-btn" onclick="stopAllConnections()">⏹️ Stop All Tests</button>
        </div>

        <!-- Binance Test -->
        <div class="exchange">
            <h3>🟡 Binance (Browser-Friendly Endpoint)</h3>
            <div class="status" id="binance-status">Not Started</div>
            <div><strong>Endpoint:</strong> wss://data-stream.binance.vision/ws/btcusdt@ticker</div>
            <div class="price-data" id="binance-price">No data yet</div>
            <div class="messages" id="binance-messages"></div>
            <button class="clear-btn" onclick="clearMessages('binance')">Clear Messages</button>
        </div>

        <!-- Coinbase Test -->
        <div class="exchange">
            <h3>🔵 Coinbase Advanced Trade</h3>
            <div class="status" id="coinbase-status">Not Started</div>
            <div><strong>Endpoint:</strong> wss://advanced-trade-ws.coinbase.com</div>
            <div class="price-data" id="coinbase-price">No data yet</div>
            <div class="messages" id="coinbase-messages"></div>
            <button class="clear-btn" onclick="clearMessages('coinbase')">Clear Messages</button>
        </div>

        <!-- Kraken Test -->
        <div class="exchange">
            <h3>🐙 Kraken</h3>
            <div class="status" id="kraken-status">Not Started</div>
            <div><strong>Endpoint:</strong> wss://ws.kraken.com</div>
            <div class="price-data" id="kraken-price">No data yet</div>
            <div class="messages" id="kraken-messages"></div>
            <button class="clear-btn" onclick="clearMessages('kraken')">Clear Messages</button>
        </div>

        <!-- OKX Test -->
        <div class="exchange">
            <h3>⚫ OKX</h3>
            <div class="status" id="okx-status">Not Started</div>
            <div><strong>Endpoint:</strong> wss://ws.okx.com:8443/ws/v5/public</div>
            <div class="price-data" id="okx-price">No data yet</div>
            <div class="messages" id="okx-messages"></div>
            <button class="clear-btn" onclick="clearMessages('okx')">Clear Messages</button>
        </div>

        <!-- Bybit Test -->
        <div class="exchange">
            <h3>🟨 Bybit (Known CORS Issues)</h3>
            <div class="status" id="bybit-status">Not Started</div>
            <div><strong>Endpoint:</strong> wss://stream.bybit.com/v5/public/spot</div>
            <div class="price-data" id="bybit-price">No data yet</div>
            <div class="messages" id="bybit-messages"></div>
            <button class="clear-btn" onclick="clearMessages('bybit')">Clear Messages</button>
        </div>
    </div>

    <script>
        let connections = {};
        let messageCounters = {};

        function log(exchange, message) {
            const messagesDiv = document.getElementById(`${exchange}-messages`);
            const timestamp = new Date().toLocaleTimeString();
            messagesDiv.innerHTML += `<div>[${timestamp}] ${message}</div>`;
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
            
            // Count messages
            messageCounters[exchange] = (messageCounters[exchange] || 0) + 1;
            updateSummary();
        }

        function setStatus(exchange, status) {
            const statusDiv = document.getElementById(`${exchange}-status`);
            statusDiv.textContent = status;
            statusDiv.className = `status ${status.toLowerCase().replace(' ', '-')}`;
        }

        function updatePrice(exchange, priceData) {
            const priceDiv = document.getElementById(`${exchange}-price`);
            priceDiv.innerHTML = `<strong>BTC Price:</strong> $${priceData.price || 'N/A'} | <strong>Change:</strong> ${priceData.change || 'N/A'}%`;
        }

        function updateSummary() {
            const summaryDiv = document.getElementById('summary');
            const total = Object.keys(connections).length;
            const connected = Object.values(connections).filter(ws => ws && ws.readyState === WebSocket.OPEN).length;
            const messages = Object.values(messageCounters).reduce((a, b) => a + b, 0);
            
            summaryDiv.innerHTML = `
                <strong>Connections:</strong> ${connected}/${total} active | 
                <strong>Total Messages:</strong> ${messages} | 
                <strong>Status:</strong> ${connected > 0 ? '✅ Some working' : '❌ None connected'}
            `;
        }

        function clearMessages(exchange) {
            document.getElementById(`${exchange}-messages`).innerHTML = '';
            messageCounters[exchange] = 0;
            updateSummary();
        }

        function testBinance() {
            log('binance', '🔄 Testing Binance connection...');
            setStatus('binance', 'Connecting');
            
            const ws = new WebSocket('wss://data-stream.binance.vision/ws/btcusdt@ticker');
            connections.binance = ws;
            
            ws.onopen = function() {
                log('binance', '✅ Connected successfully!');
                setStatus('binance', 'Connected');
            };
            
            ws.onmessage = function(event) {
                try {
                    const data = JSON.parse(event.data);
                    log('binance', `📊 Price update: ${data.c} (${data.P}%)`);
                    updatePrice('binance', { price: parseFloat(data.c).toFixed(2), change: parseFloat(data.P).toFixed(2) });
                } catch (e) {
                    log('binance', `❌ Parse error: ${e.message}`);
                }
            };
            
            ws.onclose = function(event) {
                log('binance', `🔌 Connection closed: ${event.code} - ${event.reason}`);
                setStatus('binance', 'Disconnected');
            };
            
            ws.onerror = function(error) {
                log('binance', `❌ Error: ${error.message || 'Connection failed'}`);
                setStatus('binance', 'Error');
            };
        }

        function testCoinbase() {
            log('coinbase', '🔄 Testing Coinbase connection...');
            setStatus('coinbase', 'Connecting');
            
            const ws = new WebSocket('wss://advanced-trade-ws.coinbase.com');
            connections.coinbase = ws;
            
            ws.onopen = function() {
                log('coinbase', '✅ Connected successfully!');
                setStatus('coinbase', 'Connected');
                
                // Subscribe to BTC-USD ticker
                ws.send(JSON.stringify({
                    "type": "subscribe",
                    "product_ids": ["BTC-USD"],
                    "channels": ["ticker"]
                }));
                log('coinbase', '📡 Subscribed to BTC-USD ticker');
            };
            
            ws.onmessage = function(event) {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'ticker' && data.product_id === 'BTC-USD') {
                        const price = parseFloat(data.price);
                        const open24h = parseFloat(data.open_24h) || price;
                        const change24h = open24h > 0 ? ((price - open24h) / open24h) * 100 : 0;
                        log('coinbase', `📊 Price update: ${price.toFixed(2)} (${change24h.toFixed(2)}%)`);
                        updatePrice('coinbase', { price: price.toFixed(2), change: change24h.toFixed(2) });
                    } else {
                        log('coinbase', `📨 Message: ${data.type || 'Unknown'}`);
                    }
                } catch (e) {
                    log('coinbase', `❌ Parse error: ${e.message}`);
                }
            };
            
            ws.onclose = function(event) {
                log('coinbase', `🔌 Connection closed: ${event.code} - ${event.reason}`);
                setStatus('coinbase', 'Disconnected');
            };
            
            ws.onerror = function(error) {
                log('coinbase', `❌ Error: ${error.message || 'Connection failed - likely CORS'}`);
                setStatus('coinbase', 'Error');
            };
        }

        function testKraken() {
            log('kraken', '🔄 Testing Kraken connection...');
            setStatus('kraken', 'Connecting');
            
            const ws = new WebSocket('wss://ws.kraken.com');
            connections.kraken = ws;
            
            ws.onopen = function() {
                log('kraken', '✅ Connected successfully!');
                setStatus('kraken', 'Connected');
                
                // Subscribe to XBT/USD ticker
                ws.send(JSON.stringify({
                    "event": "subscribe",
                    "pair": ["XBT/USD"],
                    "subscription": {"name": "ticker"}
                }));
                log('kraken', '📡 Subscribed to XBT/USD ticker');
            };
            
            ws.onmessage = function(event) {
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
                            updatePrice('kraken', { price: price.toFixed(2), change: change24h.toFixed(2) });
                        }
                    } else {
                        log('kraken', `📨 Message: ${JSON.stringify(data).substring(0, 100)}...`);
                    }
                } catch (e) {
                    log('kraken', `❌ Parse error: ${e.message}`);
                }
            };
            
            ws.onclose = function(event) {
                log('kraken', `🔌 Connection closed: ${event.code} - ${event.reason}`);
                setStatus('kraken', 'Disconnected');
            };
            
            ws.onerror = function(error) {
                log('kraken', `❌ Error: ${error.message || 'Connection failed - likely CORS'}`);
                setStatus('kraken', 'Error');
            };
        }

        function testOKX() {
            log('okx', '🔄 Testing OKX connection...');
            setStatus('okx', 'Connecting');
            
            const ws = new WebSocket('wss://ws.okx.com:8443/ws/v5/public');
            connections.okx = ws;
            
            ws.onopen = function() {
                log('okx', '✅ Connected successfully!');
                setStatus('okx', 'Connected');
                
                // Subscribe to BTC-USDT ticker
                ws.send(JSON.stringify({
                    "op": "subscribe",
                    "args": [{"channel": "tickers", "instId": "BTC-USDT"}]
                }));
                log('okx', '📡 Subscribed to BTC-USDT ticker');
            };
            
            ws.onmessage = function(event) {
                try {
                    const data = JSON.parse(event.data);
                    if (data.event === 'subscribe') {
                        log('okx', `📨 Subscription successful`);
                    } else if (data.arg && data.arg.channel === 'tickers' && data.data && data.data[0]) {
                        const tickerData = data.data[0];
                        if (tickerData.last) {
                            const price = parseFloat(tickerData.last);
                            const change24h = parseFloat(tickerData.changeUtc8 || tickerData.change24h || '0');
                            log('okx', `📊 Price update: ${price.toFixed(2)} (${change24h.toFixed(2)}%)`);
                            updatePrice('okx', { price: price.toFixed(2), change: change24h.toFixed(2) });
                        }
                    } else {
                        log('okx', `📨 Message: ${JSON.stringify(data).substring(0, 100)}...`);
                    }
                } catch (e) {
                    log('okx', `❌ Parse error: ${e.message}`);
                }
            };
            
            ws.onclose = function(event) {
                log('okx', `🔌 Connection closed: ${event.code} - ${event.reason}`);
                setStatus('okx', 'Disconnected');
            };
            
            ws.onerror = function(error) {
                log('okx', `❌ Error: ${error.message || 'Connection failed - likely CORS'}`);
                setStatus('okx', 'Error');
            };
        }

        function testBybit() {
            log('bybit', '🔄 Testing Bybit connection...');
            setStatus('bybit', 'Connecting');
            
            const ws = new WebSocket('wss://stream.bybit.com/v5/public/spot');
            connections.bybit = ws;
            
            ws.onopen = function() {
                log('bybit', '✅ Connected successfully!');
                setStatus('bybit', 'Connected');
                
                // Subscribe to BTCUSDT ticker
                ws.send(JSON.stringify({
                    "op": "subscribe",
                    "args": ["tickers.BTCUSDT"]
                }));
                log('bybit', '📡 Subscribed to BTCUSDT ticker');
            };
            
            ws.onmessage = function(event) {
                try {
                    const data = JSON.parse(event.data);
                    if (data.op === 'pong') {
                        log('bybit', '🏓 Pong received');
                    } else if (data.success) {
                        log('bybit', `📨 Subscription successful`);
                    } else if (data.topic && data.topic.startsWith('tickers.') && data.data) {
                        const tickerData = data.data;
                        if (tickerData.lastPrice) {
                            const price = parseFloat(tickerData.lastPrice);
                            const change24h = parseFloat(tickerData.price24hPcnt) * 100 || 0;
                            log('bybit', `📊 Price update: ${price.toFixed(2)} (${change24h.toFixed(2)}%)`);
                            updatePrice('bybit', { price: price.toFixed(2), change: change24h.toFixed(2) });
                        }
                    } else {
                        log('bybit', `📨 Message: ${JSON.stringify(data).substring(0, 100)}...`);
                    }
                } catch (e) {
                    log('bybit', `❌ Parse error: ${e.message}`);
                }
            };
            
            ws.onclose = function(event) {
                log('bybit', `🔌 Connection closed: ${event.code} - ${event.reason}`);
                setStatus('bybit', 'Disconnected');
            };
            
            ws.onerror = function(error) {
                log('bybit', `❌ Error: ${error.message || 'Connection failed - CORS issues expected'}`);
                setStatus('bybit', 'Error');
            };
        }

        function testAllConnections() {
            log('binance', '🚀 Starting all connection tests...');
            messageCounters = {};
            
            // Test with delays to avoid overwhelming
            testBinance();
            setTimeout(testCoinbase, 1000);
            setTimeout(testKraken, 2000);
            setTimeout(testOKX, 3000);
            setTimeout(testBybit, 4000);
        }

        function stopAllConnections() {
            Object.values(connections).forEach(ws => {
                if (ws && ws.readyState === WebSocket.OPEN) {
                    ws.close();
                }
            });
            connections = {};
            
            ['binance', 'coinbase', 'kraken', 'okx', 'bybit'].forEach(exchange => {
                setStatus(exchange, 'Disconnected');
                log(exchange, '⏹️ Connection stopped by user');
            });
        }

        // Auto-update summary every second
        setInterval(updateSummary, 1000);
        
        // Initial summary
        updateSummary();
    </script>
</body>
</html>