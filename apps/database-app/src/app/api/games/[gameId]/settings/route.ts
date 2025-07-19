import { NextRequest, NextResponse } from 'next/server';
import { updateGameSettings } from '@/lib/actions/game-actions';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const { updaterId, epochSeconds } = await request.json();
    
    if (!updaterId) {
      return NextResponse.json({ error: 'Updater ID is required' }, { status: 400 });
    }

    const newSettings: any = {};
    if (epochSeconds !== undefined) {
      newSettings.epochSeconds = epochSeconds;
    }

    const result = await updateGameSettings(params.gameId, updaterId, newSettings);
    
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    console.error('Error updating game settings:', error);
    return NextResponse.json({ error: 'Failed to update game settings' }, { status: 500 });
  }
}