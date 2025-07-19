// Core game types for both blockchain and database versions

export interface HexPosition {
  x: number;
  y: number;
  z: number;
}

export interface Tank {
  tankId: string;
  owner: string;
  hearts: number;
  aps: number; // Action Points
  range: number;
  position: HexPosition;
  playerName?: string;
}

export interface Heart {
  position: HexPosition;
  active: boolean;
}

export enum GameState {
  WaitingForPlayers = 0,
  Started = 1,
  Ended = 2,
}

export interface GameSettings {
  playerCount: number;
  boardSize: number;
  epochSeconds: number;
  revealWaitBlocks: number;
  initHearts: number;
  initAps: number;
  initRange: number;
  entryCost: string; // wei amount
  minPlayers: number;
  maxPlayers: number;
  epochMaxActionPoints: number;
}

export interface GameInfo {
  gameId: string;
  address: string;
  state: GameState;
  settings: GameSettings;
  playersCount: number;
  prizePool: string;
  epochStart: number;
  owner: string;
  createdAt: number;
}

export interface Player {
  address: string;
  name: string;
  tankId: string;
  isAlive: boolean;
  joinedAt: number;
}

// Game Events
export enum GameEventType {
  PlayerJoined = 'PlayerJoined',
  GameStarted = 'GameStarted',
  Move = 'Move',
  Shoot = 'Shoot',
  Give = 'Give',
  Upgrade = 'Upgrade',
  Vote = 'Vote',
  Drip = 'Drip',
  Claim = 'Claim',
  Donate = 'Donate',
  HeartSpawned = 'HeartSpawned',
  GameEnded = 'GameEnded',
}

export interface GameEvent {
  id: string;
  gameId: string;
  type: GameEventType;
  timestamp: number;
  blockNumber?: number;
  transactionHash?: string;
  player?: string;
  data: Record<string, any>;
}

// Action-specific event data
export interface MoveEventData {
  player: string;
  from: HexPosition;
  to: HexPosition;
  apsCost: number;
}

export interface ShootEventData {
  shooter: string;
  target: string;
  damage: number;
  targetPosition: HexPosition;
}

export interface GiveEventData {
  giver: string;
  receiver: string;
  hearts?: number;
  aps?: number;
}

export interface UpgradeEventData {
  player: string;
  newRange: number;
  apsCost: number;
}

export interface VoteEventData {
  voter: string;
  target: string;
  cursePower: number;
}

// Game Rules Constants
export const GAME_RULES = {
  MOVE_COST: 1,
  SHOOT_COST: 1,
  UPGRADE_BASE_COST: 10,
  UPGRADE_MULTIPLIER: 1.1,
  INITIAL_HEARTS: 3,
  INITIAL_APS: 1,
  INITIAL_RANGE: 3,
  EPOCH_DURATION: 30 * 60, // 30 minutes in seconds
  HEART_SPAWN_INTERVAL: 24 * 60 * 60, // 24 hours in seconds
} as const;

// Hook system types
export interface Hook {
  id: string;
  gameId: string;
  type: 'bounty' | 'non-aggression' | 'custom';
  creator: string;
  target?: string;
  parameters: Record<string, any>;
  active: boolean;
  createdAt: number;
}

export interface Treaty {
  id: string;
  gameId: string;
  type: 'non-aggression';
  parties: string[];
  duration: number;
  createdAt: number;
  expiresAt: number;
  active: boolean;
}

export interface Bounty {
  id: string;
  gameId: string;
  creator: string;
  target: string;
  reward: string; // wei amount
  claimed: boolean;
  claimedBy?: string;
  createdAt: number;
}

// Utility types
export type Address = string;
export type Wei = string;
export type Epoch = number;
export type TankId = string;
export type GameId = string;
export type PlayerId = string;