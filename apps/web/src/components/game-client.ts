export type GameStatus = "lobby" | "active" | "ended" | "cancelled";

export type HexCoordinate = Readonly<{
  q: number;
  r: number;
  s: number;
}>;

export type LocalIdentity = Readonly<{
  id: string;
  handle: string;
  kind: "human" | "agent";
  expiresAt?: string;
}>;

export type GameConfig = Readonly<{
  maxPlayers: number;
  boardSize: number;
  epochSeconds: number;
  initHearts: number;
  initActionPoints: number;
  initRange: number;
}>;

export type PlayerView = Readonly<{
  id: string;
  seat: number;
  handle: string;
  state: "alive" | "dead";
  hearts: number;
  actionPoints: number;
  range: number;
  position: HexCoordinate;
  lastDripEpoch?: number;
  finishedPlace?: number;
  ownedByViewer: boolean;
  controllableByViewer: boolean;
}>;

export type BoardResource = Readonly<{
  id: string;
  kind: string;
  quantity: number;
  position: HexCoordinate;
}>;

export type LegalAction = Readonly<{
  type: string;
  actorPlayerId?: string;
  enabled: boolean;
  targetPlayerId?: string;
  target?: HexCoordinate;
  maxShots?: number;
  cost?: number;
  reason?: string;
  details: Record<string, unknown>;
}>;

export type GameSummary = Readonly<{
  id: string;
  status: GameStatus;
  version: number;
  rulesetVersion: string;
  ownerPrincipalId?: string;
  config: GameConfig;
  playersCount: number;
  createdAt?: string;
  winnerPlayerId?: string;
}>;

export type GameView = GameSummary &
  Readonly<{
    players: PlayerView[];
    resources: BoardResource[];
    legalActions: LegalAction[];
    currentEpoch: number;
    nextEpochAt?: string;
  }>;

export type GameEvent = Readonly<{
  id: string;
  sequence: number;
  gameVersion?: number;
  type: string;
  payload: Record<string, unknown>;
  principalId?: string;
  occurredAt: string;
}>;

export type GameCommand =
  | { type: "start" }
  | { type: "move"; target: HexCoordinate }
  | { type: "shoot"; targetPlayerId: string; shots: number }
  | { type: "give"; targetPlayerId: string; hearts: number; actionPoints: number }
  | { type: "upgrade" }
  | { type: "claim_action_points" }
  | { type: "curse_vote"; targetPlayerId: string }
  | { type: "poke_heart_spawn" }
  | { type: "propose_non_aggression"; targetPlayerId: string; expiresEpoch: number }
  | { type: "post_bounty"; bountyId: string; targetPlayerId: string; amount: string };

export type BotStrategy = "attack" | "medic" | "hoard" | "sentinel" | "idle";

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

const API_ROOT = "/api/v1";

