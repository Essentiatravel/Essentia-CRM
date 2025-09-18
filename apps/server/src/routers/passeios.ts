import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { passeios } from "../db/schema";
import { publicProcedure, router } from "../lib/trpc";

const passeioSchema = z.object({
  nome: z.string().min(1),
  descricao: z.string().min(1),
  preco: z.number().positive(),
  duracao: z.string().min(1),
  categoria: z.string().min(1),
  imagens: z.array(z.string()).optional(),
  inclusoes: z.array(z.string()).optional(),
  idiomas: z.array(z.string()).optional(),
  capacidadeMaxima: z.number().int().positive().optional(),
});

export const passeiosRouter = router({
  // Listar todos os passeios
  list: publicProcedure.query(async () => {
    const result = await db.select().from(passeios).where(eq(passeios.ativo, true));
    return result.map(passeio => ({
      ...passeio,
      imagens: passeio.imagens ? JSON.parse(passeio.imagens) : [],
      inclusoes: passeio.inclusoes ? JSON.parse(passeio.inclusoes) : [],
      idiomas: passeio.idiomas ? JSON.parse(passeio.idiomas) : [],
    }));
  }),

  // Buscar passeio por ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const result = await db.select().from(passeios).where(eq(passeios.id, input.id));
      if (result.length === 0) return null;
      
      const passeio = result[0];
      return {
        ...passeio,
        imagens: passeio.imagens ? JSON.parse(passeio.imagens) : [],
        inclusoes: passeio.inclusoes ? JSON.parse(passeio.inclusoes) : [],
        idiomas: passeio.idiomas ? JSON.parse(passeio.idiomas) : [],
      };
    }),

  // Criar novo passeio
  create: publicProcedure
    .input(passeioSchema)
    .mutation(async ({ input }) => {
      const id = crypto.randomUUID();
      const novoPasseio = {
        id,
        ...input,
        imagens: input.imagens ? JSON.stringify(input.imagens) : null,
        inclusoes: input.inclusoes ? JSON.stringify(input.inclusoes) : null,
        idiomas: input.idiomas ? JSON.stringify(input.idiomas) : null,
      };

      await db.insert(passeios).values(novoPasseio);
      return { id, ...input };
    }),

  // Atualizar passeio
  update: publicProcedure
    .input(z.object({
      id: z.string(),
      data: passeioSchema.partial(),
    }))
    .mutation(async ({ input }) => {
      const updateData = {
        ...input.data,
        imagens: input.data.imagens ? JSON.stringify(input.data.imagens) : undefined,
        inclusoes: input.data.inclusoes ? JSON.stringify(input.data.inclusoes) : undefined,
        idiomas: input.data.idiomas ? JSON.stringify(input.data.idiomas) : undefined,
        atualizadoEm: new Date().toISOString(),
      };

      await db.update(passeios).set(updateData).where(eq(passeios.id, input.id));
      return { success: true };
    }),

  // Deletar passeio (soft delete)
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db.update(passeios).set({ 
        ativo: false,
        atualizadoEm: new Date().toISOString(),
      }).where(eq(passeios.id, input.id));
      return { success: true };
    }),
});