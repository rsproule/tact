import { NextRequest, NextResponse } from 'next/server';
import { upgradePlayer } from '@/lib/actions/game-actions';

export async function POST(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const { playerId } = await request.json();
    
    if (!playerId) {
      return NextResponse.json({ error: 'Player ID is required' }, { status: 400 });
    }

    const result = await upgradePlayer(params.gameId, playerId);
    
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    console.error('Error upgrading player:', error);
    return NextResponse.json({ error: 'Failed to upgrade player' }, { status: 500 });
  }
}