import { NextRequest, NextResponse } from 'next/server';
import { getGuiaStats, getAgendamentosByGuia } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const guiaId = searchParams.get('guiaId');

    if (!guiaId) {
      return NextResponse.json(
        { error: 'ID do guia é obrigatório' },
        { status: 400 }
      );
    }

    const [stats, agendamentos] = await Promise.all([
      getGuiaStats(guiaId),
      getAgendamentosByGuia(guiaId)
    ]);

    // Separar agendamentos por status
    const agendamentosPorStatus = {
      pendentes: agendamentos.filter(a => a.status === 'pendente'),
      confirmados: agendamentos.filter(a => a.status === 'confirmadas'),
      emAndamento: agendamentos.filter(a => a.status === 'em_progresso'),
      concluidos: agendamentos.filter(a => a.status === 'concluido'),
      cancelados: agendamentos.filter(a => a.status === 'cancelado')
    };

    return NextResponse.json({
      success: true,
      stats,
      agendamentos: agendamentosPorStatus
    });

  } catch (error) {
    console.error('Erro ao buscar dashboard do guia:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

