import { NextRequest, NextResponse } from 'next/server';
import { giveToPlayer } from '@/lib/actions/game-actions';

export async function POST(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const { giverId, receiverId, hearts, aps } = await request.json();
    
    if (!giverId || !receiverId) {
      return NextResponse.json({ error: 'Giver ID and receiver ID are required' }, { status: 400 });
    }

    const result = await giveToPlayer(params.gameId, giverId, receiverId, hearts, aps);
    
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    console.error('Error giving to player:', error);
    return NextResponse.json({ error: 'Failed to give to player' }, { status: 500 });
  }
}