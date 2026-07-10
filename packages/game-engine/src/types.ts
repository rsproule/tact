import type { GameCommand } from "./commands";
import type { Hex } from "./hex";

export type GameId = string;
export type PlayerId = string;
export type PrincipalId = string;
export type Amount = string;

export type LegacyV2GameStatus = "lobby" | "active" | "ended";

export interface LegacyV2Settings {
  readonly playerCount: number;
  readonly boardRadius: number;
  readonly initialActionPoints: number;
  readonly initialHearts: number;
  readonly initialRange: number;
  readonly epochDurationMs: number;
  readonly minimumBuyIn: Amount;
  readonly revealWaitBlocks: number;
  readonly autoStart: boolean;
  readonly allowedPrincipalIds?: readonly PrincipalId[];
}

export interface TankState {
  readonly playerId: PlayerId;
  readonly seat: number;
  readonly principalId: PrincipalId;
  readonly handle: string;
  readonly position: Hex;
  readonly hearts: number;
  readonly actionPoints: number;
  readonly range: number;
  readonly lastDripEpoch: number | null;
  readonly delegates: readonly PrincipalId[];
}

export interface JuryEpochState {
  readonly voters: readonly PlayerId[];
  readonly votesByTarget: Readonly<Record<PlayerId, number>>;
  readonly closed: boolean;
  readonly cursedPlayerId: PlayerId | null;
}

export interface NonAggressionProposal {
  readonly proposerPlayerId: PlayerId;
  readonly targetPlayerId: PlayerId;
  readonly expiresEpoch: number;
}

export interface NonAggressionTreaty {
  readonly playerIds: readonly [PlayerId, PlayerId];
  readonly expiresEpoch: number;
}

export type BountyStatus = "open" | "awarded" | "cancelled";

export interface BountyState {
  readonly bountyId: string;
  readonly ownerPlayerId: PlayerId;
  readonly targetPlayerId: PlayerId;
  readonly amount: Amount;
  readonly acceptedPlayerIds: readonly PlayerId[];
  readonly status: BountyStatus;
  readonly winnerPlayerId: PlayerId | null;
}

export interface PodiumClaim {
  readonly playerId: PlayerId;
  readonly place: 1 | 2 | 3;
  readonly sharePercent: 60 | 30 | 10;
  readonly amount: Amount;
  readonly recipient: string;
}

export interface LegacyV2GameState {
  readonly rulesetId: "legacy-v2";
  readonly gameId: GameId;
  readonly ownerPrincipalId: PrincipalId;
  readonly status: LegacyV2GameStatus;
  readonly version: number;
  readonly settings: LegacyV2Settings;
  readonly createdAtMs: number;
  readonly createdAtBlock: number;
  readonly startedAtMs: number | null;
  readonly endedAtMs: number | null;
  readonly epochStart: number | null;
  readonly nextHeartSpawnBlock: number;
  readonly players: Readonly<Record<PlayerId, TankState>>;
  readonly seatOrder: readonly PlayerId[];
  /** Current dead tanks, ordered by their latest death transition. */
  readonly deadOrder: readonly PlayerId[];
  readonly boardHearts: Readonly<Record<string, number>>;
  readonly juryByEpoch: Readonly<Record<string, JuryEpochState>>;
  readonly nonAggressionProposals: Readonly<Record<string, NonAggressionProposal>>;
  readonly nonAggressionTreaties: Readonly<Record<string, NonAggressionTreaty>>;
  readonly bounties: Readonly<Record<string, BountyState>>;
  readonly bountyCredits: Readonly<Record<PlayerId, Amount>>;
  readonly prizePool: Amount;
  readonly podium: readonly [PlayerId, PlayerId | null, PlayerId | null] | null;
  readonly podiumClaims: Readonly<Record<PlayerId, PodiumClaim>>;
}

export interface CreateLegacyV2GameInput {
  readonly gameId: GameId;
  readonly ownerPrincipalId: PrincipalId;
  readonly settings: LegacyV2Settings;
  readonly nowMs: number;
  readonly blockNumber: number;
}

export interface DecisionContext {
  /** Authenticated caller. Never derive this from command input. */
  readonly principalId: PrincipalId;
  readonly nowMs: number;
  readonly blockNumber: number;
  /** Required when a principal controls more than one tank. */
  readonly actorPlayerId?: PlayerId;
  /** Trusted deterministic entropy supplied by the application layer. */
  readonly randomValue?: number;
}

interface EventBase {
  readonly atMs: number;
}

