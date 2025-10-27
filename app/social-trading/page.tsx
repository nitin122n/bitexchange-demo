'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import DataTable from '@/components/DataTable';

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
  const [activeTab, setActiveTab] = useState<'overview' | 'traders' | 'trades' | 'copy-trades' | 'analytics' | 'integration'>('overview');
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
                { id: 'overview', name: 'Overview', icon: '📋' },
                { id: 'traders', name: 'Traders', icon: '👥' },
                { id: 'trades', name: 'Live Trades', icon: '📈' },
                { id: 'copy-trades', name: 'Copy Trades', icon: '📋' },
                { id: 'analytics', name: 'Analytics', icon: '📊' },
                { id: 'integration', name: 'MT5 Integration', icon: '🔌' }
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

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <Card>
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Social Trading Overview</h2>
                  <p className="text-lg text-gray-700 mb-6">
                    Social trading allows users to follow expert traders and automatically copy their trades. This creates a collaborative environment where successful traders can share their strategies while followers learn and profit.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-pale-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <strong className="text-gray-900">Live Trading Signals:</strong>
                        <span className="text-gray-700 ml-2">Real-time notifications when expert traders open or close positions.</span>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-pale-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <strong className="text-gray-900">Performance Metrics:</strong>
                        <span className="text-gray-700 ml-2">Track trader statistics including win rate, total profit, and risk level.</span>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-pale-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <strong className="text-gray-900">Copy Trading:</strong>
                        <span className="text-gray-700 ml-2">Automatically replicate trades from expert traders with customizable risk settings.</span>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-pale-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <strong className="text-gray-900">Risk Management:</strong>
                        <span className="text-gray-700 ml-2">Set maximum drawdown, leverage limits, and position sizing for each followed trader.</span>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-pale-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <strong className="text-gray-900">Follower Analytics:</strong>
                        <span className="text-gray-700 ml-2">Monitor copy trades, track performance, and manage multiple trader follow relationships.</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* How to Get Started */}
            <Card>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Getting Started with Social Trading</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-pale-blue-500 to-pale-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Explore Top Traders</h4>
                    <p className="text-gray-600">Browse the list of verified traders and review their performance metrics.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-pale-blue-500 to-pale-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Configure Risk Settings</h4>
                    <p className="text-gray-600">Set your desired risk parameters including maximum drawdown and position sizing.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-pale-blue-500 to-pale-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Start Copying Trades</h4>
                    <p className="text-gray-600">Select traders to follow and begin automatically copying their live trades.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

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
              <DataTable
                headers={['Trader', 'Status', 'Risk Level', 'Followers', 'Win Rate', 'Total Profit', 'Monthly Profit', 'Verified', 'Actions']}
                data={filteredTraders.map(trader => [
                  <div key={trader.id} className="flex items-center space-x-3">
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
                  <span key={`followers-${trader.id}`} className="font-medium">{trader.followers.toLocaleString()}</span>,
                  <span key={`winrate-${trader.id}`} className="font-medium text-green-600">{trader.winRate}%</span>,
                  <span key={`totalprofit-${trader.id}`} className="font-medium">${trader.totalProfit.toLocaleString()}</span>,
                  <span key={`monthlyprofit-${trader.id}`} className="font-medium">${trader.monthlyProfit.toLocaleString()}</span>,
                  <span key={`verified-${trader.id}`} className={`px-2 py-1 rounded-full text-xs font-medium ${
                    trader.verified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {trader.verified ? '✓ Verified' : 'Unverified'}
                  </span>,
                  <div key={`actions-${trader.id}`} className="flex items-center space-x-2">
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
            <DataTable
              headers={['Trader', 'Symbol', 'Type', 'Amount', 'Price', 'Profit', 'Followers', 'Time']}
              data={trades.map(trade => [
                trade.traderName,
                <span key={`symbol-${trade.id}`} className="font-medium">{trade.symbol}</span>,
                getTradeTypeBadge(trade.type),
                <span key={`amount-${trade.id}`} className="font-medium">{trade.amount}</span>,
                <span key={`price-${trade.id}`} className="font-medium">${trade.price.toLocaleString()}</span>,
                <span key={`profit-${trade.id}`} className={`font-medium ${trade.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${trade.profit.toLocaleString()}
                </span>,
                <span key={`followers-${trade.id}`} className="font-medium">{trade.followers}</span>,
                formatDate(trade.timestamp)
              ])}
            />
          </Card>
        )}

        {/* Copy Trades Tab */}
        {activeTab === 'copy-trades' && (
          <Card>
            <DataTable
              headers={['Follower', 'Trader', 'Amount', 'Profit', 'Status', 'Time']}
              data={copyTrades.map(copyTrade => [
                copyTrade.followerName,
                copyTrade.traderName,
                <span key={`amount-${copyTrade.id}`} className="font-medium">${copyTrade.amount.toLocaleString()}</span>,
                <span key={`profit-${copyTrade.id}`} className={`font-medium ${copyTrade.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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

        {/* MT5 Integration Tab */}
        {activeTab === 'integration' && (
          <div className="space-y-6">
            <Card>
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">MT5 Integration Options</h2>
                  <p className="text-lg text-gray-700 mb-6">
                    MT5 provides several ways to access its data. Choose the integration method that best fits your requirements.
                  </p>
                  
                  {/* MT5 Manager API */}
                  <div className="border border-gray-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">A. MT5 Manager API</h3>
                        <p className="text-gray-600">Official API for brokers</p>
                      </div>
                    </div>
                    <ul className="space-y-2 ml-16">
                      <li className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">Accessing accounts, trades, balances, positions</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">Managing IB commissions</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">Generating reports</span>
                      </li>
                    </ul>
                    <div className="mt-4 ml-16">
                      <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full">
                        Usually requires broker permissions or a licensed MT5 server
                      </span>
                    </div>
                  </div>

                  {/* MT5 Gateway / Trade Server API */}
                  <div className="border border-gray-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">B. MT5 Gateway / Trade Server API</h3>
                        <p className="text-gray-600">Connects external apps to MT5 trade server</p>
                      </div>
                    </div>
                    <ul className="space-y-2 ml-16">
                      <li className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">Executing trades</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">Fetching account data</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">Monitoring real-time positions</span>
                      </li>
                    </ul>
                  </div>

                  {/* MetaTrader Web API / REST API */}
                  <div className="border border-gray-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.1-.5.14-.882.343-1.182.525A35.92 35.92 0 008.636 7.6c.266.506.46 1.004.575 1.494.143.596.17 1.127.136 1.6h4.936c-.033-.473-.006-1.004.137-1.6.115-.49.31-.988.576-1.494.348-.706.728-1.268 1.182-1.875a5.78 5.78 0 00-1.647-.425C10.232 4.032 10.076 4 10 4zM2 10a8 8 0 1016 0 8 8 0 00-16 0zm6-.5a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">C. MetaTrader Web API / REST API</h3>
                        <p className="text-gray-600">Modern web-friendly API for MT5 integration</p>
                      </div>
                    </div>
                    <ul className="space-y-2 ml-16">
                      <li className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">Some brokers expose REST or WebSocket APIs for MT5</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">Easier for modern web apps and CRM integration</span>
                      </li>
                    </ul>
                  </div>

                  {/* MT5 Python / MQL5 Scripts */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">D. MT5 Python / MQL5 Scripts</h3>
                        <p className="text-gray-600">Automated data collection via scripts</p>
                      </div>
                    </div>
                    <ul className="space-y-2 ml-16">
                      <li className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">Use MQL5 scripts to push trade data from MT5 to your CRM</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">Python integration can pull trade reports and account details</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            {/* Integration Recommendation */}
            <Card>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommended Integration Approach</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <h4 className="font-semibold text-gray-900 mb-2">For Social Trading:</h4>
                  <p className="text-gray-700">
                    We recommend <strong>MT5 Gateway / Trade Server API</strong> for social trading features as it provides real-time 
                    position monitoring and trade execution capabilities. This enables seamless copy trading functionality 
                    with instant synchronization across all follower accounts.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
