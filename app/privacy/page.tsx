'use client';

import Layout from '@/components/Layout';
import Card from '@/components/Card';

export default function PrivacyPolicyPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">
            Last updated: October 23, 2024
          </p>
        </div>

        {/* Introduction */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
          <p className="text-gray-700 mb-4">
            At bit_exchange ("we," "our," or "us"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our cryptocurrency exchange platform.
          </p>
          <p className="text-gray-700">
            By using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
          </p>
        </Card>

        {/* Information We Collect */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
          <p className="text-gray-700 mb-4">
            We collect personal information that you provide directly to us, including:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Name, email address, and phone number</li>
            <li>Government-issued identification documents</li>
            <li>Proof of address documents</li>
            <li>Bank account information for fiat transactions</li>
            <li>Cryptocurrency wallet addresses</li>
            <li>Transaction history and trading activity</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Technical Information</h3>
          <p className="text-gray-700 mb-4">
            We automatically collect certain technical information when you use our services:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>IP address and device information</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Pages visited and time spent on our platform</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </Card>

        {/* How We Use Information */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">
            We use the collected information for the following purposes:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>To provide and maintain our cryptocurrency exchange services</li>
            <li>To verify your identity and comply with regulatory requirements</li>
            <li>To process transactions and manage your account</li>
            <li>To detect and prevent fraud, money laundering, and other illegal activities</li>
            <li>To communicate with you about your account and our services</li>
            <li>To improve our platform and develop new features</li>
            <li>To comply with legal obligations and regulatory requirements</li>
          </ul>
        </Card>

        {/* Information Sharing */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing and Disclosure</h2>
          <p className="text-gray-700 mb-4">
            We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our platform</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and interests</li>
            <li><strong>Regulatory Compliance:</strong> With regulatory authorities as required by applicable laws</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
          </ul>
        </Card>

        {/* Data Security */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
          <p className="text-gray-700 mb-4">
            We implement industry-standard security measures to protect your personal information:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Encryption of data in transit and at rest</li>
            <li>Multi-factor authentication for account access</li>
            <li>Cold storage for cryptocurrency assets</li>
            <li>Regular security audits and penetration testing</li>
            <li>Employee training on data protection practices</li>
            <li>Access controls and monitoring systems</li>
          </ul>
          <p className="text-gray-700">
            Despite our security measures, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security of your information.
          </p>
        </Card>

        {/* Your Rights */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights and Choices</h2>
          <p className="text-gray-700 mb-4">
            Depending on your jurisdiction, you may have the following rights regarding your personal information:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li><strong>Access:</strong> Request access to your personal information</li>
            <li><strong>Correction:</strong> Request correction of inaccurate information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information</li>
            <li><strong>Portability:</strong> Request transfer of your data to another service</li>
            <li><strong>Restriction:</strong> Request restriction of processing</li>
            <li><strong>Objection:</strong> Object to certain types of processing</li>
          </ul>
          <p className="text-gray-700">
            To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
          </p>
        </Card>

        {/* Cookies */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking Technologies</h2>
          <p className="text-gray-700 mb-4">
            We use cookies and similar tracking technologies to enhance your experience on our platform:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li><strong>Essential Cookies:</strong> Required for basic platform functionality</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our platform</li>
            <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            <li><strong>Security Cookies:</strong> Enhance security and prevent fraud</li>
          </ul>
          <p className="text-gray-700">
            You can control cookie settings through your browser preferences, but disabling certain cookies may affect platform functionality.
          </p>
        </Card>

        {/* Data Retention */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
          <p className="text-gray-700 mb-4">
            We retain your personal information for as long as necessary to:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Provide our services to you</li>
            <li>Comply with legal and regulatory requirements</li>
            <li>Resolve disputes and enforce our agreements</li>
            <li>Prevent fraud and ensure platform security</li>
          </ul>
          <p className="text-gray-700">
            When personal information is no longer needed, we will securely delete or anonymize it in accordance with our data retention policies.
          </p>
        </Card>

        {/* International Transfers */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">International Data Transfers</h2>
          <p className="text-gray-700 mb-4">
            Your personal information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.
          </p>
        </Card>

        {/* Children's Privacy */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
          <p className="text-gray-700">
            Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information.
          </p>
        </Card>

        {/* Changes to Policy */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
          <p className="text-gray-700 mb-4">
            We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Posting the updated policy on our website</li>
            <li>Sending you an email notification</li>
            <li>Displaying a notice on our platform</li>
          </ul>
          <p className="text-gray-700">
            Your continued use of our services after any changes indicates your acceptance of the updated Privacy Policy.
          </p>
        </Card>

        {/* Contact Information */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="space-y-2 text-gray-700">
            <p><strong>Email:</strong> privacy@bit_exchange.com</p>
            <p><strong>Address:</strong> 123 Crypto Street, Digital City, DC 12345</p>
            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
