import { describe, expect, it } from "vitest";

import type { GameCommand } from "./commands";
import {
  createLegacyV2Game,
  decideLegacyV2,
  evolveLegacyV2,
  executeLegacyV2Command,
  replayLegacyV2,
} from "./engine";
import { GameRuleError } from "./errors";
import { enumerateBoard, hexDistance, hexKey } from "./hex";
import { projectLegacyV2Game } from "./projection";
import type {
  Decision,
  DecisionContext,
  LegacyV2GameState,
  LegacyV2Settings,
  PrincipalId,
} from "./types";
import { assertValidState } from "./validation";

const OWNER = "00000000-0000-4000-8000-000000000001";
const OUTSIDER = "00000000-0000-4000-8000-000000000002";
const DELEGATE = "00000000-0000-4000-8000-000000000003";
const OTHER_DELEGATE = "00000000-0000-4000-8000-000000000004";
const PRINCIPALS = [
  "10000000-0000-4000-8000-000000000001",
  "10000000-0000-4000-8000-000000000002",
  "10000000-0000-4000-8000-000000000003",
  "10000000-0000-4000-8000-000000000004",
] as const;
const PLAYERS = [
  "20000000-0000-4000-8000-000000000001",
  "20000000-0000-4000-8000-000000000002",
  "20000000-0000-4000-8000-000000000003",
  "20000000-0000-4000-8000-000000000004",
] as const;
const BOUNTY_ONE = "30000000-0000-4000-8000-000000000001";
const BOUNTY_TWO = "30000000-0000-4000-8000-000000000002";

const DEFAULT_SETTINGS: LegacyV2Settings = {
  playerCount: 3,
  boardRadius: 2,
  initialActionPoints: 20,
  initialHearts: 3,
  initialRange: 3,
  epochDurationMs: 1_000,
  minimumBuyIn: "10",
  revealWaitBlocks: 5,
  autoStart: false,
};

describe("legacy-v2 lifecycle and versioning", () => {
  it("joins deterministically, accounts for buy-ins, and requires the owner to start", () => {
    let state = newGame();
    const first = apply(state, joinCommand(0), PRINCIPALS[0], { randomValue: 0 });
    state = first.state;
    expect(state.version).toBe(1);
    expect(state.players[PLAYERS[0]]?.position).toEqual({ q: -2, r: 0, s: 2 });

    state = apply(state, joinCommand(1), PRINCIPALS[1], { randomValue: 0 }).state;
    state = apply(state, joinCommand(2), PRINCIPALS[2], { randomValue: 0 }).state;
    expect(state.seatOrder).toEqual(PLAYERS.slice(0, 3));
    expect(state.prizePool).toBe("30");
    expect(new Set(state.seatOrder.map((id) => hexKey(state.players[id]!.position))).size)
      .toBe(3);

    expectRule(
      () => apply(state, { type: "start" }, PRINCIPALS[0]),
      "not_authorized",
    );
    const outsiderProjection = projectLegacyV2Game(state, {
      principalId: PRINCIPALS[0],
      nowMs: 200,
      blockNumber: 13,
    });
    expect(
      outsiderProjection.legalActions.find((action) => action.type === "start"),
    ).toMatchObject({ enabled: false, reason: "not_authorized" });

    const beforeStart = state;
    const started = apply(state, { type: "start" }, OWNER);
    expect(started.events.map((event) => event.type)).toEqual(["game_started"]);
    expect(started.state.status).toBe("active");
    expect(started.state.version).toBe(beforeStart.version + 1);
    expect(replayLegacyV2(beforeStart, started.events)).toEqual(started.state);
    expect(evolveLegacyV2(beforeStart, started.events[0]!)).toMatchObject({
      version: beforeStart.version,
    });
  });

  it("auto-starts in the final join command while incrementing one version", () => {
    let state = newGame({ autoStart: true });
    state = apply(state, joinCommand(0), PRINCIPALS[0], { randomValue: 0 }).state;
    state = apply(state, joinCommand(1), PRINCIPALS[1], { randomValue: 0 }).state;
    const before = state;
    const finalJoin = apply(state, joinCommand(2), PRINCIPALS[2], {
      randomValue: 0,
    });
    expect(finalJoin.events.map((event) => event.type)).toEqual([
      "player_joined",
      "game_started",
    ]);
    expect(finalJoin.state.status).toBe("active");
    expect(finalJoin.state.version).toBe(before.version + 1);
    expect(replayLegacyV2(before, finalJoin.events)).toEqual(finalJoin.state);
  });

  it("rejects stale command envelopes and invalid board capacity", () => {
    expectRule(
      () => newGame({ playerCount: 8, boardRadius: 1 }),
      "invalid_settings",
    );

    const state = newGame();
    expectRule(
      () =>
        executeLegacyV2Command(
          state,
          {
            commandId: "40000000-0000-4000-8000-000000000001",
            idempotencyKey: "stale-command",
            expectedVersion: 1,
            command: joinCommand(0),
          },
          context(PRINCIPALS[0], { randomValue: 0 }),
        ),
      "invalid_command",
    );
  });
});

