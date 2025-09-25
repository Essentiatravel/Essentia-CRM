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

export async function GET() {
  try {
    const todosPasseios = await db.select().from(passeios);
    return NextResponse.json(todosPasseios);
  } catch (error) {
    console.error('Erro ao buscar passeios:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const passeioData = await request.json();

    const novoPasseioId = `passeio_${Date.now()}`;
    
    const novoPasseio = {
      id: novoPasseioId,
      nome: passeioData.name || passeioData.nome,
      descricao: passeioData.description || passeioData.descricao || passeioData.name || passeioData.nome || "Descrição não informada",
      preco: parseFloat(passeioData.price || passeioData.preco) || 0,
      duracao: `${passeioData.duration || passeioData.duracao}h`,
      categoria: passeioData.type || passeioData.categoria,
      imagens: JSON.stringify(passeioData.images || []),
      inclusoes: JSON.stringify(passeioData.includedItems || []),
      idiomas: JSON.stringify(passeioData.languages || []),
      capacidadeMaxima: parseInt(passeioData.maxPeople) || 20,
      ativo: 1
    };

    await db.insert(passeios).values(novoPasseio);

    return NextResponse.json({
      id: novoPasseio.id,
      message: 'Passeio criado com sucesso',
      passeio: novoPasseio
    });
  } catch (error) {
    console.error('Erro ao criar passeio:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}



