import {
  commandEnvelopeSchema,
  gameCommandSchema,
  type CommandEnvelope,
  type GameCommand,
} from "./commands";
import { fail } from "./errors";
import {
  enumerateBoard,
  hexDistance,
  hexKey,
  isOnBoard,
  selectByDeterministicValue,
  type Hex,
} from "./hex";
import {
  killActionPointReward,
  rangeUpgradeCost,
} from "./legacy-v2";
import type {
  BountyState,
  CreateLegacyV2GameInput,
  Decision,
  DecisionContext,
  JuryEpochState,
  LegacyV2Event,
  LegacyV2GameState,
  NonAggressionProposal,
  NonAggressionTreaty,
  PlayerId,
  PodiumClaim,
  PrincipalId,
  TankState,
} from "./types";
import {
  addAmounts,
  assertValidState,
  compareAmounts,
  currentEpoch,
  isZeroAmount,
  normalizeAmount,
  percentageOfAmount,
  subtractAmounts,
  validateDecisionContext,
  validateGameIdentity,
  validateSettings,
} from "./validation";

export function createLegacyV2Game(
  input: CreateLegacyV2GameInput,
): LegacyV2GameState {
  validateGameIdentity(input.gameId, input.ownerPrincipalId);
  validateDecisionContext({
    principalId: input.ownerPrincipalId,
    nowMs: input.nowMs,
    blockNumber: input.blockNumber,
  });
  const settings = validateSettings(input.settings);

  const state: LegacyV2GameState = {
    rulesetId: "legacy-v2",
    gameId: input.gameId,
    ownerPrincipalId: input.ownerPrincipalId,
    status: "lobby",
    version: 0,
    settings,
    createdAtMs: input.nowMs,
    createdAtBlock: input.blockNumber,
    startedAtMs: null,
    endedAtMs: null,
    epochStart: null,
    nextHeartSpawnBlock: input.blockNumber + settings.revealWaitBlocks,
    players: {},
    seatOrder: [],
    deadOrder: [],
    boardHearts: {},
    juryByEpoch: {},
    nonAggressionProposals: {},
    nonAggressionTreaties: {},
    bounties: {},
    bountyCredits: {},
    prizePool: "0",
    podium: null,
    podiumClaims: {},
  };
  assertValidState(state);
  return state;
}

