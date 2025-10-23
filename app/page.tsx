'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pale-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-slate-50 via-royal-purple-50 to-emerald-gold-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-royal-purple-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-royal-purple-500 to-emerald-gold-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="5" fill="currentColor" stroke="none" />
                </svg>
              </div>
              <span className="text-2xl font-bold gradient-text">
                bit_exchange
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/market" className="text-deep-slate-600 hover:text-royal-purple-600 transition-colors font-medium">
                Features
              </Link>
              <Link href="/contact" className="text-deep-slate-600 hover:text-royal-purple-600 transition-colors font-medium">
                Contact
              </Link>
              <Link href="/referral" className="text-deep-slate-600 hover:text-royal-purple-600 transition-colors font-medium">
                Referral Links
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="bg-gradient-to-r from-royal-purple-500 to-emerald-gold-500 text-white px-6 py-2 rounded-lg font-medium hover:from-royal-purple-600 hover:to-emerald-gold-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/login"
                    className="text-deep-slate-600 hover:text-royal-purple-600 font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/login"
                    className="bg-gradient-to-r from-royal-purple-500 to-emerald-gold-500 text-white px-6 py-2 rounded-lg font-medium hover:from-royal-purple-600 hover:to-emerald-gold-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                  >
                    <span>Get Started</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-6xl lg:text-8xl font-bold mb-8">
              <span className="text-deep-slate-900">The Future of </span>
              <span className="bg-gradient-to-r from-royal-purple-600 to-royal-purple-800 bg-clip-text text-transparent">Crypto </span>
              <span className="bg-gradient-to-r from-emerald-gold-600 to-luxury-gold-600 bg-clip-text text-transparent">Trading</span>
            </h1>
            <p className="text-xl lg:text-2xl text-deep-slate-600 mb-12 max-w-4xl mx-auto">
              Empowering traders through high-quality tools, education, and support. Start your journey with bit_exchange today.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-royal-purple-500 to-emerald-gold-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-royal-purple-600 hover:to-emerald-gold-600 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center space-x-2"
              >
                <span>Get Started</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="border-2 border-royal-purple-500 text-royal-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-royal-purple-500 hover:text-white transition-all duration-200">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Active Traders */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-royal-purple-500 to-royal-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-deep-slate-900 mb-2">10K+</div>
              <div className="text-deep-slate-600">Active Traders</div>
            </div>

            {/* Security Rate */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-gold-500 to-emerald-gold-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-deep-slate-900 mb-2">99.9%</div>
              <div className="text-deep-slate-600">Security Rate</div>
            </div>

            {/* Support */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-luxury-gold-500 to-luxury-gold-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-deep-slate-900 mb-2">24/7</div>
              <div className="text-deep-slate-600">Support</div>
            </div>

            {/* Transaction Time */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-crimson-red-500 to-crimson-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-deep-slate-900 mb-2">&lt;1s</div>
              <div className="text-deep-slate-600">Transaction Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-royal-purple-500 to-emerald-gold-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Trading?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Join thousands of traders who trust bit_exchange for secure, fast, and reliable cryptocurrency trading.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="bg-white text-royal-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Start Trading Now
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-royal-purple-600 transition-all duration-200">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Company Info Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                About bit_exchange
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Founded in 2020, bit_exchange has emerged as a leading cryptocurrency exchange platform, 
                serving millions of users across the globe. We are committed to providing secure, 
                reliable, and innovative trading solutions for both retail and institutional clients.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Our mission is to democratize access to cryptocurrency markets while maintaining the 
                highest standards of security, compliance, and customer service. We believe in the 
                transformative power of blockchain technology and are dedicated to building the 
                infrastructure for the future of finance.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Founded</h3>
                  <p className="text-gray-600">2020</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Headquarters</h3>
                  <p className="text-gray-600">Singapore</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Employees</h3>
                  <p className="text-gray-600">500+</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Countries</h3>
                  <p className="text-gray-600">100+</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-pale-blue-50 to-pale-teal-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Values</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-pale-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Security First</h4>
                    <p className="text-gray-600">Protecting user assets with cutting-edge security measures</p>
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
                    <p className="text-gray-600">Continuously improving our platform with latest technology</p>
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
                    <p className="text-gray-600">Open communication and honest business practices</p>
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
                    <p className="text-gray-600">Putting our users at the center of everything we do</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Crypto Journey?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Join millions of users who trust bit_exchange for secure, fast, and reliable cryptocurrency trading.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Get Started Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-deep-slate-800 to-deep-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-royal-purple-500 to-emerald-gold-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xl font-bold gradient-text">bit_exchange</span>
              </div>
              <p className="text-gray-300 mb-4">
                The world's most advanced cryptocurrency exchange platform.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Products</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-royal-purple-400 transition-colors">Spot Trading</a></li>
                <li><a href="#" className="hover:text-royal-purple-400 transition-colors">Futures Trading</a></li>
                <li><a href="#" className="hover:text-royal-purple-400 transition-colors">Margin Trading</a></li>
                <li><a href="#" className="hover:text-royal-purple-400 transition-colors">Staking</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/about" className="hover:text-royal-purple-400 transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-royal-purple-400 transition-colors">Contact Us</Link></li>
                <li><Link href="/kyc" className="hover:text-royal-purple-400 transition-colors">KYC Verification</Link></li>
                <li><Link href="/market" className="hover:text-royal-purple-400 transition-colors">Market</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/terms" className="hover:text-royal-purple-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-royal-purple-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/aml-policy" className="hover:text-royal-purple-400 transition-colors">AML Policy</Link></li>
                <li><Link href="/contact" className="hover:text-royal-purple-400 transition-colors">Support</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-deep-slate-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 bit_exchange. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
