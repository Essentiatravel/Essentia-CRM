import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const database = await getDatabase();
    const body = await request.json();
    
    const { status } = body;

    await database.run(`
      UPDATE agendamentos 
      SET 
        status = ?,
        atualizado_em = DATETIME('now')
      WHERE id = ?
    `, [status, params.id]);

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error('Erro ao atualizar status do agendamento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}





