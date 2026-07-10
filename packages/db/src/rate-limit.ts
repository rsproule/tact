import { sql } from "drizzle-orm";

import { getDatabase } from "./client";
import { rateLimits } from "./schema";

export type RateLimitResult = Readonly<{
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: Date;
}>;

export async function consumeRateLimit(input: {
  scope: string;
  subject: string;
  limit: number;
  windowSeconds: number;
  now?: Date;
}): Promise<RateLimitResult> {
  const now = input.now ?? new Date();
  const windowMs = input.windowSeconds * 1_000;
  const windowStartedAt = new Date(Math.floor(now.getTime() / windowMs) * windowMs);
  const resetAt = new Date(windowStartedAt.getTime() + windowMs);

  const [row] = await getDatabase()
    .insert(rateLimits)
    .values({
      scope: input.scope,
      subject: input.subject,
      windowStartedAt,
      count: 1,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [rateLimits.scope, rateLimits.subject, rateLimits.windowStartedAt],
      set: { count: sql`${rateLimits.count} + 1`, updatedAt: now },
    })
    .returning({ count: rateLimits.count });
  const count = row?.count ?? 1;

  return {
    allowed: count <= input.limit,
    limit: input.limit,
    remaining: Math.max(0, input.limit - count),
    resetAt,
  };
}
