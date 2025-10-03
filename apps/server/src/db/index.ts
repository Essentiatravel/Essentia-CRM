// Replit Auth integration - PostgreSQL database configuration
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const connectionString = process.env.SUPABASE_DB_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "SUPABASE_DB_URL (or DATABASE_URL) must be set. Did you forget to provide your Supabase Postgres connection string?",
  );
}

const client = postgres(connectionString, {
  ssl: "require",
  max: 10,
});

export const db = drizzle(client, { schema });

