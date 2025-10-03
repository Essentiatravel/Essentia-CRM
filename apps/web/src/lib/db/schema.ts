import {
  pgTable,
  text,
  timestamp,
  varchar,
  index,
  integer,
  real,
  jsonb,
} from "drizzle-orm/pg-core";
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

// --------- CRM domain tables (shared between apps) ---------

export const passeios = pgTable("passeios", {
  id: varchar("id").primaryKey(),
  nome: varchar("nome").notNull(),
  descricao: text("descricao").notNull(),
  preco: real("preco").notNull(),
  duracao: varchar("duracao").notNull(),
  categoria: varchar("categoria").notNull(),
  imagens: jsonb("imagens"),
  inclusoes: jsonb("inclusoes"),
  idiomas: jsonb("idiomas"),
  capacidadeMaxima: integer("capacidade_maxima").default(20),
  ativo: integer("ativo").default(1),
  criadoEm: timestamp("criado_em").defaultNow(),
  atualizadoEm: timestamp("atualizado_em").defaultNow(),
});

export const clientes = pgTable("clientes", {
  id: varchar("id").primaryKey(),
  nome: varchar("nome").notNull(),
  email: varchar("email").notNull().unique(),
  telefone: varchar("telefone"),
  cpf: varchar("cpf"),
  dataNascimento: varchar("data_nascimento"),
  endereco: jsonb("endereco"),
  preferencias: jsonb("preferencias"),
  observacoes: text("observacoes"),
  status: varchar("status").default("ativo"),
  // Senha é gerenciada pelo Supabase Auth, não armazenada aqui
  criadoEm: timestamp("criado_em").defaultNow(),
  atualizadoEm: timestamp("atualizado_em").defaultNow(),
});

export const guias = pgTable("guias", {
  id: varchar("id").primaryKey(),
  nome: varchar("nome").notNull(),
  email: varchar("email").notNull().unique(),
  telefone: varchar("telefone"),
  cpf: varchar("cpf"),
  especialidades: jsonb("especialidades"),
  idiomas: jsonb("idiomas"),
  avaliacaoMedia: real("avaliacao_media").default(0),
  totalAvaliacoes: integer("total_avaliacoes").default(0),
  passeiosRealizados: integer("passeios_realizados").default(0),
  comissaoTotal: real("comissao_total").default(0),
  percentualComissao: real("percentual_comissao").default(30),
  biografia: text("biografia"),
  foto: varchar("foto"),
  status: varchar("status").default("ativo"),
  dataRegistro: timestamp("data_registro").defaultNow(),
  criadoEm: timestamp("criado_em").defaultNow(),
  atualizadoEm: timestamp("atualizado_em").defaultNow(),
});

export const agendamentos = pgTable("agendamentos", {
  id: varchar("id").primaryKey(),
  passeioId: varchar("passeio_id").notNull(),
  clienteId: varchar("cliente_id"),
  guiaId: varchar("guia_id"),
  dataPasseio: varchar("data_passeio").notNull(),
  horarioInicio: varchar("horario_inicio"),
  horarioFim: varchar("horario_fim"),
  numeroPessoas: integer("numero_pessoas").notNull().default(1),
  valorTotal: real("valor_total").notNull(),
  valorComissao: real("valor_comissao").default(0),
  percentualComissao: real("percentual_comissao").default(30),
  status: varchar("status").notNull().default("em_progresso"),
  observacoes: text("observacoes"),
  motivoCancelamento: text("motivo_cancelamento"),
  avaliacaoCliente: integer("avaliacao_cliente"),
  comentarioCliente: text("comentario_cliente"),
  criadoEm: timestamp("criado_em").defaultNow(),
  atualizadoEm: timestamp("atualizado_em").defaultNow(),
});

export type Passeio = typeof passeios.$inferSelect;
export type Cliente = typeof clientes.$inferSelect;
export type Guia = typeof guias.$inferSelect;
export type Agendamento = typeof agendamentos.$inferSelect;
