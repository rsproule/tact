import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tanks } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const allTanks = await db.query.tanks.findMany({
      where: eq(tanks.gameId, params.gameId),
    });

    const tankData = allTanks.map(tank => ({
      tankId: tank.tankId,
      owner: tank.owner,
      hearts: tank.hearts,
      aps: tank.aps,
      range: tank.range,
      position: {
        x: tank.positionQ,
        y: tank.positionR,
        z: tank.positionS,
      },
      playerName: tank.playerName,
    }));

    return NextResponse.json(tankData);
  } catch (error) {
    console.error('Error fetching tanks:', error);
    return NextResponse.json({ error: 'Failed to fetch tanks' }, { status: 500 });
  }
}