export async function getSession(signal?: AbortSignal): Promise<LocalIdentity | null> {
  try {
    const value = await request<unknown>(`${API_ROOT}/session`, { signal });
    return normalizeIdentity(value);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}

export async function createSession(displayName: string): Promise<LocalIdentity> {
  const value = await request<unknown>(`${API_ROOT}/session`, {
    method: "POST",
    body: { displayName },
  });
  return normalizeIdentity(value);
}

export async function deleteSession(): Promise<void> {
  await request<unknown>(`${API_ROOT}/session`, { method: "DELETE" });
}

export async function createAgentToken(displayName: string): Promise<string> {
  const value = await request<unknown>(`${API_ROOT}/session/agent-tokens`, {
    method: "POST",
    body: { displayName },
  });
  const token = optionalString(asRecord(value).token);
  if (!token) {
    throw new ApiError("The identity service did not return an agent token.", 502);
  }
  return token;
}

export async function listGames(signal?: AbortSignal): Promise<GameSummary[]> {
  const value = await request<unknown>(`${API_ROOT}/games`, { signal });
  const records = Array.isArray(value) ? value : asArray(asRecord(value).games);
  return records.map(normalizeGameSummary);
}

export async function createGame(
  identity: LocalIdentity,
  config: GameConfig,
): Promise<GameView> {
  const requestId = crypto.randomUUID();
  const value = await request<unknown>(`${API_ROOT}/games`, {
    method: "POST",
    body: {
      idempotencyKey: `web-create-${requestId}`,
      handle: identity.handle,
      config: {
        name: `${identity.handle}'s battlefield`,
        playerCount: config.maxPlayers,
        boardRadius: config.boardSize,
        initialActionPoints: config.initActionPoints,
        initialHearts: config.initHearts,
        initialRange: config.initRange,
        epochSeconds: config.epochSeconds,
        entryPriceUsd: "0",
        revealWaitBlocks: 12,
        autoStart: false,
      },
    },
  });
  return normalizeGameView(asRecord(value).game ?? value);
}

export async function getGame(
  gameId: string,
  signal?: AbortSignal,
): Promise<GameView> {
  const value = await request<unknown>(`${API_ROOT}/games/${gameId}`, {
    signal,
  });
  return normalizeGameView(asRecord(value).game ?? value);
}

export async function joinGame(
  gameId: string,
  identity: LocalIdentity,
  expectedVersion: number,
): Promise<GameView> {
  const commandId = crypto.randomUUID();
  const value = await request<unknown>(`${API_ROOT}/games/${gameId}/join`, {
    method: "POST",
    body: {
      commandId,
      idempotencyKey: `web-join-${commandId}`,
      expectedVersion,
      handle: identity.handle,
    },
  });
  return normalizeGameView(asRecord(value).game ?? value);
}

export async function getLegalActions(
  gameId: string,
  signal?: AbortSignal,
): Promise<LegalAction[]> {
  try {
    const value = await request<unknown>(`${API_ROOT}/games/${gameId}/legal-actions`, {
      signal,
    });
    const record = asRecord(value);
    const projection = asRecord(record.game ?? record.projection);
    const actions = Array.isArray(value)
      ? value
      : asArray(record.actions ?? record.legalActions ?? projection.legalActions);
    return actions.map(normalizeLegalAction);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 501)) {
      return [];
    }
    throw error;
  }
}

export async function submitCommand(
  gameId: string,
  expectedVersion: number,
  command: GameCommand,
): Promise<GameView | null> {
  const commandId = crypto.randomUUID();
  const value = await request<unknown>(`${API_ROOT}/games/${gameId}/commands`, {
    method: "POST",
    body: {
      commandId,
      idempotencyKey: `web-command-${commandId}`,
      expectedVersion,
      command,
    },
  });
  const record = asRecord(value);
  const game = record.game ?? record.state ?? record.projection;
  return game ? normalizeGameView(game) : null;
}

export async function addBots(
  gameId: string,
  expectedVersion: number,
  strategy: BotStrategy,
  count: number,
): Promise<GameView> {
  const commandId = crypto.randomUUID();
  const value = await request<unknown>(`${API_ROOT}/games/${gameId}/bots`, {
    method: "POST",
    body: {
      commandId,
      idempotencyKey: `web-bots-${commandId}`,
      expectedVersion,
      strategy,
      count,
    },
  });
  return normalizeGameView(asRecord(value).game ?? value);
}

export async function runBotTick(
  gameId: string,
  expectedVersion: number,
): Promise<GameView> {
  const commandId = crypto.randomUUID();
  const value = await request<unknown>(`${API_ROOT}/games/${gameId}/tick`, {
    method: "POST",
    body: {
      commandId,
      idempotencyKey: `web-tick-${commandId}`,
      expectedVersion,
    },
  });
  return normalizeGameView(asRecord(value).game ?? value);
}

export async function getEvents(
  gameId: string,
  after: number,
  signal?: AbortSignal,
): Promise<{ events: GameEvent[]; cursor: number }> {
  const value = await request<unknown>(
    `${API_ROOT}/games/${gameId}/events?after=${encodeURIComponent(after)}`,
    { signal },
  );
  const record = asRecord(value);
  const events = (Array.isArray(value) ? value : asArray(record.events)).map(normalizeEvent);
  const lastSequence = events.at(-1)?.sequence ?? after;
  return {
    events,
    cursor: numberValue(record.nextCursor ?? record.cursor, lastSequence),
  };
}

type RequestOptions = Readonly<{
  method?: "GET" | "POST" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
}>;

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers({ accept: "application/json" });
  if (options.body !== undefined) {
    headers.set("content-type", "application/json");
  }
  const response = await fetch(path, {
    method: options.method ?? "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    credentials: "include",
    cache: "no-store",
    signal: options.signal,
  });

  const raw = await response.text();
  let value: unknown = null;
  if (raw) {
    try {
      value = JSON.parse(raw) as unknown;
    } catch {
      value = raw;
    }
  }

  if (!response.ok) {
    const record = asRecord(value);
    const message = stringValue(
      record.detail ?? record.message ?? record.error,
      `Request failed with status ${response.status}`,
    );
    throw new ApiError(message, response.status, optionalString(record.code));
  }

  return value as T;
}

