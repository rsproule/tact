import { NextRequest, NextResponse } from 'next/server';
import { claimActionPoints } from '@/lib/actions/game-actions';

export async function POST(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const { playerId } = await request.json();
    
    if (!playerId) {
      return NextResponse.json({ error: 'Player ID is required' }, { status: 400 });
    }

    const result = await claimActionPoints(params.gameId, playerId);
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        apsClaimed: result.apsClaimed,
        newTotal: result.newTotal
      });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    console.error('Error claiming action points:', error);
    return NextResponse.json({ error: 'Failed to claim action points' }, { status: 500 });
  }
}