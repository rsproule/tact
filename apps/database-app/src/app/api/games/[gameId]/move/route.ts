import { NextRequest, NextResponse } from 'next/server';
import { movePlayer } from '@/lib/actions/game-actions';

export async function POST(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const { playerId, targetPosition } = await request.json();
    
    if (!playerId || !targetPosition) {
      return NextResponse.json({ error: 'Player ID and target position are required' }, { status: 400 });
    }

    const result = await movePlayer(params.gameId, playerId, targetPosition);
    
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    console.error('Error moving player:', error);
    return NextResponse.json({ error: 'Failed to move player' }, { status: 500 });
  }
}