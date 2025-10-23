'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import Table from '@/components/Table';
import Modal from '@/components/Modal';

interface Client {
  id: string;
  name: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  accountType: 'DEMO' | 'LIVE' | 'VIP';
  balance: number;
  joinDate: string;
  lastLogin: string;
  totalDeposits: number;
  totalWithdrawals: number;
  country: string;
  phone?: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [accountTypeFilter, setAccountTypeFilter] = useState<string>('ALL');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      // Mock data for demo
      const mockClients: Client[] = [
        {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@email.com',
          status: 'ACTIVE',
          accountType: 'LIVE',
          balance: 12500.50,
          joinDate: '2024-01-15',
          lastLogin: '2024-10-22',
          totalDeposits: 15000,
          totalWithdrawals: 2500,
          country: 'United States',
          phone: '+1-555-0123'
        },
        {
          id: '2',
          name: 'Maria Garcia',
          email: 'maria.garcia@email.com',
          status: 'ACTIVE',
          accountType: 'VIP',
          balance: 45000.75,
          joinDate: '2023-11-08',
          lastLogin: '2024-10-21',
          totalDeposits: 50000,
          totalWithdrawals: 5000,
          country: 'Spain',
          phone: '+34-666-7890'
        },
        {
          id: '3',
          name: 'Ahmed Hassan',
          email: 'ahmed.hassan@email.com',
          status: 'INACTIVE',
          accountType: 'DEMO',
          balance: 0,
          joinDate: '2024-09-20',
          lastLogin: '2024-10-15',
          totalDeposits: 0,
          totalWithdrawals: 0,
          country: 'Egypt',
          phone: '+20-100-1234'
        },
        {
          id: '4',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@email.com',
          status: 'SUSPENDED',
          accountType: 'LIVE',
          balance: 5000.25,
          joinDate: '2024-03-10',
          lastLogin: '2024-10-18',
          totalDeposits: 8000,
          totalWithdrawals: 3000,
          country: 'Canada',
          phone: '+1-416-5555'
        },
        {
          id: '5',
          name: 'Chen Wei',
          email: 'chen.wei@email.com',
          status: 'ACTIVE',
          accountType: 'LIVE',
          balance: 25000.00,
          joinDate: '2024-02-28',
          lastLogin: '2024-10-22',
          totalDeposits: 30000,
          totalWithdrawals: 5000,
          country: 'China',
          phone: '+86-138-0000'
        }
      ];

      setClients(mockClients);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || client.status === statusFilter;
    const matchesAccountType = accountTypeFilter === 'ALL' || client.accountType === accountTypeFilter;
    
    return matchesSearch && matchesStatus && matchesAccountType;
  });

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setShowModal(true);
  };

  const handleStatusChange = async (clientId: string, newStatus: string) => {
    try {
      // Update client status
      setClients(prev => prev.map(client => 
        client.id === clientId ? { ...client, status: newStatus as Client['status'] } : client
      ));
    } catch (error) {
      console.error('Failed to update client status:', error);
    }
  };

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

  const getAccountTypeBadge = (type: string) => {
    const styles = {
      DEMO: 'bg-blue-100 text-blue-800',
      LIVE: 'bg-green-100 text-green-800',
      VIP: 'bg-purple-100 text-purple-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[type as keyof typeof styles]}`}>
        {type}
      </span>
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
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
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <h1 className="text-2xl font-bold text-muted-gray-900">Client List</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-gray-600">
              Total Clients: {clients.length}
            </span>
            <button className="btn-primary">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Client
            </button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-gray-700 mb-2">
                Search Clients
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
              <label className="block text-sm font-medium text-muted-gray-700 mb-2">
                Status Filter
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-gray-700 mb-2">
                Account Type
              </label>
              <select
                value={accountTypeFilter}
                onChange={(e) => setAccountTypeFilter(e.target.value)}
                className="input-field"
              >
                <option value="ALL">All Types</option>
                <option value="DEMO">Demo</option>
                <option value="LIVE">Live</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Clients Table */}
        <Card>
          <Table
            headers={['Name', 'Email', 'Status', 'Account Type', 'Balance', 'Country', 'Actions']}
            data={filteredClients.map(client => [
              <div key={client.id} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-pale-blue-500 to-pale-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {client.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-muted-gray-900">{client.name}</div>
                  <div className="text-sm text-muted-gray-500">ID: {client.id}</div>
                </div>
              </div>,
              client.email,
              getStatusBadge(client.status),
              getAccountTypeBadge(client.accountType),
              <span key={`balance-${client.id}`} className="font-medium">${client.balance.toLocaleString()}</span>,
              client.country,
              <div key={`actions-${client.id}`} className="flex items-center space-x-2">
                <button
                  onClick={() => handleViewClient(client)}
                  className="text-pale-blue-600 hover:text-pale-blue-800 text-sm font-medium"
                >
                  View
                </button>
                <select
                  value={client.status}
                  onChange={(e) => handleStatusChange(client.id, e.target.value)}
                  className="text-xs border border-gray-300 rounded px-2 py-1"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="SUSPENDED">Suspend</option>
                </select>
              </div>
            ])}
          />
        </Card>

        {/* Client Details Modal */}
        {selectedClient && (
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title="Client Details"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-gray-700">Name</label>
                  <p className="text-muted-gray-900">{selectedClient.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-gray-700">Email</label>
                  <p className="text-muted-gray-900">{selectedClient.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-gray-700">Phone</label>
                  <p className="text-muted-gray-900">{selectedClient.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-gray-700">Country</label>
                  <p className="text-muted-gray-900">{selectedClient.country}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-gray-700">Status</label>
                  {getStatusBadge(selectedClient.status)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-gray-700">Account Type</label>
                  {getAccountTypeBadge(selectedClient.accountType)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-gray-700">Current Balance</label>
                  <p className="text-muted-gray-900 font-medium">${selectedClient.balance.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-gray-700">Join Date</label>
                  <p className="text-muted-gray-900">{selectedClient.joinDate}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-gray-700">Last Login</label>
                  <p className="text-muted-gray-900">{selectedClient.lastLogin}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-gray-700">Total Deposits</label>
                  <p className="text-muted-gray-900 font-medium">${selectedClient.totalDeposits.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-gray-700">Total Withdrawals</label>
                  <p className="text-muted-gray-900 font-medium">${selectedClient.totalWithdrawals.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </Layout>
  );
}
