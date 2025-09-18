// Database connection for PostgreSQL in Replit
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";

// Configuração para WebSocket no ambiente Neon
neonConfig.webSocketConstructor = ws;

// Verificar se a URL do banco está disponível
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a PostgreSQL database in Replit?",
  );
}

// Criar pool de conexões
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Configurar Drizzle ORM
export const db = drizzle({ client: pool });

// Schemas do banco
export * from './db/schema';