import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword, generateToken, requireAuth } from '@/lib/auth';
import { isValidEmail, validatePassword } from '@/lib/utils';

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Demo credentials for Vercel deployment
    const demoCredentials: Record<string, {
      id: string;
      email: string;
      passwordHash: string;
      role: string;
      name: string;
    }> = {
      'owner@bit_exchange.com': {
        id: 'demo-user-1',
        email: 'owner@bit_exchange.com',
        passwordHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8QzKz2a', // password: "admin123"
        role: 'SUPER_ADMIN',
        name: 'Owner'
      },
      'admin@bit_exchange.com': {
        id: 'demo-user-2',
        email: 'admin@bit_exchange.com',
        passwordHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8QzKz2a', // password: "admin123"
        role: 'ADMIN',
        name: 'Admin'
      }
    };

    // Check if it's a demo credential - Simple password check for Vercel
    const demoUser = demoCredentials[email.toLowerCase()];
    if (demoUser) {
      // Simple password check for demo users (bypass bcrypt for Vercel)
      if (password === 'admin123') {
        const token = generateToken({
          id: demoUser.id,
          email: demoUser.email,
          role: demoUser.role as 'SUPER_ADMIN' | 'ADMIN' | 'CO_ADMIN',
          name: demoUser.name,
        });

        return NextResponse.json({
          success: true,
          token,
          user: {
            id: demoUser.id,
            email: demoUser.email,
            role: demoUser.role,
            name: demoUser.name,
          },
        });
      } else {
        return NextResponse.json(
          { error: 'Invalid password. Use: admin123' },
          { status: 401 }
        );
      }
    }

    // Try to find user in database (fallback for local development)
    try {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      // Verify password
      const isPasswordValid = await verifyPassword(password, user.passwordHash);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      // Generate JWT token
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role as 'SUPER_ADMIN' | 'ADMIN' | 'CO_ADMIN',
        name: user.name || undefined,
      });

      // Return user data and token
      return NextResponse.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        },
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      // If database is not available, return error
      return NextResponse.json(
        { error: 'Database not available. Please use demo credentials: owner@bit_exchange.com / admin123' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
