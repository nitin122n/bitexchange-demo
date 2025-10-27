import { NextRequest, NextResponse } from 'next/server';

interface Position {
  ticket: number;
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
  comment: string;
}

export async function GET(req: NextRequest) {
  try {
    const connectionId = req.nextUrl.searchParams.get('connectionId');
    const login = req.nextUrl.searchParams.get('login');

    if (!connectionId) {
      return NextResponse.json(
        { error: 'Connection ID is required' },
        { status: 400 }
      );
    }

    // Mock positions data
    const positions: Position[] = [
      {
        ticket: 12345678,
        login: login ? parseInt(login) : 123456,
        symbol: 'EURUSD',
        type: 'BUY',
        volume: 0.10,
        priceOpen: 1.08500,
        priceCurrent: 1.08750,
        profit: 25.00,
        swap: -1.20,
        commission: 0.70,
        timeOpen: new Date(Date.now() - 3600000).toISOString(),
        comment: 'Manual trade'
      },
      {
        ticket: 12345679,
        login: login ? parseInt(login) : 123456,
        symbol: 'AUDUSD',
        type: 'BUY',
        volume: 0.20,
        priceOpen: 0.66500,
        priceCurrent: 0.66650,
        profit: 30.00,
        swap: -2.40,
        commission: 1.40,
        timeOpen: new Date(Date.now() - 7200000).toISOString(),
        comment: 'Automated EA'
      },
      {
        ticket: 12345680,
        login: login ? parseInt(login) : 123456,
        symbol: 'USDJPY',
        type: 'SELL',
        volume: 0.15,
        priceOpen: 149.500,
        priceCurrent: 149.300,
        profit: 30.00,
        swap: -1.80,
        commission: 1.05,
        timeOpen: new Date(Date.now() - 1800000).toISOString(),
        comment: 'Scalping strategy'
      }
    ];

    const totalProfit = positions.reduce((sum, pos) => sum + pos.profit, 0);
    const totalSwap = positions.reduce((sum, pos) => sum + pos.swap, 0);
    const totalCommission = positions.reduce((sum, pos) => sum + pos.commission, 0);
    const netProfit = totalProfit + totalSwap - totalCommission;

    return NextResponse.json({
      positions,
      summary: {
        total: positions.length,
        buyPositions: positions.filter(p => p.type === 'BUY').length,
        sellPositions: positions.filter(p => p.type === 'SELL').length,
        totalProfit,
        totalSwap,
        totalCommission,
        netProfit
      }
    }, { status: 200 });
  } catch (error: any) {
    console.error('MT5 positions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch MT5 positions: ' + error.message },
      { status: 500 }
    );
  }
}

