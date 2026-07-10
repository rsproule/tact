import { describe, expect, it } from "vitest";

import { chooseLegacyV2BotCommand } from "./bots";
import { createLegacyV2Game, decideLegacyV2 } from "./engine";
import { projectLegacyV2Game } from "./projection";
import type { LegacyV2GameState, LegacyV2Settings, TankState } from "./types";
import { assertValidState } from "./validation";

const OWNER = "60000000-0000-4000-8000-000000000001";
const OUTSIDER = "60000000-0000-4000-8000-000000000002";
const PRINCIPALS = [
  "61000000-0000-4000-8000-000000000001",
  "61000000-0000-4000-8000-000000000002",
  "61000000-0000-4000-8000-000000000003",
] as const;
const PLAYERS = [
  "62000000-0000-4000-8000-000000000001",
  "62000000-0000-4000-8000-000000000002",
  "62000000-0000-4000-8000-000000000003",
] as const;

const SETTINGS: LegacyV2Settings = {
  playerCount: 3,
  boardRadius: 2,
  initialActionPoints: 20,
  initialHearts: 3,
  initialRange: 3,
  epochDurationMs: 1_000,
  minimumBuyIn: "0",
  revealWaitBlocks: 5,
  autoStart: false,
};

describe("deterministic legacy-v2 bots", () => {
  it("uses the explicit tie-breaker only between equally ranked attack targets", () => {
    let state = readyGame();
    state = replacePlayers(state, [
      { ...state.players[PLAYERS[0]]!, position: { q: 0, r: 0, s: 0 } },
      { ...state.players[PLAYERS[1]]!, position: { q: 1, r: -1, s: 0 } },
      { ...state.players[PLAYERS[2]]!, position: { q: -1, r: 1, s: 0 } },
    ]);
    const projection = projectLegacyV2Game(state, {
      principalId: PRINCIPALS[0],
      nowMs: 200,
      blockNumber: 13,
    });
    const first = chooseLegacyV2BotCommand(projection, {
      botPlayerId: PLAYERS[0],
      strategy: "attack",
      tieBreaker: 0,
    });
    const repeated = chooseLegacyV2BotCommand(projection, {
      botPlayerId: PLAYERS[0],
      strategy: "attack",
      tieBreaker: 0,
    });
    const alternate = chooseLegacyV2BotCommand(projection, {
      botPlayerId: PLAYERS[0],
      strategy: "attack",
      tieBreaker: 1,
    });
    expect(repeated).toEqual(first);
    expect(first?.command).toEqual({
      type: "shoot",
      targetPlayerId: PLAYERS[1],
      shots: 3,
    });
    expect(alternate?.command).toEqual({
      type: "shoot",
      targetPlayerId: PLAYERS[2],
      shots: 3,
    });

    if (!first) throw new Error("attack bot should act");
    const executed = decideLegacyV2(state, first.command, {
      principalId: PRINCIPALS[0],
      actorPlayerId: first.actorPlayerId,
      nowMs: 200,
      blockNumber: 13,
    });
    expect(executed.events[0]).toMatchObject({ type: "tank_shot" });
  });

  it("makes idle bots perform only AP and reveal maintenance", () => {
    let state = readyGame();
    let projection = projectLegacyV2Game(state, {
      principalId: PRINCIPALS[0],
      nowMs: 1_500,
      blockNumber: 14,
    });
    const drip = chooseLegacyV2BotCommand(projection, {
      botPlayerId: PLAYERS[0],
      strategy: "idle",
      tieBreaker: 9,
    });
    expect(drip?.command).toEqual({
      type: "claim_action_points",
      targetPlayerId: PLAYERS[0],
    });
    if (!drip) throw new Error("idle bot should drip");
    state = decideLegacyV2(state, drip.command, {
      principalId: PRINCIPALS[0],
      actorPlayerId: drip.actorPlayerId,
      nowMs: 1_500,
      blockNumber: 14,
    }).state;

    projection = projectLegacyV2Game(state, {
      principalId: PRINCIPALS[0],
      nowMs: 1_500,
      blockNumber: 15,
    });
    const reveal = chooseLegacyV2BotCommand(projection, {
      botPlayerId: PLAYERS[0],
      strategy: "idle",
      tieBreaker: 9,
    });
    expect(reveal).toMatchObject({
      command: { type: "poke_heart_spawn" },
      randomValue: 9,
    });
    if (!reveal) throw new Error("idle bot should reveal");
    const revealed = decideLegacyV2(state, reveal.command, {
      principalId: PRINCIPALS[0],
      actorPlayerId: reveal.actorPlayerId,
      ...(reveal.randomValue === undefined
        ? {}
        : { randomValue: reveal.randomValue }),
      nowMs: 1_500,
      blockNumber: 15,
    });
    expect(revealed.events[0]?.type).toBe("heart_spawned");

    const quiet = chooseLegacyV2BotCommand(
      projectLegacyV2Game(revealed.state, {
        principalId: PRINCIPALS[0],
        nowMs: 1_500,
        blockNumber: 16,
      }),
      { botPlayerId: PLAYERS[0], strategy: "idle", tieBreaker: 9 },
    );
    expect(quiet).toBeNull();
  });

  it("makes medics heal the most injured reachable tank", () => {
    let state = readyGame();
    state = replacePlayers(state, [
      { ...state.players[PLAYERS[1]]!, hearts: 1 },
    ]);
    const choice = chooseLegacyV2BotCommand(
      projectLegacyV2Game(state, {
        principalId: PRINCIPALS[0],
        nowMs: 200,
        blockNumber: 13,
      }),
      { botPlayerId: PLAYERS[0], strategy: "medic", tieBreaker: 0 },
    );
    expect(choice?.command).toEqual({
      type: "give",
      targetPlayerId: PLAYERS[1],
      hearts: 1,
      actionPoints: 0,
    });
    if (!choice) throw new Error("medic should act");
    const healed = decideLegacyV2(state, choice.command, {
      principalId: PRINCIPALS[0],
      actorPlayerId: choice.actorPlayerId,
      nowMs: 200,
      blockNumber: 13,
    });
    expect(healed.state.players[PLAYERS[1]]?.hearts).toBe(2);
  });

  it("makes hoarders upgrade until an enemy is in range, then attack", () => {
    let state = readyGame();
    state = replacePlayers(state, [
      {
        ...state.players[PLAYERS[0]]!,
        position: { q: 0, r: 0, s: 0 },
        range: 1,
      },
      { ...state.players[PLAYERS[1]]!, position: { q: 2, r: -2, s: 0 } },
      { ...state.players[PLAYERS[2]]!, position: { q: -2, r: 2, s: 0 } },
    ]);
    let projection = projectLegacyV2Game(state, {
      principalId: PRINCIPALS[0],
      nowMs: 200,
      blockNumber: 13,
    });
    const upgrade = chooseLegacyV2BotCommand(projection, {
      botPlayerId: PLAYERS[0],
      strategy: "hoard",
      tieBreaker: 0,
    });
    expect(upgrade?.command).toEqual({ type: "upgrade" });
    if (!upgrade) throw new Error("hoard bot should upgrade");
    state = decideLegacyV2(state, upgrade.command, {
      principalId: PRINCIPALS[0],
      actorPlayerId: upgrade.actorPlayerId,
      nowMs: 200,
      blockNumber: 13,
    }).state;

    projection = projectLegacyV2Game(state, {
      principalId: PRINCIPALS[0],
      nowMs: 200,
      blockNumber: 13,
    });
    const attack = chooseLegacyV2BotCommand(projection, {
      botPlayerId: PLAYERS[0],
      strategy: "hoard",
      tieBreaker: 0,
    });
    expect(attack?.command.type).toBe("shoot");
  });

  it("makes sentinels shoot in range and active dead bots jury-vote", () => {
    let state = readyGame();
    const sentinel = chooseLegacyV2BotCommand(
      projectLegacyV2Game(state, {
        principalId: PRINCIPALS[0],
        nowMs: 200,
        blockNumber: 13,
      }),
      { botPlayerId: PLAYERS[0], strategy: "sentinel", tieBreaker: 0 },
    );
    expect(sentinel?.command.type).toBe("shoot");

    state = {
      ...state,
      players: {
        ...state.players,
        [PLAYERS[0]]: { ...state.players[PLAYERS[0]]!, hearts: 0 },
      },
      deadOrder: [PLAYERS[0]],
    };
    assertValidState(state);
    const vote = chooseLegacyV2BotCommand(
      projectLegacyV2Game(state, {
        principalId: PRINCIPALS[0],
        nowMs: 200,
        blockNumber: 13,
      }),
      { botPlayerId: PLAYERS[0], strategy: "attack", tieBreaker: 0 },
    );
    expect(vote?.command.type).toBe("curse_vote");
    if (!vote) throw new Error("dead bot should vote");
    expect(
      decideLegacyV2(state, vote.command, {
        principalId: PRINCIPALS[0],
        actorPlayerId: vote.actorPlayerId,
        nowMs: 200,
        blockNumber: 13,
      }).events[0]?.type,
    ).toBe("curse_vote_cast");
  });

  it("refuses to act without projected control and validates tie-break entropy", () => {
    const state = readyGame();
    const projection = projectLegacyV2Game(state, {
      principalId: OUTSIDER,
      nowMs: 200,
      blockNumber: 13,
    });
    expect(
      chooseLegacyV2BotCommand(projection, {
        botPlayerId: PLAYERS[0],
        strategy: "attack",
        tieBreaker: 0,
      }),
    ).toBeNull();
    expect(() =>
      chooseLegacyV2BotCommand(projection, {
        botPlayerId: PLAYERS[0],
        strategy: "attack",
        tieBreaker: -1,
      }),
    ).toThrow(RangeError);
  });
});

function readyGame(): LegacyV2GameState {
  let state = createLegacyV2Game({
    gameId: "63000000-0000-4000-8000-000000000001",
    ownerPrincipalId: OWNER,
    settings: SETTINGS,
    nowMs: 100,
    blockNumber: 10,
  });
  for (let index = 0; index < 3; index += 1) {
    state = decideLegacyV2(
      state,
      {
        type: "join",
        playerId: PLAYERS[index]!,
        handle: `bot-fixture-${index}`,
        buyInAmount: "0",
      },
      {
        principalId: PRINCIPALS[index]!,
        nowMs: 200,
        blockNumber: 13,
        randomValue: 0,
      },
    ).state;
  }
  return decideLegacyV2(state, { type: "start" }, {
    principalId: OWNER,
    nowMs: 200,
    blockNumber: 13,
  }).state;
}

function replacePlayers(
  state: LegacyV2GameState,
  replacements: readonly TankState[],
): LegacyV2GameState {
  const next = {
    ...state,
    players: {
      ...state.players,
      ...Object.fromEntries(
        replacements.map((player) => [player.playerId, player]),
      ),
    },
  };
  assertValidState(next);
  return next;
}
