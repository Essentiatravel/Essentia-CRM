import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { agendamentos, passeios, clientes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const reservaId = params.id;

    // Buscar dados completos da reserva
    const reserva = await db
      .select({
        agendamentoId: agendamentos.id,
        passeioNome: passeios.nome,
        passeioDescricao: passeios.descricao,
        passeioPreco: passeios.preco,
        dataPasseio: agendamentos.dataPasseio,
        numeroPessoas: agendamentos.numeroPessoas,
        valorTotal: agendamentos.valorTotal,
        valorComissao: agendamentos.valorComissao,
        status: agendamentos.status,
        observacoes: agendamentos.observacoes,
        criadoEm: agendamentos.criadoEm,
        clienteNome: clientes.nome,
        clienteEmail: clientes.email,
        clienteTelefone: clientes.telefone
      })
      .from(agendamentos)
      .leftJoin(passeios, eq(agendamentos.passeioId, passeios.id))
      .leftJoin(clientes, eq(agendamentos.clienteId, clientes.id))
      .where(eq(agendamentos.id, reservaId))
      .limit(1);

    if (reserva.length === 0) {
      return NextResponse.json({ error: 'Reserva não encontrada' }, { status: 404 });
    }

    const dadosReserva = reserva[0];

    // Gerar HTML do recibo
    const reciboHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Recibo - ${dadosReserva.passeioNome}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #f97316; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { color: #f97316; font-size: 28px; font-weight: bold; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
        .info-card { border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; }
        .info-title { font-weight: bold; color: #374151; margin-bottom: 10px; }
        .total { text-align: center; background: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 30px; }
        .total-value { font-size: 24px; font-weight: bold; color: #f97316; }
        .footer { text-align: center; margin-top: 40px; color: #6b7280; font-size: 14px; }
        @media print { body { margin: 0; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">ESSENTIA TOURS</div>
        <p>Recibo de Reserva #${dadosReserva.agendamentoId.substring(0, 8)}</p>
      </div>

      <div class="info-grid">
        <div class="info-card">
          <div class="info-title">Informações do Passeio</div>
          <p><strong>Passeio:</strong> ${dadosReserva.passeioNome}</p>
          <p><strong>Data:</strong> ${new Date(dadosReserva.dataPasseio).toLocaleDateString('pt-BR')}</p>
          <p><strong>Pessoas:</strong> ${dadosReserva.numeroPessoas}</p>
          <p><strong>Status:</strong> ${dadosReserva.status}</p>
        </div>

        <div class="info-card">
          <div class="info-title">Dados do Cliente</div>
          <p><strong>Nome:</strong> ${dadosReserva.clienteNome}</p>
          <p><strong>Email:</strong> ${dadosReserva.clienteEmail}</p>
          <p><strong>Telefone:</strong> ${dadosReserva.clienteTelefone || 'Não informado'}</p>
          <p><strong>Data da Reserva:</strong> ${dadosReserva.criadoEm ? new Date(dadosReserva.criadoEm).toLocaleDateString('pt-BR') : 'Não informado'}</p>
        </div>
      </div>

      ${dadosReserva.observacoes ? `
      <div class="info-card">
        <div class="info-title">Observações</div>
        <p>${dadosReserva.observacoes}</p>
      </div>
      ` : ''}

      <div class="total">
        <p>Valor Total da Reserva</p>
        <div class="total-value">R$ ${dadosReserva.valorTotal.toFixed(2)}</div>
      </div>

      <div class="footer">
        <p>Este é um recibo oficial da Essentia Tours</p>
        <p>Em caso de dúvidas, entre em contato conosco</p>
        <p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
      </div>
    </body>
    </html>
    `;

    return new Response(reciboHTML, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="recibo-${reservaId}.html"`
      }
    });
    
  } catch (error) {
    console.error('Erro ao gerar recibo:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
