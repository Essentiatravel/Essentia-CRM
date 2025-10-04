import { NextRequest, NextResponse } from 'next/server';
import { getAgendamentoByIdFromSupabase } from '@/lib/supabase-agendamentos-service';
import { supabase } from '@/lib/supabase';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: NextRequest, context: RouteContext) {
  const params = await context.params;
  try {
    const agendamento = await getAgendamentoByIdFromSupabase(params.id);

    if (!agendamento) {
      return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 });
    }

    return NextResponse.json(agendamento);
  } catch (error) {
    console.error('Erro ao buscar agendamento:', error);
    return NextResponse.json({ error: 'Erro ao buscar agendamento' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const params = await context.params;
  try {
    const body = await request.json();

    const rawNumeroPessoas = body.numeroPessoas ?? body.numero_pessoas;
    const rawPercentual = body.percentualComissao ?? body.percentual_comissao;

    const normalizeNullable = (value: unknown) => {
      if (value === undefined || value === null || value === '' || value === 'none') {
        return null;
      }
      return value as string;
    };

    // Construir objeto de atualização apenas com campos definidos
    const updates: any = {};

    if (body.passeioId ?? body.passeio_id) {
      updates.passeio_id = body.passeioId ?? body.passeio_id;
    }
    if (body.clienteId !== undefined || body.cliente_id !== undefined) {
      updates.cliente_id = normalizeNullable(body.clienteId ?? body.cliente_id);
    }
    if (body.guiaId !== undefined || body.guia_id !== undefined) {
      updates.guia_id = normalizeNullable(body.guiaId ?? body.guia_id);
    }
    if (body.dataPasseio ?? body.data_passeio ?? body.data) {
      updates.data_passeio = body.dataPasseio ?? body.data_passeio ?? body.data;
    }
    if (rawNumeroPessoas !== undefined) {
      updates.numero_pessoas = Number(rawNumeroPessoas);
    }
    if (body.observacoes !== undefined) {
      updates.observacoes = body.observacoes;
    }
    if (rawPercentual !== undefined) {
      updates.percentual_comissao = Number(rawPercentual);
    }
    if (body.status) {
      updates.status = body.status;
    }

    // Recalcular valores se necessário
    if (updates.passeio_id || updates.numero_pessoas || updates.percentual_comissao) {
      // Buscar agendamento atual
      const { data: currentAgendamento } = await supabase
        .from('agendamentos')
        .select('passeio_id, numero_pessoas, percentual_comissao')
        .eq('id', params.id)
        .single();

      if (!currentAgendamento) {
        return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 });
      }

      const passeioId = updates.passeio_id || currentAgendamento.passeio_id;
      const numeroPessoas = updates.numero_pessoas || currentAgendamento.numero_pessoas;
      const percentualComissao = updates.percentual_comissao || currentAgendamento.percentual_comissao;

      // Buscar preço do passeio
      const { data: passeio } = await supabase
        .from('passeios')
        .select('preco')
        .eq('id', passeioId)
        .single();

      if (passeio) {
        updates.valor_total = passeio.preco * numeroPessoas;
        updates.valor_comissao = updates.valor_total * (percentualComissao / 100);
      }
    }

    updates.atualizado_em = new Date().toISOString();

    // Atualizar no Supabase
    const { data: updated, error: updateError } = await supabase
      .from('agendamentos')
      .update(updates)
      .eq('id', params.id)
      .select(`
        id,
        passeio_id,
        cliente_id,
        guia_id,
        data_passeio,
        numero_pessoas,
        valor_total,
        valor_comissao,
        percentual_comissao,
        status,
        observacoes,
        criado_em,
        atualizado_em,
        passeios!inner (nome),
        clientes (nome),
        guias (nome)
      `)
      .single();

    if (updateError) {
      console.error('Erro ao atualizar agendamento:', updateError);
      return NextResponse.json({
        error: 'Erro ao atualizar agendamento',
        details: updateError.message,
      }, { status: 500 });
    }

    if (!updated) {
      return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 });
    }

    // Formatar resposta
    const response = {
      id: updated.id,
      passeio_id: updated.passeio_id,
      cliente_id: updated.cliente_id,
      guia_id: updated.guia_id,
      data_passeio: updated.data_passeio,
      numero_pessoas: updated.numero_pessoas,
      valor_total: updated.valor_total,
      valor_comissao: updated.valor_comissao,
      percentual_comissao: updated.percentual_comissao,
      status: updated.status,
      observacoes: updated.observacoes,
      passeio_nome: updated.passeios?.nome || null,
      cliente_nome: updated.clientes?.nome || null,
      guia_nome: updated.guias?.nome || null,
      criado_em: updated.criado_em,
      atualizado_em: updated.atualizado_em,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    return NextResponse.json({
      error: 'Erro ao atualizar agendamento',
      details: error instanceof Error ? error.message : 'Erro desconhecido',
    }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, context: RouteContext) {
  const params = await context.params;
  try {
    const { error: deleteError } = await supabase
      .from('agendamentos')
      .delete()
      .eq('id', params.id);

    if (deleteError) {
      console.error('Erro ao deletar agendamento:', deleteError);
      return NextResponse.json({
        error: 'Erro ao remover agendamento',
        details: deleteError.message,
      }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao remover agendamento:', error);
    return NextResponse.json({ error: 'Erro ao remover agendamento' }, { status: 500 });
  }
}
