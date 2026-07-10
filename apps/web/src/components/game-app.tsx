"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";

import { EventLog } from "./event-log";
import {
  ApiError,
  addBots,
  createAgentToken,
  createGame,
  getEvents,
  getGame,
  getLegalActions,
  joinGame,
  listGames,
  runBotTick,
  submitCommand,
  type BotStrategy,
  type GameCommand,
  type GameConfig,
  type GameEvent,
  type GameSummary,
  type GameView,
  type HexCoordinate,
  type LegalAction,
  type LocalIdentity,
  type PlayerView,
} from "./game-client";
import { HexBoard, hexDistance, type BoardSelection } from "./hex-board";
import { useLocalIdentity } from "./use-local-identity";

type TactGameAppProps = Readonly<{ gameId?: string }>;

export function TactGameApp({ gameId }: TactGameAppProps) {
  const router = useRouter();
  const session = useLocalIdentity();

  if (session.status === "loading" && !session.identity) {
    return <SessionLoading />;
  }

  if (!session.identity) {
    return (
      <SessionGate
        error={session.error}
        suggestedDisplayName={session.suggestedDisplayName}
        onRetry={session.retry}
        onSignIn={session.signIn}
      />
    );
  }

  return (
    <main className={gameId ? "app-frame match-frame" : "app-frame lobby-frame"}>
      {gameId ? (
        <MatchView
          gameId={gameId}
          identity={session.identity}
          onSignOut={session.signOut}
          onExit={() => router.push("/")}
        />
      ) : (
        <Lobby
          identity={session.identity}
          onSignOut={session.signOut}
          onOpenGame={(id) => router.push(`/game/${id}` as Route)}
        />
      )}
    </main>
  );
}

type IdentityProps = Readonly<{
  identity: LocalIdentity;
  onSignOut: () => Promise<void>;
}>;

function SessionLoading() {
  return (
    <main className="session-shell">
      <div className="session-scan" aria-hidden="true" />
      <section className="session-card session-loading" aria-live="polite">
        <div className="session-brand"><span>T</span><strong>TACT</strong></div>
        <div className="radar-loader"><i /><i /><span /></div>
        <p className="eyebrow">VERIFYING BROWSER SESSION</p>
        <h1>Opening a secure command channel…</h1>
      </section>
    </main>
  );
}

