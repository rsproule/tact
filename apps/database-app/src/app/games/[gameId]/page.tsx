'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@/components/user-context';
import { GameInfo, GameState } from '@tact/game-logic';
import { joinGame, startGame } from '@/lib/actions/game-actions';
import { HexGameBoard } from '@tact/shared-ui';
import { TactProvider } from '@tact/providers';
import { createDatabaseProviderClient } from '@/lib/providers/database-provider-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function GamePage() {
  const params = useParams();
  const gameId = params.gameId as string;
  const { userId } = useUser();
  
  const [game, setGame] = useState<GameInfo | null>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [joining, setJoining] = useState(false);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (!userId || !gameId) return;

    const fetchGameData = async () => {
      try {
        const [gameResponse, playersResponse] = await Promise.all([
          fetch(`/api/games/${gameId}`),
          fetch(`/api/games/${gameId}/players`)
        ]);

        if (!gameResponse.ok) {
          throw new Error('Game not found');
        }

        const gameData = await gameResponse.json();
        setGame(gameData);

        if (playersResponse.ok) {
          const playersData = await playersResponse.json();
          setPlayers(playersData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load game');
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
    const interval = setInterval(fetchGameData, 5000);
    return () => clearInterval(interval);
  }, [userId, gameId]);

  const handleJoinGame = async () => {
    if (!userId || !playerName.trim()) return;

    setJoining(true);
    try {
      const result = await joinGame(gameId, userId, playerName.trim());
      if (result.success) {
        setPlayerName('');
        window.location.reload();
      } else {
        setError(result.error || 'Failed to join game');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join game');
    } finally {
      setJoining(false);
    }
  };

  const handleStartGame = async () => {
    if (!userId) return;

    setStarting(true);
    try {
      const result = await startGame(gameId);
      if (result.success) {
        window.location.reload();
      } else {
        setError(result.error || 'Failed to start game');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start game');
    } finally {
      setStarting(false);
    }
  };

  if (!userId || loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen">
        <p className="text-lg text-red-600 mb-4">Error: {error || 'Game not found'}</p>
        <Button asChild>
          <a href="/games">Back to Games</a>
        </Button>
      </div>
    );
  }

  const isPlayerInGame = players.some(player => player.address === userId);

  // If player has joined, show the game board (regardless of game state)
  if (isPlayerInGame) {
    return (
      <TactProvider provider={createDatabaseProviderClient(userId)}>
        <HexGameBoard
          gameId={gameId}
          boardSize={game.settings.boardSize}
        />
      </TactProvider>
    );
  }

  // Show join UI for players who haven't joined yet
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Join Game</h1>
        <p className="text-center text-gray-600 mb-6">
          Game ID: {gameId.substring(0, 8)}
        </p>
        <p className="text-center text-sm text-gray-600 mb-6">
          Players: {players.length}/{game.settings.maxPlayers}
        </p>
        
        <div className="space-y-4">
          <div>
            <Input
              placeholder="Enter your player name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full"
            />
          </div>
          <Button
            onClick={handleJoinGame}
            disabled={joining || !playerName.trim()}
            className="w-full"
          >
            {joining ? 'Joining...' : 'Join Game'}
          </Button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}