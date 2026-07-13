import type { PrincipalView } from "@tact/db";
import { headers } from "next/headers";

import { TactGameApp } from "@/components/game-app";
import {
  normalizeGameSummary,
  type GameSummary,
  type LocalIdentity,
} from "@/components/game-client";
import { listGames } from "@/lib/server/game-service";
import { resolveBrowserSessionPrincipal } from "@/lib/server/identity";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function Home() {
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
  let initialGames: GameSummary[] | undefined;
  let initialDataError: string | null = null;
  try {
    const result = await listGames({ principal, limit: 20 });
    initialGames = result.games.map(normalizeGameSummary);
  } catch {
    initialDataError = "Could not load the matches.";
  }

  return (
    <TactGameApp
      key={initialIdentity?.id ?? "anonymous"}
      initialIdentity={initialIdentity}
      initialSessionError={initialSessionError}
      initialGames={initialGames}
      initialDataError={initialDataError}
    />
  );
}
