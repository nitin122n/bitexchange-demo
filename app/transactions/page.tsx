'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';

interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRADE' | 'COMMISSION' | 'REFUND';
  method: 'TRC20' | 'ERC20' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'CRYPTO';
  amount: number;
  currency: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  fee: number;
  netAmount: number;
  transactionHash?: string;
  walletAddress?: string;
  description: string;
  createdAt: string;
  completedAt?: string;
  adminNotes?: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'deposits' | 'withdrawals' | 'trades' | 'commissions'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      // Mock data for transactions
      const mockTransactions: Transaction[] = [
        {
          id: 'TXN-001',
          userId: '101',
          userName: 'John Smith',
          userEmail: 'john.smith@email.com',
          type: 'DEPOSIT',
          method: 'TRC20',
          amount: 5000,
          currency: 'USDT',
          status: 'COMPLETED',
          fee: 10,
          netAmount: 4990,
          transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
          walletAddress: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE',
          description: 'USDT deposit via TRC20',
          createdAt: '2024-10-23T10:30:00Z',
          completedAt: '2024-10-23T10:35:00Z',
          adminNotes: 'Deposit confirmed after 3 confirmations'
        },
        {
          id: 'TXN-002',
          userId: '102',
          userName: 'Maria Garcia',
          userEmail: 'maria.garcia@email.com',
          type: 'WITHDRAWAL',
          method: 'BANK_TRANSFER',
          amount: 2500,
          currency: 'USD',
          status: 'PROCESSING',
          fee: 25,
          netAmount: 2475,
          description: 'Bank withdrawal to checking account',
          createdAt: '2024-10-23T09:15:00Z',
          adminNotes: 'Processing - estimated completion 24-48 hours'
        },
        {
          id: 'TXN-003',
          userId: '103',
          userName: 'Ahmed Hassan',
          userEmail: 'ahmed.hassan@email.com',
          type: 'TRADE',
          method: 'CRYPTO',
          amount: 1000,
          currency: 'BTC',
          status: 'COMPLETED',
          fee: 5,
          netAmount: 995,
          description: 'BTC/USD trading transaction',
          createdAt: '2024-10-22T16:45:00Z',
          completedAt: '2024-10-22T16:46:00Z'
        },
        {
          id: 'TXN-004',
          userId: '104',
          userName: 'Sarah Johnson',
          userEmail: 'sarah.johnson@email.com',
          type: 'DEPOSIT',
          method: 'CREDIT_CARD',
          amount: 1000,
          currency: 'USD',
          status: 'FAILED',
          fee: 0,
          netAmount: 0,
          description: 'Credit card deposit',
          createdAt: '2024-10-22T14:20:00Z',
          adminNotes: 'Card declined - insufficient funds'
        },
        {
          id: 'TXN-005',
          userId: '105',
          userName: 'Chen Wei',
          userEmail: 'chen.wei@email.com',
          type: 'COMMISSION',
          method: 'CRYPTO',
          amount: 150,
          currency: 'USDT',
          status: 'COMPLETED',
          fee: 0,
          netAmount: 150,
          description: 'IB commission payment',
          createdAt: '2024-10-22T12:00:00Z',
          completedAt: '2024-10-22T12:01:00Z'
        },
        {
          id: 'TXN-006',
          userId: '101',
          userName: 'John Smith',
          userEmail: 'john.smith@email.com',
          type: 'WITHDRAWAL',
          method: 'TRC20',
          amount: 2000,
          currency: 'USDT',
          status: 'PENDING',
          fee: 10,
          netAmount: 1990,
          description: 'USDT withdrawal via TRC20',
          createdAt: '2024-10-21T18:30:00Z',
          adminNotes: 'Pending manual review'
        },
        {
          id: 'TXN-007',
          userId: '102',
          userName: 'Maria Garcia',
          userEmail: 'maria.garcia@email.com',
          type: 'REFUND',
          method: 'BANK_TRANSFER',
          amount: 500,
          currency: 'USD',
          status: 'COMPLETED',
          fee: 0,
          netAmount: 500,
          description: 'Refund for failed transaction',
          createdAt: '2024-10-21T15:45:00Z',
          completedAt: '2024-10-21T16:00:00Z',
          adminNotes: 'Refund processed successfully'
        }
      ];

      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesTab = activeTab === 'all' || transaction.type.toLowerCase() === activeTab.slice(0, -1);
    const matchesStatus = statusFilter === 'ALL' || transaction.status === statusFilter;
    const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesStatus && matchesSearch;
  });

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const handleStatusUpdate = async (transactionId: string, newStatus: string) => {
    try {
      setTransactions(prev => prev.map(transaction => 
        transaction.id === transactionId 
          ? { 
              ...transaction, 
              status: newStatus as Transaction['status'],
              completedAt: newStatus === 'COMPLETED' ? new Date().toISOString() : transaction.completedAt
            } 
          : transaction
      ));
    } catch (error) {
      console.error('Failed to update transaction status:', error);
    }
  };

  const getTypeBadge = (type: string) => {
    const styles = {
      DEPOSIT: 'bg-green-100 text-green-800',
      WITHDRAWAL: 'bg-blue-100 text-blue-800',
      TRADE: 'bg-purple-100 text-purple-800',
      COMMISSION: 'bg-yellow-100 text-yellow-800',
      REFUND: 'bg-orange-100 text-orange-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[type as keyof typeof styles]}`}>
        {type}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    );
  };

  const getMethodBadge = (method: string) => {
    const styles = {
      TRC20: 'bg-green-100 text-green-800',
      ERC20: 'bg-blue-100 text-blue-800',
      BANK_TRANSFER: 'bg-purple-100 text-purple-800',
      CREDIT_CARD: 'bg-orange-100 text-orange-800',
      CRYPTO: 'bg-yellow-100 text-yellow-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[method as keyof typeof styles]}`}>
        {method}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const totalTransactions = transactions.length;
  const completedTransactions = transactions.filter(t => t.status === 'COMPLETED').length;
  const pendingTransactions = transactions.filter(t => t.status === 'PENDING').length;
  const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);

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
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <h1 className="text-2xl font-bold text-muted-gray-900">Transactions History</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="btn-primary">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Export Data
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{totalTransactions}</p>
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
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedTransactions}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingTransactions}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Volume</p>
                <p className="text-2xl font-bold text-gray-900">${totalVolume.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Card>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'all', name: 'All Transactions', icon: '📋' },
                { id: 'deposits', name: 'Deposits', icon: '💰' },
                { id: 'withdrawals', name: 'Withdrawals', icon: '💸' },
                { id: 'trades', name: 'Trades', icon: '📈' },
                { id: 'commissions', name: 'Commissions', icon: '💼' }
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

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Transactions
              </label>
              <input
                type="text"
                placeholder="Search by ID, name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Filter
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="COMPLETED">Completed</option>
                <option value="FAILED">Failed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="input-field"
              >
                <option value="ALL">All Time</option>
                <option value="TODAY">Today</option>
                <option value="WEEK">This Week</option>
                <option value="MONTH">This Month</option>
                <option value="YEAR">This Year</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="btn-secondary w-full">
                Apply Filters
              </button>
            </div>
          </div>
        </Card>

        {/* Transactions Table */}
        <Card>
          <DataTable
            headers={['ID', 'User', 'Type', 'Method', 'Amount', 'Status', 'Fee', 'Date', 'Actions']}
            data={filteredTransactions.map(transaction => [
              <span key={`id-${transaction.id}`} className="font-mono text-sm">{transaction.id}</span>,
              <div key={`user-${transaction.id}`}>
                <div className="font-medium text-muted-gray-900">{transaction.userName}</div>
                <div className="text-sm text-muted-gray-500">{transaction.userEmail}</div>
              </div>,
              getTypeBadge(transaction.type),
              getMethodBadge(transaction.method),
              <div key={`amount-${transaction.id}`}>
                <div className="font-medium">{transaction.amount.toLocaleString()} {transaction.currency}</div>
                <div className="text-sm text-gray-500">Net: {transaction.netAmount.toLocaleString()}</div>
              </div>,
              getStatusBadge(transaction.status),
              <span key={`fee-${transaction.id}`} className="font-medium">{transaction.fee.toLocaleString()}</span>,
              formatDate(transaction.createdAt),
              <div key={`actions-${transaction.id}`} className="flex items-center space-x-2">
                <button
                  onClick={() => handleViewTransaction(transaction)}
                  className="text-pale-blue-600 hover:text-pale-blue-800 text-sm font-medium"
                >
                  View
                </button>
                <select
                  value={transaction.status}
                  onChange={(e) => handleStatusUpdate(transaction.id, e.target.value)}
                  className="text-xs border border-gray-300 rounded px-2 py-1"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="FAILED">Failed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            ])}
          />
        </Card>

        {/* Transaction Details Modal */}
        {selectedTransaction && (
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title="Transaction Details"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
                  <p className="text-gray-900 font-mono">{selectedTransaction.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  {getTypeBadge(selectedTransaction.type)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">User</label>
                  <p className="text-gray-900">{selectedTransaction.userName}</p>
                  <p className="text-sm text-gray-500">{selectedTransaction.userEmail}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Method</label>
                  {getMethodBadge(selectedTransaction.method)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <p className="text-gray-900 font-medium">{selectedTransaction.amount.toLocaleString()} {selectedTransaction.currency}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fee</label>
                  <p className="text-gray-900 font-medium">{selectedTransaction.fee.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Net Amount</label>
                  <p className="text-gray-900 font-medium">{selectedTransaction.netAmount.toLocaleString()} {selectedTransaction.currency}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  {getStatusBadge(selectedTransaction.status)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created At</label>
                  <p className="text-gray-900">{formatDate(selectedTransaction.createdAt)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Completed At</label>
                  <p className="text-gray-900">{selectedTransaction.completedAt ? formatDate(selectedTransaction.completedAt) : 'N/A'}</p>
                </div>
                {selectedTransaction.transactionHash && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Transaction Hash</label>
                    <p className="text-gray-900 font-mono text-sm break-all">{selectedTransaction.transactionHash}</p>
                  </div>
                )}
                {selectedTransaction.walletAddress && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Wallet Address</label>
                    <p className="text-gray-900 font-mono text-sm break-all">{selectedTransaction.walletAddress}</p>
                  </div>
                )}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="text-gray-900">{selectedTransaction.description}</p>
                </div>
                {selectedTransaction.adminNotes && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Admin Notes</label>
                    <p className="text-gray-900">{selectedTransaction.adminNotes}</p>
                  </div>
                )}
              </div>
            </div>
          </Modal>
        )}
      </div>
    </Layout>
  );
}
