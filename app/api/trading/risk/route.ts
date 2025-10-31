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
        riskSettings: true,
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

    const riskSetting = user.riskSettings[0] || {
      maxDrawdown: 0.2,
      maxPositionPct: 0.1,
      maxConcurrentTrades: 5,
      autoCopyEnabled: true,
    };

    const traderOverrides = user.follows.map(f => ({
      traderId: f.traderId,
      traderName: f.trader.name,
      maxSize: f.maxSize || undefined,
      riskPct: f.riskPct || undefined,
      enabled: f.autoCopy,
    }));

    return NextResponse.json({
      settings: {
        maxDrawdown: riskSetting.maxDrawdown,
        leverageCap: riskSetting.leverageCap || undefined,
        maxPositionPct: riskSetting.maxPositionPct,
        maxConcurrentTrades: riskSetting.maxConcurrentTrades || undefined,
        maxDailyVolume: riskSetting.maxDailyVolume || undefined,
        autoCopyEnabled: riskSetting.autoCopyEnabled,
      },
      traderOverrides,
    });
  } catch (error: any) {
    console.error('Fetch risk settings error:', error);
    return NextResponse.json({ error: 'Failed to fetch risk settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
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
    const { settings, traderOverrides } = body;

    // Update or create risk settings
    await prisma.riskSetting.upsert({
      where: { userId: user.id },
      update: {
        maxDrawdown: settings.maxDrawdown,
        leverageCap: settings.leverageCap || null,
        maxPositionPct: settings.maxPositionPct,
        maxConcurrentTrades: settings.maxConcurrentTrades || null,
        maxDailyVolume: settings.maxDailyVolume || null,
        autoCopyEnabled: settings.autoCopyEnabled,
      },
      create: {
        userId: user.id,
        maxDrawdown: settings.maxDrawdown,
        leverageCap: settings.leverageCap || null,
        maxPositionPct: settings.maxPositionPct,
        maxConcurrentTrades: settings.maxConcurrentTrades || null,
        maxDailyVolume: settings.maxDailyVolume || null,
        autoCopyEnabled: settings.autoCopyEnabled,
      },
    });

    // Update trader overrides (update follows)
    if (traderOverrides) {
      for (const override of traderOverrides) {
        await prisma.follow.updateMany({
          where: {
            followerId: user.id,
            traderId: override.traderId,
          },
          data: {
            maxSize: override.maxSize || null,
            riskPct: override.riskPct || null,
            autoCopy: override.enabled,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Update risk settings error:', error);
    return NextResponse.json({ error: 'Failed to update risk settings' }, { status: 500 });
  }
}
