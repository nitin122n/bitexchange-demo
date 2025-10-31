'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Card from '@/components/Card';

interface FollowerRelationship {
  id: string;
  traderId: string;
  traderName: string;
  multiplier: number;
  autoCopy: boolean;
  cumulativePnL: number;
  successRate: number;
  totalCopiedTrades: number;
  avgTradeTime: number;
  drawdownHistory: Array<{ date: string; drawdown: number }>;
  copyTrades: Array<{
    id: string;
    copiedOrderId: string;
    originalSignalId: string;
    pnl: number;
    date: string;
  }>;
}

export default function FollowerAnalyticsPage() {
  const [relationships, setRelationships] = useState<FollowerRelationship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRelationship, setSelectedRelationship] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/trading/followers/analytics', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setRelationships(data.relationships || []);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePause = async (relationshipId: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/trading/followers/${relationshipId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ autoCopy: false }),
      });
      fetchAnalytics();
    } catch (error) {
      console.error('Failed to pause:', error);
    }
  };

  const handleUnfollow = async (relationshipId: string) => {
    if (!confirm('Are you sure you want to unfollow this trader?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/trading/followers/${relationshipId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      fetchAnalytics();
    } catch (error) {
      console.error('Failed to unfollow:', error);
    }
  };

  const handleUpdateMultiplier = async (relationshipId: string, multiplier: number) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/trading/followers/${relationshipId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ multiplier }),
      });
      fetchAnalytics();
    } catch (error) {
      console.error('Failed to update multiplier:', error);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pale-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center space-x-2">
          <svg className="w-6 h-6 text-royal-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          <h1 className="text-2xl font-bold text-muted-gray-900">Follower Analytics</h1>
        </div>

        {relationships.length === 0 ? (
          <Card>
            <p className="text-muted-gray-500 text-center py-12">No follower relationships found</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {relationships.map((rel) => (
              <Card key={rel.id}>
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{rel.traderName}</h3>
                      <p className="text-sm text-muted-gray-500">
                        {rel.autoCopy ? 'Auto-copy enabled' : 'Auto-copy paused'}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePause(rel.id)}
                        className="btn-secondary text-sm"
                      >
                        {rel.autoCopy ? 'Pause' : 'Resume'}
                      </button>
                      <button
                        onClick={() => handleUnfollow(rel.id)}
                        className="btn-danger text-sm"
                      >
                        Unfollow
                      </button>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-gray-500 mb-1">Cumulative P&L</p>
                      <p className={`text-xl font-bold ${rel.cumulativePnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${rel.cumulativePnL.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-gray-500 mb-1">Success Rate</p>
                      <p className="text-xl font-bold">{rel.successRate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-gray-500 mb-1">Total Trades</p>
                      <p className="text-xl font-bold">{rel.totalCopiedTrades}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-gray-500 mb-1">Avg Trade Time</p>
                      <p className="text-xl font-bold">{rel.avgTradeTime.toFixed(1)}h</p>
                    </div>
                  </div>

                  {/* Multiplier Control */}
                  <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-muted-gray-700">
                      Copy Multiplier:
                    </label>
                    <input
                      type="number"
                      min="0.1"
                      max="10"
                      step="0.1"
                      value={rel.multiplier}
                      onChange={(e) => {
                        const newMultiplier = parseFloat(e.target.value);
                        handleUpdateMultiplier(rel.id, newMultiplier);
                      }}
                      className="input-field w-24"
                    />
                  </div>

                  {/* Copy Trades List */}
                  {selectedRelationship === rel.id && (
                    <div className="mt-4 border-t pt-4">
                      <h4 className="font-semibold mb-3">Copy Trades History</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="table-header">
                            <tr>
                              <th className="text-left">Order ID</th>
                              <th className="text-left">Signal ID</th>
                              <th className="text-right">P&L</th>
                              <th className="text-left">Date</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {rel.copyTrades.map((trade) => (
                              <tr key={trade.id} className="hover:bg-gray-50">
                                <td className="table-cell font-mono text-sm">{trade.copiedOrderId}</td>
                                <td className="table-cell font-mono text-sm">{trade.originalSignalId}</td>
                                <td className={`table-cell text-right font-semibold ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  ${trade.pnl.toFixed(2)}
                                </td>
                                <td className="table-cell text-muted-gray-500 text-sm">
                                  {new Date(trade.date).toLocaleDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedRelationship(selectedRelationship === rel.id ? null : rel.id)}
                    className="text-sm text-royal-purple-600 hover:text-royal-purple-700"
                  >
                    {selectedRelationship === rel.id ? 'Hide Details' : 'Show Details'}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
