'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Card from '@/components/Card';

interface Client {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'dormant';
  trades: number;
  deposits: number;
  createdAt: string;
}

export default function ClientTrackingPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/ib/clients', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setClients(data.clients || []);
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    dormant: clients.filter(c => c.status === 'dormant').length,
    totalTrades: clients.reduce((sum, c) => sum + c.trades, 0),
    totalDeposits: clients.reduce((sum, c) => sum + c.deposits, 0),
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-royal-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <h1 className="text-2xl font-bold text-muted-gray-900">Client Tracking</h1>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <div>
              <p className="text-sm font-medium text-muted-gray-500 mb-1">Total Clients</p>
              <p className="text-2xl font-bold text-muted-gray-900">{stats.total}</p>
            </div>
          </Card>
          <Card>
            <div>
              <p className="text-sm font-medium text-muted-gray-500 mb-1">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
          </Card>
          <Card>
            <div>
              <p className="text-sm font-medium text-muted-gray-500 mb-1">Dormant</p>
              <p className="text-2xl font-bold text-gray-500">{stats.dormant}</p>
            </div>
          </Card>
          <Card>
            <div>
              <p className="text-sm font-medium text-muted-gray-500 mb-1">Total Trades</p>
              <p className="text-2xl font-bold text-muted-gray-900">{stats.totalTrades}</p>
            </div>
          </Card>
          <Card>
            <div>
              <p className="text-sm font-medium text-muted-gray-500 mb-1">Total Deposits</p>
              <p className="text-2xl font-bold text-muted-gray-900">${stats.totalDeposits.toLocaleString()}</p>
            </div>
          </Card>
        </div>

        {/* Clients Table */}
        <Card>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search clients by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field max-w-md"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pale-blue-500 mx-auto"></div>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-gray-500">No clients found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="table-header">
                  <tr>
                    <th className="text-left">Name</th>
                    <th className="text-left">Email</th>
                    <th className="text-left">Status</th>
                    <th className="text-right">Trades</th>
                    <th className="text-right">Deposits</th>
                    <th className="text-left">Joined</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="table-cell font-medium">{client.name}</td>
                      <td className="table-cell text-muted-gray-600">{client.email}</td>
                      <td className="table-cell">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            client.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {client.status}
                        </span>
                      </td>
                      <td className="table-cell text-right">{client.trades}</td>
                      <td className="table-cell text-right">${client.deposits.toLocaleString()}</td>
                      <td className="table-cell text-muted-gray-500">
                        {new Date(client.createdAt).toLocaleDateString()}
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

