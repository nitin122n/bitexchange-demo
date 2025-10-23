'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';

interface IBPartner {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  commissionRate: number;
  totalClients: number;
  totalVolume: number;
  monthlyCommission: number;
  joinDate: string;
  country: string;
  phone?: string;
}

interface IBCommission {
  id: string;
  ibId: string;
  ibName: string;
  clientId: string;
  clientName: string;
  transactionType: 'DEPOSIT' | 'WITHDRAWAL' | 'TRADE';
  amount: number;
  commissionRate: number;
  commissionAmount: number;
  date: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
}

export default function IBSectionPage() {
  const [ibPartners, setIbPartners] = useState<IBPartner[]>([]);
  const [commissions, setCommissions] = useState<IBCommission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'partners' | 'commissions' | 'analytics'>('partners');
  const [selectedPartner, setSelectedPartner] = useState<IBPartner | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Mock data for IB Partners
      const mockIBPartners: IBPartner[] = [
        {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@ib.com',
          company: 'Smith Trading Group',
          status: 'ACTIVE',
          tier: 'GOLD',
          commissionRate: 0.5,
          totalClients: 45,
          totalVolume: 2500000,
          monthlyCommission: 12500,
          joinDate: '2023-06-15',
          country: 'United States',
          phone: '+1-555-0123'
        },
        {
          id: '2',
          name: 'Maria Garcia',
          email: 'maria.garcia@ib.com',
          company: 'Garcia Financial Services',
          status: 'ACTIVE',
          tier: 'PLATINUM',
          commissionRate: 0.75,
          totalClients: 78,
          totalVolume: 4500000,
          monthlyCommission: 33750,
          joinDate: '2023-03-20',
          country: 'Spain',
          phone: '+34-666-7890'
        },
        {
          id: '3',
          name: 'Ahmed Hassan',
          email: 'ahmed.hassan@ib.com',
          company: 'Hassan Capital',
          status: 'PENDING',
          tier: 'BRONZE',
          commissionRate: 0.25,
          totalClients: 12,
          totalVolume: 150000,
          monthlyCommission: 375,
          joinDate: '2024-09-10',
          country: 'Egypt',
          phone: '+20-100-1234'
        },
        {
          id: '4',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@ib.com',
          company: 'Johnson Investments',
          status: 'INACTIVE',
          tier: 'SILVER',
          commissionRate: 0.35,
          totalClients: 23,
          totalVolume: 800000,
          monthlyCommission: 2800,
          joinDate: '2024-01-15',
          country: 'Canada',
          phone: '+1-416-5555'
        }
      ];

      // Mock data for Commissions
      const mockCommissions: IBCommission[] = [
        {
          id: '1',
          ibId: '1',
          ibName: 'John Smith',
          clientId: '101',
          clientName: 'Client A',
          transactionType: 'DEPOSIT',
          amount: 10000,
          commissionRate: 0.5,
          commissionAmount: 50,
          date: '2024-10-22',
          status: 'PAID'
        },
        {
          id: '2',
          ibId: '2',
          ibName: 'Maria Garcia',
          clientId: '102',
          clientName: 'Client B',
          transactionType: 'TRADE',
          amount: 5000,
          commissionRate: 0.75,
          commissionAmount: 37.5,
          date: '2024-10-21',
          status: 'PENDING'
        },
        {
          id: '3',
          ibId: '1',
          ibName: 'John Smith',
          clientId: '103',
          clientName: 'Client C',
          transactionType: 'WITHDRAWAL',
          amount: 2500,
          commissionRate: 0.5,
          commissionAmount: 12.5,
          date: '2024-10-20',
          status: 'PAID'
        }
      ];

      setIbPartners(mockIBPartners);
      setCommissions(mockCommissions);
    } catch (error) {
      console.error('Failed to fetch IB data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPartners = ibPartners.filter(partner =>
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewPartner = (partner: IBPartner) => {
    setSelectedPartner(partner);
    setShowModal(true);
  };

  const handleStatusChange = async (partnerId: string, newStatus: string) => {
    try {
      setIbPartners(prev => prev.map(partner => 
        partner.id === partnerId ? { ...partner, status: newStatus as IBPartner['status'] } : partner
      ));
    } catch (error) {
      console.error('Failed to update partner status:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-gray-100 text-gray-800',
      PENDING: 'bg-yellow-100 text-yellow-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    );
  };

  const getTierBadge = (tier: string) => {
    const styles = {
      BRONZE: 'bg-orange-100 text-orange-800',
      SILVER: 'bg-gray-100 text-gray-800',
      GOLD: 'bg-yellow-100 text-yellow-800',
      PLATINUM: 'bg-purple-100 text-purple-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[tier as keyof typeof styles]}`}>
        {tier}
      </span>
    );
  };

  const getCommissionStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PAID: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    );
  };

  const totalPartners = ibPartners.length;
  const activePartners = ibPartners.filter(p => p.status === 'ACTIVE').length;
  const totalCommission = commissions.reduce((sum, c) => sum + c.commissionAmount, 0);
  const pendingCommission = commissions.filter(c => c.status === 'PENDING').reduce((sum, c) => sum + c.commissionAmount, 0);

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
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <h1 className="text-2xl font-bold text-muted-gray-900">IB Section</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="btn-primary">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add IB Partner
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Partners</p>
                <p className="text-2xl font-bold text-gray-900">{totalPartners}</p>
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
                <p className="text-sm font-medium text-gray-600">Active Partners</p>
                <p className="text-2xl font-bold text-gray-900">{activePartners}</p>
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
                <p className="text-sm font-medium text-gray-600">Total Commission</p>
                <p className="text-2xl font-bold text-gray-900">${totalCommission.toLocaleString()}</p>
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
                <p className="text-sm font-medium text-gray-600">Pending Commission</p>
                <p className="text-2xl font-bold text-gray-900">${pendingCommission.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Card>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'partners', name: 'IB Partners', icon: '👥' },
                { id: 'commissions', name: 'Commissions', icon: '💰' },
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

        {/* IB Partners Tab */}
        {activeTab === 'partners' && (
          <div className="space-y-6">
            {/* Search */}
            <Card>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search IB partners..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            </Card>

            {/* Partners Table */}
            <Card>
              <DataTable
                headers={['Partner', 'Company', 'Status', 'Tier', 'Commission Rate', 'Clients', 'Volume', 'Actions']}
                data={filteredPartners.map(partner => [
                  <div key={partner.id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-pale-blue-500 to-pale-teal-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {partner.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-muted-gray-900">{partner.name}</div>
                      <div className="text-sm text-muted-gray-500">{partner.email}</div>
                    </div>
                  </div>,
                  partner.company,
                  getStatusBadge(partner.status),
                  getTierBadge(partner.tier),
                  <span key={`commission-${partner.id}`} className="font-medium">{partner.commissionRate}%</span>,
                  <span key={`clients-${partner.id}`} className="font-medium">{partner.totalClients}</span>,
                  <span key={`volume-${partner.id}`} className="font-medium">${partner.totalVolume.toLocaleString()}</span>,
                  <div key={`actions-${partner.id}`} className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewPartner(partner)}
                      className="text-pale-blue-600 hover:text-pale-blue-800 text-sm font-medium"
                    >
                      View
                    </button>
                    <select
                      value={partner.status}
                      onChange={(e) => handleStatusChange(partner.id, e.target.value)}
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="PENDING">Pending</option>
                    </select>
                  </div>
                ])}
              />
            </Card>
          </div>
        )}

        {/* Commissions Tab */}
        {activeTab === 'commissions' && (
          <Card>
            <DataTable
              headers={['IB Partner', 'Client', 'Type', 'Amount', 'Rate', 'Commission', 'Date', 'Status']}
              data={commissions.map(commission => [
                commission.ibName,
                commission.clientName,
                <span key={`type-${commission.id}`} className="font-medium">{commission.transactionType}</span>,
                <span key={`amount-${commission.id}`} className="font-medium">${commission.amount.toLocaleString()}</span>,
                <span key={`rate-${commission.id}`} className="font-medium">{commission.commissionRate}%</span>,
                <span key={`commission-${commission.id}`} className="font-medium text-green-600">${commission.commissionAmount.toFixed(2)}</span>,
                commission.date,
                getCommissionStatusBadge(commission.status)
              ])}
            />
          </Card>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Partner Performance</h3>
              <div className="space-y-4">
                {ibPartners.map(partner => (
                  <div key={partner.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{partner.name}</p>
                      <p className="text-sm text-gray-600">{partner.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${partner.monthlyCommission.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{partner.totalClients} clients</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Commission Trends</h3>
              <div className="text-center py-12">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-500">Chart visualization would go here</p>
              </div>
            </Card>
          </div>
        )}

        {/* Partner Details Modal */}
        {selectedPartner && (
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title="IB Partner Details"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900">{selectedPartner.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{selectedPartner.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company</label>
                  <p className="text-gray-900">{selectedPartner.company}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-gray-900">{selectedPartner.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <p className="text-gray-900">{selectedPartner.country}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  {getStatusBadge(selectedPartner.status)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tier</label>
                  {getTierBadge(selectedPartner.tier)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Commission Rate</label>
                  <p className="text-gray-900 font-medium">{selectedPartner.commissionRate}%</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Clients</label>
                  <p className="text-gray-900 font-medium">{selectedPartner.totalClients}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Volume</label>
                  <p className="text-gray-900 font-medium">${selectedPartner.totalVolume.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Monthly Commission</label>
                  <p className="text-gray-900 font-medium">${selectedPartner.monthlyCommission.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Join Date</label>
                  <p className="text-gray-900">{selectedPartner.joinDate}</p>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </Layout>
  );
}
