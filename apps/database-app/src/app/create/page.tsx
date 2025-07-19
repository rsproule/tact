'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/components/user-context';
import { GameSettings } from '@tact/game-logic';
import { validateGameSettings } from '@tact/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CreateGamePage() {
  const { userId } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    maxPlayers: 4,
    boardSize: 9,
    epochSeconds: 1800, // 30 minutes
    initHearts: 3,
    initAps: 1,
    initRange: 3,
    entryCost: '0',
    epochMaxActionPoints: 3,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const settings: GameSettings = {
        playerCount: formData.maxPlayers,
        boardSize: formData.boardSize,
        epochSeconds: formData.epochSeconds,
        revealWaitBlocks: 5, // Not used in database mode
        initHearts: formData.initHearts,
        initAps: formData.initAps,
        initRange: formData.initRange,
        entryCost: formData.entryCost,
        minPlayers: 2,
        maxPlayers: formData.maxPlayers,
        epochMaxActionPoints: formData.epochMaxActionPoints,
      };

      // Validate settings
      const validation = validateGameSettings(settings);
      if (!validation.valid) {
        setError(validation.errors.join(', '));
        return;
      }

      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settings,
          creator: userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create game');
      }

      const { gameId } = await response.json();
      router.push(`/games/${gameId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create game');
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <p className="text-lg">Loading user...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Game</h1>
        <p className="text-muted-foreground">Configure your game settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Game Settings</CardTitle>
          <CardDescription>
            Customize the rules and parameters for your game
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Max Players</Label>
                <Select 
                  value={formData.maxPlayers.toString()} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, maxPlayers: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 Players</SelectItem>
                    <SelectItem value="3">3 Players</SelectItem>
                    <SelectItem value="4">4 Players</SelectItem>
                    <SelectItem value="6">6 Players</SelectItem>
                    <SelectItem value="8">8 Players</SelectItem>
                    <SelectItem value="10">10 Players</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Board Size</Label>
                <Input
                  type="number"
                  value={formData.boardSize}
                  onChange={(e) => {
                    let value = parseInt(e.target.value) || 9;
                    // Ensure value is divisible by 3
                    if (value % 3 !== 0) {
                      value = Math.round(value / 3) * 3;
                    }
                    // Enforce min/max bounds
                    value = Math.max(3, Math.min(48, value));
                    setFormData(prev => ({ ...prev, boardSize: value }));
                  }}
                  min="3"
                  max="48"
                  step="3"
                  placeholder="Enter board size (3, 6, 9, 12...)"
                />
                <p className="text-xs text-muted-foreground">
                  Board size determines the hex grid radius. Must be divisible by 3. Larger sizes support more players.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Epoch Duration (minutes)</Label>
                <Input
                  type="number"
                  value={formData.epochSeconds / 60}
                  onChange={(e) => setFormData(prev => ({ ...prev, epochSeconds: parseInt(e.target.value) * 60 || 1800 }))}
                  min="1"
                  max="120"
                />
              </div>

              <div className="space-y-2">
                <Label>Initial Hearts</Label>
                <Input
                  type="number"
                  value={formData.initHearts}
                  onChange={(e) => setFormData(prev => ({ ...prev, initHearts: parseInt(e.target.value) || 1 }))}
                  min="1"
                  max="10"
                />
              </div>

              <div className="space-y-2">
                <Label>Initial Action Points</Label>
                <Input
                  type="number"
                  value={formData.initAps}
                  onChange={(e) => setFormData(prev => ({ ...prev, initAps: parseInt(e.target.value) || 1 }))}
                  min="1"
                  max="10"
                />
              </div>

              <div className="space-y-2">
                <Label>Initial Range</Label>
                <Input
                  type="number"
                  value={formData.initRange}
                  onChange={(e) => setFormData(prev => ({ ...prev, initRange: parseInt(e.target.value) || 1 }))}
                  min="1"
                  max="10"
                />
              </div>
            </div>

            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <p className="text-red-800 text-sm">{error}</p>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/games')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Game'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}