describe("legacy-v2 board, accrual, and resources", () => {
  it("spawns deterministically, moves any distance, and collects the destination hearts", () => {
    const state = readyGame();
    const firstSpawn = apply(
      state,
      { type: "poke_heart_spawn" },
      OUTSIDER,
      { blockNumber: 15, randomValue: 7 },
    );
    const secondSpawn = apply(
      state,
      { type: "poke_heart_spawn" },
      OUTSIDER,
      { blockNumber: 15, randomValue: 7 },
    );
    expect(firstSpawn.events).toEqual(secondSpawn.events);
    const spawned = firstSpawn.events[0];
    expect(spawned?.type).toBe("heart_spawned");
    if (!spawned || spawned.type !== "heart_spawned") throw new Error("spawn missing");

    const moverBefore = firstSpawn.state.players[PLAYERS[0]]!;
    const distance = hexDistance(moverBefore.position, spawned.position);
    const moved = apply(
      firstSpawn.state,
      { type: "move", target: spawned.position },
      PRINCIPALS[0],
      { actorPlayerId: PLAYERS[0] },
    );
    expect(moved.events).toEqual([
      expect.objectContaining({
        type: "tank_moved",
        actionPointCost: distance,
        heartsCollected: 1,
      }),
    ]);
    expect(moved.state.players[PLAYERS[0]]).toMatchObject({
      position: spawned.position,
      hearts: DEFAULT_SETTINGS.initialHearts + 1,
      actionPoints: DEFAULT_SETTINGS.initialActionPoints - distance,
    });
    expect(moved.state.boardHearts[hexKey(spawned.position)]).toBeUndefined();
  });

  it("skips a stale or board-full reveal and reschedules from the current block", () => {
    const state = readyGame();
    const late = apply(state, { type: "poke_heart_spawn" }, OUTSIDER, {
      blockNumber: state.nextHeartSpawnBlock + 257,
    });
    expect(late.events).toEqual([
      expect.objectContaining({ type: "heart_spawn_skipped", reason: "late" }),
    ]);
    expect(late.state.nextHeartSpawnBlock).toBe(
      state.nextHeartSpawnBlock + 257 + state.settings.revealWaitBlocks,
    );

    let full = readyGame({ playerCount: 2, boardRadius: 1 });
    const occupied = new Set(
      full.seatOrder.map((id) => hexKey(full.players[id]!.position)),
    );
    full = {
      ...full,
      boardHearts: Object.fromEntries(
        enumerateBoard(1)
          .filter((position) => !occupied.has(hexKey(position)))
          .map((position) => [hexKey(position), 1]),
      ),
    };
    assertValidState(full);
    const skipped = apply(full, { type: "poke_heart_spawn" }, OUTSIDER, {
      blockNumber: full.nextHeartSpawnBlock,
      randomValue: 0,
    });
    expect(skipped.events[0]).toMatchObject({
      type: "heart_spawn_skipped",
      reason: "board_full",
    });
  });

  it("lets anyone drip elapsed absolute epochs but never double-drips", () => {
    const state = readyGame();
    const dripped = apply(
      state,
      { type: "claim_action_points", targetPlayerId: PLAYERS[1] },
      OUTSIDER,
      { nowMs: 3_500 },
    );
    expect(dripped.events[0]).toMatchObject({
      type: "action_points_dripped",
      amount: 3,
      epoch: 3,
    });
    expect(dripped.state.players[PLAYERS[1]]).toMatchObject({
      actionPoints: 23,
      lastDripEpoch: 3,
    });
    expectRule(
      () =>
        apply(
          dripped.state,
          { type: "claim_action_points", targetPlayerId: PLAYERS[1] },
          OUTSIDER,
          { nowMs: 3_500 },
        ),
      "already_dripped",
    );
  });
});

