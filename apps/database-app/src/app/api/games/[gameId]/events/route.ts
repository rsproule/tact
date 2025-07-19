import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { gameEvents, players } from '@/lib/db/schema';
import { eq, gte, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const since = searchParams.get('since');
    
    let whereCondition = eq(gameEvents.gameId, params.gameId);
    
    if (since) {
      const sinceDate = new Date(parseInt(since));
      whereCondition = gte(gameEvents.timestamp, sinceDate);
    }

    const events = await db.query.gameEvents.findMany({
      where: whereCondition,
      orderBy: [desc(gameEvents.timestamp)],
      limit: 100,
    });

    // Get all unique player addresses from events
    const playerAddresses = Array.from(new Set(events.map(event => event.player).filter((addr): addr is string => !!addr)));
    
    // Fetch player names for all players involved
    const playersData = await db.query.players.findMany({
      where: eq(players.gameId, params.gameId),
    });
    
    // Create a map of player address to player name
    const playerNameMap = new Map();
    playersData.forEach(player => {
      playerNameMap.set(player.address, player.name);
    });

    const eventData = events.map(event => {
      let enrichedData = event.data;
      
      // For Give events, add receiver name to data
      if (event.type === 'Give' && event.data && typeof event.data === 'object' && 'receiver' in event.data) {
        const receiver = (event.data as any).receiver;
        enrichedData = {
          ...event.data,
          receiverName: receiver ? (playerNameMap.get(receiver) || `Player ${receiver.substring(0, 6)}`) : 'Unknown'
        };
      }

      return {
        id: event.id,
        gameId: event.gameId,
        type: event.type,
        timestamp: event.timestamp,
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
        player: event.player,
        playerName: event.player ? playerNameMap.get(event.player) : null,
        data: enrichedData,
      };
    });

    return NextResponse.json(eventData);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}