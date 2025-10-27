import { NextRequest, NextResponse } from 'next/server';

interface TradeHistory {
  id: string;
  login: number;
  symbol: string;
  type: 'BUY' | 'SELL';
  volume: number;
  priceOpen: number;
  priceCurrent: number;
  profit: number;
  swap: number;
  commission: number;
  timeOpen: string;
  timeClose?: string;
  status: string;
}

export async function GET(req: NextRequest) {
  try {
    const connectionId = req.nextUrl.searchParams.get('connectionId');
    const login = req.nextUrl.searchParams.get('login');
    const startDate = req.nextUrl.searchParams.get('startDate');
    const endDate = req.nextUrl.searchParams.get('endDate');

    if (!connectionId || !login) {
      return NextResponse.json(
        { error: 'Connection ID and login are required' },
        { status: 400 }
      );
    }

    // Mock trading history - In production, fetch from MT5 API
    const history: TradeHistory[] = [
      {
        id: '1',
        login: parseInt(login),
        symbol: 'EURUSD',
        type: 'BUY',
        volume: 0.10,
        priceOpen: 1.08500,
        priceCurrent: 1.08750,
        profit: 25.00,
        swap: -1.20,
        commission: 0.70,
        timeOpen: new Date(Date.now() - 86400000).toISOString(),
        timeClose: new Date(Date.now() - 3600000).toISOString(),
        status: 'CLOSED'
      },
      {
        id: '2',
        login: parseInt(login),
        symbol: 'GBPUSD',
        type: 'SELL',
        volume: 0.05,
        priceOpen: 1.27300,
        priceCurrent: 1.27150,
        profit: 7.50,
        swap: -0.60,
        commission: 0.35,
        timeOpen: new Date(Date.now() - 7200000).toISOString(),
        timeClose: new Date(Date.now() - 1800000).toISOString(),
        status: 'CLOSED'
      },
      {
        id: '3',
        login: parseInt(login),
        symbol: 'AUDUSD',
        type: 'BUY',
        volume: 0.20,
        priceOpen: 0.66500,
        priceCurrent: 0.66650,
        profit: 30.00,
        swap: -2.40,
        commission: 1.40,
        timeOpen: new Date(Date.now() - 3600000).toISOString(),
        status: 'OPEN'
      },
      {
        id: '4',
        login: parseInt(login),
        symbol: 'USDJPY',
        type: 'SELL',
        volume: 0.15,
        priceOpen: 149.500,
        priceCurrent: 149.300,
        profit: 30.00,
        swap: -1.80,
        commission: 1.05,
        timeOpen: new Date(Date.now() - 3600000).toISOString(),
        status: 'OPEN'
      }
    ];

    // Apply date filtering if provided
    let filteredHistory = history;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredHistory = history.filter(trade => {
        const tradeDate = new Date(trade.timeOpen);
        return tradeDate >= start && tradeDate <= end;
      });
    }

    const totalProfit = filteredHistory.reduce((sum, trade) => sum + trade.profit, 0);
    const openTrades = filteredHistory.filter(trade => trade.status === 'OPEN');
    const closedTrades = filteredHistory.filter(trade => trade.status === 'CLOSED');

    return NextResponse.json({
      history: filteredHistory,
      summary: {
        total: filteredHistory.length,
        open: openTrades.length,
        closed: closedTrades.length,
        totalProfit: totalProfit,
        openPositions: openTrades.length
      }
    }, { status: 200 });
  } catch (error: any) {
    console.error('MT5 history error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch MT5 history: ' + error.message },
      { status: 500 }
    );
  }
}