export function decideLegacyV2(
  state: LegacyV2GameState,
  input: GameCommand,
  context: DecisionContext,
): Decision {
  assertValidState(state);
  validateDecisionContext(context);
  if (context.nowMs < state.createdAtMs || context.blockNumber < state.createdAtBlock) {
    fail("invalid_context", "Decision context cannot precede game creation");
  }

  const parsed = gameCommandSchema.safeParse(input);
  if (!parsed.success) {
    fail("invalid_command", "Command failed validation", {
      issues: parsed.error.issues,
    });
  }
  const command = parsed.data;
  let working = state;
  const events: LegacyV2Event[] = [];
  const emit = (event: LegacyV2Event): void => {
    events.push(event);
    working = evolveLegacyV2(working, event);
  };

  switch (command.type) {
    case "join": {
      requireStatus(working, "lobby", "game_not_in_lobby");
      if (working.seatOrder.length >= working.settings.playerCount) {
        fail("game_full", "The game lobby is full");
      }
      if (
        working.seatOrder.some(
          (playerId) => working.players[playerId]?.principalId === context.principalId,
        )
      ) {
        fail("already_joined", "This principal has already joined the game");
      }
      if (working.players[command.playerId]) {
        fail("already_joined", "playerId is already present in the game");
      }
      if (
        working.settings.allowedPrincipalIds &&
        !working.settings.allowedPrincipalIds.includes(context.principalId)
      ) {
        fail("principal_not_allowed", "Principal is not on this game's allowlist");
      }
      if (compareAmounts(command.buyInAmount, working.settings.minimumBuyIn) < 0) {
        fail("insufficient_buy_in", "Buy-in is below the configured minimum", {
          minimum: working.settings.minimumBuyIn,
          received: command.buyInAmount,
        });
      }
      const position = selectEmptyPosition(working, requireRandomValue(context));
      const player: TankState = {
        playerId: command.playerId,
        seat: working.seatOrder.length + 1,
        principalId: context.principalId,
        handle: command.handle,
        position,
        hearts: working.settings.initialHearts,
        actionPoints: working.settings.initialActionPoints,
        range: working.settings.initialRange,
        lastDripEpoch: null,
        delegates: [],
      };
      emit({
        type: "player_joined",
        atMs: context.nowMs,
        player,
        buyInAmount: command.buyInAmount,
      });
      if (
        working.settings.autoStart &&
        working.seatOrder.length === working.settings.playerCount
      ) {
        emit(startEvent(working, context.nowMs));
      }
      break;
    }

    case "start": {
      requireStatus(working, "lobby", "game_not_in_lobby");
      if (context.principalId !== working.ownerPrincipalId) {
        fail("not_authorized", "Only the game owner may start the lobby");
      }
      if (working.seatOrder.length !== working.settings.playerCount) {
        fail("not_enough_players", "The exact configured population is required", {
          required: working.settings.playerCount,
          joined: working.seatOrder.length,
        });
      }
      emit(startEvent(working, context.nowMs));
      break;
    }

    case "move": {
      requireActive(working);
      const actor = resolveActor(working, context);
      requireAlive(actor);
      if (!isOnBoard(command.target, working.settings.boardRadius)) {
        fail("invalid_position", "Move target is outside the board");
      }
      if (isPositionOccupied(working, command.target)) {
        fail("position_occupied", "Move target is occupied by a tank");
      }
      const cost = hexDistance(actor.position, command.target);
      if (cost > actor.actionPoints) {
        fail("insufficient_action_points", "Not enough action points to move", {
          required: cost,
          available: actor.actionPoints,
        });
      }
      emit({
        type: "tank_moved",
        atMs: context.nowMs,
        playerId: actor.playerId,
        from: actor.position,
        to: command.target,
        actionPointCost: cost,
        heartsCollected: working.boardHearts[hexKey(command.target)] ?? 0,
      });
      break;
    }

    case "shoot": {
      requireActive(working);
      const attacker = resolveActor(working, context);
      const target = getPlayer(working, command.targetPlayerId);
      requireAlive(attacker);
      requireAlive(target);
      const distance = hexDistance(attacker.position, target.position);
      if (distance > attacker.range) {
        fail("out_of_range", "Target is outside the attacker's range", {
          distance,
          range: attacker.range,
        });
      }
      if (command.shots > attacker.actionPoints) {
        fail("insufficient_action_points", "Not enough action points to shoot", {
          required: command.shots,
          available: attacker.actionPoints,
        });
      }
      if (command.shots > target.hearts) {
        fail("overkill", "Shots cannot exceed the target's remaining hearts", {
          shots: command.shots,
          targetHearts: target.hearts,
        });
      }
      const epoch = currentEpoch(working, context.nowMs);
      const treaty = activeTreatyBetween(
        working,
        attacker.playerId,
        target.playerId,
        epoch,
      );
      if (treaty) {
        fail("treaty_active", "An active non-aggression treaty blocks this shot", {
          expiresEpoch: treaty.expiresEpoch,
        });
      }

      emit({
        type: "tank_shot",
        atMs: context.nowMs,
        attackerPlayerId: attacker.playerId,
        targetPlayerId: target.playerId,
        shots: command.shots,
      });

      const targetAfterShot = getPlayer(working, target.playerId);
      if (targetAfterShot.hearts === 0) {
        const reward = killActionPointReward(targetAfterShot.actionPoints);
        emit({
          type: "kill_reward_transferred",
          atMs: context.nowMs,
          attackerPlayerId: attacker.playerId,
          victimPlayerId: target.playerId,
          actionPoints: reward,
        });
        emit({
          type: "tank_died",
          atMs: context.nowMs,
          killerPlayerId: attacker.playerId,
          victimPlayerId: target.playerId,
          cause: "shot",
        });
        maybeEndGame(working, context.nowMs, emit);
        awardEligibleBounties(
          working,
          attacker.playerId,
          target.playerId,
          context.nowMs,
          emit,
        );
      }
      break;
    }

    case "give": {
      requireActive(working);
      const giver = resolveActor(working, context);
      const recipient = getPlayer(working, command.targetPlayerId);
      requireAlive(giver);
      if (giver.playerId === recipient.playerId) {
        fail("self_gift_not_supported", "Self-giving is intentionally unsupported");
      }
      if (command.hearts + command.actionPoints === 0) {
        fail("zero_value_gift", "A gift must transfer at least one resource");
      }
      if (command.hearts > giver.hearts) {
        fail("insufficient_hearts", "Not enough hearts to give");
      }
      if (command.actionPoints > giver.actionPoints) {
        fail("insufficient_action_points", "Not enough action points to give");
      }
      const distance = hexDistance(giver.position, recipient.position);
      if (distance > giver.range) {
        fail("out_of_range", "Gift recipient is outside the giver's range", {
          distance,
          range: giver.range,
        });
      }
      const recipientWasDead = recipient.hearts === 0;
      if (recipientWasDead && command.hearts === 0) {
        fail(
          "dead_tank_requires_heart",
          "A dead tank requires at least one heart to be revived",
        );
      }
      emit({
        type: "resources_given",
        atMs: context.nowMs,
        fromPlayerId: giver.playerId,
        toPlayerId: recipient.playerId,
        hearts: command.hearts,
        actionPoints: command.actionPoints,
      });
      if (recipientWasDead) {
        emit({
          type: "tank_revived",
          atMs: context.nowMs,
          saviorPlayerId: giver.playerId,
          revivedPlayerId: recipient.playerId,
          lastDripEpoch: currentEpoch(working, context.nowMs),
        });
      }
      if (getPlayer(working, giver.playerId).hearts === 0) {
        emit({
          type: "tank_died",
          atMs: context.nowMs,
          killerPlayerId: giver.playerId,
          victimPlayerId: giver.playerId,
          cause: "self_sacrifice",
        });
        maybeEndGame(working, context.nowMs, emit);
      }
      break;
    }

    case "upgrade": {
      requireActive(working);
      const actor = resolveActor(working, context);
      requireAlive(actor);
      const cost = rangeUpgradeCost(actor.range);
      if (cost > actor.actionPoints) {
        fail("insufficient_action_points", "Not enough action points to upgrade", {
          required: cost,
          available: actor.actionPoints,
        });
      }
      emit({
        type: "range_upgraded",
        atMs: context.nowMs,
        playerId: actor.playerId,
        actionPointCost: cost,
        newRange: actor.range + 1,
      });
      break;
    }

    case "claim_action_points": {
      requireActive(working);
      const target = command.targetPlayerId
        ? getPlayer(working, command.targetPlayerId)
        : resolveActor(working, context);
      requireAlive(target);
      const epoch = currentEpoch(working, context.nowMs);
      if (epoch === working.epochStart) {
        fail("drip_too_early", "Action points cannot accrue in the start epoch");
      }
      const lastDripEpoch = target.lastDripEpoch ?? requireEpochStart(working);
      if (epoch <= lastDripEpoch) {
        fail("already_dripped", "No action points are currently claimable");
      }
      emit({
        type: "action_points_dripped",
        atMs: context.nowMs,
        playerId: target.playerId,
        amount: epoch - lastDripEpoch,
        epoch,
      });
      break;
    }

    case "curse_vote": {
      requireActive(working);
      const voter = resolveActor(working, context);
      const target = getPlayer(working, command.targetPlayerId);
      requireDead(voter);
      requireAlive(target);
      const epoch = currentEpoch(working, context.nowMs);
      const jury = working.juryByEpoch[String(epoch)] ?? emptyJuryEpoch();
      if (jury.closed) {
        fail("voting_closed", "Jury voting has already closed for this epoch");
      }
      if (jury.voters.includes(voter.playerId)) {
        fail("already_voted", "A dead tank may vote only once per epoch");
      }
      emit({
        type: "curse_vote_cast",
        atMs: context.nowMs,
        voterPlayerId: voter.playerId,
        targetPlayerId: target.playerId,
        epoch,
      });
      const tally =
        working.juryByEpoch[String(epoch)]?.votesByTarget[target.playerId] ?? 0;
      const strictMajority = Math.floor(working.deadOrder.length / 2) + 1;
      if (tally >= strictMajority) {
        emit({
          type: "tank_cursed",
          atMs: context.nowMs,
          targetPlayerId: target.playerId,
          decidingVoterPlayerId: voter.playerId,
          epoch,
          effect:
            getPlayer(working, target.playerId).actionPoints > 1
              ? "remove_action_point"
              : "delay_drip",
        });
      }
      break;
    }

    case "poke_heart_spawn": {
      requireActive(working);
      if (context.blockNumber < working.nextHeartSpawnBlock) {
        fail("heart_spawn_not_ready", "The scheduled reveal block has not arrived", {
          scheduledBlock: working.nextHeartSpawnBlock,
          currentBlock: context.blockNumber,
        });
      }
      const scheduledBlock = working.nextHeartSpawnBlock;
      const nextHeartSpawnBlock =
        context.blockNumber + working.settings.revealWaitBlocks;
      if (context.blockNumber - scheduledBlock > 256) {
        emit({
          type: "heart_spawn_skipped",
          atMs: context.nowMs,
          reason: "late",
          scheduledBlock,
          nextHeartSpawnBlock,
        });
        break;
      }
      const emptyPositions = getEmptyPositions(working);
      if (emptyPositions.length === 0) {
        emit({
          type: "heart_spawn_skipped",
          atMs: context.nowMs,
          reason: "board_full",
          scheduledBlock,
          nextHeartSpawnBlock,
        });
        break;
      }
      emit({
        type: "heart_spawned",
        atMs: context.nowMs,
        position: selectByDeterministicValue(
          emptyPositions,
          requireRandomValue(context),
        ),
        nextHeartSpawnBlock,
      });
      break;
    }

    case "delegate": {
      const actor = resolveActor(working, context);
      if (actor.principalId !== context.principalId) {
        fail("delegate_cannot_delegate", "Delegates cannot authorize another delegate");
      }
      if (command.delegatePrincipalId === actor.principalId) {
        fail("delegate_already_authorized", "The owner already controls this tank");
      }
      if (actor.delegates.includes(command.delegatePrincipalId)) {
        fail("delegate_already_authorized", "Principal is already a delegate");
      }
      emit({
        type: "delegate_added",
        atMs: context.nowMs,
        playerId: actor.playerId,
        ownerPrincipalId: actor.principalId,
        delegatePrincipalId: command.delegatePrincipalId,
      });
      break;
    }

    case "propose_non_aggression": {
      requireActive(working);
      const actor = resolveActor(working, context);
      const target = getPlayer(working, command.targetPlayerId);
      if (actor.playerId === target.playerId) {
        fail("treaty_invalid", "A tank cannot form a treaty with itself");
      }
      const epoch = currentEpoch(working, context.nowMs);
      if (command.expiresEpoch <= epoch) {
        fail("treaty_expired", "Treaty expiry must be in a future epoch");
      }
      emit({
        type: "non_aggression_proposed",
        atMs: context.nowMs,
        proposal: {
          proposerPlayerId: actor.playerId,
          targetPlayerId: target.playerId,
          expiresEpoch: command.expiresEpoch,
        },
      });
      break;
    }

    case "accept_non_aggression": {
      requireActive(working);
      const actor = resolveActor(working, context);
      const proposer = getPlayer(working, command.proposerPlayerId);
      const key = proposalKey(proposer.playerId, actor.playerId);
      const proposal = working.nonAggressionProposals[key];
      if (!proposal) {
        fail("treaty_invalid", "No matching non-aggression proposal exists");
      }
      if (currentEpoch(working, context.nowMs) >= proposal.expiresEpoch) {
        fail("treaty_expired", "The non-aggression proposal has expired");
      }
      const pair = orderedPlayerPair(proposer.playerId, actor.playerId);
      const existing = working.nonAggressionTreaties[treatyKey(...pair)];
      if (
        existing &&
        currentEpoch(working, context.nowMs) <= existing.expiresEpoch
      ) {
        fail("treaty_active", "These tanks already have an active treaty");
      }
      emit({
        type: "non_aggression_accepted",
        atMs: context.nowMs,
        treaty: { playerIds: pair, expiresEpoch: proposal.expiresEpoch },
      });
      break;
    }

    case "post_bounty": {
      requireActive(working);
      const actor = resolveActor(working, context);
      const target = getPlayer(working, command.targetPlayerId);
      if (working.bounties[command.bountyId]) {
        fail("invalid_command", "bountyId is already in use");
      }
      if (actor.playerId === target.playerId) {
        fail("invalid_command", "A tank cannot post a bounty on itself");
      }
      requireAlive(target);
      if (isZeroAmount(command.amount)) {
        fail("invalid_command", "Bounty amount must be positive");
      }
      const bounty: BountyState = {
        bountyId: command.bountyId,
        ownerPlayerId: actor.playerId,
        targetPlayerId: target.playerId,
        amount: normalizeAmount(command.amount),
        acceptedPlayerIds: [actor.playerId],
        status: "open",
        winnerPlayerId: null,
      };
      emit({ type: "bounty_posted", atMs: context.nowMs, bounty });
      break;
    }

    case "accept_bounty": {
      requireActive(working);
      const actor = resolveActor(working, context);
      const bounty = getBounty(working, command.bountyId);
      requireOpenBounty(bounty);
      if (bounty.acceptedPlayerIds.includes(actor.playerId)) {
        fail("invalid_command", "This tank already accepts the bounty");
      }
      emit({
        type: "bounty_accepted",
        atMs: context.nowMs,
        bountyId: bounty.bountyId,
        playerId: actor.playerId,
      });
      break;
    }

    case "cancel_bounty": {
      requireStatus(working, "ended", "game_not_ended");
      const actor = resolveActor(working, context);
      const bounty = getBounty(working, command.bountyId);
      requireOpenBounty(bounty);
      if (bounty.ownerPlayerId !== actor.playerId) {
        fail("not_authorized", "Only the bounty owner may cancel it");
      }
      emit({
        type: "bounty_cancelled",
        atMs: context.nowMs,
        bountyId: bounty.bountyId,
        ownerPlayerId: actor.playerId,
        amount: bounty.amount,
      });
      break;
    }

    case "withdraw_bounty": {
      const actor = resolveActor(working, context);
      const amount = working.bountyCredits[actor.playerId] ?? "0";
      if (isZeroAmount(amount)) {
        fail("no_bounty_credit", "This tank has no bounty credit to withdraw");
      }
      emit({
        type: "bounty_withdrawn",
        atMs: context.nowMs,
        playerId: actor.playerId,
        amount,
        recipient: command.recipient,
      });
      break;
    }

    case "donate": {
      if (isZeroAmount(command.amount)) {
        fail("invalid_command", "Donation amount must be positive");
      }
      emit({
        type: "prize_donated",
        atMs: context.nowMs,
        principalId: context.principalId,
        amount: normalizeAmount(command.amount),
      });
      break;
    }

    case "claim_podium_reward": {
      requireStatus(working, "ended", "game_not_ended");
      const actor = resolveActor(working, context);
      if (working.podiumClaims[actor.playerId]) {
        fail("reward_already_claimed", "This podium reward was already claimed");
      }
      const placeIndex = working.podium?.findIndex(
        (playerId) => playerId === actor.playerId,
      );
      if (placeIndex === undefined || placeIndex < 0) {
        fail("not_on_podium", "Only podium tanks may claim a reward");
      }
      const place = (placeIndex + 1) as 1 | 2 | 3;
      const sharePercent = ([60, 30, 10] as const)[placeIndex];
      if (sharePercent === undefined) {
        fail("not_on_podium", "Invalid podium place");
      }
      const claim: PodiumClaim = {
        playerId: actor.playerId,
        place,
        sharePercent,
        amount: percentageOfAmount(working.prizePool, sharePercent),
        recipient: command.recipient,
      };
      emit({ type: "podium_reward_claimed", atMs: context.nowMs, claim });
      break;
    }

    default:
      assertNever(command);
  }

  if (events.length === 0) {
    fail("invalid_command", "Command did not produce any events");
  }
  // A command is the concurrency/CAS unit. One accepted command advances the
  // snapshot version exactly once, even when it emits several ordered events.
  const nextState: LegacyV2GameState = {
    ...working,
    version: state.version + 1,
  };
  assertValidState(nextState);
  return { command, events, state: nextState };
}

