import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Buscar dados dos usuários para calcular estatísticas
    const users = await getAllUsers();
    
    // Calcular estatísticas básicas
    const totalClientes = users.filter(user => user.user_type === 'cliente').length;
    const totalGuias = users.filter(user => user.user_type === 'guia').length;
    const totalAdmins = users.filter(user => user.user_type === 'admin').length;
    
    // Para demonstração, vamos usar dados simulados para outras métricas
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    
    // Dados simulados (em produção, isso viria do banco de dados)
    const dashboardStats = {
      totalClientes,
      totalGuias,
      totalAdmins,
      totalPasseios: 15, // Simulado
      agendamentosHoje: Math.floor(Math.random() * 5) + 1, // 1-5 aleatório
      agendamentosMes: Math.floor(Math.random() * 50) + 20, // 20-70 aleatório
      receitaMes: Math.floor(Math.random() * 50000) + 10000, // R$ 10k-60k aleatório
      agendamentosPendentes: Math.floor(Math.random() * 8) + 2, // 2-10 aleatório
    };
    
    return NextResponse.json(dashboardStats, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar estatísticas do dashboard:', error);
    
    // Retornar dados padrão em caso de erro
    const defaultStats = {
      totalClientes: 0,
      totalGuias: 0,
      totalAdmins: 0,
      totalPasseios: 0,
      agendamentosHoje: 0,
      agendamentosMes: 0,
      receitaMes: 0,
      agendamentosPendentes: 0,
    };
    
    return NextResponse.json(defaultStats, { status: 200 });
  }
}