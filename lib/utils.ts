import { randomBytes } from 'crypto';

/**
 * Generate a demo TRC20 wallet address
 * WARNING: This is for demo purposes only! 
 * Do not use this for real blockchain transactions.
 * In production, use proper wallet generation libraries.
 */
export function generateDemoTRC20Address(): string {
  // Generate random bytes
  const randomBytesBuffer = randomBytes(20);
  
  // Convert to hex and take first 20 characters
  const hexString = randomBytesBuffer.toString('hex').substring(0, 20);
  
  // TRC20 addresses start with 'T' and are typically 34 characters
  // We'll pad with zeros to make it look realistic
  const paddedHex = hexString.padEnd(32, '0');
  
  // Create a base58-like encoding for demo purposes
  const base58Chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = 'T';
  
  // Convert hex to base58-like string
  for (let i = 0; i < paddedHex.length; i += 2) {
    const byte = parseInt(paddedHex.substr(i, 2), 16);
    result += base58Chars[byte % base58Chars.length];
  }
  
  // Ensure it's exactly 34 characters (T + 33 more)
  return result.substring(0, 34);
}

/**
 * Generate a unique trade ID for deposits
 */
export function generateTradeId(): string {
  const timestamp = Date.now().toString(36);
  const random = randomBytes(4).toString('hex');
  return `TRADE_${timestamp}_${random}`.toUpperCase();
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Mask password for display (show first 2 and last 2 characters)
 */
export function maskPassword(password: string): string {
  if (password.length <= 4) {
    return '*'.repeat(password.length);
  }
  return password.substring(0, 2) + '*'.repeat(password.length - 4) + password.substring(password.length - 2);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
