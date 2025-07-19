import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { games } from '@/lib/db/schema';
import { createGame } from '@/lib/actions/game-actions';

export async function GET() {
  try {
    const allGames = await db.query.games.findMany({
      orderBy: (games, { desc }) => [desc(games.createdAt)],
    });

    const gameInfos = allGames.map(game => ({
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
    }));

    return NextResponse.json(gameInfos);
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { settings, creator } = await request.json();

    if (!settings || !creator) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('API: Attempting to create game with settings:', settings);
    console.log('API: Creator:', creator);

    // Test database connection first
    try {
      await db.query.games.findFirst();
      console.log('API: Database connection test successful');
    } catch (dbError) {
      console.error('API: Database connection test failed:', dbError);
      return NextResponse.json({ 
        error: `Database connection failed: ${dbError instanceof Error ? dbError.message : 'Unknown error'}` 
      }, { status: 500 });
    }

    const result = await createGame(settings, creator);
    
    if (result.success) {
      return NextResponse.json({ gameId: result.gameId });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    console.error('Error creating game:', error);
    
    // Enhanced error logging
    if (error && typeof error === 'object') {
      console.error('Error details:', {
        name: (error as any).name,
        message: (error as any).message,
        cause: (error as any).cause,
        stack: (error as any).stack,
      });
    }
    
    return NextResponse.json({ 
      error: `Failed to create game: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 });
  }
}