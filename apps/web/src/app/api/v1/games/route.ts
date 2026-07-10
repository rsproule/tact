import { consumeRateLimit } from "@tact/db";

import { ApiError, problemResponse } from "@/lib/server/api-error";
import { createGame, listGames } from "@/lib/server/game-service";
import { requireRequestPrincipal, resolveRequestPrincipal } from "@/lib/server/identity";
import { readJsonObject } from "@/lib/server/request";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const rawLimit = Number(url.searchParams.get("limit") ?? "20");
    if (!Number.isSafeInteger(rawLimit) || rawLimit < 1 || rawLimit > 50) {
      throw new ApiError(400, "invalid_pagination", "Invalid pagination", "limit must be between 1 and 50.");
    }
    const beforeRaw = url.searchParams.get("before");
    const before = beforeRaw ? new Date(beforeRaw) : undefined;
    if (before && Number.isNaN(before.getTime())) {
      throw new ApiError(400, "invalid_pagination", "Invalid pagination", "before must be an ISO timestamp.");
    }
    const statusRaw = url.searchParams.get("status");
    const statuses = ["lobby", "active", "ended", "cancelled"] as const;
    if (statusRaw && !statuses.includes(statusRaw as (typeof statuses)[number])) {
      throw new ApiError(400, "invalid_filter", "Invalid filter", "Unknown game status.");
    }
    const result = await listGames({
      principal: await resolveRequestPrincipal(request),
      limit: rawLimit,
      ...(before ? { before } : {}),
      ...(statusRaw ? { status: statusRaw as (typeof statuses)[number] } : {}),
    });
    return Response.json(result, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return problemResponse(error);
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const principal = await requireRequestPrincipal(request);
    const rate = await consumeRateLimit({
      scope: "game.create",
      subject: principal.id,
      limit: 10,
      windowSeconds: 3_600,
    });
    if (!rate.allowed) {
      throw new ApiError(429, "rate_limited", "Too many requests", "Game creation limit reached.");
    }
    const result = await createGame(principal, await readJsonObject(request));
    return Response.json(result, {
      status: result.replayed ? 200 : 201,
      headers: { "cache-control": "no-store" },
    });
  } catch (error) {
    return problemResponse(error);
  }
}
