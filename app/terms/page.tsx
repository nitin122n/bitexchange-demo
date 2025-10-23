'use client';

import Layout from '@/components/Layout';
import Card from '@/components/Card';

export default function TermsPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600">
            Last updated: October 23, 2024
          </p>
        </div>

        {/* Introduction */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
          <p className="text-gray-700 mb-4">
            Welcome to bit_exchange. These Terms of Service (&quot;Terms&quot;) govern your use of our cryptocurrency exchange platform and services (collectively, the &quot;Service&quot;) operated by bit_exchange (&quot;us,&quot; &quot;we,&quot; or &quot;our&quot;).
          </p>
          <p className="text-gray-700">
            By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service.
          </p>
        </Card>

        {/* Account Terms */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Terms</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Account Creation</h3>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>You must be at least 18 years old to create an account</li>
            <li>You must provide accurate and complete information during registration</li>
            <li>You are responsible for maintaining the security of your account credentials</li>
            <li>You must notify us immediately of any unauthorized use of your account</li>
            <li>One person or entity may not maintain multiple accounts</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Account Verification</h3>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>You must complete identity verification (KYC) to access full platform features</li>
            <li>We may request additional documentation at any time</li>
            <li>Account verification is subject to our approval</li>
            <li>We reserve the right to suspend accounts pending verification</li>
          </ul>
        </Card>

        {/* Trading Terms */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Trading Terms</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Trading Rules</h3>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>All trades are executed based on current market prices</li>
            <li>We reserve the right to cancel trades in case of technical errors</li>
            <li>Market orders are executed immediately at the best available price</li>
            <li>Limit orders are executed when the market price reaches your specified price</li>
            <li>We may impose trading limits based on account verification level</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Fees and Charges</h3>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Trading fees are displayed before order execution</li>
            <li>Withdrawal fees vary by cryptocurrency and network conditions</li>
            <li>Deposit fees may apply for certain payment methods</li>
            <li>We reserve the right to modify fees with 30 days&apos; notice</li>
          </ul>
        </Card>

        {/* Deposits and Withdrawals */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Deposits and Withdrawals</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Deposits</h3>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Deposits are credited after blockchain confirmation</li>
            <li>Minimum deposit amounts apply to all cryptocurrencies</li>
            <li>We are not responsible for deposits sent to incorrect addresses</li>
            <li>Deposits may be delayed due to network congestion</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Withdrawals</h3>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Withdrawals are processed during business hours</li>
            <li>Additional verification may be required for large withdrawals</li>
            <li>Withdrawal limits apply based on account verification level</li>
            <li>We may suspend withdrawals for security or compliance reasons</li>
          </ul>
        </Card>

        {/* Prohibited Activities */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Prohibited Activities</h2>
          <p className="text-gray-700 mb-4">
            You agree not to engage in any of the following prohibited activities:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Money laundering or terrorist financing</li>
            <li>Market manipulation or insider trading</li>
            <li>Creating multiple accounts to circumvent limits</li>
            <li>Using automated trading bots without permission</li>
            <li>Violating any applicable laws or regulations</li>
            <li>Attempting to hack or compromise our systems</li>
            <li>Providing false or misleading information</li>
            <li>Interfering with other users&apos; trading activities</li>
          </ul>
        </Card>

        {/* Risk Disclosure */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Risk Disclosure</h2>
          <p className="text-gray-700 mb-4">
            Trading cryptocurrencies involves significant risk. You acknowledge and agree that:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Cryptocurrency prices are highly volatile and unpredictable</li>
            <li>You may lose all or part of your investment</li>
            <li>Past performance does not guarantee future results</li>
            <li>Regulatory changes may affect cryptocurrency values</li>
            <li>Technical issues may temporarily affect trading</li>
            <li>You should only invest what you can afford to lose</li>
          </ul>
        </Card>

        {/* Platform Availability */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Platform Availability</h2>
          <p className="text-gray-700 mb-4">
            While we strive to maintain continuous service availability:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>We do not guarantee uninterrupted service</li>
            <li>Scheduled maintenance may temporarily suspend services</li>
            <li>Technical issues may cause delays or interruptions</li>
            <li>We are not liable for losses due to service interruptions</li>
          </ul>
        </Card>

        {/* Intellectual Property */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
          <p className="text-gray-700 mb-4">
            The Service and its original content, features, and functionality are owned by bit_exchange and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>
          <p className="text-gray-700">
            You may not copy, modify, distribute, sell, or lease any part of our Service without our written permission.
          </p>
        </Card>

        {/* Limitation of Liability */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
          <p className="text-gray-700 mb-4">
            To the maximum extent permitted by law:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>We provide the Service &quot;as is&quot; without warranties</li>
            <li>We are not liable for indirect, incidental, or consequential damages</li>
            <li>Our total liability is limited to the fees you paid us in the 12 months preceding the claim</li>
            <li>We are not responsible for third-party actions or services</li>
          </ul>
        </Card>

        {/* Indemnification */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Indemnification</h2>
          <p className="text-gray-700">
            You agree to indemnify and hold harmless bit_exchange and its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the Service or violation of these Terms.
          </p>
        </Card>

        {/* Termination */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
          <p className="text-gray-700 mb-4">
            We may terminate or suspend your account immediately, without prior notice, for any reason, including:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Violation of these Terms</li>
            <li>Suspected fraudulent activity</li>
            <li>Regulatory or legal requirements</li>
            <li>Extended account inactivity</li>
          </ul>
          <p className="text-gray-700">
            Upon termination, you must cease all use of the Service and may request withdrawal of remaining funds subject to applicable fees and verification requirements.
          </p>
        </Card>

        {/* Governing Law */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
          <p className="text-gray-700">
            These Terms are governed by and construed in accordance with the laws of [Jurisdiction], without regard to conflict of law principles. Any disputes arising from these Terms or your use of the Service will be subject to the exclusive jurisdiction of the courts in [Jurisdiction].
          </p>
        </Card>

        {/* Changes to Terms */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
          <p className="text-gray-700 mb-4">
            We reserve the right to modify these Terms at any time. We will notify you of any material changes by:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Posting the updated Terms on our website</li>
            <li>Sending you an email notification</li>
            <li>Displaying a notice on our platform</li>
          </ul>
          <p className="text-gray-700">
            Your continued use of the Service after any changes indicates your acceptance of the updated Terms.
          </p>
        </Card>

        {/* Contact Information */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="space-y-2 text-gray-700">
            <p><strong>Email:</strong> legal@bit_exchange.com</p>
            <p><strong>Address:</strong> 123 Crypto Street, Digital City, DC 12345</p>
            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
