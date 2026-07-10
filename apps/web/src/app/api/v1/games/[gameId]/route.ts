import { problemResponse } from "@/lib/server/api-error";
import { getGame } from "@/lib/server/game-service";
import { resolveRequestPrincipal } from "@/lib/server/identity";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  request: Request,
  context: { params: Promise<{ gameId: string }> },
): Promise<Response> {
  try {
    const { gameId } = await context.params;
    const game = await getGame(gameId, await resolveRequestPrincipal(request));
    return Response.json({ game }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return problemResponse(error);
  }
}
