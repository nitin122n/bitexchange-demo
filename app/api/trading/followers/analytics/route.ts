import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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

    const user = await prisma.user.findUnique({
      where: { email: payload.email },
      include: {
        follows: {
          include: {
            trader: true,
          },
        },
        copyTrades: {
          include: {
            signal: {
              include: {
                trader: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const relationships = await Promise.all(
      user.follows.map(async (follow) => {
        // Get all copy trades for this trader
        const copyTrades = user.copyTrades.filter(ct => ct.traderId === follow.traderId);
        const closedTrades = copyTrades.filter(ct => ct.status === 'closed' && ct.pnl !== null);

        // Calculate metrics
        const cumulativePnL = closedTrades.reduce((sum, ct) => sum + (ct.pnl || 0), 0);
        const totalCopiedTrades = copyTrades.length;
        const winningTrades = closedTrades.filter(ct => (ct.pnl || 0) > 0).length;
        const successRate = closedTrades.length > 0 
          ? (winningTrades / closedTrades.length) * 100 
          : 0;

        // Average trade duration
        const durations = closedTrades.map(ct => {
          const duration = (new Date(ct.updatedAt).getTime() - new Date(ct.createdAt).getTime()) / (1000 * 60 * 60);
          return duration;
        });
        const avgTradeTime = durations.length > 0
          ? durations.reduce((a, b) => a + b, 0) / durations.length
          : 0;

        // Drawdown history (simplified - would need actual balance history)
        const drawdownHistory = closedTrades.map((ct, index) => {
          const cumulative = closedTrades.slice(0, index + 1).reduce((sum, t) => sum + (t.pnl || 0), 0);
          const peak = Math.max(...closedTrades.slice(0, index + 1).map(t => cumulative));
          const drawdown = peak > 0 ? ((cumulative - peak) / peak) * 100 : 0;
          return {
            date: ct.updatedAt.toISOString().substring(0, 10),
            drawdown: Math.abs(drawdown),
          };
        });

        return {
          id: follow.id,
          traderId: follow.traderId,
          traderName: follow.trader.name,
          multiplier: follow.multiplier,
          autoCopy: follow.autoCopy,
          cumulativePnL,
          successRate,
          totalCopiedTrades,
          avgTradeTime,
          drawdownHistory,
          copyTrades: copyTrades.slice(0, 20).map(ct => ({
            id: ct.id,
            copiedOrderId: ct.id.substring(0, 8),
            originalSignalId: ct.signalId.substring(0, 8),
            pnl: ct.pnl || 0,
            date: ct.createdAt.toISOString(),
          })),
        };
      })
    );

    return NextResponse.json({ relationships });
  } catch (error: any) {
    console.error('Fetch analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

