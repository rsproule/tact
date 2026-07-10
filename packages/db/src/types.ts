import type { LegacyV2Event, LegacyV2GameState } from "@tact/game-engine";

export type PrincipalView = Readonly<{
  id: string;
  kind: "human" | "agent";
  displayName: string;
}>;

/** The engine state is the authoritative snapshot; persistence never narrows it. */
export type StoredGameSnapshot = LegacyV2GameState;
export type StoredDomainEvent = LegacyV2Event;

export type GameMutationPlan = Readonly<{
  snapshot: StoredGameSnapshot;
  events: readonly StoredDomainEvent[];
}>;

export type GameView = Readonly<{
  id: string;
  ownerPrincipalId: string;
  status: LegacyV2GameState["status"];
  rulesetVersion: string;
  version: number;
  config: Record<string, unknown>;
  snapshot: StoredGameSnapshot;
  stateHash: string | null;
  createdAt: string;
  updatedAt: string;
}>;

export type CommandReceipt = Readonly<{
  commandId: string;
  gameId: string;
  status: "applied" | "rejected";
  version: number;
  result: Record<string, unknown>;
  errorCode?: string;
  replayed: boolean;
}>;

export type BotStrategy = "attack" | "medic" | "hoard" | "sentinel" | "idle";
