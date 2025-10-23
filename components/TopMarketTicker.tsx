'use client';

import { useState, useEffect } from 'react';

interface MarketData {
  id: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  isPositive: boolean;
}

interface TopMarketTickerProps {
  className?: string;
}

export default function TopMarketTicker({ className = '' }: TopMarketTickerProps) {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch('/api/market/ticker');
        const result = await response.json();
        
        if (result.success) {
          setMarketData(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch market data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchMarketData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className={`bg-white border-b border-gray-200 py-2 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-pulse text-muted-gray-500">Loading market data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border-b border-gray-200 py-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8 overflow-hidden">
          <div className="flex items-center space-x-4 animate-marquee">
            {marketData.map((item) => (
              <div key={item.id} className="flex items-center space-x-2 whitespace-nowrap">
                <span className="font-semibold text-muted-gray-700">{item.symbol}</span>
                <span className="text-muted-gray-900 font-medium">
                  {item.price.toLocaleString('en-US', {
                    minimumFractionDigits: item.symbol === 'BTC' ? 0 : 2,
                    maximumFractionDigits: item.symbol === 'BTC' ? 0 : 4,
                  })}
                </span>
                <span className={`text-sm font-medium ${
                  item.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.isPositive ? '+' : ''}{item.change.toFixed(2)} ({item.isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <a 
            href="https://www.tradingview.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-muted-gray-500 hover:text-pale-blue-600 transition-colors"
          >
            Track all markets on TradingView
          </a>
          <div className="w-6 h-6 text-muted-gray-400">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
