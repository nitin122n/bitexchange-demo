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
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = (searchParams.get('range') as 'week' | 'month' | 'year') || 'month';
    const { start, end } = getDateRange(range);

    const traders = await prisma.trader.findMany({
      where: { isExpert: true },
      include: {
        signals: {
          where: {
            timestamp: { gte: start, lte: end },
            status: 'closed',
          },
          include: {
            copiedTrades: {
              where: { status: 'closed' },
            },
          },
        },
      },
    });

    const metrics = traders.map(trader => {
      const closedSignals = trader.signals.filter(s => s.status === 'closed');
      const totalTrades = closedSignals.length;
      const winningTrades = closedSignals.filter(s => {
        const copyTrades = s.copiedTrades.filter(ct => ct.status === 'closed' && ct.pnl && ct.pnl > 0);
        return copyTrades.length > 0;
      }).length;
      const losingTrades = totalTrades - winningTrades;

      // Calculate P&L from copy trades
      const totalPnL = closedSignals.reduce((sum, signal) => {
        const pnl = signal.copiedTrades.reduce((s, ct) => s + (ct.pnl || 0), 0);
        return sum + pnl;
      }, 0);

      // Calculate average trade duration
      const durations = closedSignals.map(s => {
        const copyTrades = s.copiedTrades.filter(ct => ct.status === 'closed');
        if (copyTrades.length === 0) return 0;
        const avgDuration = copyTrades.reduce((sum, ct) => {
          const duration = (new Date(ct.updatedAt).getTime() - new Date(ct.createdAt).getTime()) / (1000 * 60 * 60);
          return sum + duration;
        }, 0) / copyTrades.length;
        return avgDuration;
      }).filter(d => d > 0);
      const avgTradeDuration = durations.length > 0 
        ? durations.reduce((a, b) => a + b, 0) / durations.length 
        : 0;

      // P&L over time
      const pnlOverTime = closedSignals.map(s => {
        const pnl = s.copiedTrades.reduce((sum, ct) => sum + (ct.pnl || 0), 0);
        return {
          date: s.timestamp.toISOString().substring(0, 10),
          pnl,
        };
      });

      // Monthly performance
      const monthlyPerformance = closedSignals.reduce((acc, s) => {
        const month = s.timestamp.toISOString().substring(0, 7);
        const existing = acc.find(item => item.month === month);
        const pnl = s.copiedTrades.reduce((sum, ct) => sum + (ct.pnl || 0), 0);
        if (existing) {
          existing.pnl += pnl;
          existing.trades += 1;
        } else {
          acc.push({ month, pnl, trades: 1 });
        }
        return acc;
      }, [] as Array<{ month: string; pnl: number; trades: number }>);

      // Win rate history
      const winRateHistory = closedSignals.map((s, index) => {
        const wins = closedSignals.slice(0, index + 1).filter(sig => {
          const copyTrades = sig.copiedTrades.filter(ct => ct.status === 'closed' && ct.pnl && ct.pnl > 0);
          return copyTrades.length > 0;
        }).length;
        return {
          trade: index + 1,
          winRate: wins / (index + 1) * 100,
        };
      });

      // Average risk:reward (simplified)
      const riskRewards = closedSignals.map(s => {
        if (!s.stopLoss || !s.takeProfit) return 0;
        const risk = Math.abs(s.price - s.stopLoss);
        const reward = Math.abs(s.takeProfit - s.price);
        return reward / risk;
      }).filter(rr => rr > 0);
      const avgRiskReward = riskRewards.length > 0
        ? riskRewards.reduce((a, b) => a + b, 0) / riskRewards.length
        : 0;

      return {
        traderId: trader.id,
        traderName: trader.name,
        winRate: totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0,
        totalPnL,
        avgTradeDuration,
        avgRiskReward,
        totalTrades,
        winningTrades,
        losingTrades,
        pnlOverTime,
        monthlyPerformance: monthlyPerformance.sort((a, b) => a.month.localeCompare(b.month)),
        winRateHistory,
      };
    });

    return NextResponse.json({ metrics });
  } catch (error: any) {
    console.error('Fetch metrics error:', error);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}
