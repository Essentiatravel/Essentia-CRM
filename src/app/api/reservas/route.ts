import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { agendamentos, passeios } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { ensureClienteExiste } from '@/lib/customer-service';

import { pgTable, text, real, timestamp, varchar, jsonb } from "drizzle-orm/pg-core";

const reservas = pgTable("reservas", {
  id: varchar("id").primaryKey(),
  passeioId: varchar("passeio_id").notNull(),
  passeioNome: varchar("passeio_nome").notNull(),
  data: timestamp("data").notNull(),
  pessoas: real("pessoas").notNull(),
  tipoReserva: varchar("tipo_reserva").notNull(),
  valorTotal: real("valor_total").notNull(),
  status: varchar("status").default("confirmada"),
  clienteNome: varchar("cliente_nome").notNull(),
  clienteEmail: varchar("cliente_email").notNull(),
  clienteTelefone: varchar("cliente_telefone"),
  clienteObservacoes: text("cliente_observacoes"),
  metodoPagamento: varchar("metodo_pagamento").notNull(),
  criadoEm: timestamp("criado_em").defaultNow(),
  atualizadoEm: timestamp("atualizado_em").defaultNow(),
});

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.passeioId || !data.passeioNome || !data.data || !data.pessoas ||
        !data.valorTotal || !data.clienteNome || !data.clienteEmail || !data.metodoPagamento) {
      return NextResponse.json({ error: 'Dados obrigatórios em falta' }, { status: 400 });
    }

    // Usar clienteId do precheck se disponível para evitar duplicação
    let clienteId: string;
    let novoCliente: boolean;
    let senhaGerada: string | null;
    let clienteRegistro: any;

    if (data.preCadastroClienteId) {
      // Cliente já foi criado no precheck, apenas usar o ID
      clienteId = data.preCadastroClienteId;
      novoCliente = false; // Não é novo no contexto do pagamento
      senhaGerada = null;
      clienteRegistro = null;
      console.log('✅ Usando clienteId do precheck:', clienteId);
    } else {
      // Se não tem precheck, criar cliente normalmente
      const resultado = await ensureClienteExiste({
        nome: data.clienteNome,
        email: data.clienteEmail,
        telefone: data.clienteTelefone ?? null,
      });
      clienteId = resultado.clienteId;
      novoCliente = resultado.novoCliente;
      senhaGerada = resultado.senhaGerada;
      clienteRegistro = resultado.cliente;
    }

    const passeio = await db
      .select()
      .from(passeios)
      .where(eq(passeios.id, data.passeioId))
      .limit(1);

    if (passeio.length === 0) {
      return NextResponse.json({ error: 'Passeio não encontrado' }, { status: 404 });
    }

    const agendamentoId = randomUUID();
    const percentualComissao = 30;
    const valorComissao = data.valorTotal * (percentualComissao / 100);

    await db.insert(agendamentos).values({
      id: agendamentoId,
      passeioId: data.passeioId,
      clienteId,
      dataPasseio: new Date(data.data).toISOString().split('T')[0],
      numeroPessoas: data.pessoas,
      valorTotal: data.valorTotal,
      valorComissao,
      percentualComissao,
      status: 'confirmadas',
      observacoes: data.clienteObservacoes || null,
    });

    const reservaId = `reserva_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const novaReserva = await db.insert(reservas).values({
      id: reservaId,
      passeioId: data.passeioId,
      passeioNome: data.passeioNome,
      data: new Date(data.data),
      pessoas: data.pessoas,
      tipoReserva: data.tipoReserva || 'individual',
      valorTotal: data.valorTotal,
      clienteNome: data.clienteNome,
      clienteEmail: data.clienteEmail,
      clienteTelefone: data.clienteTelefone,
      clienteObservacoes: data.clienteObservacoes,
      metodoPagamento: data.metodoPagamento,
      status: 'confirmada',
    }).returning();

    return NextResponse.json({
      success: true,
      clienteId,
      agendamentoId,
      reservaId,
      reserva: novaReserva[0],
      senhaGerada,
      novoCliente,
      cliente: clienteRegistro,
    });

  } catch (error) {
    console.error('❌ Erro ao processar reserva completa:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const todasReservas = await db.select().from(reservas);
    return NextResponse.json(todasReservas);
  } catch (error) {
    console.error('Erro ao buscar reservas:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
