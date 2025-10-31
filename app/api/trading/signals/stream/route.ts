import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const token = getTokenFromRequest(request);
        if (!token) {
          controller.enqueue(encoder.encode('data: {"error":"Authentication required"}\n\n'));
          controller.close();
          return;
        }

        const payload = verifyToken(token);
        if (!payload) {
          controller.enqueue(encoder.encode('data: {"error":"Invalid token"}\n\n'));
          controller.close();
          return;
        }

        // Send initial connection message
        controller.enqueue(encoder.encode('data: {"type":"connected"}\n\n'));

        // Poll for new signals every 2 seconds
        let lastSignalId = '';
        const interval = setInterval(async () => {
          try {
            const signals = await prisma.signal.findMany({
              where: {
                status: 'open',
                timestamp: {
                  gte: new Date(Date.now() - 60000), // Last minute
                },
              },
              include: {
                trader: true,
              },
              orderBy: { timestamp: 'desc' },
              take: 1,
            });

            if (signals.length > 0 && signals[0].id !== lastSignalId) {
              const signal = signals[0];
              const signalData = JSON.stringify({
                id: signal.id,
                traderId: signal.traderId,
                traderName: signal.trader.name,
                symbol: signal.symbol,
                side: signal.side,
                price: signal.price,
                size: signal.size,
                stopLoss: signal.stopLoss,
                takeProfit: signal.takeProfit,
                status: signal.status,
                timestamp: signal.timestamp.toISOString(),
              });

              controller.enqueue(encoder.encode(`data: ${signalData}\n\n`));
              lastSignalId = signal.id;
            }

            // Send heartbeat
            controller.enqueue(encoder.encode('data: {"type":"heartbeat"}\n\n'));
          } catch (error) {
            console.error('Stream error:', error);
            clearInterval(interval);
            controller.close();
          }
        }, 2000);

        // Handle client disconnect
        const abortController = new AbortController();
        request.signal.addEventListener('abort', () => {
          clearInterval(interval);
          abortController.abort();
          controller.close();
        });
      } catch (error) {
        console.error('Stream setup error:', error);
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
