import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { agendamentos, passeios, clientes } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clienteId = searchParams.get('clienteId');

    console.log('🔍 Buscando reservas para clienteId:', clienteId);

    if (!clienteId) {
      return NextResponse.json({ error: 'Cliente ID obrigatório' }, { status: 400 });
    }

    // Buscar agendamentos do cliente com dados do passeio
    const reservasCliente = await db
      .select({
        id: agendamentos.id,
        passeioNome: passeios.nome,
        data: agendamentos.dataPasseio,
        pessoas: agendamentos.numeroPessoas,
        valorTotal: agendamentos.valorTotal,
        status: agendamentos.status,
        observacoes: agendamentos.observacoes,
        criadoEm: agendamentos.criadoEm,
        passeioId: agendamentos.passeioId
      })
      .from(agendamentos)
      .leftJoin(passeios, eq(agendamentos.passeioId, passeios.id))
      .where(eq(agendamentos.clienteId, clienteId))
      .orderBy(desc(agendamentos.criadoEm));

    console.log(`✅ Encontradas ${reservasCliente.length} reservas para o cliente`);

    // Formatar dados para o frontend
    const reservasFormatadas = reservasCliente.map(reserva => ({
      id: reserva.id,
      passeioNome: reserva.passeioNome || 'Passeio não encontrado',
      data: reserva.data,
      pessoas: reserva.pessoas,
      valorTotal: reserva.valorTotal,
      status: reserva.status,
      metodoPagamento: 'Não informado', // Pode ser melhorado com tabela de pagamentos
      criadoEm: reserva.criadoEm
    }));

    return NextResponse.json(reservasFormatadas);
    
  } catch (error) {
    console.error('Erro ao buscar reservas do cliente:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}