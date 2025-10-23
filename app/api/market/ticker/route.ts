import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/market/ticker
 * Get market ticker data (mocked for demo)
 * In production, replace with real API calls to CoinGecko, TradingView, etc.
 */
export async function GET(request: NextRequest) {
  try {
    // Mock market data - in production, fetch from real APIs
    const marketData = {
      bitcoin: {
        symbol: 'BTC',
        price: 107552,
        change: -3028.00,
        changePercent: -2.74,
        currency: 'USD'
      },
      ethereum: {
        symbol: 'ETH',
        price: 3855.5,
        change: -125.10,
        changePercent: -3.14,
        currency: 'USD'
      },
      gold: {
        symbol: 'GOLD',
        price: 4271.275,
        change: -84.52,
        changePercent: -1.94,
        currency: 'USD'
      },
      eurusd: {
        symbol: 'EUR/USD',
        price: 1.16168,
        change: -0.00,
        changePercent: -0.23,
        currency: 'USD'
      },
      oil: {
        symbol: 'USOIL',
        price: 57.14,
        change: 0.22,
        changePercent: 0.39,
        currency: 'USD'
      }
    };

    // Add some randomness to simulate real market fluctuations
    const addRandomness = (value: number, volatility: number = 0.02) => {
      const randomFactor = (Math.random() - 0.5) * volatility;
      return value * (1 + randomFactor);
    };

    const tickerData = Object.entries(marketData).map(([key, data]) => ({
      id: key,
      symbol: data.symbol,
      price: addRandomness(data.price),
      change: addRandomness(data.change),
      changePercent: addRandomness(data.changePercent),
      currency: data.currency,
      isPositive: data.change >= 0,
    }));

    return NextResponse.json({
      success: true,
      data: tickerData,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Market ticker error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
}

/**
 * Note: To integrate with real market data APIs:
 * 
 * 1. CoinGecko API (free tier available):
 *    - GET https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true
 * 
 * 2. TradingView Widget (client-side):
 *    - Add TradingView widget script to your page
 *    - Use their ticker widget for real-time data
 * 
 * 3. Alpha Vantage (stocks/forex):
 *    - GET https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=YOUR_API_KEY
 * 
 * Example implementation with CoinGecko:
 * 
 * const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true');
 * const data = await response.json();
 * 
 * const bitcoinData = {
 *   symbol: 'BTC',
 *   price: data.bitcoin.usd,
 *   changePercent: data.bitcoin.usd_24h_change,
 *   // ... other fields
 * };
 */
