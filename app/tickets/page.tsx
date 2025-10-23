'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';

interface Ticket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  description: string;
  category: 'TECHNICAL' | 'ACCOUNT' | 'DEPOSIT' | 'WITHDRAWAL' | 'TRADING' | 'GENERAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  assignedTo?: string;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  attachments?: string[];
  messages: TicketMessage[];
}

interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderType: 'USER' | 'ADMIN';
  message: string;
  createdAt: string;
  attachments?: string[];
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'open' | 'in-progress' | 'resolved'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      // Mock data for tickets
      const mockTickets: Ticket[] = [
        {
          id: 'TKT-001',
          userId: '101',
          userName: 'John Smith',
          userEmail: 'john.smith@email.com',
          subject: 'Unable to withdraw funds',
          description: 'I have been trying to withdraw my funds for 3 days but the transaction keeps failing. Please help.',
          category: 'WITHDRAWAL',
          priority: 'HIGH',
          status: 'IN_PROGRESS',
          assignedTo: 'admin1',
          assignedToName: 'Admin User',
          createdAt: '2024-10-23T10:30:00Z',
          updatedAt: '2024-10-23T14:20:00Z',
          messages: [
            {
              id: 'MSG-001',
              ticketId: 'TKT-001',
              senderId: '101',
              senderName: 'John Smith',
              senderType: 'USER',
              message: 'I have been trying to withdraw my funds for 3 days but the transaction keeps failing. Please help.',
              createdAt: '2024-10-23T10:30:00Z'
            },
            {
              id: 'MSG-002',
              ticketId: 'TKT-001',
              senderId: 'admin1',
              senderName: 'Admin User',
              senderType: 'ADMIN',
              message: 'Hello John, I have reviewed your withdrawal request. The issue appears to be with the wallet address format. Please verify your TRC20 wallet address and try again.',
              createdAt: '2024-10-23T11:15:00Z'
            }
          ]
        },
        {
          id: 'TKT-002',
          userId: '102',
          userName: 'Maria Garcia',
          userEmail: 'maria.garcia@email.com',
          subject: 'Account verification pending',
          description: 'I submitted my documents for account verification 5 days ago but still no response.',
          category: 'ACCOUNT',
          priority: 'MEDIUM',
          status: 'OPEN',
          createdAt: '2024-10-22T16:45:00Z',
          updatedAt: '2024-10-22T16:45:00Z',
          messages: [
            {
              id: 'MSG-003',
              ticketId: 'TKT-002',
              senderId: '102',
              senderName: 'Maria Garcia',
              senderType: 'USER',
              message: 'I submitted my documents for account verification 5 days ago but still no response.',
              createdAt: '2024-10-22T16:45:00Z'
            }
          ]
        },
        {
          id: 'TKT-003',
          userId: '103',
          userName: 'Ahmed Hassan',
          userEmail: 'ahmed.hassan@email.com',
          subject: 'Trading platform not loading',
          description: 'The trading platform keeps showing loading screen and never loads properly.',
          category: 'TECHNICAL',
          priority: 'URGENT',
          status: 'RESOLVED',
          assignedTo: 'admin2',
          assignedToName: 'Support Admin',
          createdAt: '2024-10-21T14:20:00Z',
          updatedAt: '2024-10-22T09:30:00Z',
          resolvedAt: '2024-10-22T09:30:00Z',
          messages: [
            {
              id: 'MSG-004',
              ticketId: 'TKT-003',
              senderId: '103',
              senderName: 'Ahmed Hassan',
              senderType: 'USER',
              message: 'The trading platform keeps showing loading screen and never loads properly.',
              createdAt: '2024-10-21T14:20:00Z'
            },
            {
              id: 'MSG-005',
              ticketId: 'TKT-003',
              senderId: 'admin2',
              senderName: 'Support Admin',
              senderType: 'ADMIN',
              message: 'Hello Ahmed, we have identified and fixed the issue. Please clear your browser cache and try again. The platform should now load properly.',
              createdAt: '2024-10-22T09:30:00Z'
            }
          ]
        },
        {
          id: 'TKT-004',
          userId: '104',
          userName: 'Sarah Johnson',
          userEmail: 'sarah.johnson@email.com',
          subject: 'Deposit not credited to account',
          description: 'I made a deposit 2 hours ago but it has not been credited to my account yet.',
          category: 'DEPOSIT',
          priority: 'HIGH',
          status: 'OPEN',
          createdAt: '2024-10-23T08:15:00Z',
          updatedAt: '2024-10-23T08:15:00Z',
          messages: [
            {
              id: 'MSG-006',
              ticketId: 'TKT-004',
              senderId: '104',
              senderName: 'Sarah Johnson',
              senderType: 'USER',
              message: 'I made a deposit 2 hours ago but it has not been credited to my account yet.',
              createdAt: '2024-10-23T08:15:00Z'
            }
          ]
        },
        {
          id: 'TKT-005',
          userId: '105',
          userName: 'Chen Wei',
          userEmail: 'chen.wei@email.com',
          subject: 'General inquiry about fees',
          description: 'Can you please explain the fee structure for different trading pairs?',
          category: 'GENERAL',
          priority: 'LOW',
          status: 'CLOSED',
          assignedTo: 'admin1',
          assignedToName: 'Admin User',
          createdAt: '2024-10-20T12:00:00Z',
          updatedAt: '2024-10-21T15:45:00Z',
          resolvedAt: '2024-10-21T15:45:00Z',
          messages: [
            {
              id: 'MSG-007',
              ticketId: 'TKT-005',
              senderId: '105',
              senderName: 'Chen Wei',
              senderType: 'USER',
              message: 'Can you please explain the fee structure for different trading pairs?',
              createdAt: '2024-10-20T12:00:00Z'
            },
            {
              id: 'MSG-008',
              ticketId: 'TKT-005',
              senderId: 'admin1',
              senderName: 'Admin User',
              senderType: 'ADMIN',
              message: 'Hello Chen, our fee structure is as follows: BTC/USD: 0.1%, ETH/USD: 0.15%, Other pairs: 0.2%. All fees are calculated based on the trading volume.',
              createdAt: '2024-10-21T15:45:00Z'
            }
          ]
        }
      ];

      setTickets(mockTickets);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesTab = activeTab === 'all' || ticket.status.toLowerCase().replace('_', '-') === activeTab;
    const matchesCategory = categoryFilter === 'ALL' || ticket.category === categoryFilter;
    const matchesPriority = priorityFilter === 'ALL' || ticket.priority === priorityFilter;
    const matchesSearch = ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesCategory && matchesPriority && matchesSearch;
  });

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const handleStatusUpdate = async (ticketId: string, newStatus: string) => {
    try {
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId 
          ? { 
              ...ticket, 
              status: newStatus as Ticket['status'],
              updatedAt: new Date().toISOString(),
              resolvedAt: newStatus === 'RESOLVED' || newStatus === 'CLOSED' ? new Date().toISOString() : ticket.resolvedAt
            } 
          : ticket
      ));
    } catch (error) {
      console.error('Failed to update ticket status:', error);
    }
  };

  const handleAssignTicket = async (ticketId: string, assignedTo: string) => {
    try {
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId 
          ? { 
              ...ticket, 
              assignedTo,
              assignedToName: 'Admin User',
              updatedAt: new Date().toISOString()
            } 
          : ticket
      ));
    } catch (error) {
      console.error('Failed to assign ticket:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;

    try {
      const newMsg: TicketMessage = {
        id: `MSG-${Date.now()}`,
        ticketId: selectedTicket.id,
        senderId: 'admin1',
        senderName: 'Admin User',
        senderType: 'ADMIN',
        message: newMessage,
        createdAt: new Date().toISOString()
      };

      setTickets(prev => prev.map(ticket => 
        ticket.id === selectedTicket.id 
          ? { 
              ...ticket, 
              messages: [...ticket.messages, newMsg],
              updatedAt: new Date().toISOString()
            } 
          : ticket
      ));

      setSelectedTicket(prev => prev ? {
        ...prev,
        messages: [...prev.messages, newMsg],
        updatedAt: new Date().toISOString()
      } : null);

      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const getCategoryBadge = (category: string) => {
    const styles = {
      TECHNICAL: 'bg-red-100 text-red-800',
      ACCOUNT: 'bg-blue-100 text-blue-800',
      DEPOSIT: 'bg-green-100 text-green-800',
      WITHDRAWAL: 'bg-purple-100 text-purple-800',
      TRADING: 'bg-yellow-100 text-yellow-800',
      GENERAL: 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[category as keyof typeof styles]}`}>
        {category}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      LOW: 'bg-gray-100 text-gray-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      HIGH: 'bg-orange-100 text-orange-800',
      URGENT: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[priority as keyof typeof styles]}`}>
        {priority}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      OPEN: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
      RESOLVED: 'bg-green-100 text-green-800',
      CLOSED: 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'OPEN').length;
  const inProgressTickets = tickets.filter(t => t.status === 'IN_PROGRESS').length;
  const resolvedTickets = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length;

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
            <h1 className="text-2xl font-bold text-muted-gray-900">Support Tickets</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="btn-primary">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Ticket
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                <p className="text-2xl font-bold text-gray-900">{totalTickets}</p>
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
                <p className="text-sm font-medium text-gray-600">Open</p>
                <p className="text-2xl font-bold text-gray-900">{openTickets}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{inProgressTickets}</p>
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
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">{resolvedTickets}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Card>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'all', name: 'All Tickets', icon: '📋' },
                { id: 'open', name: 'Open', icon: '🔓' },
                { id: 'in-progress', name: 'In Progress', icon: '⏳' },
                { id: 'resolved', name: 'Resolved', icon: '✅' }
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
                Search Tickets
              </label>
              <input
                type="text"
                placeholder="Search by ID, subject, or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input-field"
              >
                <option value="ALL">All Categories</option>
                <option value="TECHNICAL">Technical</option>
                <option value="ACCOUNT">Account</option>
                <option value="DEPOSIT">Deposit</option>
                <option value="WITHDRAWAL">Withdrawal</option>
                <option value="TRADING">Trading</option>
                <option value="GENERAL">General</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="input-field"
              >
                <option value="ALL">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="btn-secondary w-full">
                Apply Filters
              </button>
            </div>
          </div>
        </Card>

        {/* Tickets Table */}
        <Card>
          <DataTable
            headers={['ID', 'Subject', 'User', 'Category', 'Priority', 'Status', 'Assigned To', 'Created', 'Actions']}
            data={filteredTickets.map(ticket => [
              <span key={`id-${ticket.id}`} className="font-mono text-sm">{ticket.id}</span>,
              <div key={`subject-${ticket.id}`}>
                <div className="font-medium text-muted-gray-900">{ticket.subject}</div>
                <div className="text-sm text-muted-gray-500 truncate max-w-xs">{ticket.description}</div>
              </div>,
              <div key={`user-${ticket.id}`}>
                <div className="font-medium text-muted-gray-900">{ticket.userName}</div>
                <div className="text-sm text-muted-gray-500">{ticket.userEmail}</div>
              </div>,
              getCategoryBadge(ticket.category),
              getPriorityBadge(ticket.priority),
              getStatusBadge(ticket.status),
              <span key={`assigned-${ticket.id}`} className="text-sm">{ticket.assignedToName || 'Unassigned'}</span>,
              formatDate(ticket.createdAt),
              <div key={`actions-${ticket.id}`} className="flex items-center space-x-2">
                <button
                  onClick={() => handleViewTicket(ticket)}
                  className="text-pale-blue-600 hover:text-pale-blue-800 text-sm font-medium"
                >
                  View
                </button>
                <select
                  value={ticket.status}
                  onChange={(e) => handleStatusUpdate(ticket.id, e.target.value)}
                  className="text-xs border border-gray-300 rounded px-2 py-1"
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
            ])}
          />
        </Card>

        {/* Ticket Details Modal */}
        {selectedTicket && (
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title={`Ticket ${selectedTicket.id}`}
            size="large"
          >
            <div className="space-y-6">
              {/* Ticket Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <p className="text-gray-900 font-medium">{selectedTicket.subject}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  {getStatusBadge(selectedTicket.status)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  {getCategoryBadge(selectedTicket.category)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  {getPriorityBadge(selectedTicket.priority)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">User</label>
                  <p className="text-gray-900">{selectedTicket.userName}</p>
                  <p className="text-sm text-gray-500">{selectedTicket.userEmail}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                  <p className="text-gray-900">{selectedTicket.assignedToName || 'Unassigned'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created</label>
                  <p className="text-gray-900">{formatDate(selectedTicket.createdAt)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                  <p className="text-gray-900">{formatDate(selectedTicket.updatedAt)}</p>
                </div>
              </div>

              {/* Messages */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Conversation</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {selectedTicket.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg ${
                        message.senderType === 'ADMIN'
                          ? 'bg-blue-50 border-l-4 border-blue-500 ml-8'
                          : 'bg-gray-50 border-l-4 border-gray-300 mr-8'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            message.senderType === 'ADMIN'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {message.senderType}
                          </span>
                          <span className="font-medium text-gray-900">{message.senderName}</span>
                        </div>
                        <span className="text-sm text-gray-500">{formatDate(message.createdAt)}</span>
                      </div>
                      <p className="text-gray-700">{message.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Reply</h3>
                <div className="space-y-4">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your reply here..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pale-blue-500 focus:border-transparent"
                    rows={4}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <select
                        value={selectedTicket.assignedTo || ''}
                        onChange={(e) => handleAssignTicket(selectedTicket.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-3 py-1"
                      >
                        <option value="">Assign to...</option>
                        <option value="admin1">Admin User</option>
                        <option value="admin2">Support Admin</option>
                      </select>
                      <select
                        value={selectedTicket.status}
                        onChange={(e) => handleStatusUpdate(selectedTicket.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-3 py-1"
                      >
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Send Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </Layout>
  );
}
