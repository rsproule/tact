import { HexPosition, Tank, GameSettings, GAME_RULES } from './types.js';

// Hex grid utilities
export class HexUtils {
  static distance(pos1: HexPosition, pos2: HexPosition): number {
    const dq = pos1.x - pos2.x;
    const dr = pos1.y - pos2.y;
    const ds = pos1.z - pos2.z;
    return (Math.abs(dq) + Math.abs(dr) + Math.abs(ds)) / 2;
  }

  static isAdjacent(pos1: HexPosition, pos2: HexPosition): boolean {
    return this.distance(pos1, pos2) === 1;
  }

  static isInRange(pos1: HexPosition, pos2: HexPosition, range: number): boolean {
    return this.distance(pos1, pos2) <= range;
  }

  static getAdjacentPositions(pos: HexPosition): HexPosition[] {
    return [
      { x: pos.x + 1, y: pos.y, z: pos.z - 1 },
      { x: pos.x - 1, y: pos.y, z: pos.z + 1 },
      { x: pos.x, y: pos.y + 1, z: pos.z - 1 },
      { x: pos.x, y: pos.y - 1, z: pos.z + 1 },
      { x: pos.x + 1, y: pos.y - 1, z: pos.z },
      { x: pos.x - 1, y: pos.y + 1, z: pos.z },
    ];
  }

  static isValidPosition(pos: HexPosition, boardSize: number): boolean {
    const maxCoord = Math.floor(boardSize / 2);
    return (
      pos.x >= -maxCoord &&
      pos.x <= maxCoord &&
      pos.y >= -maxCoord &&
      pos.y <= maxCoord &&
      pos.z >= -maxCoord &&
      pos.z <= maxCoord &&
      pos.x + pos.y + pos.z === 0
    );
  }

  static getRandomPosition(boardSize: number): HexPosition {
    const maxCoord = Math.floor(boardSize / 2);
    let pos: HexPosition;
    do {
      const x = Math.floor(Math.random() * (maxCoord * 2 + 1)) - maxCoord;
      const y = Math.floor(Math.random() * (maxCoord * 2 + 1)) - maxCoord;
      const z = -x - y;
      pos = { x, y, z };
    } while (!this.isValidPosition(pos, boardSize));
    return pos;
  }
}

// Game rule validation
export class GameRules {
  static canMove(
    tank: Tank,
    targetPosition: HexPosition,
    boardSize: number,
    occupiedPositions: HexPosition[]
  ): { valid: boolean; reason?: string; cost?: number } {
    // Calculate distance and cost
    const distance = HexUtils.distance(tank.position, targetPosition);
    const cost = distance * GAME_RULES.MOVE_COST;

    // Check if tank has enough APs for the move
    if (tank.aps < cost) {
      return { valid: false, reason: `Not enough action points (need ${cost}, have ${tank.aps})`, cost };
    }

    // Check if trying to move to same position
    if (distance === 0) {
      return { valid: false, reason: 'Cannot move to current position', cost };
    }

    // Check if target position is valid on board
    if (!HexUtils.isValidPosition(targetPosition, boardSize)) {
      return { valid: false, reason: 'Target position is outside board', cost };
    }

    // Check if target position is occupied
    const isOccupied = occupiedPositions.some(
      pos => pos.x === targetPosition.x && pos.y === targetPosition.y && pos.z === targetPosition.z
    );
    if (isOccupied) {
      return { valid: false, reason: 'Target position is occupied', cost };
    }

    return { valid: true, cost };
  }

  static canShoot(
    shooter: Tank,
    target: Tank
  ): { valid: boolean; reason?: string } {
    // Check if shooter has enough APs
    if (shooter.aps < GAME_RULES.SHOOT_COST) {
      return { valid: false, reason: 'Not enough action points' };
    }

    // Check if target is in range
    if (!HexUtils.isInRange(shooter.position, target.position, shooter.range)) {
      return { valid: false, reason: 'Target is out of range' };
    }

    // Check if target is alive
    if (target.hearts <= 0) {
      return { valid: false, reason: 'Target is already dead' };
    }

    // Can't shoot yourself
    if (shooter.tankId === target.tankId) {
      return { valid: false, reason: 'Cannot shoot yourself' };
    }

    return { valid: true };
  }

