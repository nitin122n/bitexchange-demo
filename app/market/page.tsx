'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Card from '@/components/Card';

interface TradingPair {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
}

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

interface TradeHistory {
  id: string;
  price: number;
  amount: number;
  time: string;
  side: 'BUY' | 'SELL';
}

export default function MarketPage() {
  const [selectedPair, setSelectedPair] = useState('BTC/USDT');
  const [tradingPairs, setTradingPairs] = useState<TradingPair[]>([]);
  const [orderBook, setOrderBook] = useState<{ bids: OrderBookEntry[]; asks: OrderBookEntry[] }>({ bids: [], asks: [] });
  const [tradeHistory, setTradeHistory] = useState<TradeHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [selectedPair]);

  const fetchMarketData = async () => {
    try {
      // Mock data for trading pairs
      const mockPairs: TradingPair[] = [
        {
          symbol: 'BTC/USDT',
          baseAsset: 'BTC',
          quoteAsset: 'USDT',
          price: 43250.50,
          change24h: 2.45,
          volume24h: 1250000000,
          high24h: 44100.00,
          low24h: 42800.00
        },
        {
          symbol: 'ETH/USDT',
          baseAsset: 'ETH',
          quoteAsset: 'USDT',
          price: 2650.75,
          change24h: -1.23,
          volume24h: 850000000,
          high24h: 2720.00,
          low24h: 2620.00
        },
        {
          symbol: 'TRX/USDT',
          baseAsset: 'TRX',
          quoteAsset: 'USDT',
          price: 0.125,
          change24h: 5.67,
          volume24h: 45000000,
          high24h: 0.128,
          low24h: 0.118
        },
        {
          symbol: 'ADA/USDT',
          baseAsset: 'ADA',
          quoteAsset: 'USDT',
          price: 0.45,
          change24h: 3.21,
          volume24h: 120000000,
          high24h: 0.47,
          low24h: 0.43
        },
        {
          symbol: 'BNB/USDT',
          baseAsset: 'BNB',
          quoteAsset: 'USDT',
          price: 320.25,
          change24h: -0.89,
          volume24h: 180000000,
          high24h: 325.00,
          low24h: 318.00
        }
      ];

      // Mock order book data
      const mockOrderBook = {
        bids: [
          { price: 43245.50, amount: 0.125, total: 5405.69 },
          { price: 43240.00, amount: 0.250, total: 10810.00 },
          { price: 43235.75, amount: 0.500, total: 21617.88 },
          { price: 43230.25, amount: 0.750, total: 32422.69 },
          { price: 43225.00, amount: 1.000, total: 43225.00 }
        ],
        asks: [
          { price: 43255.75, amount: 0.100, total: 4325.58 },
          { price: 43260.00, amount: 0.200, total: 8652.00 },
          { price: 43265.25, amount: 0.300, total: 12979.58 },
          { price: 43270.50, amount: 0.400, total: 17308.20 },
          { price: 43275.00, amount: 0.500, total: 21637.50 }
        ]
      };

      // Mock trade history
      const mockTradeHistory: TradeHistory[] = [
        { id: '1', price: 43250.50, amount: 0.125, time: '14:30:25', side: 'BUY' },
        { id: '2', price: 43248.75, amount: 0.250, time: '14:30:20', side: 'SELL' },
        { id: '3', price: 43252.00, amount: 0.100, time: '14:30:15', side: 'BUY' },
        { id: '4', price: 43245.25, amount: 0.500, time: '14:30:10', side: 'SELL' },
        { id: '5', price: 43255.75, amount: 0.075, time: '14:30:05', side: 'BUY' }
      ];

      setTradingPairs(mockPairs);
      setOrderBook(mockOrderBook);
      setTradeHistory(mockTradeHistory);
    } catch (error) {
      console.error('Failed to fetch market data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPairs = tradingPairs.filter(pair =>
    pair.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pair.baseAsset.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeBgColor = (change: number) => {
    return change >= 0 ? 'bg-green-100' : 'bg-red-100';
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 });
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000000) {
      return `$${(volume / 1000000000).toFixed(2)}B`;
    } else if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(2)}M`;
    } else if (volume >= 1000) {
      return `$${(volume / 1000).toFixed(2)}K`;
    }
    return `$${volume.toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded-xl"></div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 relative">
        {/* Crypto Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {/* Floating Crypto Symbols */}
          <div className="absolute top-20 left-10 text-royal-purple-200/30 text-6xl animate-pulse">₿</div>
          <div className="absolute top-40 right-20 text-emerald-gold-200/30 text-5xl animate-bounce">Ξ</div>
          <div className="absolute top-60 left-1/4 text-luxury-gold-200/30 text-4xl animate-pulse">₮</div>
          <div className="absolute top-80 right-1/3 text-royal-purple-200/30 text-5xl animate-bounce">₳</div>
          <div className="absolute top-32 left-1/2 text-emerald-gold-200/30 text-4xl animate-pulse">◊</div>
          
          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-12 gap-4 h-full">
              {Array.from({ length: 144 }).map((_, i) => (
                <div key={i} className="border border-royal-purple-300/20 rounded animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
              ))}
            </div>
          </div>
          
          {/* Floating Particles */}
          <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-royal-purple-400/40 rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-emerald-gold-400/40 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/5 w-1 h-1 bg-luxury-gold-400/40 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-royal-purple-400/40 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-3/4 left-2/3 w-1 h-1 bg-emerald-gold-400/40 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
        </div>
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-muted-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <h1 className="text-2xl font-bold text-muted-gray-900">Market Exchange</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Trading Pairs List */}
          <div className="lg:col-span-1">
            <Card>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Markets</h3>
                <input
                  type="text"
                  placeholder="Search pairs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pale-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="space-y-2">
                {filteredPairs.map((pair) => (
                  <div
                    key={pair.symbol}
                    onClick={() => setSelectedPair(pair.symbol)}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedPair === pair.symbol
                        ? 'bg-pale-blue-50 border border-pale-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">{pair.symbol}</div>
                        <div className="text-sm text-gray-500">Vol: {formatVolume(pair.volume24h)}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">${formatPrice(pair.price)}</div>
                        <div className={`text-sm ${getChangeColor(pair.change24h)}`}>
                          {pair.change24h >= 0 ? '+' : ''}{pair.change24h.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Trading Area */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Price Chart Area */}
              <div className="lg:col-span-1">
                <Card>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedPair}</h3>
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-bold text-gray-900">
                        ${formatPrice(tradingPairs.find(p => p.symbol === selectedPair)?.price || 0)}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-sm font-medium ${
                        getChangeBgColor(tradingPairs.find(p => p.symbol === selectedPair)?.change24h || 0)
                      } ${getChangeColor(tradingPairs.find(p => p.symbol === selectedPair)?.change24h || 0)}`}>
                        {tradingPairs.find(p => p.symbol === selectedPair)?.change24h && 
                          `${tradingPairs.find(p => p.symbol === selectedPair)!.change24h >= 0 ? '+' : ''}${tradingPairs.find(p => p.symbol === selectedPair)!.change24h.toFixed(2)}%`
                        }
                      </div>
                    </div>
                  </div>
                  
                  {/* Chart Placeholder */}
                  <div className="h-64 bg-gradient-to-br from-pale-blue-50 to-pale-teal-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-gray-500 font-medium">Live Price Chart</p>
                      <p className="text-sm text-gray-400">Real-time trading data visualization</p>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">24h High</div>
                      <div className="font-semibold text-gray-900">
                        ${formatPrice(tradingPairs.find(p => p.symbol === selectedPair)?.high24h || 0)}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">24h Low</div>
                      <div className="font-semibold text-gray-900">
                        ${formatPrice(tradingPairs.find(p => p.symbol === selectedPair)?.low24h || 0)}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Order Book */}
              <div className="lg:col-span-1">
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Book</h3>
                  
                  {/* Asks (Sell Orders) */}
                  <div className="mb-4">
                    <div className="text-sm font-medium text-red-600 mb-2">Sell Orders</div>
                    <div className="space-y-1">
                      {orderBook.asks.map((ask, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-red-600">{formatPrice(ask.price)}</span>
                          <span className="text-gray-600">{ask.amount.toFixed(4)}</span>
                          <span className="text-gray-500">{formatPrice(ask.total)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Spread */}
                  <div className="text-center py-2 border-t border-b border-gray-200">
                    <div className="text-sm text-gray-600">
                      Spread: ${(orderBook.asks[0]?.price - orderBook.bids[0]?.price).toFixed(2)}
                    </div>
                  </div>

                  {/* Bids (Buy Orders) */}
                  <div className="mt-4">
                    <div className="text-sm font-medium text-green-600 mb-2">Buy Orders</div>
                    <div className="space-y-1">
                      {orderBook.bids.map((bid, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-green-600">{formatPrice(bid.price)}</span>
                          <span className="text-gray-600">{bid.amount.toFixed(4)}</span>
                          <span className="text-gray-500">{formatPrice(bid.total)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Trade History */}
            <Card className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Trades</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-sm font-medium text-gray-600">Price</th>
                      <th className="text-left py-2 text-sm font-medium text-gray-600">Amount</th>
                      <th className="text-left py-2 text-sm font-medium text-gray-600">Time</th>
                      <th className="text-left py-2 text-sm font-medium text-gray-600">Side</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tradeHistory.map((trade) => (
                      <tr key={trade.id} className="border-b border-gray-100">
                        <td className="py-2 text-sm font-medium text-gray-900">${formatPrice(trade.price)}</td>
                        <td className="py-2 text-sm text-gray-600">{trade.amount.toFixed(4)}</td>
                        <td className="py-2 text-sm text-gray-600">{trade.time}</td>
                        <td className="py-2 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            trade.side === 'BUY' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {trade.side}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
