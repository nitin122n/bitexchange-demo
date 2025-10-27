import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { connectionId, testType } = body;

    if (!connectionId) {
      return NextResponse.json(
        { error: 'Connection ID is required' },
        { status: 400 }
      );
    }

    // Mock test results based on test type
    let testResults: any = {};

    switch (testType) {
      case 'connection':
        testResults = {
          success: true,
          latency: 45, // ms
          apiVersion: '5.0',
          serverStatus: 'ONLINE',
          permissions: {
            trade: true,
            read: true,
            accountManagement: true
          }
        };
        break;
      
      case 'data_sync':
        testResults = {
          success: true,
          accountsSynced: 2,
          lastSyncTime: new Date().toISOString(),
          dataPoints: {
            accounts: 2,
            trades: 156,
            orders: 8
          }
        };
        break;
      
      case 'trading':
        testResults = {
          success: true,
          testOrderPlaced: true,
          testOrderExecuted: true,
          executionTime: 120, // ms
          slippage: 0.2 // pips
        };
        break;
      
      default:
        testResults = {
          success: true,
          message: 'All tests passed',
          latency: 45,
          apiVersion: '5.0',
          serverStatus: 'ONLINE'
        };
    }

    return NextResponse.json({
      success: true,
      testType: testType || 'all',
      results: testResults,
      timestamp: new Date().toISOString()
    }, { status: 200 });
  } catch (error: any) {
    console.error('MT5 test error:', error);
    return NextResponse.json(
      { error: 'Failed to test MT5 connection: ' + error.message },
      { status: 500 }
    );
  }
}

