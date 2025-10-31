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
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      follows: user.follows.map(f => ({
        id: f.id,
        traderId: f.traderId,
        traderName: f.trader.name,
        multiplier: f.multiplier,
        autoCopy: f.autoCopy,
        maxSize: f.maxSize || undefined,
        riskPct: f.riskPct || undefined,
      })),
    });
  } catch (error: any) {
    console.error('Fetch follows error:', error);
    return NextResponse.json({ error: 'Failed to fetch follows' }, { status: 500 });
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
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { traderId, multiplier, autoCopy } = body;

    if (!traderId) {
      return NextResponse.json({ error: 'Trader ID is required' }, { status: 400 });
    }

    const follow = await prisma.follow.upsert({
      where: {
        followerId_traderId: {
          followerId: user.id,
          traderId,
        },
      },
      update: {
        multiplier: multiplier || 1.0,
        autoCopy: autoCopy !== undefined ? autoCopy : true,
      },
      create: {
        followerId: user.id,
        traderId,
        multiplier: multiplier || 1.0,
        autoCopy: autoCopy !== undefined ? autoCopy : true,
      },
      include: {
        trader: true,
      },
    });

    return NextResponse.json({
      success: true,
      follow: {
        id: follow.id,
        traderId: follow.traderId,
        traderName: follow.trader.name,
        multiplier: follow.multiplier,
        autoCopy: follow.autoCopy,
      },
    });
  } catch (error: any) {
    console.error('Create follow error:', error);
    return NextResponse.json({ error: 'Failed to create follow' }, { status: 500 });
  }
}

