# Legacy game mechanics

This is the migration specification for the original Tact game. Source priority is:

1. deployed-style V2 Solidity plus Foundry tests;
2. observed beta event logs and Rust bot behavior;
3. the human UI;
4. README prose;
5. the incomplete 2025 database prototype.

That order matters: the prose is stale in several balance-critical places.

## Game identity

Tact is a continuous-time, last-tank-standing strategy and diplomacy game. It is not turn based.
Living tanks asynchronously accumulate and spend action points (AP). Dead tanks enter a second
mode of play: they stop accruing AP but vote as a cursing jury. Players can revive one another,
sacrifice themselves, delegate control, and form enforceable commitments.

The important state is spread across `contracts/src/interfaces/ITankGame.sol` and
`contracts/src/base/TankGameV2Storage.sol`: game status/settings, tank owner/hearts/AP/range,
positions and board resources, delegates, votes, drip epochs, hook contracts, dead history,
alive count/ID sum, podium, prize pool, and reveal schedule.

## Board

V2 uses cubic hex coordinates. Its on-chain representation is non-negative and lies on
`x + y + z = 3 * radius`, centered on `(radius, radius, radius)`. A radius `r` board has
`3r(r+1)+1` tiles. vNext normalizes the same geometry to signed `q + r + s = 0` coordinates
centered on the origin.

Relevant implementation: `contracts/src/base/HexBoard.sol`.

## Lifecycle

1. Initialize a lobby with exact player capacity, board radius, starting AP/hearts/range, epoch
   duration, minimum buy-in, reveal cadence, optional autostart, and optional Merkle allowlist.
2. Joiners pay at least the minimum, receive a sequential 1-based tank ID, and are placed on a
   random empty tile.
3. A full lobby starts publicly or automatically. V2 has no turn order once active.
4. Living tanks act at any time; dead tanks vote.
5. A death that leaves one living tank immediately ends the game.
6. The survivor is first; the last and penultimate deaths are second and third. Podium players
   separately claim 60%, 30%, and 10% of the tracked prize pool.

Implementation: `TankGameV2.sol` `initialize`, `join`, `start`, `_handleDeath`, and `claim`.

## Executed actions

| Action | Actual V2 behavior |
|---|---|
| Move | Jump to any valid unoccupied destination. Cost is one AP per hex of distance. Intermediate occupancy does not matter. All hearts on the destination are collected. |
| Shoot | Choose a target in range and a positive/batched `shots` count. Each shot spends one AP and removes one heart. Overkill is rejected. A kill transfers floor 20% of the victim's remaining AP to the attacker. |
| Give | Transfer arbitrary hearts and/or AP to a tank in the giver's range. Giving the last heart is self-sacrifice. Giving a heart to a dead tank revives it and resets AP accrual. |
| Upgrade | Spend `6 * currentRange - 6`, then add one range. From range 3 the costs are 12, 18, 24, 30… |
| Drip | One AP per elapsed absolute epoch, batch claimable. Anyone may trigger a living tank's drip; ownership is not required. Dead tanks cannot drip. |
| Curse vote | Each dead tank votes once per epoch against a living tank. A strict majority closes the epoch vote. If the target has more than one AP, remove one; otherwise delay its next drip by one epoch. |
| Reveal | Anyone can poke after a scheduled block. If the target blockhash is still available, spawn one heart on a random empty tile; otherwise skip the spawn and reschedule. |
| Delegate | An owner permanently authorizes another address to operate its tank. Delegates cannot delegate further. |
| Donate | Anyone adds ETH to the tracked prize pool. |
| Claim | After game end, podium tanks claim their configured share to the supplied recipient. |

Primary sources are `contracts/src/libraries/{Move,Shoot,Give,Join}.sol`,
`contracts/src/base/TankGameV2.sol`, and `contracts/test/TankGameV2.t.sol`.

Self-shooting is exercised deliberately in the delegation test, so it appears to be a supported
self-destruction tactic. Heart self-sacrifice is also intentional. Self-give is not well defined.

## Programmable trust

The core's hook system was the conceptual heart of the game, not incidental smart-contract
machinery.

- Non-aggression: two tanks reciprocally accept an expiry epoch. A pre-shoot hook prevents
  either party from shooting the other until expiry.
