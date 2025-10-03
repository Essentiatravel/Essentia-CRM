'use server';

import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { db } from './db';
import {
  agendamentos,
  passeios,
  clientes,
  guias,
  type Agendamento,
  type Passeio,
} from './db/schema';

type AgendamentoInsert = typeof agendamentos.$inferInsert;

const VALID_STATUSES = new Set<Agendamento['status']>([
  'em_progresso',
  'pendente_cliente',
  'confirmadas',
  'concluidas',
  'canceladas',
]);

type AgendamentoRow = {
  agendamento: Agendamento;
  passeio: Passeio | null;
  cliente: typeof clientes.$inferSelect | null;
  guia: typeof guias.$inferSelect | null;
};

export type AgendamentoKanban = ReturnType<typeof mapRowToKanban>;

function mapRowToKanban(row: AgendamentoRow) {
  const { agendamento, passeio, cliente, guia } = row;

  return {
    id: agendamento.id,
    passeio_id: agendamento.passeioId,
    cliente_id: agendamento.clienteId,
    guia_id: agendamento.guiaId,
    data_passeio: agendamento.dataPasseio,
    numero_pessoas: agendamento.numeroPessoas ?? 1,
    valor_total: Number(agendamento.valorTotal ?? 0),
    valor_comissao: Number(agendamento.valorComissao ?? 0),
    percentual_comissao: agendamento.percentualComissao ?? 30,
    status: agendamento.status,
    observacoes: agendamento.observacoes,
    passeio_nome: passeio?.nome ?? null,
    cliente_nome: cliente?.nome ?? null,
    guia_nome: guia?.nome ?? null,
    criado_em: agendamento.criadoEm ?? null,
    atualizado_em: agendamento.atualizadoEm ?? null,
  };
}

export async function listAgendamentos() {
  const rows = await db
    .select({
      agendamento: agendamentos,
      passeio: passeios,
      cliente: clientes,
      guia: guias,
    })
    .from(agendamentos)
    .leftJoin(passeios, eq(agendamentos.passeioId, passeios.id))
    .leftJoin(clientes, eq(agendamentos.clienteId, clientes.id))
    .leftJoin(guias, eq(agendamentos.guiaId, guias.id));

  return rows.map(mapRowToKanban);
}

export async function getAgendamentoById(id: string) {
  const rows = await db
    .select({
      agendamento: agendamentos,
      passeio: passeios,
      cliente: clientes,
      guia: guias,
    })
    .from(agendamentos)
    .leftJoin(passeios, eq(agendamentos.passeioId, passeios.id))
    .leftJoin(clientes, eq(agendamentos.clienteId, clientes.id))
    .leftJoin(guias, eq(agendamentos.guiaId, guias.id))
    .where(eq(agendamentos.id, id));

  if (rows.length === 0) {
    return null;
  }

  return mapRowToKanban(rows[0]);
}

export interface CreateAgendamentoInput {
  passeioId: string;
  clienteId?: string | null;
  guiaId?: string | null;
  dataPasseio: string;
  numeroPessoas: number;
  observacoes?: string | null;
  percentualComissao?: number;
}

export async function createAgendamento(input: CreateAgendamentoInput) {
  const passeioRegistro = await db
    .select()
    .from(passeios)
    .where(eq(passeios.id, input.passeioId))
    .limit(1);

  if (passeioRegistro.length === 0) {
    throw new Error('Passeio informado não foi encontrado.');
  }

  const passeio = passeioRegistro[0];
  const numeroPessoas = Math.max(1, input.numeroPessoas || 1);
  const percentualComissao = input.percentualComissao ?? 30;
  const valorTotal = Number(passeio.preco) * numeroPessoas;
  const valorComissao = valorTotal * (percentualComissao / 100);

  const id = randomUUID();

  await db.insert(agendamentos).values({
    id,
    passeioId: input.passeioId,
    clienteId: input.clienteId ?? null,
    guiaId: input.guiaId ?? null,
    dataPasseio: input.dataPasseio,
    numeroPessoas,
    observacoes: input.observacoes ?? null,
    percentualComissao,
    valorTotal,
    valorComissao,
  });

  return getAgendamentoById(id);
}

export interface UpdateAgendamentoInput {
  passeioId?: string;
  clienteId?: string | null;
  guiaId?: string | null;
  dataPasseio?: string;
  numeroPessoas?: number;
  observacoes?: string | null;
  percentualComissao?: number;
  status?: Agendamento['status'];
}

export async function updateAgendamento(id: string, input: UpdateAgendamentoInput) {
  const registros = await db
    .select()
    .from(agendamentos)
    .where(eq(agendamentos.id, id))
    .limit(1);

  if (registros.length === 0) {
    return null;
  }

  const atual = registros[0];

  if (input.status && !VALID_STATUSES.has(input.status)) {
    throw new Error('Status inválido para agendamento.');
  }

  const updates: Partial<AgendamentoInsert> = {};

  if (input.passeioId !== undefined) {
    updates.passeioId = input.passeioId;
  }

  if (input.clienteId !== undefined) {
    updates.clienteId = input.clienteId ?? null;
  }

  if (input.guiaId !== undefined) {
    updates.guiaId = input.guiaId ?? null;
  }

  if (input.dataPasseio !== undefined) {
    updates.dataPasseio = input.dataPasseio;
  }

  if (input.observacoes !== undefined) {
    updates.observacoes = input.observacoes ?? null;
  }

  if (input.status !== undefined) {
    updates.status = input.status;
  }

  const deveRecalcularValores =
    input.passeioId !== undefined ||
    input.numeroPessoas !== undefined ||
    input.percentualComissao !== undefined;

  const numeroPessoas = Math.max(1, input.numeroPessoas ?? atual.numeroPessoas ?? 1);
  const percentualComissao = input.percentualComissao ?? atual.percentualComissao ?? 30;

  if (deveRecalcularValores) {
    const passeioIdParaUsar = input.passeioId ?? atual.passeioId;

    const passeioAtual = await db
      .select()
      .from(passeios)
      .where(eq(passeios.id, passeioIdParaUsar))
      .limit(1);

    if (passeioAtual.length === 0) {
      throw new Error('Passeio informado não foi encontrado.');
    }

    const valorTotal = Number(passeioAtual[0].preco) * numeroPessoas;
    updates.valorTotal = valorTotal;
    updates.valorComissao = valorTotal * (percentualComissao / 100);
    updates.percentualComissao = percentualComissao;
    updates.numeroPessoas = numeroPessoas;
  } else if (input.numeroPessoas !== undefined) {
    updates.numeroPessoas = numeroPessoas;
  }

  updates.atualizadoEm = new Date();

  await db.update(agendamentos).set(updates).where(eq(agendamentos.id, id));

  return getAgendamentoById(id);
}

export async function updateAgendamentoStatus(id: string, status: Agendamento['status']) {
  return updateAgendamento(id, { status });
}

export async function deleteAgendamento(id: string) {
  const resultado = await db
    .delete(agendamentos)
    .where(eq(agendamentos.id, id))
    .returning();

  return resultado.length > 0;
}