function normalizeIdentity(value: unknown): LocalIdentity {
  const root = asRecord(value);
  const principal = asRecord(root.principal ?? root.session ?? value);
  const id = stringValue(principal.id ?? principal.principalId);
  const handle = stringValue(
    principal.displayName ?? principal.handle ?? principal.name,
  );
  if (!id || !handle) {
    throw new ApiError("The session service returned an invalid identity.", 502, "invalid_session");
  }
  return {
    id,
    handle,
    kind: principal.kind === "agent" ? "agent" : "human",
    expiresAt: optionalString(root.expiresAt ?? principal.expiresAt),
  };
}

function normalizeGameSummary(value: unknown): GameSummary {
  const record = asRecord(value);
  const snapshot = asRecord(
    record.projection ?? record.stateSnapshot ?? record.snapshot ?? record.state,
  );
  const configRecord = asRecord(record.config ?? record.settings ?? snapshot.settings);
  const players = collectionValues(record.players ?? snapshot.players);
  return {
    id: stringValue(record.id ?? record.gameId ?? snapshot.gameId),
    status: gameStatus(record.status ?? snapshot.status),
    version: numberValue(record.version ?? snapshot.version),
    rulesetVersion: stringValue(
      record.rulesetVersion ?? record.ruleset ?? snapshot.rulesetId,
      "legacy-v2",
    ),
    ownerPrincipalId: optionalString(
      record.ownerPrincipalId ?? record.owner ?? snapshot.ownerPrincipalId,
    ),
    config: normalizeConfig(configRecord),
    playersCount: numberValue(
      record.playersCount ?? record.playerCount,
      players.length || asArray(snapshot.seatOrder).length,
    ),
    createdAt: optionalString(record.createdAt),
    winnerPlayerId: optionalString(
      record.winnerPlayerId ?? record.winner ?? asArray(snapshot.podium)[0],
    ),
  };
}

function normalizeGameView(value: unknown): GameView {
  const record = asRecord(value);
  const summary = normalizeGameSummary(record);
  const snapshot = asRecord(
    record.projection ?? record.stateSnapshot ?? record.snapshot ?? record.state,
  );
  const playerRecords = collectionValues(
    record.players ?? snapshot.players ?? record.gamePlayers,
  );
  const resourceRecords = normalizeResourceCollection(
    record.resources ?? record.boardHearts ?? snapshot.resources ?? record.boardResources ?? snapshot.boardHearts,
  );
  const actionRecords = asArray(
    record.legalActions ?? record.actions ?? snapshot.legalActions,
  );
  return {
    ...summary,
    players: playerRecords.map(normalizePlayer),
    resources: resourceRecords.map(normalizeResource),
    legalActions: actionRecords.map(normalizeLegalAction),
    currentEpoch: numberValue(
      record.currentEpoch ?? snapshot.currentEpoch,
      calculateEpoch(snapshot),
    ),
    nextEpochAt: optionalString(record.nextEpochAt ?? snapshot.nextEpochAt),
  };
}

function normalizeConfig(value: Record<string, unknown>): GameConfig {
  return {
    maxPlayers: numberValue(value.maxPlayers ?? value.playerCount, 4),
    boardSize: numberValue(value.boardSize ?? value.radius ?? value.boardRadius, 4),
    epochSeconds: numberValue(
      value.epochSeconds,
      Math.max(1, Math.round(numberValue(value.epochDurationMs, 300_000) / 1000)),
    ),
    initHearts: numberValue(value.initHearts ?? value.initialHearts, 3),
    initActionPoints: numberValue(
      value.initActionPoints ?? value.initAps ?? value.initialActionPoints,
      3,
    ),
    initRange: numberValue(value.initRange ?? value.initialRange, 3),
  };
}

