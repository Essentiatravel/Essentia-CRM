import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    console.log("🎯 Iniciando busca de dados do dashboard do guia...");

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Service role não configurado" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const guiaId = searchParams.get("guiaId");

    if (!guiaId) {
      return NextResponse.json({ error: "ID do guia é obrigatório" }, { status: 400 });
    }

    console.log("👤 Buscando dados para guia:", guiaId);

    // 1. Buscar dados do guia na tabela users primeiro
    const { data: usuario, error: usuarioError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", guiaId)
      .eq("user_type", "guia")
      .maybeSingle();

    if (usuarioError) {
      console.error("❌ Erro ao buscar usuário guia:", usuarioError);
      return NextResponse.json({ error: `Erro ao buscar usuário: ${usuarioError.message}` }, { status: 500 });
    }

    if (!usuario) {
      return NextResponse.json({ error: "Guia não encontrado ou usuário não é um guia" }, { status: 404 });
    }

    // 2. Tentar buscar dados extras na tabela guias (se existir)
    const { data: guiaExtra } = await supabaseAdmin
      .from("guias")
      .select("*")
      .eq("id", guiaId)
      .maybeSingle();

    // Combinar dados do usuário com dados extras do guia (se houver)
    const guia = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      avaliacaoMedia: guiaExtra?.avaliacaoMedia || 4.5, // Valor padrão
      totalAvaliacoes: guiaExtra?.totalAvaliacoes || 0,
      comissaoTotal: guiaExtra?.comissaoTotal || 0,
      percentualComissao: guiaExtra?.percentualComissao || 30
    };

    // 3. Buscar agendamentos do guia (pode não existir ainda)
    const { data: agendamentos, error: agendamentosError } = await supabaseAdmin
      .from("agendamentos")
      .select(`
        *,
        passeio:passeios(nome),
        cliente:clientes(nome, telefone)
      `)
      .eq("guia_id", guiaId) // Usar guia_id ao invés de guiaId
      .order("data_passeio", { ascending: true }); // Usar data_passeio

    console.log("📊 Resultado busca agendamentos:", { 
      error: agendamentosError?.message, 
      count: agendamentos?.length || 0 
    });

    if (agendamentosError) {
      console.error("❌ Erro ao buscar agendamentos:", agendamentosError);
    }

    // Dados mock se não houver agendamentos reais
    const agendamentosMock = agendamentos || [];

    // 3. Calcular estatísticas
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    const agendamentosMes = agendamentosMock.filter(a => {
      const dataPasseio = new Date(a.data_passeio || a.dataPasseio);
      return dataPasseio >= inicioMes && dataPasseio <= fimMes;
    });

    const agendamentosConcluidos = agendamentosMock.filter(a => a.status === 'concluidas');
    const receitaMes = agendamentosMes
      .filter(a => a.status === 'concluidas')
      .reduce((total, a) => total + (a.valorComissao || 0), 0);

    // 4. Organizar agendamentos por status
    const agendamentosPorStatus = {
      pendentes: agendamentosMock.filter(a => a.status === 'pendente_cliente'),
      confirmados: agendamentosMock.filter(a => a.status === 'confirmadas'),
      emAndamento: agendamentosMock.filter(a => a.status === 'em_progresso'),
      concluidos: agendamentosConcluidos,
      cancelados: agendamentosMock.filter(a => a.status === 'canceladas')
    };

    // 5. Formatar dados para o frontend
    const formatarAgendamento = (agendamento: any) => ({
      id: agendamento.id,
      passeio_nome: agendamento.passeio?.nome || "Passeio não informado",
      cliente_nome: agendamento.cliente?.nome || "Cliente não informado",
      cliente_telefone: agendamento.cliente?.telefone || "",
      data_passeio: agendamento.data_passeio || agendamento.dataPasseio,
      horario_inicio: agendamento.horario_inicio || agendamento.horarioInicio || "08:00",
      horario_fim: agendamento.horario_fim || agendamento.horarioFim || "18:00",
      numero_pessoas: agendamento.numero_pessoas || agendamento.numeroPessoas || 1,
      valor_total: agendamento.valor_total || agendamento.valorTotal || 0,
      valor_comissao: agendamento.valor_comissao || agendamento.valorComissao || 0,
      status: agendamento.status,
      observacoes: agendamento.observacoes
    });

    const dashboardData = {
      success: true,
      stats: {
        totalAgendamentos: agendamentosConcluidos.length,
        agendamentosMes: agendamentosMes.length,
        receitaMes: receitaMes,
        avaliacaoMedia: guia.avaliacaoMedia || 0,
        totalAvaliacoes: guia.totalAvaliacoes || 0
      },
      agendamentos: {
        pendentes: agendamentosPorStatus.pendentes.map(formatarAgendamento),
        confirmados: agendamentosPorStatus.confirmados.map(formatarAgendamento),
        emAndamento: agendamentosPorStatus.emAndamento.map(formatarAgendamento),
        concluidos: agendamentosPorStatus.concluidos.map(formatarAgendamento),
        cancelados: agendamentosPorStatus.cancelados.map(formatarAgendamento)
      }
    };

    console.log("✅ Dashboard do guia carregado com sucesso");
    return NextResponse.json(dashboardData);

  } catch (error) {
    console.error("💥 Erro geral ao carregar dashboard do guia:", error);
    return NextResponse.json({ 
      error: "Erro interno do servidor",
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