export type LegacyV2Event =
  | (EventBase & {
      readonly type: "player_joined";
      readonly player: TankState;
      readonly buyInAmount: Amount;
    })
  | (EventBase & {
      readonly type: "game_started";
      readonly epochStart: number;
    })
  | (EventBase & {
      readonly type: "tank_moved";
      readonly playerId: PlayerId;
      readonly from: Hex;
      readonly to: Hex;
      readonly actionPointCost: number;
      readonly heartsCollected: number;
    })
  | (EventBase & {
      readonly type: "tank_shot";
      readonly attackerPlayerId: PlayerId;
      readonly targetPlayerId: PlayerId;
      readonly shots: number;
    })
  | (EventBase & {
      readonly type: "kill_reward_transferred";
      readonly attackerPlayerId: PlayerId;
      readonly victimPlayerId: PlayerId;
      readonly actionPoints: number;
    })
  | (EventBase & {
      readonly type: "tank_died";
      readonly killerPlayerId: PlayerId;
      readonly victimPlayerId: PlayerId;
      readonly cause: "shot" | "self_sacrifice";
    })
  | (EventBase & {
      readonly type: "resources_given";
      readonly fromPlayerId: PlayerId;
      readonly toPlayerId: PlayerId;
      readonly hearts: number;
      readonly actionPoints: number;
    })
  | (EventBase & {
      readonly type: "tank_revived";
      readonly saviorPlayerId: PlayerId;
      readonly revivedPlayerId: PlayerId;
      readonly lastDripEpoch: number;
    })
  | (EventBase & {
      readonly type: "range_upgraded";
      readonly playerId: PlayerId;
      readonly actionPointCost: number;
      readonly newRange: number;
    })
  | (EventBase & {
      readonly type: "action_points_dripped";
      readonly playerId: PlayerId;
      readonly amount: number;
      readonly epoch: number;
    })
  | (EventBase & {
      readonly type: "curse_vote_cast";
      readonly voterPlayerId: PlayerId;
      readonly targetPlayerId: PlayerId;
      readonly epoch: number;
    })
  | (EventBase & {
      readonly type: "tank_cursed";
      readonly targetPlayerId: PlayerId;
      readonly decidingVoterPlayerId: PlayerId;
      readonly epoch: number;
      readonly effect: "remove_action_point" | "delay_drip";
    })
  | (EventBase & {
      readonly type: "heart_spawned";
      readonly position: Hex;
      readonly nextHeartSpawnBlock: number;
    })
  | (EventBase & {
      readonly type: "heart_spawn_skipped";
      readonly reason: "late" | "board_full";
      readonly scheduledBlock: number;
      readonly nextHeartSpawnBlock: number;
    })
  | (EventBase & {
      readonly type: "delegate_added";
      readonly playerId: PlayerId;
      readonly ownerPrincipalId: PrincipalId;
      readonly delegatePrincipalId: PrincipalId;
    })
  | (EventBase & {
      readonly type: "non_aggression_proposed";
      readonly proposal: NonAggressionProposal;
    })
  | (EventBase & {
      readonly type: "non_aggression_accepted";
      readonly treaty: NonAggressionTreaty;
    })
  | (EventBase & {
      readonly type: "bounty_posted";
      readonly bounty: BountyState;
    })
  | (EventBase & {
      readonly type: "bounty_accepted";
      readonly bountyId: string;
      readonly playerId: PlayerId;
    })
  | (EventBase & {
      readonly type: "bounty_awarded";
      readonly bountyId: string;
      readonly winnerPlayerId: PlayerId;
      readonly victimPlayerId: PlayerId;
      readonly amount: Amount;
    })
  | (EventBase & {
      readonly type: "bounty_cancelled";
      readonly bountyId: string;
      readonly ownerPlayerId: PlayerId;
      readonly amount: Amount;
    })
  | (EventBase & {
      readonly type: "bounty_withdrawn";
      readonly playerId: PlayerId;
      readonly amount: Amount;
      readonly recipient: string;
    })
  | (EventBase & {
      readonly type: "prize_donated";
      readonly principalId: PrincipalId;
      readonly amount: Amount;
    })
  | (EventBase & {
      readonly type: "game_ended";
      readonly podium: readonly [PlayerId, PlayerId | null, PlayerId | null];
    })
  | (EventBase & {
      readonly type: "podium_reward_claimed";
      readonly claim: PodiumClaim;
    });

export interface Decision {
  readonly command: GameCommand;
  readonly events: readonly LegacyV2Event[];
  readonly state: LegacyV2GameState;
}