describe("legacy-v2 combat, giving, and podium", () => {
  it("batches shots, transfers kill AP, awards accepted bounties, and completes podium claims", () => {
    let state = readyGame({ initialHearts: 2 });
    state = apply(
      state,
      {
        type: "post_bounty",
        bountyId: BOUNTY_ONE,
        targetPlayerId: PLAYERS[1],
        amount: "100",
      },
      PRINCIPALS[2],
      { actorPlayerId: PLAYERS[2] },
    ).state;
    state = apply(
      state,
      { type: "accept_bounty", bountyId: BOUNTY_ONE },
      PRINCIPALS[0],
      { actorPlayerId: PLAYERS[0] },
    ).state;
    state = apply(
      state,
      {
        type: "post_bounty",
        bountyId: BOUNTY_TWO,
        targetPlayerId: PLAYERS[0],
        amount: "50",
      },
      PRINCIPALS[2],
      { actorPlayerId: PLAYERS[2] },
    ).state;

    const beforeKill = state;
    const firstKill = apply(
      state,
      { type: "shoot", targetPlayerId: PLAYERS[1], shots: 2 },
      PRINCIPALS[0],
      { actorPlayerId: PLAYERS[0] },
    );
    expect(firstKill.events.map((event) => event.type)).toEqual([
      "tank_shot",
      "kill_reward_transferred",
      "tank_died",
      "bounty_awarded",
    ]);
    expect(firstKill.state.version).toBe(beforeKill.version + 1);
    expect(firstKill.state.players[PLAYERS[0]]?.actionPoints).toBe(22);
    expect(firstKill.state.players[PLAYERS[1]]?.actionPoints).toBe(16);
    expect(firstKill.state.bountyCredits[PLAYERS[0]]).toBe("100");
    expect(replayLegacyV2(beforeKill, firstKill.events)).toEqual(firstKill.state);

    const withdrawn = apply(
      firstKill.state,
      { type: "withdraw_bounty", recipient: "acct:winner" },
      PRINCIPALS[0],
      { actorPlayerId: PLAYERS[0] },
    );
    expect(withdrawn.state.bountyCredits[PLAYERS[0]]).toBe("0");

    const ended = apply(
      withdrawn.state,
      { type: "shoot", targetPlayerId: PLAYERS[2], shots: 2 },
      PRINCIPALS[0],
      { actorPlayerId: PLAYERS[0] },
    );
    expect(ended.events.map((event) => event.type)).toEqual([
      "tank_shot",
      "kill_reward_transferred",
      "tank_died",
      "game_ended",
    ]);
    expect(ended.state.status).toBe("ended");
    expect(ended.state.podium).toEqual([PLAYERS[0], PLAYERS[2], PLAYERS[1]]);

    expectRule(
      () =>
        apply(
          ended.state,
          { type: "cancel_bounty", bountyId: BOUNTY_TWO },
          PRINCIPALS[1],
          { actorPlayerId: PLAYERS[1] },
        ),
      "not_authorized",
    );
    state = apply(
      ended.state,
      { type: "cancel_bounty", bountyId: BOUNTY_TWO },
      PRINCIPALS[2],
      { actorPlayerId: PLAYERS[2] },
    ).state;
    expect(state.bountyCredits[PLAYERS[2]]).toBe("50");

    const winnerClaim = apply(
      state,
      { type: "claim_podium_reward", recipient: "acct:first" },
      PRINCIPALS[0],
      { actorPlayerId: PLAYERS[0] },
    );
    expect(winnerClaim.events[0]).toMatchObject({
      type: "podium_reward_claimed",
      claim: { place: 1, sharePercent: 60, amount: "18" },
    });
    const secondClaim = apply(
      winnerClaim.state,
      { type: "claim_podium_reward", recipient: "acct:second" },
      PRINCIPALS[2],
      { actorPlayerId: PLAYERS[2] },
    );
    expect(secondClaim.events[0]).toMatchObject({
      claim: { place: 2, sharePercent: 30, amount: "9" },
    });
    const thirdClaim = apply(
      secondClaim.state,
      { type: "claim_podium_reward", recipient: "acct:third" },
      PRINCIPALS[1],
      { actorPlayerId: PLAYERS[1] },
    );
    expect(thirdClaim.events[0]).toMatchObject({
      claim: { place: 3, sharePercent: 10, amount: "3" },
    });
    expectRule(
      () =>
        apply(
          thirdClaim.state,
          { type: "claim_podium_reward", recipient: "acct:again" },
          PRINCIPALS[0],
          { actorPlayerId: PLAYERS[0] },
        ),
      "reward_already_claimed",
    );
  });

  it("revives with a heart, resets drip, supports self-shoot and last-heart sacrifice", () => {
    let state = readyGame();
    state = apply(
      state,
      { type: "shoot", targetPlayerId: PLAYERS[1], shots: 3 },
      PRINCIPALS[0],
      { actorPlayerId: PLAYERS[0] },
    ).state;
    expect(state.deadOrder).toEqual([PLAYERS[1]]);
    expectRule(
      () =>
        apply(
          state,
          {
            type: "give",
            targetPlayerId: PLAYERS[1],
            hearts: 0,
            actionPoints: 1,
          },
          PRINCIPALS[2],
          { actorPlayerId: PLAYERS[2] },
        ),
      "dead_tank_requires_heart",
    );

    const revived = apply(
      state,
      {
        type: "give",
        targetPlayerId: PLAYERS[1],
        hearts: 1,
        actionPoints: 2,
      },
      PRINCIPALS[2],
      { actorPlayerId: PLAYERS[2], nowMs: 1_500 },
    );
    expect(revived.events.map((event) => event.type)).toEqual([
      "resources_given",
      "tank_revived",
    ]);
    expect(revived.state.players[PLAYERS[1]]).toMatchObject({
      hearts: 1,
      actionPoints: 18,
      lastDripEpoch: 1,
    });
    expect(revived.state.deadOrder).toEqual([]);

    const selfKilled = apply(
      revived.state,
      { type: "shoot", targetPlayerId: PLAYERS[1], shots: 1 },
      PRINCIPALS[1],
      { actorPlayerId: PLAYERS[1] },
    );
    expect(selfKilled.events.map((event) => event.type)).toEqual([
      "tank_shot",
      "kill_reward_transferred",
      "tank_died",
    ]);
    expect(selfKilled.state.deadOrder).toEqual([PLAYERS[1]]);

    state = apply(
      selfKilled.state,
      { type: "shoot", targetPlayerId: PLAYERS[2], shots: 1 },
      PRINCIPALS[2],
      { actorPlayerId: PLAYERS[2] },
    ).state;
    expect(state.players[PLAYERS[2]]?.hearts).toBe(1);

    const sacrifice = apply(
      state,
      {
        type: "give",
        targetPlayerId: PLAYERS[1],
        hearts: 1,
        actionPoints: 0,
      },
      PRINCIPALS[2],
      { actorPlayerId: PLAYERS[2], nowMs: 2_500 },
    );
    expect(sacrifice.events.map((event) => event.type)).toEqual([
      "resources_given",
      "tank_revived",
      "tank_died",
    ]);
    expect(sacrifice.state.players[PLAYERS[1]]?.hearts).toBe(1);
    expect(sacrifice.state.players[PLAYERS[2]]?.hearts).toBe(0);
    expect(sacrifice.state.deadOrder).toEqual([PLAYERS[2]]);
    expect(sacrifice.state.status).toBe("active");
  });
});

