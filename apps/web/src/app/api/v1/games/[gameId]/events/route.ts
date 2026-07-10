import { ApiError, problemResponse } from "@/lib/server/api-error";
import { getEvents } from "@/lib/server/game-service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  request: Request,
  context: { params: Promise<{ gameId: string }> },
): Promise<Response> {
  try {
    const { gameId } = await context.params;
    const url = new URL(request.url);
    const after = Number(url.searchParams.get("after") ?? "0");
    const limit = Number(url.searchParams.get("limit") ?? "100");
    if (!Number.isSafeInteger(after) || after < 0 || !Number.isSafeInteger(limit) || limit < 1 || limit > 200) {
      throw new ApiError(400, "invalid_pagination", "Invalid pagination", "after must be non-negative and limit must be 1..200.");
    }
    return Response.json(await getEvents({ gameId, after, limit }), {
      headers: { "cache-control": "no-store" },
    });
  } catch (error) {
    return problemResponse(error);
  }
}
