import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requirePermission } from '@/lib/auth';
import { generateDemoTRC20Address, generateTradeId, isValidEmail } from '@/lib/utils';
import QRCode from 'qrcode';

/**
 * POST /api/payment/trc20/generate
 * Generate TRC20 wallet address and QR code for deposit
 */
export const POST = requireAuth(async (request: NextRequest) => {
  try {
    const { amount, userEmail } = await request.json();

    // Validate input
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid amount is required' },
        { status: 400 }
      );
    }

    if (!userEmail || !isValidEmail(userEmail)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Generate demo TRC20 wallet address
    const walletAddress = generateDemoTRC20Address();
    const tradeId = generateTradeId();

    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(walletAddress, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    // Save deposit record to database
    const deposit = await prisma.deposit.create({
      data: {
        userEmail: userEmail.toLowerCase(),
        tradeId,
        method: 'TRC20',
        amount: parseFloat(amount),
        currency: 'USD',
        status: 'PENDING',
        walletAddress,
        qrDataUrl,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        tradeId: deposit.tradeId,
        walletAddress: deposit.walletAddress,
        qrCode: deposit.qrDataUrl,
        amount: deposit.amount,
        currency: deposit.currency,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });
  } catch (error) {
    console.error('TRC20 generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate TRC20 wallet' },
      { status: 500 }
    );
  }
});

/**
 * GET /api/payment/trc20/status/:tradeId
 * Check deposit status by trade ID
 */
export const GET = requireAuth(async (request: NextRequest, { params }: { params: { tradeId: string } }) => {
  try {
    const { tradeId } = params;

    const deposit = await prisma.deposit.findUnique({
      where: { tradeId },
    });

    if (!deposit) {
      return NextResponse.json(
        { error: 'Deposit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        tradeId: deposit.tradeId,
        status: deposit.status,
        amount: deposit.amount,
        currency: deposit.currency,
        createdAt: deposit.createdAt,
        walletAddress: deposit.walletAddress,
      },
    });
  } catch (error) {
    console.error('Deposit status error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deposit status' },
      { status: 500 }
    );
  }
});
