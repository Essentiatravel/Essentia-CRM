import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { clientes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const ativos = await db
      .select()
      .from(clientes)
      .where(eq(clientes.status, 'ativo'));

    return NextResponse.json(ativos);
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    return NextResponse.json({ error: 'Erro ao listar clientes' }, { status: 500 });
  }
}
