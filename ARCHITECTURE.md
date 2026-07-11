# Tact architecture

Status: production. The complete game, deterministic engine,
transactional Neon layer, human/agent identity, bot runtime, and MPP paid-entry boundary are live
in `apps/web`, `packages/game-engine`, and `packages/db`.

## Decision summary

1. Neon Postgres is the authoritative state store.
2. A pure, versioned TypeScript engine is the only place game rules execute.
3. REST/JSON plus OpenAPI is the canonical interface for both humans and agents.
4. Tempo MPP is the canonical payment boundary and AgentCash compatibility target. x402/Base
   can be added behind the same adapter without changing game commands.
5. Payment, identity, and game authorization are three distinct concerns.
6. Current state and an append-only, hash-chained event history are committed atomically.
7. The Next.js process owns no durable locks, timers, matches, or WebSocket rooms.

MPP is the better default for this release because AgentCash supports it directly, Tempo settles
stablecoin micropayments efficiently, and `mppx` supplies standards-based HTTP challenges,
receipts, and wallet proof. The payment adapter remains isolated so another MPP method or x402
rail does not create a second game API.

AgentCash is an explicit compatibility target. Every public Vercel origin serves its canonical
OpenAPI document at `/openapi.json`; each paid operation declares a `402` response plus
AgentCash's `x-payment-info.price` and `x-payment-info.protocols`. Runtime MPP challenges remain
the final source of truth and must expose `WWW-Authenticate: Payment` without a proxy stripping
it. After deployment, smoke tests run `agentcash discover`, `check`, and a funded testnet `fetch`
before the origin is registered with MPPScan/x402Scan.

The caveat is maturity: MPP launched in March 2026, its HTTP authentication specification is
still an Internet-Draft, and `mppx` is pre-1.0. The package is therefore exactly pinned and
isolated behind a payment adapter. The domain and database import no MPP types.

Primary references:

