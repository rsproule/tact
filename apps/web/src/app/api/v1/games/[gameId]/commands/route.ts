import { consumeRateLimit } from "@tact/db";

import { commandRejectionResponse, problemResponse } from "@/lib/server/api-error";
import { submitGameCommand } from "@/lib/server/game-service";
import { requireRequestPrincipal } from "@/lib/server/identity";
import { readJsonObject, requireUuid } from "@/lib/server/request";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: { params: Promise<{ gameId: string }> },
): Promise<Response> {
  try {
    const principal = await requireRequestPrincipal(request);
    const rate = await consumeRateLimit({
      scope: "game.command",
      subject: principal.id,
      limit: 120,
      windowSeconds: 60,
    });
    if (!rate.allowed) {
      return Response.json(
        {
          type: "https://tact.game/problems/rate_limited",
          title: "Too many commands",
          status: 429,
          detail: "Command rate limit reached.",
          code: "rate_limited",
        },
        {
          status: 429,
          headers: {
            "content-type": "application/problem+json",
            "retry-after": String(Math.max(1, Math.ceil((rate.resetAt.getTime() - Date.now()) / 1_000))),
          },
        },
      );
    }
    const { gameId } = await context.params;
    const actorHeader = request.headers.get("tact-actor-player");
    const result = await submitGameCommand({
      gameId,
      principal,
      body: await readJsonObject(request),
      ...(actorHeader ? { actorPlayerId: requireUuid(actorHeader, "Tact-Actor-Player") } : {}),
    });
    if (result.command.status === "rejected") return commandRejectionResponse(result.command);
    return Response.json(result, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return problemResponse(error);
  }
}
