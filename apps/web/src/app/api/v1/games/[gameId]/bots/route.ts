import { consumeRateLimit } from "@tact/db";

import { ApiError, commandRejectionResponse, problemResponse } from "@/lib/server/api-error";
import { addBots } from "@/lib/server/game-service";
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
      scope: "game.bot.add",
      subject: principal.id,
      limit: 20,
      windowSeconds: 3_600,
    });
    if (!rate.allowed) {
      throw new ApiError(429, "rate_limited", "Too many requests", "Bot creation limit reached.");
    }
    const { gameId } = await context.params;
    const result = await addBots({ gameId, principal, body: await readJsonObject(request) });
    const rejected = result.commands.find((command) => command.status === "rejected");
    if (rejected) return commandRejectionResponse(rejected);
    return Response.json(result, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return problemResponse(error);
  }
}
