'use client';

import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import { Toaster, toast } from 'react-hot-toast';

interface Signal {
  id: string;
  traderId: string;
  traderName: string;
  symbol: string;
  side: 'buy' | 'sell';
  price: number;
  size: number;
  stopLoss?: number;
  takeProfit?: number;
  status: 'open' | 'closed' | 'cancelled';
  timestamp: string;
}

export default function LiveTradingSignalsPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    trader: '',
    symbol: '',
    status: 'all' as 'all' | 'open' | 'closed' | 'cancelled',
  });
  const eventSourceRef = useRef<EventSource | null>(null);
  const lastSignalIdRef = useRef<string>('');

  useEffect(() => {
    fetchSignals();
    setupSSE();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const fetchSignals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/trading/signals', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSignals(data.signals || []);
        if (data.signals?.length > 0) {
          lastSignalIdRef.current = data.signals[0].id;
        }
      }
    } catch (error) {
      console.error('Failed to fetch signals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupSSE = () => {
    try {
      const token = localStorage.getItem('token');
      const eventSource = new EventSource(`/api/trading/signals/stream?token=${token}`);
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        try {
          const newSignal: Signal = JSON.parse(event.data);
          
          // Show toast notification for new signals
          if (newSignal.id !== lastSignalIdRef.current) {
            toast.success(
              `New ${newSignal.side.toUpperCase()} signal: ${newSignal.symbol} @ ${newSignal.price}`,
              {
                icon: newSignal.side === 'buy' ? '📈' : '📉',
                duration: 5000,
              }
            );
            lastSignalIdRef.current = newSignal.id;
          }

          setSignals(prev => [newSignal, ...prev]);
        } catch (error) {
          console.error('Error parsing SSE message:', error);
        }
      };

      eventSource.onerror = () => {
        // Fallback to polling if SSE fails
        console.log('SSE connection error, falling back to polling');
        eventSource.close();
        startPolling();
      };
    } catch (error) {
      console.error('Failed to setup SSE, using polling:', error);
      startPolling();
    }
  };

  const startPolling = () => {
    const interval = setInterval(() => {
      fetchSignals();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  };

  const filteredSignals = signals.filter(signal => {
    if (filters.trader && !signal.traderName.toLowerCase().includes(filters.trader.toLowerCase())) {
      return false;
    }
    if (filters.symbol && !signal.symbol.toLowerCase().includes(filters.symbol.toLowerCase())) {
      return false;
    }
    if (filters.status !== 'all' && signal.status !== filters.status) {
      return false;
    }
    return true;
  });

  const traders = Array.from(new Set(signals.map(s => s.traderName))).sort();
  const symbols = Array.from(new Set(signals.map(s => s.symbol))).sort();

  return (
    <Layout>
      <Toaster position="top-right" />
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-royal-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            <h1 className="text-2xl font-bold text-muted-gray-900">Live Trading Signals</h1>
            <span className="flex items-center space-x-1 text-sm text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Live</span>
            </span>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-gray-700 mb-2">
                Filter by Trader
              </label>
              <select
                value={filters.trader}
                onChange={(e) => setFilters({ ...filters, trader: e.target.value })}
                className="input-field"
              >
                <option value="">All Traders</option>
                {traders.map(trader => (
                  <option key={trader} value={trader}>{trader}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-gray-700 mb-2">
                Filter by Symbol
              </label>
              <select
                value={filters.symbol}
                onChange={(e) => setFilters({ ...filters, symbol: e.target.value })}
                className="input-field"
              >
                <option value="">All Symbols</option>
                {symbols.map(symbol => (
                  <option key={symbol} value={symbol}>{symbol}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                className="input-field"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Signals List */}
        <Card>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pale-blue-500 mx-auto"></div>
              </div>
            ) : filteredSignals.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-gray-500">No signals found</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="table-header">
                  <tr>
                    <th className="text-left">Trader</th>
                    <th className="text-left">Symbol</th>
                    <th className="text-left">Side</th>
                    <th className="text-right">Price</th>
                    <th className="text-right">Size</th>
                    <th className="text-right">Stop Loss</th>
                    <th className="text-right">Take Profit</th>
                    <th className="text-left">Status</th>
                    <th className="text-left">Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSignals.map((signal) => (
                    <tr key={signal.id} className="hover:bg-gray-50">
                      <td className="table-cell font-medium">{signal.traderName}</td>
                      <td className="table-cell font-semibold">{signal.symbol}</td>
                      <td className="table-cell">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            signal.side === 'buy'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {signal.side.toUpperCase()}
                        </span>
                      </td>
                      <td className="table-cell text-right font-semibold">${signal.price.toFixed(2)}</td>
                      <td className="table-cell text-right">{signal.size}</td>
                      <td className="table-cell text-right">
                        {signal.stopLoss ? `$${signal.stopLoss.toFixed(2)}` : '—'}
                      </td>
                      <td className="table-cell text-right">
                        {signal.takeProfit ? `$${signal.takeProfit.toFixed(2)}` : '—'}
                      </td>
                      <td className="table-cell">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            signal.status === 'open'
                              ? 'bg-blue-100 text-blue-800'
                              : signal.status === 'closed'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {signal.status}
                        </span>
                      </td>
                      <td className="table-cell text-muted-gray-500 text-sm">
                        {new Date(signal.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  );
}
