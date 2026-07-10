import { consumeRateLimit } from "@tact/db";

import { ApiError, commandRejectionResponse, problemResponse } from "@/lib/server/api-error";
import { tickBots } from "@/lib/server/game-service";
import { requireRequestPrincipal } from "@/lib/server/identity";
import { readJsonObject } from "@/lib/server/request";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: { params: Promise<{ gameId: string }> },
): Promise<Response> {
  try {
    const principal = await requireRequestPrincipal(request);
    const rate = await consumeRateLimit({
      scope: "game.bot.tick",
      subject: principal.id,
      limit: 120,
      windowSeconds: 60,
    });
    if (!rate.allowed) {
      throw new ApiError(429, "rate_limited", "Too many requests", "Bot tick rate limit reached.");
    }
    const { gameId } = await context.params;
    const result = await tickBots({ gameId, principal, body: await readJsonObject(request) });
    if (result.command.status === "rejected") return commandRejectionResponse(result.command);
    return Response.json(result, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return problemResponse(error);
  }
}
