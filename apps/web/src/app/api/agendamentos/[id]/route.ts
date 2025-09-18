import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const database = await getDatabase();
    const body = await request.json();

    const {
      passeioId,
      clienteId,
      guiaId,
      dataPasseio,
      numeroPessoas,
      valorTotal,
      percentualComissao,
      observacoes
    } = body;

    // Calcular valor da comissão
    const valorComissao = valorTotal * (percentualComissao / 100);

    await database.run(`
      UPDATE agendamentos
      SET
        passeio_id = ?,
        cliente_id = ?,
        guia_id = ?,
        data_passeio = ?,
        numero_pessoas = ?,
        valor_total = ?,
        valor_comissao = ?,
        percentual_comissao = ?,
        observacoes = ?,
        atualizado_em = DATETIME('now')
      WHERE id = ?
    `, [
      passeioId,
      clienteId,
      guiaId,
      dataPasseio,
      numeroPessoas,
      valorTotal,
      valorComissao,
      percentualComissao,
      observacoes,
      params.id
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const database = await getDatabase();

    await database.run(`
      DELETE FROM agendamentos
      WHERE id = ?
    `, [params.id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao remover agendamento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
