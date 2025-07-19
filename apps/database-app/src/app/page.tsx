'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/components/user-context';
import { GameInfo } from '@tact/game-logic';
import { formatGameState, formatPlayerCount } from '@tact/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
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
      <div className="pt-16 container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <p className="text-lg text-white">Loading user...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-16 container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <p className="text-lg text-white">Loading games...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6 text-center">
            <p className="text-lg text-red-400 mb-4">Error: {error}</p>
            <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-900">
      {/* Logo Header */}
      <div className="text-center py-8 border-b border-gray-700">
        <h1 className="text-4xl font-bold text-white">Tact</h1>
        <p className="text-gray-400 text-sm mt-1">An onchain strategy game</p>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-white">Available Games</h2>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/create">Create New Game</Link>
          </Button>
        </div>

        {games.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6 text-center">
              <p className="text-lg text-gray-400 mb-4">No games available</p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/create">Create the First Game</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="block lg:hidden">
              <div className="grid gap-4">
                {games.map((game) => (
                  <Card key={game.gameId} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl text-white">
                            Game {game.gameId.substring(0, 8)}
                          </CardTitle>
                          <CardDescription className="mt-2 text-gray-400">
                            <div className="space-y-1">
                              <p>Status: <span className="font-medium text-gray-300">{formatGameState(game.state)}</span></p>
                              <p>Players: <span className="font-medium text-gray-300">{formatPlayerCount(game.playersCount, game.settings.maxPlayers)}</span></p>
                              <p>Board Size: <span className="font-medium text-gray-300">{game.settings.boardSize}</span></p>
                              <p>Created: <span className="font-medium text-gray-300">{new Date(game.createdAt * 1000).toLocaleDateString()}</span></p>
                            </div>
                          </CardDescription>
                        </div>
                        <Button asChild className="bg-blue-600 hover:bg-blue-700">
                          <Link href={`/games/${game.gameId}`}>
                            {game.state === 0 ? 'Join' : 'View'}
                          </Link>
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Hearts</p>
                          <p className="font-medium text-gray-300">{game.settings.initHearts}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Action Points</p>
                          <p className="font-medium text-gray-300">{game.settings.initAps}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Initial Range</p>
                          <p className="font-medium text-gray-300">{game.settings.initRange}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Epoch Duration</p>
                          <p className="font-medium text-gray-300">{Math.floor(game.settings.epochSeconds / 60)}m</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-white text-sm">Game ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-white text-sm">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-white text-sm">Players</th>
                      <th className="text-left py-3 px-4 font-semibold text-white text-sm">Board</th>
                      <th className="text-left py-3 px-4 font-semibold text-white text-sm">Hearts</th>
                      <th className="text-left py-3 px-4 font-semibold text-white text-sm">APs</th>
                      <th className="text-left py-3 px-4 font-semibold text-white text-sm">Range</th>
                      <th className="text-left py-3 px-4 font-semibold text-white text-sm">Epoch</th>
                      <th className="text-left py-3 px-4 font-semibold text-white text-sm">Created</th>
                      <th className="text-left py-3 px-4 font-semibold text-white text-sm">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {games.map((game, index) => (
                      <tr key={game.gameId} className={`border-t border-gray-700 hover:bg-gray-750 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-850'}`}>
                        <td className="py-2 px-4">
                          <code className="text-gray-300 text-sm font-mono">{game.gameId.substring(0, 8)}</code>
                        </td>
                        <td className="py-2 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            game.state === 0 ? 'bg-blue-900 text-blue-300' : 
                            game.state === 1 ? 'bg-green-900 text-green-300' : 
                            'bg-gray-700 text-gray-300'
                          }`}>
                            {formatGameState(game.state)}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-gray-300 text-sm">
                          {formatPlayerCount(game.playersCount, game.settings.maxPlayers)}
                        </td>
                        <td className="py-2 px-4 text-gray-300 text-sm">{game.settings.boardSize}</td>
                        <td className="py-2 px-4 text-gray-300 text-sm">{game.settings.initHearts}</td>
                        <td className="py-2 px-4 text-gray-300 text-sm">{game.settings.initAps}</td>
                        <td className="py-2 px-4 text-gray-300 text-sm">{game.settings.initRange}</td>
                        <td className="py-2 px-4 text-gray-300 text-sm">{Math.floor(game.settings.epochSeconds / 60)}m</td>
                        <td className="py-2 px-4 text-gray-300 text-sm">
                          {new Date(game.createdAt * 1000).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4">
                          <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs h-7">
                            <Link href={`/games/${game.gameId}`}>
                              {game.state === 0 ? 'Join' : 'View'}
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}