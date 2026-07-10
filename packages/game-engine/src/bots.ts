import type { GameCommand } from "./commands";
import { hexDistance, hexKey, type Hex } from "./hex";
import type {
  LegacyV2GameProjection,
  LegalAction,
  ProjectedTank,
} from "./projection";
import type { PlayerId } from "./types";

export const LEGACY_V2_BOT_STRATEGIES = [
  "attack",
  "medic",
  "hoard",
  "sentinel",
  "idle",
] as const;

export type LegacyV2BotStrategy =
  (typeof LEGACY_V2_BOT_STRATEGIES)[number];

export interface LegacyV2BotInput {
  readonly botPlayerId: PlayerId;
  readonly strategy: LegacyV2BotStrategy;
  /**
   * Explicit, public entropy used only to choose among equally ranked options.
   * Supplying the same projection and tie-breaker always produces the same result.
   */
  readonly tieBreaker: number;
}

export interface LegacyV2BotDecision {
  readonly actorPlayerId: PlayerId;
  readonly command: GameCommand;
  /** Pass this through DecisionContext for commands that require entropy. */
  readonly randomValue?: number;
  readonly rationale: string;
}

/**
 * Chooses a deterministic command using only public/projected state. It never
 * reads owner identities, delegate identities, private state, or wall-clock data.
 */
export function chooseLegacyV2BotCommand(
  projection: LegacyV2GameProjection,
  input: LegacyV2BotInput,
): LegacyV2BotDecision | null {
  assertTieBreaker(input.tieBreaker);
  const bot = projection.players.find(
    (player) => player.playerId === input.botPlayerId,
  );
  if (!bot || !bot.controllableByViewer || projection.status !== "active") {
    return null;
  }

  const ownDrip = findEnabledAction(
    projection,
    "claim_action_points",
    null,
    (action) => action.details.targetPlayerId === bot.playerId,
  );
  if (bot.alive && ownDrip) {
    return decision(bot, {
      type: "claim_action_points",
      targetPlayerId: bot.playerId,
    }, "claim accrued action points");
  }

  const heartSpawn = findEnabledAction(
    projection,
    "poke_heart_spawn",
    null,
  );
  if (heartSpawn) {
    return {
      ...decision(bot, { type: "poke_heart_spawn" }, "reveal the due public heart"),
      randomValue: input.tieBreaker,
    };
  }

  if (!bot.alive) {
    return chooseDeadTankVote(projection, bot, input);
  }

  switch (input.strategy) {
    case "attack":
      return chooseAttack(projection, bot, input.tieBreaker);
    case "medic":
      return chooseMedic(projection, bot, input.tieBreaker);
    case "hoard":
      return chooseHoard(projection, bot, input.tieBreaker);
    case "sentinel":
      return chooseSentinel(projection, bot, input.tieBreaker);
    case "idle":
      return null;
    default:
      return assertNever(input.strategy);
  }
}

/** Backwards-friendly action-oriented alias. */
export const decideLegacyV2Bot = chooseLegacyV2BotCommand;

function chooseAttack(
  projection: LegacyV2GameProjection,
  bot: ProjectedTank,
  tieBreaker: number,
): LegacyV2BotDecision | null {
  const target = chooseEnemy(projection, bot, tieBreaker);
  if (!target) return null;

  const shot = chooseShot(projection, bot, [target], tieBreaker);
  if (shot) return shot;

  return moveToward(projection, bot, target.position, tieBreaker, "close on enemy");
}

function chooseSentinel(
  projection: LegacyV2GameProjection,
  bot: ProjectedTank,
  tieBreaker: number,
): LegacyV2BotDecision | null {
  const enemies = livingOthers(projection, bot);
  const shot = chooseShot(projection, bot, enemies, tieBreaker);
  if (shot) return shot;

  const upgrade = findEnabledAction(projection, "upgrade", bot.playerId);
  return upgrade
    ? decision(bot, { type: "upgrade" }, "extend stationary defense range")
    : null;
}

function chooseHoard(
  projection: LegacyV2GameProjection,
  bot: ProjectedTank,
  tieBreaker: number,
): LegacyV2BotDecision | null {
  const enemies = livingOthers(projection, bot);
  const shot = chooseShot(projection, bot, enemies, tieBreaker);
  if (shot) return shot;
  const upgrade = findEnabledAction(projection, "upgrade", bot.playerId);
  if (upgrade) {
    return decision(bot, { type: "upgrade" }, "extend range until an enemy is reachable");
  }
  return null;
}

