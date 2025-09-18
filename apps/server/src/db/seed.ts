import { db } from "./index";
import { passeios, clientes, guias, agendamentos } from "./schema";

const passeiosData = [
  {
    id: "1",
    nome: "Roma Histórica",
    descricao: "Tour pelos pontos históricos de Roma incluindo Coliseu, Fórum Romano e Pantheon",
    preco: 120.00,
    duracao: "4h",
    categoria: "História",
    imagens: JSON.stringify(["/images/roma1.jpg", "/images/roma2.jpg"]),
    inclusoes: JSON.stringify(["Guia especializado", "Entrada nos monumentos", "Transporte"]),
    idiomas: JSON.stringify(["Português", "Italiano", "Inglês"]),
    capacidadeMaxima: 15,
  },
  {
    id: "2",
    nome: "Aventura na Trilha",
    descricao: "Trilha nas montanhas italianas com vista espetacular e experiência única na natureza",
    preco: 200.00,
    duracao: "6h",
    categoria: "Aventura",
    imagens: JSON.stringify(["/images/trilha1.jpg", "/images/trilha2.jpg"]),
    inclusoes: JSON.stringify(["Equipamentos de segurança", "Lanche", "Guia especializado"]),
    idiomas: JSON.stringify(["Português", "Italiano", "Espanhol"]),
    capacidadeMaxima: 8,
  },
  {
    id: "3",
    nome: "Florença Renascentista",
    descricao: "Explore a arte e cultura de Florença com visitas aos principais museus e galerias",
    preco: 150.00,
    duracao: "5h",
    categoria: "Arte",
    imagens: JSON.stringify(["/images/florenca1.jpg", "/images/florenca2.jpg"]),
    inclusoes: JSON.stringify(["Entrada nos museus", "Guia especialista em arte", "Audioguia"]),
    idiomas: JSON.stringify(["Português", "Italiano", "Francês"]),
    capacidadeMaxima: 12,
  },
  {
    id: "4",
    nome: "Veneza Romântica",
    descricao: "Passeio romântico pelos canais de Veneza com gondola e jantar especial",
    preco: 180.00,
    duracao: "3h",
    categoria: "Romance",
    imagens: JSON.stringify(["/images/veneza1.jpg", "/images/veneza2.jpg"]),
    inclusoes: JSON.stringify(["Passeio de gôndola", "Jantar romântico", "Guia local"]),
    idiomas: JSON.stringify(["Português", "Italiano", "Inglês"]),
    capacidadeMaxima: 6,
  },
  {
    id: "5",
    nome: "Culinária Toscana",
    descricao: "Experiência gastronômica completa com aula de culinária e degustação de vinhos",
    preco: 250.00,
    duracao: "8h",
    categoria: "Gastronomia",
    imagens: JSON.stringify(["/images/toscana1.jpg", "/images/toscana2.jpg"]),
    inclusoes: JSON.stringify(["Aula de culinária", "Degustação de vinhos", "Almoço completo", "Receitas"]),
    idiomas: JSON.stringify(["Português", "Italiano"]),
    capacidadeMaxima: 10,
  }
];

const clientesData = [
  {
    id: "1",
    nome: "Maria Silva",
    email: "maria.silva@email.com",
    telefone: "+55 11 99999-0001",
    cpf: "123.456.789-01",
    endereco: JSON.stringify({
      rua: "Rua das Flores, 123",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01234-567",
      pais: "Brasil"
    }),
    preferencias: JSON.stringify(["História", "Arte", "Cultura"]),
    observacoes: "Cliente VIP, prefere passeios culturais",
  },
  {
    id: "2",
    nome: "João Santos",
    email: "joao.santos@email.com",
    telefone: "+55 11 99999-0002",
    cpf: "234.567.890-12",
    endereco: JSON.stringify({
      rua: "Avenida Paulista, 456",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01311-000",
      pais: "Brasil"
    }),
    preferencias: JSON.stringify(["Arte", "Museus", "Fotografia"]),
    observacoes: "Fotógrafo profissional",
  },
  {
    id: "3",
    nome: "Ana Costa",
    email: "ana.costa@email.com",
    telefone: "+55 21 99999-0003",
    cpf: "345.678.901-23",
    endereco: JSON.stringify({
      rua: "Rua das Palmeiras, 789",
      cidade: "Rio de Janeiro",
      estado: "RJ",
      cep: "22070-000",
      pais: "Brasil"
    }),
    preferencias: JSON.stringify(["Aventura", "Natureza", "Esportes"]),
    observacoes: "Gosta de atividades ao ar livre",
  },
  {
    id: "4",
    nome: "Carlos Oliveira",
    email: "carlos.oliveira@email.com",
    telefone: "+55 11 99999-0004",
    cpf: "456.789.012-34",
    endereco: JSON.stringify({
      rua: "Rua dos Jardins, 321",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01234-890",
      pais: "Brasil"
    }),
    preferencias: JSON.stringify(["Gastronomia", "Vinhos", "Cultura Local"]),
    observacoes: "Chef de cozinha, interesse especial em gastronomia",
  }
];

