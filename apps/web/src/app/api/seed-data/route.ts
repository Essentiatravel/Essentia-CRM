import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Endpoint para popular banco de dados com dados de teste
 * ATENÇÃO: Use apenas em ambiente de desenvolvimento!
 */
export async function POST() {
  try {
    console.log('🌱 Iniciando seed de dados...');

    // Verificar se já existem dados
    const { data: existingPasseios } = await supabase
      .from('passeios')
      .select('id')
      .limit(1);

    const { data: existingClientes } = await supabase
      .from('clientes')
      .select('id')
      .limit(1);

    const { data: existingGuias } = await supabase
      .from('guias')
      .select('id')
      .limit(1);

    const results = {
      passeios: { created: 0, existing: 0 },
      clientes: { created: 0, existing: 0 },
      guias: { created: 0, existing: 0 },
      errors: [] as string[],
    };

    // Criar passeios de exemplo
    if (!existingPasseios || existingPasseios.length === 0) {
      const passeios = [
        {
          id: crypto.randomUUID(),
          nome: 'Tour Paris Romântica',
          descricao: 'Descubra os encantos de Paris com guias especializados. Visite a Torre Eiffel, Louvre e muito mais!',
          preco: 150,
          duracao: '4h',
          categoria: 'Romance',
          imagens: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34'],
          inclusoes: ['Guia especializado', 'Transporte', 'Ingressos'],
          idiomas: ['Português', 'Inglês', 'Francês'],
          capacidade_maxima: 15,
          ativo: 1,
        },
        {
          id: crypto.randomUUID(),
          nome: 'Aventura nos Alpes',
          descricao: 'Trilhas incríveis pelos Alpes Suíços com vistas espetaculares',
          preco: 280,
          duracao: '8h',
          categoria: 'Aventura',
          imagens: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4'],
          inclusoes: ['Guia', 'Equipamentos', 'Lanche', 'Seguro'],
          idiomas: ['Português', 'Inglês'],
          capacidade_maxima: 12,
          ativo: 1,
        },
        {
          id: crypto.randomUUID(),
          nome: 'Gastronomia Italiana',
          descricao: 'Tour gastronômico pela Toscana com degustação de vinhos',
          preco: 200,
          duracao: '6h',
          categoria: 'Gastronomia',
          imagens: ['https://images.unsplash.com/photo-1533777324565-a040eb52facd'],
          inclusoes: ['Guia', 'Degustações', 'Vinhos', 'Transporte'],
          idiomas: ['Português', 'Italiano'],
          capacidade_maxima: 10,
          ativo: 1,
        },
      ];

      const { error: passeiosError } = await supabase
        .from('passeios')
        .insert(passeios);

      if (passeiosError) {
        results.errors.push(`Passeios: ${passeiosError.message}`);
      } else {
        results.passeios.created = passeios.length;
      }
    } else {
      results.passeios.existing = existingPasseios.length;
    }

    // Criar clientes de exemplo
    if (!existingClientes || existingClientes.length === 0) {
      const clientes = [
        {
          id: crypto.randomUUID(),
          nome: 'João Silva',
          email: 'joao.silva@email.com',
          telefone: '(11) 98765-4321',
          cpf: '123.456.789-00',
          status: 'ativo',
        },
        {
          id: crypto.randomUUID(),
          nome: 'Maria Santos',
          email: 'maria.santos@email.com',
          telefone: '(21) 99876-5432',
          cpf: '987.654.321-00',
          status: 'ativo',
        },
        {
          id: crypto.randomUUID(),
          nome: 'Pedro Costa',
          email: 'pedro.costa@email.com',
          telefone: '(31) 98888-7777',
          cpf: '456.789.123-00',
          status: 'ativo',
        },
      ];

      const { error: clientesError } = await supabase
        .from('clientes')
        .insert(clientes);

      if (clientesError) {
        results.errors.push(`Clientes: ${clientesError.message}`);
      } else {
        results.clientes.created = clientes.length;
      }
    } else {
      results.clientes.existing = existingClientes.length;
    }

    // Criar guias de exemplo
    if (!existingGuias || existingGuias.length === 0) {
      const guias = [
        {
          id: crypto.randomUUID(),
          nome: 'Carlos Rodrigues',
          email: 'carlos.rodrigues@turguide.com',
          telefone: '(11) 97777-8888',
          cpf: '111.222.333-44',
          especialidades: ['História', 'Cultura', 'Arte'],
          idiomas: ['Português', 'Inglês', 'Espanhol'],
          percentual_comissao: 30,
          status: 'ativo',
          avaliacao_media: 4.8,
          total_avaliacoes: 45,
        },
        {
          id: crypto.randomUUID(),
          nome: 'Ana Beatriz',
          email: 'ana.beatriz@turguide.com',
          telefone: '(21) 96666-9999',
          cpf: '222.333.444-55',
          especialidades: ['Gastronomia', 'Vinhos'],
          idiomas: ['Português', 'Italiano', 'Francês'],
          percentual_comissao: 35,
          status: 'ativo',
          avaliacao_media: 4.9,
          total_avaliacoes: 67,
        },
        {
          id: crypto.randomUUID(),
          nome: 'Rafael Alves',
          email: 'rafael.alves@turguide.com',
          telefone: '(31) 95555-6666',
          cpf: '333.444.555-66',
          especialidades: ['Aventura', 'Ecoturismo'],
          idiomas: ['Português', 'Inglês'],
          percentual_comissao: 30,
          status: 'ativo',
          avaliacao_media: 4.7,
          total_avaliacoes: 38,
        },
      ];

      const { error: guiasError } = await supabase
        .from('guias')
        .insert(guias);

      if (guiasError) {
        results.errors.push(`Guias: ${guiasError.message}`);
      } else {
        results.guias.created = guias.length;
      }
    } else {
      results.guias.existing = existingGuias.length;
    }

    console.log('✅ Seed concluído:', results);

    return NextResponse.json({
      success: true,
      message: 'Dados de teste criados com sucesso',
      results,
    });
  } catch (error) {
    console.error('❌ Erro ao popular dados:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao popular dados',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST para popular o banco com dados de teste',
    warning: 'Use apenas em ambiente de desenvolvimento!',
  });
}
