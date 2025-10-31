'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Card from '@/components/Card';

interface Commission {
  id: string;
  clientId: string;
  clientName: string;
  amount: number;
  type: 'trade' | 'deposit';
  description?: string;
  createdAt: string;
}

export default function CommissionTrackingPage() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'trade' | 'deposit'>('all');

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/ib/commissions', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCommissions(data.commissions || []);
      }
    } catch (error) {
      console.error('Failed to fetch commissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCommissions = filter === 'all'
    ? commissions
    : commissions.filter(c => c.type === filter);

  const summary = {
    total: commissions.reduce((sum, c) => sum + c.amount, 0),
    byTrade: commissions.filter(c => c.type === 'trade').reduce((sum, c) => sum + c.amount, 0),
    byDeposit: commissions.filter(c => c.type === 'deposit').reduce((sum, c) => sum + c.amount, 0),
    count: commissions.length,
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center space-x-2">
          <svg className="w-6 h-6 text-royal-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.114 1.549c.562.315 1.287.451 2.077.451s1.515-.136 2.077-.451a1 1 0 10-1.114-1.549c-.163.187-.452.377-.843.504v-1.941a4.535 4.535 0 001.676-.662C13.398 9.766 14 8.991 14 8c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 5.092V4z" clipRule="evenodd" />
          </svg>
          <h1 className="text-2xl font-bold text-muted-gray-900">Commission Tracking</h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-royal-purple-50 to-emerald-gold-50">
            <div>
              <p className="text-sm font-medium text-muted-gray-500 mb-1">Total Commission</p>
              <p className="text-3xl font-bold text-royal-purple-600">${summary.total.toLocaleString()}</p>
            </div>
          </Card>
          <Card>
            <div>
              <p className="text-sm font-medium text-muted-gray-500 mb-1">From Trades</p>
              <p className="text-2xl font-bold text-muted-gray-900">${summary.byTrade.toLocaleString()}</p>
            </div>
          </Card>
          <Card>
            <div>
              <p className="text-sm font-medium text-muted-gray-500 mb-1">From Deposits</p>
              <p className="text-2xl font-bold text-muted-gray-900">${summary.byDeposit.toLocaleString()}</p>
            </div>
          </Card>
          <Card>
            <div>
              <p className="text-sm font-medium text-muted-gray-500 mb-1">Total Transactions</p>
              <p className="text-2xl font-bold text-muted-gray-900">{summary.count}</p>
            </div>
          </Card>
        </div>

        {/* Commissions Table */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-royal-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('trade')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'trade'
                    ? 'bg-royal-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Trades
              </button>
              <button
                onClick={() => setFilter('deposit')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'deposit'
                    ? 'bg-royal-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Deposits
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pale-blue-500 mx-auto"></div>
            </div>
          ) : filteredCommissions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-gray-500">No commissions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="table-header">
                  <tr>
                    <th className="text-left">Client</th>
                    <th className="text-left">Type</th>
                    <th className="text-right">Amount</th>
                    <th className="text-left">Description</th>
                    <th className="text-left">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCommissions.map((commission) => (
                    <tr key={commission.id} className="hover:bg-gray-50">
                      <td className="table-cell font-medium">{commission.clientName}</td>
                      <td className="table-cell">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            commission.type === 'trade'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {commission.type}
                        </span>
                      </td>
                      <td className="table-cell text-right font-semibold text-royal-purple-600">
                        ${commission.amount.toLocaleString()}
                      </td>
                      <td className="table-cell text-muted-gray-600">
                        {commission.description || '—'}
                      </td>
                      <td className="table-cell text-muted-gray-500">
                        {new Date(commission.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}

