'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Card from '@/components/Card';

interface CopyTrade {
  id: string;
  signalId: string;
  traderId: string;
  traderName: string;
  symbol: string;
  amount: number;
  executedPrice: number;
  pnl?: number;
  status: 'open' | 'closed' | 'cancelled';
  createdAt: string;
}

interface Follow {
  id: string;
  traderId: string;
  traderName: string;
  multiplier: number;
  autoCopy: boolean;
  maxSize?: number;
  riskPct?: number;
}

export default function CopyTradingPage() {
  const [copyTrades, setCopyTrades] = useState<CopyTrade[]>([]);
  const [follows, setFollows] = useState<Follow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingSignal, setPendingSignal] = useState<any>(null);

  useEffect(() => {
    fetchData();
    setupSignalListener();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [tradesRes, followsRes] = await Promise.all([
        fetch('/api/trading/copy', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch('/api/trading/followers', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      if (tradesRes.ok) {
        const tradesData = await tradesRes.json();
        setCopyTrades(tradesData.copyTrades || []);
      }

      if (followsRes.ok) {
        const followsData = await followsRes.json();
        setFollows(followsData.follows || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupSignalListener = () => {
    // Listen for new signals from followed traders
    const eventSource = new EventSource('/api/trading/signals/stream');
    
    eventSource.onmessage = (event) => {
      const signal = JSON.parse(event.data);
      const follow = follows.find(f => f.traderId === signal.traderId && f.autoCopy);
      
      if (follow) {
        setPendingSignal({ ...signal, follow });
        setShowConfirmModal(true);
      }
    };

    return () => eventSource.close();
  };

  const handleConfirmCopy = async (signal: any, follow: Follow) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/trading/copy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          signalId: signal.id,
          multiplier: follow.multiplier,
          riskPct: follow.riskPct,
        }),
      });

      if (response.ok) {
        setShowConfirmModal(false);
        setPendingSignal(null);
        fetchData();
      }
    } catch (error) {
      console.error('Failed to copy trade:', error);
    }
  };

  const toggleAutoCopy = async (followId: string, autoCopy: boolean) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/trading/followers/${followId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ autoCopy }),
      });
      fetchData();
    } catch (error) {
      console.error('Failed to update auto-copy:', error);
    }
  };

  const totalPnL = copyTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  const openTrades = copyTrades.filter(t => t.status === 'open').length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center space-x-2">
          <svg className="w-6 h-6 text-royal-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
          <h1 className="text-2xl font-bold text-muted-gray-900">Copy Trading</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div>
              <p className="text-sm font-medium text-muted-gray-500 mb-1">Total P&L</p>
              <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${totalPnL.toLocaleString()}
              </p>
            </div>
          </Card>
          <Card>
            <div>
              <p className="text-sm font-medium text-muted-gray-500 mb-1">Open Trades</p>
              <p className="text-2xl font-bold text-muted-gray-900">{openTrades}</p>
            </div>
          </Card>
          <Card>
            <div>
              <p className="text-sm font-medium text-muted-gray-500 mb-1">Followed Traders</p>
              <p className="text-2xl font-bold text-muted-gray-900">{follows.length}</p>
            </div>
          </Card>
        </div>

        {/* Followed Traders */}
        <Card>
          <h3 className="text-lg font-semibold text-muted-gray-900 mb-4">Followed Traders</h3>
          {follows.length === 0 ? (
            <p className="text-muted-gray-500">No followed traders yet</p>
          ) : (
            <div className="space-y-4">
              {follows.map((follow) => (
                <div key={follow.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-semibold">{follow.traderName}</p>
                    <p className="text-sm text-muted-gray-500">
                      Multiplier: {follow.multiplier}x | Risk: {follow.riskPct || 'Default'}%
                    </p>
                  </div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <span className="text-sm font-medium">Auto-Copy</span>
                    <input
                      type="checkbox"
                      checked={follow.autoCopy}
                      onChange={(e) => toggleAutoCopy(follow.id, e.target.checked)}
                      className="w-4 h-4 text-royal-purple-600 rounded focus:ring-royal-purple-500"
                    />
                  </label>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Copy Trades History */}
        <Card>
          <h3 className="text-lg font-semibold text-muted-gray-900 mb-4">Copy Trades History</h3>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pale-blue-500 mx-auto"></div>
            </div>
          ) : copyTrades.length === 0 ? (
            <p className="text-muted-gray-500">No copy trades yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="table-header">
                  <tr>
                    <th className="text-left">Trader</th>
                    <th className="text-left">Symbol</th>
                    <th className="text-right">Amount</th>
                    <th className="text-right">Price</th>
                    <th className="text-right">P&L</th>
                    <th className="text-left">Status</th>
                    <th className="text-left">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {copyTrades.map((trade) => (
                    <tr key={trade.id} className="hover:bg-gray-50">
                      <td className="table-cell font-medium">{trade.traderName}</td>
                      <td className="table-cell">{trade.symbol}</td>
                      <td className="table-cell text-right">${trade.amount.toLocaleString()}</td>
                      <td className="table-cell text-right">${trade.executedPrice.toFixed(2)}</td>
                      <td className={`table-cell text-right font-semibold ${trade.pnl && trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {trade.pnl !== undefined ? `$${trade.pnl.toFixed(2)}` : '—'}
                      </td>
                      <td className="table-cell">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            trade.status === 'open'
                              ? 'bg-blue-100 text-blue-800'
                              : trade.status === 'closed'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {trade.status}
                        </span>
                      </td>
                      <td className="table-cell text-muted-gray-500 text-sm">
                        {new Date(trade.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Confirm Copy Modal */}
      {showConfirmModal && pendingSignal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Copy Trade</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-gray-500">Trader</p>
                <p className="font-semibold">{pendingSignal.traderName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-gray-500">Symbol</p>
                <p className="font-semibold">{pendingSignal.symbol}</p>
              </div>
              <div>
                <p className="text-sm text-muted-gray-500">Side</p>
                <p className="font-semibold">{pendingSignal.side.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-gray-500">Original Size</p>
                <p className="font-semibold">{pendingSignal.size}</p>
              </div>
              <div>
                <p className="text-sm text-muted-gray-500">Your Size (with {pendingSignal.follow.multiplier}x multiplier)</p>
                <p className="font-semibold">{(pendingSignal.size * pendingSignal.follow.multiplier).toFixed(2)}</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setPendingSignal(null);
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleConfirmCopy(pendingSignal, pendingSignal.follow)}
                  className="btn-primary flex-1"
                >
                  Confirm Copy
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Layout>
  );
}

