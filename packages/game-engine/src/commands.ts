import { z } from "zod";

export const hexSchema = z
  .object({
    q: z.number().int(),
    r: z.number().int(),
    s: z.number().int(),
  })
  .refine(({ q, r, s }) => q + r + s === 0, {
    message: "Cube coordinates must satisfy q + r + s = 0",
  });

const moveCommandSchema = z.object({
  type: z.literal("move"),
  target: hexSchema,
});

const shootCommandSchema = z.object({
  type: z.literal("shoot"),
  targetPlayerId: z.uuid(),
  shots: z.number().int().positive(),
});

const giveCommandSchema = z
  .object({
    type: z.literal("give"),
    targetPlayerId: z.uuid(),
    hearts: z.number().int().nonnegative().default(0),
    actionPoints: z.number().int().nonnegative().default(0),
  })
  .refine(({ actionPoints, hearts }) => actionPoints + hearts > 0, {
    message: "A gift must contain at least one heart or action point",
  });

const upgradeCommandSchema = z.object({
  type: z.literal("upgrade"),
});

const claimActionPointsCommandSchema = z.object({
  type: z.literal("claim_action_points"),
});

const curseVoteCommandSchema = z.object({
  type: z.literal("curse_vote"),
  targetPlayerId: z.uuid(),
});

export const gameCommandSchema = z.union([
  moveCommandSchema,
  shootCommandSchema,
  giveCommandSchema,
  upgradeCommandSchema,
  claimActionPointsCommandSchema,
  curseVoteCommandSchema,
]);

export const commandEnvelopeSchema = z.object({
  commandId: z.uuid(),
  idempotencyKey: z.string().min(8).max(128),
  expectedVersion: z.number().int().nonnegative(),
  command: gameCommandSchema,
});

export type GameCommand = z.infer<typeof gameCommandSchema>;
export type CommandEnvelope = z.infer<typeof commandEnvelopeSchema>;
