import { hexDistance, type Hex } from "./hex";

/**
 * Executed V2 behavior, derived from the Solidity implementation and tests.
 * These helpers document compatibility behavior; they do not preserve known
 * authorization, accounting, or concurrency defects from the contracts.
 */
export const legacyV2Ruleset = {
  id: "legacy-v2",
  mode: "continuous-time",
  actionPointsPerEpoch: 1,
  killRewardDivisor: 5,
  podiumPercentages: [60, 30, 10],
} as const;

export function movementCost(from: Hex, to: Hex): number {
  return hexDistance(from, to);
}

export function shootingCost(shots: number): number {
  assertPositiveInteger(shots, "shots");
  return shots;
}

export function killActionPointReward(victimActionPoints: number): number {
  assertNonNegativeInteger(victimActionPoints, "victimActionPoints");
  return Math.floor(victimActionPoints / legacyV2Ruleset.killRewardDivisor);
}

export function rangeUpgradeCost(currentRange: number): number {
  assertPositiveInteger(currentRange, "currentRange");
  return Math.max(0, 6 * currentRange - 6);
}

export function claimableActionPoints(
  currentEpoch: number,
  lastClaimedEpoch: number,
  alive: boolean,
): number {
  assertNonNegativeInteger(currentEpoch, "currentEpoch");
  assertNonNegativeInteger(lastClaimedEpoch, "lastClaimedEpoch");

  if (!alive || currentEpoch <= lastClaimedEpoch) {
    return 0;
  }

  return currentEpoch - lastClaimedEpoch;
}

function assertPositiveInteger(value: number, name: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new RangeError(`${name} must be a positive integer`);
  }
}

function assertNonNegativeInteger(value: number, name: string): void {
  if (!Number.isInteger(value) || value < 0) {
    throw new RangeError(`${name} must be a non-negative integer`);
  }
}
