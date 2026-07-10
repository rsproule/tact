import { defineConfig } from "drizzle-kit";

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
