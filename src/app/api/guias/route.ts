import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { guias } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const ativos = await db
      .select()
      .from(guias)
      .where(eq(guias.status, 'ativo'));

    return NextResponse.json(ativos);
  } catch (error) {
    console.error('Erro ao listar guias:', error);
    return NextResponse.json({ error: 'Erro ao listar guias' }, { status: 500 });
  }
}
