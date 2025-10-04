import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('🔄 Buscando clientes ativos do Supabase...');

    const { data: clientesAtivos, error } = await supabase
      .from('clientes')
      .select('id, nome, email, telefone, cpf, status')
      .eq('status', 'ativo')
      .order('nome', { ascending: true });

    if (error) {
      console.error('❌ Erro ao buscar clientes do Supabase:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar clientes', details: error.message },
        { status: 500 }
      );
    }

    console.log(`✅ ${clientesAtivos?.length || 0} clientes ativos encontrados`);
    return NextResponse.json(clientesAtivos || []);
  } catch (error) {
    console.error('❌ Erro ao listar clientes:', error);
    return NextResponse.json(
      { error: 'Erro ao listar clientes' },
      { status: 500 }
    );
  }
}
