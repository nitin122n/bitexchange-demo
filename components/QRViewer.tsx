'use client';

import { useState } from 'react';
import Image from 'next/image';

interface QRViewerProps {
  qrCode: string;
  walletAddress: string;
  amount?: number;
  currency?: string;
  className?: string;
}

export default function QRViewer({ 
  qrCode, 
  walletAddress, 
  amount, 
  currency = 'USD',
  className = '' 
}: QRViewerProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 ${className}`}>
      <div className="text-center space-y-4">
        {/* QR Code */}
        <div className="flex justify-center">
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <Image 
              src={qrCode} 
              alt="QR Code for wallet address" 
              width={192}
              height={192}
              className="w-48 h-48"
            />
          </div>
        </div>

        {/* Amount */}
        {amount && (
          <div className="text-center">
            <p className="text-sm text-muted-gray-500">Amount to Send</p>
            <p className="text-2xl font-bold text-muted-gray-900">
              {amount.toLocaleString('en-US', {
                style: 'currency',
                currency: currency,
              })}
            </p>
          </div>
        )}

        {/* Wallet Address */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-gray-700">Wallet Address</p>
          <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
            <code className="flex-1 text-sm text-muted-gray-800 break-all">
              {walletAddress}
            </code>
            <button
              onClick={copyToClipboard}
              className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-200 transition-colors"
              title="Copy address"
            >
              {copied ? (
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-muted-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
              )}
            </button>
          </div>
          {copied && (
            <p className="text-xs text-green-600 font-medium">Address copied!</p>
          )}
        </div>

        {/* Instructions */}
        <div className="text-left space-y-2 text-sm text-muted-gray-600">
          <p className="font-medium">Instructions:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Open your TRC20 wallet (TronLink, Trust Wallet, etc.)</li>
            <li>Scan the QR code or copy the wallet address</li>
            <li>Send the exact amount shown above</li>
            <li>Wait for confirmation (usually 1-3 minutes)</li>
          </ol>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="text-xs text-yellow-800">
              <p className="font-medium">Important:</p>
              <p>Only send TRC20 tokens to this address. Sending other cryptocurrencies may result in permanent loss.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
