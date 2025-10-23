import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requirePermission } from '@/lib/auth';
import { isValidEmail, validatePassword } from '@/lib/utils';
import { hashPassword } from '@/lib/auth';

/**
 * GET /api/master-access
 * Get all master access users
 */
export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const masterAccessUsers = await prisma.masterAccess.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: masterAccessUsers,
    });
  } catch (error) {
    console.error('Master access fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch master access users' },
      { status: 500 }
    );
  }
});

/**
 * POST /api/master-access
 * Create new master access user (Super Admin only)
 */
export const POST = requirePermission('canManageMasterAccess')(async (request: NextRequest) => {
  try {
    const { email, password, category } = await request.json();

    // Validate input
    if (!email || !password || !category) {
      return NextResponse.json(
        { error: 'Email, password, and category are required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: 'Password validation failed', details: passwordValidation.errors },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.masterAccess.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Master access user with this email already exists' },
        { status: 409 }
      );
    }

    // Create master access user
    const masterAccess = await prisma.masterAccess.create({
      data: {
        email: email.toLowerCase(),
        password, // In production, this should be hashed
        category,
      },
    });

    return NextResponse.json({
      success: true,
      data: masterAccess,
    });
  } catch (error) {
    console.error('Master access creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create master access user' },
      { status: 500 }
    );
  }
});

/**
 * DELETE /api/master-access/:id
 * Delete master access user (Super Admin only)
 */
export const DELETE = requirePermission('canManageMasterAccess')(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;

    // Check if master access user exists
    const masterAccess = await prisma.masterAccess.findUnique({
      where: { id },
    });

    if (!masterAccess) {
      return NextResponse.json(
        { error: 'Master access user not found' },
        { status: 404 }
      );
    }

    // Delete master access user
    await prisma.masterAccess.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Master access user deleted successfully',
    });
  } catch (error) {
    console.error('Master access deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete master access user' },
      { status: 500 }
    );
  }
});
