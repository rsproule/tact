/**
 * Game constants that are consistent across all versions
 */
export const GAME_CONSTANTS = {
  // Action costs
  MOVE_COST: 1,
  SHOOT_COST: 1,
  UPGRADE_BASE_COST: 10,
  UPGRADE_MULTIPLIER: 1.1,
  
  // Default starting values
  DEFAULT_HEARTS: 3,
  DEFAULT_APS: 1,
  DEFAULT_RANGE: 3,
  
  // Time constants
  DEFAULT_EPOCH_DURATION: 30 * 60, // 30 minutes in seconds
  HEART_SPAWN_INTERVAL: 24 * 60 * 60, // 24 hours in seconds
  
  // Board constants
  MIN_BOARD_SIZE: 3,
  MAX_BOARD_SIZE: 21,
  
  // Player limits
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 50,
  
  // Name constraints
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 20,
  
  // Network constants
  POLLING_INTERVAL: 5000, // 5 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

/**
 * Chain-specific constants
 */
export const CHAIN_CONSTANTS = {
  FOUNDRY: {
    chainId: 31337,
    name: 'Foundry',
    rpcUrl: 'http://localhost:8545',
    blockTime: 1000, // 1 second
  },
  GOERLI: {
    chainId: 5,
    name: 'Goerli',
    rpcUrl: 'https://goerli.infura.io/v3/',
    blockTime: 12000, // 12 seconds
  },
} as const;

/**
 * Provider types
 */
export const PROVIDER_TYPES = {
  BLOCKCHAIN: 'blockchain',
  DATABASE: 'database',
} as const;

/**
 * Event types for consistency
 */
export const EVENT_TYPES = {
  PLAYER_JOINED: 'PlayerJoined',
  GAME_STARTED: 'GameStarted',
  MOVE: 'Move',
  SHOOT: 'Shoot',
  GIVE: 'Give',
  UPGRADE: 'Upgrade',
  VOTE: 'Vote',
  DRIP: 'Drip',
  CLAIM: 'Claim',
  DONATE: 'Donate',
  HEART_SPAWNED: 'HeartSpawned',
  GAME_ENDED: 'GameEnded',
} as const;

/**
 * Game states
 */
export const GAME_STATES = {
  WAITING_FOR_PLAYERS: 0,
  STARTED: 1,
  ENDED: 2,
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  INVALID_ADDRESS: 'Invalid Ethereum address',
  INVALID_POSITION: 'Invalid board position',
  INVALID_GAME_SETTINGS: 'Invalid game settings',
  INVALID_PLAYER_NAME: 'Invalid player name',
  INSUFFICIENT_RESOURCES: 'Insufficient resources',
  OUT_OF_RANGE: 'Target out of range',
  GAME_FULL: 'Game is full',
  GAME_NOT_STARTED: 'Game has not started',
  GAME_ENDED: 'Game has ended',
  PLAYER_DEAD: 'Player is dead',
  POSITION_OCCUPIED: 'Position is occupied',
  NOT_YOUR_TURN: 'Not your turn',
  PROVIDER_ERROR: 'Provider error',
  NETWORK_ERROR: 'Network error',
  TRANSACTION_FAILED: 'Transaction failed',
} as const;

/**
 * UI constants
 */
export const UI_CONSTANTS = {
  ANIMATION_DURATION: 300, // milliseconds
  TOAST_DURATION: 5000, // milliseconds
  POLLING_INTERVAL: 5000, // milliseconds
  DEBOUNCE_DELAY: 500, // milliseconds
} as const;