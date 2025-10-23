'use client';

import Layout from '@/components/Layout';
import Card from '@/components/Card';

export default function AMLPolicyPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Anti-Money Laundering Policy</h1>
          <p className="text-lg text-gray-600">
            Last updated: October 23, 2024
          </p>
        </div>

        {/* Introduction */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Policy Statement</h2>
          <p className="text-gray-700 mb-4">
            bit_exchange is committed to preventing money laundering, terrorist financing, and other financial crimes. This Anti-Money Laundering (AML) Policy outlines our comprehensive approach to compliance with applicable laws and regulations.
          </p>
          <p className="text-gray-700">
            We maintain strict compliance with international AML standards and work closely with regulatory authorities to ensure the integrity of our platform and the broader financial system.
          </p>
        </Card>

        {/* Regulatory Framework */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Regulatory Framework</h2>
          <p className="text-gray-700 mb-4">
            Our AML program is designed to comply with applicable laws and regulations, including:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Bank Secrecy Act (BSA) and related regulations</li>
            <li>USA PATRIOT Act</li>
            <li>Financial Action Task Force (FATF) recommendations</li>
            <li>European Union AML Directives</li>
            <li>Local jurisdiction-specific AML requirements</li>
          </ul>
        </Card>

        {/* Customer Due Diligence */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer Due Diligence (CDD)</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Identity Verification</h3>
          <p className="text-gray-700 mb-4">
            We implement comprehensive identity verification procedures for all customers:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Government-issued photo identification</li>
            <li>Proof of address (utility bill, bank statement)</li>
            <li>Biometric verification where applicable</li>
            <li>Document authenticity verification</li>
            <li>Sanctions and PEP screening</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Enhanced Due Diligence (EDD)</h3>
          <p className="text-gray-700 mb-4">
            Enhanced due diligence is applied to higher-risk customers and transactions:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Politically Exposed Persons (PEPs)</li>
            <li>High-value transactions</li>
            <li>Customers from high-risk jurisdictions</li>
            <li>Unusual transaction patterns</li>
            <li>Business customers with complex structures</li>
          </ul>
        </Card>

        {/* Transaction Monitoring */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Transaction Monitoring</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Automated Monitoring</h3>
          <p className="text-gray-700 mb-4">
            We employ sophisticated transaction monitoring systems that analyze:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Transaction amounts and frequency</li>
            <li>Geographic patterns and jurisdictions</li>
            <li>Unusual trading behaviors</li>
            <li>Rapid movement of funds</li>
            <li>Structuring and layering patterns</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Manual Review</h3>
          <p className="text-gray-700 mb-4">
            Our compliance team conducts manual reviews for:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Flagged transactions requiring investigation</li>
            <li>Customer behavior changes</li>
            <li>Regulatory inquiries</li>
            <li>Internal referrals</li>
          </ul>
        </Card>

        {/* Suspicious Activity Reporting */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Suspicious Activity Reporting</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-3">SAR Filing</h3>
          <p className="text-gray-700 mb-4">
            We file Suspicious Activity Reports (SARs) when we detect:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Transactions involving known or suspected criminal activity</li>
            <li>Structuring to avoid reporting requirements</li>
            <li>Unusual patterns inconsistent with customer profile</li>
            <li>Transactions with sanctioned entities</li>
            <li>Potential terrorist financing activities</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Reporting Timeline</h3>
          <p className="text-gray-700">
            SARs are filed within 30 days of detecting suspicious activity, with immediate reporting for urgent cases involving terrorism or national security concerns.
          </p>
        </Card>

        {/* Record Keeping */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Record Keeping</h2>
          <p className="text-gray-700 mb-4">
            We maintain comprehensive records for regulatory compliance and audit purposes:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Customer identification and verification documents</li>
            <li>Transaction records and supporting documentation</li>
            <li>Risk assessments and due diligence reports</li>
            <li>SAR filings and investigation records</li>
            <li>Training records and policy updates</li>
            <li>Audit reports and compliance testing results</li>
          </ul>
          <p className="text-gray-700">
            Records are maintained for a minimum of 5 years from the date of account closure or transaction completion, as required by applicable regulations.
          </p>
        </Card>

        {/* Training and Awareness */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Training and Awareness</h2>
          <p className="text-gray-700 mb-4">
            All employees receive comprehensive AML training covering:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>AML laws and regulations</li>
            <li>Customer due diligence procedures</li>
            <li>Transaction monitoring and reporting</li>
            <li>Red flags and suspicious activity indicators</li>
            <li>Internal policies and procedures</li>
            <li>Technology tools and systems</li>
          </ul>
          <p className="text-gray-700">
            Training is provided upon hire and annually thereafter, with additional training for high-risk roles and regulatory updates.
          </p>
        </Card>

        {/* Technology and Systems */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Technology and Systems</h2>
          <p className="text-gray-700 mb-4">
            We utilize advanced technology solutions to enhance our AML capabilities:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Real-time transaction monitoring systems</li>
            <li>Sanctions and PEP screening databases</li>
            <li>Blockchain analytics and forensics tools</li>
            <li>Machine learning for pattern recognition</li>
            <li>Automated risk scoring and alert systems</li>
            <li>Case management and workflow tools</li>
          </ul>
        </Card>

        {/* Third-Party Relationships */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Relationships</h2>
          <p className="text-gray-700 mb-4">
            We conduct due diligence on all third-party relationships and service providers:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Vendor risk assessments</li>
            <li>Contractual AML compliance requirements</li>
            <li>Ongoing monitoring and oversight</li>
            <li>Regular compliance reviews</li>
          </ul>
        </Card>

        {/* Risk Assessment */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Risk Assessment</h2>
          <p className="text-gray-700 mb-4">
            We conduct regular risk assessments to identify and mitigate AML risks:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Customer risk profiling</li>
            <li>Product and service risk analysis</li>
            <li>Geographic risk assessment</li>
            <li>Channel and delivery method evaluation</li>
            <li>Emerging threat identification</li>
          </ul>
          <p className="text-gray-700">
            Risk assessments are updated annually or when significant changes occur in our business or regulatory environment.
          </p>
        </Card>

        {/* Independent Testing */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Independent Testing</h2>
          <p className="text-gray-700 mb-4">
            Our AML program undergoes regular independent testing by:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Internal audit function</li>
            <li>External compliance consultants</li>
            <li>Regulatory examinations</li>
            <li>Third-party assessments</li>
          </ul>
          <p className="text-gray-700">
            Testing results are reviewed by senior management and the board of directors, with corrective actions implemented as needed.
          </p>
        </Card>

        {/* Contact Information */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Compliance Contact</h2>
          <p className="text-gray-700 mb-4">
            For questions about our AML program or to report suspicious activity:
          </p>
          <div className="space-y-2 text-gray-700">
            <p><strong>AML Officer:</strong> compliance@bit_exchange.com</p>
            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            <p><strong>Address:</strong> 123 Crypto Street, Digital City, DC 12345</p>
            <p><strong>24/7 Hotline:</strong> +1 (555) 999-8888</p>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
