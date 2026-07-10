import { Pool } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import { drizzle, type NeonDatabase } from "drizzle-orm/neon-serverless";

import * as schema from "./schema";

export class DatabaseConfigurationError extends Error {
  override name = "DatabaseConfigurationError";
}

let pool: Pool | undefined;
let database: NeonDatabase<typeof schema> | undefined;

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getDatabase(): NeonDatabase<typeof schema> {
  if (database) {
    return database;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new DatabaseConfigurationError(
      "DATABASE_URL is required for database-backed requests",
    );
  }

  pool = new Pool({ connectionString });
  database = drizzle({ client: pool, schema });
  return database;
}

export async function closeDatabase(): Promise<void> {
  await pool?.end();
  pool = undefined;
  database = undefined;
}

export async function pingDatabase(): Promise<void> {
  await getDatabase().execute(sql`select 1 as ok`);
}
