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
        commissions: [],
      });
    }

    // Get all commissions for this IB
    const commissions = await prisma.commission.findMany({
      where: { ibId: ib.id },
      include: {
        client: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      commissions: commissions.map(commission => ({
        id: commission.id,
        clientId: commission.clientId,
        clientName: commission.client.name,
        amount: commission.amount,
        type: commission.type,
        description: commission.description,
        createdAt: commission.createdAt.toISOString(),
      })),
    });
  } catch (error: any) {
    console.error('Fetch commissions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch commissions' },
      { status: 500 }
    );
  }
}

