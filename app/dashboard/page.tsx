'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { StatCard } from '@/components/Card';
import Table, { TableHeader, TableBody, TableRow, TableCell, TableHeaderCell } from '@/components/Table';
import Modal from '@/components/Modal';

interface Deposit {
  id: string;
  userEmail: string;
  tradeId: string;
  method: string;
  amount: number;
  currency: string;
  date: string;
  status: string;
}

interface DashboardData {
  summary: {
    activeClients: number;
    inactiveClients: number;
    liveAccounts: number;
    pendingDeposits: number;
    approvedDeposits: number;
    pendingWithdrawals: number;
    approvedWithdrawals: number;
    totalPendingAmount: number;
    totalApprovedAmount: number;
  };
  deposits: Deposit[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);
  const [showDepositModal, setShowDepositModal] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/deposits', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          
          // Mock additional data for demo
          const mockData: DashboardData = {
            summary: {
              activeClients: 1,
              inactiveClients: 0,
              liveAccounts: 450,
              pendingDeposits: result.summary.pendingDeposits,
              approvedDeposits: result.summary.approvedDeposits,
              pendingWithdrawals: 0,
              approvedWithdrawals: 0,
              totalPendingAmount: result.summary.totalPendingAmount,
              totalApprovedAmount: 18000,
            },
            deposits: result.data.slice(0, 10), // Show only recent deposits
          };
          
          setData(mockData);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleViewDeposit = (deposit: Deposit) => {
    setSelectedDeposit(deposit);
    setShowDepositModal(true);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
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
        <div className="flex items-center space-x-2">
          <svg className="w-6 h-6 text-muted-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
          <h1 className="text-2xl font-bold text-muted-gray-900">Dashboard</h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Active Clients"
            value={data?.summary.activeClients || 0}
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            }
          />
          
          <StatCard
            title="In-Active Clients"
            value={data?.summary.inactiveClients || 0}
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            }
          />
          
          <StatCard
            title="Live Accounts"
            value={data?.summary.liveAccounts || 0}
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
            }
          />
          
          <StatCard
            title={`Pending Deposit (${data?.summary.pendingDeposits || 0})`}
            value={`${data?.summary.totalPendingAmount?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '$0'}`}
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            }
          />
          
          <StatCard
            title={`Approve Deposit (${data?.summary.approvedDeposits || 0})`}
            value={`${data?.summary.totalApprovedAmount?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '$0'}`}
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            }
          />
          
          <StatCard
            title={`Pending Withdraw (${data?.summary.pendingWithdrawals || 0})`}
            value={`${data?.summary.pendingWithdrawals?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '$0'}`}
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 5a1 1 0 011 1v1h1a1 1 0 110 2H9v1a1 1 0 11-2 0v-1H6a1 1 0 110-2h1V6a1 1 0 011-1z" />
                <path d="M2 2a2 2 0 00-2 2v8a2 2 0 002 2V4h10a2 2 0 00-2-2H2zm12.5 5.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              </svg>
            }
          />
        </div>

        {/* Pending Deposits Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-muted-gray-900">Pending Deposits</h2>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Trade ID</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Action</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.deposits?.map((deposit) => (
                <TableRow key={deposit.id}>
                  <TableCell>{deposit.userEmail}</TableCell>
                  <TableCell>{deposit.tradeId}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {deposit.method}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">
                    {deposit.amount.toLocaleString('en-US', { style: 'currency', currency: deposit.currency })}
                  </TableCell>
                  <TableCell>{new Date(deposit.date).toLocaleString()}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleViewDeposit(deposit)}
                      className="btn-primary text-sm px-3 py-1"
                    >
                      View
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Deposit Details Modal */}
        <Modal
          isOpen={showDepositModal}
          onClose={() => setShowDepositModal(false)}
          title="Deposit Details"
          size="lg"
        >
          {selectedDeposit && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-gray-700">Email</label>
                  <p className="mt-1 text-sm text-muted-gray-900">{selectedDeposit.userEmail}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-gray-700">Trade ID</label>
                  <p className="mt-1 text-sm text-muted-gray-900">{selectedDeposit.tradeId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-gray-700">Method</label>
                  <p className="mt-1 text-sm text-muted-gray-900">{selectedDeposit.method}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-gray-700">Amount</label>
                  <p className="mt-1 text-sm text-muted-gray-900">
                    {selectedDeposit.amount.toLocaleString('en-US', { style: 'currency', currency: selectedDeposit.currency })}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-gray-700">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                    selectedDeposit.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    selectedDeposit.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedDeposit.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-gray-700">Date</label>
                  <p className="mt-1 text-sm text-muted-gray-900">{new Date(selectedDeposit.date).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
}