  static canGive(
    giver: Tank,
    receiver: Tank,
    hearts: number = 0,
    aps: number = 0
  ): { valid: boolean; reason?: string } {
    // Check if giver has enough resources
    if (hearts > 0 && giver.hearts < hearts) {
      return { valid: false, reason: 'Not enough hearts to give' };
    }

    if (aps > 0 && giver.aps < aps) {
      return { valid: false, reason: 'Not enough action points to give' };
    }

    // Check if receiver is in range
    if (!HexUtils.isInRange(giver.position, receiver.position, giver.range)) {
      return { valid: false, reason: 'Receiver is out of range' };
    }

    // Must give something
    if (hearts === 0 && aps === 0) {
      return { valid: false, reason: 'Must give at least one heart or AP' };
    }

    // Can't give to yourself
    if (giver.tankId === receiver.tankId) {
      return { valid: false, reason: 'Cannot give to yourself' };
    }

    return { valid: true };
  }

  static canUpgrade(tank: Tank): { valid: boolean; reason?: string; cost?: number } {
    const cost = this.getUpgradeCost(tank.range);

    // Check if tank has enough APs
    if (tank.aps < cost) {
      return { valid: false, reason: 'Not enough action points', cost };
    }

    return { valid: true, cost };
  }

  static getUpgradeCost(currentRange: number): number {
    // Cost is based on new perimeter size + 10%
    const newRange = currentRange + 1;
    const perimeter = 6 * newRange; // Hexagon perimeter
    return Math.floor(perimeter * GAME_RULES.UPGRADE_MULTIPLIER);
  }

  static canJoinGame(
    settings: GameSettings,
    currentPlayerCount: number,
    entryFee: string
  ): { valid: boolean; reason?: string } {
    // Check if game is full
    if (currentPlayerCount >= settings.maxPlayers) {
      return { valid: false, reason: 'Game is full' };
    }

    // Check entry fee (for blockchain version)
    if (settings.entryCost !== '0' && entryFee !== settings.entryCost) {
      return { valid: false, reason: 'Incorrect entry fee' };
    }

    return { valid: true };
  }

  static canStartGame(
    settings: GameSettings,
    currentPlayerCount: number
  ): { valid: boolean; reason?: string } {
    if (currentPlayerCount < settings.minPlayers) {
      return { valid: false, reason: 'Not enough players to start' };
    }

    return { valid: true };
  }

  static calculateDamage(_shooter: Tank, _target: Tank): number {
    // Simple damage calculation - always 1 heart for now
    return 1;
  }

  static isPlayerDead(tank: Tank): boolean {
    return tank.hearts <= 0;
  }

  static shouldSpawnHeart(lastHeartSpawn: number, currentTime: number): boolean {
    return currentTime - lastHeartSpawn >= GAME_RULES.HEART_SPAWN_INTERVAL;
  }

  static shouldAdvanceEpoch(epochStart: number, currentTime: number, epochDuration: number): boolean {
    return currentTime - epochStart >= epochDuration;
  }
}

// Game state utilities
export class GameStateUtils {
  static isGameWaitingForPlayers(playerCount: number, minPlayers: number): boolean {
    return playerCount < minPlayers;
  }

  static isGameStarted(playerCount: number, minPlayers: number): boolean {
    return playerCount >= minPlayers;
  }

  static isGameEnded(alivePlayers: number): boolean {
    return alivePlayers <= 1;
  }

  static getAlivePlayers(tanks: Tank[]): Tank[] {
    return tanks.filter(tank => tank.hearts > 0);
  }

  static getWinner(tanks: Tank[]): Tank | null {
    const alivePlayers = this.getAlivePlayers(tanks);
    return alivePlayers.length === 1 ? alivePlayers[0] : null;
  }

  static getCurrentEpoch(epochStart: number, epochDuration: number): number {
    return Math.floor((Date.now() / 1000 - epochStart) / epochDuration);
  }

  static getNextEpochTime(epochStart: number, epochDuration: number): number {
    const currentEpoch = this.getCurrentEpoch(epochStart, epochDuration);
    return epochStart + (currentEpoch + 1) * epochDuration;
  }
}