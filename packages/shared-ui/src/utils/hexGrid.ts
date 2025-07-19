import { Hex } from 'react-hexgrid';

/**
 * Creates a hexagonal grid of the specified size
 */
export function createHexagon(size: number): Hex[] {
  const hexagons: Hex[] = [];
  const radius = Math.floor(size / 2);
  
  for (let q = -radius; q <= radius; q++) {
    const r1 = Math.max(-radius, -q - radius);
    const r2 = Math.min(radius, -q + radius);
    
    for (let r = r1; r <= r2; r++) {
      const s = -q - r;
      hexagons.push(new Hex(q, r, s));
    }
  }
  
  return hexagons;
}

/**
 * Converts hex coordinates to cube coordinates
 */
export function hexToCube(hex: { q: number; r: number }): { x: number; y: number; z: number } {
  return {
    x: hex.q,
    y: hex.r,
    z: -hex.q - hex.r,
  };
}

/**
 * Converts cube coordinates to hex coordinates
 */
export function cubeToHex(cube: { x: number; y: number; z: number }): { q: number; r: number } {
  return {
    q: cube.x,
    r: cube.y,
  };
}

/**
 * Calculates the distance between two hex positions
 */
export function hexDistance(
  a: { q: number; r: number },
  b: { q: number; r: number }
): number {
  const ac = hexToCube(a);
  const bc = hexToCube(b);
  
  return Math.max(
    Math.abs(ac.x - bc.x),
    Math.abs(ac.y - bc.y),
    Math.abs(ac.z - bc.z)
  );
}

/**
 * Gets all neighbors of a hex position
 */
export function getNeighbors(hex: { q: number; r: number }): { q: number; r: number }[] {
  const directions = [
    { q: 1, r: 0 },   // East
    { q: 1, r: -1 },  // Northeast
    { q: 0, r: -1 },  // Northwest
    { q: -1, r: 0 },  // West
    { q: -1, r: 1 },  // Southwest
    { q: 0, r: 1 },   // Southeast
  ];
  
  return directions.map(dir => ({
    q: hex.q + dir.q,
    r: hex.r + dir.r,
  }));
}

/**
 * Checks if a hex position is within the board bounds
 */
export function isValidHexPosition(
  hex: { q: number; r: number },
  boardSize: number
): boolean {
  const radius = Math.floor(boardSize / 2);
  const { x, y, z } = hexToCube(hex);
  
  return (
    Math.abs(x) <= radius &&
    Math.abs(y) <= radius &&
    Math.abs(z) <= radius
  );
}

/**
 * Gets all hex positions within a certain range of a center position
 */
export function getHexesInRange(
  center: { q: number; r: number },
  range: number,
  boardSize: number
): { q: number; r: number }[] {
  const hexes: { q: number; r: number }[] = [];
  
  for (let q = -range; q <= range; q++) {
    const r1 = Math.max(-range, -q - range);
    const r2 = Math.min(range, -q + range);
    
    for (let r = r1; r <= r2; r++) {
      const hex = { q: center.q + q, r: center.r + r };
      
      if (isValidHexPosition(hex, boardSize)) {
        hexes.push(hex);
      }
    }
  }
  
  return hexes;
}