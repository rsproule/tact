'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/components/user-context';
import { GameInfo } from '@tact/game-logic';
import { formatGameState, formatPlayerCount } from '@tact/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function GamesPage() {
  const { userId } = useUser();
  const [games, setGames] = useState<GameInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchGames = async () => {
      try {
        const response = await fetch('/api/games');
        if (!response.ok) {
          throw new Error('Failed to fetch games');
        }
        const gameData = await response.json();
        setGames(gameData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch games');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
    const interval = setInterval(fetchGames, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <p className="text-lg">Loading user...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <p className="text-lg">Loading games...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-lg text-red-600 mb-4">Error: {error}</p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Available Games</h1>
        <Button asChild>
          <Link href="/create">Create New Game</Link>
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            Your Player ID: <code className="font-mono">{userId}</code>
          </p>
        </CardContent>
      </Card>

      {games.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-lg text-muted-foreground mb-4">No games available</p>
            <Button asChild>
              <Link href="/create">Create the First Game</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {games.map((game) => (
            <Card key={game.gameId}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">
                      Game {game.gameId.substring(0, 8)}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      <div className="space-y-1">
                        <p>Status: <span className="font-medium">{formatGameState(game.state)}</span></p>
                        <p>Players: <span className="font-medium">{formatPlayerCount(game.playersCount, game.settings.maxPlayers)}</span></p>
                        <p>Board Size: <span className="font-medium">{game.settings.boardSize}</span></p>
                        <p>Created: <span className="font-medium">{new Date(game.createdAt * 1000).toLocaleDateString()}</span></p>
                      </div>
                    </CardDescription>
                  </div>
                  <Button asChild>
                    <Link href={`/games/${game.gameId}`}>
                      {game.state === 0 ? 'Join Game' : 'View Game'}
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Hearts</p>
                    <p className="font-medium">{game.settings.initHearts}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Action Points</p>
                    <p className="font-medium">{game.settings.initAps}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Initial Range</p>
                    <p className="font-medium">{game.settings.initRange}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Epoch Duration</p>
                    <p className="font-medium">{Math.floor(game.settings.epochSeconds / 60)}m</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}