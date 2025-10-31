import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

function getDateRange(range: 'week' | 'month' | 'year'): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();

  switch (range) {
    case 'week':
      start.setDate(start.getDate() - 7);
      break;
    case 'month':
      start.setMonth(start.getMonth() - 1);
      break;
    case 'year':
      start.setFullYear(start.getFullYear() - 1);
      break;
  }

  return { start, end };
}

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const range = (searchParams.get('range') as 'week' | 'month' | 'year') || 'month';

    // Find IB by email
    const ib = await prisma.iB.findUnique({
      where: { email: payload.email },
    });

    if (!ib) {
      // Return empty stats
      return NextResponse.json({
        totalClients: 0,
        activeClients: 0,
        dormantClients: 0,
        totalTrades: 0,
        totalCommission: 0,
        commissionByMonth: [],
        clientStatusData: [{ name: 'Active', value: 0 }, { name: 'Dormant', value: 0 }],
        tradesByMonth: [],
      });
    }

    // Get all clients
    const clients = await prisma.client.findMany({
      where: { ibId: ib.id },
    });

    const totalClients = clients.length;
    const activeClients = clients.filter(c => c.status === 'active').length;
    const dormantClients = clients.filter(c => c.status === 'dormant').length;
    const totalTrades = clients.reduce((sum, c) => sum + c.trades, 0);

    // Get commissions
    const { start, end } = getDateRange(range);
    const commissions = await prisma.commission.findMany({
      where: {
        ibId: ib.id,
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    const totalCommission = commissions.reduce((sum, c) => sum + c.amount, 0);

    // Group commissions by month
    const commissionByMonth = commissions.reduce((acc, commission) => {
      const month = commission.createdAt.toISOString().substring(0, 7); // YYYY-MM
      const existing = acc.find(item => item.month === month);
      if (existing) {
        existing.amount += commission.amount;
      } else {
        acc.push({ month, amount: commission.amount });
      }
      return acc;
    }, [] as Array<{ month: string; amount: number }>);

    // Client status data for pie chart
    const clientStatusData = [
      { name: 'Active', value: activeClients },
      { name: 'Dormant', value: dormantClients },
    ];

    // Group trades by month
    const tradesByMonth = clients.reduce((acc, client) => {
      const month = client.createdAt.toISOString().substring(0, 7);
      const existing = acc.find(item => item.month === month);
      if (existing) {
        existing.trades += client.trades;
      } else {
        acc.push({ month, trades: client.trades });
      }
      return acc;
    }, [] as Array<{ month: string; trades: number }>);

    return NextResponse.json({
      totalClients,
      activeClients,
      dormantClients,
      totalTrades,
      totalCommission,
      commissionByMonth: commissionByMonth.sort((a, b) => a.month.localeCompare(b.month)),
      clientStatusData,
      tradesByMonth: tradesByMonth.sort((a, b) => a.month.localeCompare(b.month)),
    });
  } catch (error: any) {
    console.error('Fetch dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}

