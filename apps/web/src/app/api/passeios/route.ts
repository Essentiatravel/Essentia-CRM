import { NextResponse } from 'next/server';

// Dados simulados para passeios
const passeiosSimulados = [
  {
    id: "passeio_001",
    nome: "Tour Roma Histórica",
    descricao: "Explore os pontos turísticos mais famosos de Roma",
    duracao: "4 horas",
    preco: 120.00,
    categoria: "História",
    ativo: true
  },
  {
    id: "passeio_002",
    nome: "Vaticano Completo",
    descricao: "Visita guiada ao Vaticano e Capela Sistina",
    duracao: "3 horas",
    preco: 150.00,
    categoria: "Religioso",
    ativo: true
  },
  {
    id: "passeio_003",
    nome: "Toscana Day Trip",
    descricao: "Dia completo pela bela região da Toscana",
    duracao: "8 horas",
    preco: 280.00,
    categoria: "Natureza",
    ativo: true
  },
  {
    id: "passeio_004",
    nome: "Food Tour Italiano",
    descricao: "Experimente a autêntica culinária italiana",
    duracao: "3 horas",
    preco: 90.00,
    categoria: "Gastronomia",
    ativo: true
  },
  {
    id: "passeio_005",
    nome: "Sunset em Positano",
    descricao: "Pôr do sol mágico na Costa Amalfitana",
    duracao: "5 horas",
    preco: 200.00,
    categoria: "Romântico",
    ativo: true
  }
];

export async function GET() {
  try {
    return NextResponse.json(passeiosSimulados);
  } catch (error) {
    console.error('Erro ao buscar passeios:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const passeioData = await request.json();

    // Simular criação de passeio
    const novoPasseio = {
      id: `passeio_${Date.now()}`,
      ...passeioData,
      ativo: true
    };

    // Em produção, isso salvaria no banco de dados
    passeiosSimulados.push(novoPasseio);

    return NextResponse.json({
      id: novoPasseio.id,
      message: 'Passeio criado com sucesso',
      passeio: novoPasseio
    });
  } catch (error) {
    console.error('Erro ao criar passeio:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}



