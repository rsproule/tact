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
  Address,
  Wei,
  GameEventType,
} from '@tact/game-logic';
import { ITactProvider, EventCallback, UnsubscribeFunction } from '../interface.js';

/**
 * Database provider that uses server actions for game state management
 */
export class DatabaseProvider implements ITactProvider {
  private currentUser: Address | null = null;
  private eventSubscriptions: Map<string, UnsubscribeFunction[]> = new Map();
  private pollingIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor(currentUser?: Address) {
    this.currentUser = currentUser || null;
  }

  getProviderType(): 'blockchain' | 'database' {
    return 'database';
  }

  isConnected(): boolean {
    return this.currentUser !== null;
  }

  async getCurrentUser(): Promise<Address | null> {
    return this.currentUser;
  }

  setCurrentUser(user: Address | null): void {
    this.currentUser = user;
  }

  // Game Management
  async createGame(settings: GameSettings): Promise<GameId> {
    // This would call a server action to create a new game in the database
    const response = await fetch('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings, creator: this.currentUser }),
    });

    if (!response.ok) {
      throw new Error('Failed to create game');
    }

    const { gameId } = await response.json();
    return gameId;
  }

  async listGames(): Promise<GameInfo[]> {
    const response = await fetch('/api/games');
    if (!response.ok) {
      throw new Error('Failed to fetch games');
    }

    const games = await response.json();
    return games;
  }

  async getGameInfo(gameId: GameId): Promise<GameInfo | null> {
    const response = await fetch(`/api/games/${gameId}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch game info');
    }

    const gameInfo = await response.json();
    return gameInfo;
  }

  // Game State
  async getGameState(gameId: GameId): Promise<GameState> {
    const response = await fetch(`/api/games/${gameId}/state`);
    if (!response.ok) {
      throw new Error('Failed to fetch game state');
    }

    const { state } = await response.json();
    return state;
  }

  async getGameSettings(gameId: GameId): Promise<GameSettings> {
    const response = await fetch(`/api/games/${gameId}/settings`);
    if (!response.ok) {
      throw new Error('Failed to fetch game settings');
    }

    const settings = await response.json();
    return settings;
  }

  async getAllTanks(gameId: GameId): Promise<Tank[]> {
    const response = await fetch(`/api/games/${gameId}/tanks`);
    if (!response.ok) {
      throw new Error('Failed to fetch tanks');
    }

    const tanks = await response.json();
    return tanks;
  }

  async getAllHearts(gameId: GameId): Promise<Heart[]> {
    const response = await fetch(`/api/games/${gameId}/hearts`);
    if (!response.ok) {
      throw new Error('Failed to fetch hearts');
    }

    const hearts = await response.json();
    return hearts;
  }

  async getPlayers(gameId: GameId): Promise<Player[]> {
    const response = await fetch(`/api/games/${gameId}/players`);
    if (!response.ok) {
      throw new Error('Failed to fetch players');
    }

    const players = await response.json();
    return players;
  }

  async getPlayerCount(gameId: GameId): Promise<number> {
    const response = await fetch(`/api/games/${gameId}/player-count`);
    if (!response.ok) {
      throw new Error('Failed to fetch player count');
    }

    const { count } = await response.json();
    return count;
  }

  async getPrizePool(gameId: GameId): Promise<Wei> {
    const response = await fetch(`/api/games/${gameId}/prize-pool`);
    if (!response.ok) {
      throw new Error('Failed to fetch prize pool');
    }

    const { prizePool } = await response.json();
    return prizePool;
  }

  // Player Actions
  async joinGame(gameId: GameId, playerName: string, entryFee?: Wei): Promise<void> {
    const response = await fetch(`/api/games/${gameId}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        playerId: this.currentUser, 
        playerName, 
        entryFee: entryFee || '0' 
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to join game');
    }
  }

  async movePlayer(gameId: GameId, playerId: PlayerId, targetPosition: HexPosition): Promise<void> {
    const response = await fetch(`/api/games/${gameId}/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId, targetPosition }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to move player');
    }
  }

  async shootPlayer(gameId: GameId, shooterId: PlayerId, targetId: PlayerId): Promise<void> {
    const response = await fetch(`/api/games/${gameId}/shoot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shooterId, targetId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to shoot player');
    }
  }

  async upgradePlayer(gameId: GameId, playerId: PlayerId): Promise<void> {
    const response = await fetch(`/api/games/${gameId}/upgrade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upgrade player');
    }
  }

  async giveToPlayer(
    gameId: GameId,
    giverId: PlayerId,
    receiverId: PlayerId,
    hearts?: number,
    aps?: number
  ): Promise<void> {
    const response = await fetch(`/api/games/${gameId}/give`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ giverId, receiverId, hearts, aps }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to give to player');
    }
  }

  async votePlayer(gameId: GameId, voterId: PlayerId, targetId: PlayerId): Promise<void> {
    const response = await fetch(`/api/games/${gameId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voterId, targetId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to vote');
    }
  }

  async claimActionPoints(gameId: GameId, playerId: PlayerId): Promise<void> {
    const response = await fetch(`/api/games/${gameId}/claim-aps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to claim action points');
    }
  }

  async donateToGame(gameId: GameId, amount: Wei): Promise<void> {
    const response = await fetch(`/api/games/${gameId}/donate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to donate');
    }
  }

  // Game Flow
  async startGame(gameId: GameId): Promise<void> {
    const response = await fetch(`/api/games/${gameId}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initiator: this.currentUser }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to start game');
    }
  }

  async revealBoard(gameId: GameId): Promise<void> {
    const response = await fetch(`/api/games/${gameId}/reveal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initiator: this.currentUser }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reveal board');
    }
  }

  // Events
  subscribeToGameEvents(gameId: GameId, callback: EventCallback): UnsubscribeFunction {
    // For database provider, we'll poll for new events
    const pollEvents = async () => {
      try {
        const response = await fetch(`/api/games/${gameId}/events?since=${Date.now() - 10000}`);
        if (response.ok) {
          const events = await response.json();
          events.forEach(callback);
        }
      } catch (error) {
        console.error('Error polling events:', error);
      }
    };

    // Start polling
    const intervalId = setInterval(pollEvents, 5000); // Poll every 5 seconds
    this.pollingIntervals.set(`${gameId}-events`, intervalId);

    const unsubscribe = () => {
      clearInterval(intervalId);
      this.pollingIntervals.delete(`${gameId}-events`);
    };

    // Store subscription for cleanup
    const gameSubscriptions = this.eventSubscriptions.get(gameId) || [];
    gameSubscriptions.push(unsubscribe);
    this.eventSubscriptions.set(gameId, gameSubscriptions);

    return unsubscribe;
  }

  async getGameEvents(gameId: GameId, fromTimestamp?: number): Promise<GameEvent[]> {
    const url = fromTimestamp 
      ? `/api/games/${gameId}/events?since=${fromTimestamp}`
      : `/api/games/${gameId}/events`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch game events');
    }

    const events = await response.json();
    return events;
  }

  // Hooks & Treaties
  async createBounty(gameId: GameId, targetId: PlayerId, reward: Wei): Promise<string> {
    const response = await fetch(`/api/games/${gameId}/bounty`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creator: this.currentUser, targetId, reward }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create bounty');
    }

    const { bountyId } = await response.json();
    return bountyId;
  }

  async createTreaty(
    gameId: GameId,
    type: 'non-aggression',
    parties: PlayerId[],
    duration: number
  ): Promise<string> {
    const response = await fetch(`/api/games/${gameId}/treaty`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, parties, duration }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create treaty');
    }

    const { treatyId } = await response.json();
    return treatyId;
  }

  async getActiveHooks(gameId: GameId): Promise<Hook[]> {
    const response = await fetch(`/api/games/${gameId}/hooks`);
    if (!response.ok) {
      throw new Error('Failed to fetch hooks');
    }

    const hooks = await response.json();
    return hooks;
  }

  async getActiveTreaties(gameId: GameId): Promise<Treaty[]> {
    const response = await fetch(`/api/games/${gameId}/treaties`);
    if (!response.ok) {
      throw new Error('Failed to fetch treaties');
    }

    const treaties = await response.json();
    return treaties;
  }

  async getActiveBounties(gameId: GameId): Promise<Bounty[]> {
    const response = await fetch(`/api/games/${gameId}/bounties`);
    if (!response.ok) {
      throw new Error('Failed to fetch bounties');
    }

    const bounties = await response.json();
    return bounties;
  }

  // Utility
  async getUpgradeCost(gameId: GameId, playerId: PlayerId): Promise<number> {
    const response = await fetch(`/api/games/${gameId}/upgrade-cost?playerId=${playerId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch upgrade cost');
    }

    const { cost } = await response.json();
    return cost;
  }

  async getCurrentEpoch(gameId: GameId): Promise<number> {
    const response = await fetch(`/api/games/${gameId}/epoch`);
    if (!response.ok) {
      throw new Error('Failed to fetch current epoch');
    }

    const { epoch } = await response.json();
    return epoch;
  }

  async getBlockNumber(): Promise<number> {
    // For database provider, return timestamp-based "block number"
    return Math.floor(Date.now() / 1000);
  }

  // Cleanup
  cleanup(): void {
    // Clear all polling intervals
    for (const [key, intervalId] of this.pollingIntervals) {
      clearInterval(intervalId);
    }
    this.pollingIntervals.clear();

    // Cleanup all event subscriptions
    for (const [gameId, subscriptions] of this.eventSubscriptions) {
      subscriptions.forEach(unsubscribe => unsubscribe());
    }
    this.eventSubscriptions.clear();
  }

  async updateGameSettings(
    gameId: GameId, 
    updaterId: PlayerId,
    newSettings: Partial<{ epochSeconds: number }>
  ): Promise<void> {
    const response = await fetch(`/api/games/${gameId}/settings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updaterId, ...newSettings }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }
  }
}

/**
 * Factory function to create database provider
 */
export function createDatabaseProvider(currentUser?: Address): DatabaseProvider {
  return new DatabaseProvider(currentUser);
}