const guiasData = [
  {
    id: "1",
    nome: "Marco Rossi",
    email: "marco.rossi@email.com",
    telefone: "+39 333 123 4567",
    especialidades: JSON.stringify(["História", "Arte", "Culinária"]),
    idiomas: JSON.stringify(["Português", "Italiano", "Inglês"]),
    avaliacaoMedia: 4.9,
    totalAvaliacoes: 127,
    passeiosRealizados: 89,
    comissaoTotal: 12450.00,
    percentualComissao: 35,
    biografia: "Guia especializado em história romana com 10 anos de experiência",
    status: "ativo",
    dataRegistro: "2024-03-15",
  },
  {
    id: "2",
    nome: "Giulia Ferrari",
    email: "giulia.ferrari@email.com",
    telefone: "+39 344 987 6543",
    especialidades: JSON.stringify(["Aventura", "Natureza", "Fotografia"]),
    idiomas: JSON.stringify(["Português", "Italiano", "Espanhol"]),
    avaliacaoMedia: 4.8,
    totalAvaliacoes: 98,
    passeiosRealizados: 67,
    comissaoTotal: 8930.00,
    percentualComissao: 30,
    biografia: "Especialista em trilhas e aventuras na natureza italiana",
    status: "ativo",
    dataRegistro: "2024-05-22",
  },
  {
    id: "3",
    nome: "Alessandro Bianchi",
    email: "alessandro.bianchi@email.com",
    telefone: "+39 320 555 7890",
    especialidades: JSON.stringify(["Arte", "Museus", "Arquitetura"]),
    idiomas: JSON.stringify(["Português", "Italiano", "Francês"]),
    avaliacaoMedia: 4.7,
    totalAvaliacoes: 156,
    passeiosRealizados: 123,
    comissaoTotal: 15670.00,
    percentualComissao: 32,
    biografia: "Historiador da arte especializado no período renascentista",
    status: "ativo",
    dataRegistro: "2024-01-08",
  },
  {
    id: "4",
    nome: "Sofia Romano",
    email: "sofia.romano@email.com",
    telefone: "+39 331 444 2211",
    especialidades: JSON.stringify(["Vinhos", "Gastronomia", "Tradições"]),
    idiomas: JSON.stringify(["Português", "Italiano"]),
    avaliacaoMedia: 4.9,
    totalAvaliacoes: 89,
    passeiosRealizados: 56,
    comissaoTotal: 7890.00,
    percentualComissao: 28,
    biografia: "Sommelier e chef especializada na culinária toscana tradicional",
    status: "ativo",
    dataRegistro: "2024-07-12",
  }
];

const agendamentosData = [
  {
    id: "1",
    passeioId: "2",
    clienteId: "1",
    guiaId: "2",
    dataPasseio: "2025-02-12",
    numeroPessoas: 2,
    valorTotal: 400.00,
    valorComissao: 160.00,
    percentualComissao: 40,
    status: "em_progresso" as const,
    observacoes: "Lua de mel, querem experiência romântica",
  },
  {
    id: "2",
    passeioId: "3",
    clienteId: "2",
    guiaId: "3",
    dataPasseio: "2025-01-26",
    numeroPessoas: 8,
    valorTotal: 1440.00,
    valorComissao: 547.00,
    percentualComissao: 38,
    status: "pendente_cliente" as const,
    observacoes: "Grupo de estudantes de arte",
  },
  {
    id: "3",
    passeioId: "1",
    clienteId: "3",
    guiaId: "1",
    dataPasseio: "2025-01-28",
    numeroPessoas: 4,
    valorTotal: 1000.00,
    valorComissao: 300.00,
    percentualComissao: 30,
    status: "confirmadas" as const,
    observacoes: "Celebração de aniversário, preferem locais mais exclusivos",
  },
  {
    id: "4",
    passeioId: "4",
    clienteId: "4",
    guiaId: "2",
    dataPasseio: "2025-01-18",
    numeroPessoas: 3,
    valorTotal: 225.00,
    valorComissao: 101.25,
    percentualComissao: 45,
    status: "concluidas" as const,
    observacoes: "Interesse especial em período colonial",
    avaliacaoCliente: 5,
    comentarioCliente: "Experiência maravilhosa! Guia muito atenciosa.",
  },
  {
    id: "5",
    passeioId: "5",
    clienteId: "1",
    guiaId: undefined,
    dataPasseio: "2025-02-08",
    numeroPessoas: 3,
    valorTotal: 840.00,
    valorComissao: 0.00,
    percentualComissao: 0,
    status: "canceladas" as const,
    observacoes: "Cancelado devido ao clima",
    motivoCancelamento: "Condições climáticas desfavoráveis",
  }
];

export async function seedDatabase() {
  console.log("🌱 Iniciando seed do banco de dados...");

  try {
    // Inserir passeios
    console.log("📍 Inserindo passeios...");
    await db.insert(passeios).values(passeiosData);

    // Inserir clientes
    console.log("👥 Inserindo clientes...");
    await db.insert(clientes).values(clientesData);

    // Inserir guias
    console.log("🗣️ Inserindo guias...");
    await db.insert(guias).values(guiasData);

    // Inserir agendamentos
    console.log("📅 Inserindo agendamentos...");
    await db.insert(agendamentos).values(agendamentosData);

    console.log("✅ Seed do banco de dados concluído com sucesso!");
    console.log(`📊 Dados inseridos:
    - ${passeiosData.length} passeios
    - ${clientesData.length} clientes  
    - ${guiasData.length} guias
    - ${agendamentosData.length} agendamentos`);
    
  } catch (error) {
    console.error("❌ Erro ao fazer seed do banco:", error);
    throw error;
  }
}

// Executar seed se chamado diretamente
if (require.main === module) {
  seedDatabase().catch(console.error);
}