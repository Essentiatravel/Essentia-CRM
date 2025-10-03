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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('🔍 Buscando passeio no banco:', id);
    
    const passeio = await db.select().from(passeios).where(eq(passeios.id, id)).limit(1);
    
    if (passeio.length === 0) {
      console.log('❌ Passeio não encontrado:', id);
      return NextResponse.json({ error: 'Passeio não encontrado' }, { status: 404 });
    }

    // Garantir que campos JSON sejam arrays
    const passeioFormatado = {
      ...passeio[0],
      imagens: Array.isArray(passeio[0].imagens) ? passeio[0].imagens : 
               (typeof passeio[0].imagens === 'string' ? JSON.parse(passeio[0].imagens) : []),
      inclusoes: Array.isArray(passeio[0].inclusoes) ? passeio[0].inclusoes :
                 (typeof passeio[0].inclusoes === 'string' ? JSON.parse(passeio[0].inclusoes) : []),
      idiomas: Array.isArray(passeio[0].idiomas) ? passeio[0].idiomas :
               (typeof passeio[0].idiomas === 'string' ? JSON.parse(passeio[0].idiomas) : []),
    };

    console.log('✅ Passeio encontrado e formatado:', passeioFormatado);
    return NextResponse.json(passeioFormatado);
  } catch (error) {
    console.error('❌ Erro ao buscar passeio:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// PUT - Atualizar um passeio
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const passeioData = await request.json();
    
    console.log('🔄 Atualizando passeio:', id, passeioData);

    const dadosAtualizados = {
      nome: passeioData.name || passeioData.nome,
      descricao: passeioData.description || passeioData.descricao || "Descrição não informada",
      preco: parseFloat(passeioData.price || passeioData.preco) || 0,
      duracao: `${passeioData.duration || passeioData.duracao}h`,
      categoria: passeioData.type || passeioData.categoria,
      // Armazenar como arrays nativos (Drizzle converte para JSONB)
      imagens: passeioData.images || [],
      inclusoes: passeioData.includedItems || [],
      idiomas: passeioData.languages || [],
      capacidadeMaxima: parseInt(passeioData.maxPeople) || 20,
      ativo: passeioData.status === 'Ativo' ? 1 : 0,
      atualizadoEm: new Date()
    };

    const resultado = await db
      .update(passeios)
      .set(dadosAtualizados)
      .where(eq(passeios.id, id))
      .returning();

    if (resultado.length === 0) {
      return NextResponse.json(
        { error: 'Passeio não encontrado para atualização' },
        { status: 404 }
      );
    }

    console.log('✅ Passeio atualizado com sucesso:', resultado[0]);

    return NextResponse.json({
      message: 'Passeio atualizado com sucesso',
      passeio: resultado[0]
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar passeio:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Excluir um passeio
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    console.log('🗑️ Excluindo passeio:', id);

    const resultado = await db
      .delete(passeios)
      .where(eq(passeios.id, id))
      .returning();

    if (resultado.length === 0) {
      return NextResponse.json(
        { error: 'Passeio não encontrado para exclusão' },
        { status: 404 }
      );
    }

    console.log('✅ Passeio excluído com sucesso');

    return NextResponse.json({
      message: 'Passeio excluído com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao excluir passeio:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}