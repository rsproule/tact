export type Hex = Readonly<{
  q: number;
  r: number;
  s: number;
}>;

export const ORIGIN: Hex = { q: 0, r: 0, s: 0 };

export function isCubeCoordinate(hex: Hex): boolean {
  return (
    Number.isInteger(hex.q) &&
    Number.isInteger(hex.r) &&
    Number.isInteger(hex.s) &&
    hex.q + hex.r + hex.s === 0
  );
}

export function hexDistance(from: Hex, to: Hex): number {
  assertCubeCoordinate(from);
  assertCubeCoordinate(to);

  return (
    Math.abs(from.q - to.q) +
    Math.abs(from.r - to.r) +
    Math.abs(from.s - to.s)
  ) / 2;
}

export function isOnBoard(hex: Hex, radius: number): boolean {
  if (!Number.isInteger(radius) || radius < 1 || !isCubeCoordinate(hex)) {
    return false;
  }

  return hexDistance(ORIGIN, hex) <= radius;
}

export function assertCubeCoordinate(hex: Hex): asserts hex is Hex {
  if (!isCubeCoordinate(hex)) {
    throw new TypeError(`Invalid cube coordinate: ${JSON.stringify(hex)}`);
  }
}