export function executeLegacyV2Command(
  state: LegacyV2GameState,
  envelopeInput: CommandEnvelope,
  context: DecisionContext,
): Decision {
  const parsed = commandEnvelopeSchema.safeParse(envelopeInput);
  if (!parsed.success) {
    fail("invalid_command", "Command envelope failed validation", {
      issues: parsed.error.issues,
    });
  }
  if (parsed.data.expectedVersion !== state.version) {
    fail("invalid_command", "Command expectedVersion is stale", {
      expectedVersion: parsed.data.expectedVersion,
      currentVersion: state.version,
    });
  }
  return decideLegacyV2(state, parsed.data.command, context);
}

export function evolveLegacyV2(
  state: LegacyV2GameState,
  event: LegacyV2Event,
): LegacyV2GameState {
  // Event evolution intentionally preserves `version`. The database records a
  // command version plus eventIndex, and replayLegacyV2 increments once after
  // applying the complete event batch for that command.
  const bump = (next: LegacyV2GameState): LegacyV2GameState => ({
    ...next,
    version: state.version,
  });
  const replacePlayer = (player: TankState): Readonly<Record<PlayerId, TankState>> => ({
    ...state.players,
    [player.playerId]: player,
  });

  switch (event.type) {
    case "player_joined":
      return bump({
        ...state,
        players: { ...state.players, [event.player.playerId]: event.player },
        seatOrder: [...state.seatOrder, event.player.playerId],
        prizePool: addAmounts(state.prizePool, event.buyInAmount),
      });

    case "game_started":
      return bump({
        ...state,
        status: "active",
        startedAtMs: event.atMs,
        epochStart: event.epochStart,
        players: Object.fromEntries(
          Object.entries(state.players).map(([playerId, player]) => [
            playerId,
            { ...player, lastDripEpoch: event.epochStart },
          ]),
        ),
      });

    case "tank_moved": {
      const player = getPlayer(state, event.playerId);
      const boardHearts = { ...state.boardHearts };
      delete boardHearts[hexKey(event.to)];
      return bump({
        ...state,
        boardHearts,
        players: replacePlayer({
          ...player,
          position: event.to,
          actionPoints: player.actionPoints - event.actionPointCost,
          hearts: player.hearts + event.heartsCollected,
        }),
      });
    }

    case "tank_shot": {
      const attacker = getPlayer(state, event.attackerPlayerId);
      const target = getPlayer(state, event.targetPlayerId);
      if (attacker.playerId === target.playerId) {
        return bump({
          ...state,
          players: replacePlayer({
            ...attacker,
            actionPoints: attacker.actionPoints - event.shots,
            hearts: attacker.hearts - event.shots,
          }),
        });
      }
      return bump({
        ...state,
        players: {
          ...state.players,
          [attacker.playerId]: {
            ...attacker,
            actionPoints: attacker.actionPoints - event.shots,
          },
          [target.playerId]: { ...target, hearts: target.hearts - event.shots },
        },
      });
    }

    case "kill_reward_transferred": {
      if (event.attackerPlayerId === event.victimPlayerId) return bump(state);
      const attacker = getPlayer(state, event.attackerPlayerId);
      const victim = getPlayer(state, event.victimPlayerId);
      return bump({
        ...state,
        players: {
          ...state.players,
          [attacker.playerId]: {
            ...attacker,
            actionPoints: attacker.actionPoints + event.actionPoints,
          },
          [victim.playerId]: {
            ...victim,
            actionPoints: victim.actionPoints - event.actionPoints,
          },
        },
      });
    }

    case "tank_died":
      return bump({
        ...state,
        deadOrder: [
          ...state.deadOrder.filter((playerId) => playerId !== event.victimPlayerId),
          event.victimPlayerId,
        ],
      });

    case "resources_given": {
      const from = getPlayer(state, event.fromPlayerId);
      const to = getPlayer(state, event.toPlayerId);
      return bump({
        ...state,
        players: {
          ...state.players,
          [from.playerId]: {
            ...from,
            hearts: from.hearts - event.hearts,
            actionPoints: from.actionPoints - event.actionPoints,
          },
          [to.playerId]: {
            ...to,
            hearts: to.hearts + event.hearts,
            actionPoints: to.actionPoints + event.actionPoints,
          },
        },
      });
    }

    case "tank_revived": {
      const player = getPlayer(state, event.revivedPlayerId);
      return bump({
        ...state,
        deadOrder: state.deadOrder.filter(
          (playerId) => playerId !== event.revivedPlayerId,
        ),
        players: replacePlayer({
          ...player,
          lastDripEpoch: event.lastDripEpoch,
        }),
      });
    }

    case "range_upgraded": {
      const player = getPlayer(state, event.playerId);
      return bump({
        ...state,
        players: replacePlayer({
          ...player,
          actionPoints: player.actionPoints - event.actionPointCost,
          range: event.newRange,
        }),
      });
    }

    case "action_points_dripped": {
      const player = getPlayer(state, event.playerId);
      return bump({
        ...state,
        players: replacePlayer({
          ...player,
          actionPoints: player.actionPoints + event.amount,
          lastDripEpoch: event.epoch,
        }),
      });
    }

    case "curse_vote_cast": {
      const key = String(event.epoch);
      const jury = state.juryByEpoch[key] ?? emptyJuryEpoch();
      return bump({
        ...state,
        juryByEpoch: {
          ...state.juryByEpoch,
          [key]: {
            ...jury,
            voters: [...jury.voters, event.voterPlayerId],
            votesByTarget: {
              ...jury.votesByTarget,
              [event.targetPlayerId]:
                (jury.votesByTarget[event.targetPlayerId] ?? 0) + 1,
            },
          },
        },
      });
    }

    case "tank_cursed": {
      const player = getPlayer(state, event.targetPlayerId);
      const key = String(event.epoch);
      const jury = state.juryByEpoch[key] ?? emptyJuryEpoch();
      return bump({
        ...state,
        players: replacePlayer(
          event.effect === "remove_action_point"
            ? { ...player, actionPoints: player.actionPoints - 1 }
            : {
                ...player,
                lastDripEpoch:
                  (player.lastDripEpoch ?? requireEpochStart(state)) + 1,
              },
        ),
        juryByEpoch: {
          ...state.juryByEpoch,
          [key]: {
            ...jury,
            closed: true,
            cursedPlayerId: event.targetPlayerId,
          },
        },
      });
    }

    case "heart_spawned":
      return bump({
        ...state,
        nextHeartSpawnBlock: event.nextHeartSpawnBlock,
        boardHearts: {
          ...state.boardHearts,
          [hexKey(event.position)]:
            (state.boardHearts[hexKey(event.position)] ?? 0) + 1,
        },
      });

    case "heart_spawn_skipped":
      return bump({
        ...state,
        nextHeartSpawnBlock: event.nextHeartSpawnBlock,
      });

    case "delegate_added": {
      const player = getPlayer(state, event.playerId);
      return bump({
        ...state,
        players: replacePlayer({
          ...player,
          delegates: [...player.delegates, event.delegatePrincipalId],
        }),
      });
    }

    case "non_aggression_proposed":
      return bump({
        ...state,
        nonAggressionProposals: {
          ...state.nonAggressionProposals,
          [proposalKey(
            event.proposal.proposerPlayerId,
            event.proposal.targetPlayerId,
          )]: event.proposal,
        },
      });

    case "non_aggression_accepted": {
      const [first, second] = event.treaty.playerIds;
      const proposals = { ...state.nonAggressionProposals };
      delete proposals[proposalKey(first, second)];
      delete proposals[proposalKey(second, first)];
      return bump({
        ...state,
        nonAggressionProposals: proposals,
        nonAggressionTreaties: {
          ...state.nonAggressionTreaties,
          [treatyKey(first, second)]: event.treaty,
        },
      });
    }

    case "bounty_posted":
      return bump({
        ...state,
        bounties: { ...state.bounties, [event.bounty.bountyId]: event.bounty },
      });

    case "bounty_accepted": {
      const bounty = getBounty(state, event.bountyId);
      return bump({
        ...state,
        bounties: {
          ...state.bounties,
          [bounty.bountyId]: {
            ...bounty,
            acceptedPlayerIds: [...bounty.acceptedPlayerIds, event.playerId],
          },
        },
      });
    }

    case "bounty_awarded": {
      const bounty = getBounty(state, event.bountyId);
      return bump({
        ...state,
        bounties: {
          ...state.bounties,
          [bounty.bountyId]: {
            ...bounty,
            status: "awarded",
            winnerPlayerId: event.winnerPlayerId,
          },
        },
        bountyCredits: {
          ...state.bountyCredits,
          [event.winnerPlayerId]: addAmounts(
            state.bountyCredits[event.winnerPlayerId] ?? "0",
            event.amount,
          ),
        },
      });
    }

    case "bounty_cancelled": {
      const bounty = getBounty(state, event.bountyId);
      return bump({
        ...state,
        bounties: {
          ...state.bounties,
          [bounty.bountyId]: { ...bounty, status: "cancelled" },
        },
        bountyCredits: {
          ...state.bountyCredits,
          [event.ownerPlayerId]: addAmounts(
            state.bountyCredits[event.ownerPlayerId] ?? "0",
            event.amount,
          ),
        },
      });
    }

    case "bounty_withdrawn":
      return bump({
        ...state,
        bountyCredits: {
          ...state.bountyCredits,
          [event.playerId]: subtractAmounts(
            state.bountyCredits[event.playerId] ?? "0",
            event.amount,
          ),
        },
      });

    case "prize_donated":
      return bump({
        ...state,
        prizePool: addAmounts(state.prizePool, event.amount),
      });

    case "game_ended":
      return bump({
        ...state,
        status: "ended",
        endedAtMs: event.atMs,
        podium: event.podium,
      });

    case "podium_reward_claimed":
      return bump({
        ...state,
        podiumClaims: {
          ...state.podiumClaims,
          [event.claim.playerId]: event.claim,
        },
      });

    default:
      return assertNever(event);
  }
}

