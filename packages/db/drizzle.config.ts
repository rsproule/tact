import { defineConfig } from "drizzle-kit";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";

if (!process.env.DATABASE_URL_UNPOOLED) {
  try {
    loadEnvFile(fileURLToPath(new URL("../../.env.local", import.meta.url)));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    // Generation is offline. Migrations must receive the direct Neon URL.
    url:
      process.env.DATABASE_URL_UNPOOLED ??
      "postgresql://missing:missing@localhost:5432/tact",
  },
  strict: true,
  verbose: true,
});
