# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tact is an onchain strategy game built on Ethereum that demonstrates programmable trust and credible commitments. The project consists of:

- **Smart Contracts** (Solidity/Foundry): Core game logic, hooks system, and factory patterns
- **Frontend** (Next.js/React): Web interface using wagmi for blockchain interaction
- **Bot** (Rust): Automated players for testing and gameplay
- **Server** (TypeScript/Bun): API server for game data and events

## Architecture

### Smart Contracts (`/contracts`)
- **TankGame**: Core game implementation with modular hook system
- **HexBoard**: Hexagonal board game mechanics
- **Factories**: TankGameFactory and HookFactory for creating game instances
- **Hooks**: Extensible game modification system (Bounty, NonAggression)
- **Libraries**: Move, Join, Shoot, Give actions as separate libraries

### Frontend (`/frontend`)
- Built with Next.js 13+ App Router
- Uses wagmi/viem for Ethereum integration
- Radix UI components with Tailwind CSS
- Real-time game state updates via blockchain events
- Hexagonal grid rendering with react-hexgrid

### Bot (`/bot`)
- Rust-based automated players using ethers-rs
- Supports fleet management for testing scenarios
- Configurable strategies and behaviors

## Development Commands

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

### Frontend
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
```

### Bot
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

### Game Hook System
Games use a modular hook system where external contracts can modify game behavior:
- Hooks implement `IHooks` interface
- Factory pattern for deploying hook instances
- Examples: Bounty system, Non-aggression pacts

### Blockchain Integration
- Frontend uses wagmi with code generation from `wagmi.config.ts`
- Deployments managed via `foundry.toml` and deployment scripts
- Multi-chain support (Foundry local, Goerli testnet)

### State Management
- Game state stored on-chain in `TankGameV2Storage`
- Frontend subscribes to blockchain events for real-time updates
- Hexagonal coordinate system for board positioning

## Testing Strategy

- **Unit Tests**: Foundry tests for smart contracts
- **Integration Tests**: Full stack testing with `integ-test.sh`
- **Bot Testing**: Automated gameplay scenarios with Rust bots
- **Frontend Testing**: React component testing (use existing patterns)

## Code Generation

- Run `npm run merkle` in contracts to generate merkle trees
- Frontend types auto-generated from contracts via wagmi CLI
- Ensure contract changes trigger frontend type updates