import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.SUPABASE_DB_URL ||
      process.env.DATABASE_URL ||
      "postgresql://localhost:5432/turguide",
    ssl: { rejectUnauthorized: false },
  },
  verbose: true,
  strict: true,
});
