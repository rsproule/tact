"use client";

import type { GameEvent, PlayerView } from "./game-client";

type EventLogProps = Readonly<{
  events: GameEvent[];
  players: PlayerView[];
  loading?: boolean;
}>;

export function EventLog({ events, players, loading = false }: EventLogProps) {
  const playersById = new Map(players.map((player) => [player.id, player]));

  return (
    <section className="event-log panel-card" aria-labelledby="event-log-title">
      <header className="panel-heading">
        <div>
          <span className="eyebrow">LIVE FEED</span>
          <h2 id="event-log-title">Match events</h2>
        </div>
        <span className={`live-indicator ${loading ? "is-loading" : ""}`}>
          <i /> {loading ? "SYNCING" : "LIVE"}
        </span>
      </header>
      <ol className="event-list" aria-live="polite">
        {events.length === 0 ? (
          <li className="event-empty">
            <span className="event-glyph">···</span>
            <div><strong>Nothing on the wire yet</strong><p>Commands and game changes will appear here.</p></div>
          </li>
        ) : (
          [...events].reverse().map((event) => {
            const presentation = describeEvent(event, playersById);
            return (
              <li key={`${event.sequence}-${event.id}`} className="event-item">
                <span className={`event-glyph ${presentation.tone}`}>{presentation.glyph}</span>
                <div className="event-copy">
                  <strong>{presentation.title}</strong>
                  <p>{presentation.detail}</p>
                </div>
                <div className="event-meta">
                  <time dateTime={event.occurredAt}>{relativeTime(event.occurredAt)}</time>
                  <span>#{event.sequence}</span>
                </div>
              </li>
            );
          })
        )}
      </ol>
    </section>
  );
}

function describeEvent(
  event: GameEvent,
  players: Map<string, PlayerView>,
): { glyph: string; tone: string; title: string; detail: string } {
  const payload = event.payload;
  const joinedPlayer = asRecord(payload.player);
  const actor = playerName(
    payload.playerId ??
      payload.actorPlayerId ??
      payload.attackerPlayerId ??
      payload.fromPlayerId ??
      payload.voterPlayerId ??
      payload.killerPlayerId ??
      payload.saviorPlayerId ??
      payload.ownerPlayerId ??
      payload.proposerPlayerId ??
      joinedPlayer.playerId,
    players,
    typeof joinedPlayer.handle === "string" ? joinedPlayer.handle : "A player",
  );
  const target = playerName(
    payload.targetPlayerId ??
      payload.toPlayerId ??
      payload.victimPlayerId ??
      payload.revivedPlayerId,
    players,
    "a rival",
  );
  const type = event.type.toLowerCase();

  if (type.includes("join")) {
    return { glyph: "+", tone: "good", title: `${actor} entered the match`, detail: "A new tank is online." };
  }
  if (type.includes("move")) {
    const coordinate = asCoordinate(payload.to ?? payload.target ?? payload.position);
    return { glyph: "↗", tone: "info", title: `${actor} repositioned`, detail: coordinate ? `Moved to ${coordinate}.` : "Tank position changed." };
  }
  if (type.includes("shoot") || type.includes("damage")) {
    return { glyph: "×", tone: "danger", title: `${actor} fired on ${target}`, detail: `${number(payload.shots ?? payload.damage, 1)} shot${number(payload.shots ?? payload.damage, 1) === 1 ? "" : "s"} resolved.` };
  }
  if (type.includes("death") || type.includes("destroy")) {
    return { glyph: "†", tone: "danger", title: `${target} was destroyed`, detail: actor === "A player" ? "A tank joined the cursing jury." : `${actor} landed the final shot.` };
  }
  if (type.includes("revive")) {
    return { glyph: "♥", tone: "good", title: `${target} is back online`, detail: `${actor} supplied a heart.` };
  }
  if (type.includes("give") || type.includes("gift")) {
    const hearts = number(payload.hearts);
    const actionPoints = number(payload.actionPoints ?? payload.aps);
    return { glyph: "⇄", tone: "good", title: `${actor} supplied ${target}`, detail: `${hearts ? `${hearts} heart${hearts === 1 ? "" : "s"}` : ""}${hearts && actionPoints ? " and " : ""}${actionPoints ? `${actionPoints} AP` : ""}.` };
  }
  if (type.includes("upgrade")) {
    return { glyph: "↑", tone: "info", title: `${actor} upgraded range`, detail: payload.newRange ?? payload.range ? `Range is now ${String(payload.newRange ?? payload.range)}.` : "Attack range increased." };
  }
  if (type.includes("claim") || type.includes("drip")) {
    return { glyph: "+", tone: "good", title: `${actor} claimed AP`, detail: `${number(payload.amount ?? payload.actionPoints, 1)} action point${number(payload.amount ?? payload.actionPoints, 1) === 1 ? "" : "s"} added.` };
  }
  if (type.includes("cursed")) {
    return { glyph: "!", tone: "warning", title: `${target} was cursed`, detail: payload.effect === "delay_drip" ? "Their next AP drip was delayed." : "The dead jury removed an action point." };
  }
  if (type.includes("vote") || type.includes("curse")) {
    return { glyph: "!", tone: "warning", title: `${actor} voted to curse ${target}`, detail: "A jury vote was recorded for this epoch." };
  }
  if (type.includes("spawn")) {
    return { glyph: "♥", tone: "good", title: "A heart appeared", detail: asCoordinate(payload.position) ? `Spawned at ${asCoordinate(payload.position)}.` : "A board resource is available." };
  }
  if (type.includes("start")) {
    return { glyph: "▶", tone: "good", title: "The match is live", detail: "Continuous-time play has begun." };
  }
  if (type.includes("end") || type.includes("win")) {
    return { glyph: "◆", tone: "warning", title: "Match complete", detail: `${target} holds the field.` };
  }
  if (type.includes("treaty") || type.includes("non_aggression")) {
    return { glyph: "◇", tone: "info", title: "Treaty state changed", detail: `${actor} and ${target} updated their pact.` };
  }
  if (type.includes("bounty")) {
    return { glyph: "$", tone: "warning", title: "Bounty state changed", detail: `${target} is part of a bounty action.` };
  }

  return {
    glyph: "·",
    tone: "muted",
    title: humanize(event.type),
    detail: actor === "A player" ? "Game state updated." : `Submitted by ${actor}.`,
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function playerName(value: unknown, players: Map<string, PlayerView>, fallback: string): string {
  return typeof value === "string" ? players.get(value)?.handle ?? fallback : fallback;
}

function asCoordinate(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const q = record.q ?? record.x;
  const r = record.r ?? record.y;
  const s = record.s ?? record.z;
  return [q, r, s].every((coordinate) => typeof coordinate === "number")
    ? `(${String(q)}, ${String(r)}, ${String(s)})`
    : null;
}

function number(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function humanize(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/^./, (first) => first.toUpperCase());
}

function relativeTime(value: string): string {
  const elapsed = Date.now() - new Date(value).getTime();
  if (!Number.isFinite(elapsed) || elapsed < 0) return "now";
  const seconds = Math.floor(elapsed / 1000);
  if (seconds < 10) return "now";
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return hours < 24 ? `${hours}h` : `${Math.floor(hours / 24)}d`;
}