function SessionGate({
  error,
  suggestedDisplayName,
  onRetry,
  onSignIn,
}: Readonly<{
  error: string | null;
  suggestedDisplayName: string;
  onRetry: () => Promise<void>;
  onSignIn: (displayName: string) => Promise<void>;
}>) {
  const [displayName, setDisplayName] = useState(suggestedDisplayName);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const submit = async () => {
    setSubmitting(true);
    setFormError(null);
    try {
      await onSignIn(displayName);
    } catch (caught) {
      setFormError(errorMessage(caught, "Could not create a guest session."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="session-shell">
      <div className="session-scan" aria-hidden="true" />
      <section className="session-card" aria-labelledby="session-title">
        <div className="session-card-copy">
          <div className="session-brand"><span>T</span><strong>TACT</strong><small>HUMANS × AGENTS</small></div>
          <p className="eyebrow"><i className="pulse-dot" /> IDENTITY HANDSHAKE</p>
          <h1 id="session-title">Enter the command network.</h1>
          <p className="session-intro">Choose the name other players will see. Tact creates a signed, anonymous browser session—no wallet or account required.</p>
          <form
            className="session-form"
            onSubmit={(event) => {
              event.preventDefault();
              void submit();
            }}
          >
            <label htmlFor="display-name">Display name</label>
            <div className="session-input-row">
              <input
                id="display-name"
                autoComplete="nickname"
                autoFocus
                maxLength={28}
                placeholder="e.g. Quiet Comet"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
              />
              <button className="button button-primary" type="submit" disabled={submitting || !displayName.trim()}>
                {submitting ? "Creating…" : "Continue →"}
              </button>
            </div>
          </form>
          {formError || error ? (
            <div className="session-error" role="alert">
              <span>!</span><p>{formError ?? error}</p>
              {error && !formError ? <button type="button" onClick={() => void onRetry()}>Retry connection</button> : null}
            </div>
          ) : null}
          <p className="session-fine-print">Your server-issued identity is stored in a secure HttpOnly cookie. The browser never chooses or sends a trusted principal ID.</p>
        </div>
        <aside className="session-side" aria-label="Game summary">
          <span className="session-side-index">TACT / 03</span>
          <div className="mini-hex-field" aria-hidden="true">
            {Array.from({ length: 19 }, (_, index) => <i key={index} />)}
            <b>T</b><b>A</b><b>×</b>
          </div>
          <dl>
            <div><dt>WORLD</dt><dd>Continuous time</dd></div>
            <div><dt>STATE</dt><dd>Versioned + durable</dd></div>
            <div><dt>PLAYERS</dt><dd>Humans and agents</dd></div>
          </dl>
        </aside>
      </section>
    </main>
  );
}

function Lobby({
  identity,
  onSignOut,
  onOpenGame,
}: IdentityProps & Readonly<{ onOpenGame: (id: string) => void }>) {
  const [games, setGames] = useState<GameSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  const refresh = useCallback(async (background = false) => {
    if (background) setRefreshing(true);
    else setLoading(true);
    try {
      setGames(await listGames());
      setError(null);
    } catch (caught) {
      setError(errorMessage(caught, "Could not reach the game service."));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const initial = window.setTimeout(() => void refresh(), 0);
    const interval = window.setInterval(() => void refresh(true), 8000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
    };
  }, [refresh]);

  const handleCreate = async (config: GameConfig) => {
    if (!identity) return;
    setCreating(true);
    setError(null);
    try {
      const game = await createGame(identity, config);
      await joinGame(game.id, identity, game.version);
      rememberOwnedGame(game.id);
      onOpenGame(game.id);
    } catch (caught) {
      setError(errorMessage(caught, "Could not create this match."));
    } finally {
      setCreating(false);
    }
  };

  const lobbyGames = games.filter((game) => game.status === "lobby");
  const activeGames = games.filter((game) => game.status === "active");
  const finishedGames = games.filter((game) => game.status === "ended");

  return (
    <>
      <TopBar identity={identity} onSignOut={onSignOut} />
      <div className="lobby-content">
        <header className="lobby-header">
          <div>
            <span className="eyebrow"><i className="pulse-dot" /> LIVE MATCH NETWORK</span>
            <h1>Choose your battlefield.</h1>
            <p>Create a room, join a seat, or watch humans and agents negotiate in real time.</p>
          </div>
          <button
            className="button button-primary create-button"
            type="button"
            disabled={!identity}
            onClick={() => setShowCreate(true)}
          >
            <span className="button-icon">＋</span> Create match
          </button>
        </header>

        <section className="network-stats" aria-label="Network overview">
          <Stat label="Open lobbies" value={lobbyGames.length} accent="lime" />
          <Stat label="Battles live" value={activeGames.length} accent="red" />
          <Stat label="Completed" value={finishedGames.length} accent="blue" />
          <div className="network-sync">
            <span>STATE AUTHORITY</span>
            <strong>NEON / VERSIONED</strong>
            <button type="button" onClick={() => void refresh(true)} disabled={refreshing}>
              {refreshing ? "SYNCING…" : "REFRESH ↻"}
            </button>
          </div>
        </section>

        {error ? <ErrorBanner message={error} onRetry={() => void refresh()} /> : null}

        <section className="match-browser" aria-labelledby="match-browser-title">
          <header className="section-title-row">
            <div>
              <span className="eyebrow">MATCH DIRECTORY</span>
              <h2 id="match-browser-title">Open rooms and live games</h2>
            </div>
            <div className="status-key" aria-label="Status legend">
              <span><i className="status-dot lobby" /> Lobby</span>
              <span><i className="status-dot active" /> Active</span>
              <span><i className="status-dot ended" /> Ended</span>
            </div>
          </header>

          {loading ? (
            <GameListSkeleton />
          ) : games.length === 0 ? (
            <EmptyLobby onCreate={() => setShowCreate(true)} />
          ) : (
            <div className="game-list">
              {games.map((game) => (
                <GameCard game={game} key={game.id} onOpen={() => onOpenGame(game.id)} />
              ))}
            </div>
          )}
        </section>
      </div>

      {showCreate && identity ? (
        <CreateMatchDialog
          identity={identity}
          creating={creating}
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      ) : null}
    </>
  );
}

function TopBar({
  identity,
  onSignOut,
  game,
  onExit,
  onShare,
}: IdentityProps &
  Readonly<{
    game?: GameView;
    onExit?: () => void;
    onShare?: () => void;
  }>) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [agentFormOpen, setAgentFormOpen] = useState(false);
  const [agentName, setAgentName] = useState(`${identity.handle} agent`);
  const [agentToken, setAgentToken] = useState<string | null>(null);
  const [issuingAgent, setIssuingAgent] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const copyPrincipalId = async () => {
    try {
      await navigator.clipboard.writeText(identity.id);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy your player identity", identity.id);
    }
  };

  const issueAgent = async () => {
    const clean = agentName.trim();
    if (!clean) return;
    setIssuingAgent(true);
    setProfileError(null);
    try {
      setAgentToken(await createAgentToken(clean));
    } catch (caught) {
      setProfileError(errorMessage(caught, "Could not provision this agent."));
    } finally {
      setIssuingAgent(false);
    }
  };

  const copyAgentToken = async () => {
    if (!agentToken) return;
    try {
      await navigator.clipboard.writeText(agentToken);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy this one-time agent token", agentToken);
    }
  };

  return (
    <nav className="top-bar" aria-label="Tact navigation">
      <button className="brand" type="button" onClick={onExit} disabled={!onExit}>
        <span className="brand-mark">T</span>
        <span><strong>TACT</strong><small>HUMANS × AGENTS</small></span>
      </button>
      {game ? (
        <div className="match-breadcrumb">
          <span>/</span>
          <strong>MATCH {shortId(game.id)}</strong>
          <StatusBadge status={game.status} />
        </div>
      ) : (
        <div className="top-system-state"><i className="pulse-dot" /> COMMAND NETWORK ONLINE</div>
      )}
      <div className="top-actions">
        {onShare ? <button className="icon-button" type="button" onClick={onShare} title="Copy match link">↗ <span>Share</span></button> : null}
        <div className="profile-control">
          <button
            className="identity-chip"
            type="button"
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen((current) => !current)}
          >
            <span className="avatar">{initials(identity.handle)}</span>
            <span><small>GUEST PILOT</small><strong>{identity.handle}</strong></span>
            <i>{profileOpen ? "⌃" : "⌄"}</i>
          </button>
          {profileOpen ? (
            <div className="profile-menu">
              <div><small>SERVER IDENTITY</small><code>{shortId(identity.id)}</code></div>
              <p>Signed browser session · cookie secured</p>
              <button type="button" onClick={() => void copyPrincipalId()}>{copied ? "Copied player ID ✓" : "Copy player ID"}</button>
              <button type="button" onClick={() => setAgentFormOpen((current) => !current)}>Provision an agent token</button>
              {agentFormOpen ? (
                <form className="agent-token-form" onSubmit={(event) => { event.preventDefault(); void issueAgent(); }}>
                  <label htmlFor="agent-display-name">Agent display name</label>
                  <div><input id="agent-display-name" maxLength={64} value={agentName} onChange={(event) => setAgentName(event.target.value)} /><button type="submit" disabled={issuingAgent}>{issuingAgent ? "…" : "Issue"}</button></div>
                </form>
              ) : null}
              {agentToken ? (
                <div className="agent-token-result">
                  <small>SHOWN ONCE — STORE SECURELY</small>
                  <code>{agentToken}</code>
                  <button type="button" onClick={() => void copyAgentToken()}>{copied ? "Copied token ✓" : "Copy agent token"}</button>
                </div>
              ) : null}
              {profileError ? <p className="profile-error" role="alert">{profileError}</p> : null}
              <button className="profile-logout" type="button" onClick={() => void onSignOut()}>End session</button>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

function GameCard({ game, onOpen }: Readonly<{ game: GameSummary; onOpen: () => void }>) {
  const occupancy = Math.min(100, (game.playersCount / game.config.maxPlayers) * 100);
  return (
    <article className={`game-card status-${game.status}`}>
      <button type="button" className="game-card-hit" onClick={onOpen} aria-label={`Open match ${shortId(game.id)}`} />
      <div className="game-status-column">
        <StatusBadge status={game.status} />
        <span className="game-id">#{shortId(game.id)}</span>
      </div>
      <div className="game-main-column">
        <h3>{game.status === "lobby" ? "Open command room" : game.status === "active" ? "Battle in progress" : "Archived battlefield"}</h3>
        <p>{game.rulesetVersion.toUpperCase()} · radius {game.config.boardSize} · {formatDuration(game.config.epochSeconds)} epochs</p>
        <div className="occupancy-track"><i style={{ width: `${occupancy}%` }} /></div>
      </div>
      <div className="game-metric"><span>PLAYERS</span><strong>{game.playersCount}<small>/{game.config.maxPlayers}</small></strong></div>
      <div className="game-metric"><span>START LOADOUT</span><strong>{game.config.initHearts}♥ <small>{game.config.initActionPoints}AP</small></strong></div>
      <button className="game-open-button" type="button" onClick={onOpen}>{game.status === "lobby" ? "Join" : "Watch"} <span>→</span></button>
    </article>
  );
}

function CreateMatchDialog({
  identity,
  creating,
  onClose,
  onCreate,
}: Readonly<{
  identity: LocalIdentity;
  creating: boolean;
  onClose: () => void;
  onCreate: (config: GameConfig) => Promise<void>;
}>) {
  const [config, setConfig] = useState<GameConfig>({
    maxPlayers: 4,
    boardSize: 4,
    epochSeconds: 300,
    initHearts: 3,
    initActionPoints: 3,
    initRange: 3,
  });

  const updateNumber = (key: keyof GameConfig, value: string) => {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) setConfig((current) => ({ ...current, [key]: parsed }));
  };

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="dialog create-dialog" role="dialog" aria-modal="true" aria-labelledby="create-title">
        <header>
          <div><span className="eyebrow">NEW BATTLEFIELD</span><h2 id="create-title">Configure match</h2></div>
          <button className="dialog-close" type="button" onClick={onClose} aria-label="Close">×</button>
        </header>
        <p className="dialog-intro">You will own the room as <strong>{identity.handle}</strong>. Settings lock when the match begins.</p>
        <div className="form-grid">
          <NumberField label="Players" detail="Seats in the room" min={2} max={12} value={config.maxPlayers} onChange={(value) => updateNumber("maxPlayers", value)} />
          <NumberField label="Board radius" detail="Signed cube hexes" min={2} max={14} value={config.boardSize} onChange={(value) => updateNumber("boardSize", value)} />
          <NumberField label="Epoch seconds" detail="AP accrual cadence" min={30} max={86400} value={config.epochSeconds} onChange={(value) => updateNumber("epochSeconds", value)} />
          <NumberField label="Starting hearts" detail="Tank durability" min={1} max={12} value={config.initHearts} onChange={(value) => updateNumber("initHearts", value)} />
          <NumberField label="Starting AP" detail="Opening mobility" min={1} max={30} value={config.initActionPoints} onChange={(value) => updateNumber("initActionPoints", value)} />
          <NumberField label="Starting range" detail="Attack and gift radius" min={1} max={10} value={config.initRange} onChange={(value) => updateNumber("initRange", value)} />
        </div>
        <div className="ruleset-callout"><span>RULESET</span><strong>LEGACY-V2 COMPATIBILITY</strong><p>Continuous time · last tank standing · dead jury enabled</p></div>
        <footer>
          <button className="button button-ghost" type="button" onClick={onClose}>Cancel</button>
          <button className="button button-primary" type="button" disabled={creating} onClick={() => void onCreate(config)}>{creating ? "Creating…" : "Create & enter →"}</button>
        </footer>
      </section>
    </div>
  );
}

function MatchView({
  gameId,
  identity,
  onSignOut,
  onExit,
}: IdentityProps & Readonly<{ gameId: string; onExit: () => void }>) {
  const [game, setGame] = useState<GameView | null>(null);
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [eventCursor, setEventCursor] = useState(0);
  const cursorRef = useRef(0);
  const [legalActions, setLegalActions] = useState<LegalAction[]>([]);
  const [selected, setSelected] = useState<BoardSelection | null>(null);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [joining, setJoining] = useState(false);
  const [commandPending, setCommandPending] = useState<string | null>(null);
  const [ownerPending, setOwnerPending] = useState<"bots" | "start" | "tick" | "fill" | null>(null);
  const [ownerHint, setOwnerHint] = useState(false);
  const [autoBots, setAutoBots] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const refreshInFlightRef = useRef(false);
  const mutationInFlightRef = useRef(false);
  const autoTickInFlightRef = useRef(false);

  const refreshGame = useCallback(async (background = false) => {
    refreshInFlightRef.current = true;
    if (!background) setLoading(true);
    try {
      const [nextGame, nextActions] = await Promise.all([
        getGame(gameId),
        getLegalActions(gameId).catch(() => []),
      ]);
      setGame(nextGame);
      const resolvedActions = nextActions.length ? nextActions : nextGame.legalActions;
      setLegalActions(resolvedActions);
      const startAction = resolvedActions.find((action) => action.type === "start");
      if (
        startAction &&
        startAction.reason !== "not_authorized" &&
        startAction.reason !== "authentication_required"
      ) {
        setOwnerHint(true);
        rememberOwnedGame(gameId);
      }
      setError(null);
    } catch (caught) {
      setError(errorMessage(caught, "Could not load this match."));
    } finally {
      refreshInFlightRef.current = false;
      setLoading(false);
    }
  }, [gameId]);

  const refreshEvents = useCallback(async () => {
    setEventsLoading(true);
    try {
      const result = await getEvents(gameId, cursorRef.current);
      if (result.events.length) {
        setEvents((current) => mergeEvents(current, result.events));
      }
      cursorRef.current = result.cursor;
      setEventCursor(result.cursor);
    } catch {
      // Match polling remains the primary state channel; event feed recovers on its next pass.
    } finally {
      setEventsLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    const initial = window.setTimeout(() => {
      void refreshGame();
      void refreshEvents();
    }, 0);
    const gameInterval = window.setInterval(() => void refreshGame(true), 3000);
    const eventInterval = window.setInterval(() => void refreshEvents(), 2200);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(gameInterval);
      window.clearInterval(eventInterval);
    };
  }, [identity, refreshEvents, refreshGame]);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(null), 3500);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  useEffect(() => {
    const initial = window.setTimeout(() => setOwnerHint(wasOwnedGame(gameId)), 0);
    return () => window.clearTimeout(initial);
  }, [gameId]);

  const canManageBots = Boolean(
    game && (ownerHint || game.ownerPrincipalId === identity.id),
  );
  const autoGameId = game?.id;
  const autoGameStatus = game?.status;
  const autoGameVersion = game?.version;

  useEffect(() => {
    if (
      !autoBots ||
      !autoGameId ||
      autoGameStatus !== "active" ||
      autoGameVersion === undefined ||
      !canManageBots
    ) return;
    const interval = window.setInterval(() => {
      if (
        refreshInFlightRef.current ||
        mutationInFlightRef.current ||
        autoTickInFlightRef.current
      ) return;

      autoTickInFlightRef.current = true;
      mutationInFlightRef.current = true;
      setOwnerPending("tick");
      void runBotTick(autoGameId, autoGameVersion)
        .then(async (updated) => {
          setGame(updated);
          await refreshEvents();
        })
        .catch(async (caught: unknown) => {
          if (caught instanceof ApiError && caught.code === "bot_no_action") return;
          if (caught instanceof ApiError && caught.status === 409) {
            await refreshGame(true);
            return;
          }
          setError(errorMessage(caught, "Automatic bot play paused after an error."));
          setAutoBots(false);
        })
        .finally(() => {
          autoTickInFlightRef.current = false;
          mutationInFlightRef.current = false;
          setOwnerPending(null);
        });
    }, 3400);
    return () => window.clearInterval(interval);
  }, [autoBots, autoGameId, autoGameStatus, autoGameVersion, canManageBots, refreshEvents, refreshGame]);

  const selfPlayer = useMemo(
    () => game?.players.find((player) => player.ownedByViewer) ?? game?.players.find((player) => player.controllableByViewer),
    [game?.players],
  );

  const handleJoin = async () => {
    if (!game || mutationInFlightRef.current) return;
    setJoining(true);
    mutationInFlightRef.current = true;
    setError(null);
    try {
      await joinGame(gameId, identity, game.version);
      setNotice("Seat secured. Your tank is on the grid.");
      await refreshGame(true);
      await refreshEvents();
    } catch (caught) {
      setError(errorMessage(caught, "Could not join this match."));
    } finally {
      mutationInFlightRef.current = false;
      setJoining(false);
    }
  };

  const handleCommand = async (command: GameCommand, successMessage: string) => {
    if (!game || mutationInFlightRef.current) return;
    setCommandPending(command.type);
    mutationInFlightRef.current = true;
    setError(null);
    try {
      const updated = await submitCommand(game.id, game.version, command);
      if (updated) setGame(updated);
      setSelected(null);
      setNotice(successMessage);
      await refreshGame(true);
      await refreshEvents();
    } catch (caught) {
      if (caught instanceof ApiError && caught.status === 409) {
        await refreshGame(true);
        setError("The battlefield changed first. State refreshed—review and try again.");
      } else {
        setError(errorMessage(caught, "Command rejected."));
      }
    } finally {
      mutationInFlightRef.current = false;
      setCommandPending(null);
    }
  };

  const handleAddBots = async (strategy: BotStrategy, count: number) => {
    if (!game || mutationInFlightRef.current) return;
    setOwnerPending("bots");
    mutationInFlightRef.current = true;
    setError(null);
    try {
      const updated = await addBots(game.id, game.version, strategy, count);
      setGame(updated);
      setNotice(`${count} ${strategy} bot${count === 1 ? "" : "s"} joined the lobby.`);
      await refreshGame(true);
      await refreshEvents();
    } catch (caught) {
      setError(ownerActionError(caught, "Could not add bots to this lobby."));
    } finally {
      mutationInFlightRef.current = false;
      setOwnerPending(null);
    }
  };

  const handleStart = async () => {
    if (!game || mutationInFlightRef.current) return;
    setOwnerPending("start");
    mutationInFlightRef.current = true;
    setError(null);
    try {
      const updated = await submitCommand(game.id, game.version, { type: "start" });
      if (updated) setGame(updated);
      setNotice("Match started. Commands are live.");
      await refreshGame(true);
      await refreshEvents();
    } catch (caught) {
      setError(ownerActionError(caught, "Could not start this match."));
    } finally {
      mutationInFlightRef.current = false;
      setOwnerPending(null);
    }
  };

  const handleFillAndStart = async (strategy: BotStrategy) => {
    if (!game || mutationInFlightRef.current) return;
    setOwnerPending("fill");
    mutationInFlightRef.current = true;
    setError(null);
    try {
      let current = game;
      if (!selfPlayer) {
        current = await joinGame(current.id, identity, current.version);
      }
      let remaining = Math.max(0, current.config.maxPlayers - current.playersCount);
      while (remaining > 0) {
        const batch = Math.min(8, remaining);
        current = await addBots(current.id, current.version, strategy, batch);
        remaining = Math.max(0, current.config.maxPlayers - current.playersCount);
      }
      const started = await submitCommand(current.id, current.version, { type: "start" });
      if (started) current = started;
      setGame(current);
      setNotice("Seats filled with bots. Match started.");
      await refreshGame(true);
      await refreshEvents();
    } catch (caught) {
      setError(ownerActionError(caught, "Could not fill and start this match."));
    } finally {
      mutationInFlightRef.current = false;
      setOwnerPending(null);
    }
  };

  const handleBotTick = async () => {
    if (!game || mutationInFlightRef.current) return;
    setOwnerPending("tick");
    mutationInFlightRef.current = true;
    setError(null);
    try {
      const updated = await runBotTick(game.id, game.version);
      setGame(updated);
      setNotice("One eligible bot advanced.");
      await refreshGame(true);
      await refreshEvents();
    } catch (caught) {
      setError(ownerActionError(caught, "No bot turn could be advanced."));
    } finally {
      mutationInFlightRef.current = false;
      setOwnerPending(null);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setNotice("Match link copied.");
    } catch {
      window.prompt("Copy this match URL", url);
    }
  };

  if (loading && !game) {
    return <MatchLoading identity={identity} onSignOut={onSignOut} onExit={onExit} />;
  }

  if (!game) {
    return (
      <>
        <TopBar identity={identity} onSignOut={onSignOut} onExit={onExit} />
        <div className="fatal-state"><span>404 / SIGNAL LOST</span><h1>Match unavailable.</h1><p>{error ?? "This battlefield does not exist or the service is offline."}</p><button className="button button-primary" onClick={onExit}>Return to lobby</button></div>
      </>
    );
  }

  const mode = selfPlayer ? (selfPlayer.state === "dead" ? "jury" : "player") : "spectator";
  const claimAction = legalActions.find(
    (action) =>
      action.type === "claim_action_points" &&
      action.enabled &&
      (!selfPlayer || action.details.targetPlayerId === selfPlayer.id),
  );
  const advertisedClaimable = claimAction?.details.claimable;
  const claimable = typeof advertisedClaimable === "number"
    ? advertisedClaimable
    : selfPlayer?.lastDripEpoch === undefined
      ? 0
      : Math.max(0, game.currentEpoch - selfPlayer.lastDripEpoch);

  return (
    <>
      <TopBar identity={identity} onSignOut={onSignOut} game={game} onExit={onExit} onShare={() => void handleShare()} />
      {error ? <ErrorBanner message={error} onDismiss={() => setError(null)} /> : null}
      {notice ? <div className="toast-notice" role="status"><i>✓</i>{notice}</div> : null}

      <div className="match-layout">
        <aside className="match-sidebar left-sidebar">
          <MatchOverview
            game={game}
            mode={mode}
            joining={joining}
            legalActions={legalActions}
            canManage={ownerHint || game.ownerPrincipalId === identity.id}
            ownerPending={ownerPending}
            autoBots={autoBots}
            onJoin={() => void handleJoin()}
            onAddBots={handleAddBots}
            onFillAndStart={handleFillAndStart}
            onStart={handleStart}
            onTick={handleBotTick}
            onToggleAutoBots={setAutoBots}
          />
          <PlayerRoster players={game.players} selfPlayer={selfPlayer} selectedPlayerId={selected?.player?.id} onSelect={(player) => setSelected({ coordinate: player.position, player })} />
        </aside>

        <section className="battlefield" aria-label="Battlefield">
          <HexBoard game={game} selfPlayer={selfPlayer} selected={selected?.coordinate} onSelect={setSelected} />
          {selfPlayer ? <PlayerHud player={selfPlayer} currentEpoch={game.currentEpoch} claimable={claimable} /> : <SpectatorHud onJoin={game.status === "lobby" ? () => void handleJoin() : undefined} joining={joining} />}
        </section>

        <aside className="match-sidebar right-sidebar">
          <ActionPanel
            game={game}
            selfPlayer={selfPlayer}
            selection={selected}
            legalActions={legalActions}
            pending={commandPending ?? (ownerPending ? `owner:${ownerPending}` : null)}
            claimable={claimable}
            onCommand={handleCommand}
          />
          <EventLog events={events} players={game.players} loading={eventsLoading} />
          <span className="cursor-readout">EVENT CURSOR {eventCursor}</span>
        </aside>
      </div>
    </>
  );
}

function MatchOverview({
  game,
  mode,
  joining,
  legalActions,
  canManage,
  ownerPending,
  autoBots,
  onJoin,
  onAddBots,
  onFillAndStart,
  onStart,
  onTick,
  onToggleAutoBots,
}: Readonly<{
  game: GameView;
  mode: "player" | "jury" | "spectator";
  joining: boolean;
  legalActions: LegalAction[];
  canManage: boolean;
  ownerPending: "bots" | "start" | "tick" | "fill" | null;
  autoBots: boolean;
  onJoin: () => void;
  onAddBots: (strategy: BotStrategy, count: number) => Promise<void>;
  onFillAndStart: (strategy: BotStrategy) => Promise<void>;
  onStart: () => Promise<void>;
  onTick: () => Promise<void>;
  onToggleAutoBots: (enabled: boolean) => void;
}>) {
  const [strategy, setStrategy] = useState<BotStrategy>("attack");
  const missingSeats = Math.max(0, game.config.maxPlayers - game.playersCount);
  const [botCount, setBotCount] = useState(1);
  const startAction = legalActions.find((action) => action.type === "start");
  const isOwner = canManage || Boolean(
    startAction &&
    startAction.reason !== "not_authorized" &&
    startAction.reason !== "authentication_required",
  );
  const canStart = startAction?.enabled ?? missingSeats === 0;
  const maximumBotBatch = Math.max(1, Math.min(8, missingSeats));

  return (
    <section className="panel-card match-overview">
      <header className="panel-heading"><div><span className="eyebrow">MATCH CONTROL</span><h2>#{shortId(game.id)}</h2></div><StatusBadge status={game.status} /></header>
      <dl className="match-facts">
        <div><dt>MODE</dt><dd>{mode.toUpperCase()}</dd></div>
        <div><dt>VERSION</dt><dd>{game.version}</dd></div>
        <div><dt>EPOCH</dt><dd>{game.currentEpoch}</dd></div>
        <div><dt>CADENCE</dt><dd>{formatDuration(game.config.epochSeconds)}</dd></div>
      </dl>
      <div className="epoch-track"><i style={{ width: `${epochProgress(game)}%` }} /></div>
      {mode === "spectator" && game.status === "lobby" ? <button className="button button-primary join-button" type="button" disabled={joining || game.playersCount >= game.config.maxPlayers} onClick={onJoin}>{joining ? "Securing seat…" : "Join this match →"}</button> : null}
      {isOwner && game.status === "lobby" ? (
        <div className="owner-controls">
          <div className="owner-label"><span>OWNER CONTROLS</span><b>{missingSeats} OPEN</b></div>
          {missingSeats > 0 ? (
            <div className="bot-config">
              <select aria-label="Bot strategy" value={strategy} onChange={(event) => setStrategy(event.target.value as BotStrategy)}>
                <option value="attack">Attack</option>
                <option value="medic">Medic</option>
                <option value="hoard">Hoard</option>
                <option value="sentinel">Sentinel</option>
                <option value="idle">Idle</option>
              </select>
              <input aria-label="Number of bots" type="number" min={1} max={maximumBotBatch} value={Math.min(botCount, maximumBotBatch)} onChange={(event) => setBotCount(clampNumber(event.target.value, 1, maximumBotBatch))} />
              <button type="button" disabled={ownerPending !== null} onClick={() => void onAddBots(strategy, Math.min(botCount, maximumBotBatch))}>{ownerPending === "bots" ? "Adding…" : "Add bot"}</button>
            </div>
          ) : null}
          <button className="owner-primary" type="button" disabled={ownerPending !== null || (missingSeats === 0 && !canStart)} onClick={() => missingSeats > 0 ? void onFillAndStart(strategy) : void onStart()}>
            {ownerPending === "fill" ? "Filling seats…" : ownerPending === "start" ? "Starting…" : missingSeats > 0 ? `Fill ${missingSeats} + start` : "Start match →"}
          </button>
          <p>Bots use the same projection and commands as agents.</p>
        </div>
      ) : null}
      {isOwner && game.status === "active" ? (
        <div className="owner-controls bot-tick-control">
          <div className="owner-label"><span>BOT ORCHESTRATOR</span><b>{autoBots ? "AUTO" : "MANUAL"}</b></div>
          <label className="auto-bot-toggle"><input type="checkbox" checked={autoBots} onChange={(event) => onToggleAutoBots(event.target.checked)} /><span><i />Auto-run every 3.4s</span></label>
          <button className="owner-primary" type="button" disabled={ownerPending !== null} onClick={() => void onTick()}>{ownerPending === "tick" ? "Advancing…" : "Advance one bot turn →"}</button>
        </div>
      ) : null}
      {game.status === "lobby" ? <p className="lobby-wait"><i className="pulse-dot" /> Waiting for {Math.max(0, game.config.maxPlayers - game.playersCount)} more player{game.config.maxPlayers - game.playersCount === 1 ? "" : "s"}</p> : null}
    </section>
  );
}

function PlayerRoster({ players, selfPlayer, selectedPlayerId, onSelect }: Readonly<{ players: PlayerView[]; selfPlayer?: PlayerView; selectedPlayerId?: string; onSelect: (player: PlayerView) => void }>) {
  return (
    <section className="panel-card roster-panel">
      <header className="panel-heading"><div><span className="eyebrow">FIELD UNITS</span><h2>Players</h2></div><span className="panel-count">{players.length}</span></header>
      <div className="roster-list">
        {players.map((player) => (
          <button className={`roster-player ${selectedPlayerId === player.id ? "is-selected" : ""} ${player.state === "dead" ? "is-dead" : ""}`} type="button" key={player.id} onClick={() => onSelect(player)}>
            <span className="seat-number">{String(player.seat).padStart(2, "0")}</span>
            <span className="roster-name"><strong>{player.handle}</strong><small>{selfPlayer?.id === player.id ? "YOU · " : ""}{player.state.toUpperCase()}</small></span>
            <span className="roster-vitals"><b>{player.hearts}♥</b><b>{player.actionPoints}<small>AP</small></b><b>{player.range}<small>RNG</small></b></span>
          </button>
        ))}
      </div>
    </section>
  );
}

function PlayerHud({ player, currentEpoch, claimable }: Readonly<{ player: PlayerView; currentEpoch: number; claimable: number }>) {
  return (
    <section className={`player-hud ${player.state === "dead" ? "is-dead" : ""}`} aria-label="Your tank status">
      <div className="hud-identity"><span className="hud-tank-icon">T{player.seat}</span><div><small>{player.state === "dead" ? "JURY CHANNEL" : "YOUR TANK"}</small><strong>{player.handle}</strong></div></div>
      <HudStat label="HEARTS" value={player.hearts} suffix="♥" tone="red" />
      <HudStat label="ACTION POINTS" value={player.actionPoints} suffix="AP" tone="lime" />
      <HudStat label="RANGE" value={player.range} suffix="HEX" tone="blue" />
      <HudStat label={`EPOCH ${currentEpoch}`} value={claimable} suffix="READY" tone="neutral" />
    </section>
  );
}

function SpectatorHud({ onJoin, joining }: Readonly<{ onJoin?: () => void; joining: boolean }>) {
  return <section className="spectator-hud"><span>◉</span><div><small>READ-ONLY PROJECTION</small><strong>Spectator mode</strong></div>{onJoin ? <button type="button" disabled={joining} onClick={onJoin}>{joining ? "Joining…" : "Take a seat"}</button> : null}</section>;
}

function ActionPanel({
  game,
  selfPlayer,
  selection,
  legalActions,
  pending,
  claimable,
  onCommand,
}: Readonly<{
  game: GameView;
  selfPlayer?: PlayerView;
  selection: BoardSelection | null;
  legalActions: LegalAction[];
  pending: string | null;
  claimable: number;
  onCommand: (command: GameCommand, successMessage: string) => Promise<void>;
}>) {
  const [shots, setShots] = useState(1);
  const [giftHearts, setGiftHearts] = useState(1);
  const [giftAp, setGiftAp] = useState(0);
  const [treatyEpochs, setTreatyEpochs] = useState(3);
  const [bountyAmount, setBountyAmount] = useState("1");

  const target = selection?.player;
  const distance = selfPlayer && selection ? hexDistance(selfPlayer.position, selection.coordinate) : undefined;
  const actionFor = (type: string) => legalActions.find((action) => {
    if (action.type !== type || !action.enabled) return false;
    if (action.actorPlayerId && action.actorPlayerId !== selfPlayer?.id) return false;
    if (type === "claim_action_points" && selfPlayer) {
      const targetPlayerId = action.details.targetPlayerId;
      return targetPlayerId === undefined || targetPlayerId === selfPlayer.id;
    }
    return true;
  });
  const serverAdvertises = (type: string) => Boolean(actionFor(type));
  const fallbackActions = legalActions.length === 0;
  const allowed = (type: string) => fallbackActions || serverAdvertises(type);
  const moveAction = actionFor("move");
  const shootAction = actionFor("shoot");
  const giveAction = actionFor("give");
  const voteAction = actionFor("curse_vote");
  const treatyAction = actionFor("propose_non_aggression");
  const bountyAction = actionFor("post_bounty");
  const active = game.status === "active" && selfPlayer;
  const isEnemy = Boolean(target && selfPlayer && target.id !== selfPlayer.id);
  const moveCost = distance ?? 0;
  const canMove = Boolean(active && selection && !target && moveCost > 0 && selfPlayer.actionPoints >= moveCost && allowed("move") && (fallbackActions || actionAllowsHex(moveAction, selection.coordinate)));
  const canShoot = Boolean(active && isEnemy && target && target.state === "alive" && distance !== undefined && distance <= selfPlayer.range && selfPlayer.actionPoints >= shots && allowed("shoot") && (fallbackActions || actionAllowsPlayer(shootAction, target.id, "targets")));
  const canGive = Boolean(active && isEnemy && target && distance !== undefined && distance <= selfPlayer.range && giftHearts + giftAp > 0 && selfPlayer.hearts >= giftHearts && selfPlayer.actionPoints >= giftAp && allowed("give") && (fallbackActions || actionAllowsPlayer(giveAction, target.id, "targets")));
  const canVote = Boolean(active && selfPlayer.state === "dead" && target && target.state === "alive" && allowed("curse_vote") && (fallbackActions || actionAllowsPlayer(voteAction, target.id, "targetPlayerIds")));
  const upgradeCost = selfPlayer ? Math.max(0, 6 * selfPlayer.range - 6) : 0;

  if (!selfPlayer) {
    return <section className="panel-card action-panel"><header className="panel-heading"><div><span className="eyebrow">COMMANDS</span><h2>Spectating</h2></div></header><div className="action-empty"><span>◉</span><p>Join an open lobby to submit commands. The public projection and event stream remain available.</p></div></section>;
  }

  return (
    <section className="panel-card action-panel" aria-labelledby="commands-title">
      <header className="panel-heading"><div><span className="eyebrow">COMMAND DECK</span><h2 id="commands-title">Legal actions</h2></div><span className="panel-count">{legalActions.length || "AUTO"}</span></header>
      {selection ? (
        <div className="selected-target">
          <span className="target-coordinate">{selection.coordinate.q},{selection.coordinate.r},{selection.coordinate.s}</span>
          <div><small>SELECTED HEX</small><strong>{target ? target.handle : selection.resource ? `${selection.resource.kind} ×${selection.resource.quantity}` : "Empty ground"}</strong></div>
          {distance !== undefined ? <b>{distance}<small>DIST</small></b> : null}
        </div>
      ) : <p className="selection-prompt">Select a hex or player to aim a command.</p>}

      <div className="command-stack">
        {selection && !target ? <CommandButton label={`Move here · ${moveCost} AP`} detail={canMove ? "Reposition and collect any resource." : moveCost === 0 ? "Already here." : "Destination unavailable or too expensive."} glyph="↗" tone="blue" disabled={!canMove || pending !== null} busy={pending === "move"} onClick={() => void onCommand({ type: "move", target: selection.coordinate }, "Movement command applied.")} /> : null}

        {isEnemy && selfPlayer.state === "alive" ? (
          <div className="command-group">
            <div className="command-input-row"><label>Shots<input type="number" min={1} max={Math.max(1, Math.min(target?.hearts ?? 1, selfPlayer.actionPoints))} value={shots} onChange={(event) => setShots(clampNumber(event.target.value, 1, 99))} /></label><span>{shots} AP / {shots} damage</span></div>
            <CommandButton label={`Fire on ${target?.handle ?? "target"}`} detail={canShoot ? `In range at ${distance} hexes.` : `Needs AP and range ${distance ?? "—"}/${selfPlayer.range}.`} glyph="×" tone="red" disabled={!canShoot || pending !== null} busy={pending === "shoot"} onClick={() => void onCommand({ type: "shoot", targetPlayerId: target!.id, shots }, "Shots resolved.")} />
            <div className="command-input-row split"><label>Hearts<input type="number" min={0} max={selfPlayer.hearts} value={giftHearts} onChange={(event) => setGiftHearts(clampNumber(event.target.value, 0, 99))} /></label><label>AP<input type="number" min={0} max={selfPlayer.actionPoints} value={giftAp} onChange={(event) => setGiftAp(clampNumber(event.target.value, 0, 999))} /></label></div>
            <CommandButton label={`Supply ${target?.handle ?? "target"}`} detail={target?.state === "dead" && giftHearts > 0 ? "A heart can revive this tank." : "Transfer resources inside your range."} glyph="⇄" tone="purple" disabled={!canGive || pending !== null} busy={pending === "give"} onClick={() => void onCommand({ type: "give", targetPlayerId: target!.id, hearts: giftHearts, actionPoints: giftAp }, "Supply transfer complete.")} />
          </div>
        ) : null}

        {canVote ? <CommandButton label={`Vote to curse ${target?.handle ?? "target"}`} detail="Dead players vote once per epoch." glyph="!" tone="amber" disabled={pending !== null} busy={pending === "curse_vote"} onClick={() => void onCommand({ type: "curse_vote", targetPlayerId: target!.id }, "Jury vote recorded.")} /> : null}

        {selfPlayer.state === "alive" ? (
          <>
            <CommandButton label={`Claim ${claimable || "available"} AP`} detail={claimable > 0 ? `Catch up through epoch ${game.currentEpoch}.` : "No AP currently advertised as claimable."} glyph="+" tone="lime" disabled={pending !== null || !allowed("claim_action_points")} busy={pending === "claim_action_points"} onClick={() => void onCommand({ type: "claim_action_points" }, "Action points claimed.")} />
            <CommandButton label={`Upgrade range · ${upgradeCost} AP`} detail={`Increase range ${selfPlayer.range} → ${selfPlayer.range + 1}.`} glyph="↑" tone="blue" disabled={pending !== null || selfPlayer.actionPoints < upgradeCost || !allowed("upgrade")} busy={pending === "upgrade"} onClick={() => void onCommand({ type: "upgrade" }, "Range upgraded.")} />
          </>
        ) : null}

        {serverAdvertises("poke_heart_spawn") ? <CommandButton label="Reveal next heart" detail="Poke the deterministic board-heart schedule." glyph="♥" tone="lime" disabled={pending !== null} busy={pending === "poke_heart_spawn"} onClick={() => void onCommand({ type: "poke_heart_spawn" }, "Heart reveal requested.")} /> : null}

        {isEnemy && serverAdvertises("propose_non_aggression") && actionAllowsPlayer(treatyAction, target!.id, "targetPlayerIds") ? <div className="command-group optional-command"><div className="command-input-row"><label>Epochs<input type="number" min={1} max={99} value={treatyEpochs} onChange={(event) => setTreatyEpochs(clampNumber(event.target.value, 1, 99))} /></label></div><CommandButton label="Propose non-aggression pact" detail={`Server-enforced through epoch ${game.currentEpoch + treatyEpochs}.`} glyph="◇" tone="blue" disabled={pending !== null} busy={pending === "propose_non_aggression"} onClick={() => void onCommand({ type: "propose_non_aggression", targetPlayerId: target!.id, expiresEpoch: game.currentEpoch + treatyEpochs }, "Treaty proposal sent.")} /></div> : null}

        {isEnemy && serverAdvertises("post_bounty") && actionAllowsPlayer(bountyAction, target!.id, "targetPlayerIds") ? <div className="command-group optional-command"><div className="command-input-row"><label>Bounty<input type="number" min="1" step="1" value={bountyAmount} onChange={(event) => setBountyAmount(event.target.value.replace(/\D/g, ""))} /></label><span>base units</span></div><CommandButton label="Post bounty" detail="An MPP / HTTP 402 payment challenge may follow." glyph="$" tone="amber" disabled={pending !== null || !/^\d+$/.test(bountyAmount) || Number(bountyAmount) <= 0} busy={pending === "post_bounty"} onClick={() => void onCommand({ type: "post_bounty", bountyId: crypto.randomUUID(), targetPlayerId: target!.id, amount: bountyAmount }, "Bounty offer created.")} /></div> : null}
      </div>

      {game.status !== "active" ? <p className="command-lock">Commands unlock when this match becomes active.</p> : null}
    </section>
  );
}

function CommandButton({ label, detail, glyph, tone, disabled, busy, onClick }: Readonly<{ label: string; detail: string; glyph: string; tone: string; disabled: boolean; busy: boolean; onClick: () => void }>) {
  return <button className={`command-button tone-${tone}`} type="button" disabled={disabled} onClick={onClick}><span className="command-glyph">{busy ? "·" : glyph}</span><span><strong>{busy ? "Submitting command…" : label}</strong><small>{detail}</small></span><i>→</i></button>;
}

function MatchLoading({ identity, onSignOut, onExit }: IdentityProps & Readonly<{ onExit: () => void }>) {
  return <><TopBar identity={identity} onSignOut={onSignOut} onExit={onExit} /><div className="match-loading"><div className="radar-loader"><i /><i /><span /></div><span>CONNECTING TO MATCH</span><h1>Loading battlefield state…</h1><p>Synchronizing the latest version, legal actions, and event cursor.</p></div></>;
}

function Stat({ label, value, accent }: Readonly<{ label: string; value: number; accent: string }>) {
  return <div className={`network-stat accent-${accent}`}><span>{label}</span><strong>{String(value).padStart(2, "0")}</strong></div>;
}

function StatusBadge({ status }: Readonly<{ status: GameSummary["status"] }>) {
  return <span className={`status-badge ${status}`}><i />{status === "lobby" ? "LOBBY" : status === "active" ? "LIVE" : status.toUpperCase()}</span>;
}

function HudStat({ label, value, suffix, tone }: Readonly<{ label: string; value: number; suffix: string; tone: string }>) {
  return <div className={`hud-stat tone-${tone}`}><small>{label}</small><strong>{value}<span>{suffix}</span></strong></div>;
}

function NumberField({ label, detail, min, max, value, onChange }: Readonly<{ label: string; detail: string; min: number; max: number; value: number; onChange: (value: string) => void }>) {
  return <label className="number-field"><span><strong>{label}</strong><small>{detail}</small></span><input type="number" min={min} max={max} value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}

function ErrorBanner({ message, onRetry, onDismiss }: Readonly<{ message: string; onRetry?: () => void; onDismiss?: () => void }>) {
  return <div className="error-banner" role="alert"><span>!</span><div><strong>Command link interrupted</strong><p>{message}</p></div>{onRetry ? <button onClick={onRetry}>Retry</button> : null}{onDismiss ? <button aria-label="Dismiss" onClick={onDismiss}>×</button> : null}</div>;
}

function EmptyLobby({ onCreate }: Readonly<{ onCreate: () => void }>) {
  return <div className="empty-lobby"><div className="empty-board-mark"><i /><i /><i /><i /><i /><i /><i /></div><span>NO OPEN SIGNALS</span><h3>The battlefield is quiet.</h3><p>Start a room and share its URL with humans or agents.</p><button className="button button-primary" onClick={onCreate}>Create the first match</button></div>;
}

function GameListSkeleton() {
  return <div className="game-list skeleton-list">{Array.from({ length: 3 }, (_, index) => <div className="game-card skeleton-card" key={index}><i /><div><span /><span /></div><i /><i /></div>)}</div>;
}

function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError && error.status === 402) {
    return "Payment required. This action uses MPP / HTTP 402; an agent can replay it with a payment credential. Browser checkout is not connected yet.";
  }
  if (error instanceof ApiError && error.status === 401) {
    return "Your signed browser session expired. End this session and enter again to continue.";
  }
  return error instanceof Error ? error.message : fallback;
}

function ownerActionError(error: unknown, fallback: string): string {
  if (error instanceof ApiError && error.status === 409) {
    return "The lobby changed first. State is refreshing; review the seats and try again.";
  }
  if (error instanceof ApiError && error.status === 403) {
    return "Only the authenticated match owner can run this control.";
  }
  return errorMessage(error, fallback);
}

function shortId(value: string): string {
  return value.replace(/-/g, "").slice(0, 8).toUpperCase();
}

function initials(value: string): string {
  return value.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("") || "P";
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  return `${Math.round(seconds / 3600)}h`;
}

function epochProgress(game: GameView): number {
  if (!game.nextEpochAt) return 0;
  const remaining = new Date(game.nextEpochAt).getTime() - Date.now();
  const total = game.config.epochSeconds * 1000;
  return Math.max(0, Math.min(100, ((total - remaining) / total) * 100));
}

function clampNumber(value: string, min: number, max: number): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? Math.max(min, Math.min(max, parsed)) : min;
}

