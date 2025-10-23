import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create users
  const users = [
    {
      email: 'owner@bit_exchange.com',
      password: 'OwnerPass@2025',
      role: 'SUPER_ADMIN' as const,
      name: 'Owner',
    },
    {
      email: 'admin@bit_exchange.com',
      password: 'AdminPass@2025',
      role: 'ADMIN' as const,
      name: 'Admin',
    },
    {
      email: 'coadmin@bit_exchange.com',
      password: 'CoAdminPass@2025',
      role: 'CO_ADMIN' as const,
      name: 'Co Admin',
    },
  ];

  console.log('👤 Creating users...');
  for (const userData of users) {
    const hashedPassword = await hashPassword(userData.password);
    
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        passwordHash: hashedPassword,
        role: userData.role,
        name: userData.name,
      },
    });
    
    console.log(`✅ Created user: ${userData.email} (${userData.role})`);
  }

  // Create master access users
  const masterAccessUsers = [
    {
      email: 'owner@bit_exchange.com',
      password: 'OwnerPass@2025',
      category: 'Super Admin (Full Access)',
    },
    {
      email: 'admin@bit_exchange.com',
      password: 'AdminPass@2025',
      category: 'Admin (All Access Except Creating Admins)',
    },
    {
      email: 'coadmin@bit_exchange.com',
      password: 'CoAdminPass@2025',
      category: 'Co Admin (Limited Access)',
    },
  ];

  console.log('🔐 Creating master access users...');
  for (const masterData of masterAccessUsers) {
    await prisma.masterAccess.upsert({
      where: { email: masterData.email },
      update: {},
      create: {
        email: masterData.email,
        password: masterData.password, // In production, this should be hashed
        category: masterData.category,
      },
    });
    
    console.log(`✅ Created master access: ${masterData.email} (${masterData.category})`);
  }

  // Create sample deposits
  const sampleDeposits = [
    {
      userEmail: 'xarov90498@fintehs.com',
      tradeId: 'TRADE_20241012_001',
      method: 'TRC20',
      amount: 1000,
      currency: 'USD',
      status: 'PENDING' as const,
      walletAddress: 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb',
      qrDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // Placeholder QR
    },
    {
      userEmail: 'xarov90498@fintehs.com',
      tradeId: 'TRADE_20241012_002',
      method: 'TRC20',
      amount: 11,
      currency: 'USD',
      status: 'PENDING' as const,
      walletAddress: 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb',
      qrDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // Placeholder QR
    },
    {
      userEmail: 'test@example.com',
      tradeId: 'TRADE_20241012_003',
      method: 'TRC20',
      amount: 500,
      currency: 'USD',
      status: 'APPROVED' as const,
      walletAddress: 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb',
      qrDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // Placeholder QR
    },
  ];

  console.log('💰 Creating sample deposits...');
  for (const depositData of sampleDeposits) {
    await prisma.deposit.upsert({
      where: { tradeId: depositData.tradeId },
      update: {},
      create: depositData,
    });
    
    console.log(`✅ Created deposit: ${depositData.tradeId} - ${depositData.amount} ${depositData.currency}`);
  }

  console.log('🎉 Database seed completed successfully!');
  console.log('\n📋 Demo Credentials:');
  console.log('Super Admin: owner@bit_exchange.com / OwnerPass@2025');
  console.log('Admin: admin@bit_exchange.com / AdminPass@2025');
  console.log('Co Admin: coadmin@bit_exchange.com / CoAdminPass@2025');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
