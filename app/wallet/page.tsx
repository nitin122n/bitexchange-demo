'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import Modal from '@/components/Modal';
import QRViewer from '@/components/QRViewer';

interface WalletBalance {
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  address: string;
}

interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  symbol: string;
  amount: number;
  address: string;
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
  timestamp: string;
}

export default function WalletPage() {
  const [balances, setBalances] = useState<WalletBalance[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<string>('');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const mockBalances: WalletBalance[] = [
        { symbol: 'BTC', name: 'Bitcoin', balance: 0.125, usdValue: 5406.25, address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' },
        { symbol: 'ETH', name: 'Ethereum', balance: 2.5, usdValue: 6626.88, address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6' },
        { symbol: 'USDT', name: 'Tether', balance: 5000, usdValue: 5000, address: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE' },
        { symbol: 'TRX', name: 'TRON', balance: 10000, usdValue: 1250, address: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE' }
      ];

      const mockTransactions: Transaction[] = [
        { id: 'TXN-001', type: 'DEPOSIT', symbol: 'BTC', amount: 0.05, address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', status: 'CONFIRMED', timestamp: '2024-10-23T10:30:00Z' },
        { id: 'TXN-002', type: 'WITHDRAWAL', symbol: 'USDT', amount: 1000, address: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE', status: 'PENDING', timestamp: '2024-10-23T09:15:00Z' }
      ];

      setBalances(mockBalances);
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeposit = (symbol: string) => {
    setSelectedCoin(symbol);
    setShowDepositModal(true);
  };

  const handleWithdraw = (symbol: string) => {
    setSelectedCoin(symbol);
    setShowWithdrawModal(true);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    );
  };

  const totalValue = balances.reduce((sum, balance) => sum + balance.usdValue, 0);

  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-muted-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            <h1 className="text-2xl font-bold text-muted-gray-900">My Wallet</h1>
          </div>
          <div className="text-sm text-gray-600">
            Total Value: ${totalValue.toLocaleString()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {balances.map((balance) => (
            <Card key={balance.symbol}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-pale-blue-500 to-pale-teal-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{balance.symbol}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{balance.name}</h3>
                    <p className="text-sm text-gray-500">{balance.symbol}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {balance.balance.toFixed(8)} {balance.symbol}
                </div>
                <div className="text-lg text-gray-600">
                  ≈ ${balance.usdValue.toLocaleString()}
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleDeposit(balance.symbol)}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium"
                >
                  Deposit
                </button>
                <button
                  onClick={() => handleWithdraw(balance.symbol)}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Withdraw
                </button>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Wallet Address</div>
                <div className="text-sm font-mono text-gray-700 break-all">
                  {balance.address}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction History</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-sm font-medium text-gray-600">Type</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-600">Coin</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-600">Amount</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-100">
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tx.type === 'DEPOSIT' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 text-sm font-medium text-gray-900">{tx.symbol}</td>
                    <td className="py-3 text-sm text-gray-600">{tx.amount.toFixed(8)}</td>
                    <td className="py-3">{getStatusBadge(tx.status)}</td>
                    <td className="py-3 text-sm text-gray-600">{new Date(tx.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {showDepositModal && (
          <Modal
            isOpen={showDepositModal}
            onClose={() => setShowDepositModal(false)}
            title={`Deposit ${selectedCoin}`}
          >
            <div className="space-y-6">
              <div className="text-center">
                <QRViewer
                  value={balances.find(b => b.symbol === selectedCoin)?.address || ''}
                  size={200}
                />
                <p className="text-sm text-gray-600 mt-4">
                  Scan QR code or copy address below to deposit {selectedCoin}
                </p>
                <div className="p-3 bg-gray-50 rounded-lg mt-4">
                  <div className="text-xs text-gray-500 mb-1">Deposit Address</div>
                  <div className="text-sm font-mono text-gray-700 break-all">
                    {balances.find(b => b.symbol === selectedCoin)?.address}
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {showWithdrawModal && (
          <Modal
            isOpen={showWithdrawModal}
            onClose={() => setShowWithdrawModal(false)}
            title={`Withdraw ${selectedCoin}`}
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Withdrawal Address
                </label>
                <input
                  type="text"
                  placeholder={`Enter ${selectedCoin} address`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pale-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pale-blue-500 focus:border-transparent"
                />
                <div className="text-sm text-gray-500 mt-1">
                  Available: {balances.find(b => b.symbol === selectedCoin)?.balance.toFixed(8)} {selectedCoin}
                </div>
              </div>

              <button className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-colors font-medium">
                Confirm Withdrawal
              </button>
            </div>
          </Modal>
        )}
      </div>
    </Layout>
  );
}
