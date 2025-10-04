import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Usar Supabase JS Client para melhor compatibilidade e performance

const ensureArray = (value: unknown): string[] => {
  if (!value && value !== 0) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return [];
    }

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((item): item is string => typeof item === 'string')
          .map((item) => item.trim())
          .filter((item) => item.length > 0);
      }

      if (parsed && typeof parsed === 'string') {
        return [parsed];
      }
    } catch (error) {
      try {
        const normalized = trimmed
          .replace(/^[\[\s]+|[\]\s]+$/g, '')
          .split(',')
          .map((item) => item.replace(/^"|"$/g, '').trim())
          .filter(Boolean);

        if (normalized.length > 1) {
          return normalized;
        }
      } catch {
        // Ignorar erros do fallback manual
      }

      return [trimmed];
    }
  }

  if (typeof value === 'object' && value !== null) {
    try {
      const serialized = JSON.stringify(value);
      return ensureArray(serialized);
    } catch {
      return [];
    }
  }

  return [];
};

// Dados de fallback para demonstração
const getDadosFallback = () => [
  {
    id: "demo-1",
    nome: "Tour Paris Romântica",
    descricao: "Descubra os encantos de Paris com guias especializados. Visite a Torre Eiffel, Louvre e muito mais!",
    preco: 150,
    duracao: "4h",
    categoria: "Romance",
    imagens: [],
    inclusoes: ["Guia especializado", "Transporte", "Ingressos"],
    idiomas: ["Português", "Inglês", "Francês"],
    capacidadeMaxima: 15,
    ativo: 1,
  },
  {
    id: "demo-2",
    nome: "Aventura nos Alpes",
    descricao: "Trilhas incríveis pelos Alpes Suíços com vistas espetaculares e natureza preservada",
    preco: 280,
    duracao: "8h",
    categoria: "Aventura",
    imagens: [],
    inclusoes: ["Guia especializado", "Equipamentos", "Lanche", "Seguro"],
    idiomas: ["Português", "Inglês"],
    capacidadeMaxima: 12,
    ativo: 1,
  },
  {
    id: "demo-3",
    nome: "Gastronomia Italiana",
    descricao: "Tour gastronômico pela Toscana com degustação de vinhos e pratos típicos",
    preco: 200,
    duracao: "6h",
    categoria: "Gastronomia",
    imagens: [],
    inclusoes: ["Guia especializado", "Degustações", "Vinhos", "Transporte"],
    idiomas: ["Português", "Italiano"],
    capacidadeMaxima: 10,
    ativo: 1,
  },
  {
    id: "demo-4",
    nome: "História de Roma",
    descricao: "Explore o Coliseu, Fórum Romano e outros monumentos históricos com guias especializados",
    preco: 120,
    duracao: "5h",
    categoria: "História",
    imagens: [],
    inclusoes: ["Guia especializado", "Ingressos", "Água", "Material informativo"],
    idiomas: ["Português", "Inglês", "Espanhol"],
    capacidadeMaxima: 20,
    ativo: 1,
  },
  {
    id: "demo-5",
    nome: "Arte e Cultura",
    descricao: "Visite os principais museus e galerias de arte da cidade",
    preco: 90,
    duracao: "3h",
    categoria: "Cultural",
    imagens: [],
    inclusoes: ["Guia especializado", "Ingressos", "Água"],
    idiomas: ["Português", "Inglês"],
    capacidadeMaxima: 15,
    ativo: 1,
  },
  {
    id: "demo-6",
    nome: "Natureza Selvagem",
    descricao: "Explore parques nacionais e observe a fauna local em seu habitat natural",
    preco: 180,
    duracao: "7h",
    categoria: "Natureza",
    imagens: [],
    inclusoes: ["Guia especializado", "Binóculos", "Lanche", "Seguro"],
    idiomas: ["Português"],
    capacidadeMaxima: 8,
    ativo: 1,
  }
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('🔍 Buscando passeio no banco via Supabase:', id);

    const { data: passeio, error } = await supabase
      .from('passeios')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !passeio) {
      console.log('❌ Passeio não encontrado:', id, error);
      return NextResponse.json({ error: 'Passeio não encontrado' }, { status: 404 });
    }

    // Garantir que campos JSON sejam arrays
    const passeioFormatado = {
      ...passeio,
      imagens: ensureArray(passeio.imagens),
      inclusoes: ensureArray(passeio.inclusoes),
      idiomas: ensureArray(passeio.idiomas),
    };

    console.log('✅ Passeio encontrado e formatado:', passeioFormatado);
    return NextResponse.json(passeioFormatado);
  } catch (error) {
    console.error('❌ Erro ao buscar passeio:', error);

    // Usar dados de fallback em caso de erro (banco offline)
    const { id } = await params;
    const fallbackData = getDadosFallback();
    const passeioFallback = fallbackData.find(p => p.id === id);

    if (passeioFallback) {
      console.log('📦 Usando dados de demonstração para passeio:', id);
      return NextResponse.json(passeioFallback);
    }

    return NextResponse.json({ error: 'Passeio não encontrado' }, { status: 404 });
  }
}

// PUT - Atualizar um passeio
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const passeioData = await request.json();

    console.log('🔄 Atualizando passeio via Supabase:', id, passeioData);

    const dadosAtualizados = {
      nome: passeioData.name || passeioData.nome,
      descricao: passeioData.description || passeioData.descricao || "Descrição não informada",
      preco: parseFloat(passeioData.price || passeioData.preco) || 0,
      duracao: passeioData.duration ? `${passeioData.duration}h` : passeioData.duracao,
      categoria: passeioData.type || passeioData.categoria,
      // Armazenar como arrays nativos (Supabase converte para JSONB)
      imagens: passeioData.images || [],
      inclusoes: passeioData.includedItems || [],
      idiomas: passeioData.languages || [],
      capacidade_maxima: parseInt(passeioData.maxPeople) || 20,
      ativo: passeioData.status === 'Ativo' ? 1 : 0,
      atualizado_em: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('passeios')
      .update(dadosAtualizados)
      .eq('id', id)
      .select();

    if (error) {
      console.error('❌ Erro ao atualizar passeio:', error);
      return NextResponse.json(
        { error: 'Erro ao atualizar passeio: ' + error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Passeio não encontrado para atualização' },
        { status: 404 }
      );
    }

    console.log('✅ Passeio atualizado com sucesso:', data[0]);

    return NextResponse.json({
      message: 'Passeio atualizado com sucesso',
      passeio: data[0]
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar passeio:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Excluir um passeio
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log('🗑️ Excluindo passeio via Supabase:', id);

    const { data, error } = await supabase
      .from('passeios')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      console.error('❌ Erro ao excluir passeio:', error);
      return NextResponse.json(
        { error: 'Erro ao excluir passeio: ' + error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Passeio não encontrado para exclusão' },
        { status: 404 }
      );
    }

    console.log('✅ Passeio excluído com sucesso');

    return NextResponse.json({
      message: 'Passeio excluído com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao excluir passeio:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
