'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Card from '@/components/Card';

interface Payout {
  id: string;
  amount: number;
  status: 'Pending' | 'Paid' | 'Rejected';
  requestedAt: string;
  processedAt?: string;
  notes?: string;
}

export default function PayoutManagementPage() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [availableCommission, setAvailableCommission] = useState(0);
  const [requestAmount, setRequestAmount] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'Pending' | 'Paid' | 'Rejected'>('all');

  useEffect(() => {
    fetchPayoutData();
  }, []);

  const fetchPayoutData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [payoutsResponse, commissionResponse] = await Promise.all([
        fetch('/api/ib/payouts', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch('/api/ib/commissions', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      let currentPayouts: Payout[] = [];
      if (payoutsResponse.ok) {
        const payoutsData = await payoutsResponse.json();
        currentPayouts = payoutsData.payouts || [];
        setPayouts(currentPayouts);
      }

      if (commissionResponse.ok) {
        const commissionData = await commissionResponse.json();
        const totalCommission = commissionData.commissions?.reduce((sum: number, c: any) => sum + c.amount, 0) || 0;
        const paidPayouts = currentPayouts.filter((p: Payout) => p.status === 'Paid').reduce((sum: number, p: Payout) => sum + p.amount, 0);
        setAvailableCommission(totalCommission - paidPayouts);
      }
    } catch (error) {
      console.error('Failed to fetch payout data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestPayout = async () => {
    const amount = parseFloat(requestAmount);
    if (!amount || amount <= 0 || amount > availableCommission) {
      alert('Invalid amount');
      return;
    }

    setIsRequesting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/ib/payouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });

      if (response.ok) {
        setRequestAmount('');
        fetchPayoutData();
        alert('Payout request submitted successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to request payout');
      }
    } catch (error) {
      console.error('Payout request error:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsRequesting(false);
    }
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/ib/payouts/export?format=${format}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `payout-history.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export payout history');
    }
  };

  const filteredPayouts = filter === 'all'
    ? payouts
    : payouts.filter(p => p.status === filter);

  const stats = {
    total: payouts.reduce((sum, p) => sum + p.amount, 0),
    pending: payouts.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0),
    paid: payouts.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0),
    rejected: payouts.filter(p => p.status === 'Rejected').reduce((sum, p) => sum + p.amount, 0),
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-royal-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            <h1 className="text-2xl font-bold text-muted-gray-900">Payout Management</h1>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleExport('csv')}
              className="btn-secondary"
            >
              Export CSV
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="btn-secondary"
            >
              Export PDF
            </button>
          </div>
        </div>

        {/* Stats and Request Payout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-r from-emerald-gold-50 to-royal-purple-50">
            <div>
              <p className="text-sm font-medium text-muted-gray-500 mb-1">Available Commission</p>
              <p className="text-3xl font-bold text-emerald-gold-600">${availableCommission.toLocaleString()}</p>
            </div>
          </Card>
          <Card>
            <div>
              <p className="text-sm font-medium text-muted-gray-500 mb-1">Total Paid</p>
              <p className="text-2xl font-bold text-green-600">${stats.paid.toLocaleString()}</p>
            </div>
          </Card>
          <Card>
            <div>
              <p className="text-sm font-medium text-muted-gray-500 mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">${stats.pending.toLocaleString()}</p>
            </div>
          </Card>
          <Card>
            <div>
              <p className="text-sm font-medium text-muted-gray-500 mb-1">Rejected</p>
              <p className="text-2xl font-bold text-red-600">${stats.rejected.toLocaleString()}</p>
            </div>
          </Card>
          <Card>
            <div>
              <p className="text-sm font-medium text-muted-gray-500 mb-1">Total Requests</p>
              <p className="text-2xl font-bold text-muted-gray-900">{payouts.length}</p>
            </div>
          </Card>
        </div>

        {/* Request Payout Form */}
        <Card>
          <h3 className="text-lg font-semibold text-muted-gray-900 mb-4">Request Payout</h3>
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <label htmlFor="amount" className="block text-sm font-medium text-muted-gray-700 mb-2">
                Amount ($)
              </label>
              <input
                type="number"
                id="amount"
                value={requestAmount}
                onChange={(e) => setRequestAmount(e.target.value)}
                className="input-field"
                placeholder="0.00"
                min="0"
                max={availableCommission}
                step="0.01"
              />
              <p className="text-xs text-muted-gray-500 mt-1">
                Maximum: ${availableCommission.toLocaleString()}
              </p>
            </div>
            <button
              onClick={handleRequestPayout}
              disabled={isRequesting || !requestAmount || parseFloat(requestAmount) <= 0}
              className="btn-primary px-6 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRequesting ? 'Requesting...' : 'Request Payout'}
            </button>
          </div>
        </Card>

        {/* Payouts Table */}
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
                onClick={() => setFilter('Pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'Pending'
                    ? 'bg-royal-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('Paid')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'Paid'
                    ? 'bg-royal-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Paid
              </button>
              <button
                onClick={() => setFilter('Rejected')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'Rejected'
                    ? 'bg-royal-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Rejected
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pale-blue-500 mx-auto"></div>
            </div>
          ) : filteredPayouts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-gray-500">No payouts found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="table-header">
                  <tr>
                    <th className="text-left">Amount</th>
                    <th className="text-left">Status</th>
                    <th className="text-left">Requested</th>
                    <th className="text-left">Processed</th>
                    <th className="text-left">Notes</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayouts.map((payout) => (
                    <tr key={payout.id} className="hover:bg-gray-50">
                      <td className="table-cell font-semibold">${payout.amount.toLocaleString()}</td>
                      <td className="table-cell">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            payout.status === 'Paid'
                              ? 'bg-green-100 text-green-800'
                              : payout.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {payout.status}
                        </span>
                      </td>
                      <td className="table-cell text-muted-gray-600">
                        {new Date(payout.requestedAt).toLocaleString()}
                      </td>
                      <td className="table-cell text-muted-gray-600">
                        {payout.processedAt ? new Date(payout.processedAt).toLocaleString() : '—'}
                      </td>
                      <td className="table-cell text-muted-gray-600">
                        {payout.notes || '—'}
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

