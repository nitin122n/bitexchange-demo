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
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const copyTrades = await prisma.copyTrade.findMany({
      where: { followerId: user.id },
      include: {
        signal: {
          include: {
            trader: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      copyTrades: copyTrades.map(ct => ({
        id: ct.id,
        signalId: ct.signalId,
        traderId: ct.traderId,
        traderName: ct.signal.trader.name,
        symbol: ct.signal.symbol,
        amount: ct.amount,
        executedPrice: ct.executedPrice,
        pnl: ct.pnl,
        status: ct.status,
        createdAt: ct.createdAt.toISOString(),
      })),
    });
  } catch (error: any) {
    console.error('Fetch copy trades error:', error);
    return NextResponse.json({ error: 'Failed to fetch copy trades' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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
        riskSettings: true,
        follows: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { signalId, multiplier, riskPct } = body;

    const signal = await prisma.signal.findUnique({
      where: { id: signalId },
      include: { trader: true },
    });

    if (!signal || signal.status !== 'open') {
      return NextResponse.json({ error: 'Signal not found or not open' }, { status: 400 });
    }

    // Check if user follows this trader
    const follow = user.follows.find(f => f.traderId === signal.traderId);
    if (!follow) {
      return NextResponse.json({ error: 'You are not following this trader' }, { status: 403 });
    }

    // Calculate copy amount based on multiplier and risk
    const copyMultiplier = multiplier || follow.multiplier || 1.0;
    const baseAmount = signal.size * copyMultiplier;

    // Apply risk settings
    const riskSettings = user.riskSettings[0];
    if (riskSettings) {
      // Check max concurrent trades
      const openTrades = await prisma.copyTrade.count({
        where: {
          followerId: user.id,
          status: 'open',
        },
      });

      if (riskSettings.maxConcurrentTrades && openTrades >= riskSettings.maxConcurrentTrades) {
        return NextResponse.json({ error: 'Maximum concurrent trades limit reached' }, { status: 400 });
      }

      // Check max position size
      if (riskSettings.maxPositionPct) {
        // In real implementation, get user's account balance
        // For demo, we'll just use the base amount
      }
    }

    // Create copy trade
    const copyTrade = await prisma.copyTrade.create({
      data: {
        followerId: user.id,
        signalId: signal.id,
        traderId: signal.traderId,
        amount: baseAmount,
        executedPrice: signal.price,
        status: 'open',
      },
      include: {
        signal: {
          include: {
            trader: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      copyTrade: {
        id: copyTrade.id,
        signalId: copyTrade.signalId,
        traderId: copyTrade.traderId,
        traderName: copyTrade.signal.trader.name,
        symbol: copyTrade.signal.symbol,
        amount: copyTrade.amount,
        executedPrice: copyTrade.executedPrice,
        status: copyTrade.status,
        createdAt: copyTrade.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Create copy trade error:', error);
    return NextResponse.json({ error: 'Failed to create copy trade' }, { status: 500 });
  }
}
