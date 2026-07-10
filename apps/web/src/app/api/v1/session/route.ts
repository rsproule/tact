import { consumeRateLimit, hashJson } from "@tact/db";

import { ApiError, problemResponse } from "@/lib/server/api-error";
import {
  clearSessionCookie,
  refreshAnonymousSession,
  requireRequestPrincipal,
  revokeAnonymousSession,
} from "@/lib/server/identity";
import { readJsonObject, requestIp, requireString } from "@/lib/server/request";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request): Promise<Response> {
  try {
    const principal = await requireRequestPrincipal(request);
    return Response.json({ principal }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return problemResponse(error);
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const subject = await hashJson(requestIp(request));
    const rate = await consumeRateLimit({
      scope: "session.create",
      subject,
      limit: 10,
      windowSeconds: 60,
    });
    if (!rate.allowed) {
      throw new ApiError(429, "rate_limited", "Too many requests", "Try again after the rate-limit window.", {
        resetAt: rate.resetAt.toISOString(),
      });
    }
    const body = await readJsonObject(request);
    const displayName = requireString(body.displayName, "displayName", { min: 1, max: 64 });
    const session = await refreshAnonymousSession(request, displayName);
    return Response.json(
      {
        principal: session.principal,
        expiresAt: session.expiresAt,
      },
      {
        status: 201,
        headers: {
          "set-cookie": session.cookie,
          "cache-control": "no-store",
        },
      },
    );
  } catch (error) {
    return problemResponse(error);
  }
}

export async function DELETE(request: Request): Promise<Response> {
  try {
    await revokeAnonymousSession(request);
    return new Response(null, {
      status: 204,
      headers: { "set-cookie": clearSessionCookie(), "cache-control": "no-store" },
    });
  } catch (error) {
    return problemResponse(error);
  }
}
