import { NextRequest, NextResponse } from 'next/server';
import { startGame } from '@/lib/actions/game-actions';

export async function POST(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const result = await startGame(params.gameId);
    
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    console.error('Error starting game:', error);
    return NextResponse.json({ error: 'Failed to start game' }, { status: 500 });
  }
}