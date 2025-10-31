'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import Card from '@/components/Card';

interface RegistrationData {
  name: string;
  email: string;
  password: string;
  contactDetails?: string;
}

interface RegistrationResponse {
  success: boolean;
  ib?: {
    id: string;
    name: string;
    email: string;
    referralCode: string;
    referralLink: string;
  };
  error?: string;
}

export default function IBRegistrationPage() {
  const [formData, setFormData] = useState<RegistrationData>({
    name: '',
    email: '',
    password: '',
    contactDetails: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [registeredIB, setRegisteredIB] = useState<RegistrationResponse['ib'] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ib/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result: RegistrationResponse = await response.json();

      if (!response.ok || !result.success) {
        setError(result.error || 'Registration failed');
        return;
      }

      setRegisteredIB(result.ib || null);
      setSuccess(true);
      setFormData({ name: '', email: '', password: '', contactDetails: '' });
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center space-x-2">
          <svg className="w-6 h-6 text-royal-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
          <h1 className="text-2xl font-bold text-muted-gray-900">IB Registration</h1>
        </div>

        {success && registeredIB ? (
          <Card>
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-gold-500 to-royal-purple-500 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-muted-gray-900 mb-2">Registration Successful!</h2>
                <p className="text-muted-gray-600">Your IB account has been created successfully.</p>
              </div>

              <div className="bg-gradient-to-r from-royal-purple-50 to-emerald-gold-50 rounded-lg p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-gray-700 mb-1">IB Name</label>
                  <div className="bg-white rounded-lg p-3 font-mono text-muted-gray-900">{registeredIB.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-gray-700 mb-1">Email</label>
                  <div className="bg-white rounded-lg p-3 font-mono text-muted-gray-900">{registeredIB.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-gray-700 mb-1">Referral Code</label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-white rounded-lg p-3 font-mono text-lg font-bold text-royal-purple-600">
                      {registeredIB.referralCode}
                    </div>
                    <button
                      onClick={() => copyToClipboard(registeredIB.referralCode)}
                      className="btn-primary px-4 py-3"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-gray-700 mb-1">Referral Link</label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-white rounded-lg p-3 font-mono text-sm text-muted-gray-900 break-all">
                      {registeredIB.referralLink}
                    </div>
                    <button
                      onClick={() => copyToClipboard(registeredIB.referralLink)}
                      className="btn-primary px-4 py-3"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSuccess(false);
                  setRegisteredIB(null);
                }}
                className="btn-primary"
              >
                Register Another IB
              </button>
            </div>
          </Card>
        ) : (
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-muted-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="Enter IB name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-muted-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-muted-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field"
                  placeholder="Enter password"
                  minLength={6}
                />
              </div>

              <div>
                <label htmlFor="contactDetails" className="block text-sm font-medium text-muted-gray-700 mb-2">
                  Contact Details <span className="text-gray-400">(Optional)</span>
                </label>
                <textarea
                  id="contactDetails"
                  value={formData.contactDetails}
                  onChange={(e) => setFormData({ ...formData, contactDetails: e.target.value })}
                  className="input-field"
                  placeholder="Phone number, address, etc."
                  rows={3}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Registering...' : 'Register IB'}
              </button>
            </form>
          </Card>
        )}
      </div>
    </Layout>
  );
}

