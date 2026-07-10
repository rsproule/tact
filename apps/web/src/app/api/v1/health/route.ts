import { isDatabaseConfigured, pingDatabase } from "@tact/db";

import { isPaymentConfigured } from "@/lib/payments";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(): Promise<Response> {
  const database = await checkDatabase();

  return Response.json({
    status: database.status === "ready" ? "ready" : "degraded",
    service: "tact",
    checks: {
      gameplay: database,
      payments: { status: isPaymentConfigured() ? "ready" : "unavailable" },
    },
    timestamp: new Date().toISOString(),
  });
}

async function checkDatabase(): Promise<{ status: "ready" | "not_configured" | "unavailable" }> {
  if (!isDatabaseConfigured()) {
    return { status: "not_configured" };
  }

  try {
    await pingDatabase();
    return { status: "ready" };
  } catch {
    return { status: "unavailable" };
  }
}