export function replayLegacyV2(
  initialState: LegacyV2GameState,
  events: readonly LegacyV2Event[],
): LegacyV2GameState {
  if (events.length === 0) return initialState;
  const evolved = events.reduce(evolveLegacyV2, initialState);
  const state: LegacyV2GameState = {
    ...evolved,
    version: initialState.version + 1,
  };
  assertValidState(state);
  return state;
}

export function isTankAlive(player: TankState): boolean {
  return player.hearts > 0;
}

export function canControlTank(
  player: TankState,
  principalId: PrincipalId,
): boolean {
  return (
    player.principalId === principalId || player.delegates.includes(principalId)
  );
}

export function controlledTanks(
  state: LegacyV2GameState,
  principalId: PrincipalId,
): readonly TankState[] {
  return state.seatOrder
    .map((playerId) => getPlayer(state, playerId))
    .filter((player) => canControlTank(player, principalId));
}

export function activeTreatyBetween(
  state: LegacyV2GameState,
  firstPlayerId: PlayerId,
  secondPlayerId: PlayerId,
  epoch: number,
): NonAggressionTreaty | null {
  const pair = orderedPlayerPair(firstPlayerId, secondPlayerId);
  const treaty = state.nonAggressionTreaties[treatyKey(...pair)];
  return treaty && epoch <= treaty.expiresEpoch ? treaty : null;
}