function chooseMedic(
  projection: LegacyV2GameProjection,
  bot: ProjectedTank,
  tieBreaker: number,
): LegacyV2BotDecision | null {
  const others = projection.players.filter(
    (candidate) => candidate.playerId !== bot.playerId,
  );
  const dead = others.filter((candidate) => !candidate.alive);
  const wounded = others.filter(
    (candidate) => candidate.alive &&
      candidate.hearts < projection.settings.initialHearts,
  );
  const lowestActionPoints = Math.min(
    ...others.map((candidate) => candidate.actionPoints),
  );
  const apPoor = others.filter(
    (candidate) => candidate.alive &&
      candidate.actionPoints === lowestActionPoints,
  );
  const targets = dead.length > 0 ? dead : wounded.length > 0 ? wounded : apPoor;
  if (targets.length === 0) return null;

  const lowestHearts = Math.min(...targets.map((target) => target.hearts));
  const mostInjured = targets.filter((target) => target.hearts === lowestHearts);
  const nearestDistance = Math.min(
    ...mostInjured.map((target) => hexDistance(bot.position, target.position)),
  );
  const candidates = mostInjured.filter(
    (target) => hexDistance(bot.position, target.position) === nearestDistance,
  );
  const target = stableTiePick(candidates, tieBreaker, (candidate) => candidate.playerId);
  const giveAction = findEnabledAction(projection, "give", bot.playerId);
  const giveTargets = resourceTargets(giveAction);
  const canGive = giveTargets.some(
    (candidate) => candidate.playerId === target.playerId,
  );
  if (canGive && target.hearts < projection.settings.initialHearts && bot.hearts > 1) {
    return decision(
      bot,
      {
        type: "give",
        targetPlayerId: target.playerId,
        hearts: 1,
        actionPoints: 0,
      },
      target.alive ? "heal the most injured tank" : "revive a fallen tank",
    );
  }

  if (canGive && target.alive && bot.actionPoints > 0) {
    return decision(
      bot,
      {
        type: "give",
        targetPlayerId: target.playerId,
        hearts: 0,
        actionPoints: 1,
      },
      "supply an action point to another tank",
    );
  }

  return moveToward(
    projection,
    bot,
    target.position,
    tieBreaker,
    "move into healing range",
  );
}

function chooseShot(
  projection: LegacyV2GameProjection,
  bot: ProjectedTank,
  preferredTargets: readonly ProjectedTank[],
  tieBreaker: number,
): LegacyV2BotDecision | null {
  const shootAction = findEnabledAction(projection, "shoot", bot.playerId);
  const legalTargets = shotTargets(shootAction).filter((candidate) =>
    preferredTargets.some((target) => target.playerId === candidate.playerId),
  );
  if (legalTargets.length === 0) return null;

  const killable = legalTargets.filter((target) => {
    const projected = projection.players.find(
      (player) => player.playerId === target.playerId,
    );
    return projected !== undefined && target.maxShots >= projected.hearts;
  });
  const pool = killable.length > 0 ? killable : legalTargets;
  const shortestDistance = Math.min(...pool.map((target) => target.distance));
  const nearest = pool.filter((target) => target.distance === shortestDistance);
  const target = stableTiePick(nearest, tieBreaker, (candidate) => candidate.playerId);
  const projectedTarget = projection.players.find(
    (player) => player.playerId === target.playerId,
  );
  if (!projectedTarget) return null;
  const shots = Math.min(target.maxShots, projectedTarget.hearts);
  return decision(
    bot,
    { type: "shoot", targetPlayerId: target.playerId, shots },
    killable.length > 0 ? "finish a killable target" : "attack the nearest target",
  );
}

function chooseEnemy(
  projection: LegacyV2GameProjection,
  bot: ProjectedTank,
  tieBreaker: number,
): ProjectedTank | null {
  const enemies = livingOthers(projection, bot);
  if (enemies.length === 0) return null;
  const nearestDistance = Math.min(
    ...enemies.map((enemy) => hexDistance(bot.position, enemy.position)),
  );
  const nearest = enemies.filter(
    (enemy) => hexDistance(bot.position, enemy.position) === nearestDistance,
  );
  const lowestHearts = Math.min(...nearest.map((enemy) => enemy.hearts));
  return stableTiePick(
    nearest.filter((enemy) => enemy.hearts === lowestHearts),
    tieBreaker,
    (enemy) => enemy.playerId,
  );
}

