'use client';

import Layout from '@/components/Layout';
import Card from '@/components/Card';

export default function ReferralPage() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-muted-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            <h1 className="text-2xl font-bold text-muted-gray-900">Referral Program</h1>
          </div>
        </div>

        {/* Referral Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-pale-blue-600 mb-2">25%</div>
              <div className="text-gray-600">Commission Rate</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-pale-blue-600 mb-2">$1,250</div>
              <div className="text-gray-600">Total Earned</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-pale-blue-600 mb-2">12</div>
              <div className="text-gray-600">Active Referrals</div>
            </div>
          </Card>
        </div>

        {/* Referral Link */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Referral Link</h3>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value="https://bit_exchange.com/ref/abc123"
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
            />
            <button className="bg-pale-blue-500 text-white px-4 py-2 rounded-lg hover:bg-pale-blue-600 transition-colors">
              Copy Link
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Share this link with friends and earn 25% commission on their trading fees forever!
          </p>
        </Card>

        {/* Referral Rules */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-pale-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Share Your Link</h4>
                <p className="text-sm text-gray-600">Share your unique referral link with friends, family, or on social media</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-pale-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">They Sign Up</h4>
                <p className="text-sm text-gray-600">Your referrals sign up using your link and complete KYC verification</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-pale-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Start Earning</h4>
                <p className="text-sm text-gray-600">Earn 25% commission on all trading fees paid by your referrals</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Referral History */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Referral History</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-sm font-medium text-gray-600">Referral</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-600">Sign Up Date</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-600">Commission Earned</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 text-sm font-medium text-gray-900">user@example.com</td>
                  <td className="py-3 text-sm text-gray-600">2024-10-20</td>
                  <td className="py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-600">$125.50</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 text-sm font-medium text-gray-900">trader@email.com</td>
                  <td className="py-3 text-sm text-gray-600">2024-10-18</td>
                  <td className="py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-600">$89.25</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 text-sm font-medium text-gray-900">crypto@domain.com</td>
                  <td className="py-3 text-sm text-gray-600">2024-10-15</td>
                  <td className="py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-600">$0.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
