import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { games } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const game = await db.query.games.findFirst({
      where: eq(games.id, params.gameId),
    });

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    const gameInfo = {
      gameId: game.id,
      address: game.address,
      state: game.state,
      settings: {
        playerCount: game.playerCount,
        boardSize: game.boardSize,
        epochSeconds: game.epochSeconds,
        revealWaitBlocks: game.revealWaitBlocks,
        initHearts: game.initHearts,
        initAps: game.initAps,
        initRange: game.initRange,
        entryCost: game.entryCost,
        minPlayers: game.minPlayers,
        maxPlayers: game.maxPlayers,
        epochMaxActionPoints: game.epochMaxActionPoints,
      },
      playersCount: game.playersCount,
      prizePool: game.prizePool,
      epochStart: game.epochStart ? Math.floor(game.epochStart.getTime() / 1000) : 0,
      owner: game.owner,
      createdAt: Math.floor(game.createdAt.getTime() / 1000),
    };

    return NextResponse.json(gameInfo);
  } catch (error) {
    console.error('Error fetching game:', error);
    return NextResponse.json({ error: 'Failed to fetch game' }, { status: 500 });
  }
}