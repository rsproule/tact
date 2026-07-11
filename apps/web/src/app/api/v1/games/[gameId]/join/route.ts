import { consumeRateLimit } from "@tact/db";

import { withMppCharge } from "@/lib/payments";
import { ApiError, commandRejectionResponse, problemResponse } from "@/lib/server/api-error";
import { getGame, joinGame } from "@/lib/server/game-service";
import {
  issueWalletAgentToken,
  requireRequestPrincipal,
  resolveRequestPrincipal,
  resolveVerifiedMppWalletPrincipal,
} from "@/lib/server/identity";
import { readJsonObject } from "@/lib/server/request";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: { params: Promise<{ gameId: string }> },
): Promise<Response> {
  try {
    const { gameId } = await context.params;
    const existingPrincipal = await resolveRequestPrincipal(request);
    const game = await getGame(gameId, existingPrincipal);
    const config = game.config as Record<string, unknown>;
    const price = String(config.entryPriceUsd ?? "0");

    if (price !== "0") {
      return withMppCharge(
        request,
        {
          amount: price,
          description: `Join ${String(config.name ?? "Tact game")}`,
          scope: `tact:game:${gameId}:join`,
          meta: { gameId, purpose: "match_entry" },
        },
        async (_paidRequest, payment) => {
          try {
            const body = await readJsonObject(_paidRequest);
            const principal =
              existingPrincipal ??
              (payment.payer ? await resolveVerifiedMppWalletPrincipal(payment.payer) : null);
            if (!principal) await requireRequestPrincipal(request);
            const authenticated = principal ?? (await requireRequestPrincipal(request));
            await enforceJoinRate(authenticated.id);
            const result = await joinGame({
              gameId,
              principal: authenticated,
              body,
              payment,
            });
            if (result.command.status === "rejected") {
              return commandRejectionResponse(result.command);
            }
            // Wallet payers have no other credential for /commands, so hand
            // them a bearer token bound to the same principal. Replays mint a
            // fresh token because the original is only ever returned once.
            const agentToken =
              !existingPrincipal && payment.payer
                ? await issueWalletAgentToken(authenticated)
                : undefined;
            return Response.json(
              agentToken ? { ...result, agentToken } : result,
              { headers: { "cache-control": "no-store" } },
            );
          } catch (error) {
            return problemResponse(error);
          }
        },
      );
    }

    const principal = existingPrincipal ?? (await requireRequestPrincipal(request));
    await enforceJoinRate(principal.id);
    const result = await joinGame({
      gameId,
      principal,
      body: await readJsonObject(request),
    });
    if (result.command.status === "rejected") return commandRejectionResponse(result.command);
    return Response.json(result, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return problemResponse(error);
  }
}

async function enforceJoinRate(principalId: string): Promise<void> {
  const rate = await consumeRateLimit({
    scope: "game.join",
    subject: principalId,
    limit: 20,
    windowSeconds: 3_600,
  });
  if (!rate.allowed) {
    throw new ApiError(429, "rate_limited", "Too many requests", "Join rate limit reached.");
  }
}
