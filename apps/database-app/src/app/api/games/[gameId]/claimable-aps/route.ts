import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { games, tanks, gameEvents } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { GameState } from '@tact/game-logic';

export async function GET(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('playerId');
    
    if (!playerId) {
      return NextResponse.json({ error: 'Player ID is required' }, { status: 400 });
    }

    // Get player's tank
    const tank = await db.query.tanks.findFirst({
      where: and(eq(tanks.gameId, params.gameId), eq(tanks.owner, playerId)),
    });

    if (!tank) {
      return NextResponse.json({ error: 'Tank not found' }, { status: 404 });
    }

    // Get game
    const game = await db.query.games.findFirst({
      where: eq(games.id, params.gameId),
    });

    if (!game || game.state !== GameState.Started) {
      return NextResponse.json({ claimableAPs: 0, reason: 'Game is not active' });
    }

    if (!game.epochStart) {
      return NextResponse.json({ claimableAPs: 0, reason: 'Game has not started properly' });
    }

    // Get the last time this player claimed APs
    const lastClaimEvent = await db.query.gameEvents.findFirst({
      where: and(
        eq(gameEvents.gameId, params.gameId),
        eq(gameEvents.type, 'ClaimAPs'),
        eq(gameEvents.player, playerId)
      ),
      orderBy: [desc(gameEvents.timestamp)],
    });

    // Calculate current epoch and timing
    const nowSeconds = Math.floor(Date.now() / 1000);
    const epochStart = Math.floor(new Date(game.epochStart).getTime() / 1000);
    const epochDuration = game.epochSeconds;
    const currentEpoch = Math.floor((nowSeconds - epochStart) / epochDuration);
    const maxApsPerEpoch = game.epochMaxActionPoints;
    
    // Determine last claim time - either from last claim event or game start
    let lastClaimTime = epochStart; // Default to game start
    if (lastClaimEvent) {
      lastClaimTime = Math.floor(new Date(lastClaimEvent.timestamp).getTime() / 1000);
    }
    
    // Calculate epochs that have passed since last claim
    const epochsSinceLastClaim = Math.floor((nowSeconds - lastClaimTime) / epochDuration);
    
    // Only allow claiming if at least one epoch has passed since last claim
    if (epochsSinceLastClaim < 1) {
      const timeUntilNextEpoch = epochDuration - ((nowSeconds - lastClaimTime) % epochDuration);
      return NextResponse.json({ 
        claimableAPs: 0, 
        reason: 'Must wait for next epoch to claim more APs',
        timeUntilNextEpoch
      });
    }
    
    // Calculate APs to add based on epochs since last claim (1 AP per epoch)
    const apsToAdd = epochsSinceLastClaim; // 1 AP per epoch
    const maxApsAllowed = Math.max(200, maxApsPerEpoch * 10); // Cap total APs at 200 or 10x epoch max (whichever is higher)
    const newApTotal = Math.min(tank.aps + apsToAdd, maxApsAllowed);
    const actualApsToAdd = newApTotal - tank.aps;
    
    // If no APs to add (already at max), return 0
    if (actualApsToAdd <= 0) {
      return NextResponse.json({ 
        claimableAPs: 0, 
        reason: 'Already at maximum action points' 
      });
    }

    return NextResponse.json({ 
      claimableAPs: actualApsToAdd,
      currentEpoch,
      epochsSinceLastClaim,
      apsPerEpoch: 1 // Now giving 1 AP per epoch
    });
  } catch (error) {
    console.error('Error getting claimable APs:', error);
    return NextResponse.json({ error: 'Failed to get claimable APs' }, { status: 500 });
  }
}