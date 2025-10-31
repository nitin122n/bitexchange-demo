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

    const { searchParams } = new URL(request.url);
    const traderId = searchParams.get('traderId');
    const symbol = searchParams.get('symbol');
    const status = searchParams.get('status');

    const where: any = {};
    if (traderId) where.traderId = traderId;
    if (symbol) where.symbol = symbol;
    if (status) where.status = status;

    const signals = await prisma.signal.findMany({
      where,
      include: {
        trader: true,
      },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });

    return NextResponse.json({
      signals: signals.map(s => ({
        id: s.id,
        traderId: s.traderId,
        traderName: s.trader.name,
        symbol: s.symbol,
        side: s.side,
        price: s.price,
        size: s.size,
        stopLoss: s.stopLoss,
        takeProfit: s.takeProfit,
        status: s.status,
        timestamp: s.timestamp.toISOString(),
      })),
    });
  } catch (error: any) {
    console.error('Fetch signals error:', error);
    return NextResponse.json({ error: 'Failed to fetch signals' }, { status: 500 });
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

    // Check if user is an expert trader
    const trader = await prisma.trader.findUnique({
      where: { email: payload.email },
    });

    if (!trader || !trader.isExpert || !trader.verified) {
      return NextResponse.json(
        { error: 'Only verified expert traders can publish signals' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { symbol, side, price, size, stopLoss, takeProfit } = body;

    if (!symbol || !side || !price || !size) {
      return NextResponse.json(
        { error: 'Missing required fields: symbol, side, price, size' },
        { status: 400 }
      );
    }

    // Rate limiting check (max 10 signals per minute)
    const recentSignals = await prisma.signal.count({
      where: {
        traderId: trader.id,
        timestamp: {
          gte: new Date(Date.now() - 60000),
        },
      },
    });

    if (recentSignals >= 10) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before publishing another signal.' },
        { status: 429 }
      );
    }

    const signal = await prisma.signal.create({
      data: {
        traderId: trader.id,
        symbol,
        side,
        price,
        size,
        stopLoss: stopLoss || null,
        takeProfit: takeProfit || null,
        status: 'open',
      },
      include: {
        trader: true,
      },
    });

    return NextResponse.json({
      success: true,
      signal: {
        id: signal.id,
        traderId: signal.traderId,
        traderName: signal.trader.name,
        symbol: signal.symbol,
        side: signal.side,
        price: signal.price,
        size: signal.size,
        stopLoss: signal.stopLoss,
        takeProfit: signal.takeProfit,
        status: signal.status,
        timestamp: signal.timestamp.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Create signal error:', error);
    return NextResponse.json({ error: 'Failed to create signal' }, { status: 500 });
  }
}
