import { NextResponse } from "next/server";
import { supabaseClient } from "@/lib/database";


export async function GET() {
  try {
    const today = new Date();
    const todayKey = today.toISOString().split("T")[0];
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    const [usersRes, passeiosRes, agendamentosRes, transacoesRes] = await Promise.all([
      supabaseClient.from("users").select("user_type"),
      supabaseClient.from("passeios").select("id"),
      supabaseClient
        .from("agendamentos")
        .select("status, data_passeio")
        .gte('data_passeio', `${currentYear}-01-01`)
        .lte('data_passeio', `${currentYear}-12-31`),
      supabaseClient
        .from("transacoes")
        .select("valor, tipo, status, criado_em")
        .eq("tipo", "receita")
        .gte('criado_em', `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`),
    ]);

    if (usersRes.error) throw usersRes.error;
    if (passeiosRes.error) throw passeiosRes.error;
    if (agendamentosRes.error) throw agendamentosRes.error;
    if (transacoesRes.error) throw transacoesRes.error;

    const users = usersRes.data ?? [];
    const passeios = passeiosRes.data ?? [];
    const agendamentos = agendamentosRes.data ?? [];
    const transacoes = transacoesRes.data ?? [];

    const totalClientes = users.filter((user) => user.user_type === "cliente").length;
    const totalGuias = users.filter((user) => user.user_type === "guia").length;
    const totalAdmins = users.filter((user) => user.user_type === "admin").length;

    const totalPasseios = passeios.length;

    const agendamentosHoje = agendamentos.filter((agendamento) => {
      return agendamento.data_passeio === todayKey;
    }).length;

    const agendamentosMes = agendamentos.filter((agendamento) => {
      const date = agendamento.data_passeio;
      if (!date) return false;
      return date.startsWith(`${currentYear}-${currentMonth.toString().padStart(2, '0')}`);
    }).length;

    const agendamentosPendentes = agendamentos.filter((agendamento) => agendamento.status === "pendente_cliente").length;

    const receitaMes = transacoes.reduce((total, transacao) => total + (transacao.valor ?? 0), 0);

    return NextResponse.json(
      {
        totalClientes,
        totalGuias,
        totalAdmins,
        totalPasseios,
        agendamentosHoje,
        agendamentosMes,
        receitaMes,
        agendamentosPendentes,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erro ao buscar estatísticas do dashboard:", error);

    return NextResponse.json(
      {
        totalClientes: 0,
        totalGuias: 0,
        totalAdmins: 0,
        totalPasseios: 0,
        agendamentosHoje: 0,
        agendamentosMes: 0,
        receitaMes: 0,
        agendamentosPendentes: 0,
      },
      { status: 200 },
    );
  }
}
