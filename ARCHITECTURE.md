# Tact vNext architecture

Status: proposed foundation, with the first vertical slice scaffolded in `apps/web`,
`packages/game-engine`, and `packages/db`.

## Decision summary

1. Neon Postgres is the authoritative state store.
2. A pure, versioned TypeScript engine is the only place game rules execute.
3. REST/JSON plus OpenAPI is the canonical interface for both humans and agents.
4. MPP means the Stripe/Tempo Machine Payments Protocol and is the canonical payment
   boundary. x402 remains an optional compatibility adapter.
5. Payment, identity, and game authorization are three distinct concerns.
6. Current state and an append-only, hash-chained event history are committed atomically.
7. The Next.js process owns no durable locks, timers, matches, or WebSocket rooms.

MPP is the better default for this game because one HTTP payment challenge can offer human
methods (Stripe/card/Link) and agent-native stablecoins (Tempo), and it supports both one-time
charges and sessions. MPP clients can also consume the core x402 exact flow, and `mppx`
supports EVM/x402 methods. This keeps Base/x402-only agents reachable without maintaining a
second game API.

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
Agent or SDK ────────────────┤                                  ├── Neon Postgres
Agent MCP client ─ MCP facade┘                                  └── payment gateway
                                                                       ├── MPP Tempo
                                                                       ├── MPP Stripe
                                                                       └── x402 EVM
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
| `packages/contracts` (next) | Zod DTOs, error codes, OpenAPI generation | Contain transport-specific business logic |
| `packages/payments` (next) | Offers, verified receipts, MPP/x402 adapters | Treat a payer as an authenticated player |
| `packages/sdk` (next) | Typed browser/agent client | Bypass version or idempotency checks |
| `apps/worker` (later) | Deadlines, outbox, reconciliation, refunds | Become a second game engine |
| `apps/mcp` (later) | Thin MCP tool facade | Invent MCP-only actions |

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

- Humans: Neon Auth session stored in secure HttpOnly cookies. Passkeys should be the preferred
  sign-in method once the first interactive slice is built.
- Agents: scoped, revocable random tokens stored only as hashes. Use a dedicated
  `Tact-Agent-Token` header so it cannot collide with MPP authentication.
- AgentCash agents may instead establish wallet identity through SIWX. The verified wallet is
  stored as a `principal_identity` and explicitly linked to a principal; it is not inferred from
  an arbitrary payment recipient or automatically granted control of a tank.
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

1. Authenticate before disclosing a priced challenge.
2. Create a short-lived quote bound to request hash, principal, game/version, price, and purpose.
3. Return MPP `402 Payment Required` offers (initially Tempo and Stripe charge).
4. Verify/settle the retried payment and persist the provider receipt under a unique reference.
5. Mint an internal entitlement such as `match_entry`, `tournament_entry`, or `bounty_funding`.
6. Consume the entitlement in the same Postgres transaction as the game command.
7. Duplicate network retries return the original command result and receipt.
8. If settlement succeeds but the command can no longer apply, preserve a credit or enqueue a
   refund. Never charge and silently discard.

The `mppx` Tempo method must use a Neon-backed atomic replay store in production. Its in-memory
default is acceptable only for the integration-check route because Vercel functions do not share
process memory. The database's unique protocol/reference constraint remains a second line of
defense.

Charge at meaningful boundaries, not on every move. Per-action settlement would add latency and
race conditions to the game's continuous-time core. If a future mode genuinely meters actions,
MPP `session` is the right primitive.

Prizes, paid bounties, or wager-like modes require a separate legal/product review before launch.
The technical ledger does not by itself make those flows appropriate in every jurisdiction.

## Storage model

The initial migration creates:

- `principals` and `principal_identities` for human/agent identity;
- `games`, `game_players`, `tanks`, and `board_resources` for current projections;
- `game_commands` for request hashes, idempotency, version expectations, and results;
- `game_events` for the immutable, per-game versioned audit trail;
- `payment_receipts` and `entitlements` for settlement-safe economic rights;
- `outbox` for delivery and reconciliation after commit.