describe("legacy-v2 diplomacy, delegation, and jury", () => {
  it("upgrades, delegates permanently, and enforces treaty expiry inclusively", () => {
    let state = readyGame();
    state = apply(
      state,
      { type: "delegate", delegatePrincipalId: DELEGATE },
      PRINCIPALS[0],
      { actorPlayerId: PLAYERS[0] },
    ).state;
    expectRule(
      () =>
        apply(
          state,
          { type: "delegate", delegatePrincipalId: OTHER_DELEGATE },
          DELEGATE,
          { actorPlayerId: PLAYERS[0] },
        ),
      "delegate_cannot_delegate",
    );

    const moved = apply(
      state,
      { type: "move", target: { q: 0, r: 0, s: 0 } },
      DELEGATE,
      { actorPlayerId: PLAYERS[0] },
    );
    const upgraded = apply(
      moved.state,
      { type: "upgrade" },
      DELEGATE,
      { actorPlayerId: PLAYERS[0] },
    );
    expect(upgraded.state.players[PLAYERS[0]]).toMatchObject({
      range: 4,
      actionPoints: 6,
    });

    state = apply(
      upgraded.state,
      {
        type: "propose_non_aggression",
        targetPlayerId: PLAYERS[1],
        expiresEpoch: 3,
      },
      DELEGATE,
      { actorPlayerId: PLAYERS[0] },
    ).state;
    state = apply(
      state,
      { type: "accept_non_aggression", proposerPlayerId: PLAYERS[0] },
      PRINCIPALS[1],
      { actorPlayerId: PLAYERS[1] },
    ).state;

    expectRule(
      () =>
        apply(
          state,
          { type: "shoot", targetPlayerId: PLAYERS[1], shots: 1 },
          DELEGATE,
          { actorPlayerId: PLAYERS[0], nowMs: 3_000 },
        ),
      "treaty_active",
    );
    const expired = apply(
      state,
      { type: "shoot", targetPlayerId: PLAYERS[1], shots: 1 },
      DELEGATE,
      { actorPlayerId: PLAYERS[0], nowMs: 4_000 },
    );
    expect(expired.events[0]).toMatchObject({ type: "tank_shot", shots: 1 });
  });

  it("closes a dead-jury epoch at strict majority and delays a low-AP drip", () => {
    let state = readyGame({ initialActionPoints: 3, initialHearts: 2 });
    state = apply(
      state,
      { type: "shoot", targetPlayerId: PLAYERS[1], shots: 2 },
      PRINCIPALS[0],
      { actorPlayerId: PLAYERS[0] },
    ).state;
    expect(state.players[PLAYERS[0]]?.actionPoints).toBe(1);

    const cursed = apply(
      state,
      { type: "curse_vote", targetPlayerId: PLAYERS[0] },
      PRINCIPALS[1],
      { actorPlayerId: PLAYERS[1], nowMs: 1_000 },
    );
    expect(cursed.events.map((event) => event.type)).toEqual([
      "curse_vote_cast",
      "tank_cursed",
    ]);
    expect(cursed.events[1]).toMatchObject({ effect: "delay_drip" });
    expect(cursed.state.players[PLAYERS[0]]?.lastDripEpoch).toBe(1);
    expect(cursed.state.juryByEpoch["1"]).toMatchObject({
      closed: true,
      cursedPlayerId: PLAYERS[0],
    });
    expectRule(
      () =>
        apply(
          cursed.state,
          { type: "claim_action_points", targetPlayerId: PLAYERS[0] },
          OUTSIDER,
          { nowMs: 1_000 },
        ),
      "already_dripped",
    );
    const laterDrip = apply(
      cursed.state,
      { type: "claim_action_points", targetPlayerId: PLAYERS[0] },
      OUTSIDER,
      { nowMs: 2_000 },
    );
    expect(laterDrip.events[0]).toMatchObject({ amount: 1, epoch: 2 });
  });

  it("removes one AP when the cursed target has more than one", () => {
    let state = readyGame({ initialActionPoints: 4, initialHearts: 2 });
    state = apply(
      state,
      { type: "shoot", targetPlayerId: PLAYERS[1], shots: 2 },
      PRINCIPALS[0],
      { actorPlayerId: PLAYERS[0] },
    ).state;
    const before = state.players[PLAYERS[0]]!.actionPoints;
    const cursed = apply(
      state,
      { type: "curse_vote", targetPlayerId: PLAYERS[0] },
      PRINCIPALS[1],
      { actorPlayerId: PLAYERS[1], nowMs: 1_000 },
    );
    expect(cursed.events[1]).toMatchObject({ effect: "remove_action_point" });
    expect(cursed.state.players[PLAYERS[0]]?.actionPoints).toBe(before - 1);
  });
});

