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

    // Find IB by email (assuming IBs login with their email)
    const ib = await prisma.iB.findUnique({
      where: { email: payload.email },
    });

    if (!ib) {
      // For demo: return mock data or return empty
      // In production, you'd want separate IB authentication
      return NextResponse.json({
        clients: [],
      });
    }

    // Get all clients for this IB
    const clients = await prisma.client.findMany({
      where: { ibId: ib.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      clients: clients.map(client => ({
        id: client.id,
        name: client.name,
        email: client.email,
        status: client.status,
        trades: client.trades,
        deposits: client.deposits,
        createdAt: client.createdAt.toISOString(),
      })),
    });
  } catch (error: any) {
    console.error('Fetch clients error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

