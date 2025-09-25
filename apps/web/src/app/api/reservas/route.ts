import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Schema inline para evitar problemas de import
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
    
    // Validar dados obrigatórios
    if (!data.passeioId || !data.passeioNome || !data.data || !data.pessoas || 
        !data.valorTotal || !data.clienteNome || !data.clienteEmail || !data.metodoPagamento) {
      return NextResponse.json({ error: 'Dados obrigatórios em falta' }, { status: 400 });
    }

    // Gerar ID único para a reserva
    const reservaId = `reserva_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Inserir reserva no banco
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
      status: 'confirmada'
    }).returning();

    return NextResponse.json({ 
      success: true, 
      reserva: novaReserva[0],
      reservaId: reservaId 
    });
    
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
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