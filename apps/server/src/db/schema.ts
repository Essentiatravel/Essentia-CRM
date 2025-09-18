// Replit Auth integration - PostgreSQL schema with authentication tables
import { pgTable, text, integer, real, timestamp, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Session storage table - mandatory for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - mandatory for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Tabela de Passeios
export const passeios = pgTable("passeios", {
  id: varchar("id").primaryKey(),
  nome: varchar("nome").notNull(),
  descricao: text("descricao").notNull(),
  preco: real("preco").notNull(),
  duracao: varchar("duracao").notNull(),
  categoria: varchar("categoria").notNull(),
  imagens: jsonb("imagens"), // JSON array of image URLs
  inclusoes: jsonb("inclusoes"), // JSON array of inclusions
  idiomas: jsonb("idiomas"), // JSON array of languages
  capacidadeMaxima: integer("capacidade_maxima").default(20),
  ativo: integer("ativo").default(1),
  criadoEm: timestamp("criado_em").defaultNow(),
  atualizadoEm: timestamp("atualizado_em").defaultNow(),
});

// Tabela de Clientes
export const clientes = pgTable("clientes", {
  id: varchar("id").primaryKey(),
  nome: varchar("nome").notNull(),
  email: varchar("email").notNull().unique(),
  telefone: varchar("telefone"),
  cpf: varchar("cpf"),
  dataNascimento: varchar("data_nascimento"),
  endereco: jsonb("endereco"), // JSON object with address details
  preferencias: jsonb("preferencias"), // JSON array of preferences
  observacoes: text("observacoes"),
  status: varchar("status").default("ativo"), // ativo, inativo, bloqueado
  criadoEm: timestamp("criado_em").defaultNow(),
  atualizadoEm: timestamp("atualizado_em").defaultNow(),
});

// Tabela de Guias
export const guias = pgTable("guias", {
  id: varchar("id").primaryKey(),
  nome: varchar("nome").notNull(),
  email: varchar("email").notNull().unique(),
  telefone: varchar("telefone"),
  cpf: varchar("cpf"),
  especialidades: jsonb("especialidades"), // JSON array
  idiomas: jsonb("idiomas"), // JSON array
  avaliacaoMedia: real("avaliacao_media").default(0),
  totalAvaliacoes: integer("total_avaliacoes").default(0),
  passeiosRealizados: integer("passeios_realizados").default(0),
  comissaoTotal: real("comissao_total").default(0),
  percentualComissao: real("percentual_comissao").default(30), // %
  biografia: text("biografia"),
  foto: varchar("foto"), // URL da foto
  status: varchar("status").default("ativo"), // ativo, inativo, pendente
  dataRegistro: timestamp("data_registro").defaultNow(),
  criadoEm: timestamp("criado_em").defaultNow(),
  atualizadoEm: timestamp("atualizado_em").defaultNow(),
});

// Tabela de Agendamentos/Tarefas
export const agendamentos = pgTable("agendamentos", {
  id: varchar("id").primaryKey(),
  passeioId: varchar("passeio_id").notNull().references(() => passeios.id),
  clienteId: varchar("cliente_id").notNull().references(() => clientes.id),
  guiaId: varchar("guia_id").references(() => guias.id),
  dataPasseio: varchar("data_passeio").notNull(),
  horarioInicio: varchar("horario_inicio"),
  horarioFim: varchar("horario_fim"),
  numeroPessoas: integer("numero_pessoas").notNull().default(1),
  valorTotal: real("valor_total").notNull(),
  valorComissao: real("valor_comissao").default(0),
  percentualComissao: real("percentual_comissao").default(30),
  status: varchar("status").notNull().default("em_progresso"), 
  // em_progresso, pendente_cliente, confirmadas, concluidas, canceladas
  observacoes: text("observacoes"),
  motivoCancelamento: text("motivo_cancelamento"),
  avaliacaoCliente: integer("avaliacao_cliente"), // 1-5
  comentarioCliente: text("comentario_cliente"),
  criadoEm: timestamp("criado_em").defaultNow(),
  atualizadoEm: timestamp("atualizado_em").defaultNow(),
});

// Tabela de Transações Financeiras
export const transacoes = pgTable("transacoes", {
  id: varchar("id").primaryKey(),
  agendamentoId: varchar("agendamento_id").notNull().references(() => agendamentos.id),
  tipo: varchar("tipo").notNull(), // receita, comissao, reembolso
  valor: real("valor").notNull(),
  status: varchar("status").notNull().default("pendente"), // pendente, pago, cancelado
  metodoPagamento: varchar("metodo_pagamento"),
  dataVencimento: varchar("data_vencimento"),
  dataPagamento: varchar("data_pagamento"),
  observacoes: text("observacoes"),
  criadoEm: timestamp("criado_em").defaultNow(),
  atualizadoEm: timestamp("atualizado_em").defaultNow(),
});

// Tabela de Avaliações
export const avaliacoes = pgTable("avaliacoes", {
  id: varchar("id").primaryKey(),
  agendamentoId: varchar("agendamento_id").notNull().references(() => agendamentos.id),
  clienteId: varchar("cliente_id").notNull().references(() => clientes.id),
  guiaId: varchar("guia_id").notNull().references(() => guias.id),
  passeioId: varchar("passeio_id").notNull().references(() => passeios.id),
  nota: integer("nota").notNull(), // 1-5
  comentario: text("comentario"),
  aspectos: jsonb("aspectos"), // JSON object with detailed ratings
  recomenda: integer("recomenda").default(1),
  criadoEm: timestamp("criado_em").defaultNow(),
});

// Types para TypeScript
export type Passeio = typeof passeios.$inferSelect;
export type NovoPasseio = typeof passeios.$inferInsert;

export type Cliente = typeof clientes.$inferSelect;
export type NovoCliente = typeof clientes.$inferInsert;

export type Guia = typeof guias.$inferSelect;
export type NovoGuia = typeof guias.$inferInsert;

export type Agendamento = typeof agendamentos.$inferSelect;
export type NovoAgendamento = typeof agendamentos.$inferInsert;

export type Transacao = typeof transacoes.$inferSelect;
export type NovaTransacao = typeof transacoes.$inferInsert;

export type Avaliacao = typeof avaliacoes.$inferSelect;
export type NovaAvaliacao = typeof avaliacoes.$inferInsert;