function moveToward(
  projection: LegacyV2GameProjection,
  bot: ProjectedTank,
  target: Hex,
  tieBreaker: number,
  rationale: string,
): LegacyV2BotDecision | null {
  const moveAction = findEnabledAction(projection, "move", bot.playerId);
  const destinations = moveDestinations(moveAction);
  if (destinations.length === 0) return null;
  const bestDistance = Math.min(
    ...destinations.map((destination) => hexDistance(destination, target)),
  );
  const closest = destinations.filter(
    (destination) => hexDistance(destination, target) === bestDistance,
  );
  const cheapestCost = Math.min(
    ...closest.map((destination) => hexDistance(bot.position, destination)),
  );
  const cheapest = closest.filter(
    (destination) => hexDistance(bot.position, destination) === cheapestCost,
  );
  const destination = stableTiePick(cheapest, tieBreaker, hexKey);
  return decision(bot, { type: "move", target: destination }, rationale);
}

function chooseDeadTankVote(
  projection: LegacyV2GameProjection,
  bot: ProjectedTank,
  input: LegacyV2BotInput,
): LegacyV2BotDecision | null {
  if (input.strategy === "idle") return null;
  const action = findEnabledAction(projection, "curse_vote", bot.playerId);
  const allowed = stringArray(action?.details.targetPlayerIds);
  const targets = projection.players.filter(
    (candidate) => candidate.alive && allowed.includes(candidate.playerId),
  );
  if (targets.length === 0) return null;
  const highestActionPoints = Math.max(...targets.map((target) => target.actionPoints));
  const strongest = targets.filter(
    (target) => target.actionPoints === highestActionPoints,
  );
  const target = stableTiePick(strongest, input.tieBreaker, (candidate) => candidate.playerId);
  return decision(
    bot,
    { type: "curse_vote", targetPlayerId: target.playerId },
    "jury-vote against the strongest survivor",
  );
}

function livingOthers(
  projection: LegacyV2GameProjection,
  bot: ProjectedTank,
): readonly ProjectedTank[] {
  return projection.players.filter(
    (candidate) => candidate.alive && candidate.playerId !== bot.playerId,
  );
}

function findEnabledAction(
  projection: LegacyV2GameProjection,
  type: GameCommand["type"],
  actorPlayerId: PlayerId | null,
  predicate: (action: LegalAction) => boolean = () => true,
): LegalAction | undefined {
  return projection.legalActions.find(
    (action) =>
      action.enabled &&
      action.type === type &&
      action.actorPlayerId === actorPlayerId &&
      predicate(action),
  );
}

function moveDestinations(action: LegalAction | undefined): readonly Hex[] {
  if (!action || !Array.isArray(action.details.destinations)) return [];
  return action.details.destinations.filter(isHex);
}

function shotTargets(action: LegalAction | undefined): readonly {
  playerId: PlayerId;
  maxShots: number;
  distance: number;
}[] {
  if (!action || !Array.isArray(action.details.targets)) return [];
  return action.details.targets.filter(isShotTarget);
}

function resourceTargets(action: LegalAction | undefined): readonly {
  playerId: PlayerId;
}[] {
  if (!action || !Array.isArray(action.details.targets)) return [];
  return action.details.targets.filter(isResourceTarget);
}

function stringArray(value: unknown): readonly string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function isHex(value: unknown): value is Hex {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<Hex>;
  return (
    Number.isSafeInteger(candidate.q) &&
    Number.isSafeInteger(candidate.r) &&
    Number.isSafeInteger(candidate.s) &&
    (candidate.q as number) + (candidate.r as number) + (candidate.s as number) === 0
  );
}

function isShotTarget(value: unknown): value is {
  playerId: PlayerId;
  maxShots: number;
  distance: number;
} {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.playerId === "string" &&
    Number.isSafeInteger(candidate.maxShots) &&
    (candidate.maxShots as number) > 0 &&
    Number.isSafeInteger(candidate.distance) &&
    (candidate.distance as number) >= 0
  );
}

function isResourceTarget(value: unknown): value is { playerId: PlayerId } {
  return Boolean(
    value &&
      typeof value === "object" &&
      typeof (value as Record<string, unknown>).playerId === "string",
  );
}

function stableTiePick<T>(
  values: readonly T[],
  tieBreaker: number,
  key: (value: T) => string,
): T {
  const stable = [...values].sort((left, right) => key(left).localeCompare(key(right)));
  return stable[tieBreaker % stable.length] as T;
}

function decision(
  bot: ProjectedTank,
  command: GameCommand,
  rationale: string,
): LegacyV2BotDecision {
  return { actorPlayerId: bot.playerId, command, rationale };
}

function assertTieBreaker(value: number): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError("tieBreaker must be a non-negative safe integer");
  }
}

function assertNever(value: never): never {
  throw new TypeError(`Unsupported bot strategy: ${String(value)}`);
}
