import { pgTable, text, timestamp, varchar, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Tabela de usuários - compatível com Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  nome: varchar("nome").notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  userType: varchar("user_type").notNull().default("cliente"), // admin, guia, cliente
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  telefone: varchar('telefone'),
  endereco: text('endereco'),
  data_nascimento: timestamp('data_nascimento'),
  cpf: varchar('cpf'),
  password_hash: text('password_hash')
});

// Tabela de sessões - necessária para Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: text("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;