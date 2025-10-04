import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('🔄 Buscando guias ativos do Supabase...');

    const { data: guiasAtivos, error } = await supabase
      .from('guias')
      .select('id, nome, email, telefone, especialidades, idiomas, status, avaliacao_media')
      .eq('status', 'ativo')
      .order('nome', { ascending: true });

    if (error) {
      console.error('❌ Erro ao buscar guias do Supabase:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar guias', details: error.message },
        { status: 500 }
      );
    }

    console.log(`✅ ${guiasAtivos?.length || 0} guias ativos encontrados`);
    return NextResponse.json(guiasAtivos || []);
  } catch (error) {
    console.error('❌ Erro ao listar guias:', error);
    return NextResponse.json(
      { error: 'Erro ao listar guias' },
      { status: 500 }
    );
  }
}
