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
  const [activeTab, setActiveTab] = useState<'overview' | 'partners' | 'commissions' | 'analytics' | 'integration'>('overview');
  const [selectedPartner, setSelectedPartner] = useState<IBPartner | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInfo, setShowInfo] = useState(false);

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
                { id: 'overview', name: 'Overview', icon: '📋' },
                { id: 'partners', name: 'IB Partners', icon: '👥' },
                { id: 'commissions', name: 'Commissions', icon: '💰' },
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">1. IB (Introducing Broker) Section</h2>
                  <p className="text-lg text-gray-700 mb-6">
                    An IB is someone who refers clients to your trading platform and earns commissions based on their trading activity.
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
                        <strong className="text-gray-900">IB Registration:</strong>
                        <span className="text-gray-700 ml-2">IB can sign up and get a unique referral code/link.</span>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-pale-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <strong className="text-gray-900">Client Tracking:</strong>
                        <span className="text-gray-700 ml-2">Each client introduced by an IB is linked to their account.</span>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-pale-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <strong className="text-gray-900">Commission Tracking:</strong>
                        <span className="text-gray-700 ml-2">Automatically calculate IB commissions based on trades or deposits.</span>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-pale-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <strong className="text-gray-900">Performance Dashboard:</strong>
                        <span className="text-gray-700 ml-2">Show IBs their clients, total trades, total commission earned, and active/dormant clients.</span>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-pale-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <strong className="text-gray-900">Payout Management:</strong>
                        <span className="text-gray-700 ml-2">Generate payout reports and process IB payments.</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* How to Get Started */}
            <Card>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Getting Started as an IB Partner</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-pale-blue-500 to-pale-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Register Your Interest</h4>
                    <p className="text-gray-600">Contact our partnership team to express interest in becoming an IB partner.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-pale-blue-500 to-pale-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Get Verified</h4>
                    <p className="text-gray-600">Complete the verification process and receive your unique referral link.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-pale-blue-500 to-pale-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Start Referring</h4>
                    <p className="text-gray-600">Share your referral link and start earning commissions from client trading activity.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

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
                  <h4 className="font-semibold text-gray-900 mb-2">For Most Use Cases:</h4>
                  <p className="text-gray-700">
                    We recommend starting with <strong>MetaTrader Web API / REST API</strong> as it's the most accessible and 
                    suitable for web-based applications. If broker support is limited, consider <strong>MT5 Python / MQL5 Scripts</strong> 
                    for automated data collection.
                  </p>
                </div>
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
