'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import Modal from '@/components/Modal';

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  createdAt: string;
  lastUpdated: string;
}

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<'contact' | 'tickets' | 'faq'>('contact');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'TKT-001',
      subject: 'Account Verification Issue',
      category: 'KYC',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      createdAt: '2024-10-23T10:30:00Z',
      lastUpdated: '2024-10-23T14:15:00Z'
    },
    {
      id: 'TKT-002',
      subject: 'Withdrawal Processing Delay',
      category: 'WALLET',
      status: 'RESOLVED',
      priority: 'MEDIUM',
      createdAt: '2024-10-22T16:45:00Z',
      lastUpdated: '2024-10-23T09:30:00Z'
    }
  ]);

  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    priority: 'MEDIUM',
    description: '',
    email: ''
  });

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket: SupportTicket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      subject: formData.subject,
      category: formData.category,
      status: 'OPEN',
      priority: formData.priority as any,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    setTickets([newTicket, ...tickets]);
    setShowTicketModal(false);
    setFormData({ subject: '', category: '', priority: 'MEDIUM', description: '', email: '' });
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

  const getPriorityBadge = (priority: string) => {
    const styles = {
      LOW: 'bg-gray-100 text-gray-800',
      MEDIUM: 'bg-blue-100 text-blue-800',
      HIGH: 'bg-orange-100 text-orange-800',
      URGENT: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[priority as keyof typeof styles]}`}>
        {priority}
      </span>
    );
  };

  const faqItems = [
    {
      question: "How do I verify my account?",
      answer: "To verify your account, go to the KYC section in your dashboard and upload the required documents: government ID, selfie photo, and address proof. The verification process typically takes 24-48 hours."
    },
    {
      question: "What are the deposit and withdrawal limits?",
      answer: "Deposit and withdrawal limits depend on your verification level. Unverified accounts have lower limits, while fully verified accounts enjoy higher limits. Check your account settings for specific limits."
    },
    {
      question: "How long do withdrawals take?",
      answer: "Withdrawal processing times vary by cryptocurrency. Bitcoin withdrawals typically take 30-60 minutes, while Ethereum withdrawals usually complete within 10-30 minutes. Bank transfers may take 1-3 business days."
    },
    {
      question: "Is my account secure?",
      answer: "Yes, we use industry-leading security measures including cold storage, multi-signature wallets, 2FA authentication, and advanced encryption to protect your funds and personal information."
    },
    {
      question: "What trading fees do you charge?",
      answer: "Our trading fees start at 0.1% for makers and 0.2% for takers. Fees decrease with higher trading volumes. We also offer zero-fee trading for certain promotional periods."
    },
    {
      question: "How can I contact customer support?",
      answer: "You can contact our support team through the ticket system in your dashboard, email us at support@bit_exchange.com, or use our live chat feature available 24/7."
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-muted-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.759 8.241 16 9.007 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.532a1 1 0 00-1.414-1.414l-.705.705a2 2 0 01-2.83-2.83l.704-.704a1 1 0 00-1.414-1.414l-.704.704a4 4 0 105.656 5.656l.704-.704z" clipRule="evenodd" />
            </svg>
            <h1 className="text-2xl font-bold text-muted-gray-900">Support Center</h1>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'contact', label: 'Contact Us', icon: '📞' },
              { id: 'tickets', label: 'My Tickets', icon: '🎫' },
              { id: 'faq', label: 'FAQ', icon: '❓' }
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
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-pale-blue-500 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-gray-900">Email Support</h4>
                    <p className="text-sm text-gray-600">support@bit_exchange.com</p>
                    <p className="text-xs text-gray-500">Response time: 2-4 hours</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-pale-blue-500 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-gray-900">Phone Support</h4>
                    <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-xs text-gray-500">Mon-Fri: 9AM-6PM EST</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-pale-blue-500 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.759 8.241 16 9.007 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.532a1 1 0 00-1.414-1.414l-.705.705a2 2 0 01-2.83-2.83l.704-.704a1 1 0 00-1.414-1.414l-.704.704a4 4 0 105.656 5.656l.704-.704z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-gray-900">Live Chat</h4>
                    <p className="text-sm text-gray-600">Available 24/7</p>
                    <p className="text-xs text-gray-500">Average response: 30 seconds</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Send us a Message</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pale-blue-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pale-blue-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pale-blue-500 focus:border-transparent"
                    placeholder="Brief description of your inquiry"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pale-blue-500 focus:border-transparent"
                    placeholder="Please provide details about your inquiry..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-pale-blue-500 text-white py-2 px-4 rounded-lg hover:bg-pale-blue-600 transition-colors font-medium"
                >
                  Send Message
                </button>
              </form>
            </Card>
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Support Tickets</h3>
              <button
                onClick={() => setShowTicketModal(true)}
                className="bg-pale-blue-500 text-white px-4 py-2 rounded-lg hover:bg-pale-blue-600 transition-colors font-medium"
              >
                Create Ticket
              </button>
            </div>

            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Ticket ID</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Subject</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Category</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Priority</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket) => (
                      <tr key={ticket.id} className="border-b border-gray-100">
                        <td className="py-3 text-sm font-medium text-gray-900">{ticket.id}</td>
                        <td className="py-3 text-sm text-gray-600">{ticket.subject}</td>
                        <td className="py-3 text-sm text-gray-600">{ticket.category}</td>
                        <td className="py-3">{getStatusBadge(ticket.status)}</td>
                        <td className="py-3">{getPriorityBadge(ticket.priority)}</td>
                        <td className="py-3 text-sm text-gray-600">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <button className="w-full text-left p-4 focus:outline-none">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{item.question}</h4>
                      <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </button>
                  <div className="px-4 pb-4">
                    <p className="text-gray-600 text-sm">{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Create Ticket Modal */}
        {showTicketModal && (
          <Modal
            isOpen={showTicketModal}
            onClose={() => setShowTicketModal(false)}
            title="Create Support Ticket"
          >
            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pale-blue-500 focus:border-transparent"
                  placeholder="Brief description of your issue"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pale-blue-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  <option value="ACCOUNT">Account Issues</option>
                  <option value="KYC">KYC/Verification</option>
                  <option value="WALLET">Wallet/Deposits</option>
                  <option value="TRADING">Trading Issues</option>
                  <option value="SECURITY">Security Concerns</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pale-blue-500 focus:border-transparent"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pale-blue-500 focus:border-transparent"
                  placeholder="Please provide detailed information about your issue..."
                ></textarea>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowTicketModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-pale-blue-500 text-white py-2 px-4 rounded-lg hover:bg-pale-blue-600 transition-colors font-medium"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </Layout>
  );
}
