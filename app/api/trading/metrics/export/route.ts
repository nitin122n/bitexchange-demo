import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Fetch metrics data
    const metricsResponse = await fetch(`${request.nextUrl.origin}/api/trading/metrics`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!metricsResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
    }

    const { metrics } = await metricsResponse.json();

    // Generate CSV
    const headers = ['Trader', 'Win Rate (%)', 'Total P&L', 'Total Trades', 'Winning Trades', 'Losing Trades', 'Avg Trade Duration (h)', 'Avg Risk:Reward'];
    const rows = metrics.map((m: any) => [
      m.traderName,
      m.winRate.toFixed(2),
      m.totalPnL.toFixed(2),
      m.totalTrades,
      m.winningTrades,
      m.losingTrades,
      m.avgTradeDuration.toFixed(2),
      m.avgRiskReward.toFixed(2),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row: any[]) => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="performance-metrics.csv"',
      },
    });
  } catch (error: any) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Failed to export metrics' }, { status: 500 });
  }
}

