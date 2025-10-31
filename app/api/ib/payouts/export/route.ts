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

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';

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

    // Get all payouts
    const payouts = await prisma.payout.findMany({
      where: { ibId: ib.id },
      orderBy: { requestedAt: 'desc' },
    });

    if (format === 'csv') {
      // Generate CSV
      const headers = ['ID', 'Amount', 'Status', 'Requested At', 'Processed At', 'Notes'];
      const rows = payouts.map(p => [
        p.id,
        p.amount.toString(),
        p.status,
        p.requestedAt.toISOString(),
        p.processedAt?.toISOString() || '',
        p.notes || '',
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="payout-history.csv"',
        },
      });
    } else if (format === 'pdf') {
      // For PDF, we'd need a library like pdfkit or puppeteer
      // For now, return JSON (in production, generate actual PDF)
      return NextResponse.json({
        message: 'PDF export not implemented. Please use CSV export.',
        payouts: payouts.map(p => ({
          id: p.id,
          amount: p.amount,
          status: p.status,
          requestedAt: p.requestedAt.toISOString(),
          processedAt: p.processedAt?.toISOString(),
          notes: p.notes,
        })),
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid format. Use csv or pdf' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Export payouts error:', error);
    return NextResponse.json(
      { error: 'Failed to export payouts' },
      { status: 500 }
    );
  }
}

