'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Card from '@/components/Card';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
  isRead: boolean;
  createdAt: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category: 'SYSTEM' | 'DEPOSIT' | 'WITHDRAWAL' | 'CLIENT' | 'MAINTENANCE';
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // Mock data for demo
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'New Deposit Request',
          message: 'Client John Smith has requested a deposit of $5,000 via TRC20',
          type: 'INFO',
          isRead: false,
          createdAt: '2024-10-23T10:30:00Z',
          priority: 'HIGH',
          category: 'DEPOSIT'
        },
        {
          id: '2',
          title: 'System Maintenance Scheduled',
          message: 'Scheduled maintenance will occur on October 25th from 2:00 AM to 4:00 AM UTC',
          type: 'WARNING',
          isRead: false,
          createdAt: '2024-10-22T15:45:00Z',
          priority: 'MEDIUM',
          category: 'MAINTENANCE'
        },
        {
          id: '3',
          title: 'Withdrawal Approved',
          message: 'Withdrawal request #WT-2024-001 has been approved and processed',
          type: 'SUCCESS',
          isRead: true,
          createdAt: '2024-10-22T09:15:00Z',
          priority: 'LOW',
          category: 'WITHDRAWAL'
        },
        {
          id: '4',
          title: 'Client Account Suspended',
          message: 'Account for user sarah.johnson@email.com has been suspended due to suspicious activity',
          type: 'ERROR',
          isRead: false,
          createdAt: '2024-10-21T14:20:00Z',
          priority: 'URGENT',
          category: 'CLIENT'
        },
        {
          id: '5',
          title: 'New Client Registration',
          message: 'New client Maria Garcia has completed registration and verification',
          type: 'SUCCESS',
          isRead: true,
          createdAt: '2024-10-21T11:30:00Z',
          priority: 'LOW',
          category: 'CLIENT'
        },
        {
          id: '6',
          title: 'Database Backup Completed',
          message: 'Daily database backup has been completed successfully',
          type: 'SUCCESS',
          isRead: true,
          createdAt: '2024-10-21T03:00:00Z',
          priority: 'LOW',
          category: 'SYSTEM'
        },
        {
          id: '7',
          title: 'High Volume Trading Alert',
          message: 'Unusual trading volume detected for BTC/USD pair',
          type: 'WARNING',
          isRead: false,
          createdAt: '2024-10-20T16:45:00Z',
          priority: 'HIGH',
          category: 'SYSTEM'
        },
        {
          id: '8',
          title: 'Payment Gateway Update',
          message: 'TRC20 payment gateway has been updated to version 2.1.3',
          type: 'INFO',
          isRead: true,
          createdAt: '2024-10-20T08:30:00Z',
          priority: 'MEDIUM',
          category: 'SYSTEM'
        }
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'ALL' || 
      (filter === 'UNREAD' && !notification.isRead) ||
      (filter === 'READ' && notification.isRead);
    
    const matchesCategory = categoryFilter === 'ALL' || notification.category === categoryFilter;
    
    return matchesFilter && matchesCategory;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      INFO: (
        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
      WARNING: (
        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      SUCCESS: (
        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      ERROR: (
        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )
    };
    return icons[type as keyof typeof icons];
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

  const getCategoryBadge = (category: string) => {
    const styles = {
      SYSTEM: 'bg-blue-100 text-blue-800',
      DEPOSIT: 'bg-green-100 text-green-800',
      WITHDRAWAL: 'bg-purple-100 text-purple-800',
      CLIENT: 'bg-indigo-100 text-indigo-800',
      MAINTENANCE: 'bg-yellow-100 text-yellow-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[category as keyof typeof styles]}`}>
        {category}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
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
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            <h1 className="text-2xl font-bold text-muted-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-gray-600">
              Total: {notifications.length} | Unread: {unreadCount}
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="btn-secondary"
              >
                Mark All as Read
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input-field"
              >
                <option value="ALL">All Notifications</option>
                <option value="UNREAD">Unread Only</option>
                <option value="READ">Read Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input-field"
              >
                <option value="ALL">All Categories</option>
                <option value="SYSTEM">System</option>
                <option value="DEPOSIT">Deposit</option>
                <option value="WITHDRAWAL">Withdrawal</option>
                <option value="CLIENT">Client</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more notifications.</p>
              </div>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card key={notification.id}>
                <div className={`flex items-start space-x-4 p-4 ${!notification.isRead ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}>
                  <div className="flex-shrink-0">
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className={`text-lg font-medium ${!notification.isRead ? 'text-blue-900' : 'text-gray-900'}`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {getPriorityBadge(notification.priority)}
                        {getCategoryBadge(notification.category)}
                      </div>
                    </div>
                    <p className={`mt-1 text-sm ${!notification.isRead ? 'text-blue-700' : 'text-gray-600'}`}>
                      {notification.message}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {formatDate(notification.createdAt)}
                      </p>
                      <div className="flex items-center space-x-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Mark as Read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
