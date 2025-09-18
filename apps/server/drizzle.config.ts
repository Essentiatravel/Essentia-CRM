import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_6g7ELJivyZMF@ep-morning-butterfly-ael3z2dl.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require",
  },
  verbose: true,
  strict: true,
});
