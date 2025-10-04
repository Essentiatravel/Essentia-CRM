import { NextRequest, NextResponse } from 'next/server';
import {
  listAgendamentos,
  createAgendamento,
} from '@/lib/agendamentos-service';

export async function GET() {
  try {
    console.log('🔄 Buscando agendamentos no banco...');
    const agendamentos = await listAgendamentos();
    console.log(`✅ ${agendamentos.length} agendamentos encontrados`);
    return NextResponse.json(agendamentos);
  } catch (error) {
    console.error('❌ Erro ao listar agendamentos:', error);
    console.error('Stack:', error instanceof Error ? error.stack : 'N/A');
    
    // Retornar array vazio em caso de erro para não quebrar a interface
    console.log('📦 Retornando array vazio devido ao erro');
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const passeioId = body.passeioId ?? body.passeio_id;
    const dataPasseio = body.dataPasseio ?? body.data_passeio ?? body.data;

    if (!passeioId) {
      return NextResponse.json({ error: 'Passeio é obrigatório' }, { status: 400 });
    }

    if (!dataPasseio) {
      return NextResponse.json({ error: 'Data do passeio é obrigatória' }, { status: 400 });
    }

    const normalizeNullable = (value: unknown) => {
      if (value === undefined || value === null || value === '' || value === 'none') {
        return null;
      }
      return value as string;
    };

    const novoAgendamento = await createAgendamento({
      passeioId,
      clienteId: normalizeNullable(body.clienteId ?? body.cliente_id),
      guiaId: normalizeNullable(body.guiaId ?? body.guia_id),
      dataPasseio,
      numeroPessoas: Number(body.numeroPessoas ?? body.numero_pessoas ?? 1),
      observacoes: body.observacoes ?? null,
      percentualComissao: body.percentualComissao ?? body.percentual_comissao ?? undefined,
    });

    return NextResponse.json(novoAgendamento, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return NextResponse.json({
      error: 'Erro ao criar agendamento',
      details: error instanceof Error ? error.message : 'Erro desconhecido',
    }, { status: 500 });
  }
}
