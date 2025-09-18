import { NextResponse } from 'next/server';
import { getAllAgendamentos, getAgendamentosByStatus, createAgendamento } from '@/lib/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let agendamentos;
    if (status) {
      agendamentos = await getAgendamentosByStatus(status);
    } else {
      agendamentos = await getAllAgendamentos();
    }

    return NextResponse.json(agendamentos);
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const agendamentoData = await request.json();
    const id = await createAgendamento(agendamentoData);
    return NextResponse.json({ id, message: 'Agendamento criado com sucesso' });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}



