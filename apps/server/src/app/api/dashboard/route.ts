import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Buscar estatísticas usando PostgreSQL/Drizzle
    const totalUsersResult = await db.select({ count: sql<number>`count(*)` }).from(users);
    const totalClientes = await db.select({ count: sql<number>`count(*)` }).from(users).where(sql`user_type = 'cliente'`);
    const totalGuias = await db.select({ count: sql<number>`count(*)` }).from(users).where(sql`user_type = 'guia'`);
    const totalAdmins = await db.select({ count: sql<number>`count(*)` }).from(users).where(sql`user_type = 'admin'`);

    const stats = {
      totalClientes: totalClientes[0]?.count || 0,
      totalGuias: totalGuias[0]?.count || 0,
      totalAdmins: totalAdmins[0]?.count || 0,
      totalPasseios: 0, // Por enquanto, sem tabela de passeios
      agendamentosHoje: 0, // Por enquanto, sem tabela de agendamentos
      agendamentosMes: 0, // Por enquanto, sem tabela de agendamentos
      receitaMes: 0 // Por enquanto, sem dados de receita
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas do dashboard:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}