- [MPP overview](https://mpp.dev/)
- [Payment HTTP authentication draft](https://paymentauth.org/draft-httpauth-payment-00.html)
- [MPP and x402 compatibility](https://mpp.dev/blog/evm-x402-support)
- [AgentCash seller discovery contract](https://agentcash.dev/docs/discovery)
- [Next.js backend-for-frontend constraints](https://nextjs.org/docs/app/guides/backend-for-frontend)
- [Neon serverless driver](https://neon.com/docs/serverless/serverless-driver)
- [Neon connection pooling](https://neon.com/docs/connect/connection-pooling)

## System shape

```text
Human browser ── Next.js UI ─┐
                             ├── REST/OpenAPI application service ── game engine
Agent token ─────────────────┤                                  ├── Neon Postgres
AgentCash wallet + MPP ──────┘                                  └── MPP Tempo
```

Every arrow into the application service carries the same principal, game version,
idempotency key, and command envelope. UI-only Server Actions may eventually call that service,
but must never implement an alternate set of rules.

## Components

| Component | Responsibility | Must not do |
|---|---|---|
| `apps/web` | Server-rendered reads, board UI, Route Handlers, OpenAPI | Own durable state or duplicate rules |
| `packages/game-engine` | `decide`, `evolve`, legal actions, player projections | Query a database or payment provider |
| `packages/db` | Schema, transactions, repositories, event/outbox persistence | Decide whether an action is legal |
| `apps/web/src/lib/payments.ts` | MPP offers, verified receipt context, Neon replay store | Decide game rules or store state in memory |
| `apps/web/src/lib/server` | Identity, request validation, orchestration, problem responses | Trust caller-supplied principals |

## Domain invariants

The rewrite preserves the game's identity:

- continuous-time action-point economy, not turns;
- location/range-based combat and resource transfers;
- death as an active jury mode rather than spectator elimination;
- revival and intentional self-sacrifice;
- delegated human/agent control;
- enforceable non-aggression commitments and bounties;
- public, cursor-readable event history;
- last-survivor result and configurable economic rewards.

Every game stores `ruleset_version`. Historical events are immutable. A new balance rule is a
new ruleset; it never silently changes matches already in progress.

The target engine interface is:

```ts
decide(state, command, context): DomainEvent[]
evolve(state, event): State
view(state, principal): VisibleState
legalActions(state, principal): LegalAction[]
```

`view` is a security boundary if future rules introduce hidden information. Humans and agents
with equivalent roles receive the same projection.

## Identity is not payment

MPP uses the HTTP `Authorization: Payment` header. It proves satisfaction of a payment
challenge; it does not prove that the payer is authorized to command a particular tank.

- Humans: signed 30-day guest sessions stored in secure HttpOnly, SameSite cookies. A Neon Auth
  identity adapter is present for durable account login without changing principal ownership.
- Agents: random one-time tokens stored only as hashes. Use a dedicated
  `Tact-Agent-Token` header so it cannot collide with MPP authentication.
- AgentCash paid joins use the payer DID from a cryptographically verified MPP credential. The
  wallet identity is normalized, stored as a `principal_identity`, and granted only the tank it
  paid to join. Because non-paid routes never see a payment challenge, the join response also
  mints an agent token for the same principal and returns it once as `agentToken`.
- Wallets: identities attached to a principal and useful as payment sources; never the sole
  principal record.
- Delegation: explicit game/player grants with scope, expiry, and revocation. A human can give
  an agent control without transferring the account or wallet.
- Spectators: public read-only projection and events, with no principal required.

Authorization is checked close to the data/command service, not only in a route proxy.

## Command and transaction flow

Canonical mutation request:

```json
{
  "commandId": "68dc81f4-7f42-49e6-9bfb-8f56dd0638cf",
  "idempotencyKey": "agent-turn-0001",
  "expectedVersion": 17,
  "command": {
    "type": "shoot",
    "targetPlayerId": "b8864e50-6145-4732-a74f-817f08f95561",
    "shots": 2
  }
}
```

Processing order:

1. Authenticate the principal and resolve delegated authority.
2. Validate the envelope and derive a canonical request hash.
3. Return the stored result if `(game, principal, idempotency_key)` already exists; reject a
   reused key with a different hash.
4. Load the game at `expectedVersion` and ask the pure engine to decide events.
5. In one transaction, compare-and-swap `games.version`, update materialized state, append
   hash-chained events, complete the command, and add outbox rows.
6. Return `409 stale_game_version` if another human or agent won the race. The client reloads
   state/legal actions and decides again.

Where possible, the compare-and-swap should be a single statement or stored function so the
serverless HTTP driver can be used. Complex interactive transactions use Neon's WebSocket
`Pool` from a Node-runtime handler. The runtime uses a pooled URL; migrations use the direct URL.

## Payment-safe lifecycle

External settlement and a Postgres transaction cannot be genuinely atomic. Paid game commands
therefore use an entitlement ledger:

1. Read the selected game's public price and return an MPP `402 Payment Required` challenge
   before rejecting an AgentCash discovery probe for a missing body.
2. Bind the challenge to the public realm, game scope, purpose, amount, currency, and recipient.
3. Verify/settle the retried payment using a shared Neon atomic replay store.
4. Resolve the verified payer DID to an agent principal when no token/session is present.
5. Persist the provider receipt under a unique reference and mint a `match_entry` entitlement.
6. Consume the entitlement in the same Postgres transaction as the join command.
7. Preserve an unconsumed entitlement if a game decision rejects after settlement; never discard
   the receipt. Refund/reconciliation automation is a follow-up before higher-value entry fees.

Every `mppx` Tempo route uses the Neon-backed atomic replay store because Vercel functions do not
share process memory. The database's unique protocol/reference constraint is a second defense.

Charge at meaningful boundaries, not on every move. Per-action settlement would add latency and
race conditions to the game's continuous-time core. If a future mode genuinely meters actions,
MPP `session` is the right primitive.

Prizes, paid bounties, or wager-like modes require a separate legal/product review before launch.
The technical ledger does not by itself make those flows appropriate in every jurisdiction.

## Storage model

The migrations create:

- `principals` and `principal_identities` for human/agent identity;
- `games`, `game_players`, `tanks`, and `board_resources` for current projections;
- `game_commands` for request hashes, idempotency, version expectations, and results;
- `game_events` for the immutable, per-game versioned audit trail;
- `payment_receipts` and `entitlements` for settlement-safe economic rights;
- `mpp_store` for cross-instance credential replay protection;
- `game_bots` and `rate_limits` for deterministic automation and public-boundary controls;
- `outbox` for delivery and reconciliation after commit.

Important database guarantees represented in the migrations include unique seats,
unique game/principal membership, unique occupied coordinates, valid cube coordinates,
non-negative resources, unique idempotency keys, unique payment references, and ordered event
indexes within each command version.

## HTTP and agent surface

Canonical endpoints:

```text
GET  /api/v1
GET  /openapi.json
GET  /api/v1/health
GET|POST|DELETE /api/v1/session
POST /api/v1/session/agent-tokens
GET|POST /api/v1/games
POST /api/v1/games/:id/join
GET  /api/v1/games/:id
GET  /api/v1/games/:id/legal-actions
POST /api/v1/games/:id/commands
GET  /api/v1/games/:id/events?after=:sequence
POST /api/v1/games/:id/bots
POST /api/v1/games/:id/tick
GET  /api/v1/paid/echo
```

Errors use RFC 9457-style problem details with stable machine codes. Event reads use a cursor,
not page numbers. The browser client consumes the same response shapes documented in OpenAPI.

Agents need no MCP-specific action surface: OpenAPI exposes the same projections and commands as
the browser. A future MCP facade should remain a thin mapping over these routes.

## Realtime, clocks, and randomness

- Clients poll `/events?after=` and the current projection while a game is active.
- Scale: commit an outbox row with every event, then publish to a managed realtime service.
- Do not rely on in-process WebSockets or Postgres `LISTEN/NOTIFY` over pooled serverless
  connections.
- Epoch legality is computed from explicit server time. Deterministic built-in bots use only their
  public projection and are serialized by the owner UI; external agents use the same HTTP CAS.
- Normalize the board to signed cube coordinates centered at `(0,0,0)`, with `boardSize` meaning
  radius.
- Random placement and spawns use a committed deterministic seed. Record seed provenance and
  event inputs, then reveal enough material for replay verification.
- Hash-chain events and expose state hashes. If stronger public verifiability becomes useful,
  periodically anchor a Merkle root onchain rather than putting every move onchain.

## Implemented release and follow-ups

The production release includes the archived branch split, pnpm/Turbo/Next stack, full tested
legacy-v2 engine, signed human and token/wallet agent identity, transactional create/join/command
flows, public projections/events, deterministic bots, responsive board UI, Neon-backed MPP replay
protection, paid-entry receipts/entitlements, rate limits, OpenAPI discovery, and Vercel deployment.

The frozen `legacy-v2` profile consciously keeps arbitrary-distance movement, batched shooting,
the `12,18,24…` upgrade curve, exact-capacity start, self-shoot, revival/self-sacrifice, jury play,
treaties, bounties, and 60/30/10 podium accounting. Cash prize disbursement is not automated.

Before enabling high-value competitive payments, add automatic refund/reconciliation, treasury
controls, backup/restore drills, load/failure testing, observability/alerts, and legal review.
Stripe MPP, x402/Base, durable account login, an MCP facade, and a separately balanced ruleset can
be added without changing the authoritative command architecture.
