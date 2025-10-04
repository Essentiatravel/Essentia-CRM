import { NextRequest, NextResponse } from 'next/server';
import { listAgendamentosFromSupabase } from '@/lib/supabase-agendamentos-service';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const agendamentos = await listAgendamentosFromSupabase();
    return NextResponse.json(agendamentos);
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    return NextResponse.json({ error: 'Erro ao listar agendamentos' }, { status: 500 });
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

    const numeroPessoas = Number(body.numeroPessoas ?? body.numero_pessoas ?? 1);
    const percentualComissao = body.percentualComissao ?? body.percentual_comissao ?? 30;

    // Buscar preço do passeio
    const { data: passeio, error: passeioError } = await supabase
      .from('passeios')
      .select('preco')
      .eq('id', passeioId)
      .single();

    if (passeioError || !passeio) {
      return NextResponse.json({ error: 'Passeio não encontrado' }, { status: 404 });
    }

    // Calcular valores
    const valorTotal = passeio.preco * numeroPessoas;
    const valorComissao = valorTotal * (percentualComissao / 100);

    // Inserir agendamento no Supabase
    const { data: novoAgendamento, error: insertError } = await supabase
      .from('agendamentos')
      .insert({
        passeio_id: passeioId,
        cliente_id: normalizeNullable(body.clienteId ?? body.cliente_id),
        guia_id: normalizeNullable(body.guiaId ?? body.guia_id),
        data_passeio: dataPasseio,
        numero_pessoas: numeroPessoas,
        valor_total: valorTotal,
        valor_comissao: valorComissao,
        percentual_comissao: percentualComissao,
        observacoes: body.observacoes ?? null,
        status: 'em_progresso',
      })
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

    if (insertError) {
      console.error('Erro ao inserir agendamento:', insertError);
      return NextResponse.json({
        error: 'Erro ao criar agendamento',
        details: insertError.message,
      }, { status: 500 });
    }

    // Formatar resposta
    const response = {
      id: novoAgendamento.id,
      passeio_id: novoAgendamento.passeio_id,
      cliente_id: novoAgendamento.cliente_id,
      guia_id: novoAgendamento.guia_id,
      data_passeio: novoAgendamento.data_passeio,
      numero_pessoas: novoAgendamento.numero_pessoas,
      valor_total: novoAgendamento.valor_total,
      valor_comissao: novoAgendamento.valor_comissao,
      percentual_comissao: novoAgendamento.percentual_comissao,
      status: novoAgendamento.status,
      observacoes: novoAgendamento.observacoes,
      passeio_nome: novoAgendamento.passeios?.nome || null,
      cliente_nome: novoAgendamento.clientes?.nome || null,
      guia_nome: novoAgendamento.guias?.nome || null,
      criado_em: novoAgendamento.criado_em,
      atualizado_em: novoAgendamento.atualizado_em,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return NextResponse.json({
      error: 'Erro ao criar agendamento',
      details: error instanceof Error ? error.message : 'Erro desconhecido',
    }, { status: 500 });
  }
}
