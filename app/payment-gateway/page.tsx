'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import QRViewer from '@/components/QRViewer';
import Card from '@/components/Card';

interface TRC20Response {
  tradeId: string;
  walletAddress: string;
  qrCode: string;
  amount: number;
  currency: string;
  expiresAt: string;
}

export default function PaymentGatewayPage() {
  const [formData, setFormData] = useState({
    amount: '',
    userEmail: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [trc20Data, setTrc20Data] = useState<TRC20Response | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);
    setTrc20Data(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/payment/trc20/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          userEmail: formData.userEmail,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Failed to generate TRC20 wallet');
        return;
      }

      setTrc20Data(result.data);
      setSuccess(true);
    } catch (error) {
      console.error('TRC20 generation error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ amount: '', userEmail: '' });
    setError('');
    setSuccess(false);
    setTrc20Data(null);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center space-x-2">
          <svg className="w-6 h-6 text-muted-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
          <h1 className="text-2xl font-bold text-muted-gray-900">Payment Gateway</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* TRC20 Deposit Form */}
          <Card>
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-muted-gray-900 mb-2">TRC20 Deposit</h2>
                <p className="text-sm text-muted-gray-600">
                  Generate a TRC20 wallet address and QR code for cryptocurrency deposits.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-muted-gray-700 mb-1">
                    Amount (USD)
                  </label>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="input-field"
                    placeholder="Enter amount in USD"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="userEmail" className="block text-sm font-medium text-muted-gray-700 mb-1">
                    User Email
                  </label>
                  <input
                    id="userEmail"
                    type="email"
                    value={formData.userEmail}
                    onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                    className="input-field"
                    placeholder="Enter user email address"
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </div>
                    ) : (
                      'Generate Wallet/QR'
                    )}
                  </button>
                  
                  {success && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="btn-secondary"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </form>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-2">How it works:</h3>
                <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Enter the deposit amount and user email</li>
                  <li>Click &quot;Generate Wallet/QR&quot; to create a unique TRC20 address</li>
                  <li>A QR code will be generated for easy scanning</li>
                  <li>The deposit will be tracked in the system</li>
                  <li>User can send TRC20 tokens to the generated address</li>
                </ol>
              </div>
            </div>
          </Card>

          {/* QR Code Display */}
          {trc20Data && (
            <div className="space-y-4">
              <QRViewer
                qrCode={trc20Data.qrCode}
                walletAddress={trc20Data.walletAddress}
                amount={trc20Data.amount}
                currency={trc20Data.currency}
              />

              {/* Transaction Details */}
              <Card>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-muted-gray-900">Transaction Details</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-gray-600">Trade ID:</span>
                      <span className="font-medium text-muted-gray-900">{trc20Data.tradeId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-gray-600">Amount:</span>
                      <span className="font-medium text-muted-gray-900">
                        {trc20Data.amount.toLocaleString('en-US', { style: 'currency', currency: trc20Data.currency })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-gray-600">Status:</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-gray-600">Expires:</span>
                      <span className="font-medium text-muted-gray-900">
                        {new Date(trc20Data.expiresAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Success Message */}
          {success && !trc20Data && (
            <Card>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-muted-gray-900">Success!</h3>
                  <p className="text-sm text-muted-gray-600">
                    TRC20 wallet address and QR code have been generated successfully.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Additional Information */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-muted-gray-900">About TRC20 Deposits</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-muted-gray-700 mb-2">Supported Tokens</h4>
                <ul className="text-sm text-muted-gray-600 space-y-1">
                  <li>• USDT (Tether)</li>
                  <li>• USDC (USD Coin)</li>
                  <li>• TRX (Tron)</li>
                  <li>• Other TRC20 tokens</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-gray-700 mb-2">Important Notes</h4>
                <ul className="text-sm text-muted-gray-600 space-y-1">
                  <li>• Only send TRC20 tokens to this address</li>
                  <li>• Deposits are processed automatically</li>
                  <li>• Minimum deposit: $10 USD</li>
                  <li>• Processing time: 1-3 minutes</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Security Notice:</p>
                  <p>This is a demo application. In production, ensure proper wallet security and use real blockchain integration.</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
