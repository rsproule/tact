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

export function sameHex(left: Hex, right: Hex): boolean {
  return left.q === right.q && left.r === right.r && left.s === right.s;
}

export function hexKey(hex: Hex): string {
  assertCubeCoordinate(hex);
  return `${hex.q},${hex.r},${hex.s}`;
}

export function parseHexKey(key: string): Hex {
  const parts = key.split(",");
  if (parts.length !== 3) {
    throw new TypeError(`Invalid cube-coordinate key: ${key}`);
  }

  const [qPart, rPart, sPart] = parts;
  const hex = {
    q: Number(qPart),
    r: Number(rPart),
    s: Number(sPart),
  };
  assertCubeCoordinate(hex);
  return hex;
}

export function boardTileCount(radius: number): number {
  if (!Number.isSafeInteger(radius) || radius < 1) {
    throw new RangeError("radius must be a positive safe integer");
  }
  return 3 * radius * (radius + 1) + 1;
}

/**
 * Stable q/r/s ordering for deterministic placement and resource spawning.
 */
export function enumerateBoard(radius: number): readonly Hex[] {
  boardTileCount(radius);
  const result: Hex[] = [];

  for (let q = -radius; q <= radius; q += 1) {
    const minimumR = Math.max(-radius, -q - radius);
    const maximumR = Math.min(radius, -q + radius);
    for (let r = minimumR; r <= maximumR; r += 1) {
      result.push({ q, r, s: -q - r });
    }
  }

  return result;
}

export function selectByDeterministicValue<T>(
  values: readonly T[],
  randomValue: number,
): T {
  if (values.length === 0) {
    throw new RangeError("cannot select from an empty collection");
  }
  if (!Number.isSafeInteger(randomValue) || randomValue < 0) {
    throw new RangeError("randomValue must be a non-negative safe integer");
  }

  // length is always at most the validated board tile count and therefore safe.
  return values[randomValue % values.length] as T;
}

export function assertCubeCoordinate(hex: Hex): asserts hex is Hex {
  if (!isCubeCoordinate(hex)) {
    throw new TypeError(`Invalid cube coordinate: ${JSON.stringify(hex)}`);
  }
}
