import { NextRequest, NextResponse } from 'next/server';

interface MT5Account {
  id: string;
  login: number;
  name: string;
  balance: number;
  equity: number;
  margin: number;
  marginFree: number;
  marginLevel: number;
  profit: number;
  currency: string;
  leverage: number;
  server: string;
  status: string;
}

export async function GET(req: NextRequest) {
  try {
    const connectionId = req.nextUrl.searchParams.get('connectionId');

    if (!connectionId) {
      return NextResponse.json(
        { error: 'Connection ID is required' },
        { status: 400 }
      );
    }

    // Mock account data - In production, fetch from MT5 API
    const accounts: MT5Account[] = [
      {
        id: '1',
        login: 123456,
        name: 'Demo Account 1',
        balance: 10000.50,
        equity: 10250.75,
        margin: 2450.00,
        marginFree: 7800.75,
        marginLevel: 418.23,
        profit: 250.25,
        currency: 'USD',
        leverage: 1,
        server: 'Demo-Server',
        status: 'ACTIVE'
      },
      {
        id: '2',
        login: 234567,
        name: 'Live Account 1',
        balance: 50000.00,
        equity: 52300.40,
        margin: 15000.00,
        marginFree: 37300.40,
        marginLevel: 348.67,
        profit: 2300.40,
        currency: 'USD',
        leverage: 100,
        server: 'Live-Server',
        status: 'ACTIVE'
      }
    ];

    return NextResponse.json({ accounts, total: accounts.length }, { status: 200 });
  } catch (error: any) {
    console.error('MT5 accounts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch MT5 accounts: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { connectionId, accountDetails } = body;

    // Validate required fields
    if (!connectionId || !accountDetails) {
      return NextResponse.json(
        { error: 'Connection ID and account details are required' },
        { status: 400 }
      );
    }

    // Mock account creation - In production, create account via MT5 Manager API
    const newAccount = {
      id: `account_${Date.now()}`,
      login: Math.floor(Math.random() * 900000) + 100000,
      ...accountDetails,
      createdAt: new Date().toISOString(),
      status: 'PENDING'
    };

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      account: newAccount
    }, { status: 201 });
  } catch (error: any) {
    console.error('MT5 account creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create MT5 account: ' + error.message },
      { status: 500 }
    );
  }
}

