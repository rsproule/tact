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
} from '@tact/game-logic';

// Core provider interface that both blockchain and database providers implement
export interface ITactProvider {
  // Game Management
  createGame(settings: GameSettings): Promise<GameId>;
  listGames(): Promise<GameInfo[]>;
  getGameInfo(gameId: GameId): Promise<GameInfo | null>;
  
  // Game State
  getGameState(gameId: GameId): Promise<GameState>;
  getGameSettings(gameId: GameId): Promise<GameSettings>;
  getAllTanks(gameId: GameId): Promise<Tank[]>;
  getAllHearts(gameId: GameId): Promise<Heart[]>;
  getPlayers(gameId: GameId): Promise<Player[]>;
  getPlayerCount(gameId: GameId): Promise<number>;
  getPrizePool(gameId: GameId): Promise<Wei>;
  
  // Player Actions
  joinGame(gameId: GameId, playerName: string, entryFee?: Wei): Promise<void>;
  movePlayer(gameId: GameId, playerId: PlayerId, targetPosition: HexPosition): Promise<void>;
  shootPlayer(gameId: GameId, shooterId: PlayerId, targetId: PlayerId): Promise<void>;
  upgradePlayer(gameId: GameId, playerId: PlayerId): Promise<void>;
  giveToPlayer(gameId: GameId, giverId: PlayerId, receiverId: PlayerId, hearts?: number, aps?: number): Promise<void>;
  votePlayer(gameId: GameId, voterId: PlayerId, targetId: PlayerId): Promise<void>;
  claimActionPoints(gameId: GameId, playerId: PlayerId): Promise<void>;
  donateToGame(gameId: GameId, amount: Wei): Promise<void>;
  
  // Game Flow
  startGame(gameId: GameId): Promise<void>;
  revealBoard(gameId: GameId): Promise<void>;
  
  // Events
  subscribeToGameEvents(gameId: GameId, callback: (event: GameEvent) => void): () => void;
  getGameEvents(gameId: GameId, fromBlock?: number): Promise<GameEvent[]>;
  
  // Hooks & Treaties
  createBounty(gameId: GameId, targetId: PlayerId, reward: Wei): Promise<string>;
  createTreaty(gameId: GameId, type: 'non-aggression', parties: PlayerId[], duration: number): Promise<string>;
  getActiveHooks(gameId: GameId): Promise<Hook[]>;
  getActiveTreaties(gameId: GameId): Promise<Treaty[]>;
  getActiveBounties(gameId: GameId): Promise<Bounty[]>;
  
  // Utility
  getUpgradeCost(gameId: GameId, playerId: PlayerId): Promise<number>;
  getCurrentEpoch(gameId: GameId): Promise<number>;
  getBlockNumber(): Promise<number>;
  
  // Provider-specific info
  getProviderType(): 'blockchain' | 'database';
  isConnected(): boolean;
  getCurrentUser(): Promise<Address | null>;
}

// Hook-specific return types for different providers
export interface TransactionResult {
  hash?: string;
  success: boolean;
  error?: string;
}

export interface GameStateQuery {
  gameId: GameId;
  watch?: boolean;
  enabled?: boolean;
}

export interface PlayerQuery {
  gameId: GameId;
  playerId: PlayerId;
  watch?: boolean;
  enabled?: boolean;
}

// Provider context type
export interface TactProviderContext {
  provider: ITactProvider;
  isLoading: boolean;
  error: string | null;
  switchProvider: (provider: ITactProvider) => void;
}

// Action result types
export interface ActionResult {
  success: boolean;
  error?: string;
  transactionHash?: string;
  data?: any;
}

// Event subscription types
export type EventCallback = (event: GameEvent) => void;
export type UnsubscribeFunction = () => void;

// Provider configuration
export interface ProviderConfig {
  type: 'blockchain' | 'database';
  endpoint?: string;
  chainId?: number;
  pollingInterval?: number;
  retryAttempts?: number;
}