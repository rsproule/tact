export const dynamic = "force-dynamic";

export function GET(request: Request): Response {
  const base = new URL(request.url);

  return Response.json({
    name: "Tact API",
    version: "1.0.0",
    audience: ["human", "agent"],
    paymentProtocol: "mpp",
    agentCashCompatible: true,
    links: {
      health: new URL("/api/v1/health", base).toString(),
      openapi: new URL("/openapi.json", base).toString(),
      ruleset: new URL("/api/v1/rulesets/legacy-v2", base).toString(),
      games: new URL("/api/v1/games", base).toString(),
      session: new URL("/api/v1/session", base).toString(),
      paidEcho: new URL("/api/v1/paid/echo", base).toString(),
    },
  });
}
