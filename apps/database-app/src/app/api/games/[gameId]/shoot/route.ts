import { NextRequest, NextResponse } from 'next/server';
import { shootPlayer } from '@/lib/actions/game-actions';

export async function POST(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const { shooterId, targetId } = await request.json();
    
    if (!shooterId || !targetId) {
      return NextResponse.json({ error: 'Shooter ID and target ID are required' }, { status: 400 });
    }

    const result = await shootPlayer(params.gameId, shooterId, targetId);
    
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    console.error('Error shooting player:', error);
    return NextResponse.json({ error: 'Failed to shoot player' }, { status: 500 });
  }
}