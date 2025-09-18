// Database connection for web app
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import { users, sessions } from '../../../server/src/db/schema';

neonConfig.webSocketConstructor = ws;

const databaseUrl = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_6g7ELJivyZMF@ep-morning-butterfly-ael3z2dl.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require";

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle({ client: pool, schema: { users, sessions } });