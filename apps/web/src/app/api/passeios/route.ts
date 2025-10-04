import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Usar Supabase JS Client para melhor compatibilidade e performance
// O cliente Supabase usa REST API que é mais confiável que conexões PostgreSQL diretas

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

export async function GET() {
  try {
    console.log('🔄 Buscando passeios no banco de dados via Supabase...');

    // Usar Supabase JS client para melhor compatibilidade
    const { data: todosPasseios, error } = await supabase
      .from('passeios')
      .select('*')
      .eq('ativo', 1);

    if (error) {
      console.error('❌ Erro ao buscar passeios do Supabase:', error);
      console.log('📦 Retornando dados de demonstração devido ao erro');
      return NextResponse.json(getDadosDemonstracao());
    }

    console.log(`✅ ${todosPasseios?.length || 0} passeios encontrados no banco`);

    // Garantir que campos JSON sejam arrays e nunca quebrem o endpoint
    const passeiosFormatados = (todosPasseios || []).map((p: any) => ({
      ...p,
      imagens: ensureArray(p.imagens),
      inclusoes: ensureArray(p.inclusoes),
      idiomas: ensureArray(p.idiomas),
    }));

    // Se não houver passeios, retornar dados de demonstração
    if (passeiosFormatados.length === 0) {
      console.warn('⚠️ Banco de dados vazio. Retornando dados de demonstração.');
      return NextResponse.json(getDadosDemonstracao());
    }

    return NextResponse.json(passeiosFormatados);
  } catch (error) {
    console.error('❌ Erro ao buscar passeios:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'N/A');
    console.log('📦 Retornando dados de demonstração devido ao erro');

    // Retornar dados de demonstração ao invés de erro 500
    return NextResponse.json(getDadosDemonstracao());
  }
}

// Função para retornar dados de demonstração quando o banco está vazio ou com problemas
function getDadosDemonstracao() {
  return [
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
      criadoEm: new Date(),
      atualizadoEm: new Date()
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
      criadoEm: new Date(),
      atualizadoEm: new Date()
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
      criadoEm: new Date(),
      atualizadoEm: new Date()
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
      criadoEm: new Date(),
      atualizadoEm: new Date()
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
      criadoEm: new Date(),
      atualizadoEm: new Date()
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
      criadoEm: new Date(),
      atualizadoEm: new Date()
    }
  ];
}

export async function POST(request: Request) {
  try {
    const passeioData = await request.json();

    const novoPasseioId = `passeio_${Date.now()}`;

    const novoPasseio = {
      id: novoPasseioId,
      nome: passeioData.name || passeioData.nome,
      descricao: passeioData.description || passeioData.descricao || passeioData.name || passeioData.nome || "Descrição não informada",
      preco: parseFloat(passeioData.price || passeioData.preco) || 0,
      duracao: `${passeioData.duration || passeioData.duracao}h`,
      categoria: passeioData.type || passeioData.categoria,
      // Armazenar como arrays nativos (Supabase converte para JSONB)
      imagens: passeioData.images || [],
      inclusoes: passeioData.includedItems || [],
      idiomas: passeioData.languages || [],
      capacidade_maxima: parseInt(passeioData.maxPeople) || 20,
      ativo: 1
    };

    const { data, error } = await supabase
      .from('passeios')
      .insert([novoPasseio])
      .select();

    if (error) {
      console.error('Erro ao criar passeio:', error);
      return NextResponse.json(
        { error: 'Erro ao criar passeio: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: novoPasseio.id,
      message: 'Passeio criado com sucesso',
      passeio: data?.[0] || novoPasseio
    });
  } catch (error) {
    console.error('Erro ao criar passeio:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