Important database guarantees already represented in the migration include unique seats,
unique game/principal membership, unique occupied coordinates, valid cube coordinates,
non-negative resources, unique idempotency keys, unique payment references, and unique game
event versions.

Before production, add least-privilege application and migration roles, backup/restore drills,
retention policy, RLS where it provides defense in depth, and database-level tests for every
constraint.

## HTTP and agent surface

Planned canonical endpoints:

```text
GET  /api/v1
GET  /openapi.json
GET  /api/v1/rulesets/:version
POST /api/v1/games
POST /api/v1/games/:id/join
GET  /api/v1/games/:id
GET  /api/v1/games/:id/legal-actions
POST /api/v1/games/:id/commands
GET  /api/v1/games/:id/events?after=:sequence
POST /mcp
```

Errors use RFC 9457-style problem details with stable machine codes. Event reads use a cursor,
not page numbers. The SDK is generated from the same schemas as OpenAPI.

The later MCP facade exposes `get_game`, `get_legal_actions`, `submit_command`, and `get_replay`.
MPP's MCP/JSON-RPC transport is also a draft, so MCP metadata stays in that adapter.

## Realtime, clocks, and randomness

- MVP: clients poll `/events?after=` with conditional requests while a game is active.
- Scale: commit an outbox row with every event, then publish to a managed realtime service.
- Do not rely on in-process WebSockets or Postgres `LISTEN/NOTIFY` over pooled serverless
  connections.
- Store deadlines in Postgres and validate against database time. A worker sweeps overdue work;
  browsers and Next.js instances do not own clocks.
- Normalize the board to signed cube coordinates centered at `(0,0,0)`, with `boardSize` meaning
  radius.
- Random placement and spawns use a committed deterministic seed. Record seed provenance and
  event inputs, then reveal enough material for replay verification.
- Hash-chain events and expose state hashes. If stronger public verifiability becomes useful,
  periodically anchor a Merkle root onchain rather than putting every move onchain.

## Delivery phases

### Phase 0 — completed in this bootstrap

- archive branch/worktree split;
- pnpm workspace and Turborepo task graph, targeting Vercel;
- Next.js 16/React 19 application;
- Neon serverless/Drizzle schema and first migration;
- pure compatibility rules and tests;
- MPP charge boundary with human HTML response support;
- API capability, health, ruleset, and OpenAPI routes.

### Phase 1 — first playable vertical slice

- Neon Auth human session and scoped agent tokens;
- create/list/join game;
- atomic command service for move, shoot, give, upgrade, AP claim, and curse vote;
- snapshot and cursor event reads;
- browser board consuming exactly those routes;
- match-entry payment quote, receipt, entitlement, credit/refund handling;
- concurrency, idempotency, and retry integration tests.

### Phase 2 — the social game

- revival/podium completeness;
- scoped delegation;
- non-aggression commitments and bounties as first-class domain modules;
- deterministic spawn scheduler and worker;
- typed SDK, MCP facade, and reference agent;
- replays, event/state hash verification, and observability.

### Phase 3 — production economy

- Stripe MPP rail and x402/Base compatibility;
- reconciliation/webhooks, refunds, treasury controls, and accounting exports;
- load/failure testing and incident runbooks;
- security review and legal review for prizes or paid competitive modes.

## Product decisions still required

The original prose, contract, UI, and off-chain prototype disagree. The engine must not guess.
Before Phase 1 is called balance-complete, explicitly approve:

1. whether v3 keeps the played arbitrary-distance movement or changes to adjacent-only moves;
2. whether batched shooting remains;
3. upgrade progression (contract `12,18,24…` versus prose/new-perimeter pricing);
4. start at exact capacity or owner/auto-start after a minimum;
5. heart spawn duration and verifiable randomness policy;
6. two-player podium split and whether buy-ins fund prizes;
7. self-shoot and self-sacrifice semantics;
8. whether the first public release has any cash/stablecoin prize at all.

Recommendation: ship a frozen `legacy-v2` compatibility ruleset for replay/simulation, then name
the consciously chosen public ruleset `tact-v3-alpha.1`. Do not call prototype divergences bug
fixes until their balance effect has been simulated.