function normalizePlayer(value: unknown): PlayerView {
  const record = asRecord(value);
  const tank = asRecord(record.tank ?? value);
  const position = asRecord(tank.position ?? record.position);
  const hearts = numberValue(tank.hearts ?? record.hearts);
  const explicitState = optionalString(record.state);
  return {
    id: stringValue(record.id ?? record.playerId ?? tank.playerId),
    seat: numberValue(record.seat ?? record.tankId),
    handle: stringValue(record.handle ?? record.name ?? record.displayName, "Unknown player"),
    state:
      explicitState === "dead" || record.alive === false || hearts <= 0
        ? "dead"
        : "alive",
    hearts,
    actionPoints: numberValue(tank.actionPoints ?? tank.aps ?? record.actionPoints),
    range: numberValue(tank.range ?? record.range),
    position: normalizeHex(position, tank),
    lastDripEpoch: optionalNumber(tank.lastDripEpoch ?? record.lastDripEpoch),
    finishedPlace: optionalNumber(record.finishedPlace),
    ownedByViewer: booleanValue(record.ownedByViewer ?? tank.ownedByViewer),
    controllableByViewer: booleanValue(
      record.controllableByViewer ?? tank.controllableByViewer,
    ),
  };
}

function normalizeResource(value: unknown): BoardResource {
  const record = asRecord(value);
  const position = asRecord(record.position);
  return {
    id: stringValue(record.id, crypto.randomUUID()),
    kind: stringValue(record.kind, "heart"),
    quantity: numberValue(record.quantity, 1),
    position: normalizeHex(position, record),
  };
}

function normalizeLegalAction(value: unknown): LegalAction {
  const record = typeof value === "string" ? { type: value } : asRecord(value);
  const target = record.target ? normalizeHex(asRecord(record.target)) : undefined;
  return {
    type: stringValue(record.type),
    actorPlayerId: optionalString(record.actorPlayerId),
    enabled: record.enabled === undefined ? true : booleanValue(record.enabled),
    targetPlayerId: optionalString(record.targetPlayerId),
    ...(target ? { target } : {}),
    maxShots: optionalNumber(record.maxShots),
    cost: optionalNumber(record.cost),
    reason: optionalString(record.reason),
    details: asRecord(record.details ?? record.metadata),
  };
}

function normalizeEvent(value: unknown): GameEvent {
  const record = asRecord(value);
  return {
    id: stringValue(record.id, `event-${stringValue(record.sequence)}`),
    sequence: numberValue(record.sequence),
    gameVersion: optionalNumber(record.gameVersion ?? record.version),
    type: stringValue(record.type, "game_event"),
    payload: asRecord(record.payload ?? record.data),
    principalId: optionalString(record.principalId),
    occurredAt: stringValue(record.occurredAt ?? record.timestamp, new Date().toISOString()),
  };
}

function normalizeHex(
  position: Record<string, unknown>,
  fallback: Record<string, unknown> = {},
): HexCoordinate {
  const q = numberValue(position.q ?? position.x ?? fallback.positionQ ?? fallback.q);
  const r = numberValue(position.r ?? position.y ?? fallback.positionR ?? fallback.r);
  return {
    q,
    r,
    s: numberValue(position.s ?? position.z ?? fallback.positionS ?? fallback.s, -q - r),
  };
}

function gameStatus(value: unknown): GameStatus {
  if (value === 0 || value === "waiting" || value === "waiting_for_players") return "lobby";
  if (value === 1 || value === "started") return "active";
  if (value === 2) return "ended";
  if (value === "active" || value === "ended" || value === "cancelled" || value === "lobby") {
    return value;
  }
  return "lobby";
}

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function collectionValues(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  const record = asRecord(value);
  return Object.keys(record).length ? Object.values(record) : [];
}

function normalizeResourceCollection(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  const record = asRecord(value);
  return Object.entries(record).flatMap(([key, quantity]) => {
    if (typeof quantity !== "number" && typeof quantity !== "string") return [];
    const [q, r, s] = key.split(",").map(Number);
    if (![q, r, s].every(Number.isFinite)) return [];
    return [{ id: `heart-${key}`, kind: "heart", quantity, q, r, s }];
  });
}

function calculateEpoch(snapshot: Record<string, unknown>): number {
  const duration = numberValue(asRecord(snapshot.settings).epochDurationMs);
  return duration > 0 ? Math.floor(Date.now() / duration) : 0;
}

function stringValue(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function numberValue(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function optionalNumber(value: unknown): number | undefined {
  const parsed = numberValue(value, Number.NaN);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function booleanValue(value: unknown): boolean {
  return value === true || value === 1 || value === "true";
}