function actionAllowsHex(action: LegalAction | undefined, coordinate: HexCoordinate): boolean {
  if (!action) return false;
  const destinations = action.details.destinations;
  if (!Array.isArray(destinations)) return true;
  return destinations.some((value) => {
    if (!value || typeof value !== "object") return false;
    const candidate = value as Record<string, unknown>;
    return candidate.q === coordinate.q && candidate.r === coordinate.r && candidate.s === coordinate.s;
  });
}

function actionAllowsPlayer(
  action: LegalAction | undefined,
  playerId: string,
  detailKey: string,
): boolean {
  if (!action) return false;
  const values = action.details[detailKey];
  if (!Array.isArray(values)) return true;
  return values.some((value) => {
    if (value === playerId) return true;
    if (!value || typeof value !== "object") return false;
    const candidate = value as Record<string, unknown>;
    return candidate.playerId === playerId || candidate.targetPlayerId === playerId;
  });
}

function mergeEvents(current: GameEvent[], incoming: GameEvent[]): GameEvent[] {
  const bySequence = new Map(current.map((event) => [event.sequence, event]));
  incoming.forEach((event) => bySequence.set(event.sequence, event));
  return [...bySequence.values()].sort((a, b) => a.sequence - b.sequence).slice(-200);
}

const OWNED_GAMES_KEY = "tact.owned-games.v1";

function rememberOwnedGame(gameId: string): void {
  try {
    const existing = JSON.parse(window.localStorage.getItem(OWNED_GAMES_KEY) ?? "[]") as unknown;
    const ids = Array.isArray(existing)
      ? existing.filter((value): value is string => typeof value === "string")
      : [];
    window.localStorage.setItem(
      OWNED_GAMES_KEY,
      JSON.stringify([gameId, ...ids.filter((id) => id !== gameId)].slice(0, 50)),
    );
  } catch {
    // This is only a control-visibility hint; the server still enforces ownership.
  }
}

function wasOwnedGame(gameId: string): boolean {
  try {
    const existing = JSON.parse(window.localStorage.getItem(OWNED_GAMES_KEY) ?? "[]") as unknown;
    return Array.isArray(existing) && existing.includes(gameId);
  } catch {
    return false;
  }
}
