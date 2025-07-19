import { useState, useEffect, useCallback, useRef } from 'react';
import { useTactProvider } from './context.js';
import {
  GameInfo,
  GameSettings,
  GameState,
  Tank,
  Heart,
  Player,
  GameEvent,
  HexPosition,
  Hook,
  Treaty,
  Bounty,
  GameId,
  PlayerId,
  Wei,
} from '@tact/game-logic';
import { ActionResult, GameStateQuery, PlayerQuery } from './interface.js';

// Generic hook for data fetching with caching
function useQuery<T>(
  queryKey: string,
  queryFn: () => Promise<T>,
  options: { enabled?: boolean; watch?: boolean; refetchInterval?: number } = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);

  const { enabled = true, watch = false, refetchInterval = 10000 } = options;

  // Use ref to store the latest query function without causing re-renders
  const queryFnRef = useRef(queryFn);
  queryFnRef.current = queryFn;

  const fetchData = useCallback(async (isInitialFetch = false) => {
    if (!enabled) return;

    // Only show loading spinner on initial fetch, not background refetches
    if (isInitialFetch || !hasInitiallyLoaded) {
      setIsLoading(true);
    }
    setError(null);
    
    try {
      const result = await queryFnRef.current();
      setData(result);
      if (!hasInitiallyLoaded) {
        setHasInitiallyLoaded(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Query failed');
    } finally {
      if (isInitialFetch || !hasInitiallyLoaded) {
        setIsLoading(false);
      }
    }
  }, [enabled]);

  useEffect(() => {
    fetchData(true); // Mark initial fetch
  }, [fetchData]);

  useEffect(() => {
    if (!watch || !enabled) return;

    const interval = setInterval(() => fetchData(false), refetchInterval);
    return () => clearInterval(interval);
  }, [watch, enabled, refetchInterval, fetchData]);

  return { data, isLoading, error, refetch: () => fetchData(false) };
}

// Game Management Hooks
export function useCreateGame() {
  const { provider } = useTactProvider();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createGame = async (settings: GameSettings): Promise<ActionResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const gameId = await provider.createGame(settings);
      return { success: true, data: gameId };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create game';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { createGame, isLoading, error };
}

export function useListGames() {
  const { provider } = useTactProvider();
  
  return useQuery(
    'games',
    () => provider.listGames(),
    { watch: true }
  );
}

export function useGameInfo(gameId: GameId, options: { watch?: boolean } = {}) {
  const { provider } = useTactProvider();
  
  return useQuery(
    `game-info-${gameId}`,
    () => provider.getGameInfo(gameId),
    { enabled: !!gameId, watch: options.watch }
  );
}

// Game State Hooks
export function useGameState(query: GameStateQuery) {
  const { provider } = useTactProvider();
  
  return useQuery(
    `game-state-${query.gameId}`,
    () => provider.getGameState(query.gameId),
    { enabled: query.enabled !== false && !!query.gameId, watch: query.watch }
  );
}

export function useGameSettings(gameId: GameId, options: { watch?: boolean } = {}) {
  const { provider } = useTactProvider();
  
  return useQuery(
    `game-settings-${gameId}`,
    () => provider.getGameSettings(gameId),
    { enabled: !!gameId, watch: options.watch }
  );
}

export function useAllTanks(gameId: GameId, options: { watch?: boolean } = {}) {
  const { provider } = useTactProvider();
  
  return useQuery(
    `all-tanks-${gameId}`,
    () => provider.getAllTanks(gameId),
    { enabled: !!gameId, watch: options.watch }
  );
}

export function useAllHearts(gameId: GameId, options: { watch?: boolean } = {}) {
  const { provider } = useTactProvider();
  
  return useQuery(
    `all-hearts-${gameId}`,
    () => provider.getAllHearts(gameId),
    { enabled: !!gameId, watch: options.watch }
  );
}

export function usePlayers(gameId: GameId, options: { watch?: boolean } = {}) {
  const { provider } = useTactProvider();
  
  return useQuery(
    `players-${gameId}`,
    () => provider.getPlayers(gameId),
    { enabled: !!gameId, watch: options.watch }
  );
}

export function usePlayerCount(gameId: GameId, options: { watch?: boolean } = {}) {
  const { provider } = useTactProvider();
  
  return useQuery(
    `player-count-${gameId}`,
    () => provider.getPlayerCount(gameId),
    { enabled: !!gameId, watch: options.watch }
  );
}

export function usePrizePool(gameId: GameId, options: { watch?: boolean } = {}) {
  const { provider } = useTactProvider();
  
  return useQuery(
    `prize-pool-${gameId}`,
    () => provider.getPrizePool(gameId),
    { enabled: !!gameId, watch: options.watch }
  );
}

// Player Action Hooks
export function useJoinGame() {
  const { provider } = useTactProvider();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinGame = async (gameId: GameId, playerName: string, entryFee?: Wei): Promise<ActionResult> => {
    setIsLoading(true);
    setError(null);

    try {
      await provider.joinGame(gameId, playerName, entryFee);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join game';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { joinGame, isLoading, error };
}

export function useMovePlayer() {
  const { provider } = useTactProvider();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const movePlayer = async (gameId: GameId, playerId: PlayerId, targetPosition: HexPosition): Promise<ActionResult> => {
    setIsLoading(true);
    setError(null);

    try {
      await provider.movePlayer(gameId, playerId, targetPosition);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to move player';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { movePlayer, isLoading, error };
}

export function useShootPlayer() {
  const { provider } = useTactProvider();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shootPlayer = async (gameId: GameId, shooterId: PlayerId, targetId: PlayerId): Promise<ActionResult> => {
    setIsLoading(true);
    setError(null);

    try {
      await provider.shootPlayer(gameId, shooterId, targetId);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to shoot player';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { shootPlayer, isLoading, error };
}

export function useUpgradePlayer() {
  const { provider } = useTactProvider();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upgradePlayer = async (gameId: GameId, playerId: PlayerId): Promise<ActionResult> => {
    setIsLoading(true);
    setError(null);

    try {
      await provider.upgradePlayer(gameId, playerId);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upgrade player';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { upgradePlayer, isLoading, error };
}

export function useGiveToPlayer() {
  const { provider } = useTactProvider();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const giveToPlayer = async (
    gameId: GameId,
    giverId: PlayerId,
    receiverId: PlayerId,
    hearts?: number,
    aps?: number
  ): Promise<ActionResult> => {
    setIsLoading(true);
    setError(null);

    try {
      await provider.giveToPlayer(gameId, giverId, receiverId, hearts, aps);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to give to player';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { giveToPlayer, isLoading, error };
}

// Game Events Hook
export function useGameEvents(gameId: GameId, options: { enabled?: boolean } = {}) {
  const { provider } = useTactProvider();
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!options.enabled || !gameId) return;

    setIsLoading(true);
    setError(null);

    // Load initial events
    provider.getGameEvents(gameId)
      .then(setEvents)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load events'))
      .finally(() => setIsLoading(false));

    // Subscribe to new events
    const unsubscribe = provider.subscribeToGameEvents(gameId, (event) => {
      setEvents(prev => [...prev, event]);
    });

    return unsubscribe;
  }, [provider, gameId, options.enabled]);

  return { events, isLoading, error };
}

// Utility Hooks
export function useUpgradeCost(gameId: GameId, playerId: PlayerId) {
  const { provider } = useTactProvider();
  
  return useQuery(
    `upgrade-cost-${gameId}-${playerId}`,
    () => provider.getUpgradeCost(gameId, playerId),
    { enabled: !!gameId && !!playerId }
  );
}

export function useCurrentEpoch(gameId: GameId, options: { watch?: boolean } = {}) {
  const { provider } = useTactProvider();
  
  return useQuery(
    `current-epoch-${gameId}`,
    () => provider.getCurrentEpoch(gameId),
    { enabled: !!gameId, watch: options.watch }
  );
}

export function useCurrentUser() {
  const { provider } = useTactProvider();
  
  return useQuery(
    'current-user',
    () => provider.getCurrentUser(),
    { watch: true }
  );
}

export function useUpdateGameSettings() {
  const { provider } = useTactProvider();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateGameSettings = async (
    gameId: GameId, 
    updaterId: PlayerId,
    newSettings: Partial<{ epochSeconds: number }>
  ): Promise<ActionResult> => {
    setIsLoading(true);
    setError(null);

    try {
      await provider.updateGameSettings(gameId, updaterId, newSettings);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update game settings';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { updateGameSettings, isLoading, error };
}