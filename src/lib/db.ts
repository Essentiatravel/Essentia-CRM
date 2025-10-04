import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const connectionString = process.env.SUPABASE_DB_URL ?? process.env.DATABASE_URL;

console.log('🔑 Variável SUPABASE_DB_URL:', process.env.SUPABASE_DB_URL ? 'Definida' : 'Não definida');
console.log('🔑 Variável DATABASE_URL:', process.env.DATABASE_URL ? 'Definida' : 'Não definida');
console.log('🔗 Connection string:', connectionString ? 'Configurada' : 'Não configurada');

if (!connectionString) {
  throw new Error(
    "SUPABASE_DB_URL (or DATABASE_URL) must be set. Provide your Supabase Postgres connection string to connect to the database.",
  );
}

const client = postgres(connectionString, {
  ssl: "require",
  max: 5,
});

export const db = drizzle(client);

export * from "./db/schema";