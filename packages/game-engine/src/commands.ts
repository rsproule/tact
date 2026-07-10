import { z } from "zod";

export const hexSchema = z
  .object({
    q: z.number().int().safe(),
    r: z.number().int().safe(),
    s: z.number().int().safe(),
  })
  .strict()
  .refine(({ q, r, s }) => q + r + s === 0, {
    message: "Cube coordinates must satisfy q + r + s = 0",
  });

/** Canonical non-negative integer expressed in base units. */
export const amountSchema = z
  .string()
  .regex(/^(0|[1-9]\d*)$/, "Amount must be a canonical non-negative integer string");

const playerIdSchema = z.uuid();
const principalIdSchema = z.uuid();

export const joinCommandSchema = z
  .object({
    type: z.literal("join"),
    playerId: playerIdSchema,
    handle: z.string().trim().min(1).max(64),
    buyInAmount: amountSchema,
  })
  .strict();

export const startCommandSchema = z.object({ type: z.literal("start") }).strict();

export const moveCommandSchema = z
  .object({
    type: z.literal("move"),
    target: hexSchema,
  })
  .strict();

export const shootCommandSchema = z
  .object({
    type: z.literal("shoot"),
    targetPlayerId: playerIdSchema,
    shots: z.number().int().safe().positive(),
  })
  .strict();

export const giveCommandSchema = z
  .object({
    type: z.literal("give"),
    targetPlayerId: playerIdSchema,
    hearts: z.number().int().safe().nonnegative().default(0),
    actionPoints: z.number().int().safe().nonnegative().default(0),
  })
  .strict()
  .refine(({ actionPoints, hearts }) => actionPoints + hearts > 0, {
    message: "A gift must contain at least one heart or action point",
  });

export const upgradeCommandSchema = z
  .object({ type: z.literal("upgrade") })
  .strict();

export const claimActionPointsCommandSchema = z
  .object({
    type: z.literal("claim_action_points"),
    targetPlayerId: playerIdSchema.optional(),
  })
  .strict();

export const curseVoteCommandSchema = z
  .object({
    type: z.literal("curse_vote"),
    targetPlayerId: playerIdSchema,
  })
  .strict();

export const pokeHeartSpawnCommandSchema = z
  .object({ type: z.literal("poke_heart_spawn") })
  .strict();

export const delegateCommandSchema = z
  .object({
    type: z.literal("delegate"),
    delegatePrincipalId: principalIdSchema,
  })
  .strict();

export const proposeNonAggressionCommandSchema = z
  .object({
    type: z.literal("propose_non_aggression"),
    targetPlayerId: playerIdSchema,
    expiresEpoch: z.number().int().safe().nonnegative(),
  })
  .strict();

export const acceptNonAggressionCommandSchema = z
  .object({
    type: z.literal("accept_non_aggression"),
    proposerPlayerId: playerIdSchema,
  })
  .strict();

export const postBountyCommandSchema = z
  .object({
    type: z.literal("post_bounty"),
    bountyId: z.uuid(),
    targetPlayerId: playerIdSchema,
    amount: amountSchema,
  })
  .strict();

export const acceptBountyCommandSchema = z
  .object({
    type: z.literal("accept_bounty"),
    bountyId: z.uuid(),
  })
  .strict();

export const cancelBountyCommandSchema = z
  .object({
    type: z.literal("cancel_bounty"),
    bountyId: z.uuid(),
  })
  .strict();

export const withdrawBountyCommandSchema = z
  .object({
    type: z.literal("withdraw_bounty"),
    recipient: z.string().trim().min(1).max(256),
  })
  .strict();

export const donateCommandSchema = z
  .object({
    type: z.literal("donate"),
    amount: amountSchema,
  })
  .strict();

export const claimPodiumRewardCommandSchema = z
  .object({
    type: z.literal("claim_podium_reward"),
    recipient: z.string().trim().min(1).max(256),
  })
  .strict();

export const gameCommandSchema = z.discriminatedUnion("type", [
  joinCommandSchema,
  startCommandSchema,
  moveCommandSchema,
  shootCommandSchema,
  giveCommandSchema,
  upgradeCommandSchema,
  claimActionPointsCommandSchema,
  curseVoteCommandSchema,
  pokeHeartSpawnCommandSchema,
  delegateCommandSchema,
  proposeNonAggressionCommandSchema,
  acceptNonAggressionCommandSchema,
  postBountyCommandSchema,
  acceptBountyCommandSchema,
  cancelBountyCommandSchema,
  withdrawBountyCommandSchema,
  donateCommandSchema,
  claimPodiumRewardCommandSchema,
]);

export const commandEnvelopeSchema = z
  .object({
    commandId: z.uuid(),
    idempotencyKey: z.string().min(8).max(128),
    expectedVersion: z.number().int().safe().nonnegative(),
    command: gameCommandSchema,
  })
  .strict();

export type GameCommand = z.infer<typeof gameCommandSchema>;
export type CommandEnvelope = z.infer<typeof commandEnvelopeSchema>;
export type JoinCommand = z.infer<typeof joinCommandSchema>;
export type MoveCommand = z.infer<typeof moveCommandSchema>;
export type ShootCommand = z.infer<typeof shootCommandSchema>;
export type GiveCommand = z.infer<typeof giveCommandSchema>;