function startEvent(
  state: LegacyV2GameState,
  nowMs: number,
): LegacyV2Event {
  return {
    type: "game_started",
    atMs: nowMs,
    epochStart: currentEpoch(state, nowMs),
  };
}

function resolveActor(
  state: LegacyV2GameState,
  context: DecisionContext,
): TankState {
  if (context.actorPlayerId) {
    const actor = getPlayer(state, context.actorPlayerId);
    if (!canControlTank(actor, context.principalId)) {
      fail("not_authorized", "Principal cannot control the selected tank", {
        playerId: actor.playerId,
      });
    }
    return actor;
  }
  const candidates = controlledTanks(state, context.principalId);
  if (candidates.length === 0) {
    fail("not_authorized", "Principal does not control a tank in this game");
  }
  if (candidates.length > 1) {
    fail("ambiguous_actor", "actorPlayerId is required when controlling multiple tanks", {
      playerIds: candidates.map((candidate) => candidate.playerId),
    });
  }
  return candidates[0] as TankState;
}

function getPlayer(state: LegacyV2GameState, playerId: PlayerId): TankState {
  const player = state.players[playerId];
  if (!player) fail("player_not_found", "Player does not exist", { playerId });
  return player;
}

function requireAlive(player: TankState): void {
  if (!isTankAlive(player)) {
    fail("tank_dead", "This action requires a living tank", {
      playerId: player.playerId,
    });
  }
}

