# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tact is an onchain strategy game built on Ethereum that demonstrates programmable trust and credible commitments. The project has been refactored into a monorepo structure with:

- **Smart Contracts** (Solidity/Foundry): Core game logic, hooks system, and factory patterns
- **Frontend Apps**: Separate blockchain and database-backed versions with identical UIs
- **Shared Packages**: Reusable components, game logic, and provider abstractions
- **Bot** (Rust): Automated players for testing and gameplay
- **Server** (TypeScript/Bun): API server for game data and events

## Monorepo Structure

### Apps (`/apps`)
- **`blockchain-app/`**: Next.js app using wagmi for blockchain interaction
- **`database-app/`**: Next.js app using database with server actions

### Packages (`/packages`)
- **`game-logic/`**: Core game rules, types, and validation logic
- **`providers/`**: Abstraction layer for blockchain and database providers
- **`shared-ui/`**: Reusable React components (HexGameBoard, Tile, actions)
- **`utils/`**: Shared utilities (formatting, validation, constants)

### Legacy Structure
- **`frontend/`**: Original Next.js app (to be migrated)
- **`contracts/`**: Smart contracts and deployment scripts
- **`bot/`**: Rust-based automated players
- **`server/`**: Express API server

## Architecture

### Abstraction Layer
The project uses a provider pattern to abstract blockchain vs database interactions:

- **`ITactProvider`**: Unified interface for all game operations
- **`BlockchainProvider`**: Wraps wagmi hooks for blockchain interaction
- **`DatabaseProvider`**: Uses server actions for database operations
- **Unified React Hooks**: Work with both providers transparently

### Game Logic Package
Centralized game rules and validation that work across all implementations:
- Hex grid utilities and distance calculations
- Game rule validation (move, shoot, upgrade, give)
- Game state management utilities
- Type definitions shared across all apps

### Shared UI Components
Reusable React components that work with both providers:
- `HexGameBoard`: Main game board with hex grid
- `Tile`: Individual hex tiles with context menus
- Action components: Move, shoot, upgrade, give menus

## Development Commands

### Monorepo Management
```bash
# Install all dependencies
bun install

# Build all packages and apps
bun run build

# Run all apps in development mode
bun run dev

# Run tests across all packages
bun run test

# Type check all packages
bun run type-check

# Lint all packages
bun run lint

# Clean all build outputs
bun run clean
```

### Smart Contracts
```bash
cd contracts
make build           # Compile contracts with Forge
make chain           # Start local Anvil chain
make deploy-anvil    # Deploy to local chain
make lint            # Run Solhint
make format          # Format Solidity code
forge test           # Run contract tests
```

### Frontend Apps
```bash
cd apps/blockchain-app
npm run dev          # Start blockchain app
npm run build        # Build for production
npm run lint         # Run ESLint

cd apps/database-app
npm run dev          # Start database app
npm run build        # Build for production
```

### Packages
```bash
# Build individual packages
cd packages/game-logic && bun run build
cd packages/providers && bun run build
cd packages/shared-ui && bun run build
cd packages/utils && bun run build

# Watch mode for development
cd packages/game-logic && bun run dev
```

### Bot Testing
```bash
cd bot
cargo build          # Build Rust bot
make run-test-fleet  # Run test fleet
make kill-fleet      # Stop all bot processes
```

### Server
```bash
cd server
bun run start        # Start API server
bun run test         # Run integration tests
```

### Integration Testing
```bash
./integ-test.sh      # Full integration test (chain + deploy + bots)
```

## Key Development Patterns

### Provider Pattern
Both apps use the same interface but different backends:
```typescript
// Unified usage in components
const { provider } = useTactProvider();
const { data: tanks } = useAllTanks(gameId, { watch: true });
const { movePlayer } = useMovePlayer();
```

### Shared Components
UI components work with any provider:
```typescript
import { HexGameBoard } from '@tact/shared-ui';
// Works with both blockchain and database providers
<HexGameBoard gameId={gameId} boardSize={boardSize} />
```

### Game Rules
Centralized validation logic:
```typescript
import { GameRules, HexUtils } from '@tact/game-logic';
const canMove = GameRules.canMove(tank, targetPosition, boardSize, occupiedPositions);
```

### Hook System (Smart Contracts)
Games use a modular hook system for extending functionality:
- Hooks implement `IHooks` interface
- Factory pattern for deploying hook instances
- Examples: Bounty system, Non-aggression pacts

## Migration Strategy

The project supports both blockchain and database backends:

1. **Blockchain Version**: Uses wagmi, connects to Ethereum, requires wallet
2. **Database Version**: Uses server actions, instant gameplay, no blockchain dependencies

Both versions share:
- Identical UI components and game experience
- Same game rules and validation logic
- Compatible data structures and types

## Testing Strategy

- **Unit Tests**: Foundry tests for smart contracts, package-level tests
- **Integration Tests**: Full stack testing with `integ-test.sh`
- **Bot Testing**: Automated gameplay scenarios with Rust bots
- **E2E Tests**: Cross-app compatibility testing

## Package Dependencies

```
apps/blockchain-app -> @tact/shared-ui, @tact/providers, @tact/game-logic, @tact/utils
apps/database-app   -> @tact/shared-ui, @tact/providers, @tact/game-logic, @tact/utils
@tact/shared-ui     -> @tact/providers, @tact/game-logic
@tact/providers     -> @tact/game-logic
@tact/utils         -> (no internal dependencies)
@tact/game-logic    -> (no internal dependencies)
```

This architecture enables rapid prototyping with the database version while maintaining full blockchain compatibility.