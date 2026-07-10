import { consumeRateLimit } from "@tact/db";

import { ApiError, problemResponse } from "@/lib/server/api-error";
import { issueAgentToken, requireRequestPrincipal } from "@/lib/server/identity";
import { readJsonObject, requireString } from "@/lib/server/request";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  try {
    const creator = await requireRequestPrincipal(request);
    const rate = await consumeRateLimit({
      scope: "agent-token.create",
      subject: creator.id,
      limit: 5,
      windowSeconds: 3_600,
    });
    if (!rate.allowed) {
      throw new ApiError(429, "rate_limited", "Too many requests", "Agent token creation limit reached.");
    }
    const body = await readJsonObject(request);
    const displayName = requireString(body.displayName, "displayName", { min: 1, max: 64 });
    const issued = await issueAgentToken({ creator, displayName });
    return Response.json(
      {
        principal: issued.principal,
        token: issued.token,
        warning: "This token is shown once. Store it securely and send it as Tact-Agent-Token or Bearer.",
      },
      { status: 201, headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    return problemResponse(error);
  }
}