function requireDead(player: TankState): void {
  if (isTankAlive(player)) {
    fail("tank_alive", "This action requires a dead tank", {
      playerId: player.playerId,
    });
  }
}

function requireStatus(
  state: LegacyV2GameState,
  status: LegacyV2GameState["status"],
  code: "game_not_in_lobby" | "game_not_ended",
): void {
  if (state.status !== status) fail(code, `Game must be ${status}`);
}

function requireActive(state: LegacyV2GameState): void {
  if (state.status !== "active") fail("game_not_active", "Game is not active");
}

function requireEpochStart(state: LegacyV2GameState): number {
  if (state.epochStart === null) {
    fail("invalid_state", "Active game is missing epochStart");
  }
  return state.epochStart;
}

function requireRandomValue(context: DecisionContext): number {
  if (context.randomValue === undefined) {
    fail("invalid_context", "This command requires explicit deterministic entropy");
  }
  return context.randomValue;
}

function getEmptyPositions(state: LegacyV2GameState): readonly Hex[] {
  const occupied = new Set(
    state.seatOrder.map((playerId) => hexKey(getPlayer(state, playerId).position)),
  );
  Object.keys(state.boardHearts).forEach((key) => occupied.add(key));
  return enumerateBoard(state.settings.boardRadius).filter(
    (position) => !occupied.has(hexKey(position)),
  );
}

