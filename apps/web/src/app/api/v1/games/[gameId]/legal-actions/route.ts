import { problemResponse } from "@/lib/server/api-error";
import { getLegalActions } from "@/lib/server/game-service";
import { resolveRequestPrincipal } from "@/lib/server/identity";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  request: Request,
  context: { params: Promise<{ gameId: string }> },
): Promise<Response> {
  try {
    const { gameId } = await context.params;
    return Response.json(await getLegalActions(gameId, await resolveRequestPrincipal(request)), {
      headers: { "cache-control": "no-store" },
    });
  } catch (error) {
    return problemResponse(error);
  }
}
