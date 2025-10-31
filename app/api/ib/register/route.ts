import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, getTokenFromRequest, verifyToken } from '@/lib/auth';

function generateReferralCode(): string {
  return 'IB' + Math.random().toString(36).substring(2, 9).toUpperCase();
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, contactDetails } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if IB already exists
    const existingIB = await prisma.iB.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingIB) {
      return NextResponse.json(
        { success: false, error: 'IB with this email already exists' },
        { status: 400 }
      );
    }

    // Generate unique referral code
    let referralCode = generateReferralCode();
    let codeExists = true;
    while (codeExists) {
      const existing = await prisma.iB.findUnique({
        where: { referralCode },
      });
      if (!existing) {
        codeExists = false;
      } else {
        referralCode = generateReferralCode();
      }
    }

    // Generate referral link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const referralLink = `${baseUrl}/register?ref=${referralCode}`;

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create IB
    const ib = await prisma.iB.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: passwordHash,
        referralCode,
        referralLink,
        contactDetails: contactDetails || null,
      },
    });

    return NextResponse.json({
      success: true,
      ib: {
        id: ib.id,
        name: ib.name,
        email: ib.email,
        referralCode: ib.referralCode,
        referralLink: ib.referralLink,
      },
    });
  } catch (error: any) {
    console.error('IB registration error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to register IB' },
      { status: 500 }
    );
  }
}

