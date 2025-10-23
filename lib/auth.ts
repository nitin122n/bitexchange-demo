import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

export interface User {
  id: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'CO_ADMIN';
  name?: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

// JWT Secret - in production, use a strong secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against its hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(user: User): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '24h',
  });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Extract token from request headers
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

/**
 * Role-based access control permissions
 */
export const PERMISSIONS = {
  SUPER_ADMIN: {
    canCreateUsers: true,
    canDeleteUsers: true,
    canManageMasterAccess: true,
    canApproveDeposits: true,
    canViewAllData: true,
    canExportData: true,
  },
  ADMIN: {
    canCreateUsers: false,
    canDeleteUsers: false,
    canManageMasterAccess: false,
    canApproveDeposits: true,
    canViewAllData: true,
    canExportData: true,
  },
  CO_ADMIN: {
    canCreateUsers: false,
    canDeleteUsers: false,
    canManageMasterAccess: false,
    canApproveDeposits: false,
    canViewAllData: false,
    canExportData: false,
  },
} as const;

/**
 * Check if user has permission for a specific action
 */
export function hasPermission(userRole: string, permission: keyof typeof PERMISSIONS.SUPER_ADMIN): boolean {
  const rolePermissions = PERMISSIONS[userRole as keyof typeof PERMISSIONS];
  return rolePermissions ? rolePermissions[permission] : false;
}

/**
 * Middleware to check authentication
 */
export function requireAuth(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Add user info to request
    (request as any).user = payload;
    return handler(request, ...args);
  };
}

/**
 * Middleware to check specific permissions
 */
export function requirePermission(permission: keyof typeof PERMISSIONS.SUPER_ADMIN) {
  return function(handler: Function) {
    return async (request: NextRequest, ...args: any[]) => {
      const token = getTokenFromRequest(request);
      
      if (!token) {
        return new Response(JSON.stringify({ error: 'Authentication required' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const payload = verifyToken(token);
      if (!payload) {
        return new Response(JSON.stringify({ error: 'Invalid token' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (!hasPermission(payload.role, permission)) {
        return new Response(JSON.stringify({ error: 'Insufficient permissions' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      (request as any).user = payload;
      return handler(request, ...args);
    };
  };
}
