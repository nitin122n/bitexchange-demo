import { NextRequest, NextResponse } from 'next/server';

interface IntegrationConfig {
  connectionId: string;
  serverAddress: string;
  autoSync: boolean;
  syncInterval: number;
  enabledActions: {
    createAccounts: boolean;
    updateBalances: boolean;
    retrieveHistory: boolean;
    monitorPositions: boolean;
  };
  notificationSettings: {
    newAccounts: boolean;
    balanceChanges: boolean;
    positionOpened: boolean;
    positionClosed: boolean;
  };
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

    // Mock configuration data
    const config: IntegrationConfig = {
      connectionId,
      serverAddress: 'demo-server.mt5.com:443',
      autoSync: true,
      syncInterval: 300, // seconds
      enabledActions: {
        createAccounts: true,
        updateBalances: true,
        retrieveHistory: true,
        monitorPositions: true
      },
      notificationSettings: {
        newAccounts: true,
        balanceChanges: true,
        positionOpened: true,
        positionClosed: true
      }
    };

    return NextResponse.json(config, { status: 200 });
  } catch (error: any) {
    console.error('MT5 config error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch MT5 configuration: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { connectionId, config } = body;

    if (!connectionId || !config) {
      return NextResponse.json(
        { error: 'Connection ID and configuration are required' },
        { status: 400 }
      );
    }

    // Mock configuration update
    const updatedConfig = {
      ...config,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Configuration updated successfully',
      config: updatedConfig
    }, { status: 200 });
  } catch (error: any) {
    console.error('MT5 config update error:', error);
    return NextResponse.json(
      { error: 'Failed to update MT5 configuration: ' + error.message },
      { status: 500 }
    );
  }
}

