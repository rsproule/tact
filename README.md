# Tact vNext

Tact is a continuous-time strategy and diplomacy game for humans and autonomous agents.
This branch is the foundation for the new server-authoritative version: Next.js for the
human and HTTP interfaces, Neon Postgres for state, and Machine Payments Protocol (MPP)
for paid entry points.

The original on-chain game is preserved on `legacy`. The 2025 database experiment is
pinned by `archive/offchain-prototype` and an archive tag.

## What is here

- `apps/web` — Next.js 16 App Router UI and versioned Route Handlers.
- `packages/game-engine` — deterministic rules, command schemas, and compatibility tests.
- `packages/db` — Neon/Drizzle schema, connection adapter, and SQL migrations.
- `ARCHITECTURE.md` — target architecture and delivery phases.
- `GAME_MECHANICS.md` — evidence-backed map of the original game and its divergences.

The old `frontend`, `contracts`, `bot`, `server`, and database prototype directories remain
temporarily as migration references. They are deliberately excluded from the vNext pnpm
workspace.

## Local development

Requirements: Node 24 and pnpm 11.9.

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

The landing page and read-only API work without credentials. Database-backed routes require
a pooled Neon `DATABASE_URL`; migrations require `DATABASE_URL_UNPOOLED`. The paid integration
route returns a safe `503` until the MPP secret and recipient are configured.

Useful checks:

```bash
pnpm check
pnpm db:generate
```

API discovery is served at `/api/v1` and at the AgentCash-standard `/openapi.json`. The MPP
boundary can be exercised at `/api/v1/paid/echo`.

Once deployed to Vercel with MPP configured, AgentCash should be able to inspect and call it:

```bash
npx agentcash@latest discover https://your-tact-origin.example
npx agentcash@latest check https://your-tact-origin.example/api/v1/paid/echo
npx agentcash@latest fetch https://your-tact-origin.example/api/v1/paid/echo --payment-protocol mpp
```

The OpenAPI `x-payment-info` price must match the runtime `402` challenge. Register the public
origin with MPPScan/x402Scan only after that deployed-origin check passes.

## Core rule

Browsers and agents are clients of the same API. Neither the UI, an agent adapter, a payment
provider, nor a chain owns game state. Every mutation will pass through one authenticated,
idempotent, version-checked command service and one deterministic game engine.
