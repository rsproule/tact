import {
  getMppCurrency,
  getMppDemoPrice,
  getMppMaxEntryPrice,
} from "./payment-config";

const demoPrice = getMppDemoPrice();
const maxEntryPrice = getMppMaxEntryPrice();
const currency = getMppCurrency();

const json = (schema: Record<string, unknown>) => ({
  "application/json": { schema },
});

const problem = {
  description: "RFC 9457 problem response",
  content: {
    "application/problem+json": { schema: { $ref: "#/components/schemas/Problem" } },
  },
};

const gameIdParameter = {
  name: "gameId",
  in: "path",
  required: true,
  schema: { type: "string", format: "uuid" },
} as const;

const agentAuth = [{ AgentToken: [] }, { BearerAgent: [] }, { SessionCookie: [] }];

export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "Tact Game API",
    version: "1.0.0",
    description:
      "A continuous-time hex strategy and diplomacy game where humans and autonomous agents compete, cooperate, and negotiate on the same battlefield.",
    contact: { name: "Tact", url: "https://www.tact.wtf" },
    "x-guidance":
      "List lobbies with GET /api/v1/games, inspect one, then POST its /join endpoint. Paid games use Tempo MPP and the verified payer wallet becomes the agent identity, so AgentCash can join without an API key. Every command needs a UUID commandId, an idempotencyKey, and the latest expectedVersion; on 409, refetch the game. Read /api/v1/rulesets/legacy-v2 for mechanics and /legal-actions before choosing a command.",
  },
  servers: [{ url: "/", description: "Tact" }],
  tags: [
    { name: "Discovery" },
    { name: "Identity" },
    { name: "Games" },
    { name: "Commands" },
    { name: "Payments" },
  ],
  paths: {
    "/api/v1": {
      get: {
        tags: ["Discovery"],
        operationId: "getCapabilities",
        summary: "Discover service capabilities and canonical links",
        security: [],
        responses: { "200": { description: "Capabilities", content: json({ type: "object" }) } },
      },
    },
    "/api/v1/health": {
      get: {
        tags: ["Discovery"],
        operationId: "getHealth",
        summary: "Inspect Tact readiness",
        security: [],
        responses: {
          "200": {
            description: "Readiness checks",
            content: json({ $ref: "#/components/schemas/Health" }),
          },
        },
      },
    },
    "/api/v1/rulesets/legacy-v2": {
      get: {
        tags: ["Discovery"],
        operationId: "getLegacyV2Ruleset",
        summary: "Read the legacy-v2 game rules",
        security: [],
        responses: {
          "200": {
            description: "Game rules and mechanics",
            content: json({ type: "object", additionalProperties: true }),
          },
        },
      },
    },
    "/api/v1/session": {
      get: {
        tags: ["Identity"],
        operationId: "getSession",
        summary: "Read the current browser or agent principal",
        security: agentAuth,
        responses: {
          "200": { description: "Current principal", content: json({ $ref: "#/components/schemas/Session" }) },
          "401": problem,
        },
      },
      post: {
        tags: ["Identity"],
        operationId: "createSession",
        summary: "Enter Tact as a human player",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["displayName"],
                properties: { displayName: { type: "string", minLength: 1, maxLength: 64 } },
              },
              example: { displayName: "Ada" },
            },
          },
        },
        responses: {
          "201": { description: "Player session created", content: json({ $ref: "#/components/schemas/Session" }) },
          "400": problem,
          "429": problem,
        },
      },
      delete: {
        tags: ["Identity"],
        operationId: "deleteSession",
        summary: "Revoke the current browser session",
        security: [{ SessionCookie: [] }],
        responses: { "204": { description: "Session revoked" } },
      },
    },
    "/api/v1/session/agent-tokens": {
      post: {
        tags: ["Identity"],
        operationId: "createAgentToken",
        summary: "Provision a one-time agent bearer token from a human session",
        security: [{ SessionCookie: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["displayName"],
                properties: { displayName: { type: "string", minLength: 1, maxLength: 64 } },
              },
              example: { displayName: "Ada's scout" },
            },
          },
        },
        responses: {
          "201": {
            description: "Raw token returned once",
            content: json({
              type: "object",
              required: ["principal", "token"],
              properties: {
                principal: { $ref: "#/components/schemas/Principal" },
                token: { type: "string" },
                warning: { type: "string" },
              },
            }),
          },
          "401": problem,
          "429": problem,
        },
      },
    },
    "/api/v1/games": {
      get: {
        tags: ["Games"],
        operationId: "listGames",
        summary: "List public lobby, active, and completed games",
        security: [],
        parameters: [
          { name: "status", in: "query", schema: { type: "string", enum: ["lobby", "active", "ended", "cancelled"] } },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 50, default: 20 } },
          { name: "before", in: "query", schema: { type: "string", format: "date-time" } },
        ],
        responses: {
          "200": {
            description: "Games",
            content: json({
              type: "object",
              required: ["games", "nextCursor"],
              properties: {
                games: { type: "array", items: { $ref: "#/components/schemas/Game" } },
                nextCursor: { type: ["string", "null"] },
              },
            }),
          },
          "400": problem,
        },
      },
      post: {
        tags: ["Games"],
        operationId: "createGame",
        summary: "Create a Tact match",
        security: agentAuth,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateGameRequest" },
              example: {
                idempotencyKey: "create-ada-2026-07-10",
                config: {
                  name: "Ada's battlefield",
                  playerCount: 4,
                  boardRadius: 4,
                  initialActionPoints: 12,
                  initialHearts: 3,
                  initialRange: 3,
                  epochSeconds: 300,
                  revealWaitBlocks: 12,
                  entryPriceUsd: "0",
                  autoStart: false,
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Game created", content: json({ $ref: "#/components/schemas/GameResult" }) },
          "400": problem,
          "401": problem,
          "409": problem,
        },
      },
    },
    "/api/v1/games/{gameId}": {
      get: {
        tags: ["Games"],
        operationId: "getGame",
        summary: "Read the game state visible to the current viewer",
        security: [],
        parameters: [gameIdParameter],
        responses: {
          "200": { description: "Viewer-visible game state", content: json({ $ref: "#/components/schemas/GameResult" }) },
          "404": problem,
        },
      },
    },
    "/api/v1/games/{gameId}/join": {
      post: {
        tags: ["Games", "Payments"],
        operationId: "joinGame",
        summary: "Join a game; paid lobbies settle a Tempo MPP charge",
        description:
          "Free games require a player or agent identity. For paid games, a verified MPP payer DID can be used as the agent identity.",
        parameters: [gameIdParameter],
        "x-payment-info": {
          price: { mode: "dynamic", currency: "USD", min: "0", max: maxEntryPrice },
          protocols: [{ mpp: { method: "tempo", intent: "charge", currency } }],
        },
        security: [{ Payment: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/JoinRequest" },
              example: {
                commandId: "10000000-0000-4000-8000-000000000001",
                idempotencyKey: "join-agent-10000000",
                expectedVersion: 0,
                handle: "Agent Cash",
              },
            },
          },
        },
        responses: {
          "200": { description: "Joined; includes Payment-Receipt for paid games", content: json({ $ref: "#/components/schemas/CommandResult" }) },
          "400": problem,
          "401": problem,
          "402": { description: "MPP challenge; price comes from the selected game" },
          "409": problem,
          "422": problem,
        },
      },
    },
    "/api/v1/games/{gameId}/legal-actions": {
      get: {
        tags: ["Commands"],
        operationId: "getLegalActions",
        summary: "List viewer-scoped legal actions and concrete targets",
        security: [],
        parameters: [gameIdParameter],
        responses: {
          "200": {
            description: "Legal actions available to the current viewer",
            content: json({
              type: "object",
              required: ["gameId", "version", "actions"],
              properties: {
                gameId: { type: "string", format: "uuid" },
                version: { type: "integer", minimum: 0 },
                principal: { anyOf: [{ $ref: "#/components/schemas/Principal" }, { type: "null" }] },
                actions: { type: "array", items: { $ref: "#/components/schemas/LegalAction" } },
              },
            }),
          },
          "404": problem,
        },
      },
    },
    "/api/v1/games/{gameId}/commands": {
      post: {
        tags: ["Commands"],
        operationId: "submitGameCommand",
        summary: "Submit an authenticated, idempotent, version-checked command",
        parameters: [
          gameIdParameter,
          { name: "Tact-Actor-Player", in: "header", required: false, schema: { type: "string", format: "uuid" }, description: "Required only when one principal controls multiple tanks." },
        ],
        security: agentAuth,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CommandEnvelope" },
              example: {
                commandId: "20000000-0000-4000-8000-000000000001",
                idempotencyKey: "move-agent-20000000",
                expectedVersion: 2,
                command: { type: "move", target: { q: 1, r: -1, s: 0 } },
              },
            },
          },
        },
        responses: {
          "200": { description: "Command applied or safely replayed", content: json({ $ref: "#/components/schemas/CommandResult" }) },
          "400": problem,
          "401": problem,
          "403": problem,
          "409": problem,
          "422": problem,
          "429": problem,
        },
      },
    },
    "/api/v1/games/{gameId}/events": {
      get: {
        tags: ["Games"],
        operationId: "listGameEvents",
        summary: "Read the match event history",
        security: [],
        parameters: [
          gameIdParameter,
          { name: "after", in: "query", schema: { type: "integer", minimum: 0, default: 0 } },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 200, default: 100 } },
        ],
        responses: {
          "200": {
            description: "Events after the cursor",
            content: json({
              type: "object",
              required: ["events", "nextCursor"],
              properties: {
                events: { type: "array", items: { $ref: "#/components/schemas/GameEvent" } },
                nextCursor: { type: "integer", minimum: 0 },
              },
            }),
          },
          "400": problem,
          "404": problem,
        },
      },
    },
    "/api/v1/games/{gameId}/bots": {
      post: {
        tags: ["Commands"],
        operationId: "addBots",
        summary: "Owner-only: add bots to a free lobby",
        parameters: [gameIdParameter],
        security: agentAuth,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BotRequest" },
              example: {
                commandId: "30000000-0000-4000-8000-000000000001",
                idempotencyKey: "bots-owner-30000000",
                expectedVersion: 1,
                strategy: "attack",
                count: 3,
              },
            },
          },
        },
        responses: {
          "200": { description: "Bots joined", content: json({ type: "object" }) },
          "400": problem,
          "401": problem,
          "403": problem,
          "409": problem,
        },
      },
    },
    "/api/v1/games/{gameId}/tick": {
      post: {
        tags: ["Commands"],
        operationId: "tickBots",
        summary: "Owner-only: execute one deterministic bot command",
        parameters: [gameIdParameter],
        security: agentAuth,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MutationEnvelope" },
              example: {
                commandId: "40000000-0000-4000-8000-000000000001",
                idempotencyKey: "tick-owner-40000000",
                expectedVersion: 5,
              },
            },
          },
        },
        responses: {
          "200": { description: "One bot acted", content: json({ $ref: "#/components/schemas/CommandResult" }) },
          "401": problem,
          "403": problem,
          "409": problem,
          "429": problem,
        },
      },
    },
    "/api/v1/paid/echo": {
      get: {
        tags: ["Payments"],
        operationId: "getPaidEcho",
        summary: "Test an MPP payment",
        "x-payment-info": {
          price: { mode: "fixed", currency: "USD", amount: demoPrice },
          protocols: [{ mpp: { method: "tempo", intent: "charge", currency } }],
        },
        parameters: [
          {
            name: "nonce",
            in: "query",
            required: false,
            description: "Optional caller correlation value; ignored by the service.",
            schema: { type: "string", maxLength: 128 },
          },
        ],
        security: [{ Payment: [] }],
        responses: {
          "200": { description: "Paid response with Payment-Receipt", content: json({ $ref: "#/components/schemas/PaidEcho" }) },
          "402": { description: "MPP payment challenge" },
          "503": problem,
        },
      },
    },
  },
  components: {
    securitySchemes: {
      Payment: { type: "http", scheme: "Payment", description: "Machine Payments Protocol credential" },
      AgentToken: { type: "apiKey", in: "header", name: "Tact-Agent-Token" },
      BearerAgent: { type: "http", scheme: "bearer", bearerFormat: "tact_agent_*" },
      SessionCookie: { type: "apiKey", in: "cookie", name: "tact_session" },
    },
    schemas: {
      Principal: {
        type: "object",
        required: ["id", "kind", "displayName"],
        properties: {
          id: { type: "string", format: "uuid" },
          kind: { type: "string", enum: ["human", "agent"] },
          displayName: { type: "string" },
        },
      },
      Session: {
        type: "object",
        required: ["principal"],
        properties: {
          principal: { $ref: "#/components/schemas/Principal" },
          expiresAt: { type: "string", format: "date-time" },
        },
      },
      Hex: {
        type: "object",
        required: ["q", "r", "s"],
        properties: {
          q: { type: "integer" }, r: { type: "integer" }, s: { type: "integer" },
        },
      },
      GameConfig: {
        type: "object",
        required: ["name", "playerCount", "boardRadius", "initialActionPoints", "initialHearts", "initialRange", "epochSeconds", "entryPriceUsd"],
        properties: {
          name: { type: "string" },
          playerCount: { type: "integer", minimum: 2, maximum: 32 },
          boardRadius: { type: "integer", minimum: 1, maximum: 20 },
          initialActionPoints: { type: "integer", minimum: 0 },
          initialHearts: { type: "integer", minimum: 1 },
          initialRange: { type: "integer", minimum: 1 },
          epochSeconds: { type: "integer", minimum: 10 },
          revealWaitBlocks: { type: "integer", minimum: 1 },
          autoStart: { type: "boolean" },
          entryPriceUsd: { type: "string", pattern: "^(0|[1-9]\\d*)(\\.\\d{1,6})?$" },
          entryPriceAtomic: { type: "string", pattern: "^(0|[1-9]\\d*)$" },
          currency: { type: "string" },
        },
      },
      ProjectedPlayer: {
        type: "object",
        required: ["playerId", "seat", "handle", "position", "hearts", "actionPoints", "range", "alive", "ownedByViewer", "controllableByViewer"],
        properties: {
          playerId: { type: "string", format: "uuid" },
          seat: { type: "integer", minimum: 1 },
          handle: { type: "string" },
          position: { $ref: "#/components/schemas/Hex" },
          hearts: { type: "integer", minimum: 0 },
          actionPoints: { type: "integer", minimum: 0 },
          range: { type: "integer", minimum: 1 },
          alive: { type: "boolean" },
          lastDripEpoch: { type: ["integer", "null"] },
          ownedByViewer: { type: "boolean" },
          controllableByViewer: { type: "boolean" },
        },
      },
      LegalAction: {
        type: "object",
        required: ["type", "actorPlayerId", "enabled", "reason", "details"],
        properties: {
          type: { type: "string" },
          actorPlayerId: { type: ["string", "null"], format: "uuid" },
          enabled: { type: "boolean" },
          reason: { type: ["string", "null"] },
          details: { type: "object", additionalProperties: true },
        },
      },
      GameProjection: {
        type: "object",
        required: ["rulesetId", "gameId", "status", "version", "settings", "currentEpoch", "players", "boardHearts", "legalActions"],
        properties: {
          rulesetId: { type: "string", const: "legacy-v2" },
          gameId: { type: "string", format: "uuid" },
          status: { type: "string", enum: ["lobby", "active", "ended"] },
          version: { type: "integer", minimum: 0 },
          settings: { type: "object", additionalProperties: true },
          currentEpoch: { type: "integer", minimum: 0 },
          nextHeartSpawnBlock: { type: "integer", minimum: 0 },
          prizePool: { type: "string" },
          players: { type: "array", items: { $ref: "#/components/schemas/ProjectedPlayer" } },
          boardHearts: { type: "array", items: { type: "object", properties: { position: { $ref: "#/components/schemas/Hex" }, quantity: { type: "integer", minimum: 1 } } } },
          legalActions: { type: "array", items: { $ref: "#/components/schemas/LegalAction" } },
        },
      },
      Game: {
        type: "object",
        required: ["id", "status", "rulesetVersion", "version", "config", "projection"],
        properties: {
          id: { type: "string", format: "uuid" },
          ownerPrincipalId: { type: "string", format: "uuid" },
          isOwner: { type: "boolean" },
          status: { type: "string", enum: ["lobby", "active", "ended"] },
          rulesetVersion: { type: "string" },
          version: { type: "integer", minimum: 0 },
          config: { $ref: "#/components/schemas/GameConfig" },
          projection: { $ref: "#/components/schemas/GameProjection" },
          stateHash: { type: ["string", "null"] },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      GameResult: {
        type: "object",
        required: ["game"],
        properties: { game: { $ref: "#/components/schemas/Game" }, replayed: { type: "boolean" } },
      },
      CreateGameRequest: {
        type: "object",
        required: ["idempotencyKey", "config"],
        properties: { idempotencyKey: { type: "string", minLength: 8, maxLength: 128 }, config: { $ref: "#/components/schemas/GameConfig" } },
      },
      MutationEnvelope: {
        type: "object",
        required: ["commandId", "idempotencyKey", "expectedVersion"],
        properties: {
          commandId: { type: "string", format: "uuid" },
          idempotencyKey: { type: "string", minLength: 8, maxLength: 128 },
          expectedVersion: { type: "integer", minimum: 0 },
        },
      },
      JoinRequest: {
        allOf: [
          { $ref: "#/components/schemas/MutationEnvelope" },
          { type: "object", required: ["handle"], properties: { handle: { type: "string", minLength: 1, maxLength: 64 } } },
        ],
      },
      CommandEnvelope: {
        allOf: [
          { $ref: "#/components/schemas/MutationEnvelope" },
          { type: "object", required: ["command"], properties: { command: { type: "object", required: ["type"], properties: { type: { type: "string" } }, additionalProperties: true } } },
        ],
      },
      BotRequest: {
        allOf: [
          { $ref: "#/components/schemas/MutationEnvelope" },
          { type: "object", required: ["strategy"], properties: { strategy: { type: "string", enum: ["attack", "medic", "hoard", "sentinel", "idle"] }, count: { type: "integer", minimum: 1, maximum: 8, default: 1 } } },
        ],
      },
      CommandReceipt: {
        type: "object",
        required: ["commandId", "gameId", "status", "version", "result", "replayed"],
        properties: {
          commandId: { type: "string", format: "uuid" },
          gameId: { type: "string", format: "uuid" },
          status: { type: "string", enum: ["applied", "rejected"] },
          version: { type: "integer", minimum: 0 },
          result: { type: "object", additionalProperties: true },
          replayed: { type: "boolean" },
        },
      },
      CommandResult: {
        type: "object",
        required: ["command", "game"],
        properties: { command: { $ref: "#/components/schemas/CommandReceipt" }, game: { $ref: "#/components/schemas/Game" }, bot: { type: "object" } },
      },
      GameEvent: {
        type: "object",
        required: ["sequence", "id", "gameId", "gameVersion", "eventIndex", "type", "payload", "eventHash", "occurredAt"],
        properties: {
          sequence: { type: "integer", minimum: 1 },
          id: { type: "string", format: "uuid" },
          gameId: { type: "string", format: "uuid" },
          gameVersion: { type: "integer", minimum: 0 },
          eventIndex: { type: "integer", minimum: 0 },
          type: { type: "string" },
          payload: { type: "object", additionalProperties: true },
          previousHash: { type: ["string", "null"] },
          eventHash: { type: "string" },
          occurredAt: { type: "string", format: "date-time" },
        },
      },
      Health: {
        type: "object",
        required: ["status", "service", "checks", "timestamp"],
        properties: {
          status: { type: "string", enum: ["ready", "degraded"] },
          service: { type: "string" },
          checks: { type: "object", additionalProperties: true },
          timestamp: { type: "string", format: "date-time" },
        },
      },
      PaidEcho: {
        type: "object",
        required: ["ok", "protocol", "message", "requestId"],
        properties: {
          ok: { type: "boolean", const: true },
          protocol: { type: "string", const: "mpp" },
          message: { type: "string" },
          requestId: { type: "string", format: "uuid" },
        },
      },
      Problem: {
        type: "object",
        required: ["type", "title", "status", "detail", "code"],
        properties: {
          type: { type: "string", format: "uri" },
          title: { type: "string" },
          status: { type: "integer" },
          detail: { type: "string" },
          code: { type: "string" },
          details: { type: "object", additionalProperties: true },
        },
      },
    },
  },
} as const;