function selectEmptyPosition(
  state: LegacyV2GameState,
  randomValue: number,
): Hex {
  const empty = getEmptyPositions(state);
  if (empty.length === 0) fail("board_full", "No empty board position remains");
  return selectByDeterministicValue(empty, randomValue);
}

function isPositionOccupied(state: LegacyV2GameState, position: Hex): boolean {
  const key = hexKey(position);
  return state.seatOrder.some(
    (playerId) => hexKey(getPlayer(state, playerId).position) === key,
  );
}

function maybeEndGame(
  state: LegacyV2GameState,
  atMs: number,
  emit: (event: LegacyV2Event) => void,
): void {
  const living = state.seatOrder.filter(
    (playerId) => isTankAlive(getPlayer(state, playerId)),
  );
  if (living.length !== 1 || state.status !== "active") return;
  const second = state.deadOrder.at(-1) ?? null;
  const third = state.deadOrder.at(-2) ?? null;
  emit({
    type: "game_ended",
    atMs,
    podium: [living[0] as PlayerId, second, third],
  });
}

function awardEligibleBounties(
  state: LegacyV2GameState,
  winnerPlayerId: PlayerId,
  victimPlayerId: PlayerId,
  atMs: number,
  emit: (event: LegacyV2Event) => void,
): void {
  Object.values(state.bounties)
    .filter(
      (bounty) =>
        bounty.status === "open" &&
        bounty.targetPlayerId === victimPlayerId &&
        bounty.acceptedPlayerIds.includes(winnerPlayerId),
    )
    .sort((left, right) => left.bountyId.localeCompare(right.bountyId))
    .forEach((bounty) => {
      emit({
        type: "bounty_awarded",
        atMs,
        bountyId: bounty.bountyId,
        winnerPlayerId,
        victimPlayerId,
        amount: bounty.amount,
      });
    });
}

