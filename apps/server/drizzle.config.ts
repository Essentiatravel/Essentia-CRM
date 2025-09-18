import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || process.env.REPLIT_DB_URL || "postgresql://localhost:5432/turguide",
  },
  verbose: true,
  strict: true,
});
