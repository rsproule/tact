import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { players } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const gamePlayers = await db.query.players.findMany({
      where: eq(players.gameId, params.gameId),
    });

    const playerInfos = gamePlayers.map(player => ({
      address: player.address,
      name: player.name,
      tankId: player.tankId,
      isAlive: player.isAlive,
      joinedAt: Math.floor(player.joinedAt.getTime() / 1000),
    }));

    return NextResponse.json(playerInfos);
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 });
  }
}