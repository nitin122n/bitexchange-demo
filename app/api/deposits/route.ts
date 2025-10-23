import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

/**
 * GET /api/deposits
 * Get all deposits with optional filtering
 */
export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const whereClause = status ? { status: status.toUpperCase() } : {};

    const deposits = await prisma.deposit.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    // Get summary statistics
    const totalDeposits = await prisma.deposit.count();
    const pendingDeposits = await prisma.deposit.count({ where: { status: 'PENDING' } });
    const approvedDeposits = await prisma.deposit.count({ where: { status: 'APPROVED' } });
    const totalAmount = await prisma.deposit.aggregate({
      _sum: { amount: true },
      where: { status: 'PENDING' },
    });

    return NextResponse.json({
      success: true,
      data: deposits,
      summary: {
        totalDeposits,
        pendingDeposits,
        approvedDeposits,
        totalPendingAmount: totalAmount._sum.amount || 0,
      },
    });
  } catch (error) {
    console.error('Deposits fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deposits' },
      { status: 500 }
    );
  }
});

/**
 * PUT /api/deposits/:id/status
 * Update deposit status (Admin/Super Admin only)
 */
export const PUT = requireAuth(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;
    const { status } = await request.json();

    if (!status || !['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid status is required' },
        { status: 400 }
      );
    }

    const deposit = await prisma.deposit.findUnique({
      where: { id },
    });

    if (!deposit) {
      return NextResponse.json(
        { error: 'Deposit not found' },
        { status: 404 }
      );
    }

    const updatedDeposit = await prisma.deposit.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      data: updatedDeposit,
    });
  } catch (error) {
    console.error('Deposit status update error:', error);
    return NextResponse.json(
      { error: 'Failed to update deposit status' },
      { status: 500 }
    );
  }
});
