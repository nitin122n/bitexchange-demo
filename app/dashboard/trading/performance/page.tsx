'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import { StatCard } from '@/components/Card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PerformanceMetrics {
  traderId: string;
  traderName: string;
  winRate: number;
  totalPnL: number;
  avgTradeDuration: number;
  avgRiskReward: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  pnlOverTime: Array<{ date: string; pnl: number }>;
  winRateHistory: Array<{ trade: number; winRate: number }>;
  monthlyPerformance: Array<{ month: string; pnl: number; trades: number }>;
}

export default function PerformanceMetricsPage() {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [selectedTrader, setSelectedTrader] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchMetrics();
  }, [dateRange]);

  const fetchMetrics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/trading/metrics?range=${dateRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMetrics(data.metrics || []);
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/trading/metrics/export', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'performance-metrics.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const selectedMetrics = selectedTrader === 'all' 
    ? metrics.reduce((acc, m) => ({
        ...acc,
        winRate: acc.winRate + m.winRate,
        totalPnL: acc.totalPnL + m.totalPnL,
        totalTrades: acc.totalTrades + m.totalTrades,
        winningTrades: acc.winningTrades + m.winningTrades,
        losingTrades: acc.losingTrades + m.losingTrades,
        pnlOverTime: [...acc.pnlOverTime, ...m.pnlOverTime],
        monthlyPerformance: m.monthlyPerformance, // Use last trader's for aggregated view
      }), {
        traderName: 'All Traders',
        winRate: 0,
        totalPnL: 0,
        avgTradeDuration: 0,
        avgRiskReward: 0,
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        pnlOverTime: [] as Array<{ date: string; pnl: number }>,
        monthlyPerformance: [] as Array<{ month: string; pnl: number; trades: number }>,
        winRateHistory: [] as Array<{ trade: number; winRate: number }>,
      } as PerformanceMetrics)
    : metrics.find(m => m.traderId === selectedTrader);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pale-blue-500"></div>
        </div>
      </Layout>
    );
  }

  const displayMetrics = selectedMetrics || {
    traderName: 'No Data',
    winRate: 0,
    totalPnL: 0,
    avgTradeDuration: 0,
    avgRiskReward: 0,
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    pnlOverTime: [],
    monthlyPerformance: [],
    winRateHistory: [],
  };

  const winRate = displayMetrics.totalTrades > 0 
    ? (displayMetrics.winningTrades / displayMetrics.totalTrades) * 100 
    : 0;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-royal-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            <h1 className="text-2xl font-bold text-muted-gray-900">Performance Metrics</h1>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="input-field max-w-xs"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
            <button onClick={handleExport} className="btn-secondary">
              Export CSV
            </button>
          </div>
        </div>

        {/* Trader Selector */}
        {metrics.length > 0 && (
          <Card>
            <label className="block text-sm font-medium text-muted-gray-700 mb-2">
              Select Trader
            </label>
            <select
              value={selectedTrader}
              onChange={(e) => setSelectedTrader(e.target.value)}
              className="input-field max-w-md"
            >
              <option value="all">All Traders (Aggregated)</option>
              {metrics.map(m => (
                <option key={m.traderId} value={m.traderId}>{m.traderName}</option>
              ))}
            </select>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Win Rate"
            value={`${winRate.toFixed(1)}%`}
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            }
          />
          <StatCard
            title="Total P&L"
            value={`$${displayMetrics.totalPnL.toLocaleString()}`}
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.114 1.549c.562.315 1.287.451 2.077.451s1.515-.136 2.077-.451a1 1 0 10-1.114-1.549c-.163.187-.452.377-.843.504v-1.941a4.535 4.535 0 001.676-.662C13.398 9.766 14 8.991 14 8c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 5.092V4z" clipRule="evenodd" />
              </svg>
            }
          />
          <StatCard
            title="Total Trades"
            value={displayMetrics.totalTrades}
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            }
          />
          <StatCard
            title="Avg Risk:Reward"
            value={displayMetrics.avgRiskReward.toFixed(2)}
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            }
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-muted-gray-900 mb-4">P&L Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={displayMetrics.pnlOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pnl" stroke="#7c3aed" strokeWidth={2} name="P&L ($)" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-muted-gray-900 mb-4">Monthly Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={displayMetrics.monthlyPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pnl" fill="#10b981" name="P&L ($)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

