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

type TactGameAppProps = Readonly<{
  gameId?: string;
  initialIdentity?: LocalIdentity | null;
  initialSessionError?: string | null;
  initialGames?: readonly GameSummary[];
  initialGame?: GameView | null;
  initialEvents?: readonly GameEvent[];
  initialDataError?: string | null;
}>;

export function TactGameApp({
  gameId,
  initialIdentity,
  initialSessionError,
  initialGames,
  initialGame,
  initialEvents,
  initialDataError,
}: TactGameAppProps) {
  const router = useRouter();
  const session = useLocalIdentity(initialIdentity, initialSessionError);

  if (session.status === "loading" && !session.identity) {
    return <SessionLoading />;
  }

  if (!session.identity) {
    return (
      <SessionGate
        error={session.error}
        suggestedDisplayName={session.suggestedDisplayName}
        onRetry={session.retry}
        onSignIn={async (displayName) => {
          await session.signIn(displayName);
          router.refresh();
        }}
      />
    );
  }

  return (
    <main className={gameId ? "app-frame match-frame" : "app-frame lobby-frame"}>
      {gameId ? (
        <MatchView
          gameId={gameId}
          identity={session.identity}
          initialGame={initialGame}
          initialEvents={initialEvents}
          initialError={initialDataError}
          onSignOut={async () => {
            await session.signOut();
            router.refresh();
          }}
          onExit={() => router.push("/")}
        />
      ) : (
        <Lobby
          identity={session.identity}
          initialGames={initialGames}
          initialError={initialDataError}
          onSignOut={async () => {
            await session.signOut();
            router.refresh();
          }}
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
      <section className="session-card session-loading" aria-live="polite">
        <div className="session-brand"><strong>Tact</strong></div>
        <p>Loading Tact…</p>
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

  useEffect(() => {
    if (!suggestedDisplayName) return;

    const timeout = window.setTimeout(() => {
      setDisplayName((current) => current || suggestedDisplayName);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [suggestedDisplayName]);

  const submit = async () => {
    setSubmitting(true);
    setFormError(null);
    try {
      await onSignIn(displayName);
    } catch (caught) {
      setFormError(errorMessage(caught, "Could not enter Tact."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="session-shell">
      <section className="session-card" aria-labelledby="session-title">
        <div className="session-card-copy">
          <div className="session-brand"><strong>Tact</strong></div>
          <h1 id="session-title">Choose a name</h1>
          <p className="session-intro">This is how other players will see you.</p>
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
                {submitting ? "Starting…" : "Continue"}
              </button>
            </div>
          </form>
          {formError || error ? (
            <div className="session-error" role="alert">
              <span>!</span><p>{formError ?? error}</p>
              {error && !formError ? <button type="button" onClick={() => void onRetry()}>Try again</button> : null}
            </div>
          ) : null}
          <p className="session-fine-print">No account or wallet required.</p>
        </div>
      </section>
    </main>
  );
}

function Lobby({
  identity,
  initialGames,
  initialError,
  onSignOut,
  onOpenGame,
}: IdentityProps & Readonly<{
  initialGames?: readonly GameSummary[];
  initialError?: string | null;
  onOpenGame: (id: string) => void;
}>) {
  const hasInitialGames = initialGames !== undefined;
  const [games, setGames] = useState<GameSummary[]>(() => [...(initialGames ?? [])]);
  const [loading, setLoading] = useState(!hasInitialGames);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  const refresh = useCallback(async (background = false) => {
    if (!background) setLoading(true);
    try {
      setGames(await listGames());
      setError(null);
    } catch (caught) {
      setError(errorMessage(caught, "Could not load the matches."));
    } finally {
      if (!background) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initial = window.setTimeout(() => void refresh(hasInitialGames), 0);
    const interval = window.setInterval(() => void refresh(true), 8000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
    };
  }, [hasInitialGames, refresh]);

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
            <h1>Matches</h1>
            <p>Create a match, join an open one, or watch a game in progress.</p>
          </div>
          <button
            className="button button-primary create-button"
            type="button"
            disabled={!identity}
            onClick={() => setShowCreate(true)}
          >
            Create match
          </button>
        </header>

        <section className="network-stats" aria-label="Match overview">
          <Stat label="Open" value={lobbyGames.length} />
          <Stat label="Live" value={activeGames.length} />
          <Stat label="Finished" value={finishedGames.length} />
        </section>

        {error ? <ErrorBanner message={error} onRetry={() => void refresh()} /> : null}

        <section className="match-browser" aria-labelledby="match-browser-title">
          <header className="section-title-row">
            <div>
              <h2 id="match-browser-title">All matches</h2>
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

  const issueAgent = async () => {
    const clean = agentName.trim();
    if (!clean) return;
    setIssuingAgent(true);
    setProfileError(null);
    try {
      setAgentToken(await createAgentToken(clean));
    } catch (caught) {
      setProfileError(errorMessage(caught, "Could not create an agent key."));
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
      window.prompt("Copy this one-time agent key", agentToken);
    }
  };

  const changePlayer = async () => {
    setProfileError(null);
    try {
      await onSignOut();
    } catch {
      setProfileError("Could not change players. Try again.");
    }
  };

  return (
    <nav className="top-bar" aria-label="Tact navigation">
      <button className="brand" type="button" onClick={onExit} disabled={!onExit}>
        <strong>Tact</strong>
      </button>
      {game ? (
        <div className="match-breadcrumb">
          <span>/</span>
          <strong>Match {shortId(game.id)}</strong>
          <StatusBadge status={game.status} />
        </div>
      ) : null}
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
            <span><small>Player</small><strong>{identity.handle}</strong></span>
            <i>{profileOpen ? "⌃" : "⌄"}</i>
          </button>
          {profileOpen ? (
            <div className="profile-menu">
              <div><small>Player</small><code>{identity.handle}</code></div>
              <button type="button" onClick={() => setAgentFormOpen((current) => !current)}>Connect an agent</button>
              {agentFormOpen ? (
                <form className="agent-token-form" onSubmit={(event) => { event.preventDefault(); void issueAgent(); }}>
                  <label htmlFor="agent-display-name">Agent name</label>
                  <div><input id="agent-display-name" maxLength={64} value={agentName} onChange={(event) => setAgentName(event.target.value)} /><button type="submit" disabled={issuingAgent}>{issuingAgent ? "…" : "Create"}</button></div>
                </form>
              ) : null}
              {agentToken ? (
                <div className="agent-token-result">
                  <small>AGENT KEY — SHOWN ONCE</small>
                  <code>{agentToken}</code>
                  <button type="button" onClick={() => void copyAgentToken()}>{copied ? "Copied key ✓" : "Copy agent key"}</button>
                </div>
              ) : null}
              {profileError ? <p className="profile-error" role="alert">{profileError}</p> : null}
              <button className="profile-logout" type="button" onClick={() => void changePlayer()}>Change player</button>
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
        <h3>{game.status === "lobby" ? "Open match" : game.status === "active" ? "Battle in progress" : "Finished battle"}</h3>
        <p>Board size {game.config.boardSize} · action points every {formatDuration(game.config.epochSeconds)}</p>
        <div className="occupancy-track"><i style={{ width: `${occupancy}%` }} /></div>
      </div>
      <div className="game-metric"><span>Players</span><strong>{game.playersCount}<small>/{game.config.maxPlayers}</small></strong></div>
      <div className="game-metric"><span>Starting</span><strong>{game.config.initHearts}♥ <small>{game.config.initActionPoints} AP</small></strong></div>
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
          <div><h2 id="create-title">Create match</h2></div>
          <button className="dialog-close" type="button" onClick={onClose} aria-label="Close">×</button>
        </header>
        <p className="dialog-intro">You will own the room as <strong>{identity.handle}</strong>. Settings lock when the match begins.</p>
        <div className="form-grid">
          <NumberField label="Players" detail="Seats in the room" min={2} max={12} value={config.maxPlayers} onChange={(value) => updateNumber("maxPlayers", value)} />
          <NumberField label="Board size" detail="How far the board extends" min={2} max={14} value={config.boardSize} onChange={(value) => updateNumber("boardSize", value)} />
          <NumberField label="Action point timing" detail="Seconds between gains" min={30} max={86400} value={config.epochSeconds} onChange={(value) => updateNumber("epochSeconds", value)} />
          <NumberField label="Starting hearts" detail="Tank durability" min={1} max={12} value={config.initHearts} onChange={(value) => updateNumber("initHearts", value)} />
          <NumberField label="Starting AP" detail="Opening mobility" min={1} max={30} value={config.initActionPoints} onChange={(value) => updateNumber("initActionPoints", value)} />
          <NumberField label="Starting range" detail="Attack and gift radius" min={1} max={10} value={config.initRange} onChange={(value) => updateNumber("initRange", value)} />
        </div>
        <div className="ruleset-callout"><strong>Classic Tact</strong><p>Continuous time · last tank standing · dead jury enabled</p></div>
        <footer>
          <button className="button button-ghost" type="button" onClick={onClose}>Cancel</button>
          <button className="button button-primary" type="button" disabled={creating} onClick={() => void onCreate(config)}>{creating ? "Creating…" : "Create match"}</button>
        </footer>
      </section>
    </div>
  );
}

function MatchView({
  gameId,
  identity,
  initialGame,
  initialEvents,
  initialError,
  onSignOut,
  onExit,
}: IdentityProps & Readonly<{
  gameId: string;
  initialGame?: GameView | null;
  initialEvents?: readonly GameEvent[];
  initialError?: string | null;
  onExit: () => void;
}>) {
  const hasInitialGame = initialGame !== undefined;
  const hasInitialEvents = initialEvents !== undefined;
  const [game, setGame] = useState<GameView | null>(initialGame ?? null);
  const [events, setEvents] = useState<GameEvent[]>(() => [...(initialEvents ?? [])]);
  const cursorRef = useRef(initialEvents?.at(-1)?.sequence ?? 0);
  const gameVersionRef = useRef(initialGame?.version ?? -1);
  const [legalActions, setLegalActions] = useState<LegalAction[]>(
    () => [...(initialGame?.legalActions ?? [])],
  );
  const [renderNow, setRenderNow] = useState<number | null>(() =>
    parseObservedAt(initialGame?.observedAt),
  );
  const [selected, setSelected] = useState<BoardSelection | null>(null);
  const [loading, setLoading] = useState(!hasInitialGame);
  const [joining, setJoining] = useState(false);
  const [commandPending, setCommandPending] = useState<string | null>(null);
  const [ownerPending, setOwnerPending] = useState<"bots" | "start" | "tick" | "fill" | null>(null);
  const [ownerHint, setOwnerHint] = useState(false);
  const [autoBots, setAutoBots] = useState(true);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [notice, setNotice] = useState<string | null>(null);
  const refreshInFlightRef = useRef(false);
  const mutationInFlightRef = useRef(false);
  const autoTickInFlightRef = useRef(false);

  const applyGame = useCallback((nextGame: GameView): boolean => {
    if (nextGame.version < gameVersionRef.current) return false;
    gameVersionRef.current = nextGame.version;
    setGame(nextGame);
    return true;
  }, []);

  const refreshGame = useCallback(async (background = false) => {
    refreshInFlightRef.current = true;
    if (!background) setLoading(true);
    try {
      const [nextGame, nextActions] = await Promise.all([
        getGame(gameId),
        getLegalActions(gameId).catch(() => []),
      ]);
      if (!applyGame(nextGame)) return;
      const resolvedActions = nextActions.length ? nextActions : nextGame.legalActions;
      setLegalActions(resolvedActions);
      setRenderNow(parseObservedAt(nextGame.observedAt) ?? Date.now());
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
      if (!background) setLoading(false);
    }
  }, [applyGame, gameId]);

  const refreshEvents = useCallback(async () => {
    try {
      const result = await getEvents(gameId, cursorRef.current);
      if (result.events.length) {
        setEvents((current) => mergeEvents(current, result.events));
      }
      cursorRef.current = result.cursor;
      setRenderNow(Date.now());
    } catch {
      // Match polling remains the primary state channel; event feed recovers on its next pass.
    }
  }, [gameId]);

  useEffect(() => {
    const initial = window.setTimeout(() => {
      if (!hasInitialGame) void refreshGame();
      if (!hasInitialEvents) void refreshEvents();
    }, 0);
    const gameInterval = window.setInterval(() => void refreshGame(true), 3000);
    const eventInterval = window.setInterval(() => void refreshEvents(), 2200);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(gameInterval);
      window.clearInterval(eventInterval);
    };
  }, [hasInitialEvents, hasInitialGame, identity, refreshEvents, refreshGame]);

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
          applyGame(updated);
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
  }, [applyGame, autoBots, autoGameId, autoGameStatus, autoGameVersion, canManageBots, refreshEvents, refreshGame]);

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
      if (updated) applyGame(updated);
      setSelected(null);
      setNotice(successMessage);
      await refreshGame(true);
      await refreshEvents();
    } catch (caught) {
      if (caught instanceof ApiError && caught.status === 409) {
        await refreshGame(true);
        setError("The battlefield changed. Review the board and try again.");
      } else {
        setError(errorMessage(caught, "Could not complete that move."));
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
      applyGame(updated);
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
      if (updated) applyGame(updated);
      setNotice("The battle is live.");
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
      applyGame(current);
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
      applyGame(updated);
      setNotice("A bot made its move.");
      await refreshGame(true);
      await refreshEvents();
    } catch (caught) {
      setError(ownerActionError(caught, "No bot can move right now."));
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
        <div className="fatal-state"><h1>Match unavailable</h1><p>{error ?? "This match does not exist or is unavailable."}</p><button className="button button-primary" onClick={onExit}>Return to matches</button></div>
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
            now={renderNow}
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
          <EventLog events={events} players={game.players} now={renderNow} />
        </aside>
      </div>
    </>
  );
}

function MatchOverview({
  game,
  now,
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
  now: number | null;
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
      <header className="panel-heading"><div><h2>Match #{shortId(game.id)}</h2></div><StatusBadge status={game.status} /></header>
      <dl className="match-facts">
        <div><dt>Role</dt><dd>{mode}</dd></div>
        <div><dt>Players</dt><dd>{game.playersCount}/{game.config.maxPlayers}</dd></div>
        <div><dt>Round</dt><dd>{game.currentEpoch}</dd></div>
        <div><dt>AP timing</dt><dd>{formatDuration(game.config.epochSeconds)}</dd></div>
      </dl>
      <div className="epoch-track"><i style={{ width: `${epochProgress(game, now)}%` }} /></div>
      {mode === "spectator" && game.status === "lobby" ? <button className="button button-primary join-button" type="button" disabled={joining || game.playersCount >= game.config.maxPlayers} onClick={onJoin}>{joining ? "Securing seat…" : "Join this match →"}</button> : null}
      {isOwner && game.status === "lobby" ? (
        <div className="owner-controls">
          <div className="owner-label"><span>Owner controls</span><b>{missingSeats} open</b></div>
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
          <p>Bots follow the same rules as every player.</p>
        </div>
      ) : null}
      {isOwner && game.status === "active" ? (
        <div className="owner-controls bot-tick-control">
          <div className="owner-label"><span>Bot moves</span><b>{autoBots ? "Automatic" : "Manual"}</b></div>
          <label className="auto-bot-toggle"><input type="checkbox" checked={autoBots} onChange={(event) => onToggleAutoBots(event.target.checked)} /><span><i />Let bots play automatically</span></label>
          <button className="owner-primary" type="button" disabled={ownerPending !== null} onClick={() => void onTick()}>{ownerPending === "tick" ? "Moving…" : "Make a bot move →"}</button>
        </div>
      ) : null}
      {game.status === "lobby" ? <p className="lobby-wait"><i className="pulse-dot" /> Waiting for {Math.max(0, game.config.maxPlayers - game.playersCount)} more player{game.config.maxPlayers - game.playersCount === 1 ? "" : "s"}</p> : null}
    </section>
  );
}

function PlayerRoster({ players, selfPlayer, selectedPlayerId, onSelect }: Readonly<{ players: PlayerView[]; selfPlayer?: PlayerView; selectedPlayerId?: string; onSelect: (player: PlayerView) => void }>) {
  return (
    <section className="panel-card roster-panel">
      <header className="panel-heading"><div><h2>Players</h2></div><span className="panel-count">{players.length}</span></header>
      <div className="roster-list">
        {players.map((player) => (
          <button className={`roster-player ${selectedPlayerId === player.id ? "is-selected" : ""} ${player.state === "dead" ? "is-dead" : ""}`} type="button" key={player.id} onClick={() => onSelect(player)}>
            <span className="seat-number">{String(player.seat).padStart(2, "0")}</span>
            <span className="roster-name"><strong>{player.handle}</strong><small>{selfPlayer?.id === player.id ? "You · " : ""}{player.state}</small></span>
            <span className="roster-vitals"><b>{player.hearts}♥</b><b>{player.actionPoints}<small>AP</small></b><b>{player.range}<small>range</small></b></span>
          </button>
        ))}
      </div>
    </section>
  );
}

function PlayerHud({ player, currentEpoch, claimable }: Readonly<{ player: PlayerView; currentEpoch: number; claimable: number }>) {
  return (
    <section className={`player-hud ${player.state === "dead" ? "is-dead" : ""}`} aria-label="Your tank status">
      <div className="hud-identity"><span className="hud-tank-icon">T{player.seat}</span><div><small>{player.state === "dead" ? "Jury" : "Your tank"}</small><strong>{player.handle}</strong></div></div>
      <HudStat label="Hearts" value={player.hearts} suffix="♥" />
      <HudStat label="Action points" value={player.actionPoints} suffix="AP" />
      <HudStat label="Range" value={player.range} suffix="hex" />
      <HudStat label={`Round ${currentEpoch}`} value={claimable} suffix="ready" />
    </section>
  );
}

function SpectatorHud({ onJoin, joining }: Readonly<{ onJoin?: () => void; joining: boolean }>) {
  return <section className="spectator-hud"><span>◉</span><div><small>Watching</small><strong>Spectator mode</strong></div>{onJoin ? <button type="button" disabled={joining} onClick={onJoin}>{joining ? "Joining…" : "Take a seat"}</button> : null}</section>;
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
  const hasAction = (type: string) => Boolean(actionFor(type));
  const fallbackActions = legalActions.length === 0;
  const allowed = (type: string) => fallbackActions || hasAction(type);
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
    return <section className="panel-card action-panel"><header className="panel-heading"><div><h2>Actions</h2></div></header><div className="action-empty"><p>Join an open match to play. You can still watch the game.</p></div></section>;
  }

  return (
    <section className="panel-card action-panel" aria-labelledby="commands-title">
      <header className="panel-heading"><div><h2 id="commands-title">Actions</h2></div></header>
      {selection ? (
        <div className="selected-target">
          <div><small>Selected</small><strong>{target ? target.handle : selection.resource ? `${selection.resource.kind} ×${selection.resource.quantity}` : "Empty ground"}</strong></div>
          {distance !== undefined ? <b>{distance}<small>away</small></b> : null}
        </div>
      ) : <p className="selection-prompt">Select a hex or player for your next move.</p>}

      <div className="command-stack">
        {selection && !target ? <CommandButton label={`Move here · ${moveCost} AP`} detail={canMove ? "Reposition and collect any resource." : moveCost === 0 ? "Already here." : "Destination unavailable or too expensive."} glyph="↗" disabled={!canMove || pending !== null} busy={pending === "move"} onClick={() => void onCommand({ type: "move", target: selection.coordinate }, "Tank moved.")} /> : null}

        {isEnemy && selfPlayer.state === "alive" ? (
          <div className="command-group">
            <div className="command-input-row"><label>Shots<input type="number" min={1} max={Math.max(1, Math.min(target?.hearts ?? 1, selfPlayer.actionPoints))} value={shots} onChange={(event) => setShots(clampNumber(event.target.value, 1, 99))} /></label><span>{shots} AP / {shots} damage</span></div>
            <CommandButton label={`Fire on ${target?.handle ?? "target"}`} detail={canShoot ? `In range at ${distance} hexes.` : `Needs AP and range ${distance ?? "—"}/${selfPlayer.range}.`} glyph="×" disabled={!canShoot || pending !== null} busy={pending === "shoot"} onClick={() => void onCommand({ type: "shoot", targetPlayerId: target!.id, shots }, "Shots fired.")} />
            <div className="command-input-row split"><label>Hearts<input type="number" min={0} max={selfPlayer.hearts} value={giftHearts} onChange={(event) => setGiftHearts(clampNumber(event.target.value, 0, 99))} /></label><label>AP<input type="number" min={0} max={selfPlayer.actionPoints} value={giftAp} onChange={(event) => setGiftAp(clampNumber(event.target.value, 0, 999))} /></label></div>
            <CommandButton label={`Supply ${target?.handle ?? "target"}`} detail={target?.state === "dead" && giftHearts > 0 ? "A heart can revive this tank." : "Transfer resources inside your range."} glyph="⇄" disabled={!canGive || pending !== null} busy={pending === "give"} onClick={() => void onCommand({ type: "give", targetPlayerId: target!.id, hearts: giftHearts, actionPoints: giftAp }, "Supplies delivered.")} />
          </div>
        ) : null}

        {canVote ? <CommandButton label={`Vote to curse ${target?.handle ?? "target"}`} detail="Dead players vote once per epoch." glyph="!" disabled={pending !== null} busy={pending === "curse_vote"} onClick={() => void onCommand({ type: "curse_vote", targetPlayerId: target!.id }, "Your vote is in.")} /> : null}

        {selfPlayer.state === "alive" ? (
          <>
            <CommandButton label={`Claim ${claimable || "available"} AP`} detail={claimable > 0 ? `Catch up through epoch ${game.currentEpoch}.` : "No AP available right now."} glyph="+" disabled={pending !== null || !allowed("claim_action_points")} busy={pending === "claim_action_points"} onClick={() => void onCommand({ type: "claim_action_points" }, "Action points claimed.")} />
            <CommandButton label={`Upgrade range · ${upgradeCost} AP`} detail={`Increase range ${selfPlayer.range} → ${selfPlayer.range + 1}.`} glyph="↑" disabled={pending !== null || selfPlayer.actionPoints < upgradeCost || !allowed("upgrade")} busy={pending === "upgrade"} onClick={() => void onCommand({ type: "upgrade" }, "Range upgraded.")} />
          </>
        ) : null}

        {hasAction("poke_heart_spawn") ? <CommandButton label="Reveal next heart" detail="Bring the next heart onto the board when it is ready." glyph="♥" disabled={pending !== null} busy={pending === "poke_heart_spawn"} onClick={() => void onCommand({ type: "poke_heart_spawn" }, "Heart revealed.")} /> : null}

        {isEnemy && hasAction("propose_non_aggression") && actionAllowsPlayer(treatyAction, target!.id, "targetPlayerIds") ? <div className="command-group optional-command"><div className="command-input-row"><label>Epochs<input type="number" min={1} max={99} value={treatyEpochs} onChange={(event) => setTreatyEpochs(clampNumber(event.target.value, 1, 99))} /></label></div><CommandButton label="Propose non-aggression pact" detail={`Lasts through epoch ${game.currentEpoch + treatyEpochs}.`} glyph="◇" disabled={pending !== null} busy={pending === "propose_non_aggression"} onClick={() => void onCommand({ type: "propose_non_aggression", targetPlayerId: target!.id, expiresEpoch: game.currentEpoch + treatyEpochs }, "Treaty proposal sent.")} /></div> : null}

        {isEnemy && hasAction("post_bounty") && actionAllowsPlayer(bountyAction, target!.id, "targetPlayerIds") ? <div className="command-group optional-command"><div className="command-input-row"><label>Bounty<input type="number" min="1" step="1" value={bountyAmount} onChange={(event) => setBountyAmount(event.target.value.replace(/\D/g, ""))} /></label><span>reward</span></div><CommandButton label="Post bounty" detail="Payment confirmation may be required." glyph="$" disabled={pending !== null || !/^\d+$/.test(bountyAmount) || Number(bountyAmount) <= 0} busy={pending === "post_bounty"} onClick={() => void onCommand({ type: "post_bounty", bountyId: crypto.randomUUID(), targetPlayerId: target!.id, amount: bountyAmount }, "Bounty offer created.")} /></div> : null}
      </div>

      {game.status !== "active" ? <p className="command-lock">Commands unlock when this match becomes active.</p> : null}
    </section>
  );
}

function CommandButton({ label, detail, glyph, disabled, busy, onClick }: Readonly<{ label: string; detail: string; glyph: string; disabled: boolean; busy: boolean; onClick: () => void }>) {
  return <button className="command-button" type="button" disabled={disabled} onClick={onClick}><span className="command-glyph">{busy ? "·" : glyph}</span><span><strong>{busy ? "Making your move…" : label}</strong><small>{detail}</small></span><i>→</i></button>;
}

function MatchLoading({ identity, onSignOut, onExit }: IdentityProps & Readonly<{ onExit: () => void }>) {
  return <><TopBar identity={identity} onSignOut={onSignOut} onExit={onExit} /><div className="match-loading"><h1>Loading match…</h1></div></>;
}

function Stat({ label, value }: Readonly<{ label: string; value: number }>) {
  return <div className="network-stat"><span>{label}</span><strong>{value}</strong></div>;
}

function StatusBadge({ status }: Readonly<{ status: GameSummary["status"] }>) {
  return <span className={`status-badge ${status}`}><i />{status === "lobby" ? "Lobby" : status === "active" ? "Live" : "Ended"}</span>;
}

function HudStat({ label, value, suffix }: Readonly<{ label: string; value: number; suffix: string }>) {
  return <div className="hud-stat"><small>{label}</small><strong>{value}<span>{suffix}</span></strong></div>;
}

function NumberField({ label, detail, min, max, value, onChange }: Readonly<{ label: string; detail: string; min: number; max: number; value: number; onChange: (value: string) => void }>) {
  return <label className="number-field"><span><strong>{label}</strong><small>{detail}</small></span><input type="number" min={min} max={max} value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}

function ErrorBanner({ message, onRetry, onDismiss }: Readonly<{ message: string; onRetry?: () => void; onDismiss?: () => void }>) {
  return <div className="error-banner" role="alert"><span>!</span><div><strong>Something went wrong</strong><p>{message}</p></div>{onRetry ? <button onClick={onRetry}>Retry</button> : null}{onDismiss ? <button aria-label="Dismiss" onClick={onDismiss}>×</button> : null}</div>;
}

function EmptyLobby({ onCreate }: Readonly<{ onCreate: () => void }>) {
  return <div className="empty-lobby"><h3>No matches yet</h3><p>Create one and share the link with humans or agents.</p><button className="button button-primary" onClick={onCreate}>Create a match</button></div>;
}

function GameListSkeleton() {
  return <div className="game-list skeleton-list">{Array.from({ length: 3 }, (_, index) => <div className="game-card skeleton-card" key={index}><i /><div><span /><span /></div><i /><i /></div>)}</div>;
}

function errorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof ApiError)) return fallback;
  if (error.code === "game_full") return "This match is full.";
  if (error.code === "game_not_found") return "This match is no longer available.";
  if (error.status === 401) return "You were signed out. Enter your callsign again to continue.";
  if (error.status === 402) return "This paid action could not be completed.";
  if (error.status === 403) return "You cannot do that in this match.";
  if (error.status === 404) return "This match is no longer available.";
  if (error.status === 409) return "Another move happened first. Review the battlefield and try again.";
  if (error.status === 422) return "That move is not available right now.";
  if (error.status === 429) return "Too much is happening at once. Wait a moment and try again.";
  if (error.status >= 500) return "Tact is having trouble right now. Try again shortly.";
  return fallback;
}

function ownerActionError(error: unknown, fallback: string): string {
  if (error instanceof ApiError && error.status === 409) {
    return "The lobby changed. Review the seats and try again.";
  }
  if (error instanceof ApiError && error.status === 403) {
    return "Only the match owner can use this control.";
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

function parseObservedAt(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function epochProgress(game: GameView, now: number | null): number {
  if (!game.nextEpochAt || now === null) return 0;
  const remaining = new Date(game.nextEpochAt).getTime() - now;
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
