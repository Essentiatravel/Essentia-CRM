import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Tabela de Passeios
export const passeios = sqliteTable("passeios", {
  id: text("id").primaryKey(),
  nome: text("nome").notNull(),
  descricao: text("descricao").notNull(),
  preco: real("preco").notNull(),
  duracao: text("duracao").notNull(),
  categoria: text("categoria").notNull(),
  imagens: text("imagens"), // JSON array of image URLs
  inclusoes: text("inclusoes"), // JSON array of inclusions
  idiomas: text("idiomas"), // JSON array of languages
  capacidadeMaxima: integer("capacidade_maxima").default(20),
  ativo: integer("ativo", { mode: "boolean" }).default(true),
  criadoEm: text("criado_em").default(sql`CURRENT_TIMESTAMP`),
  atualizadoEm: text("atualizado_em").default(sql`CURRENT_TIMESTAMP`),
});

// Tabela de Clientes
export const clientes = sqliteTable("clientes", {
  id: text("id").primaryKey(),
  nome: text("nome").notNull(),
  email: text("email").notNull().unique(),
  telefone: text("telefone"),
  cpf: text("cpf"),
  dataNascimento: text("data_nascimento"),
  endereco: text("endereco"), // JSON object with address details
  preferencias: text("preferencias"), // JSON array of preferences
  observacoes: text("observacoes"),
  status: text("status").default("ativo"), // ativo, inativo, bloqueado
  criadoEm: text("criado_em").default(sql`CURRENT_TIMESTAMP`),
  atualizadoEm: text("atualizado_em").default(sql`CURRENT_TIMESTAMP`),
});

// Tabela de Guias
export const guias = sqliteTable("guias", {
  id: text("id").primaryKey(),
  nome: text("nome").notNull(),
  email: text("email").notNull().unique(),
  telefone: text("telefone"),
  cpf: text("cpf"),
  especialidades: text("especialidades"), // JSON array
  idiomas: text("idiomas"), // JSON array
  avaliacaoMedia: real("avaliacao_media").default(0),
  totalAvaliacoes: integer("total_avaliacoes").default(0),
  passeiosRealizados: integer("passeios_realizados").default(0),
  comissaoTotal: real("comissao_total").default(0),
  percentualComissao: real("percentual_comissao").default(30), // %
  biografia: text("biografia"),
  foto: text("foto"), // URL da foto
  status: text("status").default("ativo"), // ativo, inativo, pendente
  dataRegistro: text("data_registro").default(sql`CURRENT_TIMESTAMP`),
  criadoEm: text("criado_em").default(sql`CURRENT_TIMESTAMP`),
  atualizadoEm: text("atualizado_em").default(sql`CURRENT_TIMESTAMP`),
});

// Tabela de Agendamentos/Tarefas
export const agendamentos = sqliteTable("agendamentos", {
  id: text("id").primaryKey(),
  passeioId: text("passeio_id").notNull().references(() => passeios.id),
  clienteId: text("cliente_id").notNull().references(() => clientes.id),
  guiaId: text("guia_id").references(() => guias.id),
  dataPasseio: text("data_passeio").notNull(),
  horarioInicio: text("horario_inicio"),
  horarioFim: text("horario_fim"),
  numeroPessoas: integer("numero_pessoas").notNull().default(1),
  valorTotal: real("valor_total").notNull(),
  valorComissao: real("valor_comissao").default(0),
  percentualComissao: real("percentual_comissao").default(30),
  status: text("status").notNull().default("em_progresso"), 
  // em_progresso, pendente_cliente, confirmadas, concluidas, canceladas
  observacoes: text("observacoes"),
  motivoCancelamento: text("motivo_cancelamento"),
  avaliacaoCliente: integer("avaliacao_cliente"), // 1-5
  comentarioCliente: text("comentario_cliente"),
  criadoEm: text("criado_em").default(sql`CURRENT_TIMESTAMP`),
  atualizadoEm: text("atualizado_em").default(sql`CURRENT_TIMESTAMP`),
});

// Tabela de Transações Financeiras
export const transacoes = sqliteTable("transacoes", {
  id: text("id").primaryKey(),
  agendamentoId: text("agendamento_id").notNull().references(() => agendamentos.id),
  tipo: text("tipo").notNull(), // receita, comissao, reembolso
  valor: real("valor").notNull(),
  status: text("status").notNull().default("pendente"), // pendente, pago, cancelado
  metodoPagamento: text("metodo_pagamento"),
  dataVencimento: text("data_vencimento"),
  dataPagamento: text("data_pagamento"),
  observacoes: text("observacoes"),
  criadoEm: text("criado_em").default(sql`CURRENT_TIMESTAMP`),
  atualizadoEm: text("atualizado_em").default(sql`CURRENT_TIMESTAMP`),
});

// Tabela de Avaliações
export const avaliacoes = sqliteTable("avaliacoes", {
  id: text("id").primaryKey(),
  agendamentoId: text("agendamento_id").notNull().references(() => agendamentos.id),
  clienteId: text("cliente_id").notNull().references(() => clientes.id),
  guiaId: text("guia_id").notNull().references(() => guias.id),
  passeioId: text("passeio_id").notNull().references(() => passeios.id),
  nota: integer("nota").notNull(), // 1-5
  comentario: text("comentario"),
  aspectos: text("aspectos"), // JSON object with detailed ratings
  recomenda: integer("recomenda", { mode: "boolean" }).default(true),
  criadoEm: text("criado_em").default(sql`CURRENT_TIMESTAMP`),
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