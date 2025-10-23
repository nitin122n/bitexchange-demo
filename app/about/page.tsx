'use client';

import Layout from '@/components/Layout';
import Card from '@/components/Card';

export default function AboutPage() {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center py-12 bg-gradient-to-r from-pale-blue-50 to-pale-teal-50 rounded-2xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About bit_exchange</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Founded in 2025, we are committed to providing secure, fast, and reliable cryptocurrency trading solutions for users worldwide.
          </p>
        </div>

        {/* Mission Section */}
        <Card>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-4">
                To democratize access to cryptocurrency markets while maintaining the highest standards of security, 
                compliance, and customer service. We believe in the transformative power of blockchain technology 
                and are dedicated to building the infrastructure for the future of finance.
              </p>
              <p className="text-lg text-gray-600">
                Our platform serves both retail and institutional clients, providing them with the tools and 
                confidence they need to participate in the digital economy safely and efficiently.
              </p>
            </div>
            <div className="bg-gradient-to-br from-pale-blue-100 to-pale-teal-100 rounded-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Core Values</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-pale-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Security First</h4>
                    <p className="text-sm text-gray-600">Protecting user assets with cutting-edge security measures</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-pale-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Innovation</h4>
                    <p className="text-sm text-gray-600">Continuously improving our platform with latest technology</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-pale-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Transparency</h4>
                    <p className="text-sm text-gray-600">Open communication and honest business practices</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-pale-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Customer Focus</h4>
                    <p className="text-sm text-gray-600">Putting our users at the center of everything we do</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Company Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-pale-blue-600 mb-2">2025</div>
              <div className="text-gray-600">Founded</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-pale-blue-600 mb-2">2M+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-pale-blue-600 mb-2">$50B+</div>
              <div className="text-gray-600">Trading Volume</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-pale-blue-600 mb-2">100+</div>
              <div className="text-gray-600">Countries</div>
            </div>
          </Card>
        </div>

        {/* Compliance Section */}
        <Card>
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Compliance & Security</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Regulatory Compliance</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">ISO 27001 Certified</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">AML/KYC Compliant</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">GDPR Compliant</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">SOC 2 Type II</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Security Measures</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Cold Storage</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Multi-Signature Wallets</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">2FA Authentication</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Advanced Encryption</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Team Section */}
        <Card>
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-pale-blue-500 to-pale-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">JD</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">John Doe</h3>
              <p className="text-pale-blue-600 font-medium mb-2">CEO & Founder</p>
              <p className="text-gray-600 text-sm">
                Former Goldman Sachs executive with 15+ years in financial services and blockchain technology.
              </p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-pale-blue-500 to-pale-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">SM</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sarah Miller</h3>
              <p className="text-pale-blue-600 font-medium mb-2">CTO</p>
              <p className="text-gray-600 text-sm">
                Ex-Google engineer specializing in distributed systems and cryptocurrency infrastructure.
              </p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-pale-blue-500 to-pale-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">MJ</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Michael Johnson</h3>
              <p className="text-pale-blue-600 font-medium mb-2">Head of Security</p>
              <p className="text-gray-600 text-sm">
                Cybersecurity expert with experience at major financial institutions and government agencies.
              </p>
            </div>
          </div>
        </Card>

        {/* Contact CTA */}
        <Card>
          <div className="text-center py-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Join millions of users who trust bit_exchange for secure, fast, and reliable cryptocurrency trading.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-pale-blue-500 to-pale-teal-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-pale-blue-600 hover:to-pale-teal-600 transition-all duration-200">
                Start Trading Now
              </button>
              <button className="border-2 border-pale-blue-500 text-pale-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-pale-blue-50 transition-all duration-200">
                Contact Us
              </button>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
