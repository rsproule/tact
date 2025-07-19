import { sql } from 'drizzle-orm';
import { pgTable, text, integer, timestamp, boolean, json } from 'drizzle-orm/pg-core';

// Games table
export const games = pgTable('games', {
  id: text('id').primaryKey(),
  address: text('address').notNull(), // For compatibility with blockchain version
  state: integer('state').notNull().default(0), // 0: waiting, 1: started, 2: ended
  owner: text('owner').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  epochStart: timestamp('epoch_start'),
  
  // Game settings
  playerCount: integer('player_count').notNull(),
  boardSize: integer('board_size').notNull(),
  epochSeconds: integer('epoch_seconds').notNull(),
  revealWaitBlocks: integer('reveal_wait_blocks').notNull(),
  initHearts: integer('init_hearts').notNull(),
  initAps: integer('init_aps').notNull(),
  initRange: integer('init_range').notNull(),
  entryCost: text('entry_cost').notNull().default('0'),
  minPlayers: integer('min_players').notNull(),
  maxPlayers: integer('max_players').notNull(),
  epochMaxActionPoints: integer('epoch_max_action_points').notNull(),
  
  // Game state
  playersCount: integer('players_count').notNull().default(0),
  prizePool: text('prize_pool').notNull().default('0'),
  lastHeartSpawn: integer('last_heart_spawn').notNull().default(0),
});

// Players table
export const players = pgTable('players', {
  id: text('id').primaryKey(),
  gameId: text('game_id').notNull().references(() => games.id),
  address: text('address').notNull(),
  name: text('name').notNull(),
  tankId: text('tank_id').notNull(),
  isAlive: boolean('is_alive').notNull().default(true),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
});

// Tanks table
export const tanks = pgTable('tanks', {
  id: text('id').primaryKey(),
  gameId: text('game_id').notNull().references(() => games.id),
  tankId: text('tank_id').notNull(),
  owner: text('owner').notNull(),
  hearts: integer('hearts').notNull(),
  aps: integer('aps').notNull(),
  range: integer('range').notNull(),
  positionQ: integer('position_q').notNull(),
  positionR: integer('position_r').notNull(),
  positionS: integer('position_s').notNull(),
  playerName: text('player_name'),
  lastDripEpoch: integer('last_drip_epoch').notNull().default(0),
});

// Hearts table
export const hearts = pgTable('hearts', {
  id: text('id').primaryKey(),
  gameId: text('game_id').notNull().references(() => games.id),
  positionQ: integer('position_q').notNull(),
  positionR: integer('position_r').notNull(),
  positionS: integer('position_s').notNull(),
  active: boolean('active').notNull().default(true),
  spawnedAt: timestamp('spawned_at').notNull().defaultNow(),
});

// Game events table
export const gameEvents = pgTable('game_events', {
  id: text('id').primaryKey(),
  gameId: text('game_id').notNull().references(() => games.id),
  type: text('type').notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  blockNumber: integer('block_number'),
  transactionHash: text('transaction_hash'),
  player: text('player'),
  data: json('data'),
});

// Hooks table
export const hooks = pgTable('hooks', {
  id: text('id').primaryKey(),
  gameId: text('game_id').notNull().references(() => games.id),
  type: text('type').notNull(), // 'bounty', 'non-aggression', 'custom'
  creator: text('creator').notNull(),
  target: text('target'),
  parameters: json('parameters'),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Treaties table
export const treaties = pgTable('treaties', {
  id: text('id').primaryKey(),
  gameId: text('game_id').notNull().references(() => games.id),
  type: text('type').notNull(), // 'non-aggression'
  parties: json('parties').notNull(), // array of player addresses
  duration: integer('duration').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
  active: boolean('active').notNull().default(true),
});

// Bounties table
export const bounties = pgTable('bounties', {
  id: text('id').primaryKey(),
  gameId: text('game_id').notNull().references(() => games.id),
  creator: text('creator').notNull(),
  target: text('target').notNull(),
  reward: text('reward').notNull(),
  claimed: boolean('claimed').notNull().default(false),
  claimedBy: text('claimed_by'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Type exports
export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
export type Player = typeof players.$inferSelect;
export type NewPlayer = typeof players.$inferInsert;
export type Tank = typeof tanks.$inferSelect;
export type NewTank = typeof tanks.$inferInsert;
export type Heart = typeof hearts.$inferSelect;
export type NewHeart = typeof hearts.$inferInsert;
export type GameEvent = typeof gameEvents.$inferSelect;
export type NewGameEvent = typeof gameEvents.$inferInsert;
export type Hook = typeof hooks.$inferSelect;
export type NewHook = typeof hooks.$inferInsert;
export type Treaty = typeof treaties.$inferSelect;
export type NewTreaty = typeof treaties.$inferInsert;
export type Bounty = typeof bounties.$inferSelect;
export type NewBounty = typeof bounties.$inferInsert;