function emptyJuryEpoch(): JuryEpochState {
  return { voters: [], votesByTarget: {}, closed: false, cursedPlayerId: null };
}

function proposalKey(proposer: PlayerId, target: PlayerId): string {
  return `${proposer}->${target}`;
}

function orderedPlayerPair(
  first: PlayerId,
  second: PlayerId,
): readonly [PlayerId, PlayerId] {
  return first.localeCompare(second) <= 0 ? [first, second] : [second, first];
}

function treatyKey(first: PlayerId, second: PlayerId): string {
  return `${first}<->${second}`;
}

function getBounty(state: LegacyV2GameState, bountyId: string): BountyState {
  const bounty = state.bounties[bountyId];
  if (!bounty) fail("bounty_not_found", "Bounty does not exist", { bountyId });
  return bounty;
}

function requireOpenBounty(bounty: BountyState): void {
  if (bounty.status !== "open") {
    fail("bounty_closed", "Bounty is no longer open", {
      bountyId: bounty.bountyId,
      status: bounty.status,
    });
  }
}

function assertNever(value: never): never {
  throw new TypeError(`Unhandled discriminant: ${JSON.stringify(value)}`);
}

export const decide = decideLegacyV2;
export const evolve = evolveLegacyV2;
export const replay = replayLegacyV2;
