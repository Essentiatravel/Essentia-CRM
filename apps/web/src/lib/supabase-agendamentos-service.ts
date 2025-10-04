'use server';

import { supabase } from './supabase';

export type AgendamentoSupabase = {
  id: string;
  passeio_id: string;
  cliente_id: string | null;
  guia_id: string | null;
  data_passeio: string;
  numero_pessoas: number;
  valor_total: number;
  valor_comissao: number;
  percentual_comissao: number;
  status: string;
  observacoes: string | null;
  passeio_nome: string | null;
  cliente_nome: string | null;
  guia_nome: string | null;
  criado_em: string | null;
  atualizado_em: string | null;
};

/**
 * Busca todos os agendamentos com dados relacionados otimizados
 * Usa select específico para minimizar transferência de dados
 */
export async function listAgendamentosFromSupabase(): Promise<AgendamentoSupabase[]> {
  try {
    const { data, error } = await supabase
      .from('agendamentos')
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
        passeios!inner (
          nome
        ),
        clientes (
          nome
        ),
        guias (
          nome
        )
      `)
      .order('criado_em', { ascending: false });

    if (error) {
      console.error('Erro ao buscar agendamentos do Supabase:', error);
      throw error;
    }

    // Mapear dados para formato esperado
    return (data || []).map((item: any) => ({
      id: item.id,
      passeio_id: item.passeio_id,
      cliente_id: item.cliente_id,
      guia_id: item.guia_id,
      data_passeio: item.data_passeio,
      numero_pessoas: item.numero_pessoas || 1,
      valor_total: item.valor_total || 0,
      valor_comissao: item.valor_comissao || 0,
      percentual_comissao: item.percentual_comissao || 30,
      status: item.status || 'em_progresso',
      observacoes: item.observacoes,
      passeio_nome: item.passeios?.nome || null,
      cliente_nome: item.clientes?.nome || null,
      guia_nome: item.guias?.nome || null,
      criado_em: item.criado_em,
      atualizado_em: item.atualizado_em,
    }));
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    return [];
  }
}

/**
 * Busca agendamento específico por ID
 */
export async function getAgendamentoByIdFromSupabase(id: string): Promise<AgendamentoSupabase | null> {
  try {
    const { data, error } = await supabase
      .from('agendamentos')
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
        passeios!inner (
          nome
        ),
        clientes (
          nome
        ),
        guias (
          nome
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar agendamento do Supabase:', error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      passeio_id: data.passeio_id,
      cliente_id: data.cliente_id,
      guia_id: data.guia_id,
      data_passeio: data.data_passeio,
      numero_pessoas: data.numero_pessoas || 1,
      valor_total: data.valor_total || 0,
      valor_comissao: data.valor_comissao || 0,
      percentual_comissao: data.percentual_comissao || 30,
      status: data.status || 'em_progresso',
      observacoes: data.observacoes,
      passeio_nome: data.passeios?.nome || null,
      cliente_nome: data.clientes?.nome || null,
      guia_nome: data.guias?.nome || null,
      criado_em: data.criado_em,
      atualizado_em: data.atualizado_em,
    };
  } catch (error) {
    console.error('Erro ao buscar agendamento:', error);
    return null;
  }
}

/**
 * Busca todos os dados necessários em paralelo
 */
export async function fetchAllDataParallel() {
  try {
    const [agendamentosRes, passeiosRes, clientesRes, guiasRes] = await Promise.all([
      supabase
        .from('agendamentos')
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
        .order('criado_em', { ascending: false }),

      supabase
        .from('passeios')
        .select('id, nome, descricao, preco, duracao, categoria')
        .eq('ativo', 1),

      supabase
        .from('clientes')
        .select('id, nome, email, telefone')
        .eq('status', 'ativo'),

      supabase
        .from('guias')
        .select('id, nome, email, especialidades')
        .eq('status', 'ativo')
    ]);

    return {
      agendamentos: agendamentosRes.data || [],
      passeios: passeiosRes.data || [],
      clientes: clientesRes.data || [],
      guias: guiasRes.data || [],
      errors: {
        agendamentos: agendamentosRes.error,
        passeios: passeiosRes.error,
        clientes: clientesRes.error,
        guias: guiasRes.error,
      }
    };
  } catch (error) {
    console.error('Erro ao buscar dados em paralelo:', error);
    throw error;
  }
}
