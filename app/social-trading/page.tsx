'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import Table from '@/components/Table';

interface Trader {
  id: string;
  name: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  followers: number;
  totalTrades: number;
  winRate: number;
  totalProfit: number;
  monthlyProfit: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  joinDate: string;
  lastActive: string;
  verified: boolean;
}

interface Trade {
  id: string;
  traderId: string;
  traderName: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  amount: number;
  price: number;
  profit: number;
  timestamp: string;
  followers: number;
}

interface CopyTrade {
  id: string;
  followerId: string;
  followerName: string;
  traderId: string;
  traderName: string;
  tradeId: string;
  amount: number;
  profit: number;
  timestamp: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export default function SocialTradingPage() {
  const [traders, setTraders] = useState<Trader[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [copyTrades, setCopyTrades] = useState<CopyTrade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'traders' | 'trades' | 'copy-trades' | 'analytics'>('traders');
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Mock data for Traders
      const mockTraders: Trader[] = [
        {
          id: '1',
          name: 'CryptoMaster',
          email: 'cryptomaster@email.com',
          status: 'ACTIVE',
          followers: 1250,
          totalTrades: 342,
          winRate: 78.5,
          totalProfit: 45000,
          monthlyProfit: 8500,
          riskLevel: 'MEDIUM',
          joinDate: '2023-01-15',
          lastActive: '2024-10-23T10:30:00Z',
          verified: true
        },
        {
          id: '2',
          name: 'BitcoinBull',
          email: 'bitcoinbull@email.com',
          status: 'ACTIVE',
          followers: 890,
          totalTrades: 156,
          winRate: 82.3,
          totalProfit: 32000,
          monthlyProfit: 6200,
          riskLevel: 'HIGH',
          joinDate: '2023-03-20',
          lastActive: '2024-10-23T09:15:00Z',
          verified: true
        },
        {
          id: '3',
          name: 'SafeTrader',
          email: 'safetrader@email.com',
          status: 'ACTIVE',
          followers: 2100,
          totalTrades: 89,
          winRate: 91.2,
          totalProfit: 28000,
          monthlyProfit: 4200,
          riskLevel: 'LOW',
          joinDate: '2023-02-10',
          lastActive: '2024-10-22T16:45:00Z',
          verified: true
        },
        {
          id: '4',
          name: 'AltcoinKing',
          email: 'altcoinking@email.com',
          status: 'INACTIVE',
          followers: 450,
          totalTrades: 78,
          winRate: 65.4,
          totalProfit: 12000,
          monthlyProfit: 0,
          riskLevel: 'HIGH',
          joinDate: '2023-05-08',
          lastActive: '2024-10-15T14:20:00Z',
          verified: false
        }
      ];

      // Mock data for Trades
      const mockTrades: Trade[] = [
        {
          id: '1',
          traderId: '1',
          traderName: 'CryptoMaster',
          symbol: 'BTC/USD',
          type: 'BUY',
          amount: 0.5,
          price: 45000,
          profit: 1250,
          timestamp: '2024-10-23T10:30:00Z',
          followers: 45
        },
        {
          id: '2',
          traderId: '2',
          traderName: 'BitcoinBull',
          symbol: 'ETH/USD',
          type: 'SELL',
          amount: 2.0,
          price: 3200,
          profit: -200,
          timestamp: '2024-10-23T09:15:00Z',
          followers: 32
        },
        {
          id: '3',
          traderId: '3',
          traderName: 'SafeTrader',
          symbol: 'ADA/USD',
          type: 'BUY',
          amount: 1000,
          price: 0.45,
          profit: 150,
          timestamp: '2024-10-22T16:45:00Z',
          followers: 78
        }
      ];

      // Mock data for Copy Trades
      const mockCopyTrades: CopyTrade[] = [
        {
          id: '1',
          followerId: '101',
          followerName: 'John Doe',
          traderId: '1',
          traderName: 'CryptoMaster',
          tradeId: '1',
          amount: 1000,
          profit: 25,
          timestamp: '2024-10-23T10:35:00Z',
          status: 'ACTIVE'
        },
        {
          id: '2',
          followerId: '102',
          followerName: 'Jane Smith',
          traderId: '1',
          traderName: 'CryptoMaster',
          tradeId: '1',
          amount: 500,
          profit: 12.5,
          timestamp: '2024-10-23T10:32:00Z',
          status: 'ACTIVE'
        },
        {
          id: '3',
          followerId: '103',
          followerName: 'Mike Johnson',
          traderId: '3',
          traderName: 'SafeTrader',
          tradeId: '3',
          amount: 2000,
          profit: 30,
          timestamp: '2024-10-22T16:50:00Z',
          status: 'COMPLETED'
        }
      ];

      setTraders(mockTraders);
      setTrades(mockTrades);
      setCopyTrades(mockCopyTrades);
    } catch (error) {
      console.error('Failed to fetch social trading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTraders = traders.filter(trader => {
    const matchesSearch = trader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trader.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'ALL' || trader.riskLevel === riskFilter;
    
    return matchesSearch && matchesRisk;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-gray-100 text-gray-800',
      SUSPENDED: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    );
  };

  const getRiskBadge = (risk: string) => {
    const styles = {
      LOW: 'bg-green-100 text-green-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      HIGH: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[risk as keyof typeof styles]}`}>
        {risk}
      </span>
    );
  };

  const getTradeTypeBadge = (type: string) => {
    const styles = {
      BUY: 'bg-green-100 text-green-800',
      SELL: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[type as keyof typeof styles]}`}>
        {type}
      </span>
    );
  };

  const getCopyTradeStatusBadge = (status: string) => {
    const styles = {
      ACTIVE: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const totalTraders = traders.length;
  const activeTraders = traders.filter(t => t.status === 'ACTIVE').length;
  const totalFollowers = traders.reduce((sum, t) => sum + t.followers, 0);
  const totalCopyTrades = copyTrades.length;

  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-muted-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
            </svg>
            <h1 className="text-2xl font-bold text-muted-gray-900">Social Trading</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="btn-primary">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Trader
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Traders</p>
                <p className="text-2xl font-bold text-gray-900">{totalTraders}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Traders</p>
                <p className="text-2xl font-bold text-gray-900">{activeTraders}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Followers</p>
                <p className="text-2xl font-bold text-gray-900">{totalFollowers.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Copy Trades</p>
                <p className="text-2xl font-bold text-gray-900">{totalCopyTrades}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Card>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'traders', name: 'Traders', icon: '👥' },
                { id: 'trades', name: 'Live Trades', icon: '📈' },
                { id: 'copy-trades', name: 'Copy Trades', icon: '📋' },
                { id: 'analytics', name: 'Analytics', icon: '📊' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-pale-blue-500 text-pale-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </Card>

        {/* Traders Tab */}
        {activeTab === 'traders' && (
          <div className="space-y-6">
            {/* Filters */}
            <Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Traders
                  </label>
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Risk Level
                  </label>
                  <select
                    value={riskFilter}
                    onChange={(e) => setRiskFilter(e.target.value)}
                    className="input-field"
                  >
                    <option value="ALL">All Risk Levels</option>
                    <option value="LOW">Low Risk</option>
                    <option value="MEDIUM">Medium Risk</option>
                    <option value="HIGH">High Risk</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Traders Table */}
            <Card>
              <Table
                headers={['Trader', 'Status', 'Risk Level', 'Followers', 'Win Rate', 'Total Profit', 'Monthly Profit', 'Verified', 'Actions']}
                data={filteredTraders.map(trader => [
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-pale-blue-500 to-pale-teal-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {trader.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-muted-gray-900">{trader.name}</div>
                      <div className="text-sm text-muted-gray-500">{trader.email}</div>
                    </div>
                  </div>,
                  getStatusBadge(trader.status),
                  getRiskBadge(trader.riskLevel),
                  <span className="font-medium">{trader.followers.toLocaleString()}</span>,
                  <span className="font-medium text-green-600">{trader.winRate}%</span>,
                  <span className="font-medium">${trader.totalProfit.toLocaleString()}</span>,
                  <span className="font-medium">${trader.monthlyProfit.toLocaleString()}</span>,
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    trader.verified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {trader.verified ? '✓ Verified' : 'Unverified'}
                  </span>,
                  <div className="flex items-center space-x-2">
                    <button className="text-pale-blue-600 hover:text-pale-blue-800 text-sm font-medium">
                      View
                    </button>
                    <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                      Suspend
                    </button>
                  </div>
                ])}
              />
            </Card>
          </div>
        )}

        {/* Live Trades Tab */}
        {activeTab === 'trades' && (
          <Card>
            <Table
              headers={['Trader', 'Symbol', 'Type', 'Amount', 'Price', 'Profit', 'Followers', 'Time']}
              data={trades.map(trade => [
                trade.traderName,
                <span className="font-medium">{trade.symbol}</span>,
                getTradeTypeBadge(trade.type),
                <span className="font-medium">{trade.amount}</span>,
                <span className="font-medium">${trade.price.toLocaleString()}</span>,
                <span className={`font-medium ${trade.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${trade.profit.toLocaleString()}
                </span>,
                <span className="font-medium">{trade.followers}</span>,
                formatDate(trade.timestamp)
              ])}
            />
          </Card>
        )}

        {/* Copy Trades Tab */}
        {activeTab === 'copy-trades' && (
          <Card>
            <Table
              headers={['Follower', 'Trader', 'Amount', 'Profit', 'Status', 'Time']}
              data={copyTrades.map(copyTrade => [
                copyTrade.followerName,
                copyTrade.traderName,
                <span className="font-medium">${copyTrade.amount.toLocaleString()}</span>,
                <span className={`font-medium ${copyTrade.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${copyTrade.profit.toLocaleString()}
                </span>,
                getCopyTradeStatusBadge(copyTrade.status),
                formatDate(copyTrade.timestamp)
              ])}
            />
          </Card>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performers</h3>
              <div className="space-y-4">
                {traders
                  .sort((a, b) => b.monthlyProfit - a.monthlyProfit)
                  .slice(0, 5)
                  .map((trader, index) => (
                    <div key={trader.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 bg-pale-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium">{trader.name}</p>
                          <p className="text-sm text-gray-600">{trader.followers} followers</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">${trader.monthlyProfit.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{trader.winRate}% win rate</p>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Trading Activity</h3>
              <div className="text-center py-12">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-500">Trading activity chart would go here</p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
