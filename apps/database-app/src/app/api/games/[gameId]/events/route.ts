import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { gameEvents } from '@/lib/db/schema';
import { eq, gte, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const since = searchParams.get('since');
    
    let query = db.query.gameEvents.findMany({
      where: eq(gameEvents.gameId, params.gameId),
      orderBy: [desc(gameEvents.timestamp)],
      limit: 100,
    });

    if (since) {
      const sinceDate = new Date(parseInt(since));
      query = db.query.gameEvents.findMany({
        where: gte(gameEvents.timestamp, sinceDate),
        orderBy: [desc(gameEvents.timestamp)],
        limit: 100,
      });
    }

    const events = await query;

    const eventData = events.map(event => ({
      id: event.id,
      gameId: event.gameId,
      type: event.type,
      timestamp: event.timestamp,
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
      player: event.player,
      data: event.data,
    }));

    return NextResponse.json(eventData);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}