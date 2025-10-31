import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

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

    // Find IB by email
    const ib = await prisma.iB.findUnique({
      where: { email: payload.email },
    });

    if (!ib) {
      return NextResponse.json({
        payouts: [],
      });
    }

    // Get all payouts for this IB
    const payouts = await prisma.payout.findMany({
      where: { ibId: ib.id },
      orderBy: { requestedAt: 'desc' },
    });

    return NextResponse.json({
      payouts: payouts.map(payout => ({
        id: payout.id,
        amount: payout.amount,
        status: payout.status,
        requestedAt: payout.requestedAt.toISOString(),
        processedAt: payout.processedAt?.toISOString(),
        notes: payout.notes,
      })),
    });
  } catch (error: any) {
    console.error('Fetch payouts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payouts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const { amount } = await request.json();

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Find IB by email
    const ib = await prisma.iB.findUnique({
      where: { email: payload.email },
    });

    if (!ib) {
      return NextResponse.json(
        { error: 'IB not found' },
        { status: 404 }
      );
    }

    // Calculate available commission (total commissions - paid payouts)
    const totalCommissions = await prisma.commission.aggregate({
      where: { ibId: ib.id },
      _sum: { amount: true },
    });

    const paidPayouts = await prisma.payout.aggregate({
      where: {
        ibId: ib.id,
        status: 'Paid',
      },
      _sum: { amount: true },
    });

    const availableCommission = (totalCommissions._sum.amount || 0) - (paidPayouts._sum.amount || 0);

    if (amount > availableCommission) {
      return NextResponse.json(
        { error: 'Insufficient commission balance' },
        { status: 400 }
      );
    }

    // Create payout request
    const payout = await prisma.payout.create({
      data: {
        ibId: ib.id,
        amount,
        status: 'Pending',
      },
    });

    return NextResponse.json({
      success: true,
      payout: {
        id: payout.id,
        amount: payout.amount,
        status: payout.status,
        requestedAt: payout.requestedAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Create payout error:', error);
    return NextResponse.json(
      { error: 'Failed to create payout request' },
      { status: 500 }
    );
  }
}

