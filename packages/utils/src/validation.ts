/**
 * Validates Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validates hex position coordinates
 */
export function isValidHexPosition(position: { x: number; y: number }, boardSize: number): boolean {
  const maxCoord = Math.floor(boardSize / 2);
  return (
    position.x >= -maxCoord &&
    position.x <= maxCoord &&
    position.y >= -maxCoord &&
    position.y <= maxCoord &&
    Math.abs(position.x + position.y) <= maxCoord
  );
}

/**
 * Validates game settings
 */
export function validateGameSettings(settings: {
  playerCount: number;
  boardSize: number;
  epochSeconds: number;
  initHearts: number;
  initAps: number;
  initRange: number;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (settings.playerCount < 2) {
    errors.push('Player count must be at least 2');
  }

  if (settings.playerCount > 50) {
    errors.push('Player count cannot exceed 50');
  }

  if (settings.boardSize < 3 || settings.boardSize % 3 !== 0) {
    errors.push('Board size must be a multiple of 3 and at least 3');
  }

  if (settings.epochSeconds < 60) {
    errors.push('Epoch duration must be at least 60 seconds');
  }

  if (settings.initHearts < 1) {
    errors.push('Initial hearts must be at least 1');
  }

  if (settings.initAps < 1) {
    errors.push('Initial action points must be at least 1');
  }

  if (settings.initRange < 1) {
    errors.push('Initial range must be at least 1');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validates player name
 */
export function validatePlayerName(name: string): { valid: boolean; error?: string } {
  if (name.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }

  if (name.length > 20) {
    return { valid: false, error: 'Name cannot exceed 20 characters' };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
    return { valid: false, error: 'Name can only contain letters, numbers, underscores, and hyphens' };
  }

  return { valid: true };
}

/**
 * Validates wei amount string
 */
export function validateWeiAmount(amount: string): boolean {
  try {
    const wei = BigInt(amount);
    return wei >= 0n;
  } catch {
    return false;
  }
}

/**
 * Validates positive integer
 */
export function validatePositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

/**
 * Validates range for giving resources
 */
export function validateGiveAmount(
  amount: number,
  available: number,
  type: 'hearts' | 'aps'
): { valid: boolean; error?: string } {
  if (!validatePositiveInteger(amount)) {
    return { valid: false, error: `${type} amount must be a positive integer` };
  }

  if (amount > available) {
    return { valid: false, error: `Not enough ${type} available` };
  }

  return { valid: true };
}