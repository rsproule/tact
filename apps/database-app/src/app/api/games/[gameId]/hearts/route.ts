import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hearts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const allHearts = await db.query.hearts.findMany({
      where: eq(hearts.gameId, params.gameId),
    });

    const heartData = allHearts.map(heart => ({
      position: {
        x: heart.positionQ,
        y: heart.positionR,
        z: heart.positionS,
      },
      active: heart.active,
    }));

    return NextResponse.json(heartData);
  } catch (error) {
    console.error('Error fetching hearts:', error);
    return NextResponse.json({ error: 'Failed to fetch hearts' }, { status: 500 });
  }
}