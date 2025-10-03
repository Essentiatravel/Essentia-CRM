import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { clientes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { senhaAtual, novaSenha, clienteId } = await request.json();
    
    if (!senhaAtual || !novaSenha || !clienteId) {
      return NextResponse.json({ error: 'Dados obrigatórios em falta' }, { status: 400 });
    }

    // Buscar cliente
    const cliente = await db.select().from(clientes)
      .where(eq(clientes.id, clienteId))
      .limit(1);

    if (cliente.length === 0) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 });
    }

    // Verificar senha atual (modo teste - sem hash)
    const senhaCorreta = senhaAtual === cliente[0].passwordHash;
    if (!senhaCorreta) {
      return NextResponse.json({ error: 'Senha atual incorreta' }, { status: 400 });
    }

    // Atualizar senha no banco (modo teste - sem hash)
    await db.update(clientes)
      .set({ 
        passwordHash: novaSenha, // Em produção usar hash
        atualizadoEm: new Date()
      })
      .where(eq(clientes.id, clienteId));

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}