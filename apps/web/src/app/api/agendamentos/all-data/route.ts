import { NextResponse } from 'next/server';
import { fetchAllDataParallel } from '@/lib/supabase-agendamentos-service';

/**
 * Endpoint otimizado que busca todos os dados necessários em paralelo
 * Reduz de 4 requisições sequenciais para 1 única requisição
 */
export async function GET() {
  try {
    const result = await fetchAllDataParallel();

    // Verificar se houve erros
    const hasErrors = Object.values(result.errors).some(error => error !== null);

    if (hasErrors) {
      console.error('Erros ao buscar dados:', result.errors);
      // Ainda retorna os dados que funcionaram
    }

    return NextResponse.json({
      agendamentos: result.agendamentos,
      passeios: result.passeios,
      clientes: result.clientes,
      guias: result.guias,
    });
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return NextResponse.json(
      {
        error: 'Erro ao buscar dados',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
