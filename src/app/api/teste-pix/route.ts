import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { agendamentos, passeios } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { ensureClienteExiste } from '@/lib/customer-service';
import { pgTable, text, real, timestamp, varchar } from "drizzle-orm/pg-core";

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

    console.log('🔍 Dados recebidos para pagamento PIX:', data);

    if (!data.passeioId || !data.passeioNome || !data.data || !data.pessoas ||
        !data.valorTotal || !data.clienteNome || !data.clienteEmail || !data.metodoPagamento) {
      return NextResponse.json({ error: 'Dados obrigatórios em falta' }, { status: 400 });
    }

    // Usar clienteId do precheck se disponível
    let clienteId: string;
    let novoCliente: boolean;
    let senhaGerada: string | null;
    let clienteRegistro: any;

    if (data.preCadastroClienteId) {
      clienteId = data.preCadastroClienteId;
      novoCliente = false;
      senhaGerada = null;
      clienteRegistro = null;
      console.log('✅ Usando clienteId do precheck:', clienteId);
    } else {
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

    // Aplicar desconto PIX de 5%
    const valorFinal = data.valorTotal * 0.95;

    const agendamentoId = randomUUID();
    const percentualComissao = 30;
    const valorComissao = valorFinal * (percentualComissao / 100);

    await db.insert(agendamentos).values({
      id: agendamentoId,
      passeioId: data.passeioId,
      clienteId,
      dataPasseio: new Date(data.data).toISOString().split('T')[0],
      numeroPessoas: data.pessoas,
      valorTotal: valorFinal,
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
      valorTotal: valorFinal,
      clienteNome: data.clienteNome,
      clienteEmail: data.clienteEmail,
      clienteTelefone: data.clienteTelefone,
      clienteObservacoes: data.clienteObservacoes,
      metodoPagamento: 'pix',
      status: 'confirmada',
    }).returning();

    console.log('✅ Pagamento PIX processado com sucesso:', {
      clienteId,
      agendamentoId,
      reservaId,
      valorFinal
    });

    return NextResponse.json({
      success: true,
      clienteId,
      agendamentoId,
      reservaId,
      reserva: novaReserva[0],
      senhaGerada,
      novoCliente,
      cliente: clienteRegistro,
      metodoPagamento: 'pix',
      valorFinal
    });

  } catch (error) {
    console.error('❌ Erro no pagamento PIX:', error);
    return NextResponse.json({ error: 'Erro ao processar pagamento PIX' }, { status: 500 });
  }
}