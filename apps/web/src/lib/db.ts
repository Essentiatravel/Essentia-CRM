// Database connection for web app
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import { users, sessions } from '../../../server/src/db/schema';

neonConfig.webSocketConstructor = ws;

// Use environment variable or fallback to Neon database
const databaseUrl = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL || "postgresql://neondb_owner:npg_6g7ELJivyZMF@ep-morning-butterfly-ael3z2dl.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require";

if (!databaseUrl) {
  console.warn("DATABASE_URL not found, using fallback connection");
}

const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle({ client: pool, schema: { users, sessions } });