import type { PrincipalView } from "@tact/db";
import { headers } from "next/headers";

import { TactGameApp } from "@/components/game-app";
import {
  normalizeGameEvent,
  normalizeGameView,
  type GameEvent,
  type GameView,
  type LocalIdentity,
} from "@/components/game-client";
import { getEvents, getGame } from "@/lib/server/game-service";
import { resolveBrowserSessionPrincipal } from "@/lib/server/identity";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function GamePage({
  params,
}: Readonly<{ params: Promise<{ gameId: string }> }>) {
  const { gameId } = await params;
  let principal: PrincipalView | null = null;
  let initialSessionError: string | null = null;
  try {
    principal = await resolveBrowserSessionPrincipal((await headers()).get("cookie"));
  } catch {
    initialSessionError = "Could not open your Tact session.";
  }

  const initialIdentity: LocalIdentity | null = principal
    ? { id: principal.id, handle: principal.displayName, kind: principal.kind }
    : null;
  let initialGame: GameView | null = null;
  let initialEvents: GameEvent[] | undefined;
  let initialDataError: string | null = null;

  const [gameResult, eventsResult] = await Promise.allSettled([
    getGame(gameId, principal),
    getEvents({ gameId, after: 0, limit: 100 }),
  ]);
  if (gameResult.status === "fulfilled") {
    initialGame = normalizeGameView(gameResult.value);
  } else {
    initialDataError = "This match does not exist or is unavailable.";
  }
  if (eventsResult.status === "fulfilled") {
    initialEvents = eventsResult.value.events.map(normalizeGameEvent);
  }

  return (
    <TactGameApp
      key={`${initialIdentity?.id ?? "anonymous"}:${gameId}`}
      gameId={gameId}
      initialIdentity={initialIdentity}
      initialSessionError={initialSessionError}
      initialGame={initialGame}
      initialEvents={initialEvents}
      initialDataError={initialDataError}
    />
  );
}
