import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Configure connection pool with proper limits
const client = postgres(process.env.DATABASE_URL, {
  max: 10, // Reduced for Supabase free tier limits
  idle_timeout: 20, // Close connections after 20 seconds of inactivity
  max_lifetime: 60 * 30, // Close connections after 30 minutes
  connection: {
    application_name: 'tact-database-app',
  },
  onnotice: (notice) => {
    console.log('Database notice:', notice);
  },
  debug: process.env.NODE_ENV === 'development',
});

// Singleton pattern for Next.js hot reloading
declare global {
  var __db: ReturnType<typeof drizzle<typeof schema>> | undefined;
}

let db: ReturnType<typeof drizzle<typeof schema>>;

if (process.env.NODE_ENV === 'production') {
  db = drizzle(client, { schema });
} else {
  if (!global.__db) {
    global.__db = drizzle(client, { schema });
  }
  db = global.__db;
}

export { db };