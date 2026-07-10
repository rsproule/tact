import { describe, expect, it } from "vitest";

import {
  claimableActionPoints,
  commandEnvelopeSchema,
  hexDistance,
  isOnBoard,
  killActionPointReward,
  movementCost,
  rangeUpgradeCost,
  shootingCost,
} from "./index";

describe("normalized hex geometry", () => {
  it("measures cube-coordinate distance", () => {
    expect(hexDistance({ q: 0, r: 0, s: 0 }, { q: 2, r: -1, s: -1 })).toBe(2);
  });

  it("uses radius as the board-size meaning", () => {
    expect(isOnBoard({ q: 3, r: -2, s: -1 }, 3)).toBe(true);
    expect(isOnBoard({ q: 4, r: -2, s: -2 }, 3)).toBe(false);
  });
});

describe("executed V2 compatibility rules", () => {
  it("allows a multi-hex move for one AP per hex", () => {
    expect(movementCost({ q: 0, r: 0, s: 0 }, { q: 3, r: -2, s: -1 })).toBe(3);
  });

  it("supports batched shots", () => {
    expect(shootingCost(3)).toBe(3);
    expect(() => shootingCost(0)).toThrow();
  });

  it("preserves the on-chain 12, 18, 24 upgrade progression", () => {
    expect([3, 4, 5].map(rangeUpgradeCost)).toEqual([12, 18, 24]);
  });

  it("moves floor twenty percent of remaining AP on a kill", () => {
    expect(killActionPointReward(9)).toBe(1);
    expect(killActionPointReward(10)).toBe(2);
  });

  it("does not accrue AP while dead", () => {
    expect(claimableActionPoints(10, 4, false)).toBe(0);
    expect(claimableActionPoints(10, 4, true)).toBe(6);
  });
});

describe("command envelope", () => {
  it("rejects zero-value gifts and malformed cube coordinates", () => {
    const base = {
      commandId: "68dc81f4-7f42-49e6-9bfb-8f56dd0638cf",
      idempotencyKey: "agent-turn-0001",
      expectedVersion: 4,
    };

    expect(
      commandEnvelopeSchema.safeParse({
        ...base,
        command: {
          type: "give",
          targetPlayerId: "b8864e50-6145-4732-a74f-817f08f95561",
          hearts: 0,
          actionPoints: 0,
        },
      }).success,
    ).toBe(false);

    expect(
      commandEnvelopeSchema.safeParse({
        ...base,
        command: { type: "move", target: { q: 1, r: 1, s: 1 } },
      }).success,
    ).toBe(false);
  });
});
