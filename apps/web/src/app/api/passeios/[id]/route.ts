import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';

// Schema inline para evitar problemas de import
import { pgTable, text, integer, real, timestamp, varchar, jsonb } from "drizzle-orm/pg-core";

const passeios = pgTable("passeios", {
  id: varchar("id").primaryKey(),
  nome: varchar("nome").notNull(),
  descricao: text("descricao").notNull(),
  preco: real("preco").notNull(),
  duracao: varchar("duracao").notNull(),
  categoria: varchar("categoria").notNull(),
  imagens: jsonb("imagens"),
  inclusoes: jsonb("inclusoes"),
  idiomas: jsonb("idiomas"),
  capacidadeMaxima: integer("capacidade_maxima").default(20),
  ativo: integer("ativo").default(1),
  criadoEm: timestamp("criado_em").defaultNow(),
  atualizadoEm: timestamp("atualizado_em").defaultNow(),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const passeio = await db.select().from(passeios).where(eq(passeios.id, params.id)).limit(1);
    
    if (passeio.length === 0) {
      return NextResponse.json({ error: 'Passeio não encontrado' }, { status: 404 });
    }

    return NextResponse.json(passeio[0]);
  } catch (error) {
    console.error('Erro ao buscar passeio:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}