- Bounty: a tank escrows ETH against a target. Other tanks accept the hook; killing that target
  credits the hunter for later withdrawal.
- Delegation: separates ownership from operation, enabling humans, bots, or coalitions to act
  through another identity.

Sources: `contracts/src/hooks/NonAggression.sol`, `contracts/src/hooks/Bounty.sol`, and their
Foundry tests. vNext should implement these as audited domain modules and scoped grants, not as
arbitrary code callbacks running inside a database transaction.

## Human and bot behavior

The original UI reconstructed games from factory logs and used a connected wallet for every
mutation. Players selected board tiles for moves, attacks, gifts, upgrades, AP claims, and curse
votes. The event stream was the public narrative: it showed attacks, resource transfers, deaths,
revivals, votes, delegation, donations, and rewards.

The Rust bot provides a second behavioral specification:

- `attack`: close distance, then spend enough shots to kill;
- `medic`: approach tanks and transfer hearts or AP;
- `hoard`: upgrade until an enemy is in range;
- `sentinel`: attack every living tank in range;
- `idle`: claim/poke but take no strategic action.

Dead bots vote; every strategy attempts AP drip and heart reveal. See `bot/src/main.rs`.

The beta logs under `content/` prove revival, AP gifting, delayed batch claims, curses, and
coordinated attacks were used in real matches. Beta 1 ended with a 10.1 ETH pool and a 60%
winner claim; beta 3 contains back-to-back late-game revivals and gifts.

## Conflicting specifications

| Mechanic | Prose/UI | Contract actually executed | 2025 database prototype |
|---|---|---|---|
| Movement | Adjacent, 1 AP | Any distance, linear AP | Any distance, linear AP |
| Shooting | One shot | Batched shots | One shot |
| Upgrade | New perimeter plus 10% | Current perimeter minus six | `floor(new perimeter * 1.1)` |
| Curse | Take/block AP | Remove one if AP > 1, else delay drip | Missing |
| Heart cadence | Daily/periodic | Configurable block delay | Missing |
| Board size | Radius | Radius | `floor(boardSize / 2)` |
| Start | Exact configured population | Exact population | Minimum-player threshold |
| Victory | Podium + 60/30/10 claims | Podium + claims | Last survivor record only |

These are product decisions, not safe mechanical migrations. `packages/game-engine` currently
captures a tested `legacy-v2` compatibility profile while rejecting obvious corrupt inputs such
as zero-value gifts and malformed cube coordinates.

## Defects to leave behind

The V2 contract has serious correctness/security defects:

- the board's `setTile` is publicly callable;
- `initialize` has no one-time guard;
- `start` can be called repeatedly and lacks a state guard;
- `join` does not require lobby state and trusts a supplied joiner unrelated to the caller;
- join ETH is not added to the tracked prize pool;
- zero-value and AP-only gifts to dead tanks corrupt alive accounting;
- revived tanks remain in duplicate-prone dead history used for voting/podium calculations;
- two-player games strand the third-place share;
- board capacity is not checked and random empty-tile search can loop forever;
- bounty cancellation/withdrawal lacks safe caller/state handling.

The off-chain prototype is also unsafe as an authority:

- action routes trust caller-supplied actor IDs;
- session middleware refreshes authentication but does not authorize actions;
- multi-row changes have no transaction, locking, idempotency, or version check;
- concurrent players can overspend, collide, double-kill, or create conflicting winners;
- random join does not exclude occupied positions;
- dead actors are not consistently rejected;
- negative transfers are accepted by validation;
- heart spawning/collection, jury play, delegation, diplomacy, bounties, podiums, and full revival
  bookkeeping are missing.

The rewrite preserves strategies and social mechanics, not these implementation accidents.

## vNext migration rules

- Freeze every game to an explicit ruleset version.
- Normalize coordinates once at the API boundary.
- Authenticate the principal; never accept an actor ID as proof of authority.
- Make every command idempotent and atomically version-checked.
- Treat death/revival history as state transitions, not an append-only array used as current truth.
- Keep payments in a separate receipt/entitlement ledger.
- Emit complete public events for replay and agent reasoning.
- Give the human UI and agent/MCP clients the same legal-action projection and command surface.
