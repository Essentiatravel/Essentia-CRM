import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { clientes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(request: Request) {
  try {
    const { nome, telefone, cpf, endereco, clienteId } = await request.json();
    
    if (!clienteId) {
      return NextResponse.json({ error: 'Cliente ID obrigatório' }, { status: 400 });
    }

    // Atualizar dados do cliente
    await db.update(clientes)
      .set({
        nome: nome || null,
        telefone: telefone || null,
        cpf: cpf || null,
        endereco: endereco ? JSON.stringify({ endereco }) : null,
        atualizadoEm: new Date()
      })
      .where(eq(clientes.id, clienteId));

    // Buscar dados atualizados
    const clienteAtualizado = await db.select().from(clientes)
      .where(eq(clientes.id, clienteId))
      .limit(1);

    return NextResponse.json({ 
      success: true, 
      cliente: clienteAtualizado[0] 
    });
    
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clienteId = searchParams.get('clienteId');
    
    if (!clienteId) {
      return NextResponse.json({ error: 'Cliente ID obrigatório' }, { status: 400 });
    }

    const cliente = await db.select().from(clientes)
      .where(eq(clientes.id, clienteId))
      .limit(1);

    if (cliente.length === 0) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 });
    }

    // Retornar dados do cliente (clientes não têm passwordHash)
    return NextResponse.json(cliente[0]);
    
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}