describe("legacy-v2 projection", () => {
  it("omits principal allowlists and identities while exposing viewer-scoped legal actions", () => {
    const settings = {
      allowedPrincipalIds: [...PRINCIPALS.slice(0, 3)],
    } satisfies Partial<LegacyV2Settings>;
    const state = readyGame(settings);
    const projection = projectLegacyV2Game(state, {
      principalId: PRINCIPALS[0],
      nowMs: 1_500,
      blockNumber: 14,
    });
    expect(projection.settings.restricted).toBe(true);
    expect("allowedPrincipalIds" in projection.settings).toBe(false);
    const serialized = JSON.stringify(projection);
    expect(serialized).not.toContain(OWNER);
    expect(serialized).not.toContain(PRINCIPALS[1]);
    expect(projection.players.find((player) => player.playerId === PLAYERS[0]))
      .toMatchObject({ ownedByViewer: true, controllableByViewer: true });
    expect(
      projection.legalActions.find(
        (action) => action.type === "move" && action.actorPlayerId === PLAYERS[0],
      ),
    ).toMatchObject({ enabled: true });
    expect(
      projection.legalActions.find(
        (action) =>
          action.type === "claim_action_points" &&
          action.details.targetPlayerId === PLAYERS[0],
      ),
    ).toMatchObject({ enabled: true, details: { claimable: 1 } });
  });
});

