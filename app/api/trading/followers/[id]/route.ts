import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const follow = await prisma.follow.findFirst({
      where: {
        id: params.id,
        followerId: user.id,
      },
    });

    if (!follow) {
      return NextResponse.json({ error: 'Follow relationship not found' }, { status: 404 });
    }

    const body = await request.json();
    const updateData: any = {};
    if (body.multiplier !== undefined) updateData.multiplier = body.multiplier;
    if (body.autoCopy !== undefined) updateData.autoCopy = body.autoCopy;
    if (body.maxSize !== undefined) updateData.maxSize = body.maxSize || null;
    if (body.riskPct !== undefined) updateData.riskPct = body.riskPct || null;

    const updated = await prisma.follow.update({
      where: { id: params.id },
      data: updateData,
      include: {
        trader: true,
      },
    });

    return NextResponse.json({
      success: true,
      follow: {
        id: updated.id,
        traderId: updated.traderId,
        traderName: updated.trader.name,
        multiplier: updated.multiplier,
        autoCopy: updated.autoCopy,
      },
    });
  } catch (error: any) {
    console.error('Update follow error:', error);
    return NextResponse.json({ error: 'Failed to update follow' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const follow = await prisma.follow.findFirst({
      where: {
        id: params.id,
        followerId: user.id,
      },
    });

    if (!follow) {
      return NextResponse.json({ error: 'Follow relationship not found' }, { status: 404 });
    }

    await prisma.follow.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete follow error:', error);
    return NextResponse.json({ error: 'Failed to unfollow' }, { status: 500 });
  }
}