function newGame(
  overrides: Partial<LegacyV2Settings> = {},
): LegacyV2GameState {
  return createLegacyV2Game({
    gameId: "50000000-0000-4000-8000-000000000001",
    ownerPrincipalId: OWNER,
    settings: { ...DEFAULT_SETTINGS, ...overrides },
    nowMs: 100,
    blockNumber: 10,
  });
}

function readyGame(
  overrides: Partial<LegacyV2Settings> = {},
): LegacyV2GameState {
  let state = newGame(overrides);
  for (let index = 0; index < state.settings.playerCount; index += 1) {
    const principal = PRINCIPALS[index];
    if (!principal || !PLAYERS[index]) {
      throw new Error("Test fixture supports at most four players");
    }
    state = apply(state, joinCommand(index), principal, { randomValue: 0 }).state;
  }
  if (state.status === "lobby") {
    state = apply(state, { type: "start" }, OWNER).state;
  }
  return state;
}

function joinCommand(index: number): GameCommand {
  const playerId = PLAYERS[index];
  if (!playerId) throw new Error("Unknown fixture player");
  return {
    type: "join",
    playerId,
    handle: `tank-${index + 1}`,
    buyInAmount: "10",
  };
}

function apply(
  state: LegacyV2GameState,
  command: GameCommand,
  principalId: PrincipalId,
  options: {
    readonly nowMs?: number;
    readonly blockNumber?: number;
    readonly actorPlayerId?: string;
    readonly randomValue?: number;
  } = {},
): Decision {
  return decideLegacyV2(state, command, context(principalId, options));
}

function context(
  principalId: PrincipalId,
  options: {
    readonly nowMs?: number;
    readonly blockNumber?: number;
    readonly actorPlayerId?: string;
    readonly randomValue?: number;
  } = {},
): DecisionContext {
  return {
    principalId,
    nowMs: options.nowMs ?? 200,
    blockNumber: options.blockNumber ?? 13,
    ...(options.actorPlayerId === undefined
      ? {}
      : { actorPlayerId: options.actorPlayerId }),
    ...(options.randomValue === undefined
      ? {}
      : { randomValue: options.randomValue }),
  };
}

function expectRule(
  operation: () => unknown,
  code: GameRuleError["code"],
): void {
  try {
    operation();
    throw new Error(`Expected GameRuleError(${code})`);
  } catch (error) {
    expect(error).toBeInstanceOf(GameRuleError);
    expect((error as GameRuleError).code).toBe(